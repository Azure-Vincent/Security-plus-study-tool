/* Interactive PBQ components. Each component renders from a state object and reports changes.
   PBQUI.mount(el, pbq, {state, mode:'practice'|'exam', onChange}) -> controller */
(function () {
  'use strict';
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function clone(o) { return JSON.parse(JSON.stringify(o || {})); }
  function opt(v, cur, label) { return '<option value="' + esc(v) + '"' + (String(v) === String(cur) ? ' selected' : '') + '>' + esc(label || v) + '</option>'; }

  var types = {};

  /* =============== Firewall ACL editor =============== */
  types.firewall = {
    init: function (pbq) { return { rules: clone(pbq.initial || []) }; },
    render: function (c) {
      var p = c.pbq, s = c.state, locked = c.locked;
      var addrOpts = Object.keys(p.addr);
      var dis = locked ? ' disabled' : '';
      var h = '<div class="fw-legend"><h4>Address objects</h4><ul>' + addrOpts.map(function (k) {
        return '<li><code>' + esc(k) + '</code> — ' + esc(p.addr[k].label) + '</li>';
      }).join('') + '</ul><p class="muted small">Rules are processed top to bottom; the first matching rule wins. Traffic matching no rule hits the implicit deny.</p></div>';
      h += '<div class="table-wrap"><table class="fw-table"><caption class="sr-only">Firewall rules</caption><thead><tr><th scope="col">#</th><th scope="col">Action</th><th scope="col">Protocol</th><th scope="col">Source</th><th scope="col">Destination</th><th scope="col">Dest. port</th><th scope="col"><span class="sr-only">Rule tools</span></th></tr></thead><tbody>';
      s.rules.forEach(function (r, i) {
        var n = i + 1;
        h += '<tr' + (c.reveal && c.hits && c.hits[i] ? ' class="fw-hit"' : '') + '><td>' + n + '</td>' +
          '<td><select data-fkey="a' + i + '" data-rule="' + i + '" data-f="action" aria-label="Rule ' + n + ' action"' + dis + '>' + ['ALLOW', 'DENY'].map(function (v) { return opt(v, r.action); }).join('') + '</select></td>' +
          '<td><select data-fkey="p' + i + '" data-rule="' + i + '" data-f="proto" aria-label="Rule ' + n + ' protocol"' + dis + '>' + p.protos.map(function (v) { return opt(v, r.proto); }).join('') + '</select></td>' +
          '<td><select data-fkey="s' + i + '" data-rule="' + i + '" data-f="src" aria-label="Rule ' + n + ' source"' + dis + '>' + addrOpts.map(function (v) { return opt(v, r.src); }).join('') + '</select></td>' +
          '<td><select data-fkey="d' + i + '" data-rule="' + i + '" data-f="dst" aria-label="Rule ' + n + ' destination"' + dis + '>' + addrOpts.map(function (v) { return opt(v, r.dst); }).join('') + '</select></td>' +
          '<td><select data-fkey="o' + i + '" data-rule="' + i + '" data-f="port" aria-label="Rule ' + n + ' destination port"' + dis + '>' + p.ports.map(function (v) { return opt(v, r.port, p.portLabels && p.portLabels[v] ? v + ' (' + p.portLabels[v] + ')' : v); }).join('') + '</select></td>' +
          '<td class="fw-tools">' + (locked ? '' :
            '<button type="button" class="mini" data-fkey="u' + i + '" data-act="up" data-rule="' + i + '" aria-label="Move rule ' + n + ' up"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
            '<button type="button" class="mini" data-fkey="w' + i + '" data-act="down" data-rule="' + i + '" aria-label="Move rule ' + n + ' down"' + (i === s.rules.length - 1 ? ' disabled' : '') + '>↓</button>' +
            '<button type="button" class="mini danger" data-act="del" data-rule="' + i + '" aria-label="Delete rule ' + n + '">✕</button>') + '</td></tr>';
      });
      h += '<tr class="fw-implicit"><td>*</td><td>DENY</td><td>ANY</td><td>ANY</td><td>ANY</td><td>ANY</td><td class="muted small">implicit</td></tr></tbody></table></div>';
      if (!locked) h += '<button type="button" class="btn secondary" data-act="add">+ Add rule</button>';
      if (!locked && c.mode === 'practice') {
        var tp = c.tester || { proto: 'TCP', src: addrOpts[1] || 'ANY', dst: addrOpts[2] || 'ANY', port: p.ports[1] || 'ANY' };
        h += '<details class="fw-tester"><summary>Packet tester (practice aid)</summary><p class="small muted">Pick a flow to see which rule would handle it.</p><div class="row wrap">' +
          '<label>Protocol <select data-tester="proto">' + p.protos.filter(function (x) { return x !== 'ANY'; }).map(function (v) { return opt(v, tp.proto); }).join('') + '</select></label>' +
          '<label>Source <select data-tester="src">' + addrOpts.filter(function (x) { return x !== 'ANY' && !p.addr[x].contains; }).map(function (v) { return opt(v, tp.src); }).join('') + '</select></label>' +
          '<label>Destination <select data-tester="dst">' + addrOpts.filter(function (x) { return x !== 'ANY' && !p.addr[x].contains; }).map(function (v) { return opt(v, tp.dst); }).join('') + '</select></label>' +
          '<label>Port <select data-tester="port">' + p.ports.filter(function (x) { return x !== 'ANY'; }).map(function (v) { return opt(v, tp.port); }).join('') + '</select></label>' +
          '<button type="button" class="btn secondary" data-act="test">Test flow</button></div><p class="tester-out" aria-live="polite">' + (c.testerOut || '') + '</p></details>';
      }
      return h;
    },
    bind: function (c, el) {
      el.addEventListener('change', function (e) {
        var t = e.target;
        if (t.dataset.rule !== undefined && t.dataset.f) { c.state.rules[+t.dataset.rule][t.dataset.f] = t.value; c.changed(false); }
        if (t.dataset.tester) { c.tester = c.tester || {}; ['proto', 'src', 'dst', 'port'].forEach(function (k) { c.tester[k] = el.querySelector('[data-tester="' + k + '"]').value; }); }
      });
      el.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-act]'); if (!b) return;
        var i = +b.dataset.rule, R = c.state.rules;
        if (b.dataset.act === 'add') R.push({ action: 'ALLOW', proto: 'TCP', src: 'ANY', dst: 'ANY', port: c.pbq.ports[1] || 'ANY' });
        if (b.dataset.act === 'del') R.splice(i, 1);
        if (b.dataset.act === 'up' && i > 0) { R.splice(i - 1, 0, R.splice(i, 1)[0]); c.focusKey = 'u' + (i - 1); }
        if (b.dataset.act === 'down' && i < R.length - 1) { R.splice(i + 1, 0, R.splice(i, 1)[0]); c.focusKey = 'w' + (i + 1); }
        if (b.dataset.act === 'test') {
          var tp = {}; ['proto', 'src', 'dst', 'port'].forEach(function (k) { tp[k] = el.querySelector('[data-tester="' + k + '"]').value; });
          c.tester = tp;
          var r = Grading.fwEvaluate(c.pbq, R, tp);
          c.testerOut = '<strong>' + r.action + '</strong> — ' + (r.rule < 0 ? 'no rule matched; the implicit deny applies.' : 'matched rule ' + (r.rule + 1) + '.');
        }
        c.changed(true);
      });
    }
  };

  /* =============== Permission matrix =============== */
  types.matrix = {
    init: function (pbq) { return { cells: clone(pbq.initial || {}) }; },
    render: function (c) {
      var p = c.pbq, s = c.state;
      var h = '<div class="table-wrap"><table class="matrix"><caption class="sr-only">Permission assignments</caption><thead><tr><th scope="col">Subject</th>' +
        p.cols.map(function (col) { return '<th scope="col">' + esc(col.label) + (col.desc ? '<span class="th-sub">' + esc(col.desc) + '</span>' : '') + '</th>'; }).join('') + '</tr></thead><tbody>';
      p.rows.forEach(function (r) {
        h += '<tr><th scope="row">' + esc(r.label) + (r.desc ? '<span class="th-sub">' + esc(r.desc) + '</span>' : '') + '</th>';
        p.cols.forEach(function (col) {
          var key = r.id + ':' + col.id, val = s.cells[key] || p.levels[0];
          var mark = '';
          if (c.reveal && p.expect[key]) mark = p.expect[key].ok.indexOf(val) >= 0 ? ' ok' : ' bad';
          h += '<td class="' + mark + '"><select data-cell="' + key + '" data-fkey="' + key + '" aria-label="' + esc(r.label + ' permission on ' + col.label) + '"' + (c.locked ? ' disabled' : '') + '>' +
            p.levels.map(function (lv) { return opt(lv, val); }).join('') + '</select></td>';
        });
        h += '</tr>';
      });
      h += '</tbody></table></div>';
      if (p.legend) h += '<p class="small muted">' + p.legend + '</p>';
      return h;
    },
    bind: function (c, el) {
      el.addEventListener('change', function (e) {
        var k = e.target.dataset.cell; if (!k) return;
        c.state.cells[k] = e.target.value; c.changed(true);
      });
    }
  };

  /* =============== Drag-and-drop placement =============== */
  types.placement = {
    init: function (pbq) { return { place: clone(pbq.initial || {}) }; },
    tokenHTML: function (c, t) {
      var sel = c.selected === t.id, mark = '';
      if (c.reveal) {
        var where = c.state.place[t.id] || null, acc = t.accept || [];
        mark = (acc.length ? acc.indexOf(where) >= 0 : where === null) ? ' ok' : ' bad';
      }
      // A focusable div (not <button>) because Chromium does not start HTML5 drags from button elements.
      return '<div role="button" class="token' + (sel ? ' selected' : '') + mark + (c.locked ? ' locked' : '') + '" draggable="' + (!c.locked) + '" data-token="' + t.id + '" data-fkey="t-' + t.id + '" aria-pressed="' + sel + '"' + (c.locked ? ' aria-disabled="true"' : ' tabindex="0"') + '>' + esc(t.label).replace(/`([^`]+)`/g, '<code>$1</code>') + '</div>';
    },
    render: function (c) {
      var p = c.pbq, s = c.state, self = this;
      var inZone = {};
      p.tokens.forEach(function (t) { var z = s.place[t.id]; if (z) (inZone[z] = inZone[z] || []).push(t); });
      var pool = p.tokens.filter(function (t) { return !s.place[t.id]; });
      var help = c.locked ? '' : '<p class="small muted" id="dnd-help-' + p.id + '">Drag items into place, or select an item and then choose a target with the “Place here” button. Select a placed item to move it or return it to the pool.</p>';
      var h = help + '<div class="pool dropzone" data-zone="" role="group" aria-label="Unplaced items"><div class="zone-head"><strong>Item pool</strong>' +
        (c.selected && s.place[c.selected] && !c.locked ? '<button type="button" class="mini" data-zonebtn="">Return here</button>' : '') + '</div><div class="tokens">' +
        (pool.length ? pool.map(function (t) { return self.tokenHTML(c, t); }).join('') : '<span class="muted small">All items placed.</span>') + '</div></div>';
      var zoneHTML = function (z) {
        if (z.fixed) return '<div class="node fixed' + (z.kind ? ' ' + z.kind : '') + '" data-node="' + z.id + '" style="' + (z.pos ? 'grid-row:' + z.pos[0] + ';grid-column:' + z.pos[1] : '') + '"><span class="node-icon" aria-hidden="true">' + (z.icon || '▣') + '</span>' + esc(z.label) + '</div>';
        var toks = inZone[z.id] || [];
        return '<div class="zone dropzone" data-zone="' + z.id + '" data-node="' + z.id + '" role="group" aria-label="' + esc(z.label) + '" style="' + (z.pos ? 'grid-row:' + z.pos[0] + ';grid-column:' + z.pos[1] : '') + '">' +
          '<div class="zone-head"><strong>' + esc(z.label) + '</strong>' + (c.selected && !c.locked && s.place[c.selected] !== z.id ? '<button type="button" class="mini" data-zonebtn="' + z.id + '" data-fkey="z-' + z.id + '">Place here</button>' : '') + '</div>' +
          (z.desc ? '<div class="zone-desc small muted">' + esc(z.desc) + '</div>' : '') +
          '<div class="tokens">' + toks.map(function (t) { return self.tokenHTML(c, t); }).join('') + '</div></div>';
      };
      if (p.layout === 'network') {
        h += '<div class="netmap" style="grid-template-columns:repeat(' + p.cols + ',minmax(0,1fr))"><svg class="netlinks" aria-hidden="true"></svg>' + p.zones.map(zoneHTML).join('') + '</div>';
      } else {
        h += '<div class="zones-grid">' + p.zones.map(zoneHTML).join('') + '</div>';
      }
      return h;
    },
    after: function (c, el) {
      if (c.pbq.layout !== 'network') return;
      var map = el.querySelector('.netmap'), svg = map.querySelector('.netlinks');
      function draw() {
        var box = map.getBoundingClientRect();
        svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
        svg.innerHTML = (c.pbq.links || []).map(function (l) {
          var a = map.querySelector('[data-node="' + l[0] + '"]'), b = map.querySelector('[data-node="' + l[1] + '"]');
          if (!a || !b) return '';
          var ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
          return '<line x1="' + (ra.left + ra.width / 2 - box.left) + '" y1="' + (ra.top + ra.height / 2 - box.top) + '" x2="' + (rb.left + rb.width / 2 - box.left) + '" y2="' + (rb.top + rb.height / 2 - box.top) + '"/>';
        }).join('');
      }
      draw();
      if (!c._resize) { c._resize = function () { if (document.body.contains(el)) draw(); else window.removeEventListener('resize', c._resize); }; window.addEventListener('resize', c._resize); }
    },
    bind: function (c, el) {
      function moveTo(tokenId, zone) {
        if (zone) c.state.place[tokenId] = zone; else delete c.state.place[tokenId];
        c.selected = null; c.focusKey = 't-' + tokenId; c.changed(true);
      }
      el.addEventListener('click', function (e) {
        if (c.locked) return;
        var zb = e.target.closest('[data-zonebtn]');
        if (zb && c.selected) { moveTo(c.selected, zb.dataset.zonebtn || null); return; }
        var tk = e.target.closest('[data-token]');
        if (tk) { c.selected = c.selected === tk.dataset.token ? null : tk.dataset.token; c.focusKey = 't-' + tk.dataset.token; c.changed(true, true); return; }
        var z = e.target.closest('.dropzone');
        if (z && c.selected) moveTo(c.selected, z.dataset.zone || null);
      });
      el.addEventListener('keydown', function (e) {
        var tk = e.target.closest('[data-token]');
        if (tk && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); tk.click(); }
      });
      el.addEventListener('dragstart', function (e) {
        var tk = e.target.closest('[data-token]'); if (!tk || c.locked) return;
        e.dataTransfer.setData('text/plain', tk.dataset.token); e.dataTransfer.effectAllowed = 'move';
      });
      el.addEventListener('dragover', function (e) { var z = e.target.closest('.dropzone'); if (z) { e.preventDefault(); z.classList.add('over'); } });
      el.addEventListener('dragleave', function (e) { var z = e.target.closest('.dropzone'); if (z) z.classList.remove('over'); });
      el.addEventListener('drop', function (e) {
        var z = e.target.closest('.dropzone'); if (!z) return;
        e.preventDefault();
        var id = e.dataTransfer.getData('text/plain');
        if (id) moveTo(id, z.dataset.zone || null);
      });
    }
  };

  /* =============== Ordering =============== */
  types.ordering = {
    init: function (pbq) { return { order: (pbq.initialOrder || pbq.items.map(function (i) { return i.id; })).slice() }; },
    render: function (c) {
      var p = c.pbq, s = c.state, n = s.order.length;
      var sorted = p.items.slice().sort(function (a, b) { return a.rank - b.rank; });
      var h = c.locked ? '' : '<p class="small muted">Drag items, or use the arrow buttons, to put them in order (first at the top).</p>';
      h += '<ol class="order-list">' + s.order.map(function (id, i) {
        var it = p.items.find(function (x) { return x.id === id; });
        var mark = '';
        if (c.reveal) {
          var mn = sorted.findIndex(function (x) { return x.rank === it.rank; }), mx = sorted.length - 1 - sorted.slice().reverse().findIndex(function (x) { return x.rank === it.rank; });
          mark = i >= mn && i <= mx ? ' ok' : ' bad';
        }
        return '<li class="order-item' + mark + '" draggable="' + (!c.locked) + '" data-id="' + id + '"><span class="grip" aria-hidden="true">⋮⋮</span><span class="order-num">' + (i + 1) + '</span><span class="order-label">' + esc(it.label) + '</span>' +
          (c.locked ? '' : '<span class="order-btns"><button type="button" class="mini" data-fkey="u-' + id + '" data-move="-1" data-id="' + id + '" aria-label="Move ' + esc(it.label) + ' up"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
            '<button type="button" class="mini" data-fkey="d-' + id + '" data-move="1" data-id="' + id + '" aria-label="Move ' + esc(it.label) + ' down"' + (i === n - 1 ? ' disabled' : '') + '>↓</button></span>') + '</li>';
      }).join('') + '</ol>';
      return h;
    },
    bind: function (c, el) {
      var dragId = null;
      el.addEventListener('click', function (e) {
        var b = e.target.closest('[data-move]'); if (!b || c.locked) return;
        var o = c.state.order, i = o.indexOf(b.dataset.id), j = i + (+b.dataset.move);
        if (j < 0 || j >= o.length) return;
        o.splice(j, 0, o.splice(i, 1)[0]);
        c.focusKey = (j === 0 ? 'd-' : j === o.length - 1 ? 'u-' : (+b.dataset.move < 0 ? 'u-' : 'd-')) + b.dataset.id;
        c.changed(true);
      });
      el.addEventListener('dragstart', function (e) { var li = e.target.closest('.order-item'); if (li) { dragId = li.dataset.id; e.dataTransfer.setData('text/plain', dragId); } });
      el.addEventListener('dragover', function (e) { if (e.target.closest('.order-item')) e.preventDefault(); });
      el.addEventListener('drop', function (e) {
        var li = e.target.closest('.order-item'); if (!li || !dragId || c.locked) return;
        e.preventDefault();
        var o = c.state.order, from = o.indexOf(dragId), to = o.indexOf(li.dataset.id);
        o.splice(to, 0, o.splice(from, 1)[0]); dragId = null; c.changed(true);
      });
    }
  };

  /* =============== Field helper (config, logs, terminal questions) =============== */
  function fieldHTML(c, f, val, prefix) {
    var id = prefix + '-' + f.id, dis = c.locked ? ' disabled' : '', mark = '';
    if (c.reveal) mark = Grading.gradeField(f, val).ok ? ' ok' : ' bad';
    var h = '<div class="field' + mark + '">';
    if (f.kind === 'checkbox') {
      h += '<label class="check"><input type="checkbox" id="' + id + '" data-field="' + f.id + '" data-fkey="' + id + '"' + (val ? ' checked' : '') + dis + '> ' + esc(f.label) + '</label>';
    } else if (f.kind === 'multi') {
      h += '<fieldset><legend>' + esc(f.label) + '</legend>' + f.options.map(function (o, i) {
        return '<label class="check"><input type="checkbox" data-multi="' + f.id + '" value="' + esc(o) + '" data-fkey="' + id + i + '"' + ((val || []).indexOf(o) >= 0 ? ' checked' : '') + dis + '> ' + esc(o) + '</label>';
      }).join('') + '</fieldset>';
    } else {
      h += '<label for="' + id + '">' + esc(f.label) + '</label>';
      if (f.kind === 'select') h += '<select id="' + id + '" data-field="' + f.id + '" data-fkey="' + id + '"' + dis + '>' + opt('', val, '— choose —') + f.options.map(function (o) { return opt(o, val); }).join('') + '</select>';
      else h += '<input id="' + id + '" type="' + (f.kind === 'number' ? 'text' : 'text') + '" inputmode="' + (f.kind === 'number' ? 'decimal' : 'text') + '" autocomplete="off" data-field="' + f.id + '" data-fkey="' + id + '" value="' + esc(val || '') + '"' + dis + (f.placeholder ? ' placeholder="' + esc(f.placeholder) + '"' : '') + '>';
    }
    if (f.help) h += '<div class="small muted">' + f.help + '</div>';
    return h + '</div>';
  }
  function bindFields(c, el, bucket) {
    function upd(e) {
      var t = e.target, store = c.state[bucket];
      if (t.dataset.field) { store[t.dataset.field] = t.type === 'checkbox' ? t.checked : t.value; c.changed(false); }
      if (t.dataset.multi) {
        var vals = [].slice.call(el.querySelectorAll('[data-multi="' + t.dataset.multi + '"]:checked')).map(function (x) { return x.value; });
        store[t.dataset.multi] = vals; c.changed(false);
      }
    }
    el.addEventListener('change', upd);
    el.addEventListener('input', function (e) { if (e.target.tagName === 'INPUT' && e.target.type === 'text') upd(e); });
  }

  /* =============== Settings / configuration form =============== */
  types.config = {
    init: function (pbq) { return { values: clone(pbq.initial || {}) }; },
    render: function (c) {
      return (c.pbq.groups || []).map(function (g) {
        return '<fieldset class="cfg-group"><legend>' + esc(g.label) + '</legend>' + (g.desc ? '<p class="small muted">' + g.desc + '</p>' : '') +
          g.fields.map(function (f) { return fieldHTML(c, f, c.state.values[f.id], 'cfg'); }).join('') + '</fieldset>';
      }).join('');
    },
    bind: function (c, el) { bindFields(c, el, 'values'); }
  };

  /* =============== Log analysis =============== */
  types.logs = {
    init: function () { return { flags: [], answers: {} }; },
    render: function (c) {
      var p = c.pbq, s = c.state;
      var h = '<p class="small muted">' + (c.locked ? '' : 'Select every entry that is evidence of malicious or suspicious activity. Benign entries you flag cancel out correct flags.') + '</p>';
      h += '<div class="logview" role="group" aria-label="' + esc(p.source || 'Log entries') + '"><div class="log-title">' + esc(p.source || 'log') + '</div>';
      p.lines.forEach(function (l) {
        var on = s.flags.indexOf(l.id) >= 0, mark = '';
        if (c.reveal) mark = l.bad ? (on ? ' ok' : ' missed') : (on ? ' bad' : '');
        h += '<label class="logline' + (on ? ' flagged' : '') + mark + '"><input type="checkbox" data-flag="' + l.id + '" data-fkey="l-' + l.id + '"' + (on ? ' checked' : '') + (c.locked ? ' disabled' : '') + '><code>' + esc(l.text) + '</code></label>';
      });
      h += '</div>';
      if (p.questions && p.questions.length) h += '<div class="pbq-questions">' + p.questions.map(function (q) { return fieldHTML(c, q, s.answers[q.id], 'lq'); }).join('') + '</div>';
      return h;
    },
    bind: function (c, el) {
      el.addEventListener('change', function (e) {
        var id = e.target.dataset.flag; if (!id) return;
        var f = c.state.flags, i = f.indexOf(id);
        if (e.target.checked && i < 0) f.push(id); if (!e.target.checked && i >= 0) f.splice(i, 1);
        e.target.closest('.logline').classList.toggle('flagged', e.target.checked);
        c.changed(false);
      });
      bindFields(c, el, 'answers');
    }
  };

  /* =============== Simulated terminal =============== */
  types.terminal = {
    init: function () { return { answers: {} }; },
    render: function (c) {
      var p = c.pbq, s = c.state;
      if (!c.shell) { c.shell = new Grading.Shell(p); c.transcript = c.transcript || (p.motd ? [p.motd] : []); c.hpos = null; }
      var prompt = (p.user || 'analyst') + '@' + (p.host || 'host') + ':' + c.shell.cwd.replace(p.home || '/home/' + (p.user || 'analyst'), '~') + '$';
      var h = '<div class="terminal" role="region" aria-label="Simulated terminal">' +
        '<div class="term-out" aria-live="polite" tabindex="0">' + c.transcript.map(function (t) { return esc(t); }).join('\n') + '</div>' +
        (c.locked && c.mode === 'exam' ? '' : '<form class="term-in"><label class="term-prompt" for="term-' + p.id + '">' + esc(prompt) + '</label><input id="term-' + p.id + '" data-fkey="term" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Terminal command"></form>') +
        '</div><p class="small muted">Type <code>help</code> to list commands. Use the terminal to investigate, then answer below.</p>';
      h += '<div class="pbq-questions">' + p.questions.map(function (q) { return fieldHTML(c, q, s.answers[q.id], 'tq'); }).join('') + '</div>';
      return h;
    },
    after: function (c, el) { var o = el.querySelector('.term-out'); if (o) o.scrollTop = o.scrollHeight; },
    bind: function (c, el) {
      el.addEventListener('submit', function (e) {
        if (!e.target.classList.contains('term-in')) return;
        e.preventDefault();
        var inp = e.target.querySelector('input'), cmd = inp.value;
        var p = c.pbq;
        var prompt = (p.user || 'analyst') + '@' + (p.host || 'host') + ':' + c.shell.cwd.replace(p.home || '/home/' + (p.user || 'analyst'), '~') + '$ ';
        if (cmd.trim() === 'clear') c.transcript = [];
        else {
          var out = c.shell.run(cmd);
          c.transcript.push(prompt + cmd);
          if (out) c.transcript.push(out);
        }
        if (c.transcript.length > 400) c.transcript = c.transcript.slice(-400);
        c.hpos = null; c.focusKey = 'term'; c.changed(true, true);
      });
      el.addEventListener('keydown', function (e) {
        if (e.target.dataset.fkey !== 'term' || !c.shell) return;
        var hist = c.shell.history;
        if (e.key === 'ArrowUp' && hist.length) { c.hpos = c.hpos === null ? hist.length - 1 : Math.max(0, c.hpos - 1); e.target.value = hist[c.hpos]; e.preventDefault(); }
        if (e.key === 'ArrowDown' && c.hpos !== null) { c.hpos = Math.min(hist.length, c.hpos + 1); e.target.value = hist[c.hpos] || ''; e.preventDefault(); }
      });
      bindFields(c, el, 'answers');
    }
  };

  /* =============== Controller =============== */
  function mount(el, pbq, opts) {
    opts = opts || {};
    var T = types[pbq.type];
    var c = {
      pbq: pbq, mode: opts.mode || 'practice', locked: false, reveal: false, selected: null,
      state: opts.state ? clone(opts.state) : T.init(pbq),
      changed: function (rerender, noNotify) {
        if (!noNotify && opts.onChange) opts.onChange(clone(c.state));
        if (rerender !== false) draw();
      }
    };
    function draw() {
      var active = document.activeElement, key = c.focusKey || (active && el.contains(active) ? active.dataset.fkey : null);
      el.innerHTML = T.render(c);
      if (T.after) T.after(c, el);
      if (key) { var f = el.querySelector('[data-fkey="' + key + '"]'); if (f && !f.disabled) f.focus(); }
      c.focusKey = null;
    }
    el.classList.add('pbq-body', 'pbq-' + pbq.type);
    T.bind(c, el);
    draw();
    return {
      getState: function () { return clone(c.state); },
      setState: function (s) { c.state = clone(s); c.shell = null; c.transcript = null; draw(); },
      reset: function () { c.state = T.init(pbq); c.shell = null; c.transcript = null; c.locked = false; c.reveal = false; draw(); if (opts.onChange) opts.onChange(clone(c.state)); },
      lock: function (reveal) { c.locked = true; c.reveal = !!reveal; c.selected = null; draw(); },
      unlock: function () { c.locked = false; c.reveal = false; draw(); }
    };
  }

  window.PBQUI = { mount: mount, types: types };
})();
