/* Pure grading logic for questions and performance-based questions (PBQs).
   Works in the browser (window.Grading) and in Node (module.exports) for automated tests. */
(function (G) {
  'use strict';

  function norm(v) { return String(v == null ? '' : v).trim().toLowerCase().replace(/\s+/g, ' '); }
  G.norm = norm;

  /* ---------- Multiple choice / multiple response ---------- */
  G.correctIdx = function (q) {
    var out = [];
    q.o.forEach(function (o, i) { if (o[2]) out.push(i); });
    return out;
  };
  G.isCorrect = function (q, selected) {
    var ans = G.correctIdx(q), sel = (selected || []).slice().sort();
    return sel.length === ans.length && ans.every(function (i) { return sel.indexOf(i) >= 0; });
  };

  /* ---------- Firewall ACL ---------- */
  function addrMatch(pbq, ruleVal, hostId) {
    if (ruleVal === 'ANY' || ruleVal === hostId) return true;
    var a = pbq.addr[ruleVal];
    return !!(a && a.contains && a.contains.indexOf(hostId) >= 0);
  }
  G.fwRuleMatches = function (pbq, rule, pkt) {
    if (rule.proto !== 'ANY' && rule.proto !== pkt.proto) return false;
    if (!addrMatch(pbq, rule.src, pkt.src)) return false;
    if (!addrMatch(pbq, rule.dst, pkt.dst)) return false;
    if (rule.proto === 'ICMP' || pkt.proto === 'ICMP') return true;
    return rule.port === 'ANY' || String(rule.port) === String(pkt.port);
  };
  // First match wins; no match falls through to the implicit deny.
  G.fwEvaluate = function (pbq, rules, pkt) {
    for (var i = 0; i < rules.length; i++) {
      if (G.fwRuleMatches(pbq, rules[i], pkt)) return { action: rules[i].action, rule: i };
    }
    return { action: 'DENY', rule: -1 };
  };
  G.gradeFirewall = function (pbq, state) {
    var rules = state.rules || [];
    var items = pbq.tests.map(function (t) {
      var r = G.fwEvaluate(pbq, rules, t);
      var ok = r.action === t.expect;
      var hit = r.rule < 0 ? 'the implicit deny' : 'rule ' + (r.rule + 1);
      return {
        ok: ok,
        label: t.desc,
        detail: (ok ? 'Correct: ' : 'Incorrect: ') + 'traffic was ' + (r.action === 'ALLOW' ? 'allowed' : 'denied') + ' by ' + hit +
          '; it should be ' + (t.expect === 'ALLOW' ? 'allowed' : 'denied') + '. ' + (t.why || '')
      };
    });
    var maxRules = pbq.maxRules || 99;
    if (rules.length > maxRules) {
      items.push({ ok: false, label: 'Rule set is concise', detail: 'You used ' + rules.length + ' rules; this task can be completed with ' + maxRules + ' or fewer. Extra rules make an ACL harder to audit.' });
    }
    return finish(items);
  };

  /* ---------- Permission matrix ---------- */
  G.gradeMatrix = function (pbq, state) {
    var cells = state.cells || {}, items = [];
    pbq.rows.forEach(function (r) {
      pbq.cols.forEach(function (c) {
        var key = r.id + ':' + c.id, exp = pbq.expect[key];
        if (!exp) return;
        var val = cells[key] || pbq.levels[0];
        var ok = exp.ok.indexOf(val) >= 0;
        items.push({ ok: ok, label: r.label + ' → ' + c.label, detail: (ok ? 'Correct (' + val + '). ' : 'You chose "' + val + '"; acceptable: ' + exp.ok.join(' or ') + '. ') + (exp.why || '') });
      });
    });
    return finish(items);
  };

  /* ---------- Drag-and-drop placement ---------- */
  G.gradePlacement = function (pbq, state) {
    var place = state.place || {};
    var items = pbq.tokens.map(function (t) {
      var where = place[t.id] || null, accept = t.accept || [];
      var ok = accept.length === 0 ? where === null : accept.indexOf(where) >= 0;
      var zoneLabel = function (z) { var zz = pbq.zones.find(function (x) { return x.id === z; }); return zz ? zz.label : z; };
      var detail;
      if (ok) detail = accept.length ? 'Correct: placed in ' + zoneLabel(where) + '. ' : 'Correct: this item does not belong anywhere in this design. ';
      else if (accept.length === 0) detail = 'This item is a distractor and should not be placed. ';
      else detail = (where ? 'Placed in ' + zoneLabel(where) : 'Not placed') + '; best location: ' + accept.map(zoneLabel).join(' or ') + '. ';
      return { ok: ok, label: t.label, detail: detail + (t.why || '') };
    });
    return finish(items);
  };

  /* ---------- Ordering (items with equal rank are interchangeable) ---------- */
  G.gradeOrdering = function (pbq, state) {
    var order = state.order || pbq.items.map(function (i) { return i.id; });
    var sorted = pbq.items.slice().sort(function (a, b) { return a.rank - b.rank; });
    var range = {};
    sorted.forEach(function (it, pos) {
      var r = range[it.rank] || (range[it.rank] = { min: pos, max: pos });
      r.min = Math.min(r.min, pos); r.max = Math.max(r.max, pos);
    });
    var items = order.map(function (id, pos) {
      var it = pbq.items.find(function (x) { return x.id === id; });
      var r = range[it.rank];
      var ok = pos >= r.min && pos <= r.max;
      var where = r.min === r.max ? 'position ' + (r.min + 1) : 'positions ' + (r.min + 1) + '–' + (r.max + 1);
      return { ok: ok, label: (pos + 1) + '. ' + it.label, detail: (ok ? 'Correct position. ' : 'Belongs in ' + where + '. ') + (it.why || '') };
    });
    return finish(items);
  };

  /* ---------- Log analysis: flag evidence + answer questions ---------- */
  G.gradeLogs = function (pbq, state) {
    var flags = state.flags || [], answers = state.answers || {}, items = [];
    var bad = pbq.lines.filter(function (l) { return l.bad; });
    var tp = 0, fp = 0;
    pbq.lines.forEach(function (l) {
      var flagged = flags.indexOf(l.id) >= 0;
      if (l.bad && flagged) tp++;
      if (!l.bad && flagged) {
        fp++;
        items.push({ ok: false, counts: false, label: 'Flagged benign entry: ' + l.text.slice(0, 70) + (l.text.length > 70 ? '…' : ''), detail: l.why || 'This entry is normal activity.' });
      }
      if (l.bad && !flagged) items.push({ ok: false, counts: false, label: 'Missed indicator: ' + l.text.slice(0, 70) + (l.text.length > 70 ? '…' : ''), detail: l.why || '' });
    });
    var evidenceScore = Math.max(0, tp - fp);
    items.unshift({
      ok: evidenceScore === bad.length ? true : evidenceScore > 0 ? 'partial' : false,
      weight: bad.length, earned: evidenceScore,
      label: 'Evidence selection',
      detail: tp + ' of ' + bad.length + ' malicious entries flagged, ' + fp + ' benign entr' + (fp === 1 ? 'y' : 'ies') + ' wrongly flagged (each false positive cancels one correct flag).'
    });
    (pbq.questions || []).forEach(function (q) { items.push(gradeField(q, answers[q.id])); });
    return finish(items);
  };

  /* ---------- Settings form / numeric answers ---------- */
  function gradeField(f, val) {
    var ok;
    if (f.kind === 'number') {
      var n = parseFloat(String(val).replace(/[$,\s]/g, ''));
      ok = !isNaN(n) && f.accept.some(function (a) { return Math.abs(n - a) <= (f.tol || 0); });
    } else if (f.kind === 'checkbox') {
      ok = f.accept.indexOf(!!val) >= 0;
    } else if (f.kind === 'multi') {
      var sel = (val || []).slice().sort();
      ok = sel.length === f.accept.length && f.accept.every(function (a) { return sel.indexOf(a) >= 0; });
    } else {
      ok = f.accept.some(function (a) { return norm(a) === norm(val); });
    }
    var shown = f.kind === 'checkbox' ? (val ? 'enabled' : 'disabled') : (Array.isArray(val) ? val.join(', ') : (val === undefined || val === '' ? '(blank)' : val));
    var expect = f.kind === 'checkbox' ? (f.accept.length > 1 ? 'either setting' : (f.accept[0] ? 'enabled' : 'disabled')) : f.accept.join(f.kind === 'multi' ? ', ' : ' or ');
    return { ok: ok, label: f.label, detail: (ok ? 'Correct (' + shown + '). ' : 'Your answer: ' + shown + '. Expected: ' + expect + '. ') + (f.why || '') };
  }
  G.gradeField = gradeField;
  G.configFields = function (pbq) {
    var out = [];
    (pbq.groups || []).forEach(function (g) { g.fields.forEach(function (f) { out.push(f); }); });
    return out;
  };
  G.gradeConfig = function (pbq, state) {
    var vals = state.values || {};
    return finish(G.configFields(pbq).map(function (f) { return gradeField(f, vals[f.id]); }));
  };
  G.gradeTerminal = function (pbq, state) {
    var vals = state.answers || {};
    return finish(pbq.questions.map(function (q) { return gradeField(q, vals[q.id]); }));
  };

  function finish(items) {
    var max = 0, earned = 0;
    items.forEach(function (it) {
      if (it.counts === false) return;
      var w = it.weight || 1;
      max += w;
      earned += it.earned !== undefined ? it.earned : (it.ok === true ? w : 0);
    });
    return { items: items, earned: earned, max: max, score: max ? earned / max : 0 };
  }

  G.gradePBQ = function (pbq, state) {
    state = state || {};
    switch (pbq.type) {
      case 'firewall': return G.gradeFirewall(pbq, state);
      case 'matrix': return G.gradeMatrix(pbq, state);
      case 'placement': return G.gradePlacement(pbq, state);
      case 'ordering': return G.gradeOrdering(pbq, state);
      case 'logs': return G.gradeLogs(pbq, state);
      case 'config': return G.gradeConfig(pbq, state);
      case 'terminal': return G.gradeTerminal(pbq, state);
    }
    throw new Error('Unknown PBQ type ' + pbq.type);
  };

  /* A reference state that earns full credit — used to demonstrate a correct solution. */
  G.solutionState = function (pbq) {
    switch (pbq.type) {
      case 'firewall': return { rules: pbq.solution.rules.map(function (r) { return Object.assign({}, r); }) };
      case 'matrix': {
        var cells = {};
        Object.keys(pbq.expect).forEach(function (k) { cells[k] = pbq.expect[k].ok[0]; });
        return { cells: cells };
      }
      case 'placement': {
        var place = {};
        pbq.tokens.forEach(function (t) { place[t.id] = t.accept && t.accept.length ? t.accept[0] : null; });
        return { place: place };
      }
      case 'ordering': return { order: pbq.items.slice().sort(function (a, b) { return a.rank - b.rank; }).map(function (i) { return i.id; }) };
      case 'logs': {
        var ans = {};
        (pbq.questions || []).forEach(function (q) { ans[q.id] = q.kind === 'multi' ? q.accept.slice() : q.accept[0]; });
        return { flags: pbq.lines.filter(function (l) { return l.bad; }).map(function (l) { return l.id; }), answers: ans };
      }
      case 'config': {
        var v = {};
        G.configFields(pbq).forEach(function (f) { v[f.id] = f.kind === 'multi' ? f.accept.slice() : f.accept[0]; });
        return { values: v };
      }
      case 'terminal': {
        var a = {};
        pbq.questions.forEach(function (q) { a[q.id] = q.accept[0]; });
        return { answers: a };
      }
    }
  };

  /* ---------- Simulated shell used by terminal PBQs ---------- */
  G.Shell = function (pbq) {
    this.pbq = pbq;
    this.cwd = pbq.cwd || '/';
    this.history = [];
  };
  G.Shell.prototype.resolve = function (p) {
    if (!p) return this.cwd;
    if (p === '~') p = pbq_home(this);
    var parts = (p[0] === '/' ? p : this.cwd.replace(/\/$/, '') + '/' + p).split('/');
    var out = [];
    parts.forEach(function (s) { if (!s || s === '.') return; if (s === '..') out.pop(); else out.push(s); });
    return '/' + out.join('/');
  };
  function pbq_home(sh) { return sh.pbq.home || '/home/' + (sh.pbq.user || 'analyst'); }
  G.Shell.prototype.isDir = function (p) {
    var pre = p === '/' ? '/' : p + '/';
    return Object.keys(this.pbq.fs).some(function (f) { return f.indexOf(pre) === 0; });
  };
  G.Shell.prototype.list = function (p) {
    var pre = p === '/' ? '/' : p + '/', seen = {};
    Object.keys(this.pbq.fs).forEach(function (f) {
      if (f.indexOf(pre) !== 0) return;
      var rest = f.slice(pre.length), name = rest.split('/')[0];
      seen[name + (rest.indexOf('/') >= 0 ? '/' : '')] = 1;
    });
    return Object.keys(seen).sort();
  };
  G.Shell.prototype.read = function (p) {
    var f = this.resolve(p);
    if (this.pbq.fs[f] !== undefined) return { ok: true, text: this.pbq.fs[f] };
    if (this.isDir(f)) return { ok: false, err: p + ': Is a directory' };
    return { ok: false, err: p + ': No such file or directory' };
  };
  function splitArgs(s) {
    var out = [], re = /"([^"]*)"|'([^']*)'|(\S+)/g, m;
    while ((m = re.exec(s))) out.push(m[1] !== undefined ? m[1] : m[2] !== undefined ? m[2] : m[3]);
    return out;
  }
  function lines(t) { return t === '' ? [] : t.replace(/\n$/, '').split('\n'); }
  G.Shell.prototype.run = function (input) {
    var self = this, line = input.trim();
    if (!line) return '';
    this.history.push(line);
    var canned = this.pbq.canned || {};
    var stages = line.split('|').map(function (s) { return s.trim(); });
    var data = null, out = '';
    for (var i = 0; i < stages.length; i++) {
      var st = stages[i];
      if (canned[st] !== undefined) { data = canned[st]; continue; }
      var args = splitArgs(st), cmd = args.shift();
      var res = self.exec(cmd, args, data);
      if (res.err) return res.err;
      data = res.out;
    }
    out = data == null ? '' : data;
    return out.replace(/\n$/, '');
  };
  G.Shell.prototype.exec = function (cmd, args, stdin) {
    var self = this;
    var flags = args.filter(function (a) { return /^-[a-zA-Z]+$/.test(a); }).join('').replace(/-/g, '');
    var pos = args.filter(function (a) { return !/^-[a-zA-Z]+$/.test(a); });
    function input(idx) {
      if (pos[idx] !== undefined) { var r = self.read(pos[idx]); if (!r.ok) return { err: cmd + ': ' + r.err }; return { text: r.text }; }
      if (stdin != null) return { text: stdin };
      return { err: cmd + ': missing file operand' };
    }
    var inp, ls, n;
    switch (cmd) {
      case 'help':
        return { out: 'Available commands: ls, cd, pwd, cat, head [-n N], tail [-n N], grep [-i] [-v] [-c] PATTERN [FILE], wc -l, sort [-r] [-n], uniq [-c], cut -d C -f N, awk \'{print $N}\', sha256sum FILE, whoami, hostname, clear, history' + (self.pbq.extraHelp ? ', ' + self.pbq.extraHelp : '') + '\nCommands can be chained with |  (example: grep "Failed" /var/log/auth.log | wc -l)' };
      case 'pwd': return { out: self.cwd };
      case 'whoami': return { out: self.pbq.user || 'analyst' };
      case 'hostname': return { out: self.pbq.host || 'host' };
      case 'history': return { out: self.history.map(function (h, i) { return '  ' + (i + 1) + '  ' + h; }).join('\n') };
      case 'cd': {
        var t = self.resolve(pos[0] || '~');
        if (!self.isDir(t)) return { err: 'cd: ' + (pos[0] || '~') + ': No such file or directory' };
        self.cwd = t; return { out: '' };
      }
      case 'ls': {
        var target = self.resolve(pos[0]);
        if (self.pbq.fs[target] !== undefined) return { out: pos[0] };
        if (!self.isDir(target)) return { err: 'ls: cannot access \'' + pos[0] + '\': No such file or directory' };
        ls = self.list(target);
        if (flags.indexOf('l') >= 0) return { out: ls.map(function (f) { var full = target.replace(/\/$/, '') + '/' + f.replace(/\/$/, ''); var meta = (self.pbq.meta || {})[full] || (f.slice(-1) === '/' ? 'drwxr-xr-x root root' : '-rw-r--r-- root root'); return meta + '  ' + f; }).join('\n') };
        return { out: ls.join('  ') };
      }
      case 'cat': inp = input(0); return inp.err ? inp : { out: inp.text };
      case 'head': case 'tail': {
        n = 10;
        var ni = args.indexOf('-n');
        if (ni >= 0) { n = parseInt(args[ni + 1], 10) || 10; pos = args.filter(function (a, i) { return i !== ni && i !== ni + 1; }); }
        inp = input(0); if (inp.err) return inp;
        ls = lines(inp.text);
        return { out: (cmd === 'head' ? ls.slice(0, n) : ls.slice(-n)).join('\n') };
      }
      case 'grep': {
        if (!pos.length) return { err: 'grep: missing pattern' };
        var pat = pos.shift();
        inp = input(0); if (inp.err) return inp;
        var re;
        try { re = new RegExp(pat, flags.indexOf('i') >= 0 ? 'i' : ''); } catch (e) { re = { test: function (s) { return s.indexOf(pat) >= 0; } }; }
        var m = lines(inp.text).filter(function (l) { var hit = re.test(l); return flags.indexOf('v') >= 0 ? !hit : hit; });
        return { out: flags.indexOf('c') >= 0 ? String(m.length) : m.join('\n') };
      }
      case 'wc': inp = input(0); if (inp.err) return inp; return { out: String(lines(inp.text).length) };
      case 'sort': {
        inp = input(0); if (inp.err) return inp;
        ls = lines(inp.text);
        if (flags.indexOf('n') >= 0) ls.sort(function (a, b) { return parseFloat(a) - parseFloat(b); }); else ls.sort();
        if (flags.indexOf('r') >= 0) ls.reverse();
        return { out: ls.join('\n') };
      }
      case 'uniq': {
        inp = input(0); if (inp.err) return inp;
        var res = [];
        lines(inp.text).forEach(function (l) { var last = res[res.length - 1]; if (last && last.l === l) last.c++; else res.push({ l: l, c: 1 }); });
        return { out: res.map(function (r) { return flags.indexOf('c') >= 0 ? ('      ' + r.c).slice(-7) + ' ' + r.l : r.l; }).join('\n') };
      }
      case 'cut': {
        var di = args.indexOf('-d'), fi = args.indexOf('-f');
        var delim = di >= 0 ? args[di + 1] : '\t', field = fi >= 0 ? parseInt(args[fi + 1], 10) : 1;
        var rest = args.filter(function (a, i) { return [di, di + 1, fi, fi + 1].indexOf(i) < 0; });
        pos = rest; inp = input(0); if (inp.err) return inp;
        return { out: lines(inp.text).map(function (l) { return l.split(delim)[field - 1] || ''; }).join('\n') };
      }
      case 'awk': {
        var prog = pos.shift() || '', mm = /print\s+\$(\d+)/.exec(prog);
        if (!mm) return { err: 'awk: this simulator supports only \'{print $N}\'' };
        inp = input(0); if (inp.err) return inp;
        var k = parseInt(mm[1], 10);
        return { out: lines(inp.text).map(function (l) { return k === 0 ? l : (l.trim().split(/\s+/)[k - 1] || ''); }).join('\n') };
      }
      case 'sha256sum': case 'md5sum': {
        if (!pos.length) return { err: cmd + ': missing file operand' };
        var f = self.resolve(pos[0]), h = (self.pbq.hashes || {})[f];
        if (self.pbq.fs[f] === undefined) return { err: cmd + ': ' + pos[0] + ': No such file or directory' };
        return { out: (h || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855') + '  ' + pos[0] };
      }
      default:
        return { err: cmd + ': command not found (type "help" for available commands)' };
    }
  };
})(typeof module !== 'undefined' && module.exports ? module.exports : (window.Grading = {}));
