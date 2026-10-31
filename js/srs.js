/* Spaced repetition scheduler (an SM-2 variant). Pure functions, shared by the app and the tests.
   Each studied item has a state { ivl (days), ease, reps, lapses, due (ms) }.
   Grades: 0 = Again (forgot), 1 = Hard, 2 = Good, 3 = Easy. */
(function (S) {
  'use strict';
  var DAY = 86400000;
  var RELEARN = 10 * 60 * 1000; // forgotten items come back after 10 minutes
  var MATURE = 21;              // days; items at or beyond this interval count as in long-term memory
  var MAX_IVL = 180;            // days

  S.DAY = DAY;
  S.MATURE = MATURE;
  S.GRADES = ['Again', 'Hard', 'Good', 'Easy'];

  // Longest allowed interval: never past the day before the exam, never more than MAX_IVL.
  function cap(now, opts) {
    var c = (opts && opts.maxIvl) || MAX_IVL;
    if (opts && opts.examDate && opts.examDate > now) c = Math.min(c, Math.max(1, Math.floor((opts.examDate - now) / DAY) - 1));
    return c;
  }

  S.schedule = function (prev, grade, now, opts) {
    var s = prev ? { ivl: prev.ivl || 0, ease: prev.ease || 2.5, reps: prev.reps || 0, lapses: prev.lapses || 0 } : { ivl: 0, ease: 2.5, reps: 0, lapses: 0 };
    if (grade <= 0) {
      s.lapses += 1;
      s.ease = Math.max(1.3, s.ease - 0.2);
      s.ivl = 0; s.reps = 0;
      s.due = now + RELEARN;
      return s;
    }
    var ivl;
    if (s.reps === 0) ivl = grade === 3 ? 4 : 1;
    else if (s.reps === 1) ivl = grade === 1 ? Math.max(2, s.ivl * 1.2) : grade === 2 ? 3 : 7;
    else {
      var hard = Math.max(s.ivl + 1, s.ivl * 1.2);
      var good = Math.max(hard + 1, s.ivl * s.ease);
      ivl = grade === 1 ? hard : grade === 2 ? good : Math.max(good + 1, s.ivl * s.ease * 1.3);
    }
    if (grade === 1) s.ease = Math.max(1.3, s.ease - 0.15);
    if (grade === 3) s.ease = Math.min(3.5, s.ease + 0.15);
    s.ivl = Math.min(cap(now, opts), Math.round(ivl));
    s.reps += 1;
    s.due = now + s.ivl * DAY;
    return s;
  };

  S.stage = function (st) {
    if (!st) return 'new';
    if (st.ivl < 1) return 'learning';
    return st.ivl >= MATURE ? 'mature' : 'young';
  };

  // Human-readable interval, used for button hints and feedback ("10 min", "3 days", "2 months").
  S.describe = function (st, now) {
    var ms = st.due - now;
    if (ms < 60 * 60 * 1000) return Math.max(1, Math.round(ms / 60000)) + ' min';
    var d = Math.round(ms / DAY);
    if (d < 1) return 'later today';
    if (d < 45) return d + (d === 1 ? ' day' : ' days');
    var m = Math.round(d / 30);
    return m + (m === 1 ? ' month' : ' months');
  };

  // What each grade would do, without changing anything: [{grade, label, when}]
  S.preview = function (prev, now, opts) {
    return S.GRADES.map(function (label, g) { return { grade: g, label: label, when: S.describe(S.schedule(prev, g, now, opts), now) }; });
  };

  // Convert a record from the earlier box-based schedule.
  S.fromLegacy = function (r, intervalsMs) {
    if (r.box !== undefined) {
      var ivl = Math.round((intervalsMs[r.box] || 0) / DAY);
      return { ivl: ivl, ease: 2.5, reps: r.box, lapses: r.missed || (r.box === 0 ? 1 : 0), due: r.due || Date.now() };
    }
    var t = r.t || Date.now();
    return { ivl: 3, ease: 2.5, reps: 1, lapses: 0, due: t + 3 * DAY };
  };
})(typeof module !== 'undefined' && module.exports ? module.exports : (window.SRS = {}));
