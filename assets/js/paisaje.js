/* Paisaje del arcade: aparece en la pantalla cuando metés el Doblón. Todo en la grilla de las criaturitas
   (tinta, papel y acento): la torre con el ojo que sigue al puntero (click: parpadea), la cueva de la bestia
   (click: tiembla), nubes y libros-pájaro que cruzan, y las 5 llaves del arcade (fc-album → llaves).
   Bocetos y variantes descartadas: 401-personal-sitio/_disenos/2026-10-08-paisaje-arcade-pixel.html. */
(function () {
  var CL = { '#': 'pz-k', 'o': 'pz-p', 'a': 'pz-a', 'd': 'pz-d', 's': 'pz-s' };
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var uid = 0;

  /* ---------- Grilla ---------- */
  function grid(w, h) { var g = []; for (var y = 0; y < h; y++) { g.push([]); for (var x = 0; x < w; x++) g[y].push('.'); } return g; }
  function put(g, x, y, c) { if (g[y] && x >= 0 && x < g[y].length) g[y][x] = c; }
  function get(g, x, y) { return g[y] && g[y][x] !== undefined ? g[y][x] : '.'; }
  function rect(g, x, y, w, h, c) { for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) put(g, x + i, y + j, c); }
  function box(g, x, y, w, h, f) { rect(g, x, y, w, h, '#'); rect(g, x + 1, y + 1, w - 2, h - 2, f || 'o'); }
  function stamp(g, rows, x, y) { rows.forEach(function (r, j) { for (var i = 0; i < r.length; i++) if (r[i] !== '.') put(g, x + i, y + j, r[i]); }); }
  function toRows(g) { return g.map(function (r) { return r.join(''); }); }
  function shape(w, h, f) {
    var g = grid(w, h);
    function ins(x, y) { return x >= 0 && y >= 0 && x < w && y < h && f(x, y); }
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) if (ins(x, y)) g[y][x] = ins(x - 1, y) && ins(x + 1, y) && ins(x, y - 1) && ins(x, y + 1) ? 'o' : '#';
    return g;
  }
  /* Montaña: alturas por columna, contorno de tinta y rayado en las caras que bajan a la derecha. */
  function loma(W, H, picos) {
    function h(c) { if (c < 0 || c >= W) return 0; for (var i = 1; i < picos.length; i++) if (c <= picos[i][0]) { var a = picos[i - 1], b = picos[i]; return Math.round(a[1] + (b[1] - a[1]) * (c - a[0]) / (b[0] - a[0])); } return 0; }
    var g = grid(W, H);
    for (var r = 0; r < H; r++) for (var c = 0; c < W; c++) {
      var t = H - h(c);
      if (r < t) continue;
      if (r === t || r < H - h(c - 1) || r < H - h(c + 1) || c === 0 || c === W - 1) g[r][c] = '#';
      else g[r][c] = (h(c + 1) < h(c) && (r + c) % 3 === 0) ? 's' : 'o';
    }
    return g;
  }
  /* Píxeles a rects: una tira por color y fila. */
  function rects(rows, x0, y0, map) {
    var out = '';
    rows.forEach(function (r, y) { var x = 0; while (x < r.length) { var c = r[x], cls = (map && map[c]) || CL[c]; if (!cls) { x++; continue; } var x1 = x; while (x1 < r.length && r[x1] === c) x1++; out += '<rect class="' + cls + '" x="' + (x0 + x) + '" y="' + (y0 + y) + '" width="' + (x1 - x) + '" height="1"/>'; x = x1; } });
    return out;
  }

  /* ---------- Torre (la del grabado) ---------- */
  var IRIS = ['.aaa.', 'aa#oa', 'a###a', 'aa#aa', '.aaa.'];
  var PICOS = [[0, 1], [7, 8], [11, 7], [17, 16], [22, 22], [27, 15], [31, 18], [36, 8], [41, 9], [44, 1]];
  var TORRE = (function () {
    var W = 23, bw = 17, bh = 44, by = 7, Ht = by + bh, g = grid(W, Ht), x, r;
    for (x = 0; x < W; x += 5) box(g, x, 0, 3, 4, 'o');  /* almenas */
    box(g, 0, 2, W, 5, 'o');
    for (x = 2; x < W - 2; x += 4) put(g, x, 4, 's');
    for (x = 1; x < W - 1; x += 2) put(g, x, 7, '#');      /* canecillos */
    var bx = 3;
    box(g, bx, by, bw, bh + 1, 'o');
    for (r = by + 1; r < Ht; r++) for (x = bx + 1; x < bx + bw - 1; x++) {  /* ladrillos y sombra a la derecha */
      var k = r - by;
      if (k % 3 === 0 || (x - bx + (Math.floor(k / 3) % 2) * 3) % 6 === 0) put(g, x, r, 's');
      if (x >= bx + bw - 3 && (x + r) % 2 === 0) put(g, x, r, 's');
    }
    /* ojo almendrado; el iris va aparte para que pueda moverse */
    var rx = 6, ry = 4, ew = 2 * rx + 1, eh = 2 * ry + 1;
    var eg = shape(ew, eh, function (x, y) { var dx = (x - rx) / (rx + .5), dy = (y - ry) / (ry + .5); return Math.abs(dy) <= 1 - dx * dx; });
    var ex = bx + Math.floor((bw - ew) / 2), ey = by + 6, cerr = grid(ew, eh), mask = [];
    for (var j = 0; j < eh; j++) for (var i = 0; i < ew; i++) {
      var c = eg[j][i]; if (c === '.') continue;
      put(g, ex + i, ey + j, c);
      if (c === 'o') mask.push([ex + i, ey + j]);
      cerr[j][i] = j === ry || (c === '#' && j < ry) ? '#' : 'o';
      if (j === ry + 1 && c === 'o' && i % 2 === 0) cerr[j][i] = '#';
    }
    /* montaña adelante; las paredes bajan hasta tocarla */
    var mw = 45, mh = 22, H = Ht + mh - 9, tx = Math.floor((mw - W) / 2), fin = grid(mw, H), ult = toRows(g)[Ht - 1];
    stamp(fin, toRows(g), tx, 0);
    for (r = Ht; r < H; r++) stamp(fin, [ult], tx, r);
    stamp(fin, toRows(loma(mw, mh, PICOS)), 0, H - mh);
    return { rows: toRows(fin), w: mw, h: H, mask: mask.map(function (m) { return [m[0] + tx, m[1]]; }), ojo: [ex + tx + rx, ey + ry], cerr: { rows: toRows(cerr), x: ex + tx, y: ey } };
  })();
  function torreSVG(x, y, label) {
    var t = TORRE, id = 'pzOjo' + (uid++);
    return '<g class="pz-torre" role="button" tabindex="0" aria-label="' + label + '" transform="translate(' + x + ' ' + y + ')">' + rects(t.rows, 0, 0) +
      '<clipPath id="' + id + '">' + t.mask.map(function (m) { return '<rect x="' + m[0] + '" y="' + m[1] + '" width="1" height="1"/>'; }).join('') + '</clipPath>' +
      '<g clip-path="url(#' + id + ')"><g class="pz-iris" data-rx="3" data-ry="1">' + rects(IRIS, t.ojo[0] - 2, t.ojo[1] - 2) + '</g></g>' +
      '<rect class="pz-centro" x="' + (t.ojo[0] + .5) + '" y="' + (t.ojo[1] + .5) + '" width=".01" height=".01" fill="none"/>' +
      '<g class="pz-cerrado">' + rects(t.cerr.rows, t.cerr.x, t.cerr.y) + '</g>' +
      '<rect width="' + t.w + '" height="' + t.h + '" fill="transparent"/></g>';
  }

  /* ---------- Cueva de la bestia (fauces) ---------- */
  var OJO = ['aa...', '.aa#a', '..aaa'];  /* izquierdo; el derecho es su espejo. Caídos hacia el hocico. */
  var CUEVA = (function () {
    var W = 40, H = 21, mx = 19.5, mrx = 12.5, mry = 15, x, y;
    var g = loma(W, H, [[0, 1], [4, 9], [8, 12], [12, 17], [16, 15], [20, 20], [24, 16], [28, 18], [34, 9], [39, 1]]);
    function enBoca(x, y) { var dx = (x - mx) / mrx, dy = (y - H + .5) / mry; return dx * dx + dy * dy <= 1; }
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) if (enBoca(x, y)) g[y][x] = (!enBoca(x - 1, y) || !enBoca(x + 1, y) || !enBoca(x, y - 1)) ? '#' : 'd';
    var der = OJO.map(function (r) { return r.split('').reverse().join(''); });
    var ojos = OJO.map(function (r, i) { return r + '...' + der[i]; }), w = ojos[0].length;
    var cerr = ojos.map(function (r, j) { return j === 1 ? r.replace(/[^.]/g, 'a') : r.replace(/./g, '.'); });
    return { rows: toRows(g), w: W, h: H, ojos: ojos, cerr: cerr, ox: Math.round(mx - w / 2 + .5), oy: H - 9 };
  })();
  function cuevaSVG(x, y, label) {
    var c = CUEVA;
    return '<g class="pz-cueva" role="button" tabindex="0" aria-label="' + label + '" transform="translate(' + x + ' ' + y + ')"><g class="pz-cuerpo">' + rects(c.rows, 0, 0) +
      '<g class="pz-parp">' + rects(c.ojos, c.ox, c.oy) + '</g><g class="pz-parp-c">' + rects(c.cerr, c.ox, c.oy) + '</g></g>' +
      '<g class="pz-piedra">' + rects(['s', '.', 's'], 12, -2) + rects(['s'], 27, 0) + '</g><rect width="' + c.w + '" height="' + c.h + '" fill="transparent"/></g>';
  }

  /* ---------- Nubes (van todas, mezcladas) ---------- */
  var NUBES = [
    ['......####........', '....##oooo#.###...', '..##ooooooo#ooo#..', '.#ooooooooooooooo#', '#oooooooooooooooo#', '#osososososososos#', '.################.'],
    ['...####.......####........', '.##oooo##...##oooo#####...', '#oooooooo###ooooooooooo##.', '#oosoosoosoosoosoosoosoo#.', '.########################.'],
    ['..###......', '.#ooo#.##..', '#ooooo#oo#.', '#oososooso#', '.#########.'],
    ['.......####.........', '.....##oooo##.......', '..###oo###ooo#.###..', '.#ooooo#oo#ooo#ooo#.', '#oooooo#o##oooooooo#', '#ooooooo##ooooooos#.', '#ososososososososo#.', '.#################..'],
    ['........#####.............', '......##ooooo##...####....', '....##ooooooooo#.#oooo#...', '..##oooooooooooooooooooo#.', '.#ooooooooooooooooooooooo#', '#oooooooooooooooooooooooo#', '#osososososososososososos#', '.########################.'],
    ['....##########.......', '####oooooooooo######.', '.###################.'],
    ['..##..', '.#oo##', '#oooo#', '.####.'],
    ['.....###.....', '....#ooo#....', '...#ooooo##..', '..##oooooo#..', '.#ooooooooo#.', '#ooooooooooo#', '#osososososo#', '.###########.']
  ];

  /* ---------- Libros-pájaro (de costado: el lomo paralelo al suelo y la tapa como ala) ---------- */
  var LIBROS = [
    { B: 7, L: 5, tapa: 'negra' },
    { B: 8, L: 5, tapa: 'verde' },
    { B: 6, L: 4, tapa: 'negra', cinta: true },
    { B: 7, L: 5, tapa: 'vieja', hoja: true }
  ].map(function (sp) {
    var B = sp.B, L = sp.L, x0 = 3, W = B + x0 + 1, sy = L + 1, H = sy + Math.ceil(L * .3) + 3, R = Math.PI / 180;
    return [55, 100, 55, 20].map(function (ang, f) {
      var g = grid(W, H), x, y;
      [.45, .62, .8].forEach(function (k, i) {  /* hojas en abanico: se ven sus bordes a distintas alturas */
        var h = Math.max(2, Math.round((L - 1) * Math.cos(ang * k * R))), xa = x0 + 1 + i, xb = x0 + B - 2 - (2 - i);
        if (i === 0) { box(g, xa, sy - h, xb - xa + 1, h + 1, 'o'); for (y = sy - h + 2; y < sy - 1; y += 2) for (x = xa + 2; x < xb - 1; x++) if ((x * 7 + y * 3) % 11) put(g, x, y, 's'); }
        else { rect(g, xa, sy - h, xb - xa + 1, 1, '#'); rect(g, xa, sy - h + 1, xb - xa + 1, 1, 'o'); rect(g, xb, sy - h, 1, h, '#'); }
      });
      var hc = Math.round(L * Math.cos(ang * R)), y1 = hc >= 0 ? sy - hc : sy, alto = Math.max(Math.abs(hc), 1) + 1;
      var relleno = sp.tapa === 'verde' ? 'a' : sp.tapa === 'vieja' ? 'o' : '#';
      if (alto > 2) box(g, x0, y1, B, alto, relleno); else rect(g, x0, y1, B, alto, '#');
      if (alto > 3 && sp.tapa === 'negra') rect(g, x0 + Math.floor(B / 2) - 1, y1 + Math.floor(alto / 2), 2, 1, 'o');  /* etiqueta */
      if (alto > 3 && sp.tapa === 'vieja') for (x = x0 + 2; x < x0 + B - 2; x += 2) put(g, x, y1 + 1 + (x % 2), 's');
      rect(g, x0, sy, B, 1, '#'); rect(g, x0 + 1, sy + 1, B - 2, 1, '#');  /* lomo */
      if (sp.cinta) { put(g, x0, sy + 1, 'a'); put(g, x0 - 1, sy + 2 + [1, 0, -1, 0][f], 'a'); put(g, x0 - 2, sy + 2 + [0, 1, 0, -1][f], 'a'); }
      if (sp.hoja) stamp(g, f % 2 ? ['##', 'oo', '##'] : ['#.', 'o#', '.#'], [0, 1, 0, 1][f], [2, 0, 3, 1][f]);
      return toRows(g);
    });
  });
  function libroSVG(frames, x, y) {
    return '<g class="pz-bob">' + frames.map(function (fr, i) { return '<g class="pz-fr" style="animation-delay:-' + (i * .15) + 's">' + rects(fr, x, y) + '</g>'; }).join('') + '</g>';
  }

  /* ---------- Llaves: vacías (silueta punteada) o ganadas (verde) ---------- */
  var LLAVE = ['.###........', '#...#.......', '#...########', '#...#..#.#..', '.###........'];
  function llaveSVG(x, y, ganada) {
    var r = '<rect class="pz-ranura" x="' + (x - 1.75) + '" y="' + (y - 1.75) + '" width="15.5" height="8.5" rx="1"/>';
    return r + (ganada ? rects(LLAVE, x + 1, y + 1, { '#': 'pz-k' }) + rects(LLAVE, x, y, { '#': 'pz-a' }) : rects(LLAVE, x, y, { '#': 'pz-hueco' }));
  }

  /* ---------- Cielo ---------- */
  function sol(x, y) {
    var g = shape(5, 5, function (i, j) { return (i - 2) * (i - 2) + (j - 2) * (j - 2) <= 5.8; });
    return '<g class="pz-dia">' + rects(toRows(g), x + 1, y + 1) + rects(['...#...', '.#...#.', '.......', '#.....#', '.......', '.#...#.', '...#...'], x, y) + '</g>';
  }
  function luna(x, y) {
    var g = shape(7, 7, function (i, j) { return (i - 3) * (i - 3) + (j - 3) * (j - 3) <= 11.6; });
    g[2][3] = 's'; g[4][4] = 's';
    return '<g class="pz-noche">' + rects(toRows(g), x, y) + '</g>';
  }
  function estrellas(lista) { return '<g class="pz-noche">' + lista.map(function (p, i) { return '<g class="pz-titila" style="animation-delay:-' + (i * .6) + 's">' + rects(['.#.', '#.#', '.#.'], p[0], p[1]) + '</g>'; }).join('') + '</g>'; }
  function lejos(W, y0) { var r = ''; for (var x = 0; x < W; x++) r += '<rect class="pz-s" x="' + x + '" y="' + (y0 + Math.round(2 * Math.sin(x / 11))) + '" width="1" height="1"/>'; return r; }
  /* Cruza la pantalla de a un píxel: [contenido, x de partida, ancho, segundos, desfase] */
  function cruza(inner, x, W, segs, delay) {
    return '<g class="pz-cruza" style="--x:' + x + ';--w:' + W + ';animation-duration:' + segs + 's;animation-delay:-' + delay + 's;animation-timing-function:steps(' + (W + 34) + ')">' + inner + '</g>';
  }

  /* ---------- Panorama: 160×90 en compu, 90×160 en celu ---------- */
  var T = {
    es: { keys: 'LLAVES', torre: 'La torre del ojo', cueva: 'La cueva de la bestia', alt: 'Paisaje: una torre con un ojo, una cueva con una bestia, nubes y libros que vuelan. Llaves: {n} de 5.' },
    en: { keys: 'KEYS', torre: 'The tower with an eye', cueva: 'The beast’s cave', alt: 'Landscape: a tower with an eye, a cave with a beast, clouds and flying books. Keys: {n} of 5.' }
  };
  function panorama(m, n, x) {
    var W = m ? 90 : 160, H = m ? 160 : 90, suelo = m ? 132 : 70, hud = m ? 136 : 74, t = TORRE, c = CUEVA, i;
    var s = '<rect class="pz-p" width="' + W + '" height="' + H + '"/>';
    s += sol(m ? 6 : 8, 5) + luna(m ? 6 : 8, 5) + estrellas(m ? [[26, 8], [60, 20], [80, 6], [16, 40], [74, 52]] : [[34, 6], [58, 18], [88, 5], [110, 26], [50, 36], [150, 10]]);
    s += lejos(W, suelo - (m ? 24 : 15));
    (m ? [[0, 8, 14, 50, 3], [5, 50, 28, 40, 30], [6, 20, 44, 34, 12], [3, 40, 58, 58, 22], [2, 70, 6, 38, 8]]
       : [[4, 22, 3, 90, 6], [0, 80, 15, 70, 40], [5, 120, 28, 50, 25], [6, 56, 32, 36, 12], [2, 140, 6, 44, 60], [7, 100, 0, 80, 70]])
      .forEach(function (q) { s += cruza(rects(NUBES[q[0]], q[1], q[2]), q[1], W, q[3], q[4]); });
    s += torreSVG(W - t.w - (m ? -2 : 8), suelo + 2 - t.h, x.torre);
    s += rects([new Array(W + 1).join('#')], 0, suelo);
    for (i = 3; i < W; i += 7 + (i % 3)) s += rects(['#.#'], i, suelo - 1);
    s += cuevaSVG(m ? 1 : 6, suelo - c.h, x.cueva);
    (m ? [[0, 16, 62, 16, 3], [1, 56, 78, 20, 11], [2, 30, 94, 18, 7]] : [[0, 50, 18, 22, 4], [1, 84, 32, 28, 14], [3, 24, 38, 25, 20], [2, 120, 46, 19, 9]])
      .forEach(function (q) { s += cruza(libroSVG(LIBROS[q[0]], q[1], q[2]), q[1], W, q[3], q[4]); });
    s += '<rect class="pz-k" y="' + hud + '" width="' + W + '" height="' + (H - hud) + '"/>';
    var txt = x.keys + ' ' + n + '/5';
    if (m) { s += '<text class="pz-hud" x="' + W / 2 + '" y="' + (hud + 8) + '" text-anchor="middle">' + txt + '</text>'; for (i = 0; i < 5; i++) s += llaveSVG(3 + i * 17.6, hud + 13, i < n); }
    else { s += '<text class="pz-hud" x="4" y="' + (hud + 10) + '">' + txt + '</text>'; for (i = 0; i < 5; i++) s += llaveSVG(50 + i * 21, hud + 5, i < n); }
    return '<svg class="pz pz--' + (m ? 'celu' : 'compu') + '" viewBox="0 0 ' + W + ' ' + H + '" shape-rendering="crispEdges" role="img" aria-label="' + x.alt.replace('{n}', n) + '">' + s + '</svg>';
  }

  /* ---------- Vida: el ojo mira, la torre parpadea, la cueva tiembla ---------- */
  var P = null, ultimo = 0, azar = null, vivo = false;
  function mirar() {
    document.querySelectorAll('.pz-iris').forEach(function (o) {
      var svg = o.ownerSVGElement; if (!svg || !svg.getClientRects().length) return;
      var c = svg.querySelector('.pz-centro'), rx = +o.dataset.rx, ry = +o.dataset.ry, tx = 0, ty = 0;
      if (P) {
        var b = c.getBoundingClientRect(), dx = P.x - b.left, dy = P.y - b.top, d = Math.sqrt(dx * dx + dy * dy) || 1, k = Math.min(d / 140, 1);
        tx = Math.round(dx / d * k * rx); ty = Math.round(dy / d * k * ry * 1.6);
      } else if (azar) { tx = Math.round(azar[0] * rx); ty = Math.round(azar[1] * ry); }
      tx = Math.max(-rx, Math.min(rx, tx)); ty = Math.max(-ry, Math.min(ry, ty));
      o.setAttribute('transform', 'translate(' + tx + ' ' + ty + ')');
    });
  }
  function despertar() {
    if (vivo) return; vivo = true;
    var pend = false;
    function apuntar(x, y) { P = { x: x, y: y }; ultimo = Date.now(); if (!pend) { pend = true; requestAnimationFrame(function () { pend = false; mirar(); }); } }
    addEventListener('pointermove', function (e) { apuntar(e.clientX, e.clientY); }, { passive: true });
    addEventListener('pointerdown', function (e) { apuntar(e.clientX, e.clientY); }, { passive: true });
    addEventListener('touchmove', function (e) { var t = e.touches[0]; if (t) apuntar(t.clientX, t.clientY); }, { passive: true });
    addEventListener('scroll', function () { if (P) apuntar(P.x, P.y); }, { passive: true });
    if (!still) setInterval(function () {  /* si nadie se mueve, mira para cualquier lado */
      if (document.hidden || Date.now() - ultimo < 4000) return;
      P = null; azar = [Math.random() * 2 - 1, Math.random() * 2 - 1]; mirar();
    }, 2600);
    function tocar(g) {
      var cls = g.classList.contains('pz-torre') ? 'is-parpadea' : 'is-tiembla';
      g.classList.remove(cls); void g.getBoundingClientRect(); g.classList.add(cls);
      clearTimeout(g._pz); g._pz = setTimeout(function () { g.classList.remove(cls); }, 700);
    }
    document.addEventListener('click', function (e) { var g = e.target.closest && e.target.closest('.pz-torre, .pz-cueva'); if (g) tocar(g); });
    document.addEventListener('keydown', function (e) { var g = e.target.closest && e.target.closest('.pz-torre, .pz-cueva'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); tocar(g); } });
  }

  /* Escala entera: cada píxel de la grilla ocupa los mismos píxeles de pantalla (con 100 % de ancho salían
     de 5 y 6, alternados). Se achica al múltiplo que entra; sobra un margen oscuro a los costados. */
  function encajar(el) {
    var dpr = window.devicePixelRatio || 1;
    el.querySelectorAll('svg.pz').forEach(function (s) {
      var tope = parseFloat(getComputedStyle(s).maxWidth), ancho = el.clientWidth;
      if (tope && tope < ancho) ancho = tope;
      var vb = s.viewBox.baseVal.width, k = Math.floor(ancho * dpr / vb);
      s.style.width = k >= 1 ? k * vb / dpr + 'px' : '';
    });
  }
  var encajados = [];
  addEventListener('resize', function () { encajados.forEach(encajar); });

  /* Dibuja (o redibuja, al cambiar de idioma) el paisaje en el contenedor, con las llaves ganadas. */
  window.paisajeArcade = function (el, llaves, lang) {
    var n = Math.min(5, Object.keys(llaves || {}).length), x = T[lang === 'en' ? 'en' : 'es'];
    el.innerHTML = panorama(false, n, x) + panorama(true, n, x);
    if (encajados.indexOf(el) < 0) encajados.push(el);
    encajar(el);
    despertar(); mirar();
  };
})();
