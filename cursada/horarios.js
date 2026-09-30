// Lógica de horarios: choques, huecos y combinaciones sugeridas. Sin DOM, para poder probarla aparte.
//
// Comisión: { id, materia, tipo: 'Teórico' | 'Práctico' | 'Teórico-práctico', nombre, docente?, aula?, modalidad?,
//             bloques: [{ dia: 1..6 (lunes a sábado), desde: 'HH:MM', hasta: 'HH:MM' }] }
// De cada materia se cursa UNA comisión por cada tipo que tenga (un teórico y un práctico, por ejemplo).
var Horarios = (function () {
  var DIAS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  function min(hhmm) { var p = String(hhmm).split(':'); return Number(p[0]) * 60 + Number(p[1] || 0); }
  function hhmm(m) { return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); }

  function sePisan(a, b) { return a.dia === b.dia && min(a.desde) < min(b.hasta) && min(b.desde) < min(a.hasta); }

  // Choques entre comisiones elegidas: [{ a, b, dia, desde, hasta }] (una entrada por par de bloques que se pisan).
  function choques(comisiones) {
    var out = [];
    for (var i = 0; i < comisiones.length; i++) {
      for (var j = i + 1; j < comisiones.length; j++) {
        comisiones[i].bloques.forEach(function (x) {
          comisiones[j].bloques.forEach(function (y) {
            if (sePisan(x, y)) out.push({ a: comisiones[i], b: comisiones[j], dia: x.dia,
              desde: hhmm(Math.max(min(x.desde), min(y.desde))), hasta: hhmm(Math.min(min(x.hasta), min(y.hasta))) });
          });
        });
      }
    }
    return out;
  }

  // Resumen de una grilla: días que se cursa, horas de clase, huecos (minutos libres entre clases del mismo día)
  // y minutos que caen en horarios bloqueados (trabajo, etc.).
  function resumen(comisiones, bloqueos) {
    var porDia = {}, clase = 0, enBloqueo = 0;
    comisiones.forEach(function (c) {
      c.bloques.forEach(function (b) {
        (porDia[b.dia] = porDia[b.dia] || []).push(b);
        clase += min(b.hasta) - min(b.desde);
        (bloqueos || []).forEach(function (q) {
          if (sePisan(b, q)) enBloqueo += Math.min(min(b.hasta), min(q.hasta)) - Math.max(min(b.desde), min(q.desde));
        });
      });
    });
    var huecos = 0, salida = 0, entrada = 24 * 60;
    Object.keys(porDia).forEach(function (d) {
      var L = porDia[d].slice().sort(function (x, y) { return min(x.desde) - min(y.desde); });
      for (var i = 1; i < L.length; i++) huecos += Math.max(0, min(L[i].desde) - min(L[i - 1].hasta));
      entrada = Math.min(entrada, min(L[0].desde));
      salida = Math.max(salida, min(L[L.length - 1].hasta));
    });
    var dias = Object.keys(porDia).map(Number).sort();
    return { dias: dias, clase: clase, huecos: huecos, enBloqueo: enBloqueo, entrada: dias.length ? hhmm(entrada) : '', salida: dias.length ? hhmm(salida) : '' };
  }

  // Grupos a resolver: una entrada por (materia, tipo) con sus comisiones posibles.
  function grupos(materias, comisiones) {
    var g = [];
    materias.forEach(function (m) {
      var tipos = {};
      comisiones.filter(function (c) { return c.materia === m; }).forEach(function (c) { (tipos[c.tipo] = tipos[c.tipo] || []).push(c); });
      Object.keys(tipos).forEach(function (t) { g.push({ materia: m, tipo: t, opciones: tipos[t] }); });
    });
    return g;
  }

  // Prueba las combinaciones y devuelve las mejores. Menor puntaje = mejor:
  // un choque pesa más que cualquier otra cosa; después, pisar un horario bloqueado; después, días y huecos.
  // pref: { bloqueos: [{dia, desde, hasta}], sinSabado: bool, fijas: { 'materia|tipo': idComision } }
  function sugerir(materias, comisiones, pref, cuantas) {
    pref = pref || {};
    var G = grupos(materias, comisiones);
    if (!G.length) return { combinaciones: [], total: 0, recortado: false };
    G.forEach(function (g) {
      var fija = (pref.fijas || {})[g.materia + '|' + g.tipo];
      if (fija) g.opciones = g.opciones.filter(function (c) { return c.id === fija; });
    });
    var total = G.reduce(function (n, g) { return n * Math.max(1, g.opciones.length); }, 1);
    var LIMITE = 20000, probadas = 0, mejores = [];
    function puntaje(sel) {
      var ch = choques(sel), r = resumen(sel, pref.bloqueos);
      var p = ch.length * 100000 + r.enBloqueo * 50 + r.dias.length * 120 + r.huecos;
      if (pref.sinSabado && r.dias.indexOf(6) >= 0) p += 5000;
      return { p: p, choques: ch, resumen: r };
    }
    (function rec(i, sel) {
      if (probadas >= LIMITE) return;
      if (i === G.length) {
        probadas++;
        var s = puntaje(sel);
        mejores.push({ comisiones: sel.slice(), puntaje: s.p, choques: s.choques, resumen: s.resumen });
        if (mejores.length > 60) { mejores.sort(function (a, b) { return a.puntaje - b.puntaje; }); mejores.length = 30; }
        return;
      }
      if (!G[i].opciones.length) return rec(i + 1, sel);
      G[i].opciones.forEach(function (c) { sel.push(c); rec(i + 1, sel); sel.pop(); });
    })(0, []);
    mejores.sort(function (a, b) { return a.puntaje - b.puntaje; });
    return { combinaciones: mejores.slice(0, cuantas || 5), total: total, recortado: total > LIMITE };
  }

  return { DIAS: DIAS, min: min, hhmm: hhmm, sePisan: sePisan, choques: choques, resumen: resumen, grupos: grupos, sugerir: sugerir };
})();
