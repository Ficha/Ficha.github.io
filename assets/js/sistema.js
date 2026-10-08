/* CREATURES: los sprites del álbum, uno por fila (# tinta, o papel, a acento). Se editan a mano. */
var CREATURES = [{"id": "robot", "name": "Ficha", "rows": ["....#.#....", ".....#.....", ".....#.....", ".#########.", ".##.###.##.", ".##.###.##.", ".#########.", "...#####...", "..#######..", "..#.###.#..", "..#######..", ".###...###."]}, {"id": "flask", "name": "Erlen", "rows": [".....######.....", ".....######.....", ".....#oooo#.....", ".....#oooo#.....", "....#oooooo#....", "...#oooooooo#...", "..#oooooooooo#..", ".#oo##oooo##oo#.", ".#oo##oooo##oo#.", "#ooooo#oo#ooooo#", "#oooooo##oooooo#", "#aaaaaaaaaaaaaa#", "#aaoaaaaaaaaoaa#", "#aaaaaaaaaaaaaa#", ".##############.", "..##...##...##.."]}, {"id": "owl", "name": "Noctua", "rows": ["..#..........#..", "..##........##..", ".##############.", "#oooooooooooooo#", "#o#####oo#####o#", "#o#ooo#oo#ooo#o#", "#o#o#o#oo#o#o#o#", "#o#ooo#aa#ooo#o#", "#o#####aa#####o#", "#oooooo##oooooo#", "#oo#o#oooo#o#oo#", "#ooo#o#oo#o#ooo#", "#oo#o#oooo#o#oo#", ".#ooooo..ooooo#.", "..a.a......a.a..", "................"]}, {"id": "pad", "name": "Agnes", "rows": [".....######.....", "...##oooooo##...", "..#oooooooooo#..", ".#oooooooooooo#.", ".#oo##oooo##oo#.", "#ooo##oooo##ooo#", "#ooo##oooo##ooo#", "#aooooooooooooa#", "#ooooo####ooooo#", "#oooooooooooooo#", "#oooooooooooooo#", "#oooooooooooooo#", "#oooooooooooooo#", "##.##.####.##.##", "................", "................"]}, {"id": "arch", "name": "Arch", "rows": ["................", ".....######.....", "...##oooooo##...", "..#oooooooooo#..", ".#ooooo##ooooo#.", ".#oooo####oooo#.", ".#ooooo##ooooo#.", ".#ooooo##ooooo#.", ".#oooooooooooo#.", ".#oo##oooo##oo#.", ".#oooooooooooo#.", ".#oooooooooooo#.", ".#ooooo##ooooo#.", ".#oooooooooooo#.", "a#aoooooooooa#a.", "################"]}, {"id": "sprout", "name": "Ceibo", "rows": ["................", "..####....####..", ".#aaaa#..#aaaa#.", ".#aaaaa##aaaaa#.", "..####.##.####..", ".......##.......", "...##########...", "..#oooooooooo#..", ".#oooooooooooo#.", ".#oo##oooo##oo#.", "#ooo##oooo##ooo#", "#aooooooooooooa#", "#ooooo####ooooo#", ".#ooooo..ooooo#.", "..##.##..##.##..", "................"]}, {"id": "fuego", "name": "Lux", "rows": ["........##......", ".......#oo#.....", ".......#oo#.....", "......#oooo#....", ".....#oooo#.....", "....#oooooo#....", "....#oooooo#....", "...#oooooooo#...", "..#oooooooooo#..", ".#ooo##oo##ooo#.", ".#ooo##oo##ooo#.", "#ooooo#oo#ooooo#", "#oooooo##oooooo#", "#ooooaaaaaaoooo#", "#ooooaaaaaaoooo#", ".#oooaaaaaaooo#.", "..#oooooooooo#..", "...##########..."]}, {"id": "rollo", "name": "Curry", "rows": ["................", ".##############.", "#oooooooooooooo#", ".##############.", "..#oooooooooo#..", "..#oooooooooo#..", "..#o##oooo##o#..", "..#o##oooo##o#..", "..#oooooooooo#..", "..#ooo####ooo#..", "..#oooooooooo#..", "..#aaaaaaaaaa#..", "..#aaaaaaaaaa#..", ".##############.", "#oooooooooooooo#", ".##############."]}, {"id": "tintero", "name": "Mélan", "rows": ["...........#aa#.", "...........#aaa#", "..........#aaa#.", ".........#aa##..", "........#aa#....", ".....######.....", ".....######.....", ".....#oooo#.....", "....##oooo##....", "...#oooooooo#...", "..#oooooooooo#..", "..#oo##oo##oo#..", "..#oooo##oooo#..", "..#o#o#o#o#oo#..", "..############..", "...##########..."]}, {"id": "huevo", "name": "Egg", "rows": ["......####......", ".....#oooo#.....", "....#oooooo#....", "...#oooooooo#...", "..#ooo#o#o#oo#..", "..#oo#o#o#ooo#..", ".#oooooooooooo#.", ".#oooooooooooo#.", ".#oooo#oo#oooo#.", ".#oooo#oo#oooo#.", ".#oooo#oo#oooo#.", ".#ooooo##ooooo#.", "..#oaooooooao#..", "..#oaaooooaao#..", "...#oooooooo#...", "....#oooooo#....", ".....######....."]}, {"id": "sobre", "name": "Hermes", "rows": ["................", ".##############.", "#oooooooooooooo#", "##oooooooooooo##", "#o#oooooooooo#o#", "#oo#oooooooo#oo#", "#ooo#oooooo#ooo#", "#oooo#oooo#oooo#", "#ooooo#oo#ooooo#", "#ooooooaaoooooo#", "#ooo#oo##oo#ooo#", "#ooo#oooooo#ooo#", "#oooooooooooooo#", ".##############."]}, {"id": "figaro", "name": "Figaro", "rows": ["................", ".....######.....", ".....######.....", "....#aaaaaa#....", ".##############.", "..#oooooooooo#..", "..#oooooooooo#..", "..#oo#oooo#oo#..", "..#oo#oooo#oo#..", "..#oooooooooo#..", "..#oooo##oooo#..", "..#oooooooooo#..", ".#oooooooooooo#.", ".#ooooa##aoooo#.", ".#ooooaaaaoooo#.", "..############.."]}, {"id": "tecla", "name": "Tecla", "rows": ["................", "....########....", "....#oooooo#....", "....#o####o#....", "....#oooooo#....", ".##############.", "#oooooooooooooo#", "#oo##oooooo##oo#", "#oo##oooooo##oo#", "#oooooo##oooooo#", "#aaaaaaaaaaaaaa#", "#aoaoaoaoaoaoao#", "#oaoaoaoaoaoaoa#", "################", ".##..........##.", "###..........###"]}, {"id": "cronos", "name": "Cronos", "rows": ["################", "#oooooooooooooo#", ".##############.", "..#oooooooooo#..", "..#oo##oo##oo#..", "..#oo##oo##oo#..", "...#aaaaaaaa#...", "....#aaaaaa#....", ".....#aaaa#.....", "......#aa#......", "......#aa#......", ".....#ooao#.....", "....#oooaoo#....", "...#ooooaooo#...", "..#ooooaaaooo#..", "..#oaaaaaaaao#..", ".##############.", "#oooooooooooooo#", "################"]}, {"id": "tomatina", "name": "Tomatina", "rows": [".......##.......", "...##..##..##...", "..#aa#aaaa#aa#..", "...#aaaaaaaa#...", ".####aa##aa####.", "#oooo##oo##oooo#", "#oooooooooooooo#", "#ooo##oooo##ooo#", "#ooo##oooo##ooo#", "#oooooooooooooo#", "#oaaoo####ooaao#", "#oooooooooooooo#", ".#oooooooooooo#.", "..#oooooooooo#..", "...##########..."]}, {"id": "rufo", "name": "Rufo", "rows": ["................", "......#####.....", ".....#ooooo#....", ".....#oo#oo#....", ".....#ooooo#aa..", "....##oooo#.....", "...#oooooooaa#..", "..#ooooooaaaaa#.", ".##oooooaaaaaa#.", "#ooooooooaaaa#..", "#oooooooooooo#..", ".#oooooooooo#...", "..##########....", "....#a..#a......", "....##..##......", "................"]}, {"id": "raton", "name": "Folio", "rows": [".###........###.", "#oaa#......#aao#", "#oaa########aao#", ".##oooooooooo##.", "..#oooooooooo#..", "..#o###oo###o#..", "..#o#a####a#o#..", "..#o###oo###o#..", "##.#ooo##ooo#.##", "...##oooooo##...", "..#oooooooooo#.#", "..#oo#oooo#oo##.", "################", "#aaaaaaaaaaaaaa#", "#ooooooooooooo##", "################"]}];
/* DOBLON: la moneda que se gana al completar el álbum y enciende el arcade. Fenicio, de perfil (cara); la galera
   es la ceca. Una vez metido en la máquina, aparece en el álbum como figurita extra (no cuenta para completarlo)
   y se suma a la guardería del arcade. Misma grilla que las criaturitas. */
var DOBLON = [".....######.....", "...##aaaaaa##...", "..#aaaaaaaaaa#..", ".#aaaa####aaaa#.", ".#aaa######aaa#.", "#aaaa#######aaa#", "#aaaa#####o#aaa#", "#aaaa########aa#", "#aaaa#######aaa#", "#aaaa######aaaa#", "#aaaaa####aaaaa#", ".#aaaa###aaaaa#.", ".#aaa#####aaaa#.", "..#aaaaaaaaaa#..", "...##aaaaaa##...", ".....######....."];
var DOBLON_CECA = [".....######.....", "...##aaaaaa##...", "..#aaaaaaaaaa#..", ".#aaaaaa#aaaaa#.", ".#aaaaaa##aaaa#.", "#aaaaaaa###aaaa#", "#aaaaaaa####aaa#", "#aaaaaaa#aaaaaa#", "#aa##########aa#", "#aaa########aaa#", "#aaaa#o#o#o#aaa#", ".#a#a#a#a#a#aa#.", ".#aaaaaaaaaaaa#.", "..#aaaaaaaaaa#..", "...##aaaaaa##...", ".....######....."];
/* Sistema «Mutante»: adornos, tarjeta que se da vuelta, álbum de criaturitas, recomendaciones,
   Tomatina y la máquina del tiempo. */

/* 1) El adorno ❧ del sitio actual pasa a ser el cursor ► del sistema (main.js escribe los textos y los traduce). */
(function () {
  var SEL = '.btn, .card__link, .reco__link, .hedera, .toc__n, .section__lead a';
  function fix(root) {
    (root || document).querySelectorAll(SEL).forEach(function (el) {
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
      while ((n = w.nextNode())) {
        if (n.nodeValue.indexOf('❧') !== -1) {
          n.nodeValue = el.classList.contains('hedera') ? n.nodeValue.replace(/❧/g, '·')
            : el.classList.contains('toc__n') ? n.nodeValue.replace(/❧/g, '◆')
            : n.nodeValue.replace(/\s*❧/g, ' ►');
        }
      }
    });
  }
  var busy = false;
  var mo = new MutationObserver(function () {
    if (busy) return; busy = true;
    requestAnimationFrame(function () { fix(); busy = false; });
  });
  document.addEventListener('DOMContentLoaded', function () {
    fix();
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
  });
  window.addEventListener('load', function () { fix(); });
})();

/* 2) Tarjeta del retrato: robot al frente, foto atrás. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var b = document.getElementById('flip');
    if (!b) return;
    b.addEventListener('click', function () {
      var on = b.classList.toggle('is-flipped');
      b.setAttribute('aria-pressed', String(on));
    });
  });
})();

/* 3) Álbum de criaturitas. Las criaturas marcadas con data-creature se guardan al primer toque y aparecen
      en el pie de página; las que faltan se ven como sombras con un «?». El progreso vive solo en el
      navegador de quien visita (localStorage); no se envía a ningún lado. */
(function () {
  if (typeof CREATURES === 'undefined') return;
  var KEY = 'fc-album';
  var state = { found: {}, done: false };
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.found) state = s; } catch (e) {} }
  /* Guarda solo lo del álbum: el resto de fc-album (llaves, guía) lo escriben otros bloques. */
  function save() { try { var cur = JSON.parse(localStorage.getItem(KEY) || 'null') || {}; cur.found = state.found; cur.done = state.done; localStorage.setItem(KEY, JSON.stringify(cur)); } catch (e) {} }
  function lang() { return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'es'; }
  var T = {
    es: { title: 'Álbum de criaturitas', of: 'de', hint: 'Tocá a las criaturitas que encuentres por el sitio y se guardan acá.', locked: 'Todavía no la encontraste', unknown: '???',
          now: 'se sumó al álbum', doneTitle: '¡Completaste el álbum!', extra: 'extra', doneBadge: 'Álbum completo',
          doneText: 'Encontraste a las {n} criaturitas. Eso es atención de sobra. Te ganaste un Doblón: metelo en la máquina del arcade. Y si querés, mandame un mail con una captura del álbum completo: me va a alegrar el día.',
          mail: 'Escribirle a Fidel', keep: 'Seguir recorriendo', reset: 'Borrar mi progreso', sure: '¿Seguro? Tocá de nuevo', ariaFind: 'Criaturita escondida: tocala para guardarla',
          arcade: 'Entrar al arcade', subject: 'Completé el álbum de criaturitas', body: 'Hola Fidel, encontré las {n} criaturitas del sitio. Te adjunto una captura del álbum.' },
    en: { title: 'Little creature album', of: 'of', hint: 'Tap the little creatures you find around the site and they are saved here.', locked: 'You have not found it yet', unknown: '???',
          now: 'joined the album', doneTitle: 'You completed the album!', extra: 'bonus', doneBadge: 'Album complete',
          doneText: 'You found all {n} little creatures. That is plenty of attention. You won a Doubloon: put it in the arcade machine. And if you like, email me a screenshot of the full album: it will make my day.',
          mail: 'Email Fidel', keep: 'Keep exploring', reset: 'Erase my progress', sure: 'Sure? Tap again', ariaFind: 'Hidden creature: tap it to save it',
          arcade: 'Enter the arcade', subject: 'I completed the little creature album', body: 'Hi Fidel, I found all {n} little creatures on the site. Here is a screenshot of the album.' }
  };
  var N = CREATURES.length;
  function t() { return T[lang()]; }
  /* Ruta al arcade desde cualquier página: sale del link al press kit del pie, que ya trae la profundidad. */
  function arcadeHref() { var p = document.querySelector('.footer__press'); return p ? p.getAttribute('href').replace('press-kit.html', 'arcade.html') : '/arcade.html'; }
  function byId(id) { for (var i = 0; i < N; i++) if (CREATURES[i].id === id) return CREATURES[i]; return null; }
  function count() { return Object.keys(state.found).length; }
  function svg(rows, px, cls) {
    var w = rows[0].length, h = rows.length, r = '', m = { '#': 'si', o: 'sp', a: 'sa' };
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) { var c = rows[y].charAt(x); if (m[c]) r += '<rect class="' + (cls || m[c]) + '" x="' + x + '" y="' + y + '" width="1" height="1"/>'; }
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w * px + '" height="' + h * px + '" shape-rendering="crispEdges" aria-hidden="true">' + r + '</svg>';
  }

  var root, grid, countEl, badge, resetBtn, resetArmed = false, live, toast, toastTimer;
  function build() {
    var foot = document.querySelector('.site-footer');
    if (!foot) return;
    root = document.createElement('div');
    root.className = 'wrap album-wrap';
    root.innerHTML = '<section class="album" aria-labelledby="albumTitle">' +
      '<div class="album__head"><h2 class="album__title" id="albumTitle"></h2><span class="album__count"></span></div>' +
      '<p class="album__hint"></p><ul class="album__grid"></ul>' +
      '<div class="album__foot"><span class="album__badge" hidden></span><a class="album__arcade" hidden></a><button type="button" class="album__reset"></button></div>' +
      '<p class="sr-only" role="status" aria-live="polite"></p></section>';
    foot.insertBefore(root, foot.firstChild);
    /* Tira de control de color, como la de los pliegos impresos: una tinta por ángulo. */
    var tira = document.createElement('div'); tira.className = 'wrap';
    tira.innerHTML = '<div class="tira" aria-hidden="true"><i></i><i></i><i></i><i></i><span>0° · 15° · 45° · 75°</span></div>';
    foot.insertBefore(tira, root);
    var press = foot.querySelector('.footer__press');
    if (press && !foot.querySelector('.footer__tm')) {
      var tm = document.createElement('a'); tm.className = 'footer__press footer__tm';
      tm.href = press.getAttribute('href').replace('press-kit.html', 'maquina-del-tiempo.html');
      tm.innerHTML = '<span data-lang-content="es">Máquina del tiempo</span><span data-lang-content="en">Time machine</span>';
      press.parentNode.insertBefore(tm, press.nextSibling);
    }
    grid = root.querySelector('.album__grid'); countEl = root.querySelector('.album__count');
    badge = root.querySelector('.album__badge'); resetBtn = root.querySelector('.album__reset'); live = root.querySelector('[role=status]');
    resetBtn.addEventListener('click', function () {
      if (!resetArmed) { resetArmed = true; resetBtn.textContent = t().sure; setTimeout(function () { resetArmed = false; label(); }, 3500); return; }
      state = { found: {}, done: false }; save(); resetArmed = false; render(); markFound();
    });
    render();
  }
  function label() { if (resetBtn) resetBtn.textContent = t().reset; }
  function render(newId) {
    if (!root) return;
    var x = t(), c = count();
    root.querySelector('.album__title').textContent = x.title;
    countEl.textContent = c + ' ' + x.of + ' ' + N;
    root.querySelector('.album__hint').textContent = x.hint;
    label();
    badge.hidden = !state.done; badge.textContent = '★ ' + x.doneBadge;
    var arc = root.querySelector('.album__arcade'); arc.hidden = false; arc.href = arcadeHref(); arc.textContent = x.arcade + ' ►';
    grid.innerHTML = CREATURES.map(function (cr) {
      var got = !!state.found[cr.id];
      return '<li class="album__card' + (got ? '' : ' is-locked') + (cr.id === newId ? ' is-new' : '') + '"' + (got ? '' : ' title="' + x.locked + '"') + '>' +
        '<span class="album__art">' + (got ? svg(cr.rows, 4) : svg(cr.rows, 4, 'sil') + '<span class="album__q" aria-hidden="true">?</span>') + '</span>' +
        '<span class="album__name">' + (got ? cr.name : x.unknown) + '</span></li>';
    }).join('');
    if (state.coin) grid.insertAdjacentHTML('beforeend', '<li class="album__card album__card--extra" title="' + x.extra + '">' +
      '<span class="album__art">' + svg(DOBLON, 4) + '</span><span class="album__name">Doblón · ' + x.extra + '</span></li>');
  }
  function say(txt) { if (live) { live.textContent = ''; setTimeout(function () { live.textContent = txt; }, 30); } }
  function showToast(cr) {
    if (!toast) { toast = document.createElement('div'); toast.className = 'album-toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast); }
    toast.innerHTML = '<span class="album-toast__art">' + svg(cr.rows, 3) + '</span><span><b>' + cr.name + '</b> ' + t().now + '</span>';
    toast.classList.add('is-on'); clearTimeout(toastTimer); toastTimer = setTimeout(function () { toast.classList.remove('is-on'); }, 3200);
  }
  function confetti() {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var box = document.createElement('div'); box.className = 'confetti'; box.setAttribute('aria-hidden', 'true');
    var cols = ['var(--accent)', 'var(--ink)', 'var(--accent)', 'var(--ink-soft)'];
    for (var i = 0; i < 46; i++) {
      var p = document.createElement('i'); p.style.left = (Math.random() * 100) + '%'; p.style.background = cols[i % cols.length];
      p.style.animationDelay = (Math.random() * 0.8) + 's'; p.style.animationDuration = (1.6 + Math.random() * 1.6) + 's'; box.appendChild(p);
    }
    document.body.appendChild(box); setTimeout(function () { box.remove(); }, 4200);
  }
  function celebrate() {
    var x = t();
    var d = document.createElement('dialog'); d.className = 'dlg album-done';
    var href = 'mailto:fidelchaves96@gmail.com?subject=' + encodeURIComponent(x.subject) + '&body=' + encodeURIComponent(x.body.replace('{n}', N));
    d.innerHTML = '<h2>' + x.doneTitle + '</h2><div class="album-done__row">' + CREATURES.map(function (cr) { return '<span>' + svg(cr.rows, 2) + '</span>'; }).join('') + '</div>' +
      '<p class="album-done__coin">' + svg(DOBLON, 5) + '</p><p>' + x.doneText.replace('{n}', N) + '</p><div class="dlg__actions"><a class="btn btn--accent" href="' + arcadeHref() + '">' + x.arcade + ' ►</a><a class="btn" href="' + href + '">' + x.mail + ' ►</a><button type="button" class="btn btn--ghost" data-close>' + x.keep + '</button></div>';
    document.body.appendChild(d);
    d.addEventListener('click', function (e) { if (e.target === d || e.target.hasAttribute('data-close')) d.close(); });
    d.addEventListener('close', function () { d.remove(); });
    if (d.showModal) { d.showModal(); } else { d.setAttribute('open', ''); }
    confetti();
  }
  function collect(id) {
    var cr = byId(id); if (!cr) return;
    if (state.found[id]) return;
    state.found[id] = Date.now(); save();
    render(id); say(cr.name + ' ' + t().now); showToast(cr); markFound();
    if (count() === N && !state.done) { state.done = true; save(); render(); setTimeout(celebrate, 900); }
  }
  function fill() {
    document.querySelectorAll('[data-creature], [data-sprite]').forEach(function (el) {
      if (el.querySelector('svg')) return;
      var cr = byId(el.getAttribute('data-sprite') || el.getAttribute('data-creature'));
      if (cr) el.insertAdjacentHTML('beforeend', svg(cr.rows, +el.getAttribute('data-px') || 4));
    });
  }
  /* Destellos de píxel que salen de la criatura la primera vez que se la toca (el álbum, en chiquito). */
  function sparkle(el) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var r = (el.querySelector('svg') || el).getBoundingClientRect();
    var box = document.createElement('div'); box.className = 'sparkles'; box.setAttribute('aria-hidden', 'true');
    box.style.left = (r.left + r.width / 2) + 'px'; box.style.top = (r.top + r.height / 2) + 'px';
    var n = 16, rad = Math.max(r.width, r.height) / 2;
    for (var i = 0; i < n; i++) {
      var p = document.createElement('i'), a = (i / n) * Math.PI * 2 + Math.random() * 0.3, d = rad + 14 + Math.random() * 30;
      p.style.setProperty('--x', Math.round(Math.cos(a) * d) + 'px'); p.style.setProperty('--y', Math.round(Math.sin(a) * d) + 'px');
      p.style.animationDelay = (Math.random() * 0.08).toFixed(2) + 's';
      if (i % 2) p.className = 'is-ink';
      box.appendChild(p);
    }
    document.body.appendChild(box); setTimeout(function () { box.remove(); }, 900);
  }
  function markFound() {
    document.querySelectorAll('[data-creature]').forEach(function (el) { el.classList.toggle('is-got', !!state.found[el.getAttribute('data-creature')]); });
  }
  function wire() {
    document.querySelectorAll('[data-creature]').forEach(function (el) {
      if (!el.closest('button')) { el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0'); el.setAttribute('aria-label', t().ariaFind); }
      el.classList.add('is-collectible');
    });
    document.addEventListener('click', function (e) {
      var el = e.target.closest && e.target.closest('[data-creature]'); if (!el) return;
      var id = el.getAttribute('data-creature');
      if (!state.found[id]) sparkle(el);
      el.classList.remove('is-caught'); void el.offsetWidth; el.classList.add('is-caught');
      collect(id);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var el = e.target.closest && e.target.closest('[data-creature][role=button]'); if (!el) return;
      e.preventDefault(); el.click();
    });
  }
  document.addEventListener('DOMContentLoaded', function () {
    load(); fill(); build(); wire(); markFound();
    new MutationObserver(function () { render(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
  });
})();

/* 4) Press kit: botones de copiar (bios y colores). */
(function () {
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('.pk-copy');
    if (!b) return;
    var txt = b.getAttribute('data-copy') || '';
    function ok() {
      if (b.classList.contains('pk-sw')) { b.classList.add('is-copied'); setTimeout(function () { b.classList.remove('is-copied'); }, 1400); return; }
      var old = b.textContent; b.textContent = b.getAttribute('data-done') || 'OK';
      setTimeout(function () { b.textContent = old; }, 1600);
    }
    function fallback() {
      var t = document.createElement('textarea'); t.value = txt; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); try { document.execCommand('copy'); ok(); } catch (err) {} t.remove();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, fallback); else fallback();
  });
})();

/* 5) Recomendaciones: se ven de a una y pasan solas (se frenan al pasar el mouse, al tocarlas o con foco).
      Cada tarjeta es un link al LinkedIn de quien la escribió. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var root = document.querySelector('[data-recos]');
    if (!root) return;
    var track = root.querySelector('.recos__track'), slides = [].slice.call(track.children), dots = root.querySelector('.recos__dots');
    var prev = root.querySelector('[data-recos-prev]'), next = root.querySelector('[data-recos-next]');
    var n = slides.length, cur = 0, hold = false, seen = false, timer;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var L = {
      es: { prev: 'Recomendación anterior', next: 'Recomendación siguiente', go: 'Ir a la recomendación', of: 'de' },
      en: { prev: 'Previous recommendation', next: 'Next recommendation', go: 'Go to recommendation', of: 'of' }
    };
    function t() { return L[document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'es']; }
    dots.innerHTML = slides.map(function (_, i) { return '<button type="button" class="recos__dot" data-i="' + i + '"></button>'; }).join('');
    var dotEls = [].slice.call(dots.children);
    function labels() {
      var x = t();
      prev.setAttribute('aria-label', x.prev); next.setAttribute('aria-label', x.next);
      dotEls.forEach(function (d, i) { d.setAttribute('aria-label', x.go + ' ' + (i + 1) + ' ' + x.of + ' ' + n); });
    }
    function mark(i) {
      cur = i;
      dotEls.forEach(function (d, j) { d.setAttribute('aria-current', j === i ? 'true' : 'false'); });
      slides.forEach(function (sl, j) { sl.setAttribute('aria-hidden', j === i ? 'false' : 'true'); sl.tabIndex = j === i ? 0 : -1; });
    }
    function go(i, user) {
      i = (i + n) % n;
      track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: reduce ? 'auto' : 'smooth' });
      mark(i);
      if (user) restart();
    }
    var raf;
    track.addEventListener('scroll', function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { var i = Math.round(track.scrollLeft / track.clientWidth); if (i !== cur && i >= 0 && i < n) mark(i); });
    }, { passive: true });
    prev.addEventListener('click', function () { go(cur - 1, true); });
    next.addEventListener('click', function () { go(cur + 1, true); });
    dots.addEventListener('click', function (e) { var b = e.target.closest('.recos__dot'); if (b) go(+b.getAttribute('data-i'), true); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1, true); }
    });
    function tick() { if (!hold && seen && !document.hidden) go(cur + 1); }
    function restart() { clearInterval(timer); if (!reduce) timer = setInterval(tick, 7000); }
    root.addEventListener('mouseenter', function () { hold = true; });
    root.addEventListener('mouseleave', function () { hold = false; });
    root.addEventListener('focusin', function () { hold = true; });
    root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) hold = false; });
    track.addEventListener('touchstart', function () { restart(); }, { passive: true });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { seen = es[0].isIntersecting; }, { threshold: 0.5 }).observe(root);
    else seen = true;
    window.addEventListener('resize', function () { track.scrollLeft = slides[cur].offsetLeft - track.offsetLeft; });
    labels(); mark(0); restart();
    new MutationObserver(labels).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
  });
})();

/* 6) Consejos en globo: cada vez que se toca a la criatura (.tomatina__btn con su data-creature), tira un consejo
   sin repetir hasta agotarlos. Tomatina, sobre el sitio (en el FAQ); Folio, sobre la guía de Claude (en su portada). */
(function () {
  var TIPS = {};
  /* Tomatina, en la voz de Sophie (402-personal-quests/docs/voz-sophie.md), con tildes y puntuación correctas: frases
     cortas separadas por «|» (una por renglón), burlándose con cariño de Fidel. {corazon} = corazón de píxel. */
  TIPS.tomatina = [
    { es: 'Tocá la foto de arriba de todo.|Atrás del robot está Fidel. Menos pixelado, igual de cuadrado.',
      en: 'Tap the picture at the very top.|Behind the robot is Fidel. Fewer pixels, just as square.', href: 'index.html#inicio' },
    { es: 'Hay {n} criaturitas escondidas.|Fidel es fan de Pokémon, así que hacé el favor de encontrarlas todas.',
      en: 'There are {n} little creatures hiding.|Fidel is a Pokémon fan, so do him a favor and catch them all.' },
    { es: '¿Te gusta leer? En Diario de un Robot hay 40 ensayos.|Posta, cuarenta. No para de escribir ni cuando le hablo.',
      en: 'Do you like reading? Diario de un Robot has 40 essays.|Forty, for real. He doesn\'t stop writing even when I\'m talking to him.', href: 'ensayos/' },
    { es: 'Hay criaturitas distintas de día y de noche.|Cambiá de modo con la luna de arriba y fijate quién aparece. Misterioso, otra vez.',
      en: 'Some little creatures change between day and night.|Switch modes with the moon up top and see who shows up. Mysterious, again.' },
    { es: 'La luna de arriba apaga la luz.|Dice que es para cuidar la vista. Es para parecer misterioso.',
      en: 'The moon up top turns the lights off.|He says it\'s to rest his eyes. It\'s to look mysterious.' },
    { es: 'Si dejás tu mail en La chispa, te regala Faetón.|Un cuento entero, gratis. Es su forma de hacerse querer.',
      en: 'Leave your email in La chispa and he gives you Faetón.|A whole story, free. It\'s his way of getting people to like him.', href: 'blog.html' },
    { es: 'El arcade ya está abierto, aunque no tengas a todas las criaturitas.|Las que encontrás se mudan a la guardería. Las demás andan por ahí, perdidas como Fidel en un supermercado.',
      en: 'The arcade is already open, even if you haven\'t got every little creature.|The ones you find move into the daycare. The rest are out there, lost like Fidel in a supermarket.', href: 'arcade.html' },
    { es: 'Si completás el álbum, en el arcade pasa algo.|No te digo qué. Fidel me hizo jurar. Bueno, no tanto, pero igual.',
      en: 'Complete the album and something happens in the arcade.|I\'m not telling you what. Fidel made me swear. Well, not really, but still.', href: 'arcade.html' },
    { es: 'En la pantalla del arcade hay cinco llaves vacías.|Cada juego va a dar una. ¿Qué abren? Yo sé, pero Fidel me compró el silencio con un chocolate.',
      en: 'There are five empty keys on the arcade screen.|Each game will give you one. What do they open? I know, but Fidel bought my silence with a chocolate bar.', href: 'arcade.html' },
    { es: 'En la guardería, charlá con las criaturitas hasta el final.|Algunas te llevan a pasear por el sitio. Egg no sabe adónde, pero va igual. {corazon}',
      en: 'In the daycare, keep chatting with the little creatures until the end.|Some take you for a walk around the site. Egg doesn\'t know where, but goes anyway. {corazon}', href: 'arcade.html' },
    { es: 'De día, al lado de Agnes hay una tumba que se llama Arch.|No habla mucho. Ni se mueve. Igual es re buena onda.',
      en: 'By day, next to Agnes there\'s a tomb called Arch.|He doesn\'t talk much. Doesn\'t move either. Still a total sweetheart.' },
    { es: 'Cronos guarda todas las versiones viejas del sitio.|Hubo una época en dorado, jajaja. No le digas que te conté.',
      en: 'Cronos keeps every old version of the site.|There was a gold phase, hahaha. Don\'t tell him I told you.', href: 'maquina-del-tiempo.html' },
    { es: 'Las recomendaciones te llevan al LinkedIn de cada persona.|Sí, son reales. No le pagó a nadie (que yo sepa).',
      en: 'The recommendations take you to each person\'s LinkedIn.|Yes, they\'re real. He didn\'t pay anyone (that I know of).', href: 'index.html#testimonios' },
    { es: '¿Usás Claude? Hay una guía con plantillas, re útil.|La escribió para gastar menos. Después se queda hasta las tres probando cosas.',
      en: 'Do you use Claude? There\'s a guide with templates, super useful.|He wrote it to spend less. Then he stays up until three trying things.', href: 'guias/claude/' },
    { es: 'El botón EN pone todo en inglés.|Los cuentos siguen en castellano: solo le falta traducirse a sí mismo.',
      en: 'The ES button puts everything in Spanish.|The stories are still in Spanish: all that\'s left is translating himself.' },
    { es: '¿Tenés un proyecto? Escribile: contesta en menos de 48 horas.|A mí a veces me clava el visto, pero con los clientes es un sol. {corazon}',
      en: 'Got a project? Write to him: he answers within 48 hours.|He leaves me on read sometimes, but with clients he\'s a sweetheart. {corazon}', href: 'index.html#contacto' },
    { es: 'Cuidado con Folio.|Parece muy formal, pero muerde.',
      en: 'Watch out for Folio.|He looks very formal, but he bites.', href: 'guias/claude/' }
  ];
  /* Folio, en personaje: literal y preciso, ama el orden, los números y las listas; no le gustan el ruido ni las
     sorpresas. Ráfagas cortas, con puntuación completa. Dos dejan ver que está enamorado de Tomatina.
     Las rutas son relativas a guias/claude/. */
  TIPS.raton = [
    { es: 'Recomiendo empezar por la tarjeta 00.|Tiene 10 puntos. Los conté tres veces. Siguen siendo 10.', en: 'I recommend starting with card 00.|It has ten points. I counted three times. Still ten.', href: 'desde-cero.html' },
    { es: 'Cada mensaje relee toda la conversación.|El mensaje 50 relee los 49 anteriores.|Es un dato. Me gustan los datos.', en: 'Every message rereads the whole chat.|Message 50 rereads the previous 49.|That is a fact. I like facts.', href: 'como-se-gasta.html' },
    { es: 'Pedí los cambios, no el texto entero.|Formato: original → corregido.|Es el mejor formato que existe. Lo digo en serio.', en: 'Ask for the changes, not the whole text.|Format: original → corrected.|It is the best format there is. I mean it.', href: 'habitos.html' },
    { es: 'Sonnet para casi todo.|Opus gasta bastante más.|Tengo la tabla. Si querés la tabla, avisame.', en: 'Sonnet for almost everything.|Opus spends a lot more.|I have the table. If you want the table, tell me.', href: 'modelos.html' },
    { es: 'El archivo general tiene que pesar menos de 3 KB.|No 3,1. Menos de 3.', en: 'Your general file must weigh under 3 KB.|Not 3.1. Under 3.', href: 'contexto-general.html' },
    { es: 'Al cerrar, pedí el traspaso.|Qué se decidió, qué se hizo, qué sigue.|Siempre los mismos tres. Así me gusta.', en: 'Before you close, ask for the handoff.|What was decided, what was done, what comes next.|Always the same three. That is how I like it.', href: 'proyectos.html' },
    { es: 'Las carpetas llevan un número de tres cifras.|Se ordenan solas. Nadie tiene que adivinar nada.|Qué tranquilidad.', en: 'Folders get a three-digit number.|They sort themselves. Nobody has to guess.|Such a relief.', href: 'carpetas.html' },
    { es: 'Los PDF escaneados, a texto antes.|Un PDF entero es mucho ruido.|El ruido no me gusta.', en: 'Scanned PDFs go to text first.|A whole PDF is a lot of noise.|I do not like noise.', href: 'briefs.html' },
    { es: 'Si hiciste algo dos veces, va a una skill.|La tercera sale igual que las otras dos.|Esa es la parte linda.', en: 'If you did it twice, it goes into a skill.|The third time comes out the same as the other two.|That is the nice part.', href: 'skills.html' },
    { es: 'Las tareas de noche dejan borradores.|No mandan nada. No publican nada.|Sorpresas: cero.', en: 'Night tasks leave drafts.|They send nothing. They publish nothing.|Surprises: zero.', href: 'tareas.html' },
    { es: 'Cada error va al registro con su causa.|Fecha, proyecto, qué pasó, causa, corrección, prevención, estado.|Siete columnas. Las sé de memoria.', en: 'Every mistake goes into the log with its cause.|Date, project, what happened, cause, fix, prevention, status.|Seven columns. I know them by heart.', href: 'calidad.html' },
    { es: 'Sincronizar no es hacer backup.|Regla 3-2-1: tres copias, dos soportes, una fuera de casa.|Repito: 3-2-1.', en: 'Syncing is not a backup.|The 3-2-1 rule: three copies, two media, one off-site.|Again: 3-2-1.', href: 'equipos.html' },
    { es: '¿Tomatina sigue en el FAQ?|Pregunto por un dato. Nada más.|Le guardé un libro. Estante 4, a la izquierda. Es el mejor.', en: 'Is Tomatina still in the FAQ?|I am asking for data. That is all.|I saved her a book. Shelf 4, on the left. It is the best one.', href: '../../index.html#faq' },
    { es: '¿Me leyó Tomatina?|¿No se los mencionó?|Ah, bueno... Solo para saber.', en: 'Did Tomatina read me?|She did not mention them to you?|Oh, well... Just asking.', href: '../../index.html#faq' },
    { es: 'Tomatina tiene 17 consejos.|Los leí todos. En orden. Dos veces.|No sé por qué te cuento esto.', en: 'Tomatina has 17 tips.|I read them all. In order. Twice.|I do not know why I am telling you this.', href: '../../index.html#faq' }
  ];
  var GO = { es: 'Dale', en: 'Go' };
  /* Corazón de 8 bits: contorno de tinta, relleno de acento. */
  var HEART = ['.##...##.', '#aa#.#aa#', '#aaaaaaa#', '#aaaaaaa#', '.#aaaaa#.', '..#aaa#..', '...#a#...', '....#....'];
  function heart() {
    var r = '', k = { '#': 'si', a: 'sa' };
    HEART.forEach(function (row, y) { row.split('').forEach(function (c, x) { if (k[c]) r += '<rect class="' + k[c] + '" x="' + x + '" y="' + y + '" width="1" height="1"/>'; }); });
    return '<svg class="corazon" viewBox="0 0 9 8" width="18" height="16" shape-rendering="crispEdges" aria-hidden="true">' + r + '</svg>';
  }
  function shuffled(n) { var o = []; for (var i = 0; i < n; i++) o.push(i); for (i = n - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), k = o[i]; o[i] = o[j]; o[j] = k; } return o; }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  document.addEventListener('DOMContentLoaded', function () {
    var total = typeof CREATURES !== 'undefined' ? CREATURES.length : 14;
    document.querySelectorAll('.tomatina').forEach(function (box) {
      var btn = box.querySelector('.tomatina__btn'), out = box.querySelector('.tomatina__dice'), list = btn && TIPS[btn.getAttribute('data-creature')];
      if (!out || !list) return;
      out.querySelectorAll('[data-corazon]').forEach(function (el) { el.innerHTML = heart(); });
      var order = shuffled(list.length), pos = 0;
      btn.addEventListener('click', function () {
        if (pos >= order.length) { order = shuffled(list.length); pos = 0; }
        var tip = list[order[pos++]], html = '';
        ['es', 'en'].forEach(function (l) {
          var msgs = tip[l].replace('{n}', total).split('|').map(function (m) { return '<span class="tomatina__msg">' + esc(m).replace('{corazon}', heart()) + '</span>'; });
          html += '<span data-lang-content="' + l + '">' + msgs.join('') +
            (tip.href ? '<a class="tomatina__ir" href="' + tip.href + '">' + GO[l] + ' ►</a>' : '') + '</span>';
        });
        out.innerHTML = html;
        var g = out.parentNode; g.classList.remove('is-new'); void g.offsetWidth; g.classList.add('is-new');
      });
    });
  });
})();

/* 7) Máquina del tiempo: un dial con las versiones del sitio; Cronos acompaña. Sin JS, se ven todas en lista. */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var root = document.querySelector('[data-tm]');
    if (!root) return;
    var slides = [].slice.call(root.querySelectorAll('.tm__slide')), dial = root.querySelector('.tm__dial');
    var prev = root.querySelector('[data-tm-prev]'), next = root.querySelector('[data-tm-next]'), n = slides.length, cur = 0;
    root.classList.add('is-on');
    dial.innerHTML = slides.map(function (sl, i) { return '<button type="button" class="tm__stop" data-i="' + i + '"><b>' + sl.getAttribute('data-v') + '</b><span>' + sl.getAttribute('data-when') + '</span></button>'; }).join('');
    var stops = [].slice.call(dial.children);
    function go(i) {
      cur = Math.max(0, Math.min(n - 1, i));
      slides.forEach(function (sl, j) { sl.hidden = j !== cur; });
      stops.forEach(function (b, j) { b.setAttribute('aria-pressed', j === cur ? 'true' : 'false'); });
      prev.disabled = cur === 0; next.disabled = cur === n - 1;
      dial.scrollLeft = stops[cur].offsetLeft - dial.offsetLeft - (dial.clientWidth - stops[cur].offsetWidth) / 2;
      var sc = root.querySelector('.tm__screen'); sc.classList.remove('is-jump'); void sc.offsetWidth; sc.classList.add('is-jump');
    }
    dial.addEventListener('click', function (e) { var b = e.target.closest('.tm__stop'); if (b) go(+b.getAttribute('data-i')); });
    prev.addEventListener('click', function () { go(cur - 1); });
    next.addEventListener('click', function () { go(cur + 1); });
    root.addEventListener('keydown', function (e) {
      if (e.target.closest('input, textarea')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
    });
    go(0);
  });
})();

/* 6) Donar: los links a Cafecito (y cualquier [data-donar]) abren un cuadro con el alias y el CVU
      de Mercado Pago para transferir sin comisión. Sin JS, el link sigue yendo a Cafecito. */
(function () {
  var ALIAS = 'fidel.mercado', CVU = '0000003100037663540198', CAFE = 'https://cafecito.app/fidelchaves';
  var L = {
    es: { title: 'Invitame un cafecito', text: 'Transferí lo que quieras, desde cualquier banco o billetera. Sin comisión y me llega al instante.',
      alias: 'Alias', cvu: 'CVU', cafe: 'Cafecito', copy: 'Copiar', done: 'Copiado', open: 'Abrir', close: 'Cerrar' },
    en: { title: 'Buy me a coffee', text: 'Send whatever you like from any Argentine bank or wallet. No fees, and it arrives instantly.',
      alias: 'Alias', cvu: 'CVU', cafe: 'Cafecito', copy: 'Copy', done: 'Copied', open: 'Open', close: 'Close' }
  };
  function open() {
    var x = L[document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'es'];
    var d = document.createElement('dialog'); d.className = 'dlg donar';
    function row(label, val) {
      return '<div class="donar__row"><span class="donar__label">' + label + '</span><code class="donar__val">' + val + '</code>' +
        '<button type="button" class="pk-copy" data-copy="' + val + '" data-done="' + x.done + '">' + x.copy + '</button></div>';
    }
    d.innerHTML = '<h2>' + x.title + ' ☕</h2><p>' + x.text + '</p>' + row(x.alias, ALIAS) + row(x.cvu, CVU) +
      '<div class="donar__row"><span class="donar__label">' + x.cafe + '</span><code class="donar__val">cafecito.app/fidelchaves</code>' +
      '<a class="pk-copy" href="' + CAFE + '" target="_blank" rel="noopener">' + x.open + '</a></div>' +
      '<div class="dlg__actions"><button type="button" class="btn btn--ghost" data-close>' + x.close + '</button></div>';
    document.body.appendChild(d);
    d.addEventListener('click', function (e) { if (e.target === d || e.target.hasAttribute('data-close')) d.close(); });
    d.addEventListener('close', function () { d.remove(); });
    if (d.showModal) { d.showModal(); } else { d.setAttribute('open', ''); }
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="cafecito.app"], [data-donar]');
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault(); open();
  });
})();

/* 9) Guía de Claude: cada tarjeta leída hasta el final (hasta los botones de anterior y siguiente) suma 10 de
   experiencia (fc-album → guia = { slug: fecha }). Folio, el ratón de la portada, anota el nivel. La lista de
   tarjetas la escribe build_guia_claude.py entre las marcas: no editarla a mano. */
/* guia:inicio */
var GUIA_TEMAS = [["desde-cero", "Diez cosas que haría el primer día", "Ten things I'd do on day one"], ["como-se-gasta", "Cómo se gasta la cuota", "How the quota gets spent"], ["habitos", "Hábitos de todos los días", "Everyday habits"], ["modelos", "Qué modelo y cuánto esfuerzo", "Which model and how much effort"], ["contexto-general", "El archivo que dice quién sos", "The file that says who you are"], ["proyectos", "Un archivo por proyecto", "One file per project"], ["carpetas", "Ponerle número a las cosas", "Numbering things"], ["briefs", "Destilar lo que consultás seguido", "Distilling what you consult often"], ["skills", "De proceso repetido a skill", "From repeated process to skill"], ["tareas", "Tareas que corren solas", "Tasks that run on their own"], ["newsletter", "El newsletter de mejora continua", "The continuous improvement newsletter"], ["calidad", "Calidad sin burocracia", "Quality without bureaucracy"], ["equipos", "Claude en varias computadoras", "Claude on several computers"], ["kit", "El kit para descargar", "The kit to download"]];
/* guia:fin */
var GUIA_NIVELES = [
  { xp: 0, es: 'Lector de solapas', en: 'Blurb reader' }, { xp: 30, es: 'Lector de índice', en: 'Index reader' },
  { xp: 60, es: 'Ratón de biblioteca', en: 'Bookworm' }, { xp: 100, es: 'Rata de Alejandría', en: 'Rat of Alexandria' },
  { xp: 140, es: 'Bibliotecario del laberinto', en: 'Librarian of the labyrinth' }];
function guiaProgreso(s) {
  var leidas = (s && s.guia) || {}, n = GUIA_TEMAS.filter(function (x) { return leidas[x[0]]; }).length, xp = n * 10, i = 0;
  GUIA_NIVELES.forEach(function (l, k) { if (xp >= l.xp) i = k; });
  return { leidas: leidas, n: n, xp: xp, max: GUIA_TEMAS.length * 10, nivel: i + 1, nombre: GUIA_NIVELES[i],
           sig: GUIA_TEMAS.filter(function (x) { return !leidas[x[0]]; })[0] || null };
}
(function () {
  var KEY = 'fc-album';
  function leer() { try { return JSON.parse(localStorage.getItem(KEY) || 'null') || {}; } catch (e) { return {}; } }
  function lang() { return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'es'; }
  function pintar() {
    var p = guiaProgreso(leer()), l = lang();
    document.querySelectorAll('[data-tema]').forEach(function (c) { c.classList.toggle('is-leida', !!p.leidas[c.getAttribute('data-tema')]); });
    var txt = document.querySelector('#guiaNivel .guia-nivel__txt');
    if (!txt) return;
    txt.innerHTML = '<b>' + (l === 'en' ? 'Level ' : 'Nivel ') + p.nivel + ' · ' + p.nombre[l] + '</b>' +
      '<span class="guia-nivel__bar" aria-hidden="true">' + GUIA_TEMAS.map(function (x) { return '<i' + (p.leidas[x[0]] ? ' class="on"' : '') + '></i>'; }).join('') + '</span>' +
      p.xp + ' / ' + p.max + ' XP · ' + p.n + (l === 'en' ? ' of ' : ' de ') + GUIA_TEMAS.length + (l === 'en' ? ' cards' : ' tarjetas');
  }
  function marcar(slug) {
    var s = leer(); s.guia = s.guia || {};
    if (s.guia[slug]) return;
    s.guia[slug] = Date.now();
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
    pintar();
  }
  document.addEventListener('DOMContentLoaded', function () {
    pintar();
    var fines = document.querySelectorAll('[data-tema-fin]');  /* uno por idioma: cuenta el que se ve */
    if (fines.length) {
      var mira = function () {
        var fin = [].filter.call(fines, function (f) { return f.offsetParent; })[0];
        if (!fin || fin.getBoundingClientRect().top > window.innerHeight) return;
        marcar(fin.getAttribute('data-tema-fin')); window.removeEventListener('scroll', mira);
      };
      window.addEventListener('scroll', mira, { passive: true }); mira();
    }
    new MutationObserver(pintar).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
  });
})();
