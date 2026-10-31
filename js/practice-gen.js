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

  /* Acronym deck. Every acronym gets a "What does … stand for?" quiz with distractors from the same domain.
     Acronyms that are not already a lesson key term also get their own flashcard; lesson cards that are
     acronyms are tagged so the "Acronyms only" deck includes them too. */
  var taught = {};
  terms.forEach(function (t) {
    t.term.split('/').forEach(function (part) { taught[part.trim().toLowerCase()] = t; });
  });
  var all = (SEC.acronyms || []).filter(function (a) { return SEC.objById(a[2]); }).map(function (a) {
    var slug = a[0].toLowerCase().replace(/[^a-z0-9]+/g, '-');
    var lessonCard = taught[a[0].toLowerCase()];
    if (lessonCard) lessonCard.acronym = true;
    return { id: lessonCard ? lessonCard.id : 'acr-' + slug, slug: slug, obj: a[2], term: a[0], def: a[1] + '. ' + a[3], kind: 'acronym', expansion: a[1], desc: a[3], isNew: !lessonCard };
  });
  all.forEach(function (c, k) {
    var pool = all.filter(function (x) { return x !== c && x.obj[0] === c.obj[0] && x.expansion !== c.expansion; });
    if (pool.length < 3) pool = all.filter(function (x) { return x !== c && x.expansion !== c.expansion; });
    var ds = [];
    for (var i = 0; ds.length < 3 && i < pool.length; i++) {
      var d = pool[(i * 5 + k) % pool.length];
      if (ds.indexOf(d) < 0) ds.push(d);
    }
    SEC.termQuestions.push({
      id: 'acronym-' + c.slug, obj: c.obj, type: 'mc', d: 1, gen: true, acr: true, card: c.id,
      q: 'What does ' + c.term + ' stand for?',
      o: [[c.expansion, c.term + ' stands for ' + c.expansion + '. ' + c.desc, true]].concat(ds.map(function (d) {
        return [d.expansion, 'That is ' + d.term + ': ' + d.desc];
      })),
      ex: c.term + ' stands for ' + c.expansion + '. ' + c.desc
    });
  });
  SEC.terms = terms.concat(all.filter(function (c) { return c.isNew; }).map(function (c) {
    return { id: c.id, obj: c.obj, term: c.term, def: c.def, kind: 'acronym', acronym: true };
  }));
})();
