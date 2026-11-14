// Botones «Copiar» de los prompts de la guía de Claude (guias/claude/*). Lo carga build_guia_claude.py.
document.querySelectorAll(".prompt__copy").forEach(function (b) {
  b.addEventListener("click", function () {
    var txt = b.parentNode.querySelector("code").innerText;
    navigator.clipboard.writeText(txt).then(function () {
      var orig = b.textContent;
      b.textContent = b.dataset.copiado; setTimeout(function () { b.textContent = orig; }, 1500);
    });
  });
});
