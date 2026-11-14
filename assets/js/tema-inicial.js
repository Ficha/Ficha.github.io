// Anti-flash: aplica el tema guardado (y su theme-color) antes del primer paint.
// Va después de <meta id="themeColorMeta"> y sin defer.
(function () {
  try {
    var t = localStorage.getItem("fc-theme");
    if (t) document.documentElement.setAttribute("data-theme", t);
    var systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var effective = t || (systemDark ? "dark" : "light");
    var meta = document.getElementById("themeColorMeta");
    if (meta) meta.setAttribute("content", effective === "dark" ? "#0b0b0c" : "#f5f5f3");
  } catch (e) {}
})();
