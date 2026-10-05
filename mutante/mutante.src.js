/* Vista previa «Mutante»: adornos, tarjeta que se da vuelta y álbum de criaturas.
   Este archivo se arma con build_js.py: antepone CREATURES (los sprites) a este código. */

/* 1) El adorno ❧ del sitio actual pasa a ser el cursor ▶ del sistema (main.js escribe los textos y los traduce). */
(function () {
  var SEL = '.btn, .card__link, .hedera, .toc__n, .section__lead a';
  function fix(root) {
    (root || document).querySelectorAll(SEL).forEach(function (el) {
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
      while ((n = w.nextNode())) {
        if (n.nodeValue.indexOf('❧') !== -1) {
          n.nodeValue = el.classList.contains('hedera') ? n.nodeValue.replace(/❧/g, '·')
            : el.classList.contains('toc__n') ? n.nodeValue.replace(/❧/g, '◆')
            : n.nodeValue.replace(/\s*❧/g, ' ▶');
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
  window.addEventListener('load', fix);
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

/* 3) Álbum de criaturas. Las criaturas marcadas con data-creature se guardan al primer toque y aparecen
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
    es: { title: 'Álbum de criaturas', of: 'de', hint: 'Tocá a las criaturas que encuentres por el sitio y se guardan acá.', locked: 'Todavía no la encontraste', unknown: '???',
          now: 'se sumó al álbum', doneTitle: '¡Completaste el álbum!', doneBadge: 'Álbum completo',
          doneText: 'Encontraste a las {n} criaturas. Eso es atención de sobra. Si querés, mandame un mail con una captura del álbum completo: me va a alegrar el día.',
          mail: 'Escribirle a Fidel', keep: 'Seguir recorriendo', reset: 'Borrar mi progreso', sure: '¿Seguro? Tocá de nuevo', ariaFind: 'Criatura escondida: tocala para guardarla',
          subject: 'Completé el álbum de criaturas', body: 'Hola Fidel, encontré las {n} criaturas del sitio. Te adjunto una captura del álbum.' },
    en: { title: 'Creature album', of: 'of', hint: 'Tap the creatures you find around the site and they are saved here.', locked: 'You have not found it yet', unknown: '???',
          now: 'joined the album', doneTitle: 'You completed the album!', doneBadge: 'Album complete',
          doneText: 'You found all {n} creatures. That is plenty of attention. If you like, email me a screenshot of the full album: it will make my day.',
          mail: 'Email Fidel', keep: 'Keep exploring', reset: 'Erase my progress', sure: 'Sure? Tap again', ariaFind: 'Hidden creature: tap it to save it',
          subject: 'I completed the creature album', body: 'Hi Fidel, I found all {n} creatures on the site. Here is a screenshot of the album.' }
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
      '<p>' + x.doneText.replace('{n}', N) + '</p><div class="dlg__actions"><a class="btn" href="' + href + '">' + x.mail + ' ▶</a><button type="button" class="btn btn--ghost" data-close>' + x.keep + '</button></div>';
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
    load(); build(); wire(); markFound();
    new MutationObserver(function () { render(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
  });
})();
