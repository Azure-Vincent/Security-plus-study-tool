/* Security+ Study Lab — application shell, routing and views. */
(function () {
  'use strict';
  var main = document.getElementById('main');
  var NUM = ['zero', 'one', 'two', 'three', 'four', 'five'];
  var DIFF = { 1: 'Foundation', 2: 'Intermediate', 3: 'Advanced' };
  var PBQ_TYPE_LABEL = { firewall: 'Firewall rules', matrix: 'Permissions', placement: 'Drag and drop', ordering: 'Put in order', logs: 'Log analysis', config: 'Configuration', terminal: 'Terminal' };
  var timerHandle = null, keyHandler = null, scrollHandler = null;

  /* ---------------- icons (24px line icons) ---------------- */
  function svg(paths, size) { return '<svg width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>'; }
  var I = {
    today: '<path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/><circle cx="12" cy="12" r="4"/>',
    learn: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 19.5V5.5"/><path d="M8 7h8M8 11h6"/>',
    practice: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    progress: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    cards: '<rect x="3" y="6" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>',
    review: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 8v4l3 2"/>',
    drill: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    exam: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/>',
    lab: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    read: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
  };
  function icon(n, size) { return svg(I[n], size); }

  /* ---------------- utilities ---------------- */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function fmt(s) { return esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>'); }
  // Escapes text but keeps the few inline tags used in authored explanations.
  function richText(s) { return esc(s).replace(/&lt;(\/?)(code|strong|em)&gt;/g, '<$1$2>'); }
  function pct(x) { return x === null || x === undefined || isNaN(x) ? '–' : Math.round(x * 100) + '%'; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function $(sel, root) { return (root || main).querySelector(sel); }
  function $$(sel, root) { return [].slice.call((root || main).querySelectorAll(sel)); }
  function toast(msg) {
    var t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._h); toast._h = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }
  function go(hash) { if (location.hash === hash) route(); else location.hash = hash; }
  function lessonTitle(id) { var L = SEC.lessons[id]; return L ? L.title : (SEC.objById(id) || {}).title; }
  function fmtTime(sec) { sec = Math.max(0, Math.floor(sec)); var m = Math.floor(sec / 60), s = sec % 60; return m + ':' + (s < 10 ? '0' : '') + s; }
  function fmtDate(t) { return new Date(t).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }); }
  function setTitle(t) { document.title = t ? t + ' | Security+ Study Lab' : 'Security+ Study Lab'; }
  function plural(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
  function meter(v, cls) { return '<div class="meter ' + (cls || '') + '" role="img" aria-label="' + pct(v) + '"><span style="width:' + (v ? Math.round(v * 100) : 0) + '%"></span></div>'; }
  function levelClass(v) { return v === null || v === undefined ? '' : v < 0.6 ? 'bad' : v < 0.8 ? 'mid' : 'good'; }
  var STATUS = { new: ['Not started', 'st-new'], started: ['Started', 'st-started'], weak: ['Needs work', 'st-weak'], developing: ['Developing', 'st-dev'], strong: ['Strong', 'st-strong'] };
  function statusChip(st) { var m = STATUS[st] || STATUS.new; return '<span class="chip ' + m[1] + '">' + m[0] + '</span>'; }

  /* ---------------- question pools ---------------- */
  var QMAP = {};
  SEC.questions.concat(SEC.termQuestions || []).forEach(function (q) { QMAP[q.id] = q; });
  function qById(id) { return QMAP[id]; }
  function pbqById(id) { return SEC.pbqs.find(function (p) { return p.id === id; }); }
  function poolFor(kind) { return kind === 'terms' ? SEC.termQuestions : kind === 'all' ? SEC.questions.concat(SEC.termQuestions) : SEC.questions; }
  function countFor(obj, kind) { return poolFor(kind).filter(function (q) { return q.obj === obj; }).length; }

  // Unseen first, then questions answered wrong, then the least recently seen. The final order is shuffled.
  function pickQuestions(objs, n, opts) {
    opts = opts || {};
    var D = Store.data.q, exclude = opts.exclude || [];
    var pool = poolFor(opts.pool).filter(function (q) { return (!objs || objs.indexOf(q.obj) >= 0) && exclude.indexOf(q.id) < 0 && (!opts.diff || q.d === opts.diff); });
    var tiers = [[], [], []];
    pool.forEach(function (q) { var r = D[q.id]; if (!r) tiers[0].push(q); else if (r.last === false) tiers[1].push(q); else tiers[2].push(q); });
    tiers[2].sort(function (a, b) { return D[a.id].t - D[b.id].t; });
    return shuffle(shuffle(tiers[0]).concat(shuffle(tiers[1]), tiers[2]).slice(0, n).map(function (q) { return q.id; }));
  }
  // Domain-weighted selection across the authored bank.
  function pickWeighted(n, opts) {
    var counts = SEC.domains.map(function (d) { return { d: d, n: Math.round(n * d.weight / 100) }; });
    var diff = n - counts.reduce(function (a, c) { return a + c.n; }, 0);
    counts.sort(function (a, b) { return b.d.weight - a.d.weight; });
    for (var i = 0; diff !== 0; i = (i + 1) % counts.length) { counts[i].n += diff > 0 ? 1 : -1; diff += diff > 0 ? -1 : 1; }
    var out = [];
    counts.forEach(function (c) {
      var objs = SEC.objectives.filter(function (o) { return o.id[0] === c.d.id; }).map(function (o) { return o.id; });
      out = out.concat(pickQuestions(objs, c.n, opts));
    });
    return shuffle(out);
  }
  // Smart practice: due reviews, then weak objectives, then a few term questions, then a domain-weighted fill.
  function smartPick(n) {
    var out = [];
    function add(ids, limit) { var added = 0; ids.forEach(function (id) { if (out.length < n && added < (limit || n) && out.indexOf(id) < 0 && qById(id)) { out.push(id); added++; } }); }
    add(Store.dueReview(), Math.ceil(n * 0.4));
    var weak = Store.recommendations(3).filter(function (r) { return r.stats.status !== 'new'; }).map(function (r) { return r.obj.id; });
    if (weak.length) add(pickQuestions(weak, n, { exclude: out }), Math.ceil(n * 0.3));
    add(pickQuestions(null, n, { pool: 'terms', exclude: out }), Math.round(n * 0.2));
    add(pickWeighted(n, { exclude: out }));
    return shuffle(out);
  }
  function optionOrder(q) { return shuffle(q.o.map(function (_, i) { return i; })); }

  /* ---------------- sessions ---------------- */
  function startSession(cfg) {
    var qids = cfg.qids.filter(qById);
    if (!qids.length) { toast('No questions match that selection.'); return; }
    var orders = {};
    qids.forEach(function (id) { orders[id] = optionOrder(qById(id)); });
    Store.data.practice = { id: Date.now(), mode: cfg.mode || 'practice', title: cfg.title, qids: qids, idx: 0, answers: {}, orders: orders, back: cfg.back || '#/practice', objs: cfg.objs || null, endless: !!cfg.endless, pool: cfg.pool || 'bank', done: false };
    Store.save();
    go('#/session');
  }
  function startSmart(n) { startSession({ title: 'Smart practice', qids: smartPick(n || 10), back: '#/' }); }
  function practiceObjective(objId, n) { startSession({ title: objId + ' ' + lessonTitle(objId), qids: pickQuestions([objId], n || 10, { pool: 'all' }).slice(0, n || 10), back: '#/learn/' + objId, objs: [objId], pool: 'all' }); }
  function startDrill(objs, title) {
    startSession({ title: title || 'Endless drill', qids: pickQuestions(objs, 5, { pool: 'all' }), objs: objs, endless: true, pool: 'all', back: '#/practice' });
  }
  function startReview() {
    var due = Store.dueReview().slice(0, 15);
    var objs = [];
    due.forEach(function (id) { var q = qById(id); if (q && objs.indexOf(q.obj) < 0) objs.push(q.obj); });
    var fresh = objs.length ? pickQuestions(objs, 8, { exclude: due, pool: 'all' }).filter(function (id) { return !Store.data.q[id]; }) : [];
    var qids = shuffle(due.filter(qById).concat(fresh.slice(0, Math.max(3, Math.ceil(due.length / 2)))));
    if (!qids.length) { toast('Nothing is due for review right now.'); return; }
    startSession({ mode: 'review', title: 'Spaced review', qids: qids, objs: objs, pool: 'all' });
  }

  /* ---------------- flashcards ---------------- */
  function cardIds(objs, kind) { return SEC.terms.filter(function (t) { return (!objs || objs.indexOf(t.obj) >= 0) && (!kind || (kind === 'acronym' ? t.acronym : (t.kind || 'term') === kind)); }).map(function (t) { return t.id; }); }
  function cardById(id) { return SEC.terms.find(function (t) { return t.id === id; }); }
  function startCards(objs, title, back, kind) {
    var q = Store.cardQueue(cardIds(objs, kind), 20);
    if (!q.queue.length) { toast('No cards left to study here today.'); return; }
    Store.data.flash = { ids: q.queue.slice(), idx: 0, flipped: false, knew: 0, again: 0, seen: {}, title: title || 'Flashcards', objs: objs || null, kind: kind || null, back: back || '#/practice' };
    Store.save();
    go('#/cards');
  }

  /* ---------------- router ---------------- */
  var NAV = [['today', '#/', 'Today'], ['learn', '#/learn', 'Learn'], ['practice', '#/practice', 'Practice'], ['progress', '#/progress', 'Progress']];
  var curNav = null;
  function renderNav(active) {
    if (active === undefined) active = curNav; else curNav = active;
    var html = NAV.map(function (n) { return '<a href="' + n[1] + '"' + (n[0] === active ? ' aria-current="page"' : '') + '>' + icon(n[0], 22) + '<span>' + n[2] + '</span></a>'; }).join('');
    document.getElementById('railNav').innerHTML = html;
    document.getElementById('tabNav').innerHTML = html;
    var g = Store.todayCount(), goal = Store.goal(), st = Store.streak();
    document.getElementById('railGoal').textContent = g + ' of ' + goal + ' today' + (st > 1 ? ', ' + st + '-day streak' : '');
  }
  function parseHash() {
    var h = location.hash.replace(/^#\/?/, '').split('#')[0], q = {};
    var parts = h.split('?');
    if (parts[1]) parts[1].split('&').forEach(function (kv) { var p = kv.split('='); q[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); });
    return { segs: parts[0].split('/').filter(Boolean), query: q };
  }
  function route() {
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    if (scrollHandler) { window.removeEventListener('scroll', scrollHandler); scrollHandler = null; }
    keyHandler = null; main.onchange = null;
    var r = parseHash(), s = r.segs, view = s[0] || 'today';
    if (view === 'test') view = 'practice';
    var focus = ['session', 'cards', 'exam'].indexOf(view) >= 0;
    document.body.classList.toggle('focus', focus);
    var navKey = { today: 'today', learn: 'learn', practice: 'practice', session: 'practice', cards: 'practice', exam: 'practice', results: 'practice', pbq: 'practice', progress: 'progress' }[view];
    renderNav(navKey);
    var views = { today: viewToday, learn: s[1] ? viewLesson : viewLearn, practice: viewPractice, session: viewSession, cards: viewCards, exam: viewExam, results: viewResults, pbq: s[1] ? viewPBQ : viewPractice, progress: viewProgress, about: viewAbout };
    (views[view] || viewToday)(s, r.query);
    main.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
  document.addEventListener('keydown', function (e) {
    if (!keyHandler || e.altKey || e.ctrlKey || e.metaKey) return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' && e.target.type === 'text' || tag === 'select' || tag === 'textarea') return;
    if (document.getElementById('settings').open) return;
    keyHandler(e);
  });

  function bindCommon(root) {
    $$('[data-practice]', root).forEach(function (b) { b.addEventListener('click', function () { practiceObjective(b.dataset.practice, +(b.dataset.n || 10)); }); });
    $$('[data-cards]', root).forEach(function (b) { b.addEventListener('click', function () {
      var o = b.dataset.cards;
      if (o === 'acronyms') { startCards(null, 'Acronyms', location.hash || '#/', 'acronym'); return; }
      startCards(o ? o.split(',') : null, o ? 'Flashcards: ' + o : 'Flashcards', location.hash || '#/');
    }); });
    $$('[data-act="review"]', root).forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); startReview(); }); });
    $$('[data-smart]', root).forEach(function (b) { b.addEventListener('click', function () { var sel = $('input[name="smartN"]:checked', root); startSmart(sel ? +sel.value : +b.dataset.smart); }); });
    $$('[data-drill]', root).forEach(function (b) { b.addEventListener('click', function () { var o = b.dataset.drill; startDrill(o === 'weak' ? weakObjs() : o ? o.split(',') : null, o === 'weak' ? 'Drill: focus areas' : o ? 'Drill: ' + o : 'Endless drill'); }); });
  }
  function weakObjs() {
    var w = Store.recommendations(4).filter(function (r) { return r.stats.status !== 'new'; }).map(function (r) { return r.obj.id; });
    return w.length ? w : null;
  }

  /* ================= TODAY ================= */
  function ring(done, goal) {
    var r = 48, c = 2 * Math.PI * r, f = Math.min(1, goal ? done / goal : 0);
    return '<svg class="ring" viewBox="0 0 120 120" role="img" aria-label="' + done + ' of ' + goal + ' practice items today"><circle class="track" cx="60" cy="60" r="' + r + '"/>' +
      '<circle class="fill" cx="60" cy="60" r="' + r + '" stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - f)).toFixed(1) + '" transform="rotate(-90 60 60)"/>' +
      '<text x="60" y="62" text-anchor="middle">' + done + '</text><text class="unit" x="60" y="80" text-anchor="middle">of ' + goal + '</text></svg>';
  }
  function nextLesson() {
    var D = Store.data.lessons;
    return SEC.objectives.find(function (o) { return !(D[o.id] && D[o.id].done); });
  }
  function viewToday() {
    setTitle('Today');
    var D = Store.data, done = Store.todayCount(), goal = Store.goal(), streak = Store.streak();
    var answered = Object.keys(D.q).length, due = Store.dueReview().length;
    var cq = Store.cardQueue(cardIds(null), 20), cardsDue = cq.due.length;
    var nl = nextLesson(), recs = Store.recommendations(4).filter(function (r) { return r.stats.status !== 'new'; });
    var h = new Date().getHours(), hello = h < 5 ? 'Studying late' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    var lede = !answered ? 'Start with a short practice set to see where you stand, or open the first lesson.' :
      done >= goal ? 'You reached today’s goal. Anything more is extra practice.' :
      (goal - done) + ' more to reach today’s goal of ' + goal + '.';
    var out = '<div class="page">';
    if (D.activeExam && !D.activeExam.submitted) out += '<div class="notice"><span><strong>Your mock exam is still running.</strong> The timer kept going while you were away.</span><a class="btn sm" href="#/exam">Return to exam</a></div>';
    else if (D.practice && !D.practice.done && D.practice.idx < D.practice.qids.length && Object.keys(D.practice.answers).length) out += '<div class="notice info"><span>You have an unfinished session: ' + esc(D.practice.title) + '.</span><a class="btn sm quiet" href="#/session">Continue</a></div>';
    out += '<div class="today-top"><div><h1>' + hello + '</h1><p class="lede">' + lede + '</p></div>' +
      '<div class="goal">' + ring(done, goal) + '<div class="goal-text"><strong>' + (streak ? plural(streak, 'day') + ' in a row' : 'No streak yet') + '</strong><span>Questions and flashcards count toward your daily goal.</span></div></div></div>';
    out += '<div class="start"><section class="start-main" aria-labelledby="pnow"><div class="stack"><h2 id="pnow">Practice now</h2><p>A mix picked for you: questions due for review, your weakest objectives, and new questions across all five domains.</p></div>' +
      '<div class="row"><div class="seg" role="radiogroup" aria-label="Number of questions">' + [5, 10, 20].map(function (n) { return '<label><input type="radio" name="smartN" value="' + n + '"' + (n === 10 ? ' checked' : '') + '><span>' + n + '</span></label>'; }).join('') + '</div>' +
      '<button class="btn big" data-smart="10">Start practice</button></div></section>' +
      '<div class="start-alt">' +
      '<button class="alt" data-act="review"' + (due ? '' : ' disabled') + '>' + icon('review', 24) + '<span class="alt-text"><strong>Review mistakes</strong><small>' + (due ? 'Questions you missed, back on schedule' : 'Nothing due. Missed questions return here.') + '</small></span><span class="count">' + due + '</span></button>' +
      '<button class="alt" data-cards="">' + icon('cards', 24) + '<span class="alt-text"><strong>Flashcards</strong><small>' + (cardsDue ? cardsDue + ' due, plus new terms' : cq.fresh.length + ' terms not studied yet') + '</small></span><span class="count">' + Math.min(20, cq.queue.length) + '</span></button>' +
      (nl ? '<a class="alt" href="#/learn/' + nl.id + '">' + icon('read', 24) + '<span class="alt-text"><strong>' + (Object.keys(D.lessons).length ? 'Continue reading' : 'Start the first lesson') + '</strong><small>' + nl.id + ' ' + esc(lessonTitle(nl.id)) + '</small></span><span class="count">' + SEC.lessons[nl.id].minutes + 'm</span></a>' : '<a class="alt" href="#/practice">' + icon('exam', 24) + '<span class="alt-text"><strong>All lessons read</strong><small>Try a timed mock exam</small></span><span></span></a>') +
      '</div></div>';
    if (recs.length) {
      out += '<section class="section"><div class="section-head"><h2>Focus areas</h2><button class="btn quiet sm" data-drill="weak">Drill these</button></div><ul class="rows focus-list">' + recs.map(function (r) {
        return '<li><div class="rowlink"><span class="id">' + r.obj.id + '</span><span><span class="t">' + esc(lessonTitle(r.obj.id)) + '</span><span class="sub">' + statusChip(r.stats.status) + ' ' + (r.stats.n ? plural(r.stats.n, 'answer') : '') + '</span></span>' + meter(r.stats.mastery, levelClass(r.stats.mastery)) +
          '<span class="end"><a class="btn ghost sm" href="#/learn/' + r.obj.id + '">Read</a><button class="btn quiet sm" data-practice="' + r.obj.id + '">Practice</button></span></div></li>';
      }).join('') + '</ul></section>';
    }
    var act = Store.activity(14);
    var maxA = Math.max.apply(null, act.map(function (a) { return a.n; }).concat([1]));
    out += '<section class="section two"><div><h2>Domains</h2><p class="muted small" style="margin:.3rem 0 1rem">Recent accuracy on each domain, weighted like the exam.</p><div class="domain-bars">' + SEC.domains.map(function (d) {
      var st = Store.domainStats(d.id);
      return '<div class="dbar"><div class="name">' + esc(d.title) + '<span>' + d.weight + '% of exam</span></div>' + meter(st.mastery, levelClass(st.mastery)) + '<span class="v">' + pct(st.mastery) + '</span></div>';
    }).join('') + '</div></div>' +
      '<div><h2>Last two weeks</h2><p class="muted small" style="margin:.3rem 0 1rem">Questions and flashcards per day.</p><div class="activity" role="img" aria-label="Daily practice over the last 14 days">' + act.map(function (a) { return '<span class="' + (a.n ? '' : 'zero') + '" style="height:' + Math.max(6, Math.round(a.n / maxA * 100)) + '%" title="' + a.day + ': ' + a.n + '"></span>'; }).join('') + '</div><div class="activity-axis"><span>2 weeks ago</span><span>Today</span></div>' +
      (D.exams.length ? '<p style="margin-top:1.4rem">Last mock exam: <strong>' + pct(D.exams[0].score) + '</strong> on ' + esc(D.exams[0].title.toLowerCase()) + '. <a href="#/progress">See history</a></p>' : '<p class="muted" style="margin-top:1.4rem">No mock exams yet. <a href="#/practice#exams">Try a quick 30-minute one</a> when you feel ready.</p>') + '</div></section>';
    out += versionNote() + '</div>';
    main.innerHTML = out;
    bindCommon();
  }
  function versionNote() {
    var e = SEC.exam;
    return '<details class="version-note"><summary>Exam version: CompTIA Security+ ' + e.code + '</summary><p style="margin-top:.6rem">' + e.status + ', checked ' + e.verifiedOn + '. Up to ' + e.maxQuestions + ' questions in ' + e.minutes + ' minutes; passing score ' + e.passing + '.</p><p style="margin-top:.6rem">' + esc(e.upcoming.note) + '</p></details>';
  }

  /* ================= LEARN ================= */
  function viewLearn() {
    setTitle('Learn');
    var D = Store.data, read = SEC.objectives.filter(function (o) { return D.lessons[o.id] && D.lessons[o.id].done; }).length, nl = nextLesson();
    var out = '<div class="page"><div class="learn-top"><div class="phead" style="margin:0"><h1>Learn</h1><p class="lede">One lesson for each of the 28 exam objectives. You have read ' + read + ' of 28.</p></div>' +
      (nl ? '<a class="btn" href="#/learn/' + nl.id + '">Continue with ' + nl.id + '</a>' : '') + '</div>';
    SEC.domains.forEach(function (d) {
      var objs = SEC.objectives.filter(function (o) { return o.id[0] === d.id; });
      out += '<section class="domain"><h2>' + d.id + '. ' + esc(d.title) + ' <span>' + d.weight + '% of the exam</span></h2><ul class="rows">' + objs.map(function (o) {
        var L = SEC.lessons[o.id], st = Store.objStats(o.id), ld = D.lessons[o.id] || {};
        return '<li><a class="rowlink" href="#/learn/' + o.id + '"><span class="id">' + o.id + '</span><span><span class="t">' + esc(L.title) + '</span><span class="sub">' + esc(o.title) + '</span></span><span class="end">' + (ld.done ? '<span class="chip read">Read</span>' : '') + (st.status !== 'new' ? statusChip(st.status) : '') + '<span class="nowrap">' + L.minutes + ' min</span></span></a></li>';
      }).join('') + '</ul></section>';
    });
    main.innerHTML = out + '</div>';
  }

  /* ================= LESSON ================= */
  function viewLesson(s) {
    var objId = s[1], L = SEC.lessons[objId], o = SEC.objById(objId);
    if (!L || !o) { main.innerHTML = '<div class="page"><p>That lesson does not exist. <a href="#/learn">Back to Learn</a></p></div>'; return; }
    setTitle(objId + ' ' + L.title);
    var idx = SEC.objectives.indexOf(o), prev = SEC.objectives[idx - 1], next = SEC.objectives[idx + 1];
    var ld = Store.data.lessons[objId] || {};
    var related = SEC.pbqs.filter(function (p) { return p.objs.indexOf(objId) >= 0; });
    var nQ = countFor(objId, 'all'), nT = SEC.terms.filter(function (t) { return t.obj === objId; }).length;
    var out = '<div class="readbar" aria-hidden="true"><span></span></div><div class="lesson"><article class="lesson-main">';
    out += '<header class="lesson-head"><div class="crumbs"><a href="#/learn">Learn</a> / ' + esc(SEC.domainOf(objId).title) + '</div><h1>' + esc(L.title) + '</h1>' +
      '<p class="objective">Objective ' + objId + ': ' + esc(o.title) + '</p><p class="muted small">' + L.minutes + ' minute read, ' + nQ + ' practice questions, ' + nT + ' flashcards</p>' +
      '<div class="row"><button class="btn" data-practice="' + objId + '">Practice this topic</button><button class="btn quiet" data-cards="' + objId + '">Flashcards</button></div></header>';
    out += '<div class="lesson-body"><p class="lede">' + L.intro + '</p>';
    if (L.terms) out += '<details class="terms" open><summary>Key terms (' + L.terms.length + ')</summary><dl>' + L.terms.map(function (t) { return '<div><dt>' + t[0] + '</dt><dd>' + t[1] + '</dd></div>'; }).join('') + '</dl></details>';
    var checkNo = 0;
    L.sections.forEach(function (sec, i) {
      out += '<section id="sec' + i + '"><h2>' + esc(sec.h) + '</h2>' + sec.body + (sec.diagram || '') + (sec.compare ? compareHTML(sec.compare) : '');
      if (sec.check) { out += checkHTML(sec.check, checkNo, ld.checks && ld.checks[checkNo]); checkNo++; }
      out += '</section>';
    });
    if (L.compare && L.compare.length) out += '<section id="compare"><h2>Side-by-side comparisons</h2>' + L.compare.map(compareHTML).join('') + '</section>';
    out += '<section id="takeaways" class="takeaways"><h2>Key takeaways</h2><ul>' + L.takeaways.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
      '<div class="lesson-practice"><h3>Practice what you just read</h3><div class="row"><button class="btn" data-practice="' + objId + '">10 questions</button><button class="btn quiet" data-drill="' + objId + '">Endless drill</button><button class="btn quiet" data-cards="' + objId + '">' + nT + ' flashcards</button>' +
      related.map(function (p) { return '<a class="btn quiet" href="#/pbq/' + p.id + '">Lab: ' + esc(p.title) + '</a>'; }).join('') + '</div>' +
      '<label class="check"><input type="checkbox" id="lessonDone"' + (ld.done ? ' checked' : '') + '> Mark this lesson as read</label></div></section>';
    out += '<nav class="lesson-nav" aria-label="Lessons">' + (prev ? '<a href="#/learn/' + prev.id + '"><span>Previous</span>' + prev.id + ' ' + esc(SEC.lessons[prev.id].title) + '</a>' : '<span></span>') +
      (next ? '<a href="#/learn/' + next.id + '" style="text-align:right"><span>Next</span>' + next.id + ' ' + esc(SEC.lessons[next.id].title) + '</a>' : '<span></span>') + '</nav>';
    out += '</div></article><aside class="lesson-toc" aria-label="On this page"><strong>On this page</strong><ol>' +
      L.sections.map(function (sec, i) { return '<li><a href="#" data-jump="sec' + i + '">' + esc(sec.h) + '</a></li>'; }).join('') +
      (L.compare && L.compare.length ? '<li><a href="#" data-jump="compare">Comparisons</a></li>' : '') + '<li><a href="#" data-jump="takeaways">Takeaways</a></li></ol></aside></div>';
    main.innerHTML = out;
    bindCommon();
    $$('[data-jump]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); var t = document.getElementById(a.dataset.jump); t.scrollIntoView({ behavior: 'smooth' }); t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }); });
    $('#lessonDone').addEventListener('change', function (e) { Store.lessonDone(objId, e.target.checked); toast(e.target.checked ? 'Marked as read' : 'Marked as unread'); renderNav('learn'); });
    $$('.kcheck').forEach(function (box) { bindCheck(box, L, objId); });
    var bar = $('.readbar span'), tocLinks = $$('.lesson-toc a'), secs = $$('.lesson-body > section');
    scrollHandler = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? Math.min(100, window.scrollY / h * 100) : 0) + '%';
      var cur = null;
      secs.forEach(function (sct) { if (sct.getBoundingClientRect().top < 140) cur = sct.id; });
      tocLinks.forEach(function (a) { a.classList.toggle('on', a.dataset.jump === cur); });
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler();
  }
  function compareHTML(c) {
    return '<div class="compare"><h3>' + esc(c.title) + '</h3><div class="table-wrap"><table><thead><tr>' + c.head.map(function (x) { return '<th scope="col">' + x + '</th>'; }).join('') + '</tr></thead><tbody>' +
      c.rows.map(function (r) { return '<tr>' + r.map(function (x, i) { return i === 0 ? '<th scope="row">' + x + '</th>' : '<td>' + x + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>' + (c.note ? '<p class="note">' + c.note + '</p>' : '') + '</div>';
  }
  function checkHTML(ch, n, prior) {
    var nCorrect = ch.o.filter(function (o) { return o[2]; }).length, multi = nCorrect > 1;
    return '<div class="kcheck" data-check="' + n + '"><div class="kcheck-label">Quick check' + (prior === true ? ' (you answered this correctly before)' : '') + '</div><fieldset><legend>' + fmt(ch.q) + (multi ? ' Choose ' + NUM[nCorrect] + '.' : '') + '</legend><div class="opts">' +
      ch.o.map(function (o, i) { return '<label class="opt' + (multi ? ' multi' : '') + '"><input type="' + (multi ? 'checkbox' : 'radio') + '" name="kc' + n + '" value="' + i + '"><span class="key">' + String.fromCharCode(65 + i) + '</span><span class="txt">' + fmt(o[0]) + '</span><span class="why" hidden></span></label>'; }).join('') +
      '</div></fieldset><button class="btn sm" data-checkbtn>Check answer</button><div class="kfeedback" aria-live="polite"></div></div>';
  }
  function bindCheck(box, L, objId) {
    var n = +box.dataset.check, chk = L.sections.filter(function (s) { return s.check; })[n].check;
    $$('input', box).forEach(function (inp) { inp.addEventListener('change', function () { $$('label.opt', box).forEach(function (l) { l.classList.toggle('picked', l.querySelector('input').checked); }); }); });
    box.querySelector('[data-checkbtn]').addEventListener('click', function () {
      var sel = $$('input:checked', box).map(function (i) { return +i.value; });
      if (!sel.length) { box.querySelector('.kfeedback').textContent = 'Choose an answer first.'; return; }
      var ok = Grading.isCorrect(chk, sel);
      $$('label.opt', box).forEach(function (lab, i) {
        var o = chk.o[i], picked = sel.indexOf(i) >= 0;
        lab.classList.remove('picked');
        lab.classList.toggle('correct', !!o[2]); lab.classList.toggle('incorrect', picked && !o[2]);
        var w = lab.querySelector('.why'); w.hidden = false; w.innerHTML = fmt(o[1]);
      });
      box.querySelector('fieldset').disabled = true;
      box.querySelector('[data-checkbtn]').hidden = true;
      box.querySelector('.kfeedback').innerHTML = ok ? '<span class="good">Correct.</span>' : '<span class="bad">Not quite.</span> The explanations above show why.';
      Store.lessonCheck(objId, n, ok);
    });
  }

  /* ================= QUESTION RENDERING ================= */
  /* order = display order of option indices. ans = {sel, ok} once answered. reveal = show correctness and explanations. */
  function questionHTML(q, order, ans, reveal) {
    var nCorrect = Grading.correctIdx(q).length, multi = q.type === 'mr';
    var h = '<div class="qmeta"><span class="tag">' + q.obj + '</span><span>' + esc(lessonTitle(q.obj)) + '</span>' + (q.gen ? '<span class="tag">' + (q.acr ? 'Acronym quiz' : 'Term quiz') + '</span>' : '<span class="tag">' + DIFF[q.d] + '</span>') + (multi ? '<span class="tag strong">Choose ' + NUM[nCorrect] + '</span>' : '') + '</div>';
    if (q.s) h += '<div class="scenario">' + fmt(q.s) + '</div>';
    var qt = q.gen && !q.acr ? (function () { var p = q.q.split('\n'); return esc(p[0]) + '<span class="quote">' + esc(p.slice(1).join(' ')) + '</span>'; })() : fmt(q.q);
    h += '<fieldset' + (reveal ? ' disabled' : '') + '><legend class="qtext">' + qt + '</legend><div class="opts">';
    order.forEach(function (i, pos) {
      var o = q.o[i], picked = ans && ans.sel.indexOf(i) >= 0, cls = multi ? ' multi' : '';
      if (reveal) cls += o[2] ? ' correct' : picked ? ' incorrect' : '';
      else if (picked) cls += ' picked';
      var whyLead = o[2] ? (picked ? 'Correct, and you chose it.' : (ans && ans.sel.length ? 'This is a correct answer.' : 'Correct answer.')) : (picked ? 'Not correct.' : '');
      h += '<label class="opt' + cls + '"><input type="' + (multi ? 'checkbox' : 'radio') + '" name="q" value="' + i + '"' + (picked ? ' checked' : '') + '><span class="key">' + String.fromCharCode(65 + pos) + '</span><span class="txt">' + fmt(o[0]) + '</span>' +
        (reveal ? '<span class="why">' + (whyLead ? '<b>' + whyLead + '</b> ' : '') + fmt(o[1]) + '</span>' : '') + '</label>';
    });
    h += '</div></fieldset>';
    if (reveal && ans) {
      h += '<div id="feedback" class="feedback ' + (ans.ok ? 'good' : 'bad') + '" tabindex="-1" aria-live="polite"><h3>' + (ans.ok ? 'Correct' : ans.sel.length ? 'Not quite' : 'Not answered') + '</h3>' +
        '<p>' + fmt(q.ex) + '</p><p class="small"><a href="#/learn/' + q.obj + '">Read lesson ' + q.obj + '</a></p></div>';
    }
    return h;
  }
  // Keyboard selection for the visible question: 1-9 or A-E chooses an option by its displayed position.
  function optionKey(e) {
    var k = e.key.toLowerCase(), pos = -1;
    if (/^[1-9]$/.test(k)) pos = +k - 1; else if (/^[a-e]$/.test(k)) pos = k.charCodeAt(0) - 97;
    if (pos < 0) return false;
    var inputs = $$('fieldset:not(:disabled) .opt input');
    if (!inputs[pos]) return false;
    inputs[pos].checked = inputs[pos].type === 'checkbox' ? !inputs[pos].checked : true;
    inputs[pos].dispatchEvent(new Event('change', { bubbles: true }));
    e.preventDefault();
    return true;
  }
  function syncPicked() { $$('.opt').forEach(function (l) { var i = l.querySelector('input'); if (i) l.classList.toggle('picked', i.checked); }); }

  /* ================= PRACTICE SESSION ================= */
  function viewSession() {
    var S = Store.data.practice;
    if (!S) { go('#/practice'); return; }
    setTitle('Practice');
    if (S.endless && S.idx >= S.qids.length && !S.done) extendDrill(S);
    if (S.done || S.idx >= S.qids.length) return sessionSummary(S);
    var q = qById(S.qids[S.idx]);
    if (!q) { S.idx++; Store.save(); return viewSession(); }
    var ans = S.answers[q.id];
    var answered = S.qids.filter(function (id) { return S.answers[id]; }), right = answered.filter(function (id) { return S.answers[id].ok; }).length;
    var track = S.endless ? S.qids.slice(Math.max(0, S.idx - 23), S.idx + 1) : S.qids;
    var h = '<div class="sbar"><button class="icon-btn" id="endBtn" aria-label="End session">' + icon('close', 22) + '</button><span class="title">' + esc(S.title) + '</span>' +
      '<span class="count">' + (S.endless ? answered.length + ' answered, ' + right + ' correct' : 'Question ' + (S.idx + 1) + ' of ' + S.qids.length) + '</span></div>' +
      '<div class="track" aria-hidden="true">' + track.map(function (id) { var a = S.answers[id]; return '<i class="' + (a ? (a.ok ? 'ok' : 'no') : id === q.id ? 'now' : '') + '"></i>'; }).join('') + '</div>';
    h += '<div class="session">' + questionHTML(q, S.orders[q.id], ans, !!ans);
    var canSimilar = ans && !ans.ok && similarFor(S, q);
    h += '<div class="sfoot"><span class="keys">' + (ans ? 'Press <kbd>Enter</kbd> for the next question' : 'Choose with <kbd>1</kbd>–<kbd>' + q.o.length + '</kbd>, then press <kbd>Enter</kbd>') + '</span><div class="row">' +
      (canSimilar ? '<button class="btn quiet" id="similarBtn">Try a similar question</button>' : '') +
      (ans ? '<button class="btn big" id="nextBtn">' + (S.endless || S.idx + 1 < S.qids.length ? 'Next question' : 'See results') + '</button>' : '<button class="btn big" id="checkBtn" disabled>Check answer</button>') + '</div></div></div>';
    main.innerHTML = h;
    var checkBtn = $('#checkBtn');
    function check() {
      var sel = $$('.opt input:checked').map(function (i) { return +i.value; });
      if (!sel.length) return;
      var need = Grading.correctIdx(q).length;
      if (q.type === 'mr' && sel.length !== need && !confirm('This question asks you to choose ' + NUM[need] + '. You chose ' + sel.length + '. Check anyway?')) return;
      var ok = Grading.isCorrect(q, sel);
      S.answers[q.id] = { sel: sel, ok: ok };
      Store.recordAnswer(q, ok, S.mode);
      viewSession(); renderNav('practice');
      var fb = $('#feedback'); if (fb) fb.focus({ preventScroll: false });
    }
    function next() { S.idx++; Store.save(); viewSession(); window.scrollTo(0, 0); }
    if (checkBtn) {
      main.onchange = function () { syncPicked(); checkBtn.disabled = !$$('.opt input:checked').length; };
      checkBtn.addEventListener('click', check);
    }
    var nb = $('#nextBtn'); if (nb) nb.addEventListener('click', next);
    var sb = $('#similarBtn'); if (sb) sb.addEventListener('click', function () {
      var id = similarFor(S, q); if (!id) return;
      S.qids.splice(S.idx + 1, 0, id); S.orders[id] = optionOrder(qById(id)); Store.save();
      toast('Added a similar question next'); next();
    });
    $('#endBtn').addEventListener('click', function () {
      if (!Object.keys(S.answers).length) { var back = S.back; Store.data.practice = null; Store.save(); go(back); return; }
      S.done = true; Store.save(); viewSession();
    });
    keyHandler = function (e) {
      if (e.key === 'Enter') { e.preventDefault(); if (ans) next(); else if (checkBtn && !checkBtn.disabled) check(); return; }
      if (e.key === 'Escape') { $('#endBtn').click(); return; }
      if (!ans) optionKey(e);
    };
  }
  function similarFor(S, q) {
    var ids = pickQuestions([q.obj], 1, { exclude: S.qids, pool: 'all' });
    return ids[0] || null;
  }
  function extendDrill(S) {
    var recent = S.qids.slice(-40);
    var more = pickQuestions(S.objs, 5, { exclude: recent, pool: 'all' });
    if (!more.length) more = pickQuestions(S.objs, 5, { pool: 'all' });
    more.forEach(function (id) { S.qids.push(id); S.orders[id] = optionOrder(qById(id)); });
    Store.save();
  }
  function sessionSummary(S) {
    var ids = S.qids.filter(function (id) { return S.answers[id]; });
    var right = ids.filter(function (id) { return S.answers[id].ok; }).length;
    var byObj = {};
    ids.forEach(function (id) { var q = qById(id); var b = byObj[q.obj] || (byObj[q.obj] = { n: 0, c: 0 }); b.n++; if (S.answers[id].ok) b.c++; });
    var missedObjs = Object.keys(byObj).filter(function (o) { return byObj[o].c < byObj[o].n; }).sort();
    var objs = Object.keys(byObj).sort();
    var out = '<div class="sbar"><a class="icon-btn" href="' + S.back + '" aria-label="Close">' + icon('close', 22) + '</a><span class="title">' + esc(S.title) + '</span><span class="count">Finished</span></div>';
    out += '<div class="session"><h1>' + (ids.length ? (right === ids.length ? 'Every answer correct' : 'Session finished') : 'Nothing answered') + '</h1>';
    if (ids.length) {
      out += '<div class="summary-score"><span class="big">' + right + '/' + ids.length + '</span><div style="flex:1;min-width:12rem">' + meter(right / ids.length, levelClass(right / ids.length)) + '<p class="muted small" style="margin-top:.4rem">' + pct(right / ids.length) + ' correct in practice mode.' + (missedObjs.length ? ' Missed questions come back in spaced review.' : '') + '</p></div></div>';
      out += '<div class="row" style="margin-bottom:2rem">' + (missedObjs.length ? '<button class="btn" id="freshBtn">New questions on what I missed</button>' : '<button class="btn" data-smart="10">Practice 10 more</button>') +
        '<button class="btn quiet" data-cards="' + objs.join(',') + '">Flashcards for these topics</button><a class="btn ghost" href="' + S.back + '">Done</a></div>';
      out += '<h2>By objective</h2><ul class="rows" style="margin:.8rem 0 2rem">' + objs.map(function (o) {
        var b = byObj[o];
        return '<li><div class="rowlink"><span class="id">' + o + '</span><span class="t">' + esc(lessonTitle(o)) + '</span><span class="end"><span class="nowrap">' + b.c + ' of ' + b.n + '</span><a class="btn ghost sm" href="#/learn/' + o + '">Read</a></span></div></li>';
      }).join('') + '</ul>';
      out += '<h2>Your answers</h2><div style="margin-top:.6rem">' + ids.map(function (id, i) {
        var q = qById(id), a = S.answers[id];
        return '<details class="review-item"' + (a.ok ? '' : ' open') + '><summary><span class="mark ' + (a.ok ? 'good' : 'bad') + '">' + (a.ok ? '✓' : '✗') + '</span><span>' + (i + 1) + '. ' + esc(q.q.split('\n')[0].slice(0, 120)) + (q.q.length > 120 ? '…' : '') + '</span></summary><div class="rbody">' + questionHTML(q, S.orders[id], a, true) + '</div></details>';
      }).join('') + '</div>';
    } else out += '<p class="lede muted" style="margin:1rem 0 2rem">You ended the session before answering. <a href="' + S.back + '">Go back</a></p>';
    main.innerHTML = out + '</div>';
    bindCommon();
    var fb = $('#freshBtn');
    if (fb) fb.addEventListener('click', function () { startSession({ title: 'New questions: ' + missedObjs.join(', '), qids: pickQuestions(missedObjs, 10, { exclude: S.qids, pool: 'all' }), objs: missedObjs, back: S.back, pool: 'all' }); });
    keyHandler = function (e) { if (e.key === 'Escape') go(S.back); };
  }

  /* ================= FLASHCARDS ================= */
  function viewCards() {
    var F = Store.data.flash;
    if (!F) { go('#/practice'); return; }
    setTitle('Flashcards');
    var bar = '<div class="sbar"><a class="icon-btn" href="' + F.back + '" id="cardsClose" aria-label="Close flashcards">' + icon('close', 22) + '</a><span class="title">' + esc(F.title) + '</span><span class="count">' + (F.idx < F.ids.length ? 'Card ' + (F.idx + 1) + ' of ' + F.ids.length : 'Finished') + '</span></div>' +
      '<div class="track" aria-hidden="true">' + F.ids.map(function (id, i) { return '<i class="' + (i < F.idx ? 'ok' : i === F.idx ? 'now' : '') + '"></i>'; }).join('') + '</div>';
    if (F.idx >= F.ids.length) {
      main.innerHTML = bar + '<div class="flash"><h1>Deck finished</h1><p class="lede muted" style="margin:.8rem 0 1.6rem">You knew ' + plural(F.knew, 'card') + ' and marked ' + F.again + ' to see again. Cards you know come back after longer and longer gaps.</p>' +
        '<div class="row"><button class="btn" id="moreCards">Study more cards</button>' + (F.objs ? '<button class="btn quiet" id="cardsPractice">Practice questions on these topics</button>' : '<button class="btn quiet" data-smart="10">Practice questions</button>') + '<a class="btn ghost" href="' + F.back + '">Done</a></div></div>';
      bindCommon();
      $('#moreCards').addEventListener('click', function () { startCards(F.objs, F.title, F.back, F.kind); });
      var cp = $('#cardsPractice'); if (cp) cp.addEventListener('click', function () { startSession({ title: 'Practice: ' + F.objs.join(', '), qids: pickQuestions(F.objs, 10, { pool: 'all' }), objs: F.objs, pool: 'all', back: F.back }); });
      keyHandler = function (e) { if (e.key === 'Escape') go(F.back); };
      return;
    }
    var c = cardById(F.ids[F.idx]), rec = Store.data.cards[c.id];
    main.innerHTML = bar + '<div class="flash"><button class="card' + (F.flipped ? ' flipped' : '') + '" id="card" aria-live="polite" aria-label="' + (F.flipped ? 'Definition shown. Press to show the term.' : 'Term shown. Press to reveal the definition.') + '">' +
      (F.flipped ? '<span class="face-term" style="font-size:var(--step-1)">' + esc(c.term) + '</span><span class="face-def">' + esc(c.def) + '</span><span class="hint">From lesson ' + c.obj + ' ' + esc(lessonTitle(c.obj)) + '</span>'
        : '<span class="hint">' + (rec ? 'Review' : c.kind === 'acronym' ? 'New acronym' : 'New term') + '</span><span class="face-term">' + esc(c.term) + '</span><span class="hint">' + (c.kind === 'acronym' ? 'Say what it stands for, then flip the card' : 'Recall what it means, then flip the card') + '</span>') + '</button>' +
      (F.flipped ? '<div class="card-actions"><button class="btn quiet" id="again">Again <kbd>1</kbd></button><button class="btn" id="knew">I knew it <kbd>2</kbd></button></div>' : '<div class="card-actions"><span></span><button class="btn" id="flip">Show definition <kbd>Space</kbd></button></div>') + '</div>';
    function flip() { F.flipped = !F.flipped; Store.save(); viewCards(); $('#card').focus(); }
    function grade(knew) {
      Store.recordCard(c.id, knew); renderNav('practice');
      if (knew) F.knew++; else { F.again++; F.seen[c.id] = (F.seen[c.id] || 0) + 1; if (F.seen[c.id] <= 2) F.ids.push(c.id); }
      F.idx++; F.flipped = false; Store.save(); viewCards();
    }
    $('#card').addEventListener('click', flip);
    var fb = $('#flip'); if (fb) fb.addEventListener('click', flip);
    var a = $('#again'); if (a) a.addEventListener('click', function () { grade(false); });
    var k = $('#knew'); if (k) k.addEventListener('click', function () { grade(true); });
    keyHandler = function (e) {
      if (e.key === ' ' || e.key === 'Enter') { if (e.target.tagName === 'BUTTON' && e.target.id !== 'card') return; e.preventDefault(); flip(); }
      else if (F.flipped && e.key === '1') grade(false);
      else if (F.flipped && e.key === '2') grade(true);
      else if (e.key === 'Escape') go(F.back);
    };
  }

  /* ================= PRACTICE HUB ================= */
  function viewPractice(s, query) {
    setTitle('Practice');
    var D = Store.data, due = Store.dueReview().length, missed = Store.missedIds().filter(qById).length;
    var cq = Store.cardQueue(cardIds(null), 20);
    var total = SEC.questions.length + SEC.termQuestions.length;
    var out = '<div class="page"><div class="phead"><h1>Practice</h1><p class="lede">' + SEC.questions.length + ' exam-style questions, ' + SEC.termQuestions.length + ' term and acronym quizzes, ' + SEC.terms.length + ' flashcards and ' + SEC.pbqs.length + ' hands-on labs. Practice mode explains every answer right away.</p></div>';
    if (D.activeExam && !D.activeExam.submitted) out += '<div class="notice"><span><strong>A mock exam is in progress.</strong></span><div class="row"><a class="btn sm" href="#/exam">Return to exam</a><button class="btn sm quiet" data-act="abandon">Abandon it</button></div></div>';
    out += '<section class="quick" aria-label="Quick start">' +
      '<div class="tile primary"><h3>' + icon('practice') + 'Smart practice</h3><p>Due reviews, your weakest objectives and new questions, mixed for you.</p><div class="row"><div class="seg" role="radiogroup" aria-label="Number of questions">' + [5, 10, 20, 40].map(function (n) { return '<label><input type="radio" name="smartN" value="' + n + '"' + (n === 10 ? ' checked' : '') + '><span>' + n + '</span></label>'; }).join('') + '</div><button class="btn" data-smart="10">Start</button></div></div>' +
      '<div class="tile"><h3>' + icon('drill') + 'Endless drill</h3><p>Questions keep coming until you stop. A good warm-up or a long study block.</p><div class="row"><button class="btn quiet" data-drill="">All topics</button><button class="btn quiet" data-drill="weak">Focus areas</button></div></div>' +
      '<div class="tile"><h3>' + icon('review') + 'Spaced review</h3><p>' + (due ? plural(due, 'missed question') + ' due now, plus fresh questions on the same topics.' : 'Nothing due right now. Missed questions return after 1, 3, 7, 16 and 35 days.') + '</p><div class="row"><button class="btn quiet" data-act="review"' + (due ? '' : ' disabled') + '>Review ' + due + '</button>' + (missed ? '<button class="btn ghost" data-act="missed">Retry all ' + missed + ' missed</button>' : '') + '</div></div>' +
      '<div class="tile"><h3>' + icon('cards') + 'Flashcards</h3><p>' + cq.due.length + ' due and ' + cq.fresh.length + ' new cards: key terms from the lessons and ' + cardIds(null, 'acronym').length + ' exam acronyms.</p><div class="row"><button class="btn quiet" data-cards="">Study ' + cq.queue.length + ' cards</button><button class="btn ghost" data-cards="acronyms">Acronyms only</button></div></div>' +
      '</section>';
    // Topic picker
    out += '<section class="section" id="topics"><div class="section-head"><h2>Choose topics</h2><span class="muted small">Unseen and missed questions come first</span></div><form id="topicForm"><div class="picker">' +
      SEC.domains.map(function (d) {
        var objs = SEC.objectives.filter(function (o) { return o.id[0] === d.id; });
        return '<details><summary><span><label class="check" style="display:inline-flex"><input type="checkbox" data-domall="' + d.id + '" aria-label="Select all of domain ' + d.id + '"> ' + d.id + '. ' + esc(d.title) + '</label></span><span class="sel" data-sel="' + d.id + '"></span></summary><div class="objs">' +
          objs.map(function (o) { return '<label class="check small"><input type="checkbox" name="obj" value="' + o.id + '" data-dom="' + d.id + '"><span>' + o.id + ' ' + esc(lessonTitle(o.id)) + ' <span class="count">(' + countFor(o.id, 'bank') + ' + ' + countFor(o.id, 'terms') + ' terms)</span></span></label>'; }).join('') + '</div></details>';
      }).join('') + '</div><div class="picker-opts">' +
      '<div><span class="small">Length</span><div class="seg" role="radiogroup" aria-label="Length">' + [['5', '5'], ['10', '10'], ['20', '20'], ['0', 'Endless']].map(function (n) { return '<label><input type="radio" name="n" value="' + n[0] + '"' + (n[0] === '10' ? ' checked' : '') + '><span>' + n[1] + '</span></label>'; }).join('') + '</div></div>' +
      '<label><span class="small">Difficulty</span><select name="diff"><option value="">Mixed</option><option value="1">Foundation</option><option value="2">Intermediate</option><option value="3">Advanced</option></select></label>' +
      '<label class="check small"><input type="checkbox" name="terms" checked> Include term quizzes</label>' +
      '<button class="btn" type="submit">Start practice</button></div></form></section>';
    // Exams
    out += '<section class="section" id="exams"><div class="section-head"><h2>Mock exams</h2><span class="muted small">Timed, with feedback after you submit</span></div><ul class="rows exam-rows">' +
      '<li><div class="rowlink"><span><span class="t">Full-length mock</span><span class="sub">4 labs and 76 questions in 90 minutes, weighted like the real exam</span></span><span class="end"><button class="btn quiet" data-exam="full">Start</button></span></div></li>' +
      '<li><div class="rowlink"><span><span class="t">Quick mock</span><span class="sub">1 lab and 24 questions in 30 minutes</span></span><span class="end"><button class="btn quiet" data-exam="quick">Start</button></span></div></li>' +
      '<li><div class="rowlink"><span><span class="t">One domain</span><span class="sub">20 questions in 25 minutes</span></span><span class="end"><select id="domExam" aria-label="Domain">' + SEC.domains.map(function (d) { return '<option value="' + d.id + '">' + d.id + '. ' + esc(d.title) + '</option>'; }).join('') + '</select><button class="btn quiet" data-exam="domain">Start</button></span></div></li></ul></section>';
    // Labs
    out += '<section class="section" id="labs"><div class="section-head"><h2>Hands-on labs</h2><span class="muted small">Performance-based questions with partial credit</span></div><ul class="rows">' +
      SEC.pbqs.map(function (p) {
        var r = D.pbq[p.id];
        return '<li><a class="rowlink" href="#/pbq/' + p.id + '"><span class="id">' + icon('lab') + '</span><span><span class="t">' + esc(p.title) + '</span><span class="sub">' + PBQ_TYPE_LABEL[p.type] + ', objectives ' + p.objs.join(' and ') + ', about ' + p.minutes + ' minutes</span></span><span class="end">' + (r ? '<span class="chip ' + (r.best >= 0.999 ? 'st-strong' : r.best >= 0.6 ? 'st-dev' : 'st-weak') + '">Best ' + pct(r.best) + '</span>' : '<span>Not tried</span>') + '</span></a></li>';
      }).join('') + '</ul></section>';
    main.innerHTML = out + '</div>';
    bindCommon();
    var form = $('#topicForm');
    function updateSel() {
      SEC.domains.forEach(function (d) {
        var all = $$('[data-dom="' + d.id + '"]', form), on = all.filter(function (x) { return x.checked; }).length;
        $('[data-sel="' + d.id + '"]', form).textContent = on ? on + ' of ' + all.length + ' selected' : '';
        var box = $('[data-domall="' + d.id + '"]', form); box.checked = on === all.length; box.indeterminate = on > 0 && on < all.length;
      });
    }
    $$('[data-domall]', form).forEach(function (cb) {
      cb.addEventListener('click', function (e) { e.stopPropagation(); });
      cb.addEventListener('change', function () { $$('[data-dom="' + cb.dataset.domall + '"]', form).forEach(function (x) { x.checked = cb.checked; }); updateSel(); });
    });
    form.addEventListener('change', updateSel);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var objs = $$('input[name="obj"]:checked', form).map(function (x) { return x.value; });
      if (!objs.length) { toast('Choose at least one topic first.'); return; }
      var n = +form.querySelector('input[name="n"]:checked').value, diff = +form.diff.value || null, pool = form.terms.checked ? 'all' : 'bank';
      var title = objs.length === 1 ? objs[0] + ' ' + lessonTitle(objs[0]) : plural(objs.length, 'topic');
      if (!n) startSession({ title: 'Drill: ' + title, qids: pickQuestions(objs, 5, { diff: diff, pool: pool }), objs: objs, endless: true, pool: pool });
      else startSession({ title: title, qids: pickQuestions(objs, n, { diff: diff, pool: pool }), objs: objs, pool: pool });
    });
    var m = $('[data-act="missed"]'); if (m) m.addEventListener('click', function () { startSession({ title: 'Retry missed questions', qids: shuffle(Store.missedIds().filter(qById)).slice(0, 30), pool: 'all' }); });
    $$('[data-exam]').forEach(function (b) { b.addEventListener('click', function () { startExam(b.dataset.exam, b.dataset.exam === 'domain' ? $('#domExam').value : null); }); });
    var ab = $('[data-act="abandon"]'); if (ab) ab.addEventListener('click', function () { if (confirm('Abandon the exam in progress? It will not be scored.')) { Store.data.activeExam = null; Store.save(); viewPractice(); } });
    var anchor = (location.hash.split('#')[2] || query.at || '');
    if (anchor && document.getElementById(anchor)) setTimeout(function () { document.getElementById(anchor).scrollIntoView(); }, 0);
  }

  /* ================= EXAM MODE ================= */
  function startExam(kind, dom) {
    var D = Store.data;
    if (D.activeExam && !D.activeExam.submitted && !confirm('Starting a new exam abandons the one in progress. Continue?')) return;
    var qids, pbqs = [], minutes, title, recent = [];
    D.exams.slice(0, 3).forEach(function (e) { recent = recent.concat(e.qids || []); });
    if (kind === 'full') { qids = pickWeighted(76, { exclude: recent }); if (qids.length < 76) qids = pickWeighted(76); pbqs = shuffle(SEC.pbqs).slice(0, 4); minutes = 90; title = 'Full-length mock exam'; }
    else if (kind === 'quick') { qids = pickWeighted(24, { exclude: recent }); if (qids.length < 24) qids = pickWeighted(24); pbqs = shuffle(SEC.pbqs).slice(0, 1); minutes = 30; title = 'Quick mock exam'; }
    else { qids = pickQuestions(SEC.objectives.filter(function (o) { return o.id[0] === dom; }).map(function (o) { return o.id; }), 20); minutes = 25; title = 'Domain ' + dom + ' exam'; }
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
    var s = E.pbqStates[it.id], p = pbqById(it.id);
    return !!s && JSON.stringify(s) !== JSON.stringify(PBQUI.types[p.type].init(p));
  }
  function viewExam() {
    var E = Store.data.activeExam;
    if (!E || E.submitted) { go(Store.data.lastResult ? '#/results' : '#/practice'); return; }
    setTitle(E.title);
    if (examRemaining(E) <= 0) { submitExam(true); return; }
    var it = E.items[E.idx], n = E.items.length, flagged = !!E.flags[itemKey(it)];
    var h = '<div class="ebar"><span class="title"><strong>' + esc(E.title) + '</strong> <span class="muted small">' + (E.reviewScreen ? 'Review' : 'Item ' + (E.idx + 1) + ' of ' + n) + '</span></span>' +
      '<span class="timer" id="timer" role="timer" aria-label="Time remaining">' + fmtTime(examRemaining(E)) + '</span>' +
      '<span class="row ebar-actions">' + (E.reviewScreen ? '' : '<button class="btn quiet sm flag-btn" id="flagBtn" aria-pressed="' + flagged + '">' + (flagged ? 'Flagged' : 'Flag for review') + '</button>') + '<button class="btn sm" id="reviewBtn">Review and submit</button></span></div>';
    h += '<div class="session" style="max-width:' + (it.t === 'pbq' && !E.reviewScreen ? 'var(--wide)' : 'var(--read)') + '">';
    if (E.reviewScreen) h += examReviewScreen(E);
    else {
      if (it.t === 'q') h += questionHTML(qById(it.id), E.orders[it.id], { sel: E.answers[it.id] || [], ok: false }, false);
      else {
        var p = pbqById(it.id);
        h += '<div class="qmeta"><span class="tag strong">Lab</span><span>' + PBQ_TYPE_LABEL[p.type] + '</span></div><h2>' + esc(p.title) + '</h2><div class="scenario">' + p.scenario + '</div>' + (p.tasks ? '<ul class="tasks">' + p.tasks.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' : '') + '<div id="pbqMount"></div><p class="muted small">Your work saves as you go. Labs earn partial credit.</p>';
      }
      h += '<div class="sfoot"><button class="btn quiet" id="prevBtn"' + (E.idx === 0 ? ' disabled' : '') + '>Previous</button><span class="keys">Keys: <kbd>1</kbd>–<kbd>4</kbd> choose, <kbd>F</kbd> flag, arrows move</span><button class="btn" id="nextBtn">' + (E.idx === n - 1 ? 'Review and submit' : 'Next') + '</button></div>';
      h += '<details class="navigator"><summary>All items</summary>' + navigatorGrid(E) + '</details>';
    }
    h += '<p class="small" style="margin-top:2rem"><a href="#/practice">Leave the exam</a> <span class="muted">(the timer keeps running)</span></p></div>';
    main.innerHTML = h;
    if (!E.reviewScreen && it.t === 'pbq') PBQUI.mount($('#pbqMount'), pbqById(it.id), { mode: 'exam', state: E.pbqStates[it.id], onChange: function (s) { E.pbqStates[it.id] = s; Store.save(); } });
    main.onchange = function (e) {
      if (e.target.name !== 'q') return;
      E.answers[it.id] = $$('.opt input[name="q"]:checked').map(function (x) { return +x.value; }); Store.save(); syncPicked();
    };
    function move(d) { var j = E.idx + d; if (j < 0) return; if (j >= n) E.reviewScreen = true; else E.idx = j; Store.save(); viewExam(); }
    function toggleFlag() { if (E.reviewScreen) return; var k = itemKey(E.items[E.idx]); E.flags[k] = !E.flags[k]; Store.save(); viewExam(); }
    var fl = $('#flagBtn'); if (fl) fl.addEventListener('click', toggleFlag);
    $('#reviewBtn').addEventListener('click', function () { E.reviewScreen = true; Store.save(); viewExam(); });
    var pb = $('#prevBtn'); if (pb) pb.addEventListener('click', function () { move(-1); });
    var nb = $('#nextBtn'); if (nb) nb.addEventListener('click', function () { move(1); });
    $$('[data-goto]').forEach(function (b) { b.addEventListener('click', function () { E.idx = +b.dataset.goto; E.reviewScreen = false; Store.save(); viewExam(); }); });
    var sb = $('#submitBtn'); if (sb) sb.addEventListener('click', function () {
      var un = E.items.filter(function (x) { return !itemAnswered(E, x); }).length;
      if (confirm((un ? un + ' item(s) are unanswered. ' : '') + 'Submit the exam for scoring? You cannot change answers afterwards.')) submitExam(false);
    });
    var back = $('#backToExam'); if (back) back.addEventListener('click', function () { E.reviewScreen = false; Store.save(); viewExam(); });
    keyHandler = function (e) {
      if (E.reviewScreen || it.t !== 'q') return;
      if (e.key === 'ArrowRight') move(1); else if (e.key === 'ArrowLeft') move(-1);
      else if (e.key.toLowerCase() === 'f') toggleFlag();
      else optionKey(e);
    };
    timerHandle = setInterval(function () {
      var r = examRemaining(E), t = document.getElementById('timer');
      if (!t) { clearInterval(timerHandle); return; }
      t.textContent = fmtTime(r); t.classList.toggle('low', r < 300);
      if (r <= 0) { clearInterval(timerHandle); submitExam(true); }
    }, 1000);
  }
  function navigatorGrid(E) {
    return '<div class="nav-grid">' + E.items.map(function (it, i) {
      var a = itemAnswered(E, it), f = E.flags[itemKey(it)];
      return '<button class="navcell' + (a ? ' answered' : '') + (f ? ' flagged' : '') + (i === E.idx && !E.reviewScreen ? ' current' : '') + '" data-goto="' + i + '" aria-label="Item ' + (i + 1) + (it.t === 'pbq' ? ', lab' : '') + (a ? ', answered' : ', unanswered') + (f ? ', flagged' : '') + '">' + (it.t === 'pbq' ? 'L' : '') + (i + 1) + '</button>';
    }).join('') + '</div><div class="legend"><span><i class="a"></i>Answered</span><span><i></i>Not answered</span><span><i class="f"></i>Flagged</span><span>L = lab</span></div>';
  }
  function examReviewScreen(E) {
    var un = E.items.filter(function (x) { return !itemAnswered(E, x); }).length;
    var fl = E.items.filter(function (x) { return E.flags[itemKey(x)]; }).length;
    return '<h1>Review before you submit</h1><p class="lede muted" style="margin:.6rem 0 1rem">' + (E.items.length - un) + ' of ' + E.items.length + ' answered, ' + un + ' unanswered, ' + fl + ' flagged. Select any item to go back to it.</p>' + navigatorGrid(E) +
      (fl ? '<h2 style="margin-top:1.6rem">Flagged</h2><ul class="rows" style="margin-top:.6rem">' + E.items.map(function (x, i) { if (!E.flags[itemKey(x)]) return ''; var label = x.t === 'q' ? qById(x.id).q : pbqById(x.id).title; return '<li><div class="rowlink"><span class="id">' + (i + 1) + '</span><button class="linklike" data-goto="' + i + '">' + esc(label.slice(0, 100)) + (label.length > 100 ? '…' : '') + '</button><span></span></div></li>'; }).join('') + '</ul>' : '') +
      '<div class="row" style="margin-top:1.6rem"><button class="btn quiet" id="backToExam">Back to the exam</button><button class="btn big" id="submitBtn">Submit exam</button></div>';
  }
  function submitExam(timeUp) {
    var E = Store.data.activeExam;
    if (!E || E.submitted) return;
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    E.submitted = true;
    var results = [], earned = 0, max = 0, byDomain = {}, byObj = {};
    function add(objs, e, m) {
      objs.forEach(function (o) {
        var bd = byDomain[o[0]] || (byDomain[o[0]] = { e: 0, m: 0 }); bd.e += e / objs.length; bd.m += m / objs.length;
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
        // An untouched lab scores zero even if its starting configuration would satisfy some checks.
        var g = itemAnswered(E, it) ? Grading.gradePBQ(p, st) : { score: 0 };
        Store.recordPBQ(p, g.score, 'exam');
        earned += 3 * g.score; max += 3; add(p.objs, 3 * g.score, 3);
        results.push({ t: 'pbq', id: it.id, state: st, score: g.score, attempted: itemAnswered(E, it), flagged: !!E.flags[itemKey(it)] });
      }
    });
    var used = Math.min(E.duration, (Date.now() - E.start) / 1000);
    var res = { id: E.id, date: Date.now(), kind: E.kind, title: E.title, earned: earned, max: max, score: max ? earned / max : 0, byDomain: byDomain, byObj: byObj, used: used, timeUp: !!timeUp, results: results, orders: E.orders, qids: E.items.filter(function (x) { return x.t === 'q'; }).map(function (x) { return x.id; }) };
    Store.data.lastResult = res;
    Store.addExamResult({ id: res.id, date: res.date, kind: res.kind, title: res.title, score: res.score, earned: earned, max: max, byDomain: byDomain, used: used, qids: res.qids });
    Store.data.activeExam = null;
    Store.save();
    if (timeUp) toast('Time is up. Your exam was submitted.');
    go('#/results');
  }

  /* ================= EXAM RESULTS ================= */
  function viewResults() {
    var R = Store.data.lastResult;
    if (!R) { go('#/practice'); return; }
    setTitle('Exam results');
    var h = '<div class="page narrow" style="max-width:var(--read)"><div class="crumbs"><a href="#/practice">Practice</a> / Results</div><h1 style="margin-top:.4rem">' + esc(R.title) + '</h1><p class="muted">' + fmtDate(R.date) + ', ' + fmtTime(R.used) + ' used' + (R.timeUp ? ' (time ran out)' : '') + '</p>';
    h += '<div class="summary-score"><span class="big">' + pct(R.score) + '</span><div style="flex:1;min-width:14rem">' + meter(R.score, levelClass(R.score)) + '<p class="small" style="margin-top:.5rem">' + (Math.round(R.earned * 10) / 10) + ' of ' + R.max + ' points. Questions count 1 point each, labs 3 points with partial credit.</p></div></div>';
    h += '<p class="notice info" style="display:block"><strong>This is a practice percentage, not a predicted CompTIA score.</strong> The real exam reports a scaled score from 100 to 900 (passing is 750). CompTIA does not publish how answers convert to that scale. Scoring 85% or more on fresh mock exams is a good sign you are ready, not a guarantee.</p>';
    h += '<section class="section"><h2>By domain</h2><div class="domain-bars" style="margin-top:1rem">' + SEC.domains.map(function (d) {
      var b = R.byDomain[d.id]; if (!b) return '';
      var v = b.e / b.m;
      return '<div class="dbar"><div class="name">' + esc(d.title) + '<span>' + (Math.round(b.e * 10) / 10) + ' of ' + b.m + '</span></div>' + meter(v, levelClass(v)) + '<span class="v">' + pct(v) + '</span></div>';
    }).join('') + '</div></section>';
    var weak = Object.keys(R.byObj).filter(function (o) { return R.byObj[o].e / R.byObj[o].m < 0.7; }).sort();
    if (weak.length) h += '<div class="notice" style="margin-top:2rem"><span>Below 70% on ' + weak.map(function (o) { return '<a href="#/learn/' + o + '">' + o + '</a>'; }).join(', ') + '.</span><button class="btn sm" id="weakBtn">Practice these</button></div>';
    h += '<section class="section"><div class="section-head"><h2>Every item</h2><div class="seg" role="radiogroup" aria-label="Filter">' + [['all', 'All'], ['wrong', 'Wrong'], ['flag', 'Flagged']].map(function (f) { return '<label><input type="radio" name="flt" value="' + f[0] + '"' + (f[0] === 'all' ? ' checked' : '') + '><span>' + f[1] + '</span></label>'; }).join('') + '</div></div><div id="itemList">' +
      R.results.map(function (r, i) {
        var cls = (r.t === 'q' ? (r.ok ? 'ok' : 'wrong') : (r.score >= 0.999 ? 'ok' : 'wrong')) + (r.flagged ? ' flag' : '');
        if (r.t === 'q') {
          var q = qById(r.id);
          return '<details class="review-item ' + cls + '"><summary><span class="mark ' + (r.ok ? 'good' : 'bad') + '">' + (r.ok ? '✓' : '✗') + '</span><span>' + (i + 1) + '. ' + (r.flagged ? '(flagged) ' : '') + esc(q.q.slice(0, 120)) + (q.q.length > 120 ? '…' : '') + (r.sel.length ? '' : ' <em class="muted">not answered</em>') + '</span></summary><div class="rbody">' + questionHTML(q, R.orders[r.id], { sel: r.sel, ok: r.ok }, true) + '</div></details>';
        }
        var p = pbqById(r.id);
        return '<details class="review-item ' + cls + '" data-pbqres="' + i + '"><summary><span class="mark ' + (r.score >= 0.999 ? 'good' : 'mid') + '">' + (r.score >= 0.999 ? '✓' : '◐') + '</span><span>' + (i + 1) + '. Lab: ' + esc(p.title) + ' (' + pct(r.score) + ')</span></summary><div class="rbody pbq-res-slot"></div></details>';
      }).join('') + '</div></section>';
    h += '<div class="row" style="margin-top:2rem"><a class="btn quiet" href="#/practice">Back to Practice</a><a class="btn ghost" href="#/progress">Progress</a></div></div>';
    main.innerHTML = h;
    $$('[data-pbqres]').forEach(function (d) {
      d.addEventListener('toggle', function () {
        var slot = d.querySelector('.pbq-res-slot'); if (!d.open || slot.childNodes.length) return;
        var r = R.results[+d.dataset.pbqres], p = pbqById(r.id);
        slot.innerHTML = '<div class="scenario">' + p.scenario + '</div><h4>Your submission</h4><div class="pbq-mount"></div><div class="pbq-result"></div>';
        var ctl = PBQUI.mount(slot.querySelector('.pbq-mount'), p, { mode: 'exam', state: r.state });
        ctl.lock(true);
        slot.querySelector('.pbq-result').innerHTML = (r.attempted === false ? '<p class="notice">You did not attempt this lab during the exam, so it scored 0. The feedback compares the untouched starting state with a correct solution.</p>' : '') + pbqResultHTML(p, Grading.gradePBQ(p, r.state));
        bindSolutionToggle(slot, p, ctl, r.state);
      });
    });
    $$('input[name="flt"]').forEach(function (rb) {
      rb.addEventListener('change', function () {
        $$('#itemList > .review-item').forEach(function (d) { d.hidden = rb.value === 'wrong' ? !d.classList.contains('wrong') : rb.value === 'flag' ? !d.classList.contains('flag') : false; });
      });
    });
    var wb = $('#weakBtn'); if (wb) wb.addEventListener('click', function () { var ids = pickQuestions(weak, 15, { exclude: R.qids, pool: 'all' }); if (ids.length < 5) ids = pickQuestions(weak, 15, { pool: 'all' }); startSession({ title: 'Weak objectives from the exam', qids: ids, objs: weak, pool: 'all' }); });
  }

  /* ================= LAB (PBQ) PAGE ================= */
  function pbqResultHTML(p, g) {
    return '<div class="pbq-score ' + (g.score >= 0.999 ? 'good' : g.score >= 0.6 ? 'mid' : 'bad') + '"><div class="big-num">' + pct(g.score) + '</div><div><strong>' + (Math.round(g.earned * 10) / 10) + ' of ' + g.max + ' points</strong> with partial credit' + meter(g.score, levelClass(g.score)) + '</div></div>' +
      '<h3>What the grader checked</h3><ul class="fb-list">' + g.items.map(function (it) {
        var mark = it.ok === true ? '<span class="good" aria-label="correct">✓</span>' : it.ok === 'partial' ? '<span class="mid" aria-label="partly correct">◐</span>' : '<span class="bad" aria-label="incorrect">✗</span>';
        return '<li class="' + (it.ok === true ? 'ok' : 'bad') + '">' + mark + ' <strong>' + esc(it.label).replace(/`([^`]+)`/g, '<code>$1</code>') + '</strong><div class="small">' + richText(it.detail) + '</div></li>';
      }).join('') + '</ul>' +
      '<div class="solution"><h3>A correct solution, step by step</h3><ol>' + p.solution.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' +
      (p.solution.alt ? '<p class="small"><strong>Other valid answers.</strong> ' + p.solution.alt + '</p>' : '') +
      '<button class="btn quiet sm" data-showsol>Show this solution in the lab</button></div>';
  }
  function bindSolutionToggle(scope, p, ctl, mine) {
    var b = scope.querySelector('[data-showsol]'); if (!b) return;
    var showing = false;
    b.addEventListener('click', function () {
      showing = !showing;
      ctl.setState(showing ? Grading.solutionState(p) : mine); ctl.lock(true);
      b.textContent = showing ? 'Show my answer again' : 'Show this solution in the lab';
      toast(showing ? 'Showing a correct solution' : 'Showing your answer');
    });
  }
  function viewPBQ(s) {
    var p = pbqById(s[1]);
    if (!p) { main.innerHTML = '<div class="page"><p>That lab does not exist. <a href="#/practice">Back to Practice</a></p></div>'; return; }
    setTitle('Lab: ' + p.title);
    var r = Store.data.pbq[p.id], draftKey = 'pbqdraft:' + p.id;
    var h = '<div class="page pbq-page"><div class="pbq-head"><div class="crumbs"><a href="#/practice#labs">Practice</a> / Hands-on labs</div><h1>' + esc(p.title) + '</h1>' +
      '<div class="row">' + '<span class="tag strong">' + PBQ_TYPE_LABEL[p.type] + '</span>' + p.objs.map(function (o) { return '<a class="tag" href="#/learn/' + o + '">' + o + ' ' + esc(lessonTitle(o)) + '</a>'; }).join('') + '<span class="tag">' + DIFF[p.d] + '</span><span class="tag">About ' + p.minutes + ' min</span></div>' +
      (r ? '<p class="muted small">Tried ' + plural(r.attempts, 'time') + ', best ' + pct(r.best) + ', last ' + pct(r.last) + '</p>' : '') + '</div>' +
      '<div class="scenario">' + p.scenario + '</div>' + (p.tasks ? '<h2 style="font-size:var(--step-1);margin-top:1.2rem">Your tasks</h2><ul class="tasks">' + p.tasks.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' : '') +
      '<div id="pbqMount"></div><div class="row"><button class="btn big" id="submitPBQ">Check my work</button><button class="btn ghost" id="resetPBQ">Start over</button></div><div id="pbqResult" aria-live="polite"></div></div>';
    main.innerHTML = h;
    var draft = null;
    try { draft = JSON.parse(sessionStorage.getItem(draftKey) || 'null'); } catch (e) { draft = null; }
    var mine = null;
    var ctl = PBQUI.mount($('#pbqMount'), p, { mode: 'practice', state: draft, onChange: function (st) { try { sessionStorage.setItem(draftKey, JSON.stringify(st)); } catch (e) { /* storage unavailable */ } } });
    $('#submitPBQ').addEventListener('click', function () {
      mine = ctl.getState();
      var g = Grading.gradePBQ(p, mine);
      Store.recordPBQ(p, g.score, 'practice'); renderNav('practice');
      ctl.lock(true);
      var out = $('#pbqResult');
      out.innerHTML = pbqResultHTML(p, g) + '<div class="row"><button class="btn" id="retryPBQ">Try again</button>' + p.objs.map(function (o) { return '<button class="btn quiet" data-practice="' + o + '">Practice ' + o + ' questions</button>'; }).join('') + '</div>';
      $('#submitPBQ').hidden = true; $('#resetPBQ').hidden = true;
      bindSolutionToggle(out, p, ctl, mine);
      bindCommon(out);
      $('#retryPBQ').addEventListener('click', function () { ctl.setState(mine); ctl.unlock(); out.innerHTML = ''; $('#submitPBQ').hidden = false; $('#resetPBQ').hidden = false; });
      out.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    $('#resetPBQ').addEventListener('click', function () { if (confirm('Start this lab over from the beginning?')) { ctl.reset(); try { sessionStorage.removeItem(draftKey); } catch (e) { /* ignore */ } } });
  }

  /* ================= PROGRESS ================= */
  function viewProgress() {
    setTitle('Progress');
    var D = Store.data, rd = Store.readiness();
    var n = 0, c = 0; Object.keys(D.q).forEach(function (k) { n += D.q[k].n; c += D.q[k].c; });
    var boxes = [0, 0, 0, 0, 0, 0];
    Object.keys(D.q).forEach(function (id) { var r = D.q[id]; if (r.box !== undefined) boxes[r.box]++; });
    var h = '<div class="page"><div class="phead"><h1>Progress</h1><p class="lede">' + (Store.memoryOnly() ? 'Your browser is blocking storage, so progress lasts only until this tab closes. Export a copy below.' : 'Saved automatically in this browser. Export a copy to move it to another device.') + '</p></div>';
    h += '<div class="stats"><div class="stat"><div class="v">' + n + '</div><div class="l">answers, ' + pct(n ? c / n : null) + ' correct</div></div><div class="stat"><div class="v">' + Store.streak() + '</div><div class="l">days in a row</div></div>' +
      '<div class="stat"><div class="v">' + Store.cardsLearned() + '</div><div class="l">of ' + SEC.terms.length + ' terms known</div></div><div class="stat"><div class="v">' + Object.keys(D.pbq).length + '</div><div class="l">of ' + SEC.pbqs.length + ' labs tried</div></div></div>';
    // 16-week activity map, columns are weeks starting Sunday
    // 15 full weeks plus this week so far; rows are weekdays starting on Sunday.
    var act = Store.activity(15 * 7 + new Date().getDay() + 1);
    h += '<section class="section"><h2>Daily activity</h2><p class="muted small" style="margin:.3rem 0 .8rem">Last 16 weeks. Darker means more questions and flashcards.</p><div class="heat" role="img" aria-label="Daily activity for the last 16 weeks">' + act.map(function (a) { var l = a.n === 0 ? '' : a.n < 10 ? 'l1' : a.n < 25 ? 'l2' : 'l3'; return '<i class="' + l + '" title="' + a.day + ': ' + a.n + '"></i>'; }).join('') + '</div></section>';
    h += '<section class="section"><h2>By domain</h2><div class="table-wrap"><table><thead><tr><th scope="col">Domain</th><th scope="col" class="num">Weight</th><th scope="col" class="num">Answers</th><th scope="col" class="num">Accuracy</th><th scope="col">Mastery</th><th scope="col" class="num">Coverage</th></tr></thead><tbody>' +
      SEC.domains.map(function (d) { var s = Store.domainStats(d.id); return '<tr><th scope="row">' + d.id + '. ' + esc(d.title) + '</th><td class="num">' + d.weight + '%</td><td class="num">' + s.n + '</td><td class="num">' + pct(s.acc) + '</td><td>' + meter(s.mastery, levelClass(s.mastery)) + '</td><td class="num">' + pct(s.coverage) + '</td></tr>'; }).join('') + '</tbody></table></div></section>';
    h += '<section class="section"><h2>By objective</h2><p class="muted small" style="margin:.3rem 0 .8rem">Mastery combines your last 12 answers (75%) with your latest lab scores (25%). Needs work is below 60%, developing is 60 to 79%.</p><div class="table-wrap"><table class="obj-table"><thead><tr><th scope="col">Objective</th><th scope="col">Status</th><th scope="col" class="num">Answers</th><th scope="col" class="num">Recent</th><th scope="col" class="num">Labs</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead><tbody>' +
      SEC.objectives.map(function (o) {
        var s = Store.objStats(o.id), l = D.lessons[o.id] || {};
        return '<tr><th scope="row"><a href="#/learn/' + o.id + '">' + o.id + '</a> ' + esc(lessonTitle(o.id)) + (l.done ? ' <span class="chip read">Read</span>' : '') + '</th><td>' + statusChip(s.status) + '</td><td class="num">' + s.n + '</td><td class="num">' + pct(s.recentAcc) + '</td><td class="num">' + pct(s.pbqAvg) + '</td><td><button class="btn ghost sm" data-practice="' + o.id + '">Practice</button></td></tr>';
      }).join('') + '</tbody></table></div></section>';
    h += '<section class="section two"><div><h2>Labs</h2><div class="table-wrap" style="margin-top:.8rem"><table><thead><tr><th scope="col">Lab</th><th scope="col" class="num">Tries</th><th scope="col" class="num">Best</th></tr></thead><tbody>' +
      SEC.pbqs.map(function (p) { var r = D.pbq[p.id]; return '<tr><th scope="row"><a href="#/pbq/' + p.id + '">' + esc(p.title) + '</a></th><td class="num">' + (r ? r.attempts : 0) + '</td><td class="num">' + (r ? pct(r.best) : '–') + '</td></tr>'; }).join('') + '</tbody></table></div></div>' +
      '<div><h2>Review schedule</h2><p class="muted small" style="margin-top:.3rem">A missed question moves up one box each time you get it right in review. Box 5 means it is retired.</p><ul class="boxes">' + boxes.map(function (b, i) { return '<li><strong>' + b + '</strong><span>' + (i === 0 ? 'Due now' : i === 5 ? 'Retired' : 'Box ' + i + ', ' + Math.round(Store.INTERVALS[i] / 86400000) + 'd') + '</span></li>'; }).join('') + '</ul>' +
      '<p><button class="btn quiet sm" data-act="review"' + (Store.dueReview().length ? '' : ' disabled') + '>Review ' + Store.dueReview().length + ' due</button></p>' +
      '<h2 style="margin-top:2rem">Mock exams</h2>' + (D.exams.length ? '<div class="table-wrap" style="margin-top:.8rem"><table><thead><tr><th scope="col">Date</th><th scope="col">Exam</th><th scope="col" class="num">Score</th></tr></thead><tbody>' + D.exams.map(function (e) { return '<tr><td>' + fmtDate(e.date) + '</td><td>' + esc(e.title) + '</td><td class="num">' + pct(e.score) + '</td></tr>'; }).join('') + '</tbody></table></div>' + (D.lastResult ? '<p style="margin-top:.6rem"><a href="#/results">Open the latest results</a></p>' : '') : '<p class="muted" style="margin-top:.6rem">No mock exams yet.</p>') + '</div></section>';
    h += '<section class="section estimate"><h2>Readiness estimate</h2><p style="margin:.6rem 0"><span class="big">' + (rd.coverage ? pct(rd.value) : '–') + '</span> <span class="muted">based on ' + pct(rd.coverage) + ' of the exam weight practiced so far</span></p><p class="muted small">This blends the mastery figures above, weighted by each domain’s share of the exam, and is lowered for objectives you have not practiced. It is an estimate from this app’s practice items only. It is not a CompTIA score, not on the 100 to 900 scale, and not a pass or fail prediction.</p></section>';
    h += '<section class="section"><h2>Your data</h2><div class="row" style="margin-top:.8rem"><button class="btn quiet" id="exportBtn">Export progress</button><label class="btn quiet file-btn">Import progress<input type="file" id="importFile" accept="application/json,.json"></label><button class="btn danger" id="resetBtn">Erase all progress</button></div></section></div>';
    main.innerHTML = h;
    bindCommon();
    $('#exportBtn').addEventListener('click', function () {
      var blob = new Blob([Store.exportJSON()], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'secplus-progress-' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a); a.click(); a.remove();
    });
    $('#importFile').addEventListener('change', function (e) {
      var f = e.target.files[0]; if (!f) return;
      f.text().then(function (t) { try { Store.importJSON(t); applySettings(); toast('Progress imported'); route(); } catch (err) { alert(err.message); } });
    });
    $('#resetBtn').addEventListener('click', function () { if (confirm('Erase all progress, review history and exam results? This cannot be undone.')) { Store.reset(); applySettings(); toast('Progress erased'); route(); } });
  }

  /* ================= ABOUT ================= */
  function viewAbout() {
    setTitle('About');
    var e = SEC.exam;
    var h = '<div class="page prose"><div class="phead"><h1>About this app</h1></div>';
    h += '<h2>The exam it covers</h2><dl class="facts" style="margin:1rem 0 2rem"><div><dt>Exam</dt><dd>' + e.name + ' ' + e.versionLabel + '</dd></div><div><dt>Status</dt><dd>' + e.status + ', launched ' + e.launched + ', checked ' + e.verifiedOn + '</dd></div>' +
      '<div><dt>Format</dt><dd>Up to ' + e.maxQuestions + ' questions in ' + e.minutes + ' minutes. ' + e.questionTypes + '.</dd></div><div><dt>Passing score</dt><dd>' + e.passing + '</dd></div>' +
      '<div><dt>Domains</dt><dd>' + SEC.domains.map(function (d) { return d.id + '. ' + esc(d.title) + ' (' + d.weight + '%)'; }).join('<br>') + '</dd></div><div><dt>Next version</dt><dd>' + esc(e.upcoming.note) + '</dd></div></dl>';
    h += '<h2>What is inside</h2><ul style="margin:1rem 0 2rem;padding-left:1.2rem"><li>' + Object.keys(SEC.lessons).length + ' lessons, one per objective, with key terms, diagrams, quick checks and comparisons.</li><li>' + SEC.questions.length + ' original exam-style questions at three difficulty levels, plus ' + SEC.termQuestions.length + ' term quizzes and ' + SEC.terms.length + ' flashcards built from the lessons.</li><li>' + SEC.pbqs.length + ' hands-on labs graded with partial credit.</li><li>Spaced review on a 1, 3, 7, 16 and 35 day schedule.</li><li>Everything runs on your device. No account, no server and no AI service.</li></ul>';
    h += '<h2>Content and scoring</h2><p style="margin-top:.8rem">All lessons, questions and labs are original practice material written for the SY0-701 objectives. They are not exam dumps. This app is not affiliated with or endorsed by CompTIA. Practice percentages and the readiness estimate describe your results on these practice items only and do not predict an official score.</p><p class="small muted" style="margin-top:1.2rem">Typeface: Atkinson Hyperlegible Next and Mono by the Braille Institute, under the SIL Open Font License.</p></div>';
    main.innerHTML = h;
  }

  /* ---------------- settings ---------------- */
  var desktop = false;
  function applySettings() {
    var st = Store.data.settings, root = document.documentElement;
    if (st.theme) root.dataset.theme = st.theme; else delete root.dataset.theme;
    if (st.text && st.text !== 'm') root.dataset.text = st.text; else delete root.dataset.text;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.body).backgroundColor;
  }
  function openSettings() {
    var dlg = document.getElementById('settings'), st = Store.data.settings;
    var opt = function (name, val, label, cur) { return '<label><input type="radio" name="' + name + '" value="' + val + '"' + ((cur || '') === val ? ' checked' : '') + '><span>' + label + '</span></label>'; };
    dlg.innerHTML = '<form method="dialog" class="settings-body"><div class="row between"><h2 id="settingsTitle">Settings</h2><button class="icon-btn" value="close" aria-label="Close settings">' + icon('close') + '</button></div>' +
      '<div class="setting"><span>Theme</span><div class="seg" role="radiogroup" aria-label="Theme">' + opt('theme', '', 'System', st.theme) + opt('theme', 'light', 'Light', st.theme) + opt('theme', 'sepia', 'Sepia', st.theme) + opt('theme', 'dark', 'Dark', st.theme) + '</div><span class="muted">Sepia is warmer and lower in contrast for long reading sessions.</span></div>' +
      '<div class="setting"><span>Text size</span><div class="seg" role="radiogroup" aria-label="Text size">' + opt('text', 's', 'Smaller', st.text) + opt('text', 'm', 'Standard', st.text || 'm') + opt('text', 'l', 'Larger', st.text) + '</div></div>' +
      '<div class="setting"><span>Daily goal</span><div class="seg" role="radiogroup" aria-label="Daily goal">' + [10, 20, 30, 50].map(function (g) { return opt('goal', String(g), g + ' a day', String(Store.goal())); }).join('') + '</div><span class="muted">Questions and flashcards count toward it.</span></div>' +
      '<div class="setting"><a href="#/about" id="aboutLink">About this app and the exam</a></div>' +
      (desktop ? '<div class="setting"><span>Desktop app</span><button class="btn quiet" type="button" id="quitApp">Quit Security+ Study Lab</button><span class="muted">Stops the local app server. Your progress is already saved.</span></div>' : '') + '</form>';
    dlg.addEventListener('change', function (e) {
      var t = e.target;
      if (t.name === 'theme') st.theme = t.value || undefined;
      if (t.name === 'text') st.text = t.value === 'm' ? undefined : t.value;
      if (t.name === 'goal') st.goal = +t.value;
      Store.save(); applySettings(); renderNav();
    });
    dlg.querySelector('#aboutLink').addEventListener('click', function () { dlg.close(); });
    var q = dlg.querySelector('#quitApp');
    if (q) q.addEventListener('click', function () {
      fetch('/__secplus_quit', { method: 'POST' }).catch(function () {}).then(function () {
        document.body.innerHTML = '<main style="padding:3rem;max-width:36rem;margin:auto;font-family:var(--sans)"><h1>Security+ Study Lab has closed</h1><p style="margin-top:1rem">Your progress is saved. You can close this window. Open the app again whenever you want to study.</p></main>';
      });
    });
    dlg.showModal();
  }
  $$('[data-open-settings]', document).forEach(function (b) { b.addEventListener('click', openSettings); });

  // When served by the desktop launcher, show a Quit option and keep the server alive while the page is open.
  if (location.protocol === 'http:' && /^(127\.0\.0\.1|localhost)$/.test(location.hostname)) {
    fetch('/__secplus_health').then(function (r) { return r.ok ? r.text() : ''; }).then(function (t) {
      if (t.indexOf('secplus') !== 0) return;
      desktop = true;
      setInterval(function () { fetch('/__secplus_ping', { method: 'POST' }).catch(function () {}); }, 30000);
    }).catch(function () {});
  }

  /* ---------------- boot ---------------- */
  var e0 = SEC.exam; document.getElementById('railExam').textContent = 'Exam ' + e0.code;
  applySettings();
  window.addEventListener('hashchange', route);
  route();

  // Exposed for automated tests.
  window.App = { pickQuestions: pickQuestions, pickWeighted: pickWeighted, smartPick: smartPick, startExam: startExam, submitExam: submitExam, practiceObjective: practiceObjective, startCards: startCards };
})();
