/* Vista previa «Mutante»: cambia el adorno ❧ de los textos del sitio por el cursor ▶ del sistema.
   main.js escribe los textos (y los traduce), así que lo hacemos después y al cambiar el idioma. */
(function () {
  var SEL = '.btn, .card__link, .hedera';
  function fix(root) {
    (root || document).querySelectorAll(SEL).forEach(function (el) {
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
      while ((n = w.nextNode())) {
        if (n.nodeValue.indexOf('\u2767') !== -1) {
          n.nodeValue = el.classList.contains('hedera') ? n.nodeValue.replace(/\u2767/g, '\u00b7') : n.nodeValue.replace(/\s*\u2767/g, ' \u25b6');
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
