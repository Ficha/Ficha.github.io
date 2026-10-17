// Planificador de libros (Cursada): pantalla del cronograma editorial profesional.
// Las cuentas están en /cursada/cronograma.js; las plantillas, en plantillas.json (las arma libro_plantillas.py).
// Sin cuentas ni servidor: todo queda en este navegador (localStorage 'cursada.libro.v1'). Código MIT; plantillas CC BY (Fidel Chaves · Cursada).
(function () {
  'use strict';
  var KEY = 'cursada.libro.v1';
  var BASE = '/cursada/';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var hoyISO = function () { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  var fmtF = function (s) { return s ? s.split('-').reverse().join('/') : ''; };
  var f1 = function (v) { return String(Math.round(v * 10) / 10).replace('.', ','); };
  var NOMBRES_TIPO = { FS: 'termina → empieza', SS: 'empieza → empieza', FF: 'termina → termina', SF: 'empieza → termina' };

  var P = null;            // plantillas.json
  var FERIADOS = [];       // 'AAAA-MM-DD'
  var ANIOS_FERIADOS = 0;  // último año con feriados publicados
  var S = null;            // estado
  var raiz = $('#planificador');
  var crT;

  function estadoNuevo(id) {
    var pl = P.plantillas.filter(function (x) { return x.id === id; })[0] || P.plantillas[0];
    return { v: 1, plantilla: pl.id, titulo: '', modo: 'desde', fecha: hoyISO(), metodo: 'gantt', plazo: '', verRol: false, plegadas: {}, tareas: Cronograma.sanear(pl.tareas.map(function (t) { return Object.assign({}, t); }), 200) };
  }
  function normalizar(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var ok = P.plantillas.some(function (p) { return p.id === raw.plantilla; });
    var iso = /^\d{4}-\d{2}-\d{2}$/;
    return {
      v: 1, plantilla: ok ? raw.plantilla : 'blanco', titulo: String(raw.titulo || '').replace(/[<>]/g, '').slice(0, 80),
      modo: raw.modo === 'hasta' ? 'hasta' : 'desde', fecha: iso.test(raw.fecha) ? raw.fecha : hoyISO(),
      metodo: ['gantt', 'pert', 'roy'].indexOf(raw.metodo) >= 0 ? raw.metodo : 'gantt', plazo: String(raw.plazo || '').replace(/[^\d.,]/g, '').slice(0, 6),
      verRol: !!raw.verRol, plegadas: raw.plegadas && typeof raw.plegadas === 'object' ? raw.plegadas : {}, tareas: Cronograma.sanear(raw.tareas, 200)
    };
  }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sin almacenamiento: sigue andando */ } }
  function cargar() { try { return normalizar(JSON.parse(localStorage.getItem(KEY))); } catch (e) { return null; } }

  // ---------- utilidades de tareas ----------
  var nro = function (id) { var i = S.tareas.findIndex(function (x) { return x.id === id; }); return i < 0 ? '?' : String(i + 1); };
  function preTexto(x) {
    return Cronograma.rels(x).map(function (q) { return nro(q.id) + (q.tipo === 'FS' && !q.lag ? '' : q.tipo + (q.lag ? (q.lag > 0 ? '+' : '') + q.lag : '')); }).join(', ');
  }
  function preLeer(txt, x) {
    var out = [], vistos = {};
    String(txt).split(/[,;\s]+/).forEach(function (tk) {
      var m = /^(\d{1,3})(FS|SS|FF|SF)?([+-]\d{1,3})?$/i.exec(tk.trim());
      if (!m) return;
      var y = S.tareas[parseInt(m[1], 10) - 1];
      if (!y || y === x) return;
      var tipo = (m[2] || 'FS').toUpperCase(), lag = m[3] ? parseInt(m[3], 10) : 0, k = y.id + tipo;
      if (vistos[k]) return; vistos[k] = 1;
      out.push(tipo === 'FS' && !lag ? y.id : { id: y.id, tipo: tipo, lag: lag });
    });
    return out;
  }
  function fases() { return P.fases.concat([{ id: '', t: 'Otras tareas' }]); }

  // ---------- cálculo ----------
  function calcular() {
    var ts = S.tareas;
    if (!ts.length) return { vacio: true };
    var res = S.metodo === 'pert' ? Cronograma.pert(ts, S.plazo) : Cronograma.calcular(ts, S.metodo);
    if (res.error) return { error: res.error };
    var fe = Cronograma.fechas(res, S.modo, S.fecha, FERIADOS, hoyISO());
    return { res: res, fe: fe };
  }
  var porId = function (arr) { var m = {}; arr.forEach(function (v) { m[v.id] = v; }); return m; };

  // ---------- pantalla ----------
  function boton(acc, t, cls, extra) { return '<button type="button" class="btn ' + (cls || '') + ' ch" data-acc="' + acc + '"' + (extra || '') + '>' + t + '</button>'; }

  function vista() {
    var chips = P.plantillas.map(function (p) {
      return '<button type="button" class="btn ' + (p.id === S.plantilla ? '' : 'sec') + ' ch" data-acc="plantilla" data-id="' + esc(p.id) + '" aria-pressed="' + (p.id === S.plantilla) + '" title="' + esc(p.d) + '">' + esc(p.t) + '</button>';
    }).join('');
    var pl = P.plantillas.filter(function (p) { return p.id === S.plantilla; })[0];
    var met = [['gantt', 'Gantt'], ['pert', 'PERT'], ['roy', 'Roy']].map(function (m) {
      return '<button type="button" class="btn ' + (S.metodo === m[0] ? '' : 'sec') + ' ch" data-acc="metodo" data-id="' + m[0] + '" aria-pressed="' + (S.metodo === m[0]) + '">' + m[1] + '</button>';
    }).join('');
    return '<section class="tarjeta no-imprimir"><h2>1. Tu libro</h2>' +
      '<p class="chico tenue" style="margin:4px 0 8px">Partí de una plantilla: es el proceso completo, del original a la liquidación de derechos y la reimpresión. Podés sacar, sumar y cambiar lo que quieras; cada tarea se puede marcar «no aplica».</p>' +
      '<div class="fila" role="group" aria-label="Plantilla">' + chips + '</div>' +
      (pl ? '<p class="chico tenue" style="margin:8px 0 0">' + esc(pl.d) + '</p>' : '') +
      '<div class="dos"><div class="campo-esc"><label class="c" for="lb-titulo">Título del libro</label><input id="lb-titulo" data-f="titulo" value="' + esc(S.titulo) + '" placeholder="opcional" maxlength="80"></div>' +
      '<div class="campo-esc"><label class="c" for="lb-modo">Calendario</label><select id="lb-modo" data-f="modo"><option value="desde"' + (S.modo === 'desde' ? ' selected' : '') + '>Desde una fecha de inicio</option><option value="hasta"' + (S.modo === 'hasta' ? ' selected' : '') + '>Hacia atrás, desde la fecha de salida</option></select></div>' +
      '<div class="campo-esc"><label class="c" for="lb-fecha">' + (S.modo === 'hasta' ? 'Fecha de salida (fin)' : 'Fecha de inicio') + '</label><input id="lb-fecha" type="date" data-f="fecha" value="' + esc(S.fecha) + '"></div>' +
      '<div class="campo-esc"><label class="c" for="lb-plazo">Plazo para PERT (días hábiles)</label><input id="lb-plazo" data-f="plazo" inputmode="numeric" value="' + esc(S.plazo) + '" placeholder="opcional"></div></div>' +
      '<p class="chico tenue" style="margin:6px 0 0">Los días son hábiles: se saltean sábados, domingos y feriados nacionales.</p></section>' +
      '<section class="tarjeta"><div class="titulo-sec"><h2>2. El cronograma</h2></div>' +
      '<div class="fila no-imprimir" role="group" aria-label="Método" style="margin:6px 0 10px">' + met + boton('plegar', 'Plegar fases', 'lin') + boton('desplegar', 'Ver todas las tareas', 'lin') + '</div>' +
      '<div id="lb-res" aria-live="polite">' + resultado() + '</div></section>' +
      '<section class="tarjeta no-imprimir"><h2>3. Las tareas</h2>' +
      '<p class="chico tenue" style="margin:4px 0 8px">Cada tarea tiene su duración en días hábiles (en PERT, optimista, probable y pesimista) y las <b>previas</b>: el número de la tarea de la que depende. Para otros tipos de dependencia, sumá el tipo y el retardo: <code>12</code> (termina → empieza), <code>12SS+3</code> (empieza 3 días después de que empiece la 12), <code>12FF</code> (termina junto con la 12), <code>12SF-2</code> (empieza → termina). Las duraciones son <b>orientativas</b>: ajustalas a tu equipo.</p>' +
      '<div class="fila" style="margin:0 0 8px"><label class="elige"><input type="checkbox" data-f="verRol"' + (S.verRol ? ' checked' : '') + '> Mostrar responsables</label></div>' +
      '<div id="lb-tareas">' + tablaTareas() + '</div></section>' +
      '<section class="tarjeta no-imprimir"><h2>4. Guardar y exportar</h2>' +
      '<div class="fila">' + boton('pdf', 'Imprimir o guardar PDF', 'sec') + boton('ics', 'Calendario (.ics)', 'sec') + boton('csv', 'Planilla (.csv)', 'sec') + boton('json', 'Copia completa (.json)', 'sec') +
      '<label class="btn lin ch" for="lb-importar">Abrir una copia (.json)</label><input id="lb-importar" type="file" accept="application/json,.json" class="solo-lector"></div>' +
      '<p class="chico tenue" style="margin:8px 0 0">Tus datos quedan solo en este navegador. La copia .json te deja pasarlos a otro dispositivo o guardarlos. El .ics y el .csv traen fechas solo si cargaste una fecha de inicio o de salida.</p></section>';
  }

  function tablaTareas() {
    var ts = S.tareas, usaPert = S.metodo === 'pert';
    if (!ts.length) return '<p class="vacio">Sin tareas: elegí una plantilla o sumá una.</p>';
    return fases().map(function (fa) {
      var lista = ts.map(function (x, i) { return { x: x, i: i }; }).filter(function (o) { return (o.x.f || '') === fa.id; });
      if (!lista.length && fa.id === '') return '';
      var filas = lista.map(function (o) {
        var x = o.x, i = o.i, info = (P.info || {})[x.id], tpl = x.hito ? ' <span class="chip tin">hito</span>' : '';
        var cols = ['a', 'm', 'b'].map(function (k) { return usaPert ? '<td class="ctl" data-l="' + { a: 'Optimista', m: 'Probable', b: 'Pesimista' }[k] + '"><input class="nota" inputmode="decimal" data-i="' + i + '" data-k="' + k + '" aria-label="Estimación ' + { a: 'optimista', m: 'probable', b: 'pesimista' }[k] + ' de la tarea ' + (i + 1) + '" value="' + esc(x[k]) + '"></td>' : ''; }).join('');
        return '<tr class="' + (x.na ? 'lb-na' : '') + '"><td class="ctl"><b>' + (i + 1) + '</b></td>' +
          '<td class="cr-nombre"><input class="nota" data-i="' + i + '" data-k="t" aria-label="Nombre de la tarea ' + (i + 1) + '" value="' + esc(x.t) + '">' + tpl + (info ? ' <button type="button" class="enlace chico" data-acc="info" data-i="' + i + '" aria-expanded="false">Más</button>' : '') + '</td>' +
          '<td class="ctl" data-l="Días"><input class="nota" inputmode="decimal" data-i="' + i + '" data-k="d" aria-label="Duración en días de la tarea ' + (i + 1) + '" value="' + esc(x.d) + '"></td>' + cols +
          '<td class="ctl" data-l="Previas"><input class="nota" data-i="' + i + '" data-k="pre" aria-label="Previas de la tarea ' + (i + 1) + '" value="' + esc(preTexto(x)) + '" placeholder="—"></td>' +
          (S.verRol ? '<td class="ctl" data-l="Responsable"><input class="nota" data-i="' + i + '" data-k="q" aria-label="Responsable de la tarea ' + (i + 1) + '" value="' + esc(x.q) + '"></td>' : '') +
          '<td class="ctl"><label class="elige"><input type="checkbox" data-i="' + i + '" data-k="na"' + (x.na ? ' checked' : '') + ' aria-label="No aplica a la tarea ' + (i + 1) + '"> No aplica</label></td>' +
          '<td class="ctl"><button type="button" class="btn lin ch" data-acc="quitar" data-i="' + i + '" aria-label="Quitar la tarea ' + (i + 1) + '">✕</button></td></tr>' +
          (info ? '<tr class="lb-info" hidden id="lb-info-' + i + '"><td></td><td colspan="9" class="chico tenue">' + esc(info.desc) + '<br><b>Fuente:</b> ' + esc(info.src) + (x.ver ? ' <span class="chip ojo">duración orientativa, sin confirmar</span>' : '') + '</td></tr>' : '');
      }).join('');
      var cab = '<th>N.º</th><th>Tarea</th><th>Días</th>' + (usaPert ? '<th>a</th><th>m</th><th>b</th>' : '') + '<th>Previas</th>' + (S.verRol ? '<th>Responsable</th>' : '') + '<th></th><th></th>';
      return '<details class="lb-fase" open><summary><b>' + (fa.id ? fa.id + ' · ' : '') + esc(fa.t) + '</b> <span class="chico tenue">(' + lista.length + ')</span></summary>' +
        '<div class="tabla-scroll"><table class="tabla cr-tareas"><thead><tr>' + cab + '</tr></thead><tbody>' + filas + '</tbody></table></div>' +
        '<p style="margin:6px 0 12px"><button type="button" class="btn lin ch" data-acc="sumar" data-f="' + fa.id + '">+ Tarea en esta fase</button></p></details>';
    }).join('');
  }

  // ---------- resultados ----------
  function resultado() {
    var c = calcular();
    if (c.vacio) return '<p class="vacio">Sumá tareas para ver el cronograma.</p>';
    if (c.error) return '<p class="chico alerta" style="margin:0">⚠ ' + esc(c.error) + '</p>';
    var res = c.res, fe = c.fe, ts = S.tareas, T = res.total || 1, H = hoyISO();
    var dato = function (b, t) { return '<div class="dato"><b>' + b + '</b><span>' + t + '</span></div>'; };
    var criticas = res.tareas.filter(function (v) { return v.crit && !v.na; }).length;
    var out = '<div class="pag-datos">' + dato(f1(res.total), 'días hábiles en total') + (fe ? dato(fmtF(fe.inicio), 'inicio') + dato(fmtF(fe.fin), 'fin') : '') + dato(criticas, 'tareas críticas') +
      (S.metodo === 'pert' && res.prob != null ? dato(Math.round(res.prob * 100) + ' %', 'de llegar en ' + S.plazo + ' días') : '') + '</div>';
    if (S.titulo) out = '<p class="chico" style="margin:0 0 6px"><b>' + esc(S.titulo) + '</b></p>' + out;
    if (fe && S.modo === 'hasta' && !fe.llega) {
      var falta = Cronograma.habilesEntre(H, fe.inicio, FERIADOS);
      out += '<p class="chico alerta" style="margin:8px 0">⚠ Para salir el ' + fmtF(S.fecha) + ' tendrías que haber empezado el ' + fmtF(fe.inicio) + ': hoy faltan ' + Math.abs(falta) + ' días hábiles. ' + fe.tarde.length + ' tareas (en rojo) ya no llegan: acortá duraciones, superponé tareas o corré la fecha.</p>';
    } else if (fe && S.modo === 'hasta') {
      out += '<p class="chico" style="margin:8px 0">Para salir el ' + fmtF(S.fecha) + ' tenés que empezar el <b>' + fmtF(fe.inicio) + '</b>. Hoy te sobran ' + Cronograma.habilesEntre(H, fe.inicio, FERIADOS) + ' días hábiles.</p>';
    }
    if (fe && ANIOS_FERIADOS && parseInt(fe.fin.slice(0, 4), 10) > ANIOS_FERIADOS) {
      out += '<p class="chico tenue" style="margin:6px 0">Los feriados de ' + (ANIOS_FERIADOS + 1) + ' todavía no están publicados: las fechas de ese año no los descuentan.</p>';
    }
    if (S.metodo === 'gantt') return out + gantt(res, fe, T);
    return out + red(res, S.metodo) + tablaCritica(res);
  }

  function ejeX(fe, T) {
    var n = 6, marcas = '';
    for (var k = 0; k <= n; k++) {
      var d = Math.round(T * k / n);
      var t = fe ? fmtF(Cronograma.sumarHabiles(fe.inicio, Math.min(d, Math.max(0, Math.ceil(T) - 1)), FERIADOS)).slice(0, 5) : 'd' + d;
      marcas += '<span data-p="' + (k / n * 100) + '">' + esc(t) + '</span>';
    }
    return '<div class="lb-eje" aria-hidden="true">' + marcas + '</div>';
  }

  function gantt(res, fe, T) {
    var por = porId(res.tareas), fechaDe = fe ? porId(fe.tareas) : {}, ts = S.tareas, imprimiendo = !!window.__lbImprimiendo;
    var filas = '';
    fases().forEach(function (fa) {
      var lista = ts.map(function (x, i) { return { x: x, i: i }; }).filter(function (o) { return (o.x.f || '') === fa.id && !o.x.na; });
      if (!lista.length) return;
      var es = Math.min.apply(null, lista.map(function (o) { return por[o.x.id].es; })), ef = Math.max.apply(null, lista.map(function (o) { return por[o.x.id].ef; }));
      var crit = lista.some(function (o) { return por[o.x.id].crit; }), tarde = lista.some(function (o) { return fechaDe[o.x.id] && fechaDe[o.x.id].tarde; });
      var plegada = !imprimiendo && S.plegadas[fa.id || '_'];
      var desde = fe ? lista.map(function (o) { return fechaDe[o.x.id].desde; }).sort()[0] : '', hasta = fe ? lista.map(function (o) { return fechaDe[o.x.id].hasta; }).sort().slice(-1)[0] : '';
      filas += barra((plegada ? '▸ ' : '▾ ') + (fa.id ? fa.id + ' · ' : '') + fa.t, es, ef, T, crit, tarde, true, fe ? fmtF(desde).slice(0, 5) + '–' + fmtF(hasta).slice(0, 5) : f1(es) + '–' + f1(ef), 'plegarfase', fa.id || '_', plegada);
      if (!plegada) lista.forEach(function (o) {
        var v = por[o.x.id], fd = fechaDe[o.x.id];
        filas += barra((o.i + 1) + '. ' + o.x.t, v.es, v.ef, T, v.crit, fd && fd.tarde, false, fd ? fmtF(fd.desde).slice(0, 5) + '–' + fmtF(fd.hasta).slice(0, 5) : f1(v.es) + '–' + f1(v.ef), '', '', false, v.hol);
      });
    });
    return ejeX(fe, T) + '<div class="cr-gantt lb-gantt" role="list">' + filas + '</div>' +
      '<p class="chico tenue" style="margin:8px 0 0"><span class="cr-barra crit cr-ref"></span> Ruta crítica · <span class="cr-barra cr-ref"></span> Con holgura · <span class="cr-barra tarde cr-ref"></span> Ya no llega · <span class="cr-hol cr-ref"></span> Margen que puede demorarse</p>';
  }
  function barra(nombre, es, ef, T, crit, tarde, esFase, rotulo, acc, id, plegada, hol) {
    var left = es / T * 100, ancho = Math.max((ef - es) / T * 100, 0.8);
    var tag = acc ? '<button type="button" class="lb-fase-bt" data-acc="' + acc + '" data-id="' + esc(id) + '" aria-expanded="' + !plegada + '">' + esc(nombre) + '</button>' : esc(nombre);
    return '<div class="cr-fila ' + (esFase ? 'lb-esfase' : '') + '" role="listitem"><span class="cr-nom">' + tag + '</span>' +
      '<span class="cr-pista"><span class="cr-barra ' + (tarde ? 'tarde' : crit ? 'crit' : '') + (esFase ? ' fase' : '') + '" data-izq="' + left + '" data-ancho="' + ancho + '" title="' + esc(nombre) + '"></span>' +
      (hol > 0 ? '<span class="cr-hol" data-izq="' + (ef / T * 100) + '" data-ancho="' + (hol / T * 100) + '"></span>' : '') + '</span>' +
      '<span class="cr-dias chico tenue">' + esc(rotulo) + '</span></div>';
  }

  // Red de la ruta crítica (en un proyecto de 100 tareas, la red completa no se lee: se dibuja lo que manda).
  function red(res, tipo) {
    var por = porId(res.tareas), ts = S.tareas, ruta = res.ruta.filter(function (id) { return !por[id].na || por[id].dur > 0; }).slice(0, 60);
    if (!ruta.length) return '';
    var W = 178, Hh = 74, GX = 40;
    var nodos = ruta.map(function (id, k) {
      var v = por[id], x = 10 + k * (W + GX), y = 10, i = ts.findIndex(function (z) { return z.id === id; }) + 1, nom = v.t.length > 23 ? v.t.slice(0, 22) + '…' : v.t;
      var l2 = tipo === 'roy'
        ? '<text x="' + (x + 8) + '" y="' + (y + 44) + '" class="cr-t2">T: ' + f1(v.es) + ' · ' + f1(v.ef) + '</text><text x="' + (x + 8) + '" y="' + (y + 60) + '" class="cr-t2">L: ' + f1(v.ls) + ' · ' + f1(v.lf) + ' · h ' + f1(v.hol) + '</text>'
        : '<text x="' + (x + 8) + '" y="' + (y + 44) + '" class="cr-t2">te ' + f1(v.dur) + ' · σ² ' + f1(v.varianza || 0) + '</text><text x="' + (x + 8) + '" y="' + (y + 60) + '" class="cr-t2">' + f1(v.es) + ' → ' + f1(v.ef) + '</text>';
      var flecha = k ? '<path d="M' + (x - GX) + ' ' + (y + Hh / 2) + ' H' + x + '" class="cr-arco crit" marker-end="url(#lb-fl)"/>' : '';
      return flecha + '<g><rect x="' + x + '" y="' + y + '" width="' + W + '" height="' + Hh + '" rx="8" class="cr-nodo crit"/><text x="' + (x + 8) + '" y="' + (y + 20) + '" class="cr-t1">' + i + '. ' + esc(nom) + '</text>' + l2 + '</g>';
    }).join('');
    var ancho = 20 + ruta.length * W + (ruta.length - 1) * GX;
    return '<h3 style="margin:12px 0 6px">Ruta crítica (' + ruta.length + ' tareas)</h3><div class="cr-red" tabindex="0" role="img" aria-label="Ruta crítica de ' + ruta.length + ' tareas"><svg viewBox="0 0 ' + ancho + ' ' + (Hh + 20) + '" width="' + ancho + '" height="' + (Hh + 20) + '"><defs><marker id="lb-fl" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L8 4L0 8z" class="cr-punta"/></marker></defs>' + nodos + '</svg></div>' +
      '<p class="chico tenue" style="margin:6px 0 0">' + (tipo === 'roy' ? 'En cada caja: <b>T</b> = inicio y fin más tempranos; <b>L</b> = más tardíos; <b>h</b> = holgura.' : 'En cada caja: duración esperada <b>te</b> = (a + 4m + b) ÷ 6 y varianza <b>σ²</b>.') + ' Solo se dibuja la ruta crítica; el resto está en la tabla de abajo.</p>';
  }
  function tablaCritica(res) {
    var ts = S.tareas, filas = res.tareas.filter(function (v) { return !v.na; }).slice().sort(function (a, b) { return a.hol - b.hol || a.es - b.es; }).slice(0, 15);
    return '<h3 style="margin:14px 0 6px">Las 15 tareas con menos holgura</h3><div class="tabla-scroll"><table class="tabla"><thead><tr><th>N.º</th><th>Tarea</th><th>Inicio</th><th>Fin</th><th>Holgura</th></tr></thead><tbody>' +
      filas.map(function (v) { return '<tr><td>' + (ts.findIndex(function (z) { return z.id === v.id; }) + 1) + '</td><td>' + esc(v.t) + '</td><td>' + f1(v.es) + '</td><td>' + f1(v.ef) + '</td><td>' + (v.crit ? '<b class="alerta">0 (crítica)</b>' : f1(v.hol)) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  }

  // Posición y ancho de las barras, en porcentaje del total.
  function medidas(r) {
    r.querySelectorAll('[data-izq]').forEach(function (e) { e.style.left = e.dataset.izq + '%'; e.style.width = e.dataset.ancho + '%'; });
    r.querySelectorAll('.lb-eje span').forEach(function (e) { e.style.left = e.dataset.p + '%'; });
  }
  function pintarRes() {
    var r = $('#lb-res'); if (!r) return;
    r.innerHTML = resultado(); medidas(r);
  }
  function pintarTodo() {
    raiz.innerHTML = vista(); medidas(raiz);
  }
  function refrescar() { clearTimeout(crT); crT = setTimeout(guardar, 300); pintarRes(); }

  // ---------- eventos ----------
  function descargar(nombre, tipo, texto) {
    var a = document.createElement('a'), u = URL.createObjectURL(new Blob([texto], { type: tipo }));
    a.href = u; a.download = nombre; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 1000);
  }
  var nombreArchivo = function () { return (S.titulo || 'cronograma-del-libro').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'cronograma'; };
  function aviso(t) {
    var a = $('#lb-aviso'); if (!a) { a = document.createElement('p'); a.id = 'lb-aviso'; a.className = 'aviso no-imprimir'; a.setAttribute('role', 'status'); document.body.appendChild(a); }
    a.textContent = t; a.classList.add('on'); clearTimeout(a._t); a._t = setTimeout(function () { a.classList.remove('on'); }, 2600);
  }
  function exportar(k) {
    var c = calcular();
    if (k === 'json') return descargar(nombreArchivo() + '.json', 'application/json', JSON.stringify({ planificador: 'cursada-libro', v: 1, estado: S }, null, 1));
    if (c.vacio || c.error) return aviso(c.error || 'No hay tareas');
    if (k === 'csv') return descargar(nombreArchivo() + '.csv', 'text/csv;charset=utf-8', Cronograma.aCsv(S.tareas, c.res, c.fe));
    if (k === 'ics') { if (!c.fe) return aviso('Cargá una fecha para armar el calendario'); return descargar(nombreArchivo() + '.ics', 'text/calendar;charset=utf-8', Cronograma.aIcs(S.tareas, c.fe, S.titulo)); }
  }

  function acciones(e) {
    var b = e.target.closest ? e.target.closest('[data-acc]') : null; if (!b) return;
    var acc = b.dataset.acc, i = parseInt(b.dataset.i, 10);
    if (acc === 'plantilla') {
      if (b.dataset.id === S.plantilla) return;
      if (S.tareas.length && !confirm('Cambiar de plantilla reemplaza las tareas actuales. ¿Seguimos?')) return;
      var t = S.titulo, m = S.modo, f = S.fecha, v = S.verRol; S = estadoNuevo(b.dataset.id); S.titulo = t; S.modo = m; S.fecha = f; S.verRol = v; guardar(); pintarTodo();
    } else if (acc === 'metodo') { S.metodo = b.dataset.id; guardar(); pintarTodo(); }
    else if (acc === 'plegar' || acc === 'desplegar') { S.plegadas = {}; if (acc === 'plegar') fases().forEach(function (fa) { S.plegadas[fa.id || '_'] = 1; }); guardar(); pintarRes(); }
    else if (acc === 'plegarfase') { var k = b.dataset.id; S.plegadas[k] = S.plegadas[k] ? 0 : 1; guardar(); pintarRes(); }
    else if (acc === 'info') { var r = $('#lb-info-' + i); if (r) { r.hidden = !r.hidden; b.setAttribute('aria-expanded', String(!r.hidden)); b.textContent = r.hidden ? 'Más' : 'Menos'; } }
    else if (acc === 'quitar') { var id = (S.tareas[i] || {}).id; S.tareas.splice(i, 1); S.tareas.forEach(function (x) { x.pre = x.pre.filter(function (p) { return (typeof p === 'string' ? p : p.id) !== id; }); }); guardar(); pintarTodo(); }
    else if (acc === 'sumar') {
      if (S.tareas.length >= 200) return aviso('Máximo 200 tareas');
      var n = 1; while (S.tareas.some(function (x) { return x.id === 'U' + n; })) n++;
      var fa = b.dataset.f || '', pos = S.tareas.length;
      S.tareas.forEach(function (x, j) { if ((x.f || '') === fa) pos = j + 1; });
      S.tareas.splice(pos, 0, { id: 'U' + n, f: fa, q: '', na: 0, hito: 0, t: '', d: '1', a: '', m: '', b: '', pre: [] }); guardar(); pintarTodo();
    } else if (acc === 'pdf') { window.print(); }
    else if (['ics', 'csv', 'json'].indexOf(acc) >= 0) exportar(acc);
  }
  function campos(e) {
    var t = e.target, k = t.dataset.k, f = t.dataset.f;
    if (f) {
      if (f === 'verRol') { S.verRol = t.checked; guardar(); pintarTodo(); return; }
      if (f === 'plazo') S.plazo = t.value.replace(/[^\d.,]/g, '').slice(0, 6);
      else if (f === 'titulo') S.titulo = t.value.replace(/[<>]/g, '').slice(0, 80);
      else if (f === 'modo') { S.modo = t.value === 'hasta' ? 'hasta' : 'desde'; guardar(); pintarTodo(); return; }
      else if (f === 'fecha') { if (!/^\d{4}-\d{2}-\d{2}$/.test(t.value)) return; S.fecha = t.value; }
      return refrescar();
    }
    if (!k) return;
    var i = parseInt(t.dataset.i, 10), x = S.tareas[i]; if (!x) return;
    if (k === 't') x.t = t.value.replace(/[<>]/g, '').slice(0, 80);
    else if (k === 'q') x.q = t.value.replace(/[<>]/g, '').slice(0, 60);
    else if (k === 'na') { x.na = t.checked ? 1 : 0; t.closest('tr').classList.toggle('lb-na', t.checked); }
    else if (k === 'pre') { if (e.type !== 'change') return; x.pre = preLeer(t.value, x); t.value = preTexto(x); }
    else x[k] = t.value.replace(/[^\d.,]/g, '').slice(0, 6);
    refrescar();
  }
  function importar(e) {
    var f = e.target.files && e.target.files[0]; if (!f) return;
    if (f.size > 2e6) return aviso('El archivo es demasiado grande');
    var rd = new FileReader();
    rd.onload = function () {
      try {
        var j = JSON.parse(rd.result), n = normalizar(j && j.estado ? j.estado : j);
        if (!n || !n.tareas.length) throw new Error('vacío');
        S = n; guardar(); pintarTodo(); aviso('Copia abierta');
      } catch (er) { aviso('No pude leer ese archivo'); }
    };
    rd.readAsText(f); e.target.value = '';
  }

  // Al imprimir se despliega todo; al volver, se deja como estaba.
  window.addEventListener('beforeprint', function () { window.__lbImprimiendo = true; pintarRes(); });
  window.addEventListener('afterprint', function () { window.__lbImprimiendo = false; pintarRes(); });

  function iniciar() {
    raiz.addEventListener('click', acciones);
    raiz.addEventListener('input', function (e) { if (e.target.dataset.k !== 'pre' && e.target.type !== 'checkbox' && e.target.id !== 'lb-importar') campos(e); });
    raiz.addEventListener('change', function (e) { if (e.target.id === 'lb-importar') return importar(e); if (e.target.type === 'checkbox' || e.target.dataset.k === 'pre' || e.target.tagName === 'SELECT' || e.target.type === 'date') campos(e); });
    pintarTodo();
  }

  Promise.all([
    fetch(BASE + 'libro/plantillas.json').then(function (r) { return r.json(); }),
    fetch(BASE + 'datos/calendario-2026.json').then(function (r) { return r.json(); }).catch(function () { return null; })
  ]).then(function (r) {
    P = r[0];
    if (r[1] && Array.isArray(r[1].feriados)) {
      FERIADOS = r[1].feriados.map(function (f) { return f.fecha; }).filter(function (x) { return typeof x === 'string'; });
      ANIOS_FERIADOS = r[1].anio || 0;
    }
    S = cargar() || estadoNuevo('narrativa');
    iniciar();
  }).catch(function () { raiz.innerHTML = '<p class="chico alerta">No pude cargar el planificador. Probá recargar la página.</p>'; });
})();
