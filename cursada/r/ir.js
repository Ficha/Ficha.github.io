// Las páginas de r/ existen para las vistas previas de los links (WhatsApp y las redes no leen lo que va después del #).
// A las personas las lleva a la app, a la misma parte del apunte. La arma resumenes_web.py: no editar a mano.
(function () {
  var d = document.documentElement.dataset, ok = function (x) { return /^[\w.-]{1,60}$/.test(x || ''); };
  var s = location.hash.slice(1);
  var partes = ['resumenes', ok(d.m) ? d.m : '', ok(d.m) && ok(d.a) ? d.a : '', ok(d.a) && ok(s) ? s : ''].filter(Boolean);
  location.replace('/cursada/?utm_source=link&utm_medium=compartido#' + partes.join('/'));
})();
