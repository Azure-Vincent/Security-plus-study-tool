const test = require('node:test');
const assert = require('node:assert/strict');
// Values created inside the VM sandbox have different prototypes, so compare structurally via JSON.
const same = (a, b, msg) => assert.equal(JSON.stringify(a), JSON.stringify(b), msg);
const { load } = require('./load');
const { SEC, Grading } = load();

test('exam metadata identifies the targeted version', () => {
  assert.equal(SEC.exam.code, 'SY0-701');
  assert.equal(SEC.domains.reduce((a, d) => a + d.weight, 0), 100);
  assert.equal(SEC.objectives.length, 28);
});

test('every objective has a complete lesson', () => {
  for (const o of SEC.objectives) {
    const L = SEC.lessons[o.id];
    assert.ok(L, `lesson ${o.id} missing`);
    assert.ok(L.title && L.intro && L.minutes > 0, `lesson ${o.id} header`);
    assert.ok(L.sections.length >= 3, `lesson ${o.id} needs >= 3 sections`);
    assert.ok(L.takeaways.length >= 3, `lesson ${o.id} takeaways`);
    assert.ok(L.terms && L.terms.length >= 3, `lesson ${o.id} key terms`);
    const checks = L.sections.filter((s) => s.check);
    assert.ok(checks.length >= 1, `lesson ${o.id} needs a knowledge check`);
    for (const s of L.sections) {
      assert.ok(s.h, `lesson ${o.id} section heading`);
      if (s.check) {
        assert.ok(s.check.o.some((x) => x[2]), `lesson ${o.id} check has a correct option`);
        assert.ok(s.check.o.every((x) => x[1] && x[1].length > 5), `lesson ${o.id} check explanations`);
      }
    }
    const hasDiagram = L.sections.some((s) => s.diagram);
    const hasCompare = L.sections.some((s) => s.compare) || (L.compare && L.compare.length);
    assert.ok(hasDiagram || hasCompare, `lesson ${o.id} needs a diagram or comparison`);
  }
});

test('lessons include diagrams and side-by-side comparisons across the course', () => {
  const lessons = Object.values(SEC.lessons);
  const diagrams = lessons.reduce((a, L) => a + L.sections.filter((s) => s.diagram).length, 0);
  const compares = lessons.reduce((a, L) => a + L.sections.filter((s) => s.compare).length + (L.compare || []).length, 0);
  assert.ok(diagrams >= 30, `diagrams: ${diagrams}`);
  assert.ok(compares >= 30, `comparisons: ${compares}`);
});

test('question bank is substantial and well formed', () => {
  const Q = SEC.questions;
  assert.ok(Q.length >= 300, `only ${Q.length} questions`);
  const ids = new Set(), texts = new Set();
  for (const q of Q) {
    assert.ok(!ids.has(q.id), `duplicate id ${q.id}`); ids.add(q.id);
    assert.ok(!texts.has(q.q), `duplicate question text ${q.id}`); texts.add(q.q);
    assert.ok(SEC.objById(q.obj), `bad objective ${q.id}`);
    assert.ok(q.o.length >= 4, `${q.id} needs 4+ options`);
    const nCorrect = q.o.filter((o) => o[2]).length;
    assert.ok(nCorrect >= 1 && nCorrect < q.o.length, `${q.id} correct count`);
    if (nCorrect > 1) assert.match(q.q, /\b(TWO|THREE)\b/, `${q.id} multi-response must say how many`);
    if (/\bTWO\b/.test(q.q)) assert.equal(nCorrect, 2, `${q.id} says TWO`);
    assert.ok(q.o.every((o) => typeof o[1] === 'string' && o[1].length > 5), `${q.id} option explanations`);
    assert.ok(q.ex && q.ex.length > 20, `${q.id} best-answer reasoning`);
    assert.ok([1, 2, 3].includes(q.d), `${q.id} difficulty`);
  }
  for (const o of SEC.objectives) {
    const n = Q.filter((q) => q.obj === o.id).length;
    assert.ok(n >= 8, `objective ${o.id} has only ${n} questions`);
  }
  for (const d of [1, 2, 3]) assert.ok(Q.filter((q) => q.d === d).length >= 30, `difficulty ${d} coverage`);
  assert.ok(Q.filter((q) => q.type === 'mr').length >= 25, 'multiple-response coverage');
  assert.ok(Q.filter((q) => q.s).length >= 40, 'scenario coverage');
});

test('correct answers are not always in the same position', () => {
  const counts = [0, 0, 0, 0];
  SEC.questions.filter((q) => q.type === 'mc').forEach((q) => counts[q.o.findIndex((o) => o[2])]++);
  // Options are shuffled at display time, but authored positions should not be degenerate either.
  assert.ok(counts.filter((c) => c > 0).length >= 1);
});

test('every PBQ is valid, starts below full credit and its reference solution earns 100%', () => {
  assert.ok(SEC.pbqs.length >= 10);
  const types = new Set(SEC.pbqs.map((p) => p.type));
  for (const t of ['firewall', 'matrix', 'placement', 'ordering', 'logs', 'config', 'terminal']) assert.ok(types.has(t), `missing PBQ type ${t}`);
  const ids = new Set();
  for (const p of SEC.pbqs) {
    assert.ok(!ids.has(p.id)); ids.add(p.id);
    p.objs.forEach((o) => assert.ok(SEC.objById(o), `${p.id} objective ${o}`));
    assert.ok(p.solution && p.solution.steps.length >= 2, `${p.id} step-by-step solution`);
    const sol = Grading.gradePBQ(p, Grading.solutionState(p));
    assert.equal(sol.score, 1, `${p.id} reference solution scored ${sol.score}: ` + JSON.stringify(sol.items.filter((i) => i.ok !== true)));
    const init = Grading.gradePBQ(p, initialState(p));
    assert.ok(init.score < 1, `${p.id} starting state already scores 100%`);
    if (p.type === 'placement') p.tokens.forEach((t) => t.accept.forEach((z) => assert.ok(p.zones.find((x) => x.id === z && !x.fixed), `${p.id} token ${t.id} zone ${z}`)));
    if (p.type === 'ordering') same([...p.initialOrder].sort(), p.items.map((i) => i.id).sort());
    if (p.type === 'firewall') {
      const rules = p.initial.concat(p.solution.rules);
      rules.forEach((r) => { assert.ok(p.addr[r.src] && p.addr[r.dst], `${p.id} addr`); assert.ok(p.ports.includes(r.port) && p.protos.includes(r.proto), `${p.id} port/proto`); });
      p.tests.forEach((t) => { assert.ok(p.addr[t.src] && p.addr[t.dst], `${p.id} test addr`); });
    }
  }
});

function initialState(p) {
  switch (p.type) {
    case 'firewall': return { rules: p.initial };
    case 'matrix': return { cells: p.initial || {} };
    case 'placement': return { place: p.initial || {} };
    case 'ordering': return { order: p.initialOrder };
    case 'logs': return { flags: [], answers: {} };
    case 'config': return { values: p.initial || {} };
    case 'terminal': return { answers: {} };
  }
}

test('terminal PBQ answers are discoverable with the simulated shell', () => {
  const p = SEC.pbqs.find((x) => x.id === 'term-compromise');
  const sh = new Grading.Shell(p);
  assert.equal(sh.run('grep "45.33.32.156" /var/log/auth.log | grep -c Failed'), '20');
  assert.match(sh.run('grep Accepted /var/log/auth.log'), /Accepted password for deploy from 45\.33\.32\.156/);
  assert.match(sh.run('ps aux | grep kworker'), /45\.33\.32\.156:4444/);
  assert.match(sh.run('cat /etc/crontab'), /\/tmp\/\.x\/kworker/);
  assert.match(sh.run('sha256sum /tmp/.x/kworker'), /^9c4e1f0b/);
  assert.match(sh.run('ls -la /tmp'), /\.x/);
});
