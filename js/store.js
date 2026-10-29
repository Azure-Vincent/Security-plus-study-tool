/* Persistent progress (localStorage) + spaced review + analytics. */
(function () {
  'use strict';
  var KEY = 'secplus.progress.v1';
  var DAY = 86400000;
  // Leitner intervals by box (box 0 = due immediately after a miss).
  var INTERVALS = [0, 1 * DAY, 3 * DAY, 7 * DAY, 16 * DAY, 35 * DAY];
  var GRADUATED = 5;

  function blank() {
    return { v: 1, created: Date.now(), q: {}, obj: {}, pbq: {}, lessons: {}, exams: [], settings: {}, activeExam: null, practice: null, lastResult: null, daily: {}, cards: {} };
  }
  var memoryOnly = false;
  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) { var d = Object.assign(blank(), JSON.parse(raw)); d.daily = d.daily || {}; d.cards = d.cards || {}; return d; }
    } catch (e) { memoryOnly = true; }
    return blank();
  }
  var data = load();

  var Store = {
    get data() { return data; },
    memoryOnly: function () { return memoryOnly; },
    save: function () {
      try { window.localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { memoryOnly = true; }
    },
    reset: function () { data = blank(); Store.save(); },
    exportJSON: function () { return JSON.stringify(data, null, 2); },
    importJSON: function (txt) {
      var d = JSON.parse(txt);
      if (!d || d.v !== 1 || typeof d.q !== 'object') throw new Error('This file is not a Security+ Study Lab progress export.');
      data = Object.assign(blank(), d); Store.save();
    },

    /* Record one answered question. mode: 'practice' | 'review' | 'exam' */
    recordAnswer: function (q, correct, mode) {
      var now = Date.now();
      var r = data.q[q.id] || (data.q[q.id] = { n: 0, c: 0 });
      r.n++; if (correct) r.c++;
      r.last = correct; r.t = now;
      if (!correct) { r.box = 0; r.due = now; r.missed = (r.missed || 0) + 1; }
      else if (r.box !== undefined) {
        r.box = Math.min(GRADUATED, r.box + 1);
        r.due = now + (INTERVALS[r.box] || INTERVALS[INTERVALS.length - 1]);
      }
      var o = data.obj[q.obj] || (data.obj[q.obj] = { n: 0, c: 0, recent: [] });
      o.n++; if (correct) o.c++;
      o.recent.push(correct ? 1 : 0);
      if (o.recent.length > 12) o.recent.shift();
      o.t = now;
      bump('q'); if (correct) bump('c');
      Store.save();
    },

    recordPBQ: function (pbq, score, mode) {
      var r = data.pbq[pbq.id] || (data.pbq[pbq.id] = { attempts: 0, best: 0 });
      r.attempts++; r.last = score; r.best = Math.max(r.best, score); r.t = Date.now(); r.mode = mode;
      bump('p');
      Store.save();
    },

    lessonDone: function (obj, done) {
      var l = data.lessons[obj] || (data.lessons[obj] = {});
      l.done = done; l.t = Date.now();
      Store.save();
    },
    lessonCheck: function (obj, idx, correct) {
      var l = data.lessons[obj] || (data.lessons[obj] = {});
      l.checks = l.checks || {};
      l.checks[idx] = correct;
      l.visited = Date.now();
      Store.save();
    },

    /* ---------- Flashcards (same Leitner schedule as questions) ---------- */
    recordCard: function (cardId, knew) {
      var now = Date.now();
      var r = data.cards[cardId] || (data.cards[cardId] = { n: 0, k: 0, box: 0 });
      r.n++; r.t = now;
      if (knew) { r.k++; r.box = Math.min(GRADUATED, r.box + 1); r.due = now + INTERVALS[r.box]; }
      else { r.box = 0; r.due = now; }
      bump('cards');
      Store.save();
    },
    // Cards to study now: due cards first, then cards never seen. `ids` limits the scope.
    cardQueue: function (ids, limit, now) {
      now = now || Date.now();
      var due = ids.filter(function (id) { var r = data.cards[id]; return r && r.box < GRADUATED && r.due <= now; });
      due.sort(function (a, b) { return data.cards[a].due - data.cards[b].due; });
      var fresh = ids.filter(function (id) { return !data.cards[id]; });
      return { due: due, fresh: fresh, queue: due.concat(fresh).slice(0, limit || 20) };
    },
    cardsLearned: function () { return Object.keys(data.cards).filter(function (id) { return data.cards[id].box >= 1; }).length; },

    /* ---------- Daily activity, goal and streak ---------- */
    today: function () { return data.daily[dayKey(Date.now())] || {}; },
    todayCount: function () { var d = Store.today(); return (d.q || 0) + (d.cards || 0); },
    goal: function () { return data.settings.goal || 20; },
    streak: function () {
      var n = 0, t = Date.now();
      if (!active(dayKey(t))) t -= DAY; // a streak survives until the end of today
      while (active(dayKey(t))) { n++; t -= DAY; }
      return n;
    },
    activity: function (days) {
      var out = [];
      for (var i = days - 1; i >= 0; i--) {
        var k = dayKey(Date.now() - i * DAY), d = data.daily[k] || {};
        out.push({ day: k, n: (d.q || 0) + (d.cards || 0), q: d.q || 0, c: d.c || 0 });
      }
      return out;
    },

    /* ---------- Spaced review ---------- */
    dueReview: function (now) {
      now = now || Date.now();
      return Object.keys(data.q).filter(function (id) {
        var r = data.q[id];
        return r.box !== undefined && r.box < GRADUATED && r.due <= now;
      }).sort(function (a, b) { return data.q[a].due - data.q[b].due; });
    },
    nextReviewTime: function () {
      var t = Infinity;
      Object.keys(data.q).forEach(function (id) { var r = data.q[id]; if (r.box !== undefined && r.box < GRADUATED) t = Math.min(t, r.due); });
      return t;
    },
    missedIds: function () {
      return Object.keys(data.q).filter(function (id) { return data.q[id].last === false; });
    },

    /* ---------- Analytics ---------- */
    objStats: function (objId) {
      var o = data.obj[objId] || { n: 0, c: 0, recent: [] };
      var recentAcc = o.recent.length ? o.recent.reduce(function (a, b) { return a + b; }, 0) / o.recent.length : null;
      var pbqs = (window.SEC ? SEC.pbqs : []).filter(function (p) { return p.objs.indexOf(objId) >= 0 && data.pbq[p.id]; });
      var pbqAvg = pbqs.length ? pbqs.reduce(function (a, p) { return a + data.pbq[p.id].last; }, 0) / pbqs.length : null;
      // Mastery blends recent question accuracy with latest PBQ results for the objective.
      var mastery = null;
      if (recentAcc !== null && pbqAvg !== null) mastery = recentAcc * 0.75 + pbqAvg * 0.25;
      else if (recentAcc !== null) mastery = recentAcc;
      else if (pbqAvg !== null) mastery = pbqAvg;
      var status = 'new';
      if (o.n >= 3 || pbqs.length) status = mastery < 0.6 ? 'weak' : mastery < 0.8 ? 'developing' : 'strong';
      else if (o.n > 0) status = 'started';
      return { n: o.n, c: o.c, acc: o.n ? o.c / o.n : null, recentAcc: recentAcc, pbqAvg: pbqAvg, pbqCount: pbqs.length, mastery: mastery, status: status, t: o.t };
    },
    domainStats: function (domId) {
      var objs = SEC.objectives.filter(function (o) { return o.id.split('.')[0] === domId; });
      var n = 0, c = 0, mSum = 0, mCount = 0;
      objs.forEach(function (o) {
        var s = Store.objStats(o.id);
        n += s.n; c += s.c;
        if (s.mastery !== null) { mSum += s.mastery; mCount++; }
      });
      return { n: n, c: c, acc: n ? c / n : null, mastery: mCount ? mSum / mCount : null, coverage: mCount / objs.length };
    },
    /* Objectives ranked by need: weak first, then untested, then developing. */
    recommendations: function (limit) {
      var list = SEC.objectives.map(function (o) {
        var s = Store.objStats(o.id), l = data.lessons[o.id] || {};
        var priority;
        if (s.status === 'weak') priority = 0 + s.mastery;
        else if (s.status === 'started') priority = 1;
        else if (s.status === 'new') priority = l.done ? 1.5 : 2;
        else if (s.status === 'developing') priority = 3 + s.mastery;
        else priority = 10 + s.mastery;
        // Heavier domains first when otherwise tied.
        priority -= SEC.domainOf(o.id).weight / 1000;
        return { obj: o, stats: s, lessonDone: !!l.done, priority: priority };
      });
      list.sort(function (a, b) { return a.priority - b.priority; });
      return list.filter(function (x) { return x.stats.status !== 'strong'; }).slice(0, limit || 5);
    },
    /* Practice readiness indicator: domain-weighted mastery, scaled down by coverage.
       Deliberately NOT expressed on CompTIA's 100–900 scale. */
    readiness: function () {
      var total = 0, cov = 0;
      SEC.domains.forEach(function (d) {
        var s = Store.domainStats(d.id);
        total += (s.mastery || 0) * s.coverage * d.weight;
        cov += s.coverage * d.weight;
      });
      return { value: total / 100, coverage: cov / 100 };
    },

    /* ---------- Exams ---------- */
    addExamResult: function (res) {
      data.exams.unshift(res);
      if (data.exams.length > 30) data.exams.length = 30;
      Store.save();
    }
  };

  function dayKey(t) { var d = new Date(t); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function active(k) { var d = data.daily[k]; return !!d && ((d.q || 0) + (d.cards || 0) + (d.p || 0)) > 0; }
  function bump(kind) {
    var k = dayKey(Date.now()), d = data.daily[k] || (data.daily[k] = {});
    d[kind] = (d[kind] || 0) + 1;
  }
  Store.dayKey = dayKey;
  Store.INTERVALS = INTERVALS;
  Store.GRADUATED = GRADUATED;
  window.Store = Store;
})();
