/* Extra practice built from lesson content:
   - SEC.terms: one flashcard per key term in every lesson
   - SEC.termQuestions: "which term matches this description?" questions with explained distractors
   Generation is deterministic so IDs (and saved progress) stay stable between launches. */
(function () {
  'use strict';
  function strip(html) {
    return String(html).replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').trim();
  }

  var terms = [];
  SEC.objectives.forEach(function (o) {
    var L = SEC.lessons[o.id];
    if (!L || !L.terms) return;
    L.terms.forEach(function (t, i) {
      terms.push({ id: 'card-' + o.id + '-' + (i + 1), obj: o.id, term: strip(t[0]), def: strip(t[1]) });
    });
  });
  SEC.terms = terms;

  // Distractors come from the same objective first (closest concepts), then the same domain.
  function distractors(t, k) {
    var sameObj = terms.filter(function (x) { return x.obj === t.obj && x.id !== t.id; });
    var sameDom = terms.filter(function (x) { return x.obj[0] === t.obj[0] && x.obj !== t.obj; });
    var out = [];
    for (var i = 0; i < sameObj.length && out.length < 3; i++) out.push(sameObj[(i + k) % sameObj.length]);
    for (var j = 0; out.length < 3 && j < sameDom.length; j++) out.push(sameDom[(j * 7 + k) % sameDom.length]);
    return out.filter(function (x, i, a) { return a.indexOf(x) === i; });
  }

  SEC.termQuestions = [];
  terms.forEach(function (t, k) {
    // Skip definitions that give the answer away by repeating the term.
    if (t.def.toLowerCase().indexOf(t.term.toLowerCase()) >= 0) return;
    var ds = distractors(t, k);
    if (ds.length < 3) return;
    var o = [[t.term, t.term + ': ' + t.def, true]].concat(ds.map(function (d) {
      return [d.term, d.term + ' is a different term: ' + d.def];
    }));
    SEC.termQuestions.push({
      id: 'term-' + t.id.slice(5), obj: t.obj, type: 'mc', d: 1, gen: true, card: t.id,
      q: 'Which term matches this description?\n“' + t.def + '”',
      o: o,
      ex: t.term + ': ' + t.def + ' This term is introduced in lesson ' + t.obj + '.'
    });
  });
})();
