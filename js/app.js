/* Security+ Study Lab — application shell, routing and views. */
(function () {
  'use strict';
  var main = document.getElementById('main');
  var NUM = ['zero', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];
  var DIFF = { 1: 'Foundation', 2: 'Intermediate', 3: 'Advanced' };
  var PBQ_TYPE_LABEL = { firewall: 'Firewall configuration', matrix: 'Permission assignment', placement: 'Drag and drop', ordering: 'Ordering', logs: 'Log analysis', config: 'Configuration', terminal: 'Simulated terminal' };
  var timerHandle = null;

  /* ---------------- utilities ---------------- */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function fmt(s) {
    return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }
  // Escapes text but keeps the few inline tags used in authored explanations.
  function richText(s) { return esc(s).replace(/&lt;(\/?)(code|strong|em)&gt;/g, '<$1$2>'); }
  function pct(x) { return x === null || x === undefined || isNaN(x) ? '—' : Math.round(x * 100) + '%'; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function qById(id) { return SEC.questions.find(function (q) { return q.id === id; }); }
  function pbqById(id) { return SEC.pbqs.find(function (p) { return p.id === id; }); }
  function $(sel, root) { return (root || main).querySelector(sel); }
  function $$(sel, root) { return [].slice.call((root || main).querySelectorAll(sel)); }
  function toast(msg) {
    var t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._h); toast._h = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function objLabel(id) { var o = SEC.objById(id); return id + ' ' + (o ? o.title.replace(/\.$/, '') : ''); }
  function domainBadge(objId) { var d = SEC.domainOf(objId); return '<span class="badge dom" style="--dc:' + d.color + '">Domain ' + d.id + '</span>'; }
  function statusBadge(st) {
    var map = { new: ['Not started', 'st-new'], started: ['Started', 'st-started'], weak: ['Needs work', 'st-weak'], developing: ['Developing', 'st-dev'], strong: ['Strong', 'st-strong'] };
    var m = map[st] || map.new; return '<span class="badge ' + m[1] + '">' + m[0] + '</span>';
  }
  function bar(v, color, label) {
    return '<div class="bar" role="img" aria-label="' + esc(label || '') + ' ' + pct(v) + '"><span style="width:' + (v ? Math.round(v * 100) : 0) + '%;' + (color ? 'background:' + color : '') + '"></span></div>';
  }
  function fmtTime(sec) { sec = Math.max(0, Math.floor(sec)); var m = Math.floor(sec / 60), s = sec % 60; return m + ':' + (s < 10 ? '0' : '') + s; }
  function fmtDate(t) { return new Date(t).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }); }
  function setTitle(t) { document.title = t ? t + ' · Security+ Study Lab' : 'Security+ Study Lab'; }

  /* ---------------- question selection ---------------- */
  // Prefers unseen questions, then ones answered wrong, then the least recently seen. Mixes difficulty levels.
  function pickQuestions(objs, n, opts) {
    opts = opts || {};
    var D = Store.data.q, exclude = opts.exclude || [];
    var pool = SEC.questions.filter(function (q) { return objs.indexOf(q.obj) >= 0 && exclude.indexOf(q.id) < 0 && (!opts.diff || q.d === opts.diff); });
    var tiers = [[], [], []];
    pool.forEach(function (q) {
      var r = D[q.id];
      if (!r) tiers[0].push(q); else if (r.last === false) tiers[1].push(q); else tiers[2].push(q);
    });
    tiers[2].sort(function (a, b) { return D[a.id].t - D[b.id].t; });
    var picked = shuffle(tiers[0]).concat(shuffle(tiers[1]), tiers[2]).slice(0, n);
    return shuffle(picked).map(function (q) { return q.id; });
  }
  // Domain-weighted selection across the whole bank.
  function pickWeighted(n, opts) {
    var out = [];
    var counts = SEC.domains.map(function (d) { return { d: d, n: Math.round(n * d.weight / 100) }; });
    var diff = n - counts.reduce(function (a, c) { return a + c.n; }, 0);
    counts.sort(function (a, b) { return b.d.weight - a.d.weight; });
    for (var i = 0; diff !== 0; i = (i + 1) % counts.length) { counts[i].n += diff > 0 ? 1 : -1; diff += diff > 0 ? -1 : 1; }
    counts.forEach(function (c) {
      var objs = SEC.objectives.filter(function (o) { return o.id.split('.')[0] === c.d.id; }).map(function (o) { return o.id; });
      out = out.concat(pickQuestions(objs, c.n, opts));
    });
    return shuffle(out);
  }
  function optionOrder(q) { return shuffle(q.o.map(function (_, i) { return i; })); }

  /* ---------------- practice sessions ---------------- */
  function startPractice(cfg) {
    var qids = cfg.qids;
    if (!qids.length) { toast('No questions available for that selection.'); return; }
    var orders = {};
    qids.forEach(function (id) { orders[id] = optionOrder(qById(id)); });
    Store.data.practice = { id: Date.now(), mode: cfg.mode || 'practice', title: cfg.title, qids: qids, idx: 0, answers: {}, orders: orders, back: cfg.back || '#/test', objs: cfg.objs || [] };
    Store.save();
    go('#/practice');
  }
  function practiceObjective(objId, n) {
    startPractice({ title: 'Topic practice: ' + objLabel(objId), qids: pickQuestions([objId], n || 10), back: '#/learn/' + objId, objs: [objId] });
  }
  function startReview() {
    var due = Store.dueReview().slice(0, 15);
    var objs = [];
    due.forEach(function (id) { var q = qById(id); if (q && objs.indexOf(q.obj) < 0) objs.push(q.obj); });
    var fresh = objs.length ? pickQuestions(objs, Math.max(3, Math.ceil(due.length / 2)), { exclude: due }).filter(function (id) { return !Store.data.q[id]; }) : [];
    var qids = shuffle(due.filter(qById).concat(fresh.slice(0, 8)));
    if (!qids.length) { toast('Nothing is due for review right now.'); return; }
    startPractice({ mode: 'review', title: 'Spaced review (' + due.length + ' due + ' + Math.min(fresh.length, 8) + ' fresh)', qids: qids, objs: objs });
  }

  /* ---------------- router ---------------- */
  function parseHash() {
    var h = location.hash.replace(/^#\/?/, ''), q = {};
    var parts = h.split('?');
    if (parts[1]) parts[1].split('&').forEach(function (kv) { var p = kv.split('='); q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); });
    return { segs: parts[0].split('/').filter(Boolean), query: q };
  }
  function route() {
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    var r = parseHash(), s = r.segs, view = s[0] || 'home';
    $$('[data-nav]', document).forEach(function (a) {
      var nav = a.dataset.nav;
      var on = nav === view || (nav === 'learn' && view === 'lesson') || (nav === 'test' && ['practice', 'exam', 'results', 'pbq'].indexOf(view) >= 0);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    var views = { home: viewHome, learn: s[1] ? viewLesson : viewLearn, test: viewTest, practice: viewPractice, exam: viewExam, results: viewResults, pbq: s[1] ? viewPBQ : viewTest, progress: viewProgress, about: viewAbout };
    (views[view] || viewHome)(s, r.query);
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }

  /* ================= DASHBOARD ================= */
  function viewHome() {
    setTitle('Dashboard');
    var D = Store.data, answered = 0, correct = 0;
    Object.keys(D.q).forEach(function (k) { answered += D.q[k].n; correct += D.q[k].c; });
    var lessonsDone = SEC.objectives.filter(function (o) { return D.lessons[o.id] && D.lessons[o.id].done; }).length;
    var pbqDone = Object.keys(D.pbq).length;
    var due = Store.dueReview().length;
    var rd = Store.readiness();
    var recs = Store.recommendations(4);
    var h = versionBanner();
    if (D.activeExam && !D.activeExam.submitted) h += '<div class="callout warn"><strong>Mock exam in progress.</strong> The timer kept running while you were away. <a class="btn" href="#/exam">Resume exam</a></div>';
    if (D.practice && D.practice.idx < D.practice.qids.length && Object.keys(D.practice.answers).length) h += '<div class="callout"><strong>Unfinished practice:</strong> ' + esc(D.practice.title) + ' <a class="btn secondary" href="#/practice">Continue</a></div>';
    h += '<section class="hero"><div><h1>Learn it, then prove it.</h1><p class="lead">Lessons build each Security+ concept from first principles, then questions, performance-based labs and spaced review lock it in.</p>' +
      '<div class="row wrap"><a class="btn big" href="#/learn">Open Lecture</a><a class="btn big secondary" href="#/test">Open Test center</a></div></div></section>';
    h += '<section class="stats-grid">' +
      stat('Questions answered', answered, answered ? pct(correct / answered) + ' correct overall' : 'Start with a lesson or a quick quiz') +
      stat('Lessons completed', lessonsDone + ' / ' + SEC.objectives.length, 'One lesson per exam objective') +
      stat('PBQs attempted', pbqDone + ' / ' + SEC.pbqs.length, 'Hands-on simulations') +
      stat('Review due', due, due ? '<a href="#" data-act="review">Start spaced review →</a>' : nextReviewText()) + '</section>';
    h += '<section class="grid2"><div class="card"><h2>Recommended next</h2>' + (recs.length ? '<ul class="rec-list">' + recs.map(recItem).join('') + '</ul>' : '<p>Every objective is currently rated strong. Take a full mock exam to confirm.</p>') + '<p><a href="#/progress">See all objectives →</a></p></div>' +
      '<div class="card"><h2>Domain mastery</h2>' + SEC.domains.map(function (d) {
        var s = Store.domainStats(d.id);
        return '<div class="dom-row"><div class="dom-name"><span class="dot" style="background:' + d.color + '"></span>' + d.id + '. ' + esc(d.title) + ' <span class="muted small">(' + d.weight + '% of exam)</span></div>' + bar(s.mastery, d.color, 'Domain ' + d.id + ' mastery') + '<div class="small muted">' + (s.n ? pct(s.acc) + ' of ' + s.n + ' answers correct · ' : '') + Math.round(s.coverage * 100) + '% of objectives practiced</div></div>';
      }).join('') + '</div></section>';
    h += '<section class="card readiness"><h2>Practice readiness indicator <span class="badge">Estimate, not a score prediction</span></h2>' +
      '<div class="readiness-row"><div class="big-num">' + (rd.coverage > 0 ? pct(rd.value) : '—') + '</div><div>' + bar(rd.value, null, 'Readiness') +
      '<p class="small">This number blends your recent accuracy and PBQ results, weighted by each domain\'s share of the exam, and is reduced for objectives you haven\'t practiced yet (coverage: ' + pct(rd.coverage) + ').</p>' +
      '<p class="small muted">It measures your performance on <strong>this app\'s practice items only</strong>. It is not converted to CompTIA\'s 100–900 scale and does not predict your official result. CompTIA scales scores and weights items in ways it does not publish.</p></div></div></section>';
    main.innerHTML = h;
    bindCommon();
  }
  function stat(label, val, sub) { return '<div class="stat card"><div class="stat-label">' + label + '</div><div class="stat-val">' + val + '</div><div class="stat-sub small">' + sub + '</div></div>'; }
  function nextReviewText() { var t = Store.nextReviewTime(); return t === Infinity ? 'Missed questions return here on a schedule' : 'Next item due ' + fmtDate(t); }
  function recItem(r) {
    var why = r.stats.status === 'weak' ? 'Mastery ' + pct(r.stats.mastery) + ': needs work' : r.stats.status === 'developing' ? 'Developing (' + pct(r.stats.mastery) + ' mastery)' : r.stats.n ? 'Only ' + r.stats.n + ' answer' + (r.stats.n === 1 ? '' : 's') + ' so far' : (r.lessonDone ? 'Lesson done, not yet practiced' : 'Not started');
    return '<li><div><strong>' + esc(objLabel(r.obj.id)) + '</strong><div class="small muted">' + why + ' · Domain ' + r.obj.id[0] + ' (' + SEC.domainOf(r.obj.id).weight + '%)</div></div>' +
      '<div class="row"><a class="btn small secondary" href="#/learn/' + r.obj.id + '">Lesson</a><button class="btn small" data-practice="' + r.obj.id + '">Practice</button></div></li>';
  }
  function versionBanner() {
    var e = SEC.exam;
    return '<div class="version-banner" role="note"><div><strong>Exam version: CompTIA Security+ ' + e.code + '</strong> · ' + e.status + ' (checked ' + e.verifiedOn + ') · ' + e.maxQuestions + ' questions max · ' + e.minutes + ' minutes · passing ' + e.passing + '</div>' +
      '<details><summary>About ' + e.upcoming.code + '</summary><p class="small">' + esc(e.upcoming.note) + '</p></details></div>';
  }
  function bindCommon() {
    $$('[data-practice]').forEach(function (b) { b.addEventListener('click', function () { practiceObjective(b.dataset.practice, +(b.dataset.n || 10)); }); });
    $$('[data-act="review"]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); startReview(); }); });
  }

  /* ================= LECTURE INDEX ================= */
  function viewLearn() {
    setTitle('Lecture');
    var D = Store.data;
    var h = '<h1>Lecture</h1><p class="lead">One lesson per SY0-701 objective, organized by domain. Each lesson defines its terms, uses diagrams and scenarios, includes short knowledge checks, and ends with key takeaways and a direct practice button.</p>';
    SEC.domains.forEach(function (d) {
      var objs = SEC.objectives.filter(function (o) { return o.id[0] === d.id; });
      var done = objs.filter(function (o) { return D.lessons[o.id] && D.lessons[o.id].done; }).length;
      h += '<section class="domain-block" style="--dc:' + d.color + '"><h2><span class="dom-num">' + d.id + '.0</span> ' + esc(d.title) + ' <span class="muted small">' + d.weight + '% of exam · ' + done + '/' + objs.length + ' lessons done</span></h2><ul class="lesson-list">';
      objs.forEach(function (o) {
        var L = SEC.lessons[o.id], st = Store.objStats(o.id), ld = D.lessons[o.id] || {};
        h += '<li><a href="#/learn/' + o.id + '" class="lesson-link"><span class="obj-id">' + o.id + '</span><span class="obj-title">' + esc(L ? L.title : o.title) + '<span class="small muted block">' + esc(o.title) + '</span></span>' +
          '<span class="lesson-meta">' + (ld.done ? '<span class="badge st-strong">✓ Completed</span>' : '') + statusBadge(st.status) + '<span class="small muted">' + (L ? L.minutes + ' min' : '') + '</span></span></a></li>';
      });
      h += '</ul></section>';
    });
    main.innerHTML = h;
  }

  /* ================= LESSON ================= */
  function viewLesson(s) {
    var objId = s[1], L = SEC.lessons[objId], o = SEC.objById(objId);
    if (!L || !o) { main.innerHTML = '<p>Lesson not found. <a href="#/learn">Back to Lecture</a></p>'; return; }
    setTitle(objId + ' ' + L.title);
    var idx = SEC.objectives.indexOf(o), prev = SEC.objectives[idx - 1], next = SEC.objectives[idx + 1];
    var ld = Store.data.lessons[objId] || {};
    var related = SEC.pbqs.filter(function (p) { return p.objs.indexOf(objId) >= 0; });
    var qCount = SEC.questions.filter(function (q) { return q.obj === objId; }).length;
    var h = '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/learn">Lecture</a> › Domain ' + objId[0] + ' › ' + objId + '</nav>';
    h += '<article class="lesson"><header class="lesson-head">' + domainBadge(objId) + ' <span class="badge">Objective ' + objId + '</span> <span class="badge">' + L.minutes + ' min</span>' +
      '<h1>' + esc(L.title) + '</h1><p class="objective-quote"><strong>Exam objective ' + objId + ':</strong> ' + esc(o.title) + '</p>' +
      '<div class="row wrap"><button class="btn" data-practice="' + objId + '">Practice this topic (' + Math.min(10, qCount) + ' questions)</button>' + (related.length ? '<a class="btn secondary" href="#/pbq/' + related[0].id + '">Try a related PBQ</a>' : '') + '</div></header>';
    h += '<div class="lesson-layout"><aside class="toc" aria-label="Lesson contents"><strong>In this lesson</strong><ol>' +
      (L.terms ? '<li><a href="#" data-jump="terms">Key terms</a></li>' : '') +
      L.sections.map(function (sec, i) { return '<li><a href="#" data-jump="sec' + i + '">' + esc(sec.h) + '</a></li>'; }).join('') +
      (L.compare && L.compare.length ? '<li><a href="#" data-jump="compare">Side-by-side comparisons</a></li>' : '') +
      '<li><a href="#" data-jump="takeaways">Key takeaways</a></li></ol><p class="small muted">Covers: ' + o.topics.map(esc).join('; ') + '</p></aside><div class="lesson-body">';
    h += '<p class="lead">' + L.intro + '</p>';
    if (L.terms) h += '<section id="terms" class="terms card"><h2>Key terms and acronyms</h2><dl>' + L.terms.map(function (t) { return '<div><dt>' + t[0] + '</dt><dd>' + t[1] + '</dd></div>'; }).join('') + '</dl></section>';
    var checkNo = 0;
    L.sections.forEach(function (sec, i) {
      h += '<section id="sec' + i + '" class="lesson-sec"><h2>' + esc(sec.h) + '</h2>' + sec.body + (sec.diagram || '') + (sec.compare ? compareHTML(sec.compare) : '');
      if (sec.check) { h += checkHTML(sec.check, objId, checkNo, ld.checks && ld.checks[checkNo]); checkNo++; }
      h += '</section>';
    });
    if (L.compare && L.compare.length) h += '<section id="compare" class="lesson-sec"><h2>Side-by-side comparisons</h2>' + L.compare.map(compareHTML).join('') + '</section>';
    h += '<section id="takeaways" class="lesson-sec takeaways card"><h2>Key takeaways</h2><ul>' + L.takeaways.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
      '<div class="row wrap"><button class="btn big" data-practice="' + objId + '">Practice ' + objId + ' now</button>' +
      '<button class="btn secondary" data-practice="' + objId + '" data-n="5">Quick 5-question check</button>' +
      related.map(function (p) { return '<a class="btn secondary" href="#/pbq/' + p.id + '">PBQ: ' + esc(p.title) + '</a>'; }).join('') + '</div>' +
      '<label class="check done-toggle"><input type="checkbox" id="lessonDone"' + (ld.done ? ' checked' : '') + '> Mark this lesson as completed</label></section>';
    h += '<nav class="lesson-nav" aria-label="Lesson navigation">' + (prev ? '<a href="#/learn/' + prev.id + '">← ' + prev.id + ' ' + esc(SEC.lessons[prev.id] ? SEC.lessons[prev.id].title : '') + '</a>' : '<span></span>') +
      (next ? '<a href="#/learn/' + next.id + '">' + next.id + ' ' + esc(SEC.lessons[next.id] ? SEC.lessons[next.id].title : '') + ' →</a>' : '<span></span>') + '</nav>';
    h += '</div></div></article>';
    main.innerHTML = h;
    bindCommon();
    $$('[data-jump]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); var t = document.getElementById(a.dataset.jump); t.scrollIntoView({ behavior: 'smooth' }); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }); });
    $('#lessonDone').addEventListener('change', function (e) { Store.lessonDone(objId, e.target.checked); toast(e.target.checked ? 'Lesson marked complete' : 'Lesson marked incomplete'); });
    $$('.kcheck').forEach(function (box) { bindCheck(box, L, objId); });
  }
  function compareHTML(c) {
    return '<div class="compare"><h3>' + esc(c.title) + '</h3><div class="table-wrap"><table><thead><tr>' + c.head.map(function (x) { return '<th scope="col">' + x + '</th>'; }).join('') + '</tr></thead><tbody>' +
      c.rows.map(function (r) { return '<tr>' + r.map(function (x, i) { return i === 0 ? '<th scope="row">' + x + '</th>' : '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' + (c.note ? '<p class="small">' + c.note + '</p>' : '') + '</div>';
  }
  function checkHTML(ch, objId, n, prior) {
    var multi = ch.o.filter(function (o) { return o[2]; }).length > 1;
    return '<div class="kcheck card" data-check="' + n + '"><div class="kcheck-head">Knowledge check' + (prior === true ? ' <span class="badge st-strong">answered correctly before</span>' : '') + '</div><fieldset><legend>' + fmt(ch.q) + (multi ? ' <span class="badge">Select ' + NUM[ch.o.filter(function (o) { return o[2]; }).length] + '</span>' : '') + '</legend>' +
      ch.o.map(function (o, i) { return '<label class="opt"><input type="' + (multi ? 'checkbox' : 'radio') + '" name="kc' + n + '" value="' + i + '"><span>' + fmt(o[0]) + '</span><div class="opt-why" hidden></div></label>'; }).join('') +
      '</fieldset><button class="btn small" data-checkbtn>Check</button><div class="kfeedback" aria-live="polite"></div></div>';
  }
  function bindCheck(box, L, objId) {
    var n = +box.dataset.check, chk = L.sections.filter(function (s) { return s.check; })[n].check;
    box.querySelector('[data-checkbtn]').addEventListener('click', function () {
      var sel = $$('input:checked', box).map(function (i) { return +i.value; });
      if (!sel.length) { box.querySelector('.kfeedback').textContent = 'Choose an answer first.'; return; }
      var ok = Grading.isCorrect(chk, sel);
      $$('label.opt', box).forEach(function (lab, i) {
        var o = chk.o[i], picked = sel.indexOf(i) >= 0;
        lab.classList.toggle('correct', !!o[2]); lab.classList.toggle('incorrect', picked && !o[2]);
        var w = lab.querySelector('.opt-why'); w.hidden = false; w.innerHTML = (o[2] ? '<strong>Correct option.</strong> ' : '<strong>Not correct.</strong> ') + fmt(o[1]);
      });
      box.querySelector('.kfeedback').innerHTML = ok ? '<p class="good">✓ Correct.</p>' : '<p class="bad">✗ Not quite. Read the explanations above, then continue.</p>';
      Store.lessonCheck(objId, n, ok);
    });
  }

  /* ================= TEST CENTER ================= */
  function viewTest() {
    setTitle('Test center');
    var D = Store.data, due = Store.dueReview().length, missed = Store.missedIds().length;
    var h = '<h1>Test center</h1><p class="lead">Practice mode shows explanations right after each answer. Exam mode saves all feedback until you submit, the way the real exam does.</p>';
    if (D.activeExam && !D.activeExam.submitted) h += '<div class="callout warn"><strong>You have a mock exam in progress.</strong> <a class="btn" href="#/exam">Resume</a> <button class="btn secondary" data-act="abandon">Abandon it</button></div>';
    h += '<div class="test-grid">';
    // Topic practice
    h += '<section class="card"><h2>Topic practice</h2><p class="small">Pick objectives. Questions you haven\'t seen and ones you missed come first.</p><form id="topicForm"><div class="obj-picker">' +
      SEC.domains.map(function (d) {
        return '<fieldset><legend><label class="check"><input type="checkbox" data-domall="' + d.id + '"> <strong>' + d.id + '.0 ' + esc(d.title) + '</strong></label></legend>' +
          SEC.objectives.filter(function (o) { return o.id[0] === d.id; }).map(function (o) {
            var c = SEC.questions.filter(function (q) { return q.obj === o.id; }).length;
            return '<label class="check small"><input type="checkbox" name="obj" value="' + o.id + '" data-dom="' + d.id + '"> ' + o.id + ' ' + esc(o.title) + ' <span class="muted">(' + c + ')</span></label>';
          }).join('') + '</fieldset>';
      }).join('') + '</div><div class="row wrap"><label>Questions <select name="n"><option>5</option><option selected>10</option><option>20</option><option>30</option></select></label>' +
      '<label>Difficulty <select name="diff"><option value="">Mixed</option><option value="1">Foundation</option><option value="2">Intermediate</option><option value="3">Advanced</option></select></label>' +
      '<button class="btn" type="submit">Start practice</button></div></form></section>';
    // Review modes
    h += '<section class="card"><h2>Mixed review</h2><p class="small">Questions drawn from all five domains in proportion to their exam weights, with immediate explanations.</p><div class="row wrap"><button class="btn" data-mixed="20">20 mixed questions</button><button class="btn secondary" data-mixed="40">40 mixed questions</button></div>' +
      '<h2>Spaced review</h2><p class="small">Questions you miss come back after increasing intervals (now, 1, 3, 7, 16 and 35 days), mixed with fresh questions on the same objectives so you have to apply the concept, not just remember an answer.</p>' +
      '<p><strong>' + due + '</strong> item' + (due === 1 ? '' : 's') + ' due now.' + (due ? '' : ' <span class="small muted">' + nextReviewText() + '</span>') + '</p><button class="btn" data-act="review"' + (due ? '' : ' disabled') + '>Start spaced review</button>' +
      '<h2>Missed questions</h2><p class="small">Retry every question whose most recent answer was wrong (' + missed + ').</p><button class="btn secondary" data-act="missed"' + (missed ? '' : ' disabled') + '>Retry missed</button></section>';
    // Mock exams
    var total = SEC.questions.length;
    h += '<section class="card"><h2>Timed mock exams</h2><p class="small">No feedback until you submit. Flag questions for review, move freely between items, and submit when ready (or when time runs out). The timer keeps running if you leave the page.</p>' +
      '<div class="mock-list">' +
      mockCard('full', 'Full-length mock', '4 PBQs + 76 multiple-choice · 90 minutes', 'Domain-weighted like the real exam (90 questions max, 90 minutes).') +
      mockCard('quick', 'Quick mock', '1 PBQ + 24 multiple-choice · 30 minutes', 'A shorter timed set for a single study session.') +
      '<div class="mock"><h3>Domain-focused exam</h3><p class="small">20 questions from one domain · 25 minutes</p><div class="row wrap"><select id="domExam" aria-label="Domain">' + SEC.domains.map(function (d) { return '<option value="' + d.id + '">' + d.id + '. ' + esc(d.title) + '</option>'; }).join('') + '</select><button class="btn secondary" data-exam="domain">Start</button></div></div>' +
      '</div><p class="small muted">Question bank: ' + total + ' original questions and ' + SEC.pbqs.length + ' PBQs.</p></section>';
    // PBQ lab
    h += '<section class="card span2"><h2>Performance-based question lab</h2><p class="small">Hands-on simulations graded with partial credit. Where more than one configuration is valid, the grader checks the result rather than one fixed answer.</p><div class="pbq-grid">' +
      SEC.pbqs.map(function (p) {
        var r = D.pbq[p.id];
        return '<a class="pbq-card" href="#/pbq/' + p.id + '"><span class="badge">' + PBQ_TYPE_LABEL[p.type] + '</span><strong>' + esc(p.title) + '</strong><span class="small muted">Objectives ' + p.objs.join(', ') + ' · ~' + p.minutes + ' min · ' + DIFF[p.d] + '</span>' +
          (r ? '<span class="small">Best ' + pct(r.best) + ' · last ' + pct(r.last) + '</span>' : '<span class="small muted">Not attempted</span>') + '</a>';
      }).join('') + '</div></section>';
    h += '</div>';
    main.innerHTML = h;
    bindCommon();
    var form = $('#topicForm');
    $$('[data-domall]', form).forEach(function (cb) { cb.addEventListener('change', function () { $$('[data-dom="' + cb.dataset.domall + '"]', form).forEach(function (x) { x.checked = cb.checked; }); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var objs = $$('input[name="obj"]:checked', form).map(function (x) { return x.value; });
      if (!objs.length) { toast('Select at least one objective.'); return; }
      var n = +form.n.value, diff = +form.diff.value || null;
      startPractice({ title: 'Topic practice: ' + (objs.length === 1 ? objLabel(objs[0]) : objs.length + ' objectives'), qids: pickQuestions(objs, n, { diff: diff }), objs: objs });
    });
    $$('[data-mixed]').forEach(function (b) { b.addEventListener('click', function () { startPractice({ title: 'Mixed review (' + b.dataset.mixed + ')', qids: pickWeighted(+b.dataset.mixed) }); }); });
    var m = $('[data-act="missed"]'); if (m) m.addEventListener('click', function () { startPractice({ title: 'Retry missed questions', qids: shuffle(Store.missedIds().filter(qById)).slice(0, 30) }); });
    $$('[data-exam]').forEach(function (b) { b.addEventListener('click', function () { startExam(b.dataset.exam, b.dataset.exam === 'domain' ? $('#domExam').value : null); }); });
    var ab = $('[data-act="abandon"]'); if (ab) ab.addEventListener('click', function () { if (confirm('Abandon the exam in progress? It will not be scored.')) { Store.data.activeExam = null; Store.save(); viewTest(); } });
  }
  function mockCard(kind, title, sub, desc) {
    return '<div class="mock"><h3>' + title + '</h3><p class="small"><strong>' + sub + '</strong></p><p class="small muted">' + desc + '</p><button class="btn" data-exam="' + kind + '">Start ' + title.toLowerCase() + '</button></div>';
  }

  /* ================= PRACTICE SESSION ================= */
  function viewPractice() {
    var S = Store.data.practice;
    if (!S) { go('#/test'); return; }
    setTitle('Practice');
    if (S.idx >= S.qids.length) return practiceSummary(S);
    var q = qById(S.qids[S.idx]);
    if (!q) { S.idx++; Store.save(); return viewPractice(); }
    var ans = S.answers[q.id];
    var h = '<div class="session-head"><div><span class="small muted">' + esc(S.title) + '</span><div class="progress-line">' + bar(S.idx / S.qids.length, null, 'Session progress') + '<span class="small">Question ' + (S.idx + 1) + ' of ' + S.qids.length + '</span></div></div>' +
      '<a class="btn small secondary" href="' + S.back + '">Exit</a></div>';
    h += questionCard(q, S.orders[q.id], ans, true);
    h += '<div class="row q-actions">' + (ans ? '<button class="btn big" id="nextBtn">' + (S.idx + 1 < S.qids.length ? 'Next question →' : 'See results') + '</button>' : '<button class="btn big" id="checkBtn" disabled>Check answer</button>') + '</div>';
    main.innerHTML = h;
    var checkBtn = $('#checkBtn');
    if (checkBtn) {
      $$('.qcard input').forEach(function (i) { i.addEventListener('change', function () { checkBtn.disabled = !$$('.qcard input:checked').length; }); });
      checkBtn.addEventListener('click', function () {
        var sel = $$('.qcard input:checked').map(function (i) { return +i.value; });
        if (q.type === 'mr' && sel.length !== Grading.correctIdx(q).length) {
          if (!confirm('This question asks you to select ' + NUM[Grading.correctIdx(q).length] + '. You selected ' + sel.length + '. Check anyway?')) return;
        }
        var ok = Grading.isCorrect(q, sel);
        S.answers[q.id] = { sel: sel, ok: ok };
        Store.recordAnswer(q, ok, S.mode);
        viewPractice();
        var fb = $('#feedback'); if (fb) fb.focus();
      });
    }
    var nb = $('#nextBtn'); if (nb) { nb.addEventListener('click', function () { S.idx++; Store.save(); viewPractice(); }); }
  }
  /* Renders a question. order = display order of option indices. ans = {sel, ok} once answered. */
  function questionCard(q, order, ans, practice) {
    var nCorrect = Grading.correctIdx(q).length, multi = q.type === 'mr';
    var reveal = practice && ans;
    var h = '<article class="qcard"><div class="q-meta">' + domainBadge(q.obj) + '<span class="badge">Objective ' + q.obj + '</span><span class="badge">' + DIFF[q.d] + '</span>' + (multi ? '<span class="badge strong">Select ' + NUM[nCorrect] + '</span>' : '') + (q.s ? '<span class="badge">Scenario</span>' : '') + '</div>';
    if (q.s) h += '<div class="scenario">' + fmt(q.s) + '</div>';
    h += '<fieldset' + (reveal ? ' disabled' : '') + '><legend class="q-text">' + fmt(q.q) + '</legend>';
    order.forEach(function (i, pos) {
      var o = q.o[i], picked = ans && ans.sel.indexOf(i) >= 0, cls = '';
      if (reveal) cls = o[2] ? ' correct' : picked ? ' incorrect' : '';
      h += '<label class="opt' + cls + (picked ? ' picked' : '') + '"><input type="' + (multi ? 'checkbox' : 'radio') + '" name="q" value="' + i + '"' + (picked ? ' checked' : '') + '>' +
        '<span class="opt-letter" aria-hidden="true">' + String.fromCharCode(65 + pos) + '</span><span class="opt-text">' + fmt(o[0]) + '</span>' +
        (reveal ? '<div class="opt-why"><strong>' + (o[2] ? (picked ? '✓ Correct, and you chose it.' : '✓ Correct option (you did not choose it).') : (picked ? '✗ You chose this. It is not correct.' : 'Not correct.')) + '</strong> ' + fmt(o[1]) + '</div>' : '') + '</label>';
    });
    h += '</fieldset>';
    if (reveal) {
      h += '<div id="feedback" class="feedback ' + (ans.ok ? 'good' : 'bad') + '" tabindex="-1" aria-live="polite"><h3>' + (ans.ok ? '✓ Correct' : '✗ Incorrect') + '</h3>' +
        '<p><strong>Why the best answer is best:</strong> ' + fmt(q.ex) + '</p><p class="small"><a href="#/learn/' + q.obj + '">Review lesson ' + q.obj + ' →</a></p></div>';
    }
    return h + '</article>';
  }
  function practiceSummary(S) {
    var ids = S.qids, right = ids.filter(function (id) { return S.answers[id] && S.answers[id].ok; }).length;
    var byObj = {};
    ids.forEach(function (id) { var q = qById(id); var b = byObj[q.obj] || (byObj[q.obj] = { n: 0, c: 0 }); b.n++; if (S.answers[id] && S.answers[id].ok) b.c++; });
    var missedObjs = Object.keys(byObj).filter(function (o) { return byObj[o].c < byObj[o].n; });
    var h = '<h1>Session complete</h1><p class="lead">' + esc(S.title) + '</p><div class="card score-card"><div class="big-num">' + right + ' / ' + ids.length + '</div><div>' + bar(right / ids.length) + '<p>' + pct(right / ids.length) + ' correct in practice mode.</p></div></div>';
    h += '<div class="card"><h2>By objective</h2><div class="table-wrap"><table><thead><tr><th scope="col">Objective</th><th scope="col">This session</th><th scope="col">Overall status</th><th scope="col"></th></tr></thead><tbody>' +
      Object.keys(byObj).sort().map(function (o) { return '<tr><th scope="row">' + esc(objLabel(o)) + '</th><td>' + byObj[o].c + '/' + byObj[o].n + '</td><td>' + statusBadge(Store.objStats(o).status) + '</td><td><a href="#/learn/' + o + '">Lesson</a></td></tr>'; }).join('') + '</tbody></table></div></div>';
    if (missedObjs.length) h += '<div class="callout"><strong>Missed questions were added to spaced review.</strong> They come back immediately in your review queue, then at growing intervals once you get them right. You can also practice fresh questions on the objectives you missed now.<div class="row wrap"><button class="btn" id="freshBtn">Fresh questions on missed objectives</button><button class="btn secondary" data-act="review">Spaced review</button></div></div>';
    h += '<div class="card"><h2>Review your answers</h2>' + ids.map(function (id, i) {
      var q = qById(id), a = S.answers[id];
      return '<details class="review-item"><summary>' + (a && a.ok ? '<span class="good">✓</span>' : '<span class="bad">✗</span>') + ' Q' + (i + 1) + '. ' + esc(q.q.slice(0, 110)) + (q.q.length > 110 ? '…' : '') + '</summary>' + questionCard(q, S.orders[id], a || { sel: [], ok: false }, true) + '</details>';
    }).join('') + '</div>';
    h += '<div class="row wrap"><a class="btn secondary" href="' + S.back + '">Back</a><a class="btn secondary" href="#/test">Test center</a></div>';
    main.innerHTML = h;
    bindCommon();
    var fb = $('#freshBtn');
    if (fb) fb.addEventListener('click', function () {
      var seen = ids;
      var q2 = pickQuestions(missedObjs, 10, { exclude: seen });
      startPractice({ title: 'Fresh questions: ' + missedObjs.join(', '), qids: q2, objs: missedObjs, back: S.back });
    });
  }

  /* ================= EXAM MODE ================= */
  function startExam(kind, dom) {
    var D = Store.data;
    if (D.activeExam && !D.activeExam.submitted && !confirm('Starting a new exam abandons the one in progress. Continue?')) return;
    var qids, pbqs = [], minutes, title;
    var seenInExams = [];
    D.exams.slice(0, 3).forEach(function (e) { seenInExams = seenInExams.concat(e.qids || []); });
    if (kind === 'full') { qids = pickWeighted(76, { exclude: seenInExams }); if (qids.length < 76) qids = pickWeighted(76); pbqs = shuffle(SEC.pbqs).slice(0, 4); minutes = 90; title = 'Full-length mock exam'; }
    else if (kind === 'quick') { qids = pickWeighted(24, { exclude: seenInExams }); pbqs = shuffle(SEC.pbqs).slice(0, 1); minutes = 30; title = 'Quick mock exam'; }
    else {
      var objs = SEC.objectives.filter(function (o) { return o.id[0] === dom; }).map(function (o) { return o.id; });
      qids = pickQuestions(objs, 20); minutes = 25; title = 'Domain ' + dom + ' exam';
    }
    var items = pbqs.map(function (p) { return { t: 'pbq', id: p.id }; }).concat(qids.map(function (id) { return { t: 'q', id: id }; }));
    var orders = {}; qids.forEach(function (id) { orders[id] = optionOrder(qById(id)); });
    D.activeExam = { id: Date.now(), kind: kind, title: title, items: items, orders: orders, answers: {}, pbqStates: {}, flags: {}, idx: 0, start: Date.now(), duration: minutes * 60, submitted: false, reviewScreen: false };
    Store.save();
    go('#/exam');
  }
  function examRemaining(E) { return E.duration - (Date.now() - E.start) / 1000; }
  function itemKey(it) { return it.t + ':' + it.id; }
  function itemAnswered(E, it) {
    if (it.t === 'q') return !!(E.answers[it.id] && E.answers[it.id].length);
    var s = E.pbqStates[it.id];
    return !!s && JSON.stringify(s) !== JSON.stringify(PBQUI.types[pbqById(it.id).type].init(pbqById(it.id)));
  }
  function viewExam() {
    var E = Store.data.activeExam;
    if (!E || E.submitted) { if (Store.data.lastResult) go('#/results'); else go('#/test'); return; }
    setTitle(E.title);
    if (examRemaining(E) <= 0) { submitExam(true); return; }
    var it = E.items[E.idx], n = E.items.length;
    var h = '<div class="exam-bar"><div><strong>' + esc(E.title) + '</strong><span class="small muted"> · Item ' + (E.idx + 1) + ' of ' + n + '</span></div>' +
      '<div class="timer" id="timer" role="timer" aria-label="Time remaining">' + fmtTime(examRemaining(E)) + '</div>' +
      '<div class="row"><button class="btn small secondary" id="flagBtn" aria-pressed="' + !!E.flags[itemKey(it)] + '">' + (E.flags[itemKey(it)] ? '⚑ Flagged' : '⚐ Flag for review') + '</button><button class="btn small" id="reviewBtn">Review &amp; submit</button></div></div>';
    if (E.reviewScreen) h += examReviewScreen(E);
    else {
      if (it.t === 'q') {
        var q = qById(it.id), sel = E.answers[it.id] || [];
        h += questionCard(q, E.orders[it.id], { sel: sel, ok: false }, false);
      } else {
        var p = pbqById(it.id);
        h += '<article class="qcard pbq-exam"><div class="q-meta"><span class="badge strong">Performance-based question</span><span class="badge">' + PBQ_TYPE_LABEL[p.type] + '</span><span class="badge">Objectives ' + p.objs.join(', ') + '</span></div><h2>' + esc(p.title) + '</h2><div class="scenario">' + p.scenario + '</div>' + (p.tasks ? '<ul class="tasks">' + p.tasks.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' : '') + '<div id="pbqMount"></div><p class="small muted">Your work saves automatically. PBQs earn partial credit.</p></article>';
      }
      h += '<div class="row q-actions exam-nav"><button class="btn secondary" id="prevBtn"' + (E.idx === 0 ? ' disabled' : '') + '>← Previous</button><button class="btn" id="nextBtn">' + (E.idx === n - 1 ? 'Review &amp; submit' : 'Next →') + '</button></div>';
      h += '<details class="navigator"><summary>Question navigator</summary>' + navigatorGrid(E) + '</details>';
    }
    main.innerHTML = h;
    if (!E.reviewScreen && it.t === 'pbq') {
      PBQUI.mount($('#pbqMount'), pbqById(it.id), { mode: 'exam', state: E.pbqStates[it.id], onChange: function (s) { E.pbqStates[it.id] = s; Store.save(); } });
    }
    $$('.qcard input[name="q"]').forEach(function (i) {
      i.addEventListener('change', function () { E.answers[it.id] = $$('.qcard input[name="q"]:checked').map(function (x) { return +x.value; }); Store.save(); });
    });
    var fl = $('#flagBtn'); if (fl) fl.addEventListener('click', function () { var k = itemKey(E.items[E.idx]); if (E.reviewScreen) return; E.flags[k] = !E.flags[k]; Store.save(); viewExam(); });
    $('#reviewBtn').addEventListener('click', function () { E.reviewScreen = true; Store.save(); viewExam(); });
    var pb = $('#prevBtn'); if (pb) pb.addEventListener('click', function () { E.idx--; Store.save(); viewExam(); });
    var nb = $('#nextBtn'); if (nb) nb.addEventListener('click', function () { if (E.idx < n - 1) E.idx++; else E.reviewScreen = true; Store.save(); viewExam(); });
    $$('[data-goto]').forEach(function (b) { b.addEventListener('click', function () { E.idx = +b.dataset.goto; E.reviewScreen = false; Store.save(); viewExam(); }); });
    var sb = $('#submitBtn'); if (sb) sb.addEventListener('click', function () {
      var un = E.items.filter(function (x) { return !itemAnswered(E, x); }).length;
      if (confirm((un ? un + ' item(s) are unanswered. ' : '') + 'Submit the exam for scoring? You cannot change answers afterwards.')) submitExam(false);
    });
    var back = $('#backToExam'); if (back) back.addEventListener('click', function () { E.reviewScreen = false; Store.save(); viewExam(); });
    timerHandle = setInterval(function () {
      var r = examRemaining(E), t = document.getElementById('timer');
      if (!t) { clearInterval(timerHandle); return; }
      t.textContent = fmtTime(r);
      t.classList.toggle('low', r < 300);
      if (r <= 0) { clearInterval(timerHandle); submitExam(true); }
    }, 1000);
  }
  function navigatorGrid(E) {
    return '<div class="nav-grid">' + E.items.map(function (it, i) {
      var a = itemAnswered(E, it), f = E.flags[itemKey(it)];
      return '<button class="navcell' + (a ? ' answered' : '') + (f ? ' flagged' : '') + (i === E.idx ? ' current' : '') + '" data-goto="' + i + '" aria-label="Item ' + (i + 1) + (it.t === 'pbq' ? ' (PBQ)' : '') + (a ? ', answered' : ', unanswered') + (f ? ', flagged' : '') + '">' + (it.t === 'pbq' ? 'P' : '') + (i + 1) + (f ? '⚑' : '') + '</button>';
    }).join('') + '</div><p class="small muted legend"><span class="navcell answered sample"></span> answered <span class="navcell sample"></span> unanswered <span class="navcell flagged sample">⚑</span> flagged</p>';
  }
  function examReviewScreen(E) {
    var un = E.items.filter(function (x) { return !itemAnswered(E, x); }).length;
    var fl = E.items.filter(function (x) { return E.flags[itemKey(x)]; }).length;
    return '<section class="card"><h2>Review before submitting</h2><p>' + (E.items.length - un) + ' of ' + E.items.length + ' answered · ' + un + ' unanswered · ' + fl + ' flagged. Select any item to return to it.</p>' + navigatorGrid(E) +
      (fl ? '<h3>Flagged items</h3><ul>' + E.items.map(function (x, i) { if (!E.flags[itemKey(x)]) return ''; var label = x.t === 'q' ? qById(x.id).q : pbqById(x.id).title; return '<li><button class="linklike" data-goto="' + i + '">Item ' + (i + 1) + ': ' + esc(label.slice(0, 90)) + '…</button></li>'; }).join('') + '</ul>' : '') +
      '<div class="row wrap"><button class="btn secondary" id="backToExam">Return to exam</button><button class="btn big" id="submitBtn">Submit exam</button></div></section>';
  }
  function submitExam(timeUp) {
    var E = Store.data.activeExam;
    if (!E || E.submitted) return;
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    E.submitted = true;
    var results = [], earned = 0, max = 0, byDomain = {}, byObj = {};
    function add(objs, e, m) {
      objs.forEach(function (o) {
        var d = o[0];
        var bd = byDomain[d] || (byDomain[d] = { e: 0, m: 0 }); bd.e += e / objs.length; bd.m += m / objs.length;
        var bo = byObj[o] || (byObj[o] = { e: 0, m: 0 }); bo.e += e / objs.length; bo.m += m / objs.length;
      });
    }
    E.items.forEach(function (it) {
      if (it.t === 'q') {
        var q = qById(it.id), sel = E.answers[it.id] || [], ok = sel.length ? Grading.isCorrect(q, sel) : false;
        if (sel.length) Store.recordAnswer(q, ok, 'exam');
        earned += ok ? 1 : 0; max += 1; add([q.obj], ok ? 1 : 0, 1);
        results.push({ t: 'q', id: it.id, sel: sel, ok: ok, flagged: !!E.flags[itemKey(it)] });
      } else {
        var p = pbqById(it.id), st = E.pbqStates[it.id] || PBQUI.types[p.type].init(p);
        // An untouched PBQ scores zero even if its starting configuration would satisfy some checks.
        var g = itemAnswered(E, it) ? Grading.gradePBQ(p, st) : { score: 0 };
        var pts = 3 * g.score;
        Store.recordPBQ(p, g.score, 'exam');
        earned += pts; max += 3; add(p.objs, pts, 3);
        results.push({ t: 'pbq', id: it.id, state: st, score: g.score, attempted: itemAnswered(E, it), flagged: !!E.flags[itemKey(it)] });
      }
    });
    var used = Math.min(E.duration, (Date.now() - E.start) / 1000);
    var res = { id: E.id, date: Date.now(), kind: E.kind, title: E.title, earned: earned, max: max, score: max ? earned / max : 0, byDomain: byDomain, byObj: byObj, used: used, timeUp: !!timeUp, results: results, orders: E.orders, qids: E.items.filter(function (x) { return x.t === 'q'; }).map(function (x) { return x.id; }) };
    Store.data.lastResult = res;
    Store.addExamResult({ id: res.id, date: res.date, kind: res.kind, title: res.title, score: res.score, earned: earned, max: max, byDomain: byDomain, used: used, qids: res.qids });
    Store.data.activeExam = null;
    Store.save();
    if (timeUp) toast('Time is up. Your exam was submitted automatically.');
    go('#/results');
  }

  /* ================= EXAM RESULTS ================= */
  function viewResults() {
    var R = Store.data.lastResult;
    if (!R) { go('#/test'); return; }
    setTitle('Exam results');
    var h = '<h1>' + esc(R.title) + ': results</h1><p class="small muted">' + fmtDate(R.date) + ' · time used ' + fmtTime(R.used) + (R.timeUp ? ' (time expired; submitted automatically)' : '') + '</p>';
    h += '<div class="card score-card"><div class="big-num">' + pct(R.score) + '</div><div><p><strong>' + (Math.round(R.earned * 10) / 10) + ' of ' + R.max + ' points</strong> (multiple-choice = 1 point each; PBQs = 3 points each with partial credit).</p>' + bar(R.score) +
      '<p class="small"><strong>This is a practice percentage, not a predicted CompTIA score.</strong> The real exam reports a scaled score from 100 to 900 (passing is 750). CompTIA doesn\'t publish how raw answers convert to that scale, and its items differ from these practice items. Treat consistent results of 85% or higher across fresh mock exams as a sign you\'re well prepared, not as a guarantee.</p></div></div>';
    h += '<div class="card"><h2>Performance by domain</h2>' + SEC.domains.map(function (d) {
      var b = R.byDomain[d.id]; if (!b) return '';
      return '<div class="dom-row"><div class="dom-name"><span class="dot" style="background:' + d.color + '"></span>' + d.id + '. ' + esc(d.title) + '</div>' + bar(b.e / b.m, d.color, 'Domain ' + d.id) + '<div class="small">' + pct(b.e / b.m) + ' (' + (Math.round(b.e * 10) / 10) + '/' + b.m + ')</div></div>';
    }).join('') + '</div>';
    var weak = Object.keys(R.byObj).filter(function (o) { return R.byObj[o].e / R.byObj[o].m < 0.7; }).sort();
    if (weak.length) h += '<div class="callout"><strong>Objectives below 70% on this exam:</strong> ' + weak.map(function (o) { return '<a href="#/learn/' + o + '">' + o + '</a>'; }).join(', ') + '<div class="row wrap"><button class="btn" id="weakBtn">Practice these objectives</button></div></div>';
    h += '<div class="card"><h2>Item review</h2><div class="row wrap filter-row"><label><input type="radio" name="flt" value="all" checked> All</label><label><input type="radio" name="flt" value="wrong"> Incorrect / partial</label><label><input type="radio" name="flt" value="flag"> Flagged</label></div><div id="itemList">' +
      R.results.map(function (r, i) {
        var cls = (r.t === 'q' ? (r.ok ? 'ok' : 'wrong') : (r.score >= 0.999 ? 'ok' : 'wrong')) + (r.flagged ? ' flag' : '');
        if (r.t === 'q') {
          var q = qById(r.id);
          return '<details class="review-item ' + cls + '"><summary>' + (r.ok ? '<span class="good">✓</span>' : '<span class="bad">✗</span>') + ' ' + (i + 1) + '. ' + (r.flagged ? '⚑ ' : '') + esc(q.q.slice(0, 120)) + (q.q.length > 120 ? '…' : '') + (r.sel.length ? '' : ' <em class="muted">(unanswered)</em>') + '</summary>' + questionCard(q, R.orders[r.id], { sel: r.sel, ok: r.ok }, true) + '</details>';
        }
        var p = pbqById(r.id);
        return '<details class="review-item ' + cls + '" data-pbqres="' + i + '"><summary>' + (r.score >= 0.999 ? '<span class="good">✓</span>' : '<span class="bad">◐</span>') + ' ' + (i + 1) + '. ' + (r.flagged ? '⚑ ' : '') + 'PBQ: ' + esc(p.title) + ' (' + pct(r.score) + ')</summary><div class="pbq-res-slot"></div></details>';
      }).join('') + '</div></div>';
    h += '<div class="row wrap"><a class="btn secondary" href="#/test">Test center</a><a class="btn secondary" href="#/progress">Progress</a></div>';
    main.innerHTML = h;
    $$('[data-pbqres]').forEach(function (d) {
      d.addEventListener('toggle', function () {
        var slot = d.querySelector('.pbq-res-slot'); if (!d.open || slot.childNodes.length) return;
        var r = R.results[+d.dataset.pbqres], p = pbqById(r.id);
        slot.innerHTML = '<div class="scenario">' + p.scenario + '</div><h4>Your submission</h4><div class="pbq-mount"></div><div class="pbq-result"></div>';
        var ctl = PBQUI.mount(slot.querySelector('.pbq-mount'), p, { mode: 'exam', state: r.state });
        ctl.lock(true);
        slot.querySelector('.pbq-result').innerHTML = (r.attempted === false ? '<p class="callout warn">You did not attempt this PBQ during the exam, so it scored 0. The feedback below compares the untouched starting configuration with a correct solution.</p>' : '') + pbqResultHTML(p, Grading.gradePBQ(p, r.state));
        bindSolutionToggle(slot, p, ctl, r.state);
      });
    });
    $$('input[name="flt"]').forEach(function (rb) {
      rb.addEventListener('change', function () {
        $$('#itemList > .review-item').forEach(function (d) {
          d.hidden = rb.value === 'wrong' ? !d.classList.contains('wrong') : rb.value === 'flag' ? !d.classList.contains('flag') : false;
        });
      });
    });
    var wb = $('#weakBtn'); if (wb) wb.addEventListener('click', function () { var ids = pickQuestions(weak, 15, { exclude: R.qids }); if (ids.length < 5) ids = pickQuestions(weak, 15); startPractice({ title: 'Weak objectives from exam', qids: ids, objs: weak }); });
  }

  /* ================= PBQ PAGE ================= */
  function pbqResultHTML(p, g) {
    return '<div class="pbq-score ' + (g.score >= 0.999 ? 'good' : g.score >= 0.6 ? 'mid' : 'bad') + '"><div class="big-num">' + pct(g.score) + '</div><div><strong>' + (Math.round(g.earned * 10) / 10) + ' / ' + g.max + ' points</strong> (partial credit)' + bar(g.score) + '</div></div>' +
      '<h4>Item-by-item feedback</h4><ul class="fb-list">' + g.items.map(function (it) {
        var icon = it.ok === true ? '<span class="good" aria-label="correct">✓</span>' : it.ok === 'partial' ? '<span class="mid" aria-label="partial">◐</span>' : '<span class="bad" aria-label="incorrect">✗</span>';
        return '<li class="' + (it.ok === true ? 'ok' : 'bad') + '">' + icon + ' <strong>' + esc(it.label).replace(/`([^`]+)`/g, '<code>$1</code>') + '</strong><div class="small">' + richText(it.detail) + '</div></li>';
      }).join('') + '</ul>' +
      '<div class="solution"><h4>Step-by-step correct solution</h4><ol>' + p.solution.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' +
      (p.solution.alt ? '<p class="small"><strong>Other valid solutions:</strong> ' + p.solution.alt + '</p>' : '') +
      '<button class="btn secondary" data-showsol>Show a correct configuration in the simulator</button></div>';
  }
  function bindSolutionToggle(scope, p, ctl, mine) {
    var b = scope.querySelector('[data-showsol]'); if (!b) return;
    var showing = false;
    b.addEventListener('click', function () {
      showing = !showing;
      ctl.setState(showing ? Grading.solutionState(p) : mine);
      ctl.lock(true);
      b.textContent = showing ? 'Show my submission again' : 'Show a correct configuration in the simulator';
      toast(showing ? 'Showing a reference solution' : 'Showing your submission');
    });
  }
  function viewPBQ(s) {
    var p = pbqById(s[1]);
    if (!p) { main.innerHTML = '<p>PBQ not found. <a href="#/test">Back</a></p>'; return; }
    setTitle('PBQ: ' + p.title);
    var r = Store.data.pbq[p.id];
    var draftKey = 'pbqdraft:' + p.id;
    var h = '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/test">Test center</a> › PBQ lab</nav><article class="pbq-page"><header><div class="q-meta"><span class="badge strong">Performance-based question</span><span class="badge">' + PBQ_TYPE_LABEL[p.type] + '</span>' +
      p.objs.map(function (o) { return '<a class="badge" href="#/learn/' + o + '">Objective ' + o + '</a>'; }).join('') + '<span class="badge">' + DIFF[p.d] + '</span><span class="badge">~' + p.minutes + ' min</span></div><h1>' + esc(p.title) + '</h1>' +
      (r ? '<p class="small muted">Attempts: ' + r.attempts + ' · best ' + pct(r.best) + ' · last ' + pct(r.last) + '</p>' : '') + '</header>' +
      '<div class="scenario">' + p.scenario + '</div>' + (p.tasks ? '<h2 class="h4">Your tasks</h2><ul class="tasks">' + p.tasks.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' : '') +
      '<div id="pbqMount"></div><div class="row wrap q-actions"><button class="btn big" id="submitPBQ">Submit for grading</button><button class="btn secondary" id="resetPBQ">Reset</button></div><div id="pbqResult" aria-live="polite"></div></article>';
    main.innerHTML = h;
    var draft = null;
    try { draft = JSON.parse(sessionStorage.getItem(draftKey) || 'null'); } catch (e) { draft = null; }
    var mine = null;
    var ctl = PBQUI.mount($('#pbqMount'), p, { mode: 'practice', state: draft, onChange: function (st) { try { sessionStorage.setItem(draftKey, JSON.stringify(st)); } catch (e) { /* storage unavailable */ } } });
    $('#submitPBQ').addEventListener('click', function () {
      mine = ctl.getState();
      var g = Grading.gradePBQ(p, mine);
      Store.recordPBQ(p, g.score, 'practice');
      ctl.lock(true);
      var out = $('#pbqResult');
      out.innerHTML = pbqResultHTML(p, g) + '<div class="row wrap"><button class="btn" id="retryPBQ">Try again</button>' + p.objs.map(function (o) { return '<button class="btn secondary" data-practice="' + o + '">Practice ' + o + ' questions</button>'; }).join('') + '</div>';
      $('#submitPBQ').hidden = true; $('#resetPBQ').hidden = true;
      bindSolutionToggle(out, p, ctl, mine);
      bindCommon();
      $('#retryPBQ').addEventListener('click', function () { ctl.setState(mine); ctl.unlock(); out.innerHTML = ''; $('#submitPBQ').hidden = false; $('#resetPBQ').hidden = false; });
      out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('#resetPBQ').addEventListener('click', function () { if (confirm('Reset this PBQ to its starting state?')) { ctl.reset(); try { sessionStorage.removeItem(draftKey); } catch (e) { /* ignore */ } } });
  }

  /* ================= PROGRESS ================= */
  function viewProgress() {
    setTitle('Progress');
    var D = Store.data, rd = Store.readiness();
    var boxes = [0, 0, 0, 0, 0, 0];
    Object.keys(D.q).forEach(function (id) { var r = D.q[id]; if (r.box !== undefined) boxes[r.box]++; });
    var h = '<h1>Progress</h1>' + (Store.memoryOnly() ? '<div class="callout warn">Your browser is blocking local storage, so progress lasts only until you close this tab. Use Export to keep a copy.</div>' : '<p class="lead">Progress saves automatically in this browser. Use Export/Import to move it to another device.</p>');
    h += '<section class="card"><h2>Practice performance <span class="badge">What you actually scored</span></h2><div class="table-wrap"><table><thead><tr><th scope="col">Domain</th><th scope="col">Weight</th><th scope="col">Answers</th><th scope="col">Accuracy</th><th scope="col">Mastery</th><th scope="col">Coverage</th></tr></thead><tbody>' +
      SEC.domains.map(function (d) { var s = Store.domainStats(d.id); return '<tr><th scope="row">' + d.id + '. ' + esc(d.title) + '</th><td>' + d.weight + '%</td><td>' + s.n + '</td><td>' + pct(s.acc) + '</td><td>' + bar(s.mastery, d.color, 'mastery') + ' ' + pct(s.mastery) + '</td><td>' + pct(s.coverage) + '</td></tr>'; }).join('') + '</tbody></table></div></section>';
    h += '<section class="card"><h2>By objective</h2><p class="small muted">Mastery = recent question accuracy (last 12 answers) blended 75/25 with your latest PBQ scores for that objective. “Needs work” means below 60%; “Developing” means 60–79%.</p><div class="table-wrap"><table class="obj-table"><thead><tr><th scope="col">Objective</th><th scope="col">Lesson</th><th scope="col">Answers</th><th scope="col">Overall</th><th scope="col">Recent</th><th scope="col">PBQ avg</th><th scope="col">Status</th><th scope="col">Actions</th></tr></thead><tbody>' +
      SEC.objectives.map(function (o) {
        var s = Store.objStats(o.id), l = D.lessons[o.id] || {};
        return '<tr><th scope="row"><a href="#/learn/' + o.id + '">' + o.id + '</a> <span class="small">' + esc(o.title) + '</span></th><td>' + (l.done ? '✓' : '—') + '</td><td>' + s.n + '</td><td>' + pct(s.acc) + '</td><td>' + pct(s.recentAcc) + '</td><td>' + pct(s.pbqAvg) + '</td><td>' + statusBadge(s.status) + '</td><td><button class="btn small" data-practice="' + o.id + '">Practice</button></td></tr>';
      }).join('') + '</tbody></table></div></section>';
    h += '<section class="grid2"><div class="card"><h2>PBQ results</h2><div class="table-wrap"><table><thead><tr><th scope="col">PBQ</th><th scope="col">Attempts</th><th scope="col">Best</th><th scope="col">Last</th></tr></thead><tbody>' +
      SEC.pbqs.map(function (p) { var r = D.pbq[p.id]; return '<tr><th scope="row"><a href="#/pbq/' + p.id + '">' + esc(p.title) + '</a></th><td>' + (r ? r.attempts : 0) + '</td><td>' + (r ? pct(r.best) : '—') + '</td><td>' + (r ? pct(r.last) : '—') + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
      '<div class="card"><h2>Spaced review queue</h2><p class="small">Missed questions move up a box each time you answer them correctly in review. Box 5 means mastered and retired.</p><ul class="boxes">' + boxes.map(function (n, i) { return '<li><strong>' + n + '</strong><span class="small">' + (i === 0 ? 'Box 0 · due now' : i === 5 ? 'Mastered' : 'Box ' + i + ' · ' + Math.round(Store.INTERVALS[i] / 86400000) + 'd') + '</span></li>'; }).join('') + '</ul><p>' + Store.dueReview().length + ' due now. <button class="btn small" data-act="review">Start review</button></p>' +
      '<h2>Mock exam history</h2>' + (D.exams.length ? '<div class="table-wrap"><table><thead><tr><th scope="col">Date</th><th scope="col">Exam</th><th scope="col">Practice %</th><th scope="col">Time</th></tr></thead><tbody>' + D.exams.map(function (e) { return '<tr><td>' + fmtDate(e.date) + '</td><td>' + esc(e.title) + '</td><td>' + pct(e.score) + '</td><td>' + fmtTime(e.used) + '</td></tr>'; }).join('') + '</tbody></table></div>' + (D.lastResult ? '<p><a href="#/results">Review the latest exam in detail →</a></p>' : '') : '<p class="small muted">No mock exams yet.</p>') + '</div></section>';
    h += '<section class="card readiness"><h2>Readiness indicator <span class="badge">Estimate, not a score prediction</span></h2><p><strong>' + (rd.coverage ? pct(rd.value) : '—') + '</strong> domain-weighted practice mastery × coverage (' + pct(rd.coverage) + ' of the exam weight practiced).</p><p class="small muted">The practice performance tables above show what you actually scored. This indicator is a heuristic summary of those numbers. It is not an official CompTIA score, a scaled score, or a pass/fail prediction.</p></section>';
    h += '<section class="card"><h2>Your data</h2><div class="row wrap"><button class="btn secondary" id="exportBtn">Export progress (JSON)</button><label class="btn secondary file-btn">Import progress<input type="file" id="importFile" accept="application/json,.json"></label><button class="btn danger" id="resetBtn">Reset all progress</button></div></section>';
    main.innerHTML = h;
    bindCommon();
    $('#exportBtn').addEventListener('click', function () {
      var blob = new Blob([Store.exportJSON()], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'secplus-progress-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a); a.click(); a.remove();
    });
    $('#importFile').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      f.text().then(function (t) { try { Store.importJSON(t); toast('Progress imported'); viewProgress(); } catch (err) { alert(err.message); } });
    });
    $('#resetBtn').addEventListener('click', function () { if (confirm('Erase all progress, review history and exam results? This cannot be undone.')) { Store.reset(); toast('Progress reset'); viewProgress(); } });
  }

  /* ================= ABOUT ================= */
  function viewAbout() {
    setTitle('About');
    var e = SEC.exam;
    var h = '<h1>About this app</h1>' + versionBanner();
    h += '<section class="card"><h2>Exam this app targets</h2><dl class="facts"><div><dt>Exam</dt><dd>' + e.name + ' ' + e.code + ' (' + e.versionLabel + ')</dd></div><div><dt>Status</dt><dd>' + e.status + ', launched ' + e.launched + ' (checked ' + e.verifiedOn + ')</dd></div>' +
      '<div><dt>Format</dt><dd>Up to ' + e.maxQuestions + ' questions, ' + e.minutes + ' minutes; ' + e.questionTypes + '</dd></div><div><dt>Passing score</dt><dd>' + e.passing + '</dd></div>' +
      '<div><dt>Domains</dt><dd>' + SEC.domains.map(function (d) { return d.id + '.0 ' + esc(d.title) + ' (' + d.weight + '%)'; }).join('<br>') + '</dd></div><div><dt>Next version</dt><dd>' + esc(e.upcoming.note) + '</dd></div></dl></section>';
    h += '<section class="card"><h2>How the app works</h2><ul>' +
      '<li><strong>Lecture</strong>: ' + Object.keys(SEC.lessons).length + ' lessons, one per objective, each with key terms, diagrams, scenarios, knowledge checks, comparison tables and takeaways.</li>' +
      '<li><strong>Test</strong>: ' + SEC.questions.length + ' original questions (single answer, multiple response and scenario-based, at three difficulty levels) plus ' + SEC.pbqs.length + ' performance-based simulations.</li>' +
      '<li><strong>Practice mode</strong> explains every option right after you answer. <strong>Exam mode</strong> withholds feedback until you submit and supports flagging and a review screen.</li>' +
      '<li><strong>Spaced review</strong> uses a Leitner schedule (now → 1 → 3 → 7 → 16 → 35 days) and mixes in unseen questions on the same objectives.</li>' +
      '<li>Everything runs locally in your browser. No account, no server and no paid AI API are needed. Progress stays in this browser\'s local storage.</li></ul></section>';
    h += '<section class="card"><h2>Content and scoring disclaimer</h2><p>All lessons, questions and simulations are original practice material written for these objectives. They are not exam dumps and are not copied from CompTIA or any exam provider. This app is not affiliated with or endorsed by CompTIA.</p><p>Practice percentages and the readiness indicator describe your performance on this app\'s items only. They are not converted to CompTIA\'s scaled score and are not predictions of an official result.</p></section>';
    main.innerHTML = h;
  }

  /* ---------------- theme + boot ---------------- */
  function applyTheme() {
    var t = Store.data.settings.theme;
    if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme');
  }
  document.getElementById('themeToggle').addEventListener('click', function () {
    var cur = Store.data.settings.theme || (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    Store.data.settings.theme = cur === 'dark' ? 'light' : 'dark'; Store.save(); applyTheme();
  });
  document.getElementById('versionPill').textContent = SEC.exam.code;
  applyTheme();
  window.addEventListener('hashchange', route);
  route();

  // Exposed for automated tests.
  window.App = { pickQuestions: pickQuestions, pickWeighted: pickWeighted, startExam: startExam, submitExam: submitExam, practiceObjective: practiceObjective };
})();
