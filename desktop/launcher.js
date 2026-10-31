/* Desktop launcher. Bundled into a single executable (see scripts/build-exe.js), it serves the app
   from embedded assets on 127.0.0.1 and opens it in the default browser.
   It can also run unbundled for development: `node desktop/launcher.js` serves from the repo. */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

let sea = null;
try { sea = require('node:sea'); } catch (e) { sea = null; }
const bundled = !!(sea && sea.isSea());
const ROOT = path.join(__dirname, '..');

// A fixed port keeps the browser origin stable, so saved progress (localStorage) is found again on every launch.
const BASE_PORT = Number(process.env.SECPLUS_PORT) || 47801;
const MAX_TRIES = 10;
const HEALTH = '/__secplus_health';
const NO_BROWSER = process.argv.includes('--no-browser');

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };
let activePort = 0;

function readAsset(rel) {
  if (bundled) {
    try { return Buffer.from(sea.getAsset(rel)); } catch (e) { return null; }
  }
  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT + path.sep)) return null;
  try { return fs.readFileSync(file); } catch (e) { return null; }
}

function plain(res, code, body) { res.writeHead(code, { 'Content-Type': 'text/plain' }); res.end(body); }

function handler(req, res) {
  // Accept only our own host names (defends against DNS rebinding).
  const hosts = ['127.0.0.1:' + activePort, 'localhost:' + activePort];
  if (hosts.indexOf(req.headers.host) < 0) { plain(res, 403, 'Forbidden'); return; }
  let rel;
  try { rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname).replace(/^\/+/, ''); } catch (e) { plain(res, 400, 'Bad request'); return; }
  if (rel === HEALTH.slice(1)) { plain(res, 200, 'secplus-desktop'); return; }
  if (req.method === 'POST' && (rel === '__secplus_ping' || rel === '__secplus_quit')) {
    // Only the app's own pages may send these; a cross-site page would carry a different Origin.
    if (hosts.map((h) => 'http://' + h).indexOf(req.headers.origin) < 0) { plain(res, 403, 'Forbidden'); return; }
    if (rel === '__secplus_quit') { plain(res, 200, 'bye'); console.log('Quit from the app. Goodbye.'); setTimeout(() => process.exit(0), 200); return; }
    lastPing = Date.now(); sawPage = true;
    plain(res, 200, 'ok'); return;
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') { plain(res, 405, 'Method not allowed'); return; }
  if (rel === '') { lastPing = Date.now(); sawPage = true; }
  if (rel === '') rel = 'index.html';
  if (rel.split('/').includes('..')) { res.writeHead(403); res.end('Forbidden'); return; }
  const data = readAsset(rel);
  if (!data) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); return; }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(rel)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  res.end(data);
}

// Heartbeat bookkeeping, used when the app runs in the default browser (no window to watch).
const HEARTBEAT_TIMEOUT = 10 * 60 * 1000; // stop after 10 minutes without an open app page
const FIRST_CONTACT_TIMEOUT = 5 * 60 * 1000;
const QUICK_EXIT = 5000; // a browser that exits this fast handed the window to an already-running instance
const started = Date.now();
let lastPing = 0;
let sawPage = false;

// Chromium-based browsers that support --app windows, in order of preference.
function appBrowser() {
  if (process.env.SECPLUS_BROWSER) return process.env.SECPLUS_BROWSER;
  if (process.platform !== 'win32') return null;
  const roots = [process.env['ProgramFiles(x86)'], process.env.ProgramFiles, process.env.LOCALAPPDATA].filter(Boolean);
  const rel = ['Microsoft\\Edge\\Application\\msedge.exe', 'Google\\Chrome\\Application\\chrome.exe', 'BraveSoftware\\Brave-Browser\\Application\\brave.exe'];
  for (const r of rel) for (const root of roots) { const p = path.join(root, r); if (fs.existsSync(p)) return p; }
  return null;
}

function profileDir() {
  const base = process.platform === 'win32' ? (process.env.LOCALAPPDATA || require('os').homedir()) : path.join(require('os').homedir(), '.local', 'share');
  const dir = path.join(base, process.platform === 'win32' ? 'SecurityPlusStudyLab' : 'security-plus-study-lab', 'Browser');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function openDefaultBrowser(url) {
  const cmd = process.platform === 'win32' ? ['explorer.exe', [url]] : process.platform === 'darwin' ? ['open', [url]] : ['xdg-open', [url]];
  try {
    const child = spawn(cmd[0], cmd[1], { detached: true, stdio: 'ignore', windowsHide: true });
    child.on('error', () => console.log('Open this address in your browser: ' + url));
    child.unref();
  } catch (e) {
    console.log('Open this address in your browser: ' + url);
  }
}

function watchHeartbeat() {
  setInterval(() => {
    const now = Date.now();
    if (sawPage && now - lastPing > HEARTBEAT_TIMEOUT) { console.log('No open app page for 10 minutes. Goodbye.'); process.exit(0); }
    if (!sawPage && now - started > FIRST_CONTACT_TIMEOUT) { console.log('The app page was never opened. Goodbye.'); process.exit(0); }
  }, 5000);
}

// Opens the app in its own window (Edge, Chrome or Brave with a dedicated profile) and exits when that
// window closes. Falls back to the default browser, where the app stops after its page has been closed a while.
function openBrowser(url, alreadyRunning) {
  if (NO_BROWSER) return;
  const exe = appBrowser();
  if (exe) {
    const args = ['--app=' + url, '--user-data-dir=' + profileDir(), '--no-first-run', '--no-default-browser-check'];
    const t0 = Date.now();
    let child;
    try { child = spawn(exe, args, { stdio: 'ignore', windowsHide: false }); } catch (e) { child = null; }
    if (child) {
      console.log('Opening Security+ Study Lab in its own window.');
      child.on('error', () => { openDefaultBrowser(url); if (!alreadyRunning) watchHeartbeat(); });
      child.on('exit', () => {
        if (alreadyRunning) return;
        if (Date.now() - t0 <= QUICK_EXIT) { watchHeartbeat(); return; }
        console.log('The app window was closed. Goodbye.');
        process.exit(0);
      });
      return;
    }
  }
  openDefaultBrowser(url);
  if (!alreadyRunning) watchHeartbeat();
}

// Is an instance of this app already serving on the port?
function isOurs(port) {
  return new Promise((resolve) => {
    const req = http.get({ host: '127.0.0.1', port, path: HEALTH, timeout: 1500 }, (res) => {
      let body = '';
      res.on('data', (c) => { body += c; });
      res.on('end', () => resolve(body === 'secplus-desktop'));
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

function listen(port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(handler);
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function main() {
  for (let i = 0; i < MAX_TRIES; i++) {
    const port = BASE_PORT + i;
    const url = 'http://127.0.0.1:' + port + '/';
    try {
      activePort = port;
      await listen(port);
      console.log('Security+ Study Lab is running at ' + url);
      console.log('Keep this window open while you study. The app stops when you close its window,');
      console.log('or when you choose Settings, then Quit, in the app.');
      openBrowser(url, false);
      return;
    } catch (err) {
      if (err.code !== 'EADDRINUSE') throw err;
      if (await isOurs(port)) {
        console.log('Security+ Study Lab is already running at ' + url + ' - opening it.');
        openBrowser(url, true);
        setTimeout(() => process.exit(0), 1500);
        return;
      }
      // Another program owns this port; try the next one.
    }
  }
  console.error('Could not find a free port between ' + BASE_PORT + ' and ' + (BASE_PORT + MAX_TRIES - 1) + '. Close other programs using those ports and try again.');
  process.exitCode = 1;
}

// When started by double-clicking, the console window closes on exit; keep errors readable for a while.
function holdOnError() { if (bundled && process.exitCode) setTimeout(() => {}, 30000); }

process.on('SIGINT', () => process.exit(0));
main().then(holdOnError, (e) => { console.error(e); process.exitCode = 1; holdOnError(); });
