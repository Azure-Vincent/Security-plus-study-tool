# Roadmap

This roadmap shows what Security+ Study Lab covers for each exam objective, where coverage is thinner, and what comes next.

The coverage tables are generated from the app content by `scripts/roadmap.js`. After changing lessons, questions or labs, run `npm run roadmap` to update this file. `npm test` fails if it is out of date.

## At a glance

| | |
|---|---|
| Exam | CompTIA Security+ SY0-701 (current live exam, checked 2026-10-05) |
| Objectives covered | 28 of 28, across all 5 domains |
| Lessons | 28, with 137 sections, 77 quick checks and 35 diagrams |
| Exam-style questions | 371 original (56 foundation, 207 intermediate, 108 advanced); 40 multiple-response, 69 scenario-based |
| Flashcards and quizzes | 268 flashcards (204 lesson key terms, plus acronyms; 132 cards in the acronym deck) and 347 quizzes (200 term, 147 acronym) |
| Hands-on labs (PBQs) | 21, covering 19 of 28 objectives |
| Mock exams | Full length (4 labs and 76 questions, 90 minutes), quick (30 minutes) and one-domain (25 minutes) |
| Downloads | Linux AppImage, Windows .exe and macOS app, attached to each GitHub release |

## Coverage by objective

Questions are split into foundation / intermediate / advanced. A lab is listed under every objective it practices.

### 1.0 General Security Concepts (12% of the exam)

| Objective | Lesson | Questions | Flashcards | Labs |
|---|---|---|---|---|
| **1.1** Compare and contrast various types of security controls | Security Controls: Categories and Types: 3 sections, 3 checks, 20 min | 12 (3 / 6 / 3) | 6 cards, 6 quizzes | Classify security controls by type |
| **1.2** Summarize fundamental security concepts | Fundamental Security Concepts: 6 sections, 4 checks, 30 min | 13 (3 / 7 / 3) | 10 cards, 11 quizzes | – |
| **1.3** Explain the importance of change management processes and the impact to security | Change Management and Security: 4 sections, 2 checks, 18 min | 12 (4 / 5 / 3) | 6 cards, 7 quizzes | – |
| **1.4** Explain the importance of using appropriate cryptographic solutions | Cryptographic Solutions and PKI: 8 sections, 4 checks, 40 min | 15 (2 / 8 / 5) | 17 cards, 19 quizzes | Choose the right cryptographic solution |

### 2.0 Threats, Vulnerabilities, and Mitigations (22% of the exam)

| Objective | Lesson | Questions | Flashcards | Labs |
|---|---|---|---|---|
| **2.1** Compare and contrast common threat actors and motivations | Threat Actors and Motivations: 3 sections, 2 checks, 20 min | 12 (2 / 6 / 4) | 6 cards, 7 quizzes | Identify the threat actor |
| **2.2** Explain common threat vectors and attack surfaces | Threat Vectors and Attack Surfaces: 4 sections, 2 checks, 25 min | 14 (3 / 8 / 3) | 7 cards, 9 quizzes | – |
| **2.3** Explain various types of vulnerabilities | Types of Vulnerabilities: 5 sections, 3 checks, 30 min | 13 (2 / 7 / 4) | 14 cards, 16 quizzes | – |
| **2.4** Given a scenario, analyze indicators of malicious activity | Indicators of Malicious Activity: 6 sections, 4 checks, 40 min | 18 (2 / 10 / 6) | 13 cards, 16 quizzes | Analyze web server logs for attacks; Investigate a compromised Linux web server; Match indicators to attack types; Investigate suspicious sign-ins |
| **2.5** Explain the purpose of mitigation techniques used to secure the enterprise | Mitigation Techniques: 3 sections, 2 checks, 25 min | 12 (2 / 7 / 3) | 9 cards, 11 quizzes | Segment the IoT camera network; Assign least-privilege share permissions |

### 3.0 Security Architecture (18% of the exam)

| Objective | Lesson | Questions | Flashcards | Labs |
|---|---|---|---|---|
| **3.1** Compare and contrast security implications of different architecture models | Architecture Models and Their Security Implications: 6 sections, 3 checks, 35 min | 13 (1 / 8 / 4) | 11 cards, 19 quizzes | – |
| **3.2** Given a scenario, apply security principles to secure enterprise infrastructure | Securing Enterprise Infrastructure: 7 sections, 4 checks, 40 min | 15 (2 / 8 / 5) | 16 cards, 24 quizzes | Configure the DMZ firewall; Segment the IoT camera network; Place security controls on the network diagram; Secure the wireless network |
| **3.3** Compare and contrast concepts and strategies to protect data | Protecting Data: 5 sections, 3 checks, 25 min | 13 (1 / 8 / 4) | 6 cards, 8 quizzes | Choose the right cryptographic solution |
| **3.4** Explain the importance of resilience and recovery in security architecture | Resilience and Recovery: 7 sections, 3 checks, 30 min | 13 (2 / 8 / 3) | 11 cards, 14 quizzes | Plan recovery from a business impact analysis |

### 4.0 Security Operations (28% of the exam)

| Objective | Lesson | Questions | Flashcards | Labs |
|---|---|---|---|---|
| **4.1** Given a scenario, apply common security techniques to computing resources | Securing Computing Resources: 6 sections, 4 checks, 35 min | 13 (2 / 7 / 4) | 11 cards, 18 quizzes | Secure the wireless network |
| **4.2** Explain the security implications of proper hardware, software, and data asset management | Hardware, Software and Data Asset Management: 4 sections, 2 checks, 20 min | 13 (3 / 7 / 3) | 6 cards, 6 quizzes | Choose the right media sanitization |
| **4.3** Explain various activities associated with vulnerability management | Vulnerability Management: 5 sections, 2 checks, 35 min | 12 (1 / 7 / 4) | 7 cards, 9 quizzes | Prioritize vulnerability scan findings |
| **4.4** Explain security alerting and monitoring concepts and tools | Security Alerting and Monitoring: 4 sections, 2 checks, 30 min | 13 (2 / 7 / 4) | 9 cards, 11 quizzes | Triage and tune the SIEM alert queue |
| **4.5** Given a scenario, modify enterprise capabilities to enhance security | Enhancing Enterprise Security Capabilities: 7 sections, 4 checks, 40 min | 15 (1 / 9 / 5) | 18 cards, 26 quizzes | Configure the DMZ firewall; Place security controls on the network diagram |
| **4.6** Given a scenario, implement and maintain identity and access management | Identity and Access Management: 6 sections, 4 checks, 45 min | 15 (1 / 9 / 5) | 17 cards, 26 quizzes | Assign least-privilege share permissions; Investigate suspicious sign-ins |
| **4.7** Explain the importance of automation and orchestration related to secure operations | Automation and Orchestration: 3 sections, 2 checks, 18 min | 13 (3 / 7 / 3) | 7 cards, 8 quizzes | Build an automated phishing playbook |
| **4.8** Explain appropriate incident response activities | Incident Response: 4 sections, 2 checks, 35 min | 13 (2 / 7 / 4) | 10 cards, 10 quizzes | Order the ransomware incident response; Collect evidence in order of volatility; Investigate a compromised Linux web server; Build an automated phishing playbook |
| **4.9** Given a scenario, use data sources to support an investigation | Using Data Sources in Investigations: 3 sections, 2 checks, 30 min | 12 (1 / 7 / 4) | 6 cards, 6 quizzes | Analyze web server logs for attacks; Collect evidence in order of volatility; Investigate a compromised Linux web server; Investigate suspicious sign-ins; Triage and tune the SIEM alert queue |

### 5.0 Security Program Management and Oversight (20% of the exam)

| Objective | Lesson | Questions | Flashcards | Labs |
|---|---|---|---|---|
| **5.1** Summarize elements of effective security governance | Security Governance: 5 sections, 2 checks, 30 min | 14 (2 / 8 / 4) | 10 cards, 11 quizzes | – |
| **5.2** Explain elements of the risk management process | Risk Management: 7 sections, 3 checks, 40 min | 14 (2 / 8 / 4) | 10 cards, 17 quizzes | Quantitative risk analysis; Plan recovery from a business impact analysis |
| **5.3** Explain the processes associated with third-party risk assessment and management | Third-Party Risk Management: 4 sections, 2 checks, 22 min | 12 (1 / 8 / 3) | 7 cards, 14 quizzes | Match each situation to the right agreement |
| **5.4** Summarize elements of effective security compliance | Security Compliance: 4 sections, 2 checks, 22 min | 12 (2 / 7 / 3) | 7 cards, 7 quizzes | – |
| **5.5** Explain types and purposes of audits and assessments | Audits and Assessments: 4 sections, 3 checks, 25 min | 13 (2 / 6 / 5) | 7 cards, 7 quizzes | – |
| **5.6** Given a scenario, implement security awareness practices | Security Awareness Practices: 4 sections, 2 checks, 22 min | 12 (2 / 7 / 3) | 4 cards, 4 quizzes | – |

## What the app does today

- Lessons for every objective, each with key terms, diagrams, worked examples, quick checks, side-by-side comparisons and takeaways.
- Practice mode with explanations for every option, smart practice, endless drills, “try a similar question”, a topic picker and keyboard shortcuts.
- Flashcards for lesson key terms and exam acronyms, with term and acronym quizzes.
- Spaced repetition for every question and flashcard (Again, Hard, Good, Easy), a daily review, an optional exam date that caps intervals, and a Memory view with a 14-day forecast.
- Timed mock exams with flagging, a review screen and results by domain, kept separate from a readiness estimate that is never presented as a score prediction.
- Hands-on labs with partial credit: firewall rules, permissions, log analysis, network placement, ordering, Wi-Fi settings, risk calculations and a simulated terminal.
- Progress by domain and objective, a daily goal, a streak, an activity map, and export/import.
- Desktop downloads for Linux, Windows and macOS that open the app in its own window when a Chromium-based browser is installed.
- Light, dark and sepia themes, adjustable text size, a layout that works on phones, and offline use.

## Where coverage is thinner

- **Objectives without a hands-on lab (9):** 1.2, 1.3, 2.2, 2.3, 3.1, 5.1, 5.4, 5.5, 5.6. Several are conceptual (governance, compliance, audits, awareness) and suit question practice better, but some would benefit from a lab.
- **Objectives with fewer than two scenario-based questions:** none.
- **Objectives with fewer than three advanced questions:** none.
- **Acronyms:** the deck covers 147 common Security+ acronyms. It has not been checked line by line against CompTIA’s official acronym list.
- **Desktop apps:** the macOS app and the Windows .exe have not been tested on real Macs or Windows PCs yet, and neither is code-signed, so first launch shows a security prompt.
- **Next exam version:** the content targets SY0-701. What is known about SY0-801 so far is in [docs/SY0-801.md](docs/SY0-801.md); its new AI security objective is not covered yet.

## Next steps

### Now: prepare for SY0-801

- Done: a first comparison from published reports (dates, domain weights, the new AI objective) in [docs/SY0-801.md](docs/SY0-801.md).
- Confirm those details against CompTIA’s official SY0-801 objectives, then map each objective to the SY0-701 lesson that covers it and list what is new, moved or removed.
- Add a lesson, questions and flashcards on AI security risks.
- Add an exam-version note to each lesson that changes, so people still taking SY0-701 (until its retirement) are not confused.

### Next: close the remaining gaps

- Done in this round: labs for 2.1, 3.4, 4.2, 4.3, 4.4, 4.7 and 5.3; scenario and advanced questions for every objective that lacked them; an acronym deck with quizzes; and an app window for the Windows download.
- Consider labs for the objectives that still have none (1.2, 1.3, 2.2, 2.3, 3.1, 5.1, 5.4, 5.5, 5.6), where hands-on practice fits the topic.
- Check the acronym deck against CompTIA’s official acronym list.
- Test the macOS and Windows downloads on real machines.

### Later

- Full SY0-701 and SY0-801 content side by side, with an exam-version switch in Settings.
- Code-signed Windows and macOS downloads to remove the first-launch security prompts.
- More mock exam variety, such as exams built from your weakest objectives.
