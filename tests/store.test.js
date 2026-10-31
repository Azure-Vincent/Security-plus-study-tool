const test = require('node:test');
const assert = require('node:assert/strict');
// Values created inside the VM sandbox have different prototypes, so compare structurally via JSON.
const same = (a, b, msg) => assert.equal(JSON.stringify(a), JSON.stringify(b), msg);
const { load } = require('./load');

test('answers persist to storage and reload', () => {
  const env = load();
  const q = env.SEC.questions[0];
  env.Store.recordAnswer(q, true, 'practice');
  const saved = JSON.parse(env.storage['secplus.progress.v1']);
  assert.equal(saved.q[q.id].c, 1);
  assert.equal(saved.obj[q.obj].n, 1);
});

test('spaced repetition: misses return in minutes, correct answers come back later and later', () => {
  const { SEC, Store } = load();
  const DAY = 86400000;
  const q = SEC.questions[5];
  Store.recordAnswer(q, false, 'practice');
  same(Store.dueReview(), [], 'a miss is not due in the same minute');
  same(Store.dueReview(Date.now() + 11 * 60000), [q.id], 'a miss returns after about 10 minutes');
  Store.recordAnswer(q, true, 'review');
  assert.equal(Store.data.q[q.id].srs.ivl, 1);
  same(Store.dueReview(Date.now() + DAY / 2), [], 'not due again until tomorrow');
  same(Store.dueReview(Date.now() + DAY + 1000), [q.id]);
  let last = 1;
  for (let i = 0; i < 4; i++) {
    Store.recordAnswer(q, true, 'review');
    const ivl = Store.data.q[q.id].srs.ivl;
    assert.ok(ivl > last, 'interval grows: ' + last + ' -> ' + ivl);
    last = ivl;
  }
  assert.ok(last >= 21, 'four more correct reviews reach long-term memory');
  assert.equal(Store.memory([q.id]).mature, 1);
  Store.recordAnswer(q, false, 'practice');
  assert.equal(Store.data.q[q.id].srs.ivl, 0, 'a new miss restarts the schedule');
  assert.equal(Store.memory([q.id]).learning, 1);
});

test('spaced repetition: every answered question is scheduled, unless set to mistakes only', () => {
  const { SEC, Store } = load();
  const DAY = 86400000;
  const [a, b] = SEC.questions;
  Store.recordAnswer(a, true, 'practice');
  Store.recordAnswer(b, false, 'practice');
  same(Store.dueReview(Date.now() + DAY + 1000).sort(), [a.id, b.id].sort());
  Store.data.settings.srs = 'missed';
  same(Store.dueReview(Date.now() + DAY + 1000), [b.id], 'mistakes-only mode leaves correct first answers alone');
  const fc = Store.forecast(14, Date.now() + 60 * 60000);
  assert.equal(fc.length, 14);
  assert.equal(fc.reduce((n, f) => n + f.q, 0), 1);
});

test('spaced repetition: grading a guess or an easy answer changes the next interval', () => {
  const { SEC, Store } = load();
  const q = SEC.questions[9];
  Store.recordAnswer(q, true, 'practice');
  assert.equal(Store.data.q[q.id].srs.ivl, 1);
  Store.regrade(q.id, 3);
  assert.equal(Store.data.q[q.id].srs.ivl, 4, 'too easy jumps ahead');
  Store.regrade(q.id, 0);
  assert.equal(Store.data.q[q.id].srs.ivl, 0, 'a guess is treated as a miss');
  Store.regrade(q.id, 2);
  assert.equal(Store.data.q[q.id].srs.ivl, 1, 'regrading starts from the state before the answer');
});

test('spaced repetition: no review is scheduled past the exam date', () => {
  const { SEC, Store } = load();
  const d = new Date(Date.now() + 10 * 86400000);
  Store.data.settings.examDate = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  assert.ok(Store.daysToExam() >= 10 && Store.daysToExam() <= 11);
  const q = SEC.questions[3];
  for (let i = 0; i < 6; i++) Store.recordAnswer(q, true, 'review', 3);
  assert.ok(Store.data.q[q.id].srs.due < Store.examDate(), 'due before the exam');
});

test('progress saved by the earlier box schedule is migrated', () => {
  const { SEC, Store } = load();
  const q = SEC.questions[2];
  Store.importJSON(JSON.stringify({ v: 1, q: { [q.id]: { n: 2, c: 1, last: true, t: Date.now(), box: 3, due: Date.now() + 7 * 86400000 } }, cards: { 'card-1.1-1': { box: 1, due: Date.now() + 86400000 } }, obj: {}, pbq: {}, lessons: {}, exams: [], settings: {} }));
  assert.equal(Store.data.q[q.id].srs.ivl, 7);
  assert.equal(Store.data.cards['card-1.1-1'].srs.ivl, 1);
  assert.equal(Store.cardsLearned(), 1);
});

test('objective status, weak-area recommendations and PBQ blending', () => {
  const { SEC, Store } = load();
  const weakQs = SEC.questions.filter((q) => q.obj === '2.4').slice(0, 5);
  weakQs.forEach((q, i) => Store.recordAnswer(q, i === 0, 'practice'));
  const strongQs = SEC.questions.filter((q) => q.obj === '1.1').slice(0, 5);
  strongQs.forEach((q) => Store.recordAnswer(q, true, 'practice'));
  assert.equal(Store.objStats('2.4').status, 'weak');
  assert.equal(Store.objStats('1.1').status, 'strong');
  const recs = Store.recommendations(3);
  assert.equal(recs[0].obj.id, '2.4', 'weakest objective recommended first');
  assert.ok(!recs.some((r) => r.obj.id === '1.1'), 'strong objectives are not recommended');
  Store.recordPBQ(SEC.pbqs.find((p) => p.objs.includes('2.4')), 1, 'practice');
  assert.ok(Store.objStats('2.4').mastery > 0.2, 'PBQ result blends into mastery');
});

test('readiness indicator is coverage-weighted and stays on a 0-1 practice scale', () => {
  const { SEC, Store } = load();
  assert.equal(Store.readiness().coverage, 0);
  SEC.questions.filter((q) => q.obj === '4.6').slice(0, 4).forEach((q) => Store.recordAnswer(q, true, 'practice'));
  const r = Store.readiness();
  assert.ok(r.value > 0 && r.value < 0.1, 'one objective cannot produce a high readiness value');
  assert.ok(r.coverage > 0 && r.coverage < 0.1);
});

test('export/import round-trip and rejection of bad files', () => {
  const a = load();
  a.Store.recordAnswer(a.SEC.questions[1], false, 'practice');
  const json = a.Store.exportJSON();
  const b = load();
  b.Store.importJSON(json);
  assert.equal(b.Store.data.q[a.SEC.questions[1].id].n, 1);
  assert.throws(() => b.Store.importJSON('{"hello":1}'));
});
