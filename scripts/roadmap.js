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
  w(`| Flashcards and term quizzes | ${SEC.terms.length} key-term flashcards and ${SEC.termQuestions.length} term quizzes built from the lessons |`);
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
      const cards = `${cardsFor(o.id)} cards, ${termQFor(o.id)} quizzes`;
      w(`| **${o.id}** ${o.title.replace(/\.$/, '')} | ${lesson} | ${questions} | ${cards} | ${labs.length ? labs.map((p) => p.title).join('; ') : '–'} |`);
    });
  });
  w();
  w('## What the app does today');
  w();
  [
    'Lessons for every objective, each with key terms, diagrams, worked examples, quick checks, side-by-side comparisons and takeaways.',
    'Practice mode with explanations for every option, smart practice, endless drills, “try a similar question”, a topic picker and keyboard shortcuts.',
    'Flashcards and term quizzes on a spaced-repetition schedule, plus spaced review of missed questions.',
    'Timed mock exams with flagging, a review screen and results by domain, kept separate from a readiness estimate that is never presented as a score prediction.',
    'Hands-on labs with partial credit: firewall rules, permissions, log analysis, network placement, ordering, Wi-Fi settings, risk calculations and a simulated terminal.',
    'Progress by domain and objective, a daily goal, a streak, an activity map, and export/import.',
    'Light, dark and sepia themes, adjustable text size, a layout that works on phones, and offline use.',
  ].forEach((s) => w(`- ${s}`));
  w();
  w('## Where coverage is thinner');
  w();
  const noLab = SEC.objectives.filter((o) => !labsFor(o.id).length);
  const fewScen = SEC.objectives.filter((o) => qFor(o.id).filter((q) => q.s).length < 2);
  const fewAdv = SEC.objectives.filter((o) => qFor(o.id).filter((q) => q.d === 3).length < 3);
  w(`- **Objectives without a hands-on lab (${noLab.length}):** ${noLab.map((o) => o.id).join(', ')}. Several are conceptual (governance, audits, threat actors) and suit question practice better, but some would benefit from a lab.`);
  w(`- **Objectives with fewer than two scenario-based questions (${fewScen.length}):** ${fewScen.map((o) => o.id).join(', ')}.`);
  w(`- **Objectives with fewer than three advanced questions (${fewAdv.length}):** ${fewAdv.map((o) => o.id).join(', ')}.`);
  w('- **Acronyms:** lessons define the acronyms they use, but there is no full acronym deck matching CompTIA’s published acronym list.');
  w('- **Desktop apps:** the macOS app and the Windows .exe have not been tested on real Macs or Windows PCs yet, and neither is code-signed, so first launch shows a security prompt.');
  w(`- **Next exam version:** the content targets ${e.code}. ${e.upcoming.code} is expected soon (see below), and its objectives are not covered separately.`);
  w();
  w('## Next steps');
  w();
  w(`### Now: prepare for ${e.upcoming.code}`);
  w();
  w(`- Compare the final ${e.upcoming.code} objectives with these ${e.code} objectives once CompTIA publishes them, and list what is new, moved or removed.`);
  w(`- Add an exam-version note to each lesson that changes, so people still taking ${e.code} (until its retirement) are not confused.`);
  w('- Confirm the release, launch and retirement dates on comptia.org and update `js/objectives.js`.');
  w();
  w('### Next: close the gaps above');
  w();
  w('- Add labs for objectives that lend themselves to hands-on work: vulnerability scan triage (4.3), SIEM alert tuning (4.4), automation playbook ordering (4.7), asset disposal choices (4.2) and resilience planning with RTO/RPO (3.4).');
  w('- Write more scenario-based and advanced questions for the objectives listed above.');
  w('- Add an acronym flashcard deck and term quizzes covering the full acronym list.');
  w('- Test the macOS and Windows downloads on real machines, and open the Windows app in its own window like the Linux AppImage.');
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
