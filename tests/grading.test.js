const test = require('node:test');
const assert = require('node:assert/strict');
// Values created inside the VM sandbox have different prototypes, so compare structurally via JSON.
const same = (a, b, msg) => assert.equal(JSON.stringify(a), JSON.stringify(b), msg);
const { load } = require('./load');
const { SEC, Grading: G } = load();
const pbq = (id) => SEC.pbqs.find((p) => p.id === id);

test('multiple choice and multiple response grading', () => {
  const mc = { o: [['a', 'x'], ['b', 'x', true], ['c', 'x'], ['d', 'x']] };
  assert.equal(G.isCorrect(mc, [1]), true);
  assert.equal(G.isCorrect(mc, [0]), false);
  const mr = { o: [['a', 'x', true], ['b', 'x', true], ['c', 'x'], ['d', 'x']] };
  assert.equal(G.isCorrect(mr, [1, 0]), true);
  assert.equal(G.isCorrect(mr, [0]), false, 'partial selection is incorrect');
  assert.equal(G.isCorrect(mr, [0, 1, 2]), false, 'extra selection is incorrect');
});

test('firewall: first match wins and implicit deny applies', () => {
  const p = pbq('fw-dmz');
  const rules = [{ action: 'DENY', proto: 'TCP', src: 'ANY', dst: 'WEB', port: '22' }, { action: 'ALLOW', proto: 'TCP', src: 'ADM', dst: 'WEB', port: '22' }];
  same(G.fwEvaluate(p, rules, { proto: 'TCP', src: 'ADM', dst: 'WEB', port: '22' }), { action: 'DENY', rule: 0 });
  same(G.fwEvaluate(p, rules.slice().reverse(), { proto: 'TCP', src: 'ADM', dst: 'WEB', port: '22' }), { action: 'ALLOW', rule: 0 });
  same(G.fwEvaluate(p, [], { proto: 'TCP', src: 'INET', dst: 'WEB', port: '443' }), { action: 'DENY', rule: -1 });
  // Group objects contain hosts.
  assert.equal(G.fwRuleMatches(p, { action: 'ALLOW', proto: 'TCP', src: 'LAN', dst: 'ANY', port: '443' }, { proto: 'TCP', src: 'WS', dst: 'INET', port: '443' }), true);
  assert.equal(G.fwRuleMatches(p, { action: 'ALLOW', proto: 'UDP', src: 'LAN', dst: 'ANY', port: '443' }, { proto: 'TCP', src: 'WS', dst: 'INET', port: '443' }), false);
});

test('firewall: partial credit and alternative valid rule sets', () => {
  const p = pbq('fw-dmz');
  const start = G.gradeFirewall(p, { rules: p.initial });
  assert.ok(start.score > 0 && start.score < 1, 'allow-any earns partial credit only');
  const alt = [
    { action: 'ALLOW', proto: 'TCP', src: 'ANY', dst: 'WEB', port: '443' },
    { action: 'ALLOW', proto: 'TCP', src: 'INET', dst: 'WEB', port: '80' },
    { action: 'ALLOW', proto: 'TCP', src: 'WEB', dst: 'DB', port: '1433' },
    { action: 'ALLOW', proto: 'TCP', src: 'ADM', dst: 'WEB', port: '22' },
    { action: 'ALLOW', proto: 'TCP', src: 'WS', dst: 'INET', port: '443' },
    { action: 'ALLOW', proto: 'TCP', src: 'ADM', dst: 'INET', port: '443' },
    { action: 'ALLOW', proto: 'UDP', src: 'LAN', dst: 'DNS', port: '53' },
    { action: 'DENY', proto: 'ANY', src: 'ANY', dst: 'ANY', port: 'ANY' }
  ];
  assert.equal(G.gradeFirewall(p, { rules: alt }).score, 1, 'a different but valid rule set earns full credit');
  const tooMany = alt.concat(alt.slice(0, 2));
  assert.ok(G.gradeFirewall(p, { rules: tooMany }).score < 1, 'bloated rule sets lose a point');
});

test('ordering: tied ranks are interchangeable, partial credit per position', () => {
  const p = pbq('ir-order');
  const best = G.solutionState(p).order;
  const swapped = best.slice(); const i = swapped.indexOf('d'), j = swapped.indexOf('e');
  [swapped[i], swapped[j]] = [swapped[j], swapped[i]];
  assert.equal(G.gradeOrdering(p, { order: swapped }).score, 1);
  const wrong = best.slice(); [wrong[0], wrong[7]] = [wrong[7], wrong[0]];
  const g = G.gradeOrdering(p, { order: wrong });
  assert.equal(g.earned, 6); assert.equal(g.max, 8);
});

test('placement: distractors must stay unplaced and alternate zones are accepted', () => {
  const p = pbq('control-types');
  const sol = G.solutionState(p);
  sol.place.t12 = 'prev';
  assert.equal(G.gradePlacement(p, sol).score, 1, 'alternate accepted zone');
  const q = pbq('net-placement'); const s2 = G.solutionState(q);
  s2.place.wep = 'edge';
  const g = G.gradePlacement(q, s2);
  assert.ok(g.score < 1 && g.earned === g.max - 1);
});

test('logs: false positives cancel true positives; questions add points', () => {
  const p = pbq('logs-web');
  const bad = p.lines.filter((l) => l.bad).map((l) => l.id);
  const good = p.lines.filter((l) => !l.bad).map((l) => l.id);
  const all = G.gradeLogs(p, { flags: bad.concat(good.slice(0, 2)), answers: {} });
  assert.equal(all.earned, bad.length - 2);
  assert.equal(all.max, bad.length + p.questions.length);
  const flagEverything = G.gradeLogs(p, { flags: p.lines.map((l) => l.id), answers: {} });
  assert.ok(flagEverything.earned < bad.length, 'flagging everything is penalized');
});

test('config: numeric tolerance, currency formatting, checkbox either-way and multi-select', () => {
  const p = pbq('risk-calc');
  const g = G.gradeConfig(p, { values: { sle: '$320,000', aro: '0.25', ale: '80000', ale2: '16,000.00', value: '14000', decision: 'Mitigate', ins: 'Transfer', shut: 'Avoid' } });
  assert.equal(g.score, 1);
  const w = pbq('wifi-config'); const s = G.solutionState(w);
  s.values.bcast = false; s.values.ceap = 'PEAP-MSCHAPv2';
  assert.equal(G.gradeConfig(w, s).score, 1, 'multiple valid settings accepted');
  const a = pbq('auth-logs'); const st = G.solutionState(a);
  st.answers.prev = st.answers.prev.slice(0, 1);
  assert.ok(G.gradeLogs(a, st).score < 1, 'multi-select needs both');
});

test('shell supports pipes, grep flags, sort/uniq and errors', () => {
  const p = { fs: { '/home/u/a.log': 'x 1\ny 2\nx 3\n', '/home/u/b.txt': 'b\na\nb\n' }, user: 'u', cwd: '/home/u', home: '/home/u' };
  const sh = new G.Shell(p);
  assert.equal(sh.run('grep -c x a.log'), '2');
  assert.equal(sh.run('grep -v x a.log'), 'y 2');
  assert.equal(sh.run('cat b.txt | sort | uniq -c'), '      1 a\n      2 b');
  assert.equal(sh.run("awk '{print $2}' a.log | sort -rn | head -n 1"), '3');
  assert.equal(sh.run('cut -d " " -f 1 a.log | uniq'), 'x\ny\nx');
  assert.match(sh.run('cat nope.txt'), /No such file/);
  assert.match(sh.run('rm -rf /'), /command not found/);
  sh.run('cd ..'); assert.equal(sh.run('pwd'), '/home');
});
