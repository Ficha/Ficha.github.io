/* CREATURES: los sprites del álbum, uno por fila (# tinta, o papel, a acento). Se editan a mano. */
var CREATURES = [{"id": "robot", "name": "Ficha", "rows": ["....#.#....", ".....#.....", ".....#.....", ".#########.", ".##.###.##.", ".##.###.##.", ".#########.", "...#####...", "..#######..", "..#.###.#..", "..#######..", ".###...###."]}, {"id": "flask", "name": "Erlen", "rows": [".....######.....", ".....######.....", ".....#oooo#.....", ".....#oooo#.....", "....#oooooo#....", "...#oooooooo#...", "..#oooooooooo#..", ".#oo##oooo##oo#.", ".#oo##oooo##oo#.", "#ooooo#oo#ooooo#", "#oooooo##oooooo#", "#aaaaaaaaaaaaaa#", "#aaoaaaaaaaaoaa#", "#aaaaaaaaaaaaaa#", ".##############.", "..##...##...##.."]}, {"id": "owl", "name": "Noctua", "rows": ["..#..........#..", "..##........##..", ".##############.", "#oooooooooooooo#", "#o#####oo#####o#", "#o#ooo#oo#ooo#o#", "#o#o#o#oo#o#o#o#", "#o#ooo#aa#ooo#o#", "#o#####aa#####o#", "#oooooo##oooooo#", "#oo#o#oooo#o#oo#", "#ooo#o#oo#o#ooo#", "#oo#o#oooo#o#oo#", ".#ooooo..ooooo#.", "..a.a......a.a..", "................"]}, {"id": "pad", "name": "Agnes", "rows": [".....######.....", "...##oooooo##...", "..#oooooooooo#..", ".#oooooooooooo#.", ".#oo##oooo##oo#.", "#ooo##oooo##ooo#", "#ooo##oooo##ooo#", "#aooooooooooooa#", "#ooooo####ooooo#", "#oooooooooooooo#", "#oooooooooooooo#", "#oooooooooooooo#", "#oooooooooooooo#", "##.##.####.##.##", "................", "................"]}, {"id": "sprout", "name": "Ceibo", "rows": ["................", "..####....####..", ".#aaaa#..#aaaa#.", ".#aaaaa##aaaaa#.", "..####.##.####..", ".......##.......", "...##########...", "..#oooooooooo#..", ".#oooooooooooo#.", ".#oo##oooo##oo#.", "#ooo##oooo##ooo#", "#aooooooooooooa#", "#ooooo####ooooo#", ".#ooooo..ooooo#.", "..##.##..##.##..", "................"]}, {"id": "fuego", "name": "Lux", "rows": ["........##......", ".......#oo#.....", ".......#oo#.....", "......#oooo#....", ".....#oooo#.....", "....#oooooo#....", "....#oooooo#....", "...#oooooooo#...", "..#oooooooooo#..", ".#ooo##oo##ooo#.", ".#ooo##oo##ooo#.", "#ooooo#oo#ooooo#", "#oooooo##oooooo#", "#ooooaaaaaaoooo#", "#ooooaaaaaaoooo#", ".#oooaaaaaaooo#.", "..#oooooooooo#..", "...##########..."]}, {"id": "rollo", "name": "Curry", "rows": ["................", ".##############.", "#oooooooooooooo#", ".##############.", "..#oooooooooo#..", "..#oooooooooo#..", "..#o##oooo##o#..", "..#o##oooo##o#..", "..#oooooooooo#..", "..#ooo####ooo#..", "..#oooooooooo#..", "..#aaaaaaaaaa#..", "..#aaaaaaaaaa#..", ".##############.", "#oooooooooooooo#", ".##############."]}, {"id": "tintero", "name": "Mélan", "rows": ["...........#aa#.", "...........#aaa#", "..........#aaa#.", ".........#aa##..", "........#aa#....", ".....######.....", ".....######.....", ".....#oooo#.....", "....##oooo##....", "...#oooooooo#...", "..#oooooooooo#..", "..#oo##oo##oo#..", "..#oooo##oooo#..", "..#o#o#o#o#oo#..", "..############..", "...##########..."]}, {"id": "huevo", "name": "Egg", "rows": ["......####......", ".....#oooo#.....", "....#oooooo#....", "...#oooooooo#...", "..#ooo#o#o#oo#..", "..#oo#o#o#ooo#..", ".#oooooooooooo#.", ".#oooooooooooo#.", ".#oooo#oo#oooo#.", ".#oooo#oo#oooo#.", ".#oooo#oo#oooo#.", ".#ooooo##ooooo#.", "..#oaooooooao#..", "..#oaaooooaao#..", "...#oooooooo#...", "....#oooooo#....", ".....######....."]}, {"id": "sobre", "name": "Hermes", "rows": ["................", ".##############.", "#oooooooooooooo#", "##oooooooooooo##", "#o#oooooooooo#o#", "#oo#oooooooo#oo#", "#ooo#oooooo#ooo#", "#oooo#oooo#oooo#", "#ooooo#oo#ooooo#", "#ooooooaaoooooo#", "#ooo#oo##oo#ooo#", "#ooo#oooooo#ooo#", "#oooooooooooooo#", ".##############."]}, {"id": "figaro", "name": "Figaro", "rows": ["................", ".....######.....", ".....######.....", "....#aaaaaa#....", ".##############.", "..#oooooooooo#..", "..#oooooooooo#..", "..#oo#oooo#oo#..", "..#oo#oooo#oo#..", "..#oooooooooo#..", "..#oooo##oooo#..", "..#oooooooooo#..", ".#oooooooooooo#.", ".#ooooa##aoooo#.", ".#ooooaaaaoooo#.", "..############.."]}, {"id": "tecla", "name": "Tecla", "rows": ["......#..#......", ".......##.......", "....########....", "....#......#....", "....#.####.#....", "....#......#....", "..############..", ".#............#.", ".#.##......##.#.", ".#.##......##.#.", ".#....####....#.", ".##############.", ".#.#.#.##.#.#.#.", ".##############.", "..##........##..", ".###........###."]}, {"id": "cronos", "name": "Cronos", "rows": ["################", "#oooooooooooooo#", ".##############.", "..#oooooooooo#..", "..#oo##oo##oo#..", "..#oo##oo##oo#..", "...#aaaaaaaa#...", "....#aaaaaa#....", ".....#aaaa#.....", "......#aa#......", "......#aa#......", ".....#ooao#.....", "....#oooaoo#....", "...#ooooaooo#...", "..#ooooaaaooo#..", "..#oaaaaaaaao#..", ".##############.", "#oooooooooooooo#", "################"]}, {"id": "tomatina", "name": "Tomatina", "rows": [".......##.......", "...##..##..##...", "..#aa#aaaa#aa#..", "...#aaaaaaaa#...", ".####aa##aa####.", "#oooo##oo##oooo#", "#oooooooooooooo#", "#ooo##oooo##ooo#", "#ooo##oooo##ooo#", "#oooooooooooooo#", "#oaaoo####ooaao#", "#oooooooooooooo#", ".#oooooooooooo#.", "..#oooooooooo#..", "...##########..."]}];
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
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function lang() { return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'es'; }
  var T = {
    es: { title: 'Álbum de criaturitas', of: 'de', hint: 'Tocá a las criaturitas que encuentres por el sitio y se guardan acá.', locked: 'Todavía no la encontraste', unknown: '???',
          now: 'se sumó al álbum', doneTitle: '¡Completaste el álbum!', doneBadge: 'Álbum completo',
          doneText: 'Encontraste a las {n} criaturitas. Eso es atención de sobra. Si querés, mandame un mail con una captura del álbum completo: me va a alegrar el día.',
          mail: 'Escribirle a Fidel', keep: 'Seguir recorriendo', reset: 'Borrar mi progreso', sure: '¿Seguro? Tocá de nuevo', ariaFind: 'Criaturita escondida: tocala para guardarla',
          subject: 'Completé el álbum de criaturitas', body: 'Hola Fidel, encontré las {n} criaturitas del sitio. Te adjunto una captura del álbum.' },
    en: { title: 'Little creature album', of: 'of', hint: 'Tap the little creatures you find around the site and they are saved here.', locked: 'You have not found it yet', unknown: '???',
          now: 'joined the album', doneTitle: 'You completed the album!', doneBadge: 'Album complete',
          doneText: 'You found all {n} little creatures. That is plenty of attention. If you like, email me a screenshot of the full album: it will make my day.',
          mail: 'Email Fidel', keep: 'Keep exploring', reset: 'Erase my progress', sure: 'Sure? Tap again', ariaFind: 'Hidden creature: tap it to save it',
          subject: 'I completed the little creature album', body: 'Hi Fidel, I found all {n} little creatures on the site. Here is a screenshot of the album.' }
  };
  var N = CREATURES.length;
  function t() { return T[lang()]; }
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
      '<div class="album__foot"><span class="album__badge" hidden></span><button type="button" class="album__reset"></button></div>' +
      '<p class="sr-only" role="status" aria-live="polite"></p></section>';
    foot.insertBefore(root, foot.firstChild);
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
    grid.innerHTML = CREATURES.map(function (cr) {
      var got = !!state.found[cr.id];
      return '<li class="album__card' + (got ? '' : ' is-locked') + (cr.id === newId ? ' is-new' : '') + '"' + (got ? '' : ' title="' + x.locked + '"') + '>' +
        '<span class="album__art">' + (got ? svg(cr.rows, 4) : svg(cr.rows, 4, 'sil') + '<span class="album__q" aria-hidden="true">?</span>') + '</span>' +
        '<span class="album__name">' + (got ? cr.name : x.unknown) + '</span></li>';
    }).join('');
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
      '<p>' + x.doneText.replace('{n}', N) + '</p><div class="dlg__actions"><a class="btn" href="' + href + '">' + x.mail + ' ►</a><button type="button" class="btn btn--ghost" data-close>' + x.keep + '</button></div>';
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

/* 6) Tomatina: cada vez que se la toca, tira un consejo sobre el sitio (sin repetir hasta agotarlos). */
(function () {
  /* En la voz de Sophie (ver quests-fidel-sophie/docs/voz-sophie.md): ráfagas cortas separadas por «|»,
     mayúscula inicial, sin punto final ni signos de apertura. */
  var TIPS = [
    { es: 'Toca la foto de arriba de todo|El robot tiene otra cara 👆', en: 'Tap the picture at the very top|The robot has another face 👆', href: 'index.html#inicio' },
    { es: 'Hay {n} criaturitas escondidas|Yo ya estoy en tu álbum, faltan las otras jajaja', en: 'There are {n} little creatures hiding|I\'m already in your album, the rest are missing hahaha' },
    { es: 'Si te gusta leer anda a Diario de un Robot|Son 40 ensayos y tiene buscador, posta', en: 'If you like reading go to Diario de un Robot|40 essays and it has a search box, for real', href: 'ensayos/' },
    { es: 'La luna de arriba apaga la luz|De noche re va', en: 'The moon up top turns the lights off|So good at night' },
    { es: 'Ojo con La chispa q si dejás tu mail te regalan Faetón|Un cuento enterooo', en: 'Heads up, in La chispa if you leave your email you get Faetón|A whole storyyy', href: 'blog.html' },
    { es: 'Cronos tiene todas las versiones viejas del sitio|Mira lo que era antes jajaja', en: 'Cronos has every old version of the site|Look what it used to be hahaha', href: 'maquina-del-tiempo.html' },
    { es: 'Las recomendaciones se tocan|Te llevan al LinkedIn de cada persona 👉', en: 'The recommendations are clickable|They take you to each person\'s LinkedIn 👉', href: 'index.html#testimonios' },
    { es: 'Usas Claude?|Hay una guía con plantillas, re útil', en: 'Do you use Claude?|There\'s a guide with templates, super useful', href: 'guias/claude/' },
    { es: 'El botón EN lo pone en inglés|Los cuentos siguen en castellano igual 🥲', en: 'The ES button puts it in Spanish|The stories are in Spanish anyway 🥲' },
    { es: 'Tenés un proyecto?|Escribile, contesta en menos de 48 horas siii ❤', en: 'Got a project?|Write to him, he answers within 48 hours yesss ❤', href: 'index.html#contacto' }
  ];
  var GO = { es: 'Dale', en: 'Go' };
  var order = [], pos = 0;
  function shuffle() { order = TIPS.map(function (_, i) { return i; }); for (var i = order.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), k = order[i]; order[i] = order[j]; order[j] = k; } pos = 0; }
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.tomatina__btn'), out = document.querySelector('.tomatina__dice');
    if (!btn || !out) return;
    var total = typeof CREATURES !== 'undefined' ? CREATURES.length : 14;
    shuffle();
    btn.addEventListener('click', function () {
      if (pos >= order.length) shuffle();
      var tip = TIPS[order[pos++]], html = '';
      ['es', 'en'].forEach(function (l) {
        var msgs = tip[l].replace('{n}', total).split('|').map(function (m) { return '<span class="tomatina__msg">' + esc(m) + '</span>'; });
        if (tip.href) msgs[msgs.length - 1] = msgs[msgs.length - 1].replace('</span>', ' <a class="tomatina__ir" href="' + tip.href + '">' + GO[l] + ' ►</a></span>');
        html += '<span data-lang-content="' + l + '">' + msgs.join('') + '</span>';
      });
      out.innerHTML = html;
      var g = out.parentNode; g.classList.remove('is-new'); void g.offsetWidth; g.classList.add('is-new');
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
