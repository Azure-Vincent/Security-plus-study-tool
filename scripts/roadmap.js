/* Generates ROADMAP.md: what the app covers for each exam objective, known gaps, and what comes next.
   Coverage numbers are computed from the app content, so the document stays accurate.
     node scripts/roadmap.js          write ROADMAP.md
     node scripts/roadmap.js --check  exit 1 if ROADMAP.md is out of date (used by npm test) */
'use strict';
const fs = require('fs');
const path = require('path');
const { load } = require('../tests/load');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'ROADMAP.md');

function build() {
  const { SEC } = load();
  const Q = SEC.questions;
  const qFor = (id) => Q.filter((q) => q.obj === id);
  const labsFor = (id) => SEC.pbqs.filter((p) => p.objs.includes(id));
  const cardsFor = (id) => SEC.terms.filter((t) => t.obj === id).length;
  const termQFor = (id) => SEC.termQuestions.filter((t) => t.obj === id).length;
  const lessons = Object.values(SEC.lessons);
  const sum = (arr, f) => arr.reduce((a, x) => a + f(x), 0);
  const e = SEC.exam;
  const out = [];
  const w = (s = '') => out.push(s);

  w('# Roadmap');
  w();
  w('This roadmap shows what Security+ Study Lab covers for each exam objective, where coverage is thinner, and what comes next.');
  w();
  w('The coverage tables are generated from the app content by `scripts/roadmap.js`. After changing lessons, questions or labs, run `npm run roadmap` to update this file. `npm test` fails if it is out of date.');
  w();
  w('## At a glance');
  w();
  w('| | |');
  w('|---|---|');
  w(`| Exam | CompTIA Security+ ${e.code} (${e.status.toLowerCase()}, checked ${e.verifiedOn}) |`);
  w(`| Objectives covered | ${SEC.objectives.length} of ${SEC.objectives.length}, across all ${SEC.domains.length} domains |`);
  w(`| Lessons | ${lessons.length}, with ${sum(lessons, (L) => L.sections.length)} sections, ${sum(lessons, (L) => L.sections.filter((s) => s.check).length)} quick checks and ${sum(lessons, (L) => L.sections.filter((s) => s.diagram).length)} diagrams |`);
  w(`| Exam-style questions | ${Q.length} original (${Q.filter((q) => q.d === 1).length} foundation, ${Q.filter((q) => q.d === 2).length} intermediate, ${Q.filter((q) => q.d === 3).length} advanced); ${Q.filter((q) => q.type === 'mr').length} multiple-response, ${Q.filter((q) => q.s).length} scenario-based |`);
  const lessonCards = SEC.terms.filter((t) => !t.kind).length, acrCards = SEC.terms.filter((t) => t.acronym).length;
  w(`| Flashcards and quizzes | ${SEC.terms.length} flashcards (${lessonCards} lesson key terms, plus acronyms; ${acrCards} cards in the acronym deck) and ${SEC.termQuestions.length} quizzes (${SEC.termQuestions.filter((q) => !q.acr).length} term, ${SEC.termQuestions.filter((q) => q.acr).length} acronym) |`);
  w(`| Hands-on labs (PBQs) | ${SEC.pbqs.length}, covering ${SEC.objectives.filter((o) => labsFor(o.id).length).length} of ${SEC.objectives.length} objectives |`);
  w('| Mock exams | Full length (4 labs and 76 questions, 90 minutes), quick (30 minutes) and one-domain (25 minutes) |');
  w('| Downloads | Linux AppImage, Windows .exe and macOS app, attached to each GitHub release |');
  w();
  w('## Coverage by objective');
  w();
  w('Questions are split into foundation / intermediate / advanced. A lab is listed under every objective it practices.');
  SEC.domains.forEach((d) => {
    const objs = SEC.objectives.filter((o) => o.id.split('.')[0] === d.id);
    w();
    w(`### ${d.id}.0 ${d.title} (${d.weight}% of the exam)`);
    w();
    w('| Objective | Lesson | Questions | Flashcards | Labs |');
    w('|---|---|---|---|---|');
    objs.forEach((o) => {
      const L = SEC.lessons[o.id], qs = qFor(o.id), labs = labsFor(o.id);
      const lesson = `${L.title}: ${L.sections.length} sections, ${L.sections.filter((s) => s.check).length} checks, ${L.minutes} min`;
      const questions = `${qs.length} (${[1, 2, 3].map((n) => qs.filter((q) => q.d === n).length).join(' / ')})`;
      const cards = `${cardsFor(o.id)} cards, ${termQFor(o.id)} quizzes`; // includes acronyms taught in this objective
      w(`| **${o.id}** ${o.title.replace(/\.$/, '')} | ${lesson} | ${questions} | ${cards} | ${labs.length ? labs.map((p) => p.title).join('; ') : '–'} |`);
    });
  });
  w();
  w('## What the app does today');
  w();
  [
    'Lessons for every objective, each with key terms, diagrams, worked examples, quick checks, side-by-side comparisons and takeaways.',
    'Practice mode with explanations for every option, smart practice, endless drills, “try a similar question”, a topic picker and keyboard shortcuts.',
    'Flashcards for lesson key terms and exam acronyms, with term and acronym quizzes, on a spaced-repetition schedule, plus spaced review of missed questions.',
    'Timed mock exams with flagging, a review screen and results by domain, kept separate from a readiness estimate that is never presented as a score prediction.',
    'Hands-on labs with partial credit: firewall rules, permissions, log analysis, network placement, ordering, Wi-Fi settings, risk calculations and a simulated terminal.',
    'Progress by domain and objective, a daily goal, a streak, an activity map, and export/import.',
    'Desktop downloads for Linux, Windows and macOS that open the app in its own window when a Chromium-based browser is installed.',
    'Light, dark and sepia themes, adjustable text size, a layout that works on phones, and offline use.',
  ].forEach((s) => w(`- ${s}`));
  w();
  w('## Where coverage is thinner');
  w();
  const noLab = SEC.objectives.filter((o) => !labsFor(o.id).length);
  const fewScen = SEC.objectives.filter((o) => qFor(o.id).filter((q) => q.s).length < 2);
  const fewAdv = SEC.objectives.filter((o) => qFor(o.id).filter((q) => q.d === 3).length < 3);
  const list = (objs) => (objs.length ? objs.map((o) => o.id).join(', ') : 'none');
  w(`- **Objectives without a hands-on lab (${noLab.length}):** ${list(noLab)}. Several are conceptual (governance, compliance, audits, awareness) and suit question practice better, but some would benefit from a lab.`);
  w(`- **Objectives with fewer than two scenario-based questions:** ${list(fewScen)}.`);
  w(`- **Objectives with fewer than three advanced questions:** ${list(fewAdv)}.`);
  w(`- **Acronyms:** the deck covers ${SEC.acronyms.length} common Security+ acronyms. It has not been checked line by line against CompTIA’s official acronym list.`);
  w('- **Desktop apps:** the macOS app and the Windows .exe have not been tested on real Macs or Windows PCs yet, and neither is code-signed, so first launch shows a security prompt.');
  w(`- **Next exam version:** the content targets ${e.code}. What is known about ${e.upcoming.code} so far is in [docs/${e.upcoming.code}.md](docs/${e.upcoming.code}.md); its new AI security objective is not covered yet.`);
  w();
  w('## Next steps');
  w();
  w(`### Now: prepare for ${e.upcoming.code}`);
  w();
  w(`- Done: a first comparison from published reports (dates, domain weights, the new AI objective) in [docs/${e.upcoming.code}.md](docs/${e.upcoming.code}.md).`);
  w(`- Confirm those details against CompTIA’s official ${e.upcoming.code} objectives, then map each objective to the ${e.code} lesson that covers it and list what is new, moved or removed.`);
  w('- Add a lesson, questions and flashcards on AI security risks.');
  w(`- Add an exam-version note to each lesson that changes, so people still taking ${e.code} (until its retirement) are not confused.`);
  w();
  w('### Next: close the remaining gaps');
  w();
  w('- Done in this round: labs for 2.1, 3.4, 4.2, 4.3, 4.4, 4.7 and 5.3; scenario and advanced questions for every objective that lacked them; an acronym deck with quizzes; and an app window for the Windows download.');
  if (noLab.length) w(`- Consider labs for the objectives that still have none (${list(noLab)}), where hands-on practice fits the topic.`);
  w('- Check the acronym deck against CompTIA’s official acronym list.');
  w('- Test the macOS and Windows downloads on real machines.');
  w();
  w('### Later');
  w();
  w(`- Full ${e.code} and ${e.upcoming.code} content side by side, with an exam-version switch in Settings.`);
  w('- Code-signed Windows and macOS downloads to remove the first-launch security prompts.');
  w('- More mock exam variety, such as exams built from your weakest objectives.');
  w();
  return out.join('\n');
}

const text = build();
if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur !== text) { console.error('ROADMAP.md is out of date. Run: npm run roadmap'); process.exit(1); }
  console.log('ROADMAP.md is up to date.');
} else {
  fs.writeFileSync(OUT, text);
  console.log('Wrote ROADMAP.md');
}
