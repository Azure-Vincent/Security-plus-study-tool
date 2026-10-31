const test = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./load');
const same = (a, b, msg) => assert.equal(JSON.stringify(a), JSON.stringify(b), msg);

test('every objective has at least 12 authored questions', () => {
  const { SEC } = load();
  for (const o of SEC.objectives) {
    const n = SEC.questions.filter((q) => q.obj === o.id).length;
    assert.ok(n >= 12, `${o.id} has ${n}`);
  }
});

test('flashcards are built from every lesson’s key terms', () => {
  const { SEC } = load();
  const total = Object.values(SEC.lessons).reduce((a, L) => a + L.terms.length, 0);
  assert.equal(SEC.terms.filter((t) => t.id.startsWith('card-')).length, total, 'one card per lesson key term');
  assert.equal(new Set(SEC.terms.map((t) => t.id)).size, SEC.terms.length, 'card ids are unique');
  SEC.terms.forEach((t) => { assert.ok(t.term && t.def && !/[<>]/.test(t.term), `clean text for ${t.id}`); });
});

test('term questions are valid, explained, deterministic and never give the answer away', () => {
  const a = load(), b = load();
  same(a.SEC.termQuestions.map((q) => q.id + q.o.map((o) => o[0]).join('|')), b.SEC.termQuestions.map((q) => q.id + q.o.map((o) => o[0]).join('|')), 'stable between loads');
  assert.ok(a.SEC.termQuestions.length >= 180);
  const ids = new Set(a.SEC.questions.map((q) => q.id));
  for (const q of a.SEC.termQuestions) {
    assert.ok(!ids.has(q.id), 'no clash with authored ids');
    assert.equal(q.o.length, 4);
    assert.equal(q.o.filter((o) => o[2]).length, 1);
    assert.equal(new Set(q.o.map((o) => o[0])).size, 4, `${q.id} options are distinct`);
    assert.ok(q.o.every((o) => o[1].length > 10), `${q.id} explains every option`);
    const correct = q.o.find((o) => o[2])[0].toLowerCase();
    assert.ok(!q.q.toLowerCase().includes(correct), `${q.id} prompt does not contain the answer`);
  }
});

test('flashcard scheduling: due first, then new; again resets, knowing advances', () => {
  const { SEC, Store } = load();
  const ids = SEC.terms.slice(0, 5).map((t) => t.id);
  let q = Store.cardQueue(ids, 20);
  same(q.queue, ids, 'all new at first');
  Store.recordCard(ids[0], true);
  Store.recordCard(ids[1], false);
  q = Store.cardQueue(ids, 20);
  same(q.due, [ids[1]], 'missed card is due now');
  assert.ok(!q.queue.includes(ids[0]), 'known card waits a day');
  same(Store.cardQueue(ids, 20, Date.now() + 86400000 + 1000).due.sort(), [ids[0], ids[1]].sort());
  assert.equal(Store.cardsLearned(), 1);
});

test('daily goal and streak count questions and flashcards', () => {
  const { SEC, Store } = load();
  assert.equal(Store.todayCount(), 0);
  assert.equal(Store.streak(), 0);
  Store.recordAnswer(SEC.questions[0], true, 'practice');
  Store.recordCard(SEC.terms[0].id, true);
  assert.equal(Store.todayCount(), 2);
  assert.equal(Store.streak(), 1);
  const D = Store.data.daily;
  const k = (n) => Store.dayKey(Date.now() - n * 86400000);
  D[k(1)] = { q: 3 }; D[k(2)] = { cards: 1 }; D[k(4)] = { q: 9 };
  assert.equal(Store.streak(), 3, 'gap on day 3 ends the streak');
  delete D[Store.dayKey(Date.now())];
  assert.equal(Store.streak(), 2, 'a streak survives until today ends');
  const act = Store.activity(5);
  assert.equal(act.length, 5);
  assert.equal(act[4].day, Store.dayKey(Date.now()));
  assert.equal(act[0].n, 9);
});

test('older saved progress without new fields still loads', () => {
  const env = load();
  env.storage['secplus.progress.v1'] = JSON.stringify({ v: 1, q: {}, obj: {}, pbq: {}, lessons: {}, exams: [], settings: {} });
  env.Store.importJSON(env.storage['secplus.progress.v1']);
  assert.ok(env.Store.data.cards && env.Store.data.daily);
  assert.equal(env.Store.todayCount(), 0);
});

test('acronym deck: every acronym is quizzed, new ones get cards, no duplicates with lesson terms', () => {
  const { SEC } = load();
  const acrs = SEC.acronyms.map((a) => a[0]);
  assert.equal(new Set(acrs.map((a) => a.toLowerCase())).size, acrs.length, 'acronyms are unique');
  SEC.acronyms.forEach((a) => {
    assert.ok(SEC.objById(a[2]), `${a[0]} has a valid objective`);
    assert.ok(a[1].length > 3 && a[3].length > 10, `${a[0]} has an expansion and description`);
  });
  const quizzes = SEC.termQuestions.filter((q) => q.acr);
  assert.equal(quizzes.length, SEC.acronyms.length, 'one quiz per acronym');
  quizzes.forEach((q) => assert.equal(new Set(q.o.map((o) => o[0])).size, 4, `${q.id} has four distinct options`));
  const lessonTerms = new Set(SEC.terms.filter((t) => !t.kind).flatMap((t) => t.term.split('/').map((x) => x.trim().toLowerCase())));
  SEC.terms.filter((t) => t.kind === 'acronym').forEach((t) => assert.ok(!lessonTerms.has(t.term.toLowerCase()), `${t.term} duplicates a lesson card`));
  assert.ok(SEC.terms.filter((t) => t.acronym).length >= 120, 'acronym-only deck includes lesson acronyms');
});
