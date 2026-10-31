const test = require('node:test');
const assert = require('node:assert/strict');
const SRS = require('../js/srs.js');

const DAY = SRS.DAY, NOW = Date.UTC(2026, 9, 1, 12);

test('first answers: Again relearns in 10 minutes, Good waits a day, Easy four', () => {
  assert.equal(SRS.schedule(null, 0, NOW).due - NOW, 10 * 60000);
  assert.equal(SRS.schedule(null, 1, NOW).ivl, 1);
  assert.equal(SRS.schedule(null, 2, NOW).ivl, 1);
  assert.equal(SRS.schedule(null, 3, NOW).ivl, 4);
});

test('intervals grow with each Good answer and stay ordered by grade', () => {
  let s = null, ivls = [];
  for (let i = 0; i < 6; i++) { s = SRS.schedule(s, 2, NOW); ivls.push(s.ivl); }
  assert.deepEqual(ivls.slice(0, 3), [1, 3, 8]);
  for (let i = 1; i < ivls.length; i++) assert.ok(ivls[i] > ivls[i - 1]);
  const prev = { ivl: 10, ease: 2.5, reps: 3, lapses: 0 };
  const [a, h, g, e] = [0, 1, 2, 3].map((gr) => SRS.schedule(prev, gr, NOW).ivl);
  assert.ok(a < h && h < g && g < e, [a, h, g, e].join(','));
});

test('a lapse lowers ease, counts, and restarts the item', () => {
  const s = SRS.schedule({ ivl: 30, ease: 2.5, reps: 5, lapses: 0 }, 0, NOW);
  assert.equal(s.ivl, 0); assert.equal(s.reps, 0); assert.equal(s.lapses, 1);
  assert.ok(Math.abs(s.ease - 2.3) < 1e-9);
  assert.equal(SRS.stage(s), 'learning');
});

test('ease never drops below 1.3 and intervals are capped at 180 days', () => {
  let s = { ivl: 1, ease: 1.3, reps: 2, lapses: 9 };
  s = SRS.schedule(s, 1, NOW); assert.equal(s.ease, 1.3);
  const big = SRS.schedule({ ivl: 150, ease: 3, reps: 8, lapses: 0 }, 3, NOW);
  assert.equal(big.ivl, 180);
});

test('an exam date caps intervals to the day before the exam', () => {
  const examDate = NOW + 10 * DAY;
  const s = SRS.schedule({ ivl: 20, ease: 2.5, reps: 4, lapses: 0 }, 2, NOW, { examDate });
  assert.equal(s.ivl, 9);
  assert.ok(s.due < examDate);
  const past = SRS.schedule({ ivl: 20, ease: 2.5, reps: 4, lapses: 0 }, 2, NOW, { examDate: NOW - DAY });
  assert.equal(past.ivl, 50, 'a past exam date is ignored');
});

test('stages, descriptions and previews', () => {
  assert.equal(SRS.stage(null), 'new');
  assert.equal(SRS.stage({ ivl: 5 }), 'young');
  assert.equal(SRS.stage({ ivl: 21 }), 'mature');
  assert.equal(SRS.describe({ due: NOW + 10 * 60000 }, NOW), '10 min');
  assert.equal(SRS.describe({ due: NOW + DAY }, NOW), '1 day');
  assert.equal(SRS.describe({ due: NOW + 60 * DAY }, NOW), '2 months');
  assert.deepEqual(SRS.preview(null, NOW).map((p) => p.when), ['10 min', '1 day', '1 day', '4 days']);
});

test('legacy box records convert to equivalent states', () => {
  const ms = [0, 1, 3, 7, 16, 35].map((d) => d * DAY);
  assert.equal(SRS.fromLegacy({ box: 0, missed: 2, due: NOW }, ms).lapses, 2);
  assert.equal(SRS.fromLegacy({ box: 4, due: NOW }, ms).ivl, 16);
  const plain = SRS.fromLegacy({ t: NOW, last: true }, ms);
  assert.equal(plain.ivl, 3); assert.equal(plain.due, NOW + 3 * DAY);
});
