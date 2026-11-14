// Buscador, orden y filtros del archivo de ensayos (ensayos/index.html). Lo genera build_diario.py: va como archivo propio para que la CSP no necesite 'unsafe-inline'.
(function () {
  var lista = document.getElementById("diarioLista"), q = document.getElementById("diarioBuscar");
  var items = Array.prototype.slice.call(lista.children), orden = "new", filtro = null;
  function norm(s) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  items.forEach(function (li) { li._q = norm(li.getAttribute("data-q")); li._w = li._q.split(/[^a-z0-9ñ]+/).filter(Boolean); });
  // Tolerancia a errores: cada palabra buscada vale si aparece tal cual o si difiere en 1 letra (2 en palabras largas)
  function dist(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i]; var min = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (cur[j] < min) min = cur[j];
      }
      if (min > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }
  function coincide(li, palabras) {
    return palabras.every(function (w) {
      if (li._q.indexOf(w) !== -1) return true;
      var max = w.length >= 7 ? 2 : w.length >= 4 ? 1 : 0;
      return max > 0 && li._w.some(function (x) { return dist(w, x.slice(0, w.length + max), max) <= max; });
    });
  }
  function pintar() {
    var t = norm(q.value.trim()), palabras = t.split(/\s+/).filter(Boolean), n = 0;
    var cmp = { new: function (a, b) { return b.dataset.fecha.localeCompare(a.dataset.fecha); },
                old: function (a, b) { return a.dataset.fecha.localeCompare(b.dataset.fecha); },
                long: function (a, b) { return b.dataset.palabras - a.dataset.palabras; },
                short: function (a, b) { return a.dataset.palabras - b.dataset.palabras; } }[orden];
    items.sort(cmp).forEach(function (li) {
      var ok = (!t || coincide(li, palabras)) &&(!filtro || (" " + li.dataset.f + " ").indexOf(" " + filtro + " ") !== -1);
      li.hidden = !ok; if (ok) n++; lista.appendChild(li);
    });
    document.getElementById("diarioN").textContent = n;
    document.getElementById("diarioVacio").hidden = n > 0;
    // El contador no se anuncia en cada tecla: un aviso con espera de medio segundo
    clearTimeout(aviso);
    aviso = setTimeout(function () { document.getElementById("diarioAviso").textContent = document.querySelector(".diario-cuenta").textContent.replace(/\s+/g, " ").trim(); }, 500);
  }
  var aviso;
  q.addEventListener("input", pintar);
  document.querySelectorAll("[data-o]").forEach(function (b) {
    b.addEventListener("click", function () {
      orden = b.dataset.o;
      document.querySelectorAll("[data-o]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      pintar();
    });
  });
  function elegir(f) {
    filtro = f;
    document.querySelectorAll(".diario-filtro").forEach(function (x) { x.setAttribute("aria-pressed", x.dataset.f === f); });
    try { history.replaceState(null, "", f ? "#" + f : location.pathname); } catch (e) {}
    pintar();
  }
  document.querySelectorAll(".diario-filtro").forEach(function (b) {
    b.addEventListener("click", function () { elegir(filtro === b.dataset.f ? null : b.dataset.f); });
  });
  document.getElementById("diarioLimpiar").addEventListener("click", function () {
    q.value = ""; filtro = null;
    document.querySelectorAll(".diario-filtro").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
    try { history.replaceState(null, "", location.pathname); } catch (e) {}
    pintar(); q.focus();
  });
  var h = location.hash.slice(1);
  if (h && document.querySelector('.diario-filtro[data-f="' + h + '"]')) elegir(h); else pintar();
})();
