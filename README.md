# Security+ Study Lab

A calm, focused study app for **CompTIA Security+ SY0-701**. It teaches each exam objective from the ground up, then gives you plenty of ways to practice: smart practice sets, endless drills, flashcards, term quizzes, hands-on labs (PBQs), timed mock exams and spaced review.

Everything runs locally. You don't need an account, a backend or a paid AI API.

## Exam version

| | |
|---|---|
| Exam | CompTIA Security+ **SY0-701** (V7), launched November 7, 2023 |
| Status (checked 2026-10-05) | Current live exam |
| Format | Up to 90 questions, 90 minutes, multiple-choice and performance-based; passing score 750 on a 100–900 scale |
| Domains | 1.0 General Security Concepts (12%) · 2.0 Threats, Vulnerabilities, and Mitigations (22%) · 3.0 Security Architecture (18%) · 4.0 Security Operations (28%) · 5.0 Security Program Management and Oversight (20%) |
| Next version | CompTIA has announced **SY0-801**. Published reports give an English launch around November 17, 2026 and SY0-701 English retirement on June 11, 2027. Confirm on comptia.org before you book. |

The version is shown in the side rail, at the bottom of the Today page and on the About page. To retarget the app to a future exam, update `js/objectives.js`.

## Downloads

There are three downloads, one per platform. Each runs the whole app on your own computer. It never connects to the internet and needs no installation.

| Platform | File | Size |
|---|---|---|
| Linux (x86_64) | `Security_Plus_Study_Lab-x86_64.AppImage` | about 1.5 MB |
| Windows 10/11 (x64) | `SecurityPlusStudyLab.exe` | about 83 MB (includes the Node.js runtime) |
| macOS (Apple silicon and Intel) | `SecurityPlusStudyLab-macOS.zip` | about 0.3 MB |

They are attached to each [GitHub release](../../releases). To publish them for a new version, push a tag such as `v1.0.2`, publish a release in the GitHub UI, or run the **Build downloads** workflow from the Actions tab and enter the new tag. The `Build downloads` workflow runs the tests, builds the three files and attaches them, with SHA-256 checksums in the release notes. To build them yourself, run `npm ci && npm run build:release`. This needs Node 20+, gcc, squashfs-tools, curl and python3, and leaves exactly those three files in `dist/`.

**Linux.** Make the file executable and run it:

```bash
chmod +x Security_Plus_Study_Lab-x86_64.AppImage
./Security_Plus_Study_Lab-x86_64.AppImage
```

- If Chrome, Chromium, Edge, Brave or Vivaldi is installed, the app opens in its own window and quits when you close it. Progress is saved in a separate browser profile in `~/.local/share/security-plus-study-lab/`.
- Otherwise it opens in your default browser. Choose **Settings → Quit** to stop it, or it stops by itself 10 minutes after you close the tab.
- If your system has no FUSE support, run it with `--appimage-extract-and-run`. Set `SECPLUS_BROWSER=firefox` (or any command) to choose the browser.

**Windows.** Double-click `SecurityPlusStudyLab.exe`. It opens the app in your default browser and keeps a small console window open while you study. Close that window, or choose **Settings → Quit**, to stop. The file isn't code-signed, so SmartScreen may show "Windows protected your PC"; choose **More info → Run anyway**.

**macOS.** Unzip the file and move **Security+ Study Lab** to your Applications folder (this keeps your progress in one place), then open it.

- If Chrome, Edge, Brave, Chromium or Vivaldi is installed, it opens in its own window with a dedicated profile in `~/Library/Application Support/Security Plus Study Lab/`. Otherwise it opens in your default browser.
- The app isn't signed by an Apple developer ID. The first time, macOS will say it can't verify the developer. Click **Done**, then open **System Settings → Privacy & Security** and choose **Open Anyway**. On macOS 14 and earlier, you can instead Control-click the app, choose **Open**, then confirm.
- The app is plain HTML inside a standard `.app` bundle with a small launcher script, so it runs on both Apple silicon and Intel Macs.

### Other ways to run it

**Option 1: open the file.** Double-click `index.html`. The app works from `file://` with no server.

**Option 2: local server (recommended).** Requires Node.js 18 or later and has no dependencies:

```bash
npm start            # serves http://localhost:8080  (PORT=3000 npm start to change)
```

Any static host also works, such as GitHub Pages, Netlify or `python3 -m http.server`.

### How the downloads are built

- **Windows:** `npm run build:exe`. The build uses Node’s [single executable applications](https://nodejs.org/api/single-executable-applications.html) feature. It downloads the official `node.exe` that matches your Node version from nodejs.org, checks it against the published SHA-256 checksums, embeds the app files and `desktop/launcher.js`, and writes the result to `dist/`. The executable is about 80 MB because it contains the Node runtime. If you are behind a proxy, set `NODE_USE_ENV_PROXY=1` so the download uses it. To run the launcher without building, use `npm run start:desktop`.
- **Linux:** `npm run build:appimage`. The launcher is a small static C program, `desktop/linux/launcher.c`, so the AppImage doesn't bundle a JavaScript runtime. The script builds a SquashFS image of the app and appends it to the official AppImage type 2 runtime. It downloads that runtime once and prints its checksum; set `RUNTIME_FILE` to use a copy you have verified.
- **macOS:** `npm run build:mac`. Builds `Security+ Study Lab.app` with `desktop/mac/launcher.sh` as its executable and zips it with permissions preserved. It builds on any OS.

## Features

### Designed for long study sessions
- **Easy on the eyes:** a low-glare palette with light, dark and **sepia** themes, adjustable **text size**, and the Atkinson Hyperlegible typeface (bundled, so it works offline). It was designed for legibility and clearly separates `0`/`O` and `1`/`l`/`I`, which matters for IPs, ports and hashes.
- **Four destinations:** Today, Learn, Practice and Progress, in a side rail on desktop and a bottom tab bar on phones.
- **Focus mode:** practice sessions, flashcards and exams hide all navigation and show a progress track.
- **Keyboard first:** choose answers with `1`–`5` or `A`–`E`, press `Enter` to check and continue, `Space` to flip a flashcard, `1`/`2` to grade it, and `F` to flag an exam item.
- **Today page:** a daily goal ring and streak, one-click **Practice now**, review and flashcards due, where to continue reading, and your weakest objectives with direct Practice buttons.

### Ways to practice
- **Smart practice** (5, 10, 20 or 40 questions) mixes questions due for review, your weakest objectives, term quizzes and new questions weighted by domain.
- **Endless drill** keeps serving questions until you stop, on all topics, your focus areas, or any lesson.
- **Try a similar question** after a miss adds a fresh question on the same objective right away.
- **Flashcards:** 204 key terms from the lessons, scheduled with spaced repetition. **Term quizzes:** 200 generated “which term matches this description?” questions with every option explained.
- **Topic picker** by domain or objective with length (including endless), difficulty, and term-quiz options.
- Every lesson ends with practice, drill and flashcard buttons for that objective.

### Lecture
- **28 lessons**, one per SY0-701 objective, grouped by domain. Each lesson shows the official objective it covers.
- Every lesson defines its key terms and acronyms, explains concepts in plain language, and uses SVG **diagrams**, worked examples and security scenarios.
- **Knowledge checks** inside each lesson explain every option.
- **Side-by-side comparisons** of commonly confused concepts, such as IDS vs IPS, RPO vs RTO, SAML vs OAuth vs OIDC, and the agreement types.
- Each lesson ends with **key takeaways** and a **Practice this topic** button that starts questions on that objective immediately, plus links to related PBQs.

### Questions and exams
- **360 original questions** covering all 28 objectives (12 or more each): single-answer, multiple-response (“Select TWO”) and scenario-based, at three difficulty levels.
- **Retry missed** questions and **spaced review** of everything you got wrong.
- **Practice mode** gives immediate feedback: why the best answer is best, and why each other option is right or wrong.
- **Timed mock exams**: a full-length mock (4 PBQs + 76 questions, 90 min), a quick mock (1 PBQ + 24 questions, 30 min) and domain-focused exams. Exam mode withholds feedback until you submit, supports **flag for review**, has a navigator and a review screen, auto-submits when time runs out, and survives page reloads.

### Performance-based questions (14)
| PBQ | Interface | Objectives |
|---|---|---|
| Configure the DMZ firewall | Editable ACL (add, reorder, delete rules) plus a packet tester | 4.5, 3.2 |
| Segment the IoT camera network | Editable ACL | 2.5, 3.2 |
| Assign least-privilege share permissions | Permission matrix | 4.6, 2.5 |
| Analyze web server logs | Selectable evidence plus questions | 2.4, 4.9 |
| Investigate suspicious sign-ins | Selectable evidence plus multi-select | 4.9, 2.4, 4.6 |
| Place security controls on the network diagram | Drag-and-drop network map | 3.2, 4.5 |
| Order the ransomware incident response | Ordering (drag or buttons) | 4.8 |
| Collect evidence in order of volatility | Ordering | 4.8, 4.9 |
| Investigate a compromised Linux server | **Simulated terminal** (grep, pipes, ps, netstat, sha256sum…) | 4.9, 2.4, 4.8 |
| Secure the wireless network | Settings form | 4.1, 3.2 |
| Classify security controls by type | Drag and drop | 1.1 |
| Match indicators to attack types | Drag and drop | 2.4 |
| Choose the right cryptographic solution | Drag and drop | 1.4, 3.3 |
| Quantitative risk analysis | Numeric calculations plus selects | 5.2 |

Grading gives **partial credit** and accepts **multiple valid solutions**. Firewall tasks are graded by simulating test traffic against your rules, so any correct rule set passes. Ordering tasks accept interchangeable steps, and some settings accept more than one correct value. After you submit, the app shows item-by-item feedback and a **step-by-step solution**, and can load a correct configuration into the simulator.

Drag-and-drop works with a mouse, touch (select an item, then tap “Place here”) and the keyboard (Tab, then Enter or Space).

### Progress and reinforcement
- Tracks accuracy by **domain and objective**, recent accuracy, and PBQ results. Mastery blends recent questions (75%) with PBQ scores (25%).
- A **daily goal** (10, 20, 30 or 50 questions and cards), a **streak**, and a 16-week **activity map**.
- **Focus areas** on the Today page link straight to the matching lesson and practice.
- **Spaced review** uses a Leitner schedule (due now → 1 → 3 → 7 → 16 → 35 days). Review sessions mix in **fresh, unseen questions** on the same objectives, so you practice the concept rather than memorizing answers.
- Progress is **saved automatically** in `localStorage`. Use Export/Import (JSON) to move it between browsers.
- **Practice performance and the readiness estimate are kept separate.** The readiness indicator is labeled as an estimate, is not converted to CompTIA’s 100–900 scale, and is never presented as a pass/fail prediction.

## Tests

```bash
npm test             # content, grading, store, flashcards, streaks and generated questions (node:test, no dependencies)
npm install          # installs Playwright for the browser test
npx playwright install chromium
npm run test:e2e     # end-to-end learning flow in headless Chromium
E2E_BASE_URL=http://127.0.0.1:47801/ npm run test:e2e   # same flow against a running desktop build
```

The unit tests check that every objective has a complete lesson, that the question bank is well formed (option explanations, multiple-response counts, coverage per objective and difficulty), and that every PBQ’s reference solution scores 100% while its starting state does not. They also cover firewall first-match and implicit-deny behavior, partial credit, alternative valid answers, the simulated shell, spaced-review intervals, recommendations and export/import.

The end-to-end test covers the full flow: Today → lesson and quick check → keyboard-only practice from the lesson → persistence and the daily goal → spaced review → similar question and endless drill → flashcards → topic picker → labs (firewall, click-to-place and drag-and-drop, ordering, terminal) → timed mock exam with flagging → results → progress → settings → phone layout with no horizontal scrolling. Point it at a desktop build with `E2E_BASE_URL` to test the AppImage or Windows launcher the same way.

## Project structure

```
index.html                 App shell (no build step)
css/styles.css             Responsive styles with light, dark and sepia themes
fonts/                     Atkinson Hyperlegible Next and Mono (SIL Open Font License)
js/objectives.js           Exam metadata, domains, objectives, content helpers
js/diagrams.js             SVG diagram builders used by lessons
js/content/lessons-d*.js   Lessons for domains 1–5
js/content/questions-*.js  Question bank
js/content/pbqs.js         PBQ scenarios, reference solutions and walkthroughs
js/practice-gen.js         Flashcards and term quizzes generated from lesson key terms
js/grading.js              Pure grading logic and the simulated shell (shared with tests)
js/store.js                Progress, spaced review, flashcards, daily goal, streak, analytics
js/pbq-ui.js               Interactive PBQ components
js/app.js                  Router and views (Today, Learn, Practice, sessions, flashcards, exams, labs, Progress)
server.js                  Zero-dependency static server
desktop/launcher.js        Launcher bundled into the Windows executable
desktop/linux/launcher.c   Static launcher used inside the Linux AppImage
scripts/build-exe.js       Builds the Windows single-file executable
scripts/build-appimage.sh  Builds the Linux AppImage
desktop/mac/launcher.sh    Launcher script inside the macOS .app bundle
scripts/build-mac.sh       Builds the zipped macOS .app
scripts/build-release.sh   Builds all three downloads into dist/
.github/workflows/         Builds the downloads and attaches them to GitHub releases
tests/                     node:test unit tests and the Playwright end-to-end test
```

### Adding content
- **Questions:** call `SEC.addQuestions('2.4', [...])` with options written as `[text, explanation, isCorrect]`. IDs are assigned automatically and continue from existing ones, so saved progress stays valid.
- **PBQs:** add an object to `SEC.pbqs` using one of the existing types (`firewall`, `matrix`, `placement`, `ordering`, `logs`, `config`, `terminal`). `npm test` checks that its reference solution earns 100%.

## Disclaimer

All lessons, questions and simulations are original practice material written for the SY0-701 objectives. They are not exam dumps and are not copied from CompTIA or any exam provider. This project is not affiliated with or endorsed by CompTIA. CompTIA and Security+ are trademarks of CompTIA, Inc. Practice scores reflect performance on this app’s items only and are not predictions of an official exam result.
