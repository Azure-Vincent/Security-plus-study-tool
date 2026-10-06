# Security+ Study Lab

An interactive study app for **CompTIA Security+ SY0-701**. It teaches each exam objective from the ground up, then reinforces it with exam-style questions, performance-based simulations (PBQs), timed mock exams and spaced review.

Everything runs locally in the browser. You don't need an account, a backend or a paid AI API.

## Exam version

| | |
|---|---|
| Exam | CompTIA Security+ **SY0-701** (V7), launched November 7, 2023 |
| Status (checked 2026-10-05) | Current live exam |
| Format | Up to 90 questions, 90 minutes, multiple-choice and performance-based; passing score 750 on a 100–900 scale |
| Domains | 1.0 General Security Concepts (12%) · 2.0 Threats, Vulnerabilities, and Mitigations (22%) · 3.0 Security Architecture (18%) · 4.0 Security Operations (28%) · 5.0 Security Program Management and Oversight (20%) |
| Next version | CompTIA has announced **SY0-801**. Published reports give an English launch around November 17, 2026 and SY0-701 English retirement on June 11, 2027. Confirm on comptia.org before you book. |

The version is shown in the app header, on the dashboard and on the About page. To retarget the app to a future exam, update `js/objectives.js`.

## Quick start

**Option 1: open the file.** Double-click `index.html`. The app works from `file://` with no server.

**Option 2: local server (recommended).** Requires Node.js 18 or later and has no dependencies:

```bash
npm start            # serves http://localhost:8080  (PORT=3000 npm start to change)
```

Any static host also works, such as GitHub Pages, Netlify or `python3 -m http.server`.

**Option 3: Windows executable.** `SecurityPlusStudyLab.exe` is a single file with no installation. Double-click it, and it starts a small local server on `127.0.0.1:47801` and opens the app in your default browser. Keep its console window open while you study, and close it to quit. Launching it again while it is running just reopens the browser.

- The address stays the same on every launch, so your saved progress is found again. Progress stays in the browser you use, as in the other options.
- The executable isn't code-signed, so Windows SmartScreen may warn about an unrecognized app on first launch. Choose **More info → Run anyway**.
- It serves the app to this computer only (127.0.0.1) and doesn't connect to the internet.

To build it yourself (Node 20 or later, on any OS):

```bash
npm install
npm run build:exe            # dist/SecurityPlusStudyLab.exe (Windows x64)
npm run build:exe -- linux   # dist/security-plus-study-lab-linux (on Linux)
```

The build uses Node’s [single executable applications](https://nodejs.org/api/single-executable-applications.html) feature. It downloads the official `node.exe` that matches your Node version from nodejs.org, checks it against the published SHA-256 checksums, embeds the app files and `desktop/launcher.js`, and writes the result to `dist/`. The executable is about 80 MB because it contains the Node runtime. If you are behind a proxy, set `NODE_USE_ENV_PROXY=1` so the download uses it. To run the launcher without building, use `npm run start:desktop`.

## Features

### Lecture
- **28 lessons**, one per SY0-701 objective, grouped by domain. Each lesson shows the official objective it covers.
- Every lesson defines its key terms and acronyms, explains concepts in plain language, and uses SVG **diagrams**, worked examples and security scenarios.
- **Knowledge checks** inside each lesson explain every option.
- **Side-by-side comparisons** of commonly confused concepts, such as IDS vs IPS, RPO vs RTO, SAML vs OAuth vs OIDC, and the agreement types.
- Each lesson ends with **key takeaways** and a **Practice this topic** button that starts questions on that objective immediately, plus links to related PBQs.

### Test center
- **333 original questions** covering all 28 objectives (8 or more each): single-answer, multiple-response (“Select TWO”) and scenario-based, at three difficulty levels.
- **Topic practice** by objective or domain, **mixed review** weighted by domain, **retry missed** questions, and **spaced review**.
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
- **Weak-area recommendations** on the dashboard link straight to the matching lesson and practice.
- **Spaced review** uses a Leitner schedule (due now → 1 → 3 → 7 → 16 → 35 days). Review sessions mix in **fresh, unseen questions** on the same objectives, so you practice the concept rather than memorizing answers.
- Progress is **saved automatically** in `localStorage`. Use Export/Import (JSON) to move it between browsers.
- **Practice performance and the readiness estimate are kept separate.** The readiness indicator is labeled as an estimate, is not converted to CompTIA’s 100–900 scale, and is never presented as a pass/fail prediction.

## Tests

```bash
npm test             # content validation, grading logic, progress/spaced-review store (node:test, no dependencies)
npm install          # installs Playwright for the browser test
npx playwright install chromium
npm run test:e2e     # end-to-end learning flow in headless Chromium
E2E_BASE_URL=http://127.0.0.1:47801/ npm run test:e2e   # same flow against a running desktop build
```

The unit tests check that every objective has a complete lesson, that the question bank is well formed (option explanations, multiple-response counts, coverage per objective and difficulty), and that every PBQ’s reference solution scores 100% while its starting state does not. They also cover firewall first-match and implicit-deny behavior, partial credit, alternative valid answers, the simulated shell, spaced-review intervals, recommendations and export/import.

The end-to-end test goes through the full flow: dashboard → lesson → knowledge check → practice from the lesson → persistence across reload → spaced review → PBQs (firewall, click-to-place and HTML5 drag-and-drop, ordering, terminal) → timed mock exam with flagging and submission → results and progress pages. It also checks that the layout has no horizontal scrolling at phone width.

## Project structure

```
index.html                 App shell (no build step)
css/styles.css             Responsive light/dark styles
js/objectives.js           Exam metadata, domains, objectives, content helpers
js/diagrams.js             SVG diagram builders used by lessons
js/content/lessons-d*.js   Lessons for domains 1–5
js/content/questions-*.js  Question bank
js/content/pbqs.js         PBQ scenarios, reference solutions and walkthroughs
js/grading.js              Pure grading logic and the simulated shell (shared with tests)
js/store.js                Progress, spaced review, analytics
js/pbq-ui.js               Interactive PBQ components
js/app.js                  Router and views (Dashboard, Lecture, Test, Progress, About)
server.js                  Zero-dependency static server
desktop/launcher.js        Launcher bundled into the desktop executable
scripts/build-exe.js       Builds the single-file executable
tests/                     node:test unit tests and the Playwright end-to-end test
```

### Adding content
- **Questions:** call `SEC.addQuestions('2.4', [...])` with options written as `[text, explanation, isCorrect]`. IDs are assigned automatically and continue from existing ones, so saved progress stays valid.
- **PBQs:** add an object to `SEC.pbqs` using one of the existing types (`firewall`, `matrix`, `placement`, `ordering`, `logs`, `config`, `terminal`). `npm test` checks that its reference solution earns 100%.

## Disclaimer

All lessons, questions and simulations are original practice material written for the SY0-701 objectives. They are not exam dumps and are not copied from CompTIA or any exam provider. This project is not affiliated with or endorsed by CompTIA. CompTIA and Security+ are trademarks of CompTIA, Inc. Practice scores reflect performance on this app’s items only and are not predictions of an official exam result.
