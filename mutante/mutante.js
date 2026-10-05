/* Vista previa «Mutante»: cambia el adorno ❧ de los textos del sitio por el cursor ▶ del sistema.
   main.js escribe los textos (y los traduce), así que lo hacemos después y al cambiar el idioma. */
(function () {
  var SEL = '.btn, .card__link, .hedera, .toc__n, .section__lead a';
  function fix(root) {
    (root || document).querySelectorAll(SEL).forEach(function (el) {
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
      while ((n = w.nextNode())) {
        if (n.nodeValue.indexOf('\u2767') !== -1) {
          n.nodeValue = el.classList.contains('hedera') ? n.nodeValue.replace(/\u2767/g, '\u00b7') : el.classList.contains('toc__n') ? n.nodeValue.replace(/\u2767/g, '\u25c6') : n.nodeValue.replace(/\s*\u2767/g, ' \u25b6');
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

/* La foto: retrato en pixel art; al tocarla (o con Enter/Espacio) se da vuelta y aparece la foto real. */
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
