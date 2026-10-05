/* Small SVG diagram builders used by lessons. Colors come from CSS variables so diagrams work in light and dark themes. */
window.SEC = window.SEC || {};
(function () {
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  // Word-wrap text into lines of at most `max` characters.
  function wrap(text, max) {
    var words = String(text).split(' '), lines = [], cur = '';
    words.forEach(function (w) {
      if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; }
      else cur = (cur + ' ' + w).trim();
    });
    if (cur) lines.push(cur);
    return lines;
  }
  function textBlock(x, y, text, max, cls, lh) {
    lh = lh || 17;
    var lines = wrap(text, max || 16);
    var start = y - ((lines.length - 1) * lh) / 2;
    return '<text class="' + (cls || 'dg-t') + '" text-anchor="middle">' + lines.map(function (l, i) {
      return '<tspan x="' + x + '" y="' + (start + i * lh + 5) + '">' + esc(l) + '</tspan>';
    }).join('') + '</text>';
  }
  var uid = 0;
  function svg(w, h, label, inner) {
    var id = 'arr' + (++uid);
    inner = inner.replace(/url\(#arr\)/g, 'url(#' + id + ')');
    return '<figure class="diagram"><svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + esc(label) + '" preserveAspectRatio="xMidYMid meet">' +
      '<defs><marker id="' + id + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" class="dg-arrowhead"/></marker></defs>' +
      inner + '</svg><figcaption>' + esc(label) + '</figcaption></figure>';
  }
  function tone(t) { return t ? ' dg-' + t : ''; }

  var D = {};

  /* Horizontal flow of steps: items = ['A', 'B'] or [{t:'A', sub:'detail', tone:'good'}] */
  D.flow = function (items, label, opts) {
    opts = opts || {};
    items = items.map(function (i) { return typeof i === 'string' ? { t: i } : i; });
    var n = items.length, bw = opts.bw || 130, gap = 34, bh = opts.bh || 76;
    var w = n * bw + (n - 1) * gap + 20, h = bh + 40;
    var out = '';
    items.forEach(function (it, i) {
      var x = 10 + i * (bw + gap), y = 20;
      out += '<rect class="dg-box' + tone(it.tone) + '" x="' + x + '" y="' + y + '" width="' + bw + '" height="' + bh + '" rx="10"/>';
      if (it.sub) {
        out += textBlock(x + bw / 2, y + 24, it.t, 15, 'dg-t dg-bold');
        out += textBlock(x + bw / 2, y + 54, it.sub, 19, 'dg-t dg-small', 14);
      } else out += textBlock(x + bw / 2, y + bh / 2, it.t, 15, 'dg-t dg-bold');
      if (i < n - 1) out += '<line class="dg-line" x1="' + (x + bw + 2) + '" y1="' + (y + bh / 2) + '" x2="' + (x + bw + gap - 3) + '" y2="' + (y + bh / 2) + '" marker-end="url(#arr)"/>';
    });
    if (opts.loop) {
      var x1 = 10 + (n - 1) * (bw + gap) + bw / 2, x0 = 10 + bw / 2;
      h += 26;
      out += '<path class="dg-line dg-dash" d="M' + x1 + ' ' + (20 + bh) + ' V' + (h - 8) + ' H' + x0 + ' V' + (22 + bh) + '" fill="none" marker-end="url(#arr)"/>';
      if (opts.loopLabel) out += '<text class="dg-t dg-small" x="' + (w / 2) + '" y="' + (h - 12) + '" text-anchor="middle">' + esc(opts.loopLabel) + '</text>';
    }
    return svg(w, h, label, out);
  };

  /* Vertical stack of layers, outermost first: items = [{t, sub, tone}] */
  D.layers = function (items, label) {
    items = items.map(function (i) { return typeof i === 'string' ? { t: i } : i; });
    var n = items.length, w = 560, lh = 44, h = n * lh + 20, out = '';
    items.forEach(function (it, i) {
      var inset = i * 18, y = 10 + i * lh;
      out += '<rect class="dg-box' + tone(it.tone) + '" x="' + (10 + inset) + '" y="' + y + '" width="' + (w - 20 - inset * 2) + '" height="' + (lh - 6) + '" rx="8"/>';
      out += '<text class="dg-t dg-bold" x="' + (26 + inset) + '" y="' + (y + 24) + '">' + esc(it.t) + '</text>';
      if (it.sub) out += '<text class="dg-t dg-small" x="' + (w - 26 - inset) + '" y="' + (y + 24) + '" text-anchor="end">' + esc(it.sub) + '</text>';
    });
    return svg(w, h, label, out);
  };

  /* Cycle of steps around a circle. */
  D.cycle = function (items, label, center) {
    var n = items.length, w = 520, h = 420, cx = w / 2, cy = h / 2, r = 150, out = '';
    out += '<circle class="dg-line dg-dash" cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none"/>';
    if (center) out += textBlock(cx, cy, center, 14, 'dg-t dg-bold');
    items.forEach(function (t, i) {
      var a = -Math.PI / 2 + (i * 2 * Math.PI) / n, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
      out += '<rect class="dg-box dg-accent" x="' + (x - 66) + '" y="' + (y - 26) + '" width="132" height="52" rx="12"/>';
      out += textBlock(x, y, (i + 1) + '. ' + t, 16, 'dg-t dg-bold', 15);
    });
    return svg(w, h, label, out);
  };

  /* Two parties exchanging messages. steps = [{from:'L'|'R', t:'message'}] */
  D.exchange = function (left, right, steps, label) {
    var w = 560, top = 70, sh = 46, h = top + steps.length * sh + 20, out = '';
    out += '<rect class="dg-box dg-accent" x="10" y="8" width="170" height="50" rx="8"/>' + textBlock(95, 33, left, 20, 'dg-t dg-bold', 16);
    out += '<rect class="dg-box dg-accent" x="380" y="8" width="170" height="50" rx="8"/>' + textBlock(465, 33, right, 20, 'dg-t dg-bold', 16);
    out += '<line class="dg-line dg-dash" x1="95" y1="58" x2="95" y2="' + (h - 6) + '"/><line class="dg-line dg-dash" x1="465" y1="58" x2="465" y2="' + (h - 6) + '"/>';
    steps.forEach(function (s, i) {
      var y = top + i * sh + 20, l2r = s.from === 'L';
      out += '<line class="dg-line" x1="' + (l2r ? 98 : 462) + '" y1="' + y + '" x2="' + (l2r ? 459 : 101) + '" y2="' + y + '" marker-end="url(#arr)"/>';
      out += '<text class="dg-t dg-small" x="280" y="' + (y - 7) + '" text-anchor="middle">' + esc(s.t) + '</text>';
    });
    return svg(w, h, label, out);
  };

  /* Network zones from left to right with devices between them.
     parts = [{zone:'Internet'} | {device:'Firewall'}] */
  D.zones = function (parts, label) {
    var x = 10, out = '', zw = 140, dw = 96, h = 170;
    parts.forEach(function (p, i) {
      if (p.zone) {
        out += '<rect class="dg-box' + tone(p.tone || 'zone') + '" x="' + x + '" y="20" width="' + zw + '" height="130" rx="14"/>';
        out += textBlock(x + zw / 2, 46, p.zone, 18, 'dg-t dg-bold');
        if (p.sub) out += textBlock(x + zw / 2, 100, p.sub, 19, 'dg-t dg-small', 15);
        x += zw;
      } else {
        out += '<line class="dg-line" x1="' + (x + 2) + '" y1="85" x2="' + (x + 12) + '" y2="85"/>';
        out += '<rect class="dg-box' + tone(p.tone || 'warn') + '" x="' + (x + 12) + '" y="60" width="' + (dw - 24) + '" height="50" rx="6"/>';
        out += textBlock(x + dw / 2, 85, p.device, 10, 'dg-t dg-small dg-bold', 13);
        out += '<line class="dg-line" x1="' + (x + dw - 12) + '" y1="85" x2="' + (x + dw - 2) + '" y2="85"/>';
        x += dw;
      }
    });
    return svg(x + 10, h, label, out);
  };

  /* Grid/matrix: rows of cells, first row is header. */
  D.grid = function (rows, label, opts) {
    opts = opts || {};
    var cols = rows[0].length, cw = opts.cw || 130, ch = opts.ch || 44, w = cols * cw + 20, h = rows.length * ch + 20, out = '';
    rows.forEach(function (r, ri) {
      r.forEach(function (c, ci) {
        var cell = typeof c === 'string' ? { t: c } : c;
        var cls = ri === 0 || (opts.rowHeader && ci === 0) ? 'dg-box dg-accent' : 'dg-box' + tone(cell.tone);
        out += '<rect class="' + cls + '" x="' + (10 + ci * cw) + '" y="' + (10 + ri * ch) + '" width="' + (cw - 4) + '" height="' + (ch - 4) + '" rx="6"/>';
        out += textBlock(10 + ci * cw + (cw - 4) / 2, 10 + ri * ch + (ch - 4) / 2, cell.t, Math.floor(cw / 8), 'dg-t' + (ri === 0 ? ' dg-bold' : ' dg-small'), 14);
      });
    });
    return svg(w, h, label, out);
  };

  /* Hub with spokes: center + satellites */
  D.hub = function (center, items, label) {
    var w = 560, h = 360, cx = w / 2, cy = h / 2, out = '';
    items.forEach(function (t, i) {
      var a = -Math.PI / 2 + (i * 2 * Math.PI) / items.length, x = cx + 200 * Math.cos(a), y = cy + 130 * Math.sin(a);
      out += '<line class="dg-line" x1="' + cx + '" y1="' + cy + '" x2="' + x + '" y2="' + y + '"/>';
      out += '<rect class="dg-box" x="' + (x - 70) + '" y="' + (y - 22) + '" width="140" height="44" rx="10"/>';
      out += textBlock(x, y, t, 18, 'dg-t dg-small dg-bold', 14);
    });
    out += '<circle class="dg-box dg-accent" cx="' + cx + '" cy="' + cy + '" r="58"/>' + textBlock(cx, cy, center, 12, 'dg-t dg-bold');
    return svg(w, h, label, out);
  };

  /* Raw SVG with standard wrapper. */
  D.raw = function (w, h, label, inner) { return svg(w, h, label, inner); };
  D.text = textBlock;

  SEC.D = D;
})();
