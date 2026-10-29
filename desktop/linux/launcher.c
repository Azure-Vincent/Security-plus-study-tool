/* Security+ Study Lab — Linux launcher used inside the AppImage.
 *
 * Serves the bundled app from <exe dir>/../share/security-plus-study-lab/app on 127.0.0.1 and opens it:
 *   1. In an app window of a Chromium-based browser (Chrome, Chromium, Edge, Brave, Vivaldi) using a
 *      dedicated profile, if one is installed. The launcher exits when that window closes.
 *   2. Otherwise in the default browser via xdg-open. The launcher exits after the page stops sending
 *      heartbeats for 10 minutes, or when the user chooses Quit in Settings.
 * The port is fixed (47801, then up to 47810) so the browser origin, and the progress saved for it, stay the same.
 *
 * Options: --no-browser (serve only), --port N.  Environment: SECPLUS_BROWSER=command to force a browser.
 * Build: gcc -static -Os -s -o security-plus-study-lab launcher.c
 */
#define _GNU_SOURCE
#include <arpa/inet.h>
#include <errno.h>
#include <fcntl.h>
#include <limits.h>
#include <netinet/in.h>
#include <poll.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <sys/time.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <time.h>
#include <unistd.h>

#define BASE_PORT 47801
#define MAX_TRIES 10
#define HEARTBEAT_TIMEOUT 600 /* seconds without a page heartbeat before exiting (default-browser mode) */
#define FIRST_CONTACT_TIMEOUT 300 /* seconds to wait for the first page load */
#define QUICK_EXIT 5          /* an app window that exits this fast handed off to an existing browser */

static char app_root[PATH_MAX];
static int port;
static time_t last_ping;
static int saw_page;
static volatile sig_atomic_t stop;

static void on_signal(int s) { (void)s; stop = 1; }

static const char *mime(const char *path) {
  const char *dot = strrchr(path, '.');
  if (!dot) return "application/octet-stream";
  if (!strcmp(dot, ".html")) return "text/html; charset=utf-8";
  if (!strcmp(dot, ".js")) return "text/javascript; charset=utf-8";
  if (!strcmp(dot, ".css")) return "text/css; charset=utf-8";
  if (!strcmp(dot, ".json")) return "application/json";
  if (!strcmp(dot, ".svg")) return "image/svg+xml";
  if (!strcmp(dot, ".png")) return "image/png";
  if (!strcmp(dot, ".woff2")) return "font/woff2";
  if (!strcmp(dot, ".txt")) return "text/plain; charset=utf-8";
  return "application/octet-stream";
}

static void send_all(int fd, const char *buf, size_t len) {
  while (len > 0) {
    ssize_t n = send(fd, buf, len, MSG_NOSIGNAL);
    if (n <= 0) { if (n < 0 && errno == EINTR) continue; return; }
    buf += n; len -= (size_t)n;
  }
}

static void respond(int fd, int code, const char *status, const char *type, const char *body) {
  char head[512];
  size_t blen = body ? strlen(body) : 0;
  int n = snprintf(head, sizeof head,
                   "HTTP/1.1 %d %s\r\nContent-Type: %s\r\nContent-Length: %zu\r\nCache-Control: no-cache\r\n"
                   "X-Content-Type-Options: nosniff\r\nConnection: close\r\n\r\n",
                   code, status, type, blen);
  send_all(fd, head, (size_t)n);
  if (blen) send_all(fd, body, blen);
}

static int hexval(char c) {
  if (c >= '0' && c <= '9') return c - '0';
  if (c >= 'a' && c <= 'f') return c - 'a' + 10;
  if (c >= 'A' && c <= 'F') return c - 'A' + 10;
  return -1;
}

/* Percent-decodes in place. Returns 0 on malformed input or an encoded NUL. */
static int url_decode(char *s) {
  char *o = s;
  for (; *s; s++) {
    if (*s == '%') {
      int a = hexval(s[1]), b = a < 0 ? -1 : hexval(s[2]);
      if (a < 0 || b < 0 || (a == 0 && b == 0)) return 0;
      *o++ = (char)(a * 16 + b); s += 2;
    } else *o++ = *s;
  }
  *o = 0;
  return 1;
}

/* Returns the value of a request header (case-insensitive name), copied into out. */
static int header(const char *req, const char *name, char *out, size_t outlen) {
  size_t nl = strlen(name);
  const char *p = strstr(req, "\r\n");
  while (p && p[2] && !(p[2] == '\r' && p[3] == '\n')) {
    p += 2;
    if (!strncasecmp(p, name, nl) && p[nl] == ':') {
      const char *v = p + nl + 1, *e = strstr(v, "\r\n");
      while (*v == ' ') v++;
      size_t len = e ? (size_t)(e - v) : strlen(v);
      if (len >= outlen) len = outlen - 1;
      memcpy(out, v, len); out[len] = 0;
      return 1;
    }
    p = strstr(p, "\r\n");
  }
  return 0;
}

static void serve_file(int fd, const char *rel, int head_only) {
  char full[PATH_MAX], real[PATH_MAX];
  if (snprintf(full, sizeof full, "%s/%s", app_root, rel) >= (int)sizeof full) { respond(fd, 414, "URI Too Long", "text/plain", "Too long"); return; }
  /* realpath + prefix check stops any escape from the app directory (including via symlinks). */
  if (!realpath(full, real) || strncmp(real, app_root, strlen(app_root)) || real[strlen(app_root)] != '/') {
    respond(fd, 404, "Not Found", "text/plain", "Not found"); return;
  }
  int f = open(real, O_RDONLY | O_CLOEXEC);
  struct stat st;
  if (f < 0 || fstat(f, &st) < 0 || !S_ISREG(st.st_mode)) { if (f >= 0) close(f); respond(fd, 404, "Not Found", "text/plain", "Not found"); return; }
  char head[512];
  int n = snprintf(head, sizeof head,
                   "HTTP/1.1 200 OK\r\nContent-Type: %s\r\nContent-Length: %lld\r\nCache-Control: no-cache\r\n"
                   "X-Content-Type-Options: nosniff\r\nConnection: close\r\n\r\n",
                   mime(real), (long long)st.st_size);
  send_all(fd, head, (size_t)n);
  if (!head_only) {
    char buf[65536];
    ssize_t r;
    while ((r = read(f, buf, sizeof buf)) > 0) send_all(fd, buf, (size_t)r);
  }
  close(f);
}

static void handle(int fd) {
  char req[8192];
  size_t got = 0;
  while (got < sizeof req - 1) {
    ssize_t n = recv(fd, req + got, sizeof req - 1 - got, 0);
    if (n <= 0) return;
    got += (size_t)n; req[got] = 0;
    if (strstr(req, "\r\n\r\n")) break;
  }
  if (!strstr(req, "\r\n\r\n")) { respond(fd, 431, "Request Header Fields Too Large", "text/plain", "Too large"); return; }

  char method[8] = {0}, target[4096] = {0};
  if (sscanf(req, "%7s %4095s", method, target) != 2) { respond(fd, 400, "Bad Request", "text/plain", "Bad request"); return; }

  /* Accept only our own host names (defends against DNS rebinding). */
  char host[256], want1[64], want2[64];
  snprintf(want1, sizeof want1, "127.0.0.1:%d", port);
  snprintf(want2, sizeof want2, "localhost:%d", port);
  if (!header(req, "Host", host, sizeof host) || (strcmp(host, want1) && strcmp(host, want2))) {
    respond(fd, 403, "Forbidden", "text/plain", "Forbidden"); return;
  }

  char *q = strpbrk(target, "?#");
  if (q) *q = 0;
  if (!url_decode(target) || target[0] != '/') { respond(fd, 400, "Bad Request", "text/plain", "Bad request"); return; }

  int is_get = !strcmp(method, "GET"), is_head = !strcmp(method, "HEAD"), is_post = !strcmp(method, "POST");
  if (!strcmp(target, "/__secplus_health") && (is_get || is_head)) { respond(fd, 200, "OK", "text/plain", "secplus-desktop"); return; }
  if (is_post && (!strcmp(target, "/__secplus_ping") || !strcmp(target, "/__secplus_quit"))) {
    /* Only the app's own pages may send these (a cross-site page would carry a different Origin). */
    char origin[256], o1[80], o2[80];
    snprintf(o1, sizeof o1, "http://%s", want1);
    snprintf(o2, sizeof o2, "http://%s", want2);
    if (!header(req, "Origin", origin, sizeof origin) || (strcmp(origin, o1) && strcmp(origin, o2))) {
      respond(fd, 403, "Forbidden", "text/plain", "Forbidden"); return;
    }
    if (!strcmp(target, "/__secplus_quit")) { respond(fd, 200, "OK", "text/plain", "bye"); stop = 1; return; }
    last_ping = time(NULL); saw_page = 1;
    respond(fd, 200, "OK", "text/plain", "ok");
    return;
  }
  if (!is_get && !is_head) { respond(fd, 405, "Method Not Allowed", "text/plain", "Method not allowed"); return; }

  /* Reject any path segment of "..", and hidden files. */
  for (char *p = target; *p; p++) {
    if (p[0] == '/' && p[1] == '.') { respond(fd, 404, "Not Found", "text/plain", "Not found"); return; }
  }
  const char *rel = target + 1;
  if (!*rel) { rel = "index.html"; last_ping = time(NULL); saw_page = 1; }
  serve_file(fd, rel, is_head);
}

/* Is another instance of this app already serving on the port? */
static int is_ours(int p) {
  int s = socket(AF_INET, SOCK_STREAM | SOCK_CLOEXEC, 0);
  if (s < 0) return 0;
  struct timeval tv = {2, 0};
  setsockopt(s, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof tv);
  setsockopt(s, SOL_SOCKET, SO_SNDTIMEO, &tv, sizeof tv);
  struct sockaddr_in a = {0};
  a.sin_family = AF_INET; a.sin_port = htons((uint16_t)p); a.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
  int ok = 0;
  if (!connect(s, (struct sockaddr *)&a, sizeof a)) {
    char req[128], buf[1024] = {0};
    int n = snprintf(req, sizeof req, "GET /__secplus_health HTTP/1.1\r\nHost: 127.0.0.1:%d\r\nConnection: close\r\n\r\n", p);
    send_all(s, req, (size_t)n);
    size_t got = 0; ssize_t r;
    while (got < sizeof buf - 1 && (r = recv(s, buf + got, sizeof buf - 1 - got, 0)) > 0) got += (size_t)r;
    ok = strstr(buf, "secplus-desktop") != NULL;
  }
  close(s);
  return ok;
}

static int find_in_path(const char *cmd, char *out, size_t outlen) {
  if (strchr(cmd, '/')) { if (access(cmd, X_OK) == 0) { snprintf(out, outlen, "%s", cmd); return 1; } return 0; }
  const char *path = getenv("PATH");
  if (!path) path = "/usr/local/bin:/usr/bin:/bin";
  char *dup = strdup(path), *save = NULL;
  for (char *d = strtok_r(dup, ":", &save); d; d = strtok_r(NULL, ":", &save)) {
    snprintf(out, outlen, "%s/%s", *d ? d : ".", cmd);
    if (access(out, X_OK) == 0) { free(dup); return 1; }
  }
  free(dup);
  return 0;
}

static pid_t spawn(char *const argv[]) {
  pid_t pid = fork();
  if (pid == 0) {
    setsid();
    int nul = open("/dev/null", O_RDWR);
    if (nul >= 0) { dup2(nul, 0); dup2(nul, 1); dup2(nul, 2); }
    execv(argv[0], argv);
    _exit(127);
  }
  return pid;
}

/* Starts a Chromium-based browser in app-window mode with a dedicated profile. Returns its pid or -1. */
static pid_t open_app_window(const char *url) {
  static const char *candidates[] = {"google-chrome", "google-chrome-stable", "chromium", "chromium-browser",
                                     "microsoft-edge", "microsoft-edge-stable", "brave-browser", "vivaldi-stable", NULL};
  char exe[PATH_MAX];
  const char *forced = getenv("SECPLUS_BROWSER");
  int found = 0;
  if (forced && *forced) found = find_in_path(forced, exe, sizeof exe);
  for (int i = 0; !found && candidates[i]; i++) found = find_in_path(candidates[i], exe, sizeof exe);
  if (!found) return -1;

  char profile[PATH_MAX], app_arg[512], prof_arg[PATH_MAX + 32];
  const char *data = getenv("XDG_DATA_HOME"), *home = getenv("HOME");
  if (data && *data) snprintf(profile, sizeof profile, "%s/security-plus-study-lab/browser", data);
  else snprintf(profile, sizeof profile, "%s/.local/share/security-plus-study-lab/browser", home ? home : "/tmp");
  char mk[PATH_MAX];
  snprintf(mk, sizeof mk, "%s", profile);
  for (char *p = mk + 1; *p; p++) if (*p == '/') { *p = 0; mkdir(mk, 0700); *p = '/'; }
  mkdir(mk, 0700);

  snprintf(app_arg, sizeof app_arg, "--app=%s", url);
  snprintf(prof_arg, sizeof prof_arg, "--user-data-dir=%s", profile);
  char *argv[] = {exe, app_arg, prof_arg, "--no-first-run", "--no-default-browser-check", "--class=SecurityPlusStudyLab", NULL};
  printf("Opening an app window with %s\n", exe);
  return spawn(argv);
}

static void open_default_browser(const char *url) {
  char exe[PATH_MAX];
  if (find_in_path("xdg-open", exe, sizeof exe)) {
    char *argv[] = {exe, (char *)url, NULL};
    spawn(argv);
  } else {
    printf("Open this address in your browser: %s\n", url);
  }
}

static int resolve_app_root(void) {
  char exe[PATH_MAX];
  ssize_t n = readlink("/proc/self/exe", exe, sizeof exe - 1);
  if (n <= 0) return 0;
  exe[n] = 0;
  char *slash = strrchr(exe, '/');
  if (!slash) return 0;
  *slash = 0;
  char guess[PATH_MAX + 64];
  snprintf(guess, sizeof guess, "%s/../share/security-plus-study-lab/app", exe);
  if (realpath(guess, app_root)) return 1;
  snprintf(guess, sizeof guess, "%s/app", exe); /* flat layout for development */
  return realpath(guess, app_root) != NULL;
}

int main(int argc, char **argv) {
  int no_browser = 0, want_port = BASE_PORT;
  for (int i = 1; i < argc; i++) {
    if (!strcmp(argv[i], "--no-browser")) no_browser = 1;
    else if (!strcmp(argv[i], "--port") && i + 1 < argc) want_port = atoi(argv[++i]);
    else if (!strcmp(argv[i], "--help")) { printf("Usage: %s [--no-browser] [--port N]\n", argv[0]); return 0; }
  }
  setvbuf(stdout, NULL, _IOLBF, 0);
  if (!resolve_app_root()) { fprintf(stderr, "Could not find the app files next to the launcher.\n"); return 1; }

  int srv = -1;
  for (int i = 0; i < MAX_TRIES; i++) {
    port = want_port + i;
    srv = socket(AF_INET, SOCK_STREAM | SOCK_CLOEXEC, 0);
    int one = 1;
    setsockopt(srv, SOL_SOCKET, SO_REUSEADDR, &one, sizeof one);
    struct sockaddr_in a = {0};
    a.sin_family = AF_INET; a.sin_port = htons((uint16_t)port); a.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
    if (!bind(srv, (struct sockaddr *)&a, sizeof a) && !listen(srv, 64)) break;
    int err = errno;
    close(srv); srv = -1;
    if (err != EADDRINUSE) { perror("Could not start the local server"); return 1; }
    if (is_ours(port)) {
      char url[64];
      snprintf(url, sizeof url, "http://127.0.0.1:%d/", port);
      printf("Security+ Study Lab is already running at %s\n", url);
      if (!no_browser && open_app_window(url) < 0) open_default_browser(url);
      return 0;
    }
  }
  if (srv < 0) { fprintf(stderr, "No free port between %d and %d. Close programs using those ports and try again.\n", want_port, want_port + MAX_TRIES - 1); return 1; }

  char url[64];
  snprintf(url, sizeof url, "http://127.0.0.1:%d/", port);
  printf("Security+ Study Lab is running at %s\n", url);

  struct sigaction sa = {0};
  sa.sa_handler = on_signal;
  sigaction(SIGINT, &sa, NULL);
  sigaction(SIGTERM, &sa, NULL);
  sigaction(SIGHUP, &sa, NULL);

  time_t started = time(NULL);
  pid_t win = -1;
  int heartbeat_mode = 1;
  if (!no_browser) {
    win = open_app_window(url);
    if (win > 0) heartbeat_mode = 0;
    else { open_default_browser(url); printf("Opened in your default browser. Choose Settings > Quit to close the app.\n"); }
  } else heartbeat_mode = 0;

  while (!stop) {
    struct pollfd pfd = {srv, POLLIN, 0};
    int r = poll(&pfd, 1, 1000);
    if (r > 0 && (pfd.revents & POLLIN)) {
      int c = accept4(srv, NULL, NULL, SOCK_CLOEXEC);
      if (c >= 0) {
        struct timeval tv = {5, 0};
        setsockopt(c, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof tv);
        setsockopt(c, SOL_SOCKET, SO_SNDTIMEO, &tv, sizeof tv);
        handle(c);
        shutdown(c, SHUT_WR);
        close(c);
      }
    }
    if (win > 0) {
      int status;
      pid_t done = waitpid(win, &status, WNOHANG);
      if (done == win) {
        if (time(NULL) - started <= QUICK_EXIT) {
          /* The browser handed the window to an already-running instance; fall back to heartbeats. */
          win = -1; heartbeat_mode = 1;
        } else {
          printf("The app window was closed. Goodbye.\n");
          break;
        }
      }
    }
    while (waitpid(-1, NULL, WNOHANG) > 0) { /* reap xdg-open and other helpers */ }
    time_t now = time(NULL);
    if (heartbeat_mode) {
      if (saw_page && now - last_ping > HEARTBEAT_TIMEOUT) { printf("No open app page for %d minutes. Goodbye.\n", HEARTBEAT_TIMEOUT / 60); break; }
      if (!saw_page && now - started > FIRST_CONTACT_TIMEOUT) { printf("The app page was never opened. Goodbye.\n"); break; }
    }
  }
  close(srv);
  return 0;
}
