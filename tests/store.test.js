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

test('spaced review: misses are due now, then intervals grow until retired', () => {
  const { SEC, Store } = load();
  const q = SEC.questions[5];
  Store.recordAnswer(q, false, 'practice');
  same(Store.dueReview(), [q.id]);
  Store.recordAnswer(q, true, 'review');
  assert.equal(Store.data.q[q.id].box, 1);
  same(Store.dueReview(), [], 'not due again until tomorrow');
  same(Store.dueReview(Date.now() + 86400000 + 1000), [q.id]);
  for (let i = 0; i < 4; i++) Store.recordAnswer(q, true, 'review');
  assert.equal(Store.data.q[q.id].box, Store.GRADUATED);
  same(Store.dueReview(Date.now() + 400 * 86400000), [], 'retired items leave the queue');
  Store.recordAnswer(q, false, 'practice');
  assert.equal(Store.data.q[q.id].box, 0, 'a new miss restarts the schedule');
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
