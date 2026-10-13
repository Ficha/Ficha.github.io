// Cursada: gestor para la carrera de Edición (FFyL, UBA). Todo corre en el navegador:
// el plan, el calendario y la oferta horaria son archivos de datos (datos/*.json) y lo que carga
// cada persona se guarda en su localStorage. Sin servidor ni cuentas.
'use strict';

const CLAVE = 'cursada.v1';
const ESTADOS = { pendiente: 'Pendiente', cursando: 'Cursando', regular: 'Regular (falta el final)', aprobada: 'Aprobada' };
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DIAS_C = ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.']; // con punto: "mar. 3 mar" (martes 3 de marzo) no se confunde
const COLORES = ['#1a5f78', '#7b4592', '#a8470f', '#276b44', '#a03352', '#4a59b8', '#7a5f12', '#2f6a70']; // todos con contraste de 5:1 o más contra texto blanco
const D = { busqueda: null, plan: null, calendario: null, ofertas: [], ofertasMeta: [], mesas: [], indice: null, resumenes: null, apuntes: {}, biblioteca: null, glosario: null, novedades: null };
const TABS = [['carrera', 'Mi carrera'], ['horarios', 'Horarios'], ['calendario', 'Calendario'], ['resumenes', 'Resúmenes'], ['biblioteca', 'Biblioteca'], ['simuladores', 'Simuladores'], ['glosario', 'Glosario'], ['links', 'Links útiles'], ['novedades', 'Novedades']];
const CONTACTO = 'fidelchaves96@gmail.com'; // el mismo mail público de ficha.github.io
const V = { sim: '', tab: 'carrera', vista: 'tabla', oferta: '', verPasados: false, sugeridas: null, verAprobadas: false, verSem: false,
  res: { materia: '', apunte: '', sec: '' }, busq: '', quiz: {}, ayuda: {}, tema: '', glo: { q: '', mat: '' },
  demo: null, prac: null }; // demo: el estado real guardado aparte mientras se mira el ejemplo; prac: la ronda de práctica en curso
// Datos para donar por transferencia (sin comisión). Alias vacío = no se muestra el botón.
const DONAR = { alias: 'fidel.mercado', cvu: '0000003100037663540198' };

// ---------- utilidades ----------
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Para pasar un dato como argumento de un manejador en línea (onclick="f(${arg(x)})"): JSON + escape de HTML.
// Así ningún texto (un nombre con apóstrofo, un archivo importado, un dato del PDF de la Facultad) puede romper ni inyectar código.
const arg = v => esc(JSON.stringify(String(v == null ? '' : v)));
const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const hoy = () => iso(new Date());
const fecha = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const fmt = s => { const d = fecha(s); return DIAS_C[d.getDay()] + ' ' + d.getDate() + ' ' + MESES[d.getMonth()]; };
const fmtRango = (a, b) => !b || a === b ? fmt(a) : fecha(a).getDate() + (a.slice(0, 7) === b.slice(0, 7) ? '' : ' ' + MESES[fecha(a).getMonth()]) + ' al ' + fecha(b).getDate() + ' ' + MESES[fecha(b).getMonth()];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
let avisoT;
function aviso(t) { const a = $('#aviso'); a.textContent = t; a.classList.add('on'); clearTimeout(avisoT); avisoT = setTimeout(() => a.classList.remove('on'), 2400); }

// ---------- estado (localStorage) ----------
// copia: última descarga de la copia; modif: último cambio; primera y visto: para contar (sin datos personales) si la gente vuelve.
// practica: "materia/apunte/n" → [bien, mal, fecha] de cada pregunta practicada.
function estadoVacio() { return { v: 1, carrera: 'edicion', vioAyuda: false, materias: {}, horarios: {}, escandallo: null, comparador: null, papel: null, leidos: {},
  copia: '', modif: '', primera: '', visto: '', practica: {} }; }
// Todo lo que entra (de localStorage o de un archivo importado) se reconstruye campo por campo:
// solo tipos, formatos y largos esperados. Lo que no encaja se descarta.
const RE_ID = /^[\w.-]{1,60}$/, RE_FECHA = /^\d{4}-\d\d-\d\d$/, RE_HORA = /^\d\d:\d\d$/;
const TIPOS = ['Teórico', 'Práctico', 'Teórico-práctico'];
const MODOS_ESC = ['cpu', 'offset', 'demanda'];
const CAMPOS_PAPEL = ['ancho', 'alto', 'paginas', 'solapa', 'lomo', 'tirada', 'demasia', 'gramaje', 'precioKg', 'fa', 'fb', 'calle', 'lateral', 'pinza', 'cola', 'forzar', 'espesor'];
const CAMPOS_ESC = ['pvp', 'tirada', 'cpu', 'preproduccion', 'industrial', 'paginas', 'porPliego', 'precioPliego', 'tapasPorPliego', 'precioTapa', 'encuadernado',
  'descuento', 'invendibles', 'derechos', 'incobrables', 'comisiones', 'flete', 'publicidad', 'ce'];
const txt = (v, n) => typeof v === 'string' ? v.slice(0, n) : '';
const lista = (v, n) => (Array.isArray(v) ? v : []).slice(0, n);
function normalizar(e) {
  const out = estadoVacio();
  if (!e || typeof e !== 'object') return out;
  out.vioAyuda = !!e.vioAyuda;
  const M = e.materias && typeof e.materias === 'object' ? e.materias : {};
  Object.keys(M).slice(0, 200).forEach(id => {
    const m = M[id];
    if (!RE_ID.test(id) || !m || typeof m !== 'object') return;
    out.materias[id] = {
      estado: ESTADOS[m.estado] ? m.estado : 'pendiente', opcion: RE_ID.test(m.opcion || '') ? m.opcion : '', detalle: txt(m.detalle, 200),
      nota: /^\d{1,2}(,\d{1,2})?$/.test(m.nota || '') ? m.nota : '', cuando: txt(m.cuando, 80), aprobada: RE_FECHA.test(m.aprobada || '') ? m.aprobada : '',
      apuntes: txt(m.apuntes, 5000), aplazos: lista(m.aplazos, 20).map(String).filter(a => /^[123]$/.test(a)),
      examenes: lista(m.examenes, 60).filter(x => x && typeof x === 'object').map(x => ({ id: RE_ID.test(x.id || '') ? x.id : uid(), tipo: txt(x.tipo, 30) || 'Otro',
        fecha: RE_FECHA.test(x.fecha || '') ? x.fecha : '', hora: RE_HORA.test(x.hora || '') ? x.hora : '', detalle: txt(x.detalle, 200), nota: txt(x.nota, 10) }))
    };
  });
  const bloque = b => b && typeof b === 'object' && Number(b.dia) >= 1 && Number(b.dia) <= 6 && RE_HORA.test(b.desde || '') && RE_HORA.test(b.hasta || '') && b.desde < b.hasta
    ? { dia: Number(b.dia), desde: b.desde, hasta: b.hasta } : null;
  const H = e.horarios && typeof e.horarios === 'object' ? e.horarios : {};
  Object.keys(H).slice(0, 40).forEach(k => {
    const h = H[k];
    if (!RE_ID.test(k) || !h || typeof h !== 'object') return;
    const elegidas = {};
    Object.keys(h.elegidas && typeof h.elegidas === 'object' ? h.elegidas : {}).slice(0, 100).forEach(c => { if (typeof h.elegidas[c] === 'string' && c.length <= 200) elegidas[c] = h.elegidas[c].slice(0, 120); });
    out.horarios[k] = {
      materias: lista(h.materias, 30).filter(x => typeof x === 'string').map(x => x.slice(0, 120)), elegidas, sinSabado: !!h.sinSabado, listo: !!h.listo,
      propias: lista(h.propias, 80).filter(c => c && typeof c === 'object').map(c => ({ id: RE_ID.test(c.id || '') ? c.id : 'p' + uid(), materia: txt(c.materia, 120).replace(/\|/g, '/'),
        tipo: TIPOS.indexOf(c.tipo) >= 0 ? c.tipo : 'Teórico-práctico', nombre: txt(c.nombre, 20), docente: txt(c.docente, 120), aula: txt(c.aula, 60),
        bloques: lista(c.bloques, 6).map(bloque).filter(Boolean), propia: true })).filter(c => c.materia && c.bloques.length),
      bloqueos: lista(h.bloqueos, 40).map(b => { const x = bloque(b); if (x) x.t = txt(b.t, 40); return x; }).filter(Boolean)
    };
  });
  // Simulador de escandallo: solo cifras (como texto, tal cual se tipearon) y los nombres de los canales.
  const cifra = v => typeof v === 'string' && /^[\d.,\s$%-]{0,20}$/.test(v) ? v : '';
  const S = e.escandallo;
  if (S && typeof S === 'object') {
    out.escandallo = { modo: MODOS_ESC.indexOf(S.modo) >= 0 ? S.modo : 'cpu', usarCanales: !!S.usarCanales,
      canales: lista(S.canales, 12).filter(c => c && typeof c === 'object').map(c => ({ t: txt(c.t, 40), desc: cifra(c.desc), part: cifra(c.part), plazo: cifra(c.plazo) })) };
    CAMPOS_ESC.forEach(k => { out.escandallo[k] = cifra(S[k]); });
  }
  // Comparador de títulos: la misma regla (cifras y nombres, con tope de largo y de cantidad).
  const C = e.comparador;
  if (C && typeof C === 'object') {
    out.comparador = { ce: cifra(C.ce), ganancia: cifra(C.ganancia),
      titulos: lista(C.titulos, 20).filter(t => t && typeof t === 'object').map(t => ({ t: txt(t.t, 40), pvp: cifra(t.pvp), desc: cifra(t.desc), inu: cifra(t.inu), cdu: cifra(t.cdu), q: cifra(t.q) })) };
  }
  // Cálculo de papel: cifras, y de las listas (formato, corte, paquete) solo valores conocidos.
  const P0 = e.papel;
  if (P0 && typeof P0 === 'object') {
    const de = (v, L, def) => L.indexOf(v) >= 0 ? v : def;
    out.papel = { tipo: de(P0.tipo, ['interior', 'tapa'], 'interior'), formato: de(P0.formato, Papel.FORMATOS.map(f => f.id).concat('otro'), '58x92'),
      cortes: de(P0.cortes, ['1', '2', '4'], '1'), hojasPaquete: de(P0.hojasPaquete, ['500', '250', '150', '100'], '500') };
    CAMPOS_PAPEL.forEach(k => { out.papel[k] = cifra(P0[k]); });
  }
  // Apuntes leídos: "materia/apunte" → fecha.
  const L = e.leidos && typeof e.leidos === 'object' ? e.leidos : {};
  Object.keys(L).slice(0, 500).forEach(k => { const p = k.split('/'); if (p.length === 2 && p.every(x => /^\w[\w.-]{0,59}$/.test(x)) && RE_FECHA.test(L[k])) out.leidos[k] = L[k]; });
  ['copia', 'modif', 'primera', 'visto'].forEach(k => { if (RE_FECHA.test(e[k] || '')) out[k] = e[k]; });
  // Práctica: por pregunta, cuántas veces salió bien y mal, y cuándo fue la última.
  const P = e.practica && typeof e.practica === 'object' ? e.practica : {};
  const veces = v => Number.isInteger(v) && v >= 0 ? Math.min(v, 999) : 0;
  Object.keys(P).slice(0, 3000).forEach(k => {
    const x = P[k];
    if (/^\w[\w.-]{0,59}\/\w[\w.-]{0,59}\/\d{1,4}$/.test(k) && Array.isArray(x) && RE_FECHA.test(x[2] || '')) out.practica[k] = [veces(x[0]), veces(x[1]), x[2]];
  });
  return out;
}
function cargarEstado() {
  try { const e = JSON.parse(localStorage.getItem(CLAVE)); if (e && e.v === 1) return normalizar(e); } catch (err) { }
  return estadoVacio();
}
// El estado se carga recién acá: normalizar() usa constantes (RE_ID, TIPOS…) que antes de este punto todavía no existen,
// y leerlo más arriba fallaba en silencio y arrancaba vacío (y el primer cambio pisaba lo guardado).
let E = cargarEstado();
// sinCambio: guarda datos de uso (visto, copia) sin contarlo como un cambio que pida una copia nueva.
function guardar(sinCambio) {
  if (V.demo) return; // el ejemplo no se guarda nunca: al salir vuelve lo de la persona, intacto
  if (!sinCambio) { E.modif = hoy(); if (conDatos()) primeraCarga(); }
  try { localStorage.setItem(CLAVE, JSON.stringify(E)); } catch (err) { aviso('No se pudo guardar en este navegador'); }
  // Pide al navegador que no borre estos datos cuando le falte espacio (no muestra carteles; si no puede, no pasa nada).
  if (!guardar.pedido && navigator.storage && navigator.storage.persist) { guardar.pedido = true; navigator.storage.persist().catch(() => { }); }
}
const mat = id => (E.materias[id] = E.materias[id] || { estado: 'pendiente', examenes: [] });
const datosMateria = id => D.plan.materias.find(m => m.id === id);
// Datos de la opción elegida en una electiva (programa, régimen), si los tiene.
function opcion(m) { const e = E.materias[m.id]; return (m.opciones || []).find(o => e && o.id === e.opcion) || null; }
// Programas de una materia (o de la opción elegida): uno oficial o varios (una página por cátedra).
// Si es una electiva sin elegir, junta los de todas sus opciones, con el nombre de cada una.
function programas(m, o) {
  const de = (x, pre) => (x.programas || (x.programa ? [{ t: 'Programa oficial' + (x.programa_anio || m.programa_anio ? ' (' + (x.programa_anio || m.programa_anio) + ')' : ''), url: x.programa }] : []))
    .map(p => ({ t: pre ? pre + ': ' + p.t : p.t, url: p.url }));
  if (o) return de(o);
  const propios = de(m);
  return propios.length || !m.opciones ? propios : m.opciones.flatMap(x => de(x, x.nombre));
}
const nombreDe = m => { const o = opcion(m), e = E.materias[m.id] || {}; return o ? o.nombre : (m.libre && e.detalle ? 'Seminario: ' + e.detalle : m.nombre); };

// ---------- carga de datos ----------
async function json(archivo) { const r = await fetch('datos/' + archivo); if (!r.ok) throw new Error(archivo); return r.json(); }
async function arrancar() {
  try {
    D.indice = await json('indice.json');
    const c = D.indice.carreras.find(x => x.id === E.carrera) || D.indice.carreras[0];
    // En paralelo, y solo lo que hace falta: el último cuatrimestre (los anteriores se piden si se eligen) y los dos últimos turnos de examen.
    const ult = a => a[a.length - 1];
    D.ofertasMeta = D.indice.ofertas.filter(o => o.carrera === c.id);
    const turnos = (D.indice.mesas || []).filter(o => o.carrera === c.id).slice(-2);
    const [plan, cal, of, ...mesas] = await Promise.all([json(c.archivo), json(ult(D.indice.calendarios).archivo),
      D.ofertasMeta.length ? json(ult(D.ofertasMeta).archivo).catch(() => null) : null].concat(turnos.map(m => json(m.archivo).catch(() => null))));
    D.plan = plan; D.calendario = cal; D.ofertas = of ? [of] : []; D.mesas = mesas.filter(Boolean);
    V.oferta = of ? of.id : '';
  } catch (err) {
    $('#main').innerHTML = '<p class="vacio">No se pudieron cargar los datos (' + esc(err.message) + '). Probá recargar la página.</p>';
    return;
  }
  $('#subtitulo').textContent = 'Tus materias, tu promedio y tus horarios de ' + D.plan.nombre + ' · ' + D.plan.facultad;
  registrarVisita();
  $('#fuentes').innerHTML = 'Fuentes: ' + D.plan.fuentes.concat([D.calendario.fuente, D.calendario.fuente_feriados].filter(Boolean)).map(f => `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.t)}</a>`).join(', ') + '.';
  document.querySelectorAll('[data-nov]').forEach(el => { el.hidden = !NOVEDADES; });
  if (DONAR.alias) $('#donar').innerHTML = `<button class="btn sec ch" type="button" onclick="abrirDonar()">☕ Doná para mantener este proyecto</button>`;
  if (desdeHash() && V.tab === 'resumenes' && V.res.apunte) cargarApunte(); else render();
  manejarLinkNov(); // links de los mails de novedades (#confirmar=, #novedades=, #baja=)
  cargarResumenes(); // índice chico: sirve para ofrecer los resúmenes desde la ficha de cada materia
}
// El hash dice dónde está cada quien: #pestaña, o #resumenes/materia/apunte/sección (links para compartir partes de un apunte).
const hashActual = () => V.tab === 'resumenes' ? ['resumenes', V.res.materia, V.res.apunte, V.res.sec].filter(Boolean).join('/') : V.tab === 'simuladores' ? ['simuladores', V.sim].filter(Boolean).join('/') : V.tab;
function desdeHash() {
  let p; try { p = decodeURIComponent(location.hash.slice(1)).split('/'); } catch (e) { return false; }
  if (p[0] === 'pedidos') p[0] = 'novedades';   // la pestaña Pedidos pasó a Novedades (v14)
  if (p[0] === 'escandallo') p = ['simuladores', 'escandallo'];   // la pestaña Escandallo pasó a Simuladores (v15)
  if (!TABS.some(t => t[0] === p[0])) return false;
  V.tab = p[0];
  if (V.tab === 'simuladores') V.sim = SIMULADORES.some(x => x.id === p[1]) ? p[1] : '';
  if (V.tab === 'resumenes') {
    const [m = '', a = '', sec = ''] = p.slice(1).map(x => RE_ID.test(x) ? x : '');
    V.res = { materia: m, apunte: m && a, sec: m && a && sec };
  }
  return true;
}
const alCambiarHash = () => {
  if (location.hash.slice(1) === hashActual() || !desdeHash()) return;
  if (V.tab === 'resumenes' && V.res.apunte) cargarApunte(); else { render(); window.scrollTo(0, 0); }
};
window.addEventListener('hashchange', alCambiarHash);
window.addEventListener('popstate', alCambiarHash);

// Para saber si Cursada sirve (Analytics, solo con consentimiento): si quien cargó materias vuelve otro día, y a los cuántos días.
// Nunca viaja qué cargó: solo el número de días desde la primera carga.
function registrarVisita() {
  if (!E.primera || E.visto === hoy()) return;
  const dias = Math.round((fecha(hoy()) - fecha(E.primera)) / 864e5);
  if (dias > 0) medir('vuelve', { dias, semana: Math.ceil(dias / 7) });
  E.visto = hoy(); guardar(true);
}
function primeraCarga() {
  if (E.primera || V.demo) return;
  E.primera = E.visto = hoy(); medir('primera_carga');
}
function ir(tab) {
  if (tab === 'resumenes' && V.tab === 'resumenes') V.res = { materia: '', apunte: '', sec: '' }; // tocar la pestaña de nuevo vuelve a las tarjetas
  if (tab === 'simuladores' && V.tab === 'simuladores') V.sim = '';   // tocar la pestaña de nuevo vuelve a las tarjetas
  V.prac = null;
  V.tab = tab; history.replaceState(null, '', '#' + hashActual()); render(); window.scrollTo(0, 0);
}
// Identifica un control para devolverle el foco después de redibujar (si no, quien navega con teclado lo pierde en cada cambio).
const claveFoco = el => el.getAttribute('data-f') || el.id || ((el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 80) + '|' + el.tagName);
function conFoco(raiz, dibujar) {
  const act = document.activeElement, k = act && raiz.contains(act) ? claveFoco(act) : null;
  dibujar();
  if (k) { const el = [...raiz.querySelectorAll('input, select, textarea, button, a[href], summary')].find(x => claveFoco(x) === k); if (el) el.focus({ preventScroll: true }); }
}
function render() {
  const nav = $('#pestanas');
  nav.innerHTML = TABS.map(([id, t]) => `<button ${V.tab === id ? 'aria-current="page"' : ''} onclick="ir(${arg(id)})">${t}</button>`).join('');
  const actual = nav.querySelector('[aria-current]');
  if (actual && actual.scrollIntoView && (actual.offsetLeft < nav.scrollLeft || actual.offsetLeft + actual.offsetWidth > nav.scrollLeft + nav.clientWidth)) actual.scrollIntoView({ block: 'nearest', inline: 'center' });
  bordesPestanas();
  conFoco($('#main'), () => { $('#main').innerHTML = (V.demo ? bandaEjemplo() : '') + { carrera: vCarrera, horarios: vHorarios, calendario: vCalendario, resumenes: vResumenes, biblioteca: vBiblioteca, simuladores: vSimuladores, glosario: vGlosario, links: vLinks, novedades: vNovedades }[V.tab](); });
}
// En el celular las pestañas no entran: un degradé en el borde avisa que hay más para deslizar.
function bordesPestanas() {
  const n = $('#pestanas');
  if (!n || !n.classList) return;
  n.classList.toggle('mas-der', n.scrollLeft + n.clientWidth < n.scrollWidth - 2);
  n.classList.toggle('mas-izq', n.scrollLeft > 2);
}
$('#pestanas').addEventListener('scroll', bordesPestanas, { passive: true });
window.addEventListener('resize', bordesPestanas);

// ---------- notas y promedios ----------
// Cada materia aprobada aporta su nota final; cada aplazo (final desaprobado) aporta la suya.
// Los idiomas no promedian. Se calcula con y sin CBC, y con y sin aplazos.
const num = v => { const n = Number(String(v == null ? '' : v).replace(',', '.')); return n > 0 ? n : null; };
function promedios() {
  const grupos = { cbc: [], carrera: [] };
  let aplazos = 0;
  D.plan.materias.forEach(m => {
    if (m.grupo === 'idiomas') return;
    const e = E.materias[m.id] || {}, g = m.grupo === 'cbc' ? 'cbc' : 'carrera';
    const n = e.estado === 'aprobada' ? num(e.nota) : null;
    if (n) grupos[g].push({ n, aplazo: false });
    (e.aplazos || []).forEach(a => { if (num(a)) { grupos[g].push({ n: num(a), aplazo: true }); aplazos++; } });
  });
  const prom = L => L.length ? L.reduce((s, x) => s + x.n, 0) / L.length : null;
  const sinAp = L => L.filter(x => !x.aplazo);
  const todo = grupos.cbc.concat(grupos.carrera);
  // nSinCbc y nConCbc: sobre cuántas notas sale cada promedio (aprobadas con nota más aplazos).
  return { aplazos, sinCbc: prom(grupos.carrera), conCbc: prom(todo), sinCbcSinAplazos: prom(sinAp(grupos.carrera)), conCbcSinAplazos: prom(sinAp(todo)),
    nSinCbc: grupos.carrera.length, nConCbc: todo.length };
}
const fmtProm = n => n == null ? '—' : n.toFixed(2).replace('.', ',');

// =====================================================================
// MI CARRERA
// =====================================================================
function progreso() {
  const de = g => D.plan.materias.filter(m => m.grupo === g);
  const ok = L => L.filter(m => (E.materias[m.id] || {}).estado === 'aprobada').length;
  const materias = de('cbc').concat(de('grado'));
  return { materias: [ok(materias), materias.length], idiomas: [ok(de('idiomas')), de('idiomas').length], final: [ok(de('final')), de('final').length],
    cursando: D.plan.materias.filter(m => (E.materias[m.id] || {}).estado === 'cursando').length,
    regulares: D.plan.materias.filter(m => (E.materias[m.id] || {}).estado === 'regular').length,
    total: [ok(D.plan.materias), D.plan.materias.length] };
}
// Hay algo cargado: una materia con estado, nota, aplazos o fechas. Sin eso, la pantalla arranca con una sola acción.
const conDatos = () => Object.keys(E.materias).some(id => { const m = E.materias[id]; return m.estado !== 'pendiente' || m.nota || (m.examenes || []).length || (m.aplazos || []).length; });
const diasDesde = s => Math.round((fecha(hoy()) - fecha(s)) / 864e5);
function vCarrera() {
  const h = [];
  if (!conDatos()) h.push(vPortada());
  else {
    const p = progreso(), pr = promedios();
    const dato = (n, t, barra) => `<div class="dato"><b>${n}</b><span>${t}</span>${barra != null ? `<div class="barra"><i style="width:${barra}%"></i></div>` : ''}</div>`;
    // Avance: cada requisito del plan (CBC, materias de grado, niveles de idioma y pasantía o tesina) pesa lo mismo.
    const av = Math.round(p.total[0] * 100 / p.total[1]), avReg = Math.round(p.regulares * 100 / p.total[1]);
    const avance = `<div class="avance"><div class="fila"><b class="crece">Llevás el ${av} % de la carrera</b><span class="chico tenue">${p.total[0]} de ${p.total[1]} requisitos aprobados${p.regulares ? ` · ${p.regulares} con el final pendiente` : ''}</span></div>
      <div class="barra grande" role="progressbar" aria-label="Avance de la carrera" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${av}"><i style="width:${av}%"></i>${avReg ? `<i class="reg" style="width:${avReg}%" title="Regulares: falta el final"></i>` : ''}</div></div>`;
    const n = pr.nSinCbc, notas = k => k + (k === 1 ? ' nota' : ' notas');
    // Solo los indicadores que dicen algo: los que están en cero no se muestran.
    h.push(`<div class="tarjeta">${avance}<div class="resumen">
      ${dato(p.materias[0] + '<small class="tenue" style="font-size:1rem"> / ' + p.materias[1] + '</small>', 'materias aprobadas', Math.round(p.materias[0] * 100 / p.materias[1]))}
      ${p.idiomas[0] ? dato(p.idiomas[0] + '<small class="tenue" style="font-size:1rem"> / ' + p.idiomas[1] + '</small>', 'niveles de idioma', Math.round(p.idiomas[0] * 100 / p.idiomas[1])) : ''}
      ${n ? dato(fmtProm(pr.sinCbc), 'promedio sin CBC · sobre ' + notas(n)) : ''}
      ${p.cursando ? dato(p.cursando, 'cursando ahora') : ''}${p.regulares ? dato(p.regulares, 'finales pendientes') : ''}${p.final[0] ? dato('✓', 'pasantía o tesina') : ''}</div>
      <p class="chico tenue" style="margin:12px 0 0">${pr.nConCbc > n ? `Con el CBC: ${fmtProm(pr.conCbc)}, sobre ${notas(pr.nConCbc)}. ` : ''}${pr.aplazos ? `<b>Con ${pr.aplazos} ${pr.aplazos === 1 ? 'aplazo' : 'aplazos'}.</b> Sin contarlos: ${fmtProm(pr.sinCbcSinAplazos)} sin CBC y ${fmtProm(pr.conCbcSinAplazos)} con CBC. ` : ''}
        ${n ? `El promedio usa la nota final de cada materia aprobada${pr.aplazos ? '' : ' y los aplazos que cargues en cada materia'}; los idiomas no promedian.` : 'Para ver tu promedio, cargá la nota de cada materia aprobada.'}</p>
      ${proximo()}${recordatorioCopia()}
      <p class="chico compartir"><span class="tenue">¿Le sirve a alguien de tu cursada?</span> <button class="enlace" onclick="compartirCursada('carrera')">Pasásela por WhatsApp</button></p></div>`);
  }
  h.push(`<div class="fila" style="margin-bottom:10px"><button class="btn ${V.vista === 'tabla' ? '' : 'lin'} ch" onclick="V.vista='tabla';render()">Tabla</button>
    <button class="btn ${V.vista === 'recorrido' ? '' : 'lin'} ch" onclick="V.vista='recorrido';render()">Recorrido sugerido</button><span class="crece"></span>
    ${conDatos() ? '<button class="btn sec ch" onclick="exportar()">⬇ Descargar copia de mis datos</button>' : ''}<button class="btn lin ch" onclick="window.print()">Imprimir</button></div>
    <p class="chico tenue" style="margin:0 0 10px">${esc(D.plan.requisitos)} ${esc(D.plan.nota)}</p>`);
  h.push(V.vista === 'recorrido' ? vRecorrido() : D.plan.grupos.map(vGrupo).join(''));
  if (D.plan.verificado) h.push(`<p class="chico tenue verificado">✓ Datos verificados el ${fmt(D.plan.verificado)}. ${esc(D.plan.verificado_nota || '')}</p>`);
  return h.join('');
}
// Primera vez (o sin nada cargado): qué gana la persona, una sola acción y, como mucho, lo próximo del calendario.
function vPortada() {
  return `<div class="tarjeta portada"><h2>Armá tu cursada sin superposiciones y llevá tu promedio al día.</h2>
    <p class="chico tenue">Gratis y sin cuenta: lo que cargás queda solo en este navegador. <button class="enlace" onclick="abrirDatos()">Cómo funciona</button></p>
    <p><button class="btn" onclick="marcarRapido()">Marcar las materias que ya aprobé</button></p>
    <p class="chico">¿Querés ver cómo queda antes de cargar nada? <button class="enlace" onclick="verEjemplo()">Miralo con un ejemplo</button>.</p>
    ${proximo()}</div>`;
}
// Lo próximo que importa: la fecha más cercana de la persona o del calendario (inscripciones, exámenes y trámites).
function proximo() {
  const t = hoy(), cal = ((D.calendario || {}).eventos || []).filter(e => ['inscripcion', 'examen', 'tramite'].indexOf(e.tipo) >= 0);
  const e = cal.concat(misFechas()).filter(x => x.hasta >= t).sort((a, b) => a.desde < b.desde ? -1 : a.desde > b.desde ? 1 : 0)[0];
  const rep = repasos().find(r => r.desde === t);
  if (!e && !rep) return '';
  return `<p class="proximo chico">${e ? `<span class="tenue">Lo que viene:</span> <b>${esc(e.t)}</b>, ${e.desde < t ? 'hasta el ' + fmt(e.hasta) : fmtRango(e.desde, e.hasta)}. <button class="enlace" onclick="ir('calendario')">Ver el calendario</button>` : ''}
    ${rep ? `${e ? '<br>' : ''}🧠 Hoy toca repasar ${esc(rep.nombre)}: <button class="enlace" onclick="empezarPractica(${arg(rep.res)})">practicar ${RONDA} preguntas</button>` : ''}</p>`;
}
// La copia, recordada donde sirve: cuando ya hay algo que perder y nunca se bajó, o cuando cambió desde la última (y pasó un mes).
function recordatorioCopia() {
  if (V.demo) return '';
  const cargadas = Object.keys(E.materias).filter(id => E.materias[id].estado !== 'pendiente').length;
  if (cargadas < 3 || (E.copia && (E.modif <= E.copia || diasDesde(E.copia) < 30))) return '';
  return `<div class="recordatorio chico"><span class="crece">💾 ${E.copia ? `Tu última copia es del ${fmt(E.copia)} y después cargaste cosas nuevas.` : `Ya cargaste ${cargadas} materias.`}
    Con una copia las recuperás si cambiás de celular o se borran los datos del navegador.</span><button class="btn sec ch" onclick="exportar()">Descargar copia</button></div>`;
}
// Compartir: WhatsApp es por donde circula todo en la cursada. El mensaje es el mismo que el del mail de los lunes.
const MSJ_COMPARTIR = 'Te paso Cursada: llevás las materias de Edición, el promedio y armás los horarios sin superposiciones. Gratis y sin cuenta 👉 https://ficha.github.io/cursada/';
function compartirCursada(donde) {
  medir('share', { method: 'whatsapp', content_type: 'cursada', item_id: donde });
  window.open('https://wa.me/?text=' + encodeURIComponent(MSJ_COMPARTIR), '_blank', 'noopener');
}
// Carga rápida: todas las materias en una lista, con «Aprobada» y «La curso». Las notas y las fechas, después, en cada materia.
function marcarRapido() {
  const fila = m => { const e = E.materias[m.id] || {};
    return `<div class="rapida"><span class="crece">${esc(nombreDe(m))}</span>
      <label class="chico"><input type="checkbox" data-f="ra-${esc(m.id)}" ${e.estado === 'aprobada' ? 'checked' : ''} onchange="marcaRapida(${arg(m.id)},'aprobada',this.checked)"> Aprobada</label>
      <label class="chico"><input type="checkbox" data-f="rc-${esc(m.id)}" ${e.estado === 'cursando' ? 'checked' : ''} onchange="marcaRapida(${arg(m.id)},'cursando',this.checked)"> La curso</label></div>`; };
  abrir(cab('¿Qué materias ya aprobaste?') + `<p class="chico tenue" style="margin-top:0">Tildá las que aprobaste y las que estás cursando. Las notas y las fechas se cargan después, tocando cada materia.</p>
    ${D.plan.grupos.map(g => `<div class="c">${esc(g.nombre)}</div>` + D.plan.materias.filter(m => m.grupo === g.id).map(fila).join('')).join('')}
    <div class="botones"><button class="btn" onclick="cerrar();listoRapido()">Listo</button></div>`, 'rapido');
}
function marcaRapida(id, estado, si) {
  const e = mat(id);
  e.estado = si ? estado : e.estado === estado ? 'pendiente' : e.estado;
  guardar(); render(); marcarRapido();
}
function listoRapido() { if (conDatos()) { const p = progreso(); aviso('Listo: llevás el ' + Math.round(p.total[0] * 100 / p.total[1]) + ' % de la carrera'); window.scrollTo(0, 0); } }
// Ejemplo: una carrera a mitad de camino, para ver cómo queda antes de cargar nada. Mientras se mira, no se guarda nada.
function ejemploCarrera() {
  const en = d => { const x = new Date(); x.setDate(x.getDate() + d); return iso(x); };
  const ap = (nota, aprobada) => ({ estado: 'aprobada', nota, aprobada, examenes: [] });
  return normalizar({ v: 1, materias: {
    ipc: ap('8', '2023-07-12'), icse: ap('7', '2023-12-06'), '0902': ap('9', '2024-07-10'), '0913': ap('8', '2024-11-20'), '0915': ap('7', '2024-07-03'),
    '0916': ap('9', '2025-07-02'), '0918': ap('8', '2025-07-09'), '0919': ap('10', '2025-06-25'), ingles1: ap('7', '2024-12-04'),
    '0914': { estado: 'regular', examenes: [{ id: 'ej1', tipo: 'Final', fecha: en(45), hora: '18:00', detalle: '', nota: '' }] },
    '0911': { estado: 'cursando', examenes: [{ id: 'ej2', tipo: 'Parcial', fecha: en(9), hora: '16:00', detalle: '', nota: '' }] },
    '0905': { estado: 'cursando', examenes: [{ id: 'ej3', tipo: 'Parcial', fecha: en(16), hora: '', detalle: 'Entrega del proyecto', nota: '' }] },
    '0909': { estado: 'cursando', examenes: [] } } });
}
const bandaEjemplo = () => `<div class="banda-ejemplo"><span class="crece"><b>Estás viendo un ejemplo.</b> Tocá lo que quieras: no se guarda nada.</span><button class="btn ch" onclick="salirEjemplo()">Salir del ejemplo</button></div>`;
function verEjemplo() { if (V.demo) return; V.demo = E; E = ejemploCarrera(); V.tab = 'carrera'; cerrar(); render(); window.scrollTo(0, 0); medir('ver_ejemplo'); }
function salirEjemplo() { if (!V.demo) return; E = V.demo; V.demo = null; render(); window.scrollTo(0, 0); }
function proximaFecha(id) {
  const ex = ((E.materias[id] || {}).examenes || []).filter(x => x.fecha && x.fecha >= hoy()).sort((a, b) => a.fecha < b.fecha ? -1 : 1)[0];
  return ex ? `<span class="chip mos">${esc(ex.tipo)}: ${fmt(ex.fecha)}</span>` : '';
}
function vGrupo(g) {
  const L = D.plan.materias.filter(m => m.grupo === g.id);
  return `<div class="titulo-sec"><h2>${esc(g.nombre)}</h2><span class="chico tenue">${L.filter(m => (E.materias[m.id] || {}).estado === 'aprobada').length} de ${L.length}</span></div>
    ${g.ayuda ? `<p class="chico tenue" style="margin:-4px 0 8px">${esc(g.ayuda)}</p>` : ''}
    <div class="tarjeta" style="padding:6px 12px"><table class="tabla"><thead><tr><th>Materia</th><th>Se dicta</th><th>Estado</th><th>Nota</th><th><span class="solo-lector">Programa</span></th></tr></thead><tbody>
    ${L.map(m => {
      const e = E.materias[m.id] || { estado: 'pendiente' }, o = opcion(m);
      const cuat = (o && o.cuat) || m.cuat || [], reg = (o && o.regimen) || m.regimen, regNota = (o && o.regimen_nota) || m.regimen_nota, progs = programas(m, o);
      // Las electivas con opciones fijas se eligen acá mismo (los seminarios y la pasantía o tesina, desde su ficha).
      const elige = m.opciones && m.id !== 'final' ? `<select class="elige-op" data-f="op${esc(m.id)}" aria-label="¿Cuál cursaste o vas a cursar? (${esc(m.nombre)})" onchange="campo(${arg(m.id)},'opcion',this.value)">
        <option value="">¿Cuál elegiste?</option>${m.opciones.map(x => `<option value="${esc(x.id)}" ${e.opcion === x.id ? 'selected' : ''}>${esc(x.nombre)}</option>`).join('')}</select>` : '';
      return `<tr class="${e.estado}"><td><button class="nombre" onclick="abrirMateria(${arg(m.id)})">${esc(nombreDe(m))}</button>${elige}
        <div class="chico tenue">${m.codigo || (o && o.codigo) ? esc(m.codigo || o.codigo) + ' · ' : ''}${m.electiva && !o && !(m.libre && e.detalle) && !elige ? 'A elegir · ' : ''}${reg ? esc(reg) : ''}${regNota ? ` <span class="chip ojo" title="${esc(regNota)}">cambió</span>` : ''} ${proximaFecha(m.id)}${(e.aplazos || []).length ? ` <span class="chip mal">${e.aplazos.length} ${e.aplazos.length === 1 ? 'aplazo' : 'aplazos'}</span>` : ''}</div></td>
        <td class="ctl">${cuat.map(c => `<span class="chip">${c}</span>`).join(' ')}</td>
        <td class="ctl"><select aria-label="Estado de ${esc(m.nombre)}" onchange="setEstado(${arg(m.id)},this.value)">${Object.keys(ESTADOS).map(k => `<option value="${k}" ${e.estado === k ? 'selected' : ''}>${ESTADOS[k]}</option>`).join('')}</select></td>
        <td class="ctl"><input class="nota" inputmode="decimal" placeholder="Nota" aria-label="Nota de ${esc(m.nombre)}" value="${esc(e.nota || '')}" onchange="setNota(${arg(m.id)},this.value)"></td>
        <td class="ctl">${progs.length === 1 ? `<a class="chico" href="${esc(progs[0].url)}" target="_blank" rel="noopener">Programa</a>`
          : progs.length ? `<button class="enlace chico" onclick="abrirMateria(${arg(m.id)})">Programas</button>` : ''}</td></tr>`;
    }).join('')}</tbody></table></div>`;
}
function setEstado(id, estado) { mat(id).estado = estado; guardar(); render(); }
function setNota(id, v) {
  const n = String(v).trim().replace(',', '.');
  if (n && !(Number(n) >= 1 && Number(n) <= 10)) { aviso('La nota va de 1 a 10'); render(); return; }
  if (n && Number(n) < 4) { aviso('Menos de 4 es un aplazo: cargalo en “Aplazos”, dentro de la materia'); render(); return; }
  mat(id).nota = n.replace('.', ',');
  if (n && Number(n) >= 4 && mat(id).estado !== 'aprobada') mat(id).estado = 'aprobada';
  guardar(); render();
}
const MARCA = { cursando: '● cursando', regular: '◐ regular', aprobada: '✓ aprobada' };
function vRecorrido() {
  const celdas = [];
  D.plan.areas.forEach(a => {
    celdas.push(`<div class="area">${esc(a)}</div>`);
    for (let mod = 1; mod <= 4; mod++) {
      celdas.push('<div class="celda">' + D.plan.materias.filter(m => m.area === a && m.modulo === mod).map(m =>
        { const est = (E.materias[m.id] || {}).estado || 'pendiente';
          return `<button class="mat ${est}" onclick="abrirMateria(${arg(m.id)})">${esc(nombreDe(m))}${est === 'pendiente' ? '' : `<span class="marca-estado">${MARCA[est]}</span>`}</button>`; }).join('') + '</div>');
    }
  });
  return `<p class="chico tenue">Orden sugerido por el Departamento de Edición, por áreas. No es obligatorio: la carrera no tiene correlatividades.
    <span class="chip mos">cursando</span> <span class="chip ojo">regular</span> <span class="chip ok">aprobada</span></p>
    <div class="recorrido"><div></div>${[1, 2, 3, 4].map(n => `<div class="cab">Módulo ${n}</div>`).join('')}${celdas.join('')}</div>
    <p class="chico tenue" style="margin-top:12px">Idiomas y pasantía o tesina no figuran acá: se cursan en paralelo. Están en la vista Tabla.</p>`;
}

// ---------- ficha de una materia ----------
// k identifica el diálogo: si se redibuja el mismo (por ejemplo, al agregar un parcial), conserva el scroll y el foco.
function abrir(html, k) {
  const d = $('#dlg'), mismo = d.open && k && d.dataset.k === k, y = mismo ? $('.in', d).scrollTop : 0;
  const dibujar = () => { d.innerHTML = `<div class="in">${html}</div>`; };
  if (mismo) conFoco(d, dibujar); else dibujar();
  d.dataset.k = k || '';
  // Cada rótulo queda asociado a su control (para lectores de pantalla y para que el clic en el rótulo enfoque el campo).
  d.querySelectorAll('label.c').forEach((l, i) => {
    const c = l.nextElementSibling && (l.nextElementSibling.matches('input, select, textarea') ? l.nextElementSibling : l.nextElementSibling.querySelector('input, select, textarea'));
    if (c) { c.id = c.id || 'c' + i; l.htmlFor = c.id; }
  });
  if (!d.open) d.showModal();
  $('.in', d).scrollTop = y;
}
function cerrar() { const d = $('#dlg'); if (d.open) d.close(); }
$('#dlg').addEventListener('click', e => { if (e.target.id === 'dlg') cerrar(); });
const cab = t => `<div class="cab"><h2 class="crece" id="dlg-t">${t}</h2><button class="x" onclick="cerrar()" aria-label="Cerrar">✕</button></div>`;
const val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };

// ---------- donar ----------
function abrirDonar() {
  const fila = (t, v) => `<div class="donar-fila"><span class="chico tenue">${t}</span><code>${esc(v)}</code><button class="btn sec" onclick="copiar(${arg(v)})">Copiar</button></div>`;
  abrir(cab('☕ Doná para mantener este proyecto') + `
    <p>Si Cursada te sirve, podés transferir lo que quieras desde cualquier banco o billetera: sin comisión y llega al instante.</p>
    ${fila('Alias', DONAR.alias)}${DONAR.cvu ? fila('CVU', DONAR.cvu) : ''}
    <div class="donar-fila"><span class="chico tenue">Cafecito</span><code>cafecito.app/fidelchaves</code><a class="btn sec" href="https://cafecito.app/fidelchaves" target="_blank" rel="noopener">Abrir</a></div>
    <div class="botones"><button class="btn lin" onclick="cerrar()">Cerrar</button></div>`, 'donar');
}
function copiar(t) {
  const listo = () => aviso('Copiado: ' + t);
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(listo, () => aviso('No se pudo copiar'));
  else aviso('No se pudo copiar');
}

function abrirMateria(id) {
  const m = datosMateria(id), e = mat(id), o = opcion(m);
  const progs = programas(m, o), reg = (o && o.regimen) || m.regimen, regNota = (o && o.regimen_nota) || m.regimen_nota, previas = (o && o.previas) || m.previas;
  const recursos = (D.plan.recursos || {})[(o && o.id) || m.id] || [];
  abrir(cab(esc(nombreDe(m))) + `
    <p class="chico tenue" style="margin:0">${[m.codigo || (o && o.codigo), m.area, m.modulo ? 'módulo ' + m.modulo : '', reg].filter(Boolean).map(esc).join(' · ')}</p>
    ${regNota ? `<p class="chico" style="margin:6px 0">⚠️ ${esc(regNota)} <span class="tenue">Si cursaste otro año, vale el régimen de tu cursada.</span></p>` : ''}
    ${m.ayuda ? `<p class="chico">${esc(m.ayuda)}</p>` : ''}
    ${previas ? `<p class="chico" style="margin:6px 0">💡 ${esc(previas)} <span class="tenue">(Sugerencia: la carrera no tiene correlatividades.)</span></p>` : ''}
    ${m.opciones ? `<label class="c">¿Cuál elegís?</label><select id="m-op" onchange="campo(${arg(id)},'opcion',this.value);abrirMateria(${arg(id)})"><option value="">Todavía no sé</option>${m.opciones.map(x => `<option value="${x.id}" ${e.opcion === x.id ? 'selected' : ''}>${esc(x.nombre)}</option>`).join('')}</select>` : ''}
    ${m.libre ? `<label class="c">¿Qué seminario?</label><input id="m-det" style="width:100%" value="${esc(e.detalle || '')}" placeholder="Nombre del seminario" onchange="campo(${arg(id)},'detalle',this.value)">` : ''}
    <div class="fila"><div class="crece"><label class="c">Estado</label><select style="width:100%" onchange="campo(${arg(id)},'estado',this.value)">${Object.keys(ESTADOS).map(k => `<option value="${k}" ${e.estado === k ? 'selected' : ''}>${ESTADOS[k]}</option>`).join('')}</select></div>
      <div><label class="c">Nota final</label><input class="nota" style="width:90px" inputmode="decimal" value="${esc(e.nota || '')}" onchange="setNota(${arg(id)},this.value)"></div></div>
    <div class="fila"><div class="crece"><label class="c">Cuándo la cursaste o cursás</label><input style="width:100%" value="${esc(e.cuando || '')}" placeholder="Ej.: 2.º cuatrimestre 2026" onchange="campo(${arg(id)},'cuando',this.value)"></div>
      <div><label class="c">Fecha de aprobación</label><input type="date" value="${esc(e.aprobada || '')}" onchange="campo(${arg(id)},'aprobada',this.value)"></div></div>
    <label class="c">Aplazos (finales desaprobados; cuentan para el promedio)</label>
    <div class="fila">${(e.aplazos || []).map((a, i) => `<span class="chip mal" style="font-size:.85rem;padding:4px 10px">${esc(a)} <button class="enlace" style="color:inherit;text-decoration:none" onclick="borrarAplazo(${arg(id)},${i})" aria-label="Quitar aplazo">✕</button></span>`).join('')}
      <select id="m-ap" aria-label="Nota del aplazo"><option value="2">2</option><option value="1">1</option><option value="3">3</option></select>
      <button class="btn lin ch" onclick="sumarAplazo(${arg(id)})">＋ Agregar aplazo</button></div>
    ${mesasDe(m).length ? `<div class="c">Mesas de examen publicadas</div>` + mesasDe(m).map(x => `<div class="fila chico" style="padding:4px 0"><span class="crece">${fmt(x.fecha)}${x.hora ? ', ' + esc(x.hora) + ' h' : ''}${x.aula ? ' · aula ' + esc(x.aula) : ''} <span class="tenue">(${esc(x.llamado || x.turno)})</span></span>
      ${x.fecha >= hoy() ? `<button class="btn lin ch" onclick="mesaAMisFechas(${arg(id)},${arg(x.fecha)},${arg(x.hora)},${arg(x.aula)})">Voy a esta</button>` : ''}</div>`).join('') : ''}
    ${progs.length ? `<div class="c">${progs.length === 1 ? 'Programa' : 'Programas'}</div>${progs.map(p => `<p style="margin:2px 0"><a href="${esc(p.url)}" target="_blank" rel="noopener">${esc(p.t)} ↗</a></p>`).join('')}` : ''}
    ${vBibliografia((o && o.id) || m.id, id)}
    ${D.resumenes && D.resumenes.materias.some(x => x.id === ((o && o.id) || m.id)) ? `<p class="fila" style="margin:12px 0 0"><button class="btn sec ch" onclick="cerrar();irResumenes(${arg((o && o.id) || m.id)})">📚 Resúmenes de esta materia</button>
      <button class="btn sec ch" onclick="empezarPractica(${arg((o && o.id) || m.id)})">🧠 Practicar con preguntas</button></p>` : ''}
    ${recursos.length ? `<div class="c">Apuntes y recursos</div>${recursos.map(r => `<p style="margin:2px 0"><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.t)} ↗</a></p>`).join('')}` : ''}
    <div class="titulo-sec"><h3>Parciales, entregas y finales</h3></div>
    ${(e.examenes || []).slice().sort((a, b) => (a.fecha || '') < (b.fecha || '') ? -1 : 1).map(x => `<div class="fila" style="padding:6px 0;border-bottom:1px solid var(--borde)">
      <span class="crece"><b>${esc(x.tipo)}</b>${x.detalle ? ' · ' + esc(x.detalle) : ''}<span class="chico tenue" style="display:block">${x.fecha ? fmt(x.fecha) + (x.hora ? ', ' + esc(x.hora) + ' h' : '') : 'sin fecha'}${x.nota ? ' · nota: ' + esc(x.nota) : ''}</span></span>
      <input class="nota" style="width:70px" inputmode="decimal" placeholder="Nota" aria-label="Nota de ${esc(x.tipo)}" data-f="n${esc(x.id)}" value="${esc(x.nota || '')}" onchange="notaExamen(${arg(id)},${arg(x.id)},this.value)">
      <button class="btn lin ch" onclick="borrarExamen(${arg(id)},${arg(x.id)})" aria-label="Borrar ${esc(x.tipo)}" data-f="b${esc(x.id)}">✕</button></div>`).join('') || '<p class="chico tenue">Todavía no cargaste fechas.</p>'}
    <div class="fila" style="margin-top:8px"><select id="x-tipo" aria-label="Tipo de fecha"><option>Parcial</option><option>Recuperatorio</option><option>Entrega</option><option>Final</option><option>Otro</option></select>
      <input type="date" id="x-fecha" aria-label="Fecha"><input type="time" id="x-hora" aria-label="Hora (opcional)" style="width:110px"><input id="x-det" class="crece" aria-label="Detalle (opcional)" placeholder="Detalle (opcional)">
      <button class="btn sec" onclick="sumarExamen(${arg(id)})">Agregar</button></div>
    <label class="c">Mis notas</label><textarea placeholder="Cátedra, comisión, bibliografía que falta, contactos…" onchange="campo(${arg(id)},'apuntes',this.value)">${esc(e.apuntes || '')}</textarea>
    <div class="botones"><button class="btn" onclick="cerrar()">Listo</button></div>`, 'm:' + id);
}
// Bibliografía del programa oficial (datos/bibliografia/<código>.json, la arma 104-edicion-cursada/bibliografia.py copiando
// cada referencia tal cual del PDF). Se baja recién al abrir la ficha; mientras, la ficha se dibuja sin ella.
D.biblio = {};
function vBibliografia(cod, idFicha) {
  const hay = ((D.indice || {}).bibliografia || []).find(b => b.codigo === cod);
  if (!hay) return '';
  const B = D.biblio[cod];
  if (!B) {
    if (B !== null) { D.biblio[cod] = null; json('bibliografia/' + cod + '.json').then(x => { D.biblio[cod] = x; }, () => { D.biblio[cod] = { grupos: [], error: true }; })
      .then(() => { const d = $('#dlg'); if (d.open && d.dataset.k === 'm:' + idFicha) abrirMateria(idFicha); }); }
    return '<div class="c">Bibliografía del programa</div><p class="chico tenue">Cargando…</p>';
  }
  if (B.error || !B.grupos.length) return '';
  const n = B.grupos.reduce((t, g) => t + g.obligatoria.length + g.complementaria.length, 0);
  const lista = L => `<ul class="biblio">${L.map(r => `<li>${esc(r)}</li>`).join('')}</ul>`;
  return `<details class="biblio-prog" ${V.bib ? 'open' : ''} ontoggle="V.bib=this.open"><summary><b>📖 Bibliografía del programa ${B.anio}</b> <span class="chip">${n} textos</span></summary>
    <p class="chico tenue" style="margin:6px 0">Copiada del programa oficial ${B.anio}: si tu cátedra tiene un programa más nuevo, manda ese.</p>
    ${B.grupos.map(g => `${B.grupos.length > 1 || g.t !== 'General' ? `<h4>${esc(g.t)}</h4>` : ''}${g.obligatoria.length ? (g.complementaria.length ? '<p class="chico"><b>Obligatoria</b></p>' : '') + lista(g.obligatoria) : ''}
      ${g.complementaria.length ? `<details class="chico"><summary>Complementaria (${g.complementaria.length})</summary>${lista(g.complementaria)}</details>` : ''}`).join('')}</details>`;
}
function sumarAplazo(id) { const e = mat(id); (e.aplazos = e.aplazos || []).push(val('m-ap')); guardar(); render(); abrirMateria(id); }
function borrarAplazo(id, i) { mat(id).aplazos.splice(i, 1); guardar(); render(); abrirMateria(id); }
// Mesas de examen publicadas por la Facultad para una materia (o para la opción elegida de una electiva).
function mesasDe(m) {
  const ids = [m.id].concat((m.opciones || []).map(o => o.id));
  const e = E.materias[m.id] || {};
  return D.mesas.flatMap(t => t.mesas.filter(x => x.materia && ids.indexOf(x.materia) >= 0 && (!m.opciones || !e.opcion || x.materia === e.opcion)).map(x => Object.assign({ turno: t.nombre }, x)))
    .filter(x => x.fecha >= fechaHace(45)).sort((a, b) => a.fecha < b.fecha ? -1 : 1);
}
const fechaHace = dias => { const d = new Date(); d.setDate(d.getDate() - dias); return iso(d); };
function mesaAMisFechas(id, f, hora, aula) {
  mat(id).examenes.push({ id: uid(), tipo: 'Final', fecha: f, hora, detalle: aula ? 'Aula ' + aula : '', nota: '' });
  if (mat(id).estado === 'pendiente') mat(id).estado = 'regular';
  guardar(); render(); abrirMateria(id); aviso('Sumada a tus fechas');
}
function campo(id, k, v) { mat(id)[k] = v; if (k === 'aprobada' && v) mat(id).estado = 'aprobada'; guardar(); render(); }
function sumarExamen(id) {
  if (!val('x-fecha')) return aviso('Poné la fecha');
  mat(id).examenes.push({ id: uid(), tipo: val('x-tipo'), fecha: val('x-fecha'), hora: val('x-hora'), detalle: val('x-det'), nota: '' });
  guardar(); render(); abrirMateria(id);
}
function notaExamen(id, xid, v) { const x = mat(id).examenes.find(e => e.id === xid); if (x) { x.nota = v.trim(); guardar(); } }
function borrarExamen(id, xid) { mat(id).examenes = mat(id).examenes.filter(e => e.id !== xid); guardar(); render(); abrirMateria(id); }

// =====================================================================
// HORARIOS
// =====================================================================
function hor() { return (E.horarios[V.oferta] = E.horarios[V.oferta] || { materias: [], elegidas: {}, propias: [], bloqueos: [], sinSabado: false, listo: false }); }
const oferta = () => D.ofertas.find(o => o.id === V.oferta) || { comisiones: [], nombre: '' };
const comisiones = () => oferta().comisiones.concat(hor().propias);
// Id de materia de una comisión → nombre para mostrar (del plan, o el texto libre que se cargó a mano).
const extra = id => (oferta().extras || []).find(x => x.id === id);
function nombreMateria(id) { const x = extra(id); if (x) return x.tipo + ': ' + x.nombre; const m = D.plan.materias.find(x => x.id === id || (x.opciones || []).some(o => o.id === id)); if (!m) return id; const o = (m.opciones || []).find(x => x.id === id); return o ? o.nombre : m.nombre; }
const SIGLAS = { '0921': 'EEM', '0922': 'EPP', '0912': 'PPEP', '0923': 'PPIP' };
const siglaMateria = id => { const x = extra(id); if (x) return x.tipo.slice(0, 3).toUpperCase() + ' ' + x.nombre.split(/\s+/)[0]; if (SIGLAS[id]) return SIGLAS[id];
  const m = D.plan.materias.find(x => x.id === id); return m ? m.sigla : nombreMateria(id).split(/\s+/).map(w => w[0]).join('').slice(0, 5).toUpperCase(); };
// ¿La materia (o la opción de una electiva) de esta comisión ya figura como aprobada en Mi carrera?
function yaAprobada(id) {
  return D.plan.materias.some(m => (E.materias[m.id] || {}).estado === 'aprobada' && (m.id === id || (m.opciones || []).some(o => o.id === id && E.materias[m.id].opcion === id)));
}
function elegidas() { const h = hor(), C = comisiones(); return Object.keys(h.elegidas).filter(k => h.materias.indexOf(k.split('|')[0]) >= 0).map(k => C.find(c => c.id === h.elegidas[k])).filter(Boolean); }
const colorDe = id => COLORES[Math.max(0, hor().materias.indexOf(id)) % COLORES.length];

function vHorarios() {
  const h = hor(), of = oferta(), C = comisiones();
  const disponibles = [...new Set(C.map(c => c.materia))];
  const sel = elegidas(), ch = Horarios.choques(sel), r = Horarios.resumen(sel, h.bloqueos);
  // Con los horarios confirmados, la oferta y los avisos se pliegan en un resumen: queda a la vista solo la semana.
  const listo = h.listo && sel.length > 0;
  const out = [];
  out.push(`<div class="fila" style="margin-bottom:10px">${D.ofertasMeta.length > 1 ? `<select aria-label="Cuatrimestre" onchange="cambiarOferta(this.value)">${D.ofertasMeta.map(o => `<option value="${o.id}" ${o.id === V.oferta ? 'selected' : ''}>${esc(o.nombre)}</option>`).join('')}</select>` : `<h2>${esc(of.nombre)}</h2>`}
    <span class="crece"></span>${listo ? '' : '<button class="btn sec ch" onclick="horarioPropio()">＋ Cargar un horario a mano</button>'}</div>`);
  if (listo) out.push(vListo(sel, of));
  else {
  if (of.nota && !of.comisiones.length) out.push(`<div class="tarjeta chico">${esc(of.nota)}</div>`);
  if (of.fuente) out.push(`<p class="chico tenue">Oferta publicada por la Facultad${of.actualizado ? ', cargada el ' + fmt(of.actualizado) : ''}. <a href="${esc(of.fuente)}" target="_blank" rel="noopener">Ver la planilla original</a>. Puede haber cambios de último momento.</p>`);

  // 1. Qué materias.
  out.push(`<div class="titulo-sec"><h2>1. ¿Qué querés cursar?</h2></div><div class="tarjeta">`);
  // Las que ya aprobaste no aparecen, salvo que las pidas o ya las hayas elegido. Los seminarios van aparte, plegados.
  const ocultas = disponibles.filter(id => yaAprobada(id) && h.materias.indexOf(id) < 0);
  const visibles = V.verAprobadas ? disponibles : disponibles.filter(id => ocultas.indexOf(id) < 0);
  const opcionMat = id => `<label class="elige" ${h.materias.indexOf(id) >= 0 ? `style="background:${colorDe(id)};color:#fff;border-color:${colorDe(id)}"` : ''}>
      <input type="checkbox" data-f="q${esc(id)}" ${h.materias.indexOf(id) >= 0 ? 'checked' : ''} onchange="quieroCursar(${arg(id)},this.checked)"><span>${esc(nombreMateria(id))}${yaAprobada(id) ? ' <small>(aprobada)</small>' : ''}</span></label>`;
  const sems = visibles.filter(id => extra(id)), mats = visibles.filter(id => !extra(id));
  const semAbierto = V.verSem || sems.some(id => h.materias.indexOf(id) >= 0);
  out.push(disponibles.length ? `<div class="eligen">${mats.map(opcionMat).join('')}</div>
    ${sems.length ? `<details class="sems" ${semAbierto ? 'open' : ''} ontoggle="V.verSem=this.open"><summary>Seminarios y PST <span class="chip">${sems.length}</span></summary><div class="eligen">${sems.map(opcionMat).join('')}</div></details>` : ''}
    ${ocultas.length ? `<p class="chico tenue" style="margin:10px 0 0">${V.verAprobadas ? 'Se muestran también las que ya aprobaste.' : `No muestro ${ocultas.length === 1 ? 'una materia que ya aprobaste' : ocultas.length + ' materias que ya aprobaste'}.`}
      <button class="enlace" onclick="V.verAprobadas=!V.verAprobadas;render()">${V.verAprobadas ? 'Ocultarlas' : 'Mostrarlas'}</button></p>` : ''}`
    : '<p class="vacio" style="padding:10px">No hay horarios cargados para este cuatrimestre. Cargá los de tus materias con “Cargar un horario a mano”.</p>');
  out.push('</div>');

  // 2. Comisiones.
  if (h.materias.length) {
    out.push(`<div class="titulo-sec"><h2>2. Elegí comisiones</h2><button class="btn ch" onclick="sugerir()">✨ Sugerir combinaciones</button></div>`);
    if (V.sugeridas) out.push(vSugeridas());
    Horarios.grupos(h.materias, C).forEach(g => {
      const clave = g.materia + '|' + g.tipo;
      out.push(`<div class="tarjeta" style="border-left:5px solid ${colorDe(g.materia)}"><b>${esc(nombreMateria(g.materia))}</b> <span class="chip">${esc(g.tipo)}</span>
        ${g.opciones.map(c => `<label class="comision"><input type="radio" data-f="r${esc(c.id)}" name="${esc(clave)}" ${h.elegidas[clave] === c.id ? 'checked' : ''} onchange="elegirComision(${arg(clave)},${arg(c.id)})">
          <span class="crece"><b>${esc(c.nombre || 'Única')}</b> · ${c.bloques.map(b => Horarios.DIAS[b.dia] + ' ' + b.desde + '-' + b.hasta).join(' y ')}
          <span class="chico tenue" style="display:block">${[c.docente, c.aula, c.modalidad].filter(Boolean).map(esc).join(' · ')}${c.propia ? ' · cargado por vos' : ''}</span></span>
          ${c.propia ? `<button class="btn lin ch" onclick="event.preventDefault();borrarPropia(${arg(c.id)})" aria-label="Borrar este horario">✕</button>` : ''}</label>`).join('')}</div>`);
    });
    if (sel.length) out.push(`<div class="fila" style="justify-content:flex-end;margin-top:4px"><span class="chico tenue">Se guarda solo. Cuando termines, plegá la oferta y quedate con tu semana.</span>
      <button class="btn" onclick="horariosListos()">✓ Listo, guardar mis horarios</button></div>`);
  }
  }

  // 3. La semana.
  out.push(`<div class="titulo-sec"><h2>${h.materias.length && !listo ? '3. ' : ''}Tu semana</h2><button class="btn lin ch" onclick="bloqueo()">＋ Horario en que no puedo</button></div>`);
  if (ch.length) out.push(`<div class="tarjeta" style="border-color:var(--mal);background:var(--mal-suave)"><b>⚠ ${ch.length === 1 ? 'Hay una superposición' : 'Hay ' + ch.length + ' superposiciones'}</b>
    ${ch.map(x => `<div class="chico">${Horarios.DIAS[x.dia]} ${x.desde}-${x.hasta}: ${esc(siglaMateria(x.a.materia))} (${esc(x.a.tipo)}) con ${esc(siglaMateria(x.b.materia))} (${esc(x.b.tipo)})</div>`).join('')}</div>`);
  if (r.enBloqueo) out.push(`<div class="tarjeta" style="border-color:var(--ojo);background:var(--ojo-suave)"><b>Se pisa con un horario en que no podés</b> (${Math.round(r.enBloqueo / 60 * 10) / 10} h).</div>`);
  if (sel.length) out.push(`<p class="chico tenue">${r.dias.length} ${r.dias.length === 1 ? 'día' : 'días'} por semana (${r.dias.map(d => Horarios.DIAS[d].toLowerCase()).join(', ')}) · ${Math.round(r.clase / 60 * 10) / 10} h de clase${r.huecos ? ' · ' + Math.round(r.huecos / 60 * 10) / 10 + ' h de huecos' : ''}</p>`);
  out.push(grilla(sel, h.bloqueos, ch) + listaSemana(sel));
  const p = sel.length && periodoDe(V.oferta);
  if (p) out.push(`<div class="tarjeta fila" style="margin-top:12px"><span class="crece chico" style="min-width:220px">Llevá estas clases a Google Calendar u otro calendario: se repiten cada semana del ${fmt(p.desde)} al ${fmt(p.hasta)}${feriadosEn(p).length ? ', sin los feriados' : ''}.</span>
    <button class="btn sec ch" onclick="ayudaCalendario()">📅 Llevar a mi calendario</button></div>`);
  if (h.bloqueos.length) out.push(`<p class="chico tenue" style="margin-top:8px">No puedo: ${h.bloqueos.map((b, i) => `${esc(b.t || '')} ${Horarios.DIAS[b.dia].toLowerCase()} ${b.desde}-${b.hasta} <button class="enlace" onclick="borrarBloqueo(${i})">quitar</button>`).join(' · ')}</p>`);
  return out.join('');
}
function vListo(sel, of) {
  const h = hor(), por = {};
  sel.forEach(c => { (por[c.materia] = por[c.materia] || []).push(c); });
  return `<div class="tarjeta"><div class="fila"><b>✓ Tus horarios están guardados</b><span class="crece"></span>
      <button class="btn lin ch" onclick="editarHorarios()">✏️ Cambiar materias o comisiones</button></div>
    <ul class="resumen-sel">${Object.keys(por).map(m => `<li style="border-left-color:${colorDe(m)}"><b>${esc(nombreMateria(m))}</b>
      <span class="chico tenue">${por[m].map(c => esc(c.tipo) + (c.nombre ? ' ' + esc(c.nombre) : '')).join(' · ')}</span></li>`).join('')}</ul>
    ${h.materias.length > Object.keys(por).length ? `<p class="chico" style="margin:6px 0 0;color:var(--ojo)">Hay materias marcadas sin comisión elegida.</p>` : ''}
    ${of.fuente ? `<p class="chico tenue" style="margin:6px 0 0">Oferta${of.actualizado ? ' del ' + fmt(of.actualizado) : ''}, sujeta a cambios: <a href="${esc(of.fuente)}" target="_blank" rel="noopener">planilla de la Facultad</a>.</p>` : ''}</div>`;
}
function horariosListos() {
  const h = hor(), faltan = Horarios.grupos(h.materias, comisiones()).filter(g => !h.elegidas[g.materia + '|' + g.tipo]);
  if (faltan.length) return aviso('Te falta elegir: ' + faltan.map(g => siglaMateria(g.materia) + ' (' + g.tipo.toLowerCase() + ')').join(', '));
  h.listo = true; V.sugeridas = null; guardar(); render(); window.scrollTo(0, 0); aviso('Horarios guardados');
}
function editarHorarios() { hor().listo = false; guardar(); render(); }
function listaSemana(sel) {
  const dias = [1, 2, 3, 4, 5, 6].map(d => [d, sel.flatMap(c => c.bloques.filter(b => b.dia === d).map(b => ({ c, b }))).sort((x, y) => x.b.desde < y.b.desde ? -1 : 1)]).filter(x => x[1].length);
  if (!dias.length) return '';
  return `<ul class="semana">${dias.map(([d, L]) => `<li><b>${Horarios.DIAS[d]}</b>${L.map(({ c, b }) => `<span>${b.desde}-${b.hasta} · ${esc(nombreMateria(c.materia))} (${esc(c.tipo.toLowerCase())}${c.nombre ? ' ' + esc(c.nombre) : ''})${c.aula ? ' · aula ' + esc(c.aula) : c.modalidad ? ' · ' + esc(c.modalidad.toLowerCase()) : ''}</span>`).join('')}</li>`).join('')}</ul>`;
}
function grilla(sel, bloqueos, ch) {
  const todos = sel.flatMap(c => c.bloques).concat(bloqueos);
  let desde = 8 * 60, hasta = 23 * 60;
  if (todos.length) { desde = Math.min(desde, ...todos.map(b => Math.floor(Horarios.min(b.desde) / 60) * 60)); hasta = Math.max(21 * 60, ...todos.map(b => Math.ceil(Horarios.min(b.hasta) / 60) * 60)); }
  const PX = 0.8, alto = (hasta - desde) * PX;
  const enChoque = new Set(ch.flatMap(x => [x.a.id, x.b.id]));
  const horas = []; for (let m = desde; m <= hasta; m += 60) horas.push(m);
  const col = d => `<div class="col" style="height:${alto}px">${horas.slice(0, -1).map(m => `<div class="linea" style="position:absolute;left:0;right:0;top:${(m - desde) * PX}px"></div>`).join('')}
    ${bloqueos.filter(b => b.dia === d).map(b => `<div class="bloque bloqueo" style="top:${(Horarios.min(b.desde) - desde) * PX}px;height:${(Horarios.min(b.hasta) - Horarios.min(b.desde)) * PX}px">${esc(b.t || 'No puedo')}</div>`).join('')}
    ${sel.flatMap(c => c.bloques.filter(b => b.dia === d).map(b => `<div class="bloque ${enChoque.has(c.id) ? 'choque' : ''}" title="${esc(nombreMateria(c.materia))} · ${esc(c.tipo)} ${esc(c.nombre || '')}" style="background:${colorDe(c.materia)};top:${(Horarios.min(b.desde) - desde) * PX}px;height:${(Horarios.min(b.hasta) - Horarios.min(b.desde)) * PX}px">
      <b>${esc(siglaMateria(c.materia))}</b>${esc(c.tipo)}<br>${b.desde}-${b.hasta}${c.aula ? '<br>' + esc(c.aula) : ''}</div>`)).join('')}</div>`;
  return `<div class="grilla" aria-hidden="true"><div class="dia"></div>${[1, 2, 3, 4, 5, 6].map(d => `<div class="dia">${Horarios.DIAS[d]}</div>`).join('')}
    <div style="height:${alto}px;position:relative">${horas.map(m => `<div class="hora" style="position:absolute;right:0;top:${(m - desde) * PX}px">${Horarios.hhmm(m)}</div>`).join('')}</div>
    ${[1, 2, 3, 4, 5, 6].map(col).join('')}</div>`;
}
async function cambiarOferta(id) {
  V.oferta = id; V.sugeridas = null;
  if (!D.ofertas.some(o => o.id === id)) {
    const m = D.ofertasMeta.find(o => o.id === id);
    try { D.ofertas.push(await json(m.archivo)); } catch (e) { aviso('No se pudo cargar ese cuatrimestre'); }
  }
  render();
}
function quieroCursar(id, si) { const h = hor(); h.materias = h.materias.filter(x => x !== id); if (si) h.materias.push(id); V.sugeridas = null; guardar(); render(); }
function elegirComision(clave, id) { hor().elegidas[clave] = id; guardar(); render(); }
function sugerir() {
  const h = hor();
  V.sugeridas = Horarios.sugerir(h.materias, comisiones(), { bloqueos: h.bloqueos, sinSabado: h.sinSabado }, 5);
  render();
}
function vSugeridas() {
  const s = V.sugeridas, h = hor();
  if (!s.combinaciones.length) return '<div class="tarjeta">No hay comisiones para combinar.</div>';
  return `<div class="tarjeta"><div class="fila"><b class="crece">Las mejores combinaciones</b>
    <label class="chico"><input type="checkbox" style="min-height:0" ${h.sinSabado ? 'checked' : ''} onchange="hor().sinSabado=this.checked;guardar();sugerir()"> Evitar sábados</label>
    <button class="btn lin ch" onclick="V.sugeridas=null;render()">Cerrar</button></div>
    <p class="chico tenue" style="margin:4px 0 10px">${s.recortado ? 'Revisé una parte de las' : 'Revisé las'} ${s.total.toLocaleString('es-AR')} combinaciones posibles${s.sinChoques ? ' y me quedé con las que no tienen superposiciones' : '; ninguna está libre de superposiciones'}. Primero evito superposiciones, después tus horarios ocupados, y después busco menos días y menos huecos.</p>
    ${s.combinaciones.map((c, i) => `<div class="sugerencia ${i === 0 && !c.choques.length ? 'mejor' : ''}"><div class="fila"><span class="crece">
      ${c.choques.length ? `<span class="chip mal">${c.choques.length} superposición${c.choques.length > 1 ? 'es' : ''}</span>` : '<span class="chip ok">Sin superposiciones</span>'}
      ${c.resumen.enBloqueo ? '<span class="chip ojo">pisa un horario ocupado</span>' : ''}
      <span class="chip">${c.resumen.dias.length} días</span> <span class="chip">${Math.round(c.resumen.huecos / 60 * 10) / 10} h de huecos</span>
      <span class="chico tenue" style="display:block;margin-top:4px">${c.comisiones.map(x => esc(siglaMateria(x.materia)) + ' ' + esc(x.tipo.slice(0, 1)) + (x.nombre ? ' ' + esc(x.nombre) : '') + ': ' + x.bloques.map(b => Horarios.DIAS[b.dia].slice(0, 2) + ' ' + b.desde).join('+')).join(' · ')}</span></span>
      <button class="btn ch" onclick="usarSugerida(${i})">Usar esta</button></div></div>`).join('')}</div>`;
}
function usarSugerida(i) { const h = hor(); V.sugeridas.combinaciones[i].comisiones.forEach(c => { h.elegidas[c.materia + '|' + c.tipo] = c.id; }); V.sugeridas = null; guardar(); render(); aviso('Combinación aplicada'); }
const opcionesDia = d => [1, 2, 3, 4, 5, 6].map(n => `<option value="${n}" ${n === d ? 'selected' : ''}>${Horarios.DIAS[n]}</option>`).join('');
function horarioPropio() {
  const planOps = D.plan.materias.flatMap(m => m.opciones && m.opciones.some(o => o.codigo) ? m.opciones.filter(o => o.codigo).map(o => [o.id, o.nombre]) : [[m.id, m.nombre]]);
  abrir(cab('Cargar un horario') + `<label class="c">Materia</label><select id="h-m" style="width:100%">${planOps.map(([id, n]) => `<option value="${id}">${esc(n)}</option>`).join('')}<option value="__otra">Otra (escribila abajo)</option></select>
    <input id="h-otra" style="width:100%;margin-top:6px" maxlength="120" aria-label="Nombre de la materia, si no está en la lista" placeholder="Nombre, si no está en la lista">
    <div class="fila"><div class="crece"><label class="c">Tipo</label><select id="h-t" style="width:100%"><option>Teórico</option><option>Práctico</option><option>Teórico-práctico</option></select></div>
      <div class="crece"><label class="c">Comisión</label><input id="h-c" style="width:100%" placeholder="Ej.: 2"></div></div>
    <div class="fila"><div><label class="c">Día</label><select id="h-d">${opcionesDia(1)}</select></div><div><label class="c">Desde</label><input type="time" id="h-a" value="19:00" step="900"></div><div><label class="c">Hasta</label><input type="time" id="h-b" value="21:00" step="900"></div></div>
    <div class="fila"><div class="crece"><label class="c">Docente (opcional)</label><input id="h-doc" style="width:100%"></div><div class="crece"><label class="c">Aula o modalidad (opcional)</label><input id="h-aula" style="width:100%"></div></div>
    <p class="chico tenue">Si la comisión cursa dos días, cargala dos veces con el mismo número de comisión: se juntan solas.</p>
    <div class="botones"><button class="btn" onclick="guardarPropio()">Agregar</button><button class="btn lin" onclick="cerrar()">Cancelar</button></div>`);
}
function guardarPropio() {
  const a = val('h-a'), b = val('h-b');
  if (!a || !b || Horarios.min(b) <= Horarios.min(a)) return aviso('Revisá el horario');
  let m = val('h-m');
  if (m === '__otra') { m = val('h-otra').replace(/\|/g, '/').slice(0, 120); if (!m) return aviso('Escribí el nombre de la materia'); }
  const h = hor(), tipo = val('h-t'), nombre = val('h-c'), bloque = { dia: Number(val('h-d')), desde: a, hasta: b };
  const igual = h.propias.find(c => c.materia === m && c.tipo === tipo && (c.nombre || '') === nombre);
  if (igual) igual.bloques.push(bloque);
  else h.propias.push({ id: 'p' + uid(), materia: m, tipo, nombre, docente: val('h-doc'), aula: val('h-aula'), bloques: [bloque], propia: true });
  if (h.materias.indexOf(m) < 0) h.materias.push(m);
  const c = igual || h.propias[h.propias.length - 1];
  if (!h.elegidas[m + '|' + tipo]) h.elegidas[m + '|' + tipo] = c.id;
  guardar(); cerrar(); render(); aviso('Horario agregado');
}
function borrarPropia(id) { const h = hor(); h.propias = h.propias.filter(c => c.id !== id); Object.keys(h.elegidas).forEach(k => { if (h.elegidas[k] === id) delete h.elegidas[k]; }); guardar(); render(); }
function bloqueo() {
  abrir(cab('Horario en que no puedo') + `<p class="chico tenue" style="margin-top:0">Trabajo, otra cursada, lo que sea. Se tiene en cuenta al sugerir combinaciones.</p>
    <label class="c">Qué es (opcional)</label><input id="b-t" style="width:100%" placeholder="Trabajo">
    <div class="fila"><div><label class="c">Día</label><select id="b-d"><option value="0">Lunes a viernes</option>${opcionesDia(0)}</select></div>
      <div><label class="c">Desde</label><input type="time" id="b-a" value="09:00" step="900"></div><div><label class="c">Hasta</label><input type="time" id="b-b" value="18:00" step="900"></div></div>
    <div class="botones"><button class="btn" onclick="guardarBloqueo()">Agregar</button><button class="btn lin" onclick="cerrar()">Cancelar</button></div>`);
}
function guardarBloqueo() {
  const a = val('b-a'), b = val('b-b'), d = Number(val('b-d'));
  if (!a || !b || Horarios.min(b) <= Horarios.min(a)) return aviso('Revisá el horario');
  (d ? [d] : [1, 2, 3, 4, 5]).forEach(dia => hor().bloqueos.push({ dia, desde: a, hasta: b, t: val('b-t') }));
  V.sugeridas = null; guardar(); cerrar(); render();
}
function borrarBloqueo(i) { hor().bloqueos.splice(i, 1); V.sugeridas = null; guardar(); render(); }

// =====================================================================
// CALENDARIO
// =====================================================================
function misFechas() {
  return D.plan.materias.flatMap(m => ((E.materias[m.id] || {}).examenes || []).filter(x => x.fecha).map(x => ({ t: x.tipo + ' de ' + nombreDe(m) + (x.detalle ? ' (' + x.detalle + ')' : ''), tipo: 'mio', desde: x.fecha, hasta: x.fecha, hora: x.hora, materia: m.id })));
}
function vCalendario() {
  const c = D.calendario, t = hoy();
  // De las mesas publicadas, al calendario van solo las de las materias que tenés regulares o en curso.
  const mias = D.plan.materias.filter(m => ['regular', 'cursando'].indexOf((E.materias[m.id] || {}).estado) >= 0)
    .flatMap(m => mesasDe(m).map(x => ({ t: 'Mesa de ' + nombreDe(m) + (x.aula ? ' (aula ' + x.aula + ')' : ''), tipo: 'mesa', desde: x.fecha, hasta: x.fecha, hora: x.hora, materia: m.id })));
  const fer = (c.feriados || []).map(f => ({ t: f.t, tipo: 'feriado', desde: f.fecha, hasta: f.fecha }));
  const todos = c.eventos.concat(fer, misFechas(), mias, repasos()).sort((a, b) => a.desde < b.desde ? -1 : a.desde > b.desde ? 1 : 0);
  const futuros = todos.filter(e => e.hasta >= t), pasados = todos.filter(e => e.hasta < t);
  const periodo = c.periodos.find(p => p.desde <= t && p.hasta >= t);
  const chip = { examen: ['mal', 'Exámenes'], inscripcion: ['tin', 'Inscripción'], cursada: ['ok', 'Cursada'], tramite: ['ojo', 'Trámite'], info: ['', 'Info'], mio: ['mos', 'Tuyo'], mesa: ['mal', 'Mesa'], feriado: ['ojo', 'Feriado'], repaso: ['tin', 'Repaso'], especial: ['ojo', 'Feriado'] };
  const turnos = D.mesas.map(tn => `<details class="tarjeta"><summary style="cursor:pointer"><b>Mesas de examen: ${esc(tn.nombre)}</b> <span class="chico tenue">(${tn.mesas.length}, cargadas el ${fmt(tn.actualizado)})</span></summary>
    <p class="chico tenue">${esc(tn.nota)} <a href="${esc(tn.fuente)}" target="_blank" rel="noopener">Ver la planilla de la Facultad</a>.</p>
    ${tn.mesas.map(x => `<div class="evento"><div class="cuando">${fmt(x.fecha)}</div><div class="crece">${esc(x.nombre)}<span class="chico tenue" style="display:block">${[x.hora && x.hora + ' h', x.aula && 'aula ' + x.aula, x.llamado].filter(Boolean).map(esc).join(' · ')}</span></div></div>`).join('')}</details>`).join('');
  const fila = e => { const enCurso = e.desde <= t && e.hasta >= t; return `<div class="evento ${enCurso ? 'hoy' : ''} ${e.hasta < t ? 'pasado' : ''}"><div class="cuando">${fmtRango(e.desde, e.hasta)}</div>
    <div class="crece">${e.res ? `${esc(e.t)}: <button class="enlace" onclick="empezarPractica(${arg(e.res)})">practicar ${RONDA} preguntas</button>` : e.materia ? `<button class="enlace" onclick="abrirMateria(${arg(e.materia)})">${esc(e.t)}</button>` : esc(e.t)}${e.hora ? ' · ' + esc(e.hora) + ' h' : ''}${enCurso && e.desde !== e.hasta ? ' <span class="chico tenue">(en curso)</span>' : ''}</div>
    <span class="chip ${(chip[e.tipo] || chip.info)[0]}">${(chip[e.tipo] || chip.info)[1]}</span></div>`; };
  let semana = '';
  if (periodo) { const n = Math.floor((fecha(t) - fecha(periodo.desde)) / 6048e5) + 1, tot = Math.ceil((fecha(periodo.hasta) - fecha(periodo.desde)) / 6048e5); semana = `<div class="tarjeta"><b>${esc(periodo.nombre)}</b>: semana ${n} de ${tot}<div class="barra"><i style="width:${Math.round(n * 100 / tot)}%;background:var(--tinta)"></i></div></div>`; }
  return `${semana}<div class="titulo-sec"><h2>Lo que viene</h2><span class="fila">${V.oferta && E.horarios[V.oferta] && elegidas().length && periodoDe(V.oferta) ? '<button class="btn sec ch" onclick="ayudaCalendario()">📅 Llevar mi cursada al calendario</button>' : ''}${misFechas().length ? '<button class="btn sec ch" onclick="exportarIcs()">Llevar mis fechas al calendario (.ics)</button>' : ''}</span></div>
    <p class="chico tenue" style="margin:-4px 0 8px">Calendario académico ${c.anio} de la Facultad más tus parciales y finales (se cargan desde cada materia, en Mi carrera). ${esc(c.nota)}
      ${repasos().length ? 'Antes de cada parcial o final de una materia con resumen, te sugiero tres repasos cortos: una semana, tres días y un día antes.' : ''}</p>
    <div class="tarjeta" style="padding:6px 16px">${futuros.map(fila).join('') || '<p class="vacio">No queda nada en el calendario de este año.</p>'}</div>
    ${turnos}
    ${pasados.length ? `<button class="btn lin ch" onclick="V.verPasados=!V.verPasados;render()">${V.verPasados ? 'Ocultar' : 'Ver'} lo que ya pasó (${pasados.length})</button>${V.verPasados ? `<div class="tarjeta" style="padding:6px 16px;margin-top:10px">${pasados.map(fila).join('')}</div>` : ''}` : ''}
    ${c.consultado ? `<p class="chico tenue verificado">✓ Calendario cotejado con la <a href="${esc(c.fuente.url)}" target="_blank" rel="noopener">Secretaría Académica</a> el ${fmt(c.consultado)}. Los feriados salen de argentina.gob.ar y se actualizan solos (incluye los de la Ciudad, donde está la Facultad).</p>` : ''}`;
}
// Repaso espaciado: antes de cada parcial o final de una materia con resumen, tres repasos cortos (7, 3 y 1 día antes).
// No se guardan: se calculan de las fechas que carga cada persona.
function repasos() {
  const R = (D.resumenes && D.resumenes.materias) || [], t = hoy(), out = [];
  D.plan.materias.forEach(m => {
    const o = opcion(m), res = (o && o.id) || m.id;
    if (!R.some(r => r.id === res)) return;
    ((E.materias[m.id] || {}).examenes || []).filter(x => x.fecha > t && ['Parcial', 'Recuperatorio', 'Final'].indexOf(x.tipo) >= 0).forEach(x => {
      [7, 3, 1].forEach(d => {
        const f = fecha(x.fecha); f.setDate(f.getDate() - d);
        if (iso(f) >= t) out.push({ t: 'Repaso para el ' + x.tipo.toLowerCase() + ' de ' + nombreDe(m), tipo: 'repaso', desde: iso(f), hasta: iso(f), res, nombre: nombreDe(m) });
      });
    });
  });
  return out;
}
function descargar(nombre, texto, tipo) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([texto], { type: tipo })); a.download = nombre; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
function exportarIcs() {
  const evs = misFechas().map((e, i) => ({ uid: 'cursada-' + i + '-' + e.desde.replace(/-/g, '') + '@ficha.github.io', t: e.t, fecha: e.desde, desde: /^\d\d?:\d\d$/.test(e.hora || '') ? e.hora.padStart(5, '0') : '' }));
  descargar('mis-fechas-cursada.ics', Horarios.ics(evs, hoy()), 'text/calendar');
}
// La cursada elegida en Horarios, como clases que se repiten cada semana entre el inicio y el fin del cuatrimestre
// (según el calendario académico) y sin los feriados que trae el calendario.
function periodoDe(id) { return ((D.calendario || {}).periodos || []).find(p => p.id.toLowerCase() === String(id).toLowerCase()) || null; }
function feriadosEn(p) { return ((D.calendario || {}).feriados || []).filter(f => f.fecha >= p.desde && f.fecha <= p.hasta); }
function exportarCursada() {
  const p = periodoDe(V.oferta), sel = elegidas();
  if (!p) return aviso('Todavía no tengo las fechas de este cuatrimestre');
  if (!sel.length) return aviso('Elegí primero tus comisiones');
  const fer = feriadosEn(p), clases = Horarios.clases(sel, p, fer.map(f => f.fecha));
  const evs = clases.map(x => ({
    uid: 'cursada-' + V.oferta + '-' + x.c.id + '-' + x.i + '@ficha.github.io',
    t: nombreMateria(x.c.materia) + ' (' + x.c.tipo.toLowerCase() + (x.c.nombre ? ' ' + x.c.nombre : '') + ')',
    fecha: x.primera, desde: x.b.desde, hasta: x.b.hasta, ultima: x.ultima, sin: x.sin,
    lugar: x.c.aula ? 'Aula ' + x.c.aula : x.c.modalidad || '',
    nota: [x.c.docente && 'Docente: ' + x.c.docente, p.nombre + ': del ' + fmt(p.desde) + ' al ' + fmt(p.hasta) + '.',
      x.sin.length ? 'Sin clase: ' + x.sin.map(s => fmt(s) + ' (' + fer.find(f => f.fecha === s).t + ')').join(', ') + '.' : '',
      'Horarios sujetos a cambios: confirmá en la planilla de la Facultad. Armado con Cursada, ficha.github.io/cursada/'].filter(Boolean).join('\n')
  }));
  descargar('cursada-' + V.oferta.toLowerCase() + '.ics', Horarios.ics(evs, hoy()), 'text/calendar');
  aviso(evs.length === 1 ? 'Se bajó 1 clase semanal' : 'Se bajaron ' + evs.length + ' clases semanales');
}
function ayudaCalendario() {
  abrir(cab('Llevar la cursada a tu calendario') + `<p>Se baja un archivo <b>.ics</b> con cada clase como evento que se repite todas las semanas, desde el primer día del cuatrimestre hasta el último, sin los feriados.</p>
    <p><b>Google Calendar</b>: desde la compu, en calendar.google.com, ⚙ Configuración → Importar y exportar → Importar, y elegí el archivo. Conviene crear antes un calendario aparte (por ejemplo, “Facultad”): si después cambiás de comisión, lo borrás entero y volvés a importar.</p>
    <p><b>iPhone o Mac</b>: abrí el archivo y tocá “Agregar todo”. <b>Outlook</b>: Agregar calendario → Cargar desde archivo.</p>
    <p class="chico tenue">El archivo se arma en tu navegador: no pasa por ningún servidor.</p>
    <div class="fila"><span class="crece"></span><button class="btn" onclick="exportarCursada();cerrar()">📅 Bajar el archivo</button></div>`);
}

// =====================================================================
// RESÚMENES: apuntes propios por materia (resumenes/*.json, los arma 104-edicion-cursada/resumenes.py)
// =====================================================================
function cargarResumenes() {
  return cargarResumenes.p = cargarResumenes.p || (async () => {
    try { const r = await fetch('resumenes/indice.json'); if (!r.ok) throw new Error(); D.resumenes = await r.json(); }
    catch (e) { D.resumenes = { materias: [], error: true }; }
    if (V.tab === 'resumenes') render();
  })();
}
// Navegar dentro de Resúmenes deja una entrada en el historial: el botón Atrás del celular vuelve a donde estabas.
function verRes(materia = '', apunte = '', sec = '') {
  if (![materia, apunte, sec].every(x => !x || RE_ID.test(x))) return;
  V.res = { materia, apunte, sec }; V.prac = null;
  history.pushState(null, '', '#' + hashActual());
  if (apunte) medir('select_content', { content_type: 'apunte', item_id: materia + '/' + apunte });
  if (apunte) cargarApunte(); else { render(); window.scrollTo(0, 0); }
}
function abrirApunte(materia, id) { verRes(materia, id); }
async function cargarApunte() {
  const k = V.res.materia + '/' + V.res.apunte;
  if (!D.apuntes[k]) {
    render();
    try { const r = await fetch('resumenes/' + k + '.json'); if (!r.ok) throw new Error(); D.apuntes[k] = await r.json(); }
    catch (e) { V.res.apunte = V.res.sec = ''; history.replaceState(null, '', '#' + hashActual()); aviso('No se pudo cargar el apunte'); }
  }
  await cargarResumenes(); // sin el índice no se dibuja el apunte (y no hay a qué sección bajar)
  render(); irSeccion();
}
function irSeccion() {
  const el = V.res.sec && (document.getElementById('s-' + V.res.sec) || document.getElementById('s-' + V.res.sec.slice(0, 50).replace(/-+$/, '')) || document.getElementById(V.res.sec));
  if (el) el.scrollIntoView(); else window.scrollTo(0, 0);
}
// Los links para compartir van a r/ (páginas con vista previa que arma resumenes_web.py): WhatsApp y las redes no leen el #.
const urlRes = (m, a, sec) => location.origin + location.pathname.replace(/[^/]*$/, '') + 'r/' + (a ? m + '/' + a + '.html' + (sec ? '#' + sec : '') : m ? m + '/' : '');
// Analytics: solo eventos de uso (qué se lee, se comparte o se busca), nunca lo que la persona carga. Respeta el consentimiento (analitica.js).
const medir = (ev, p) => { try { if (typeof gtag === 'function') gtag('event', ev, p || {}); } catch (e) { } };
function compartir(url, titulo, tipo, id) {
  const nativo = navigator.share && matchMedia('(pointer: coarse)').matches;
  medir('share', { method: nativo ? 'nativo' : 'copiar', content_type: tipo, item_id: id });
  if (nativo) navigator.share({ title: titulo, url }).catch(() => {});
  else if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(() => aviso('Link copiado'), () => aviso('No se pudo copiar: el link quedó en la barra de direcciones'));
  else aviso('No se pudo copiar: el link quedó en la barra de direcciones');
}
function linkSeccion(sec, titulo) {
  V.res.sec = sec; history.replaceState(null, '', '#' + hashActual());
  compartir(urlRes(V.res.materia, V.res.apunte, sec), titulo, sec ? 'seccion' : 'apunte', V.res.materia + '/' + V.res.apunte + (sec ? '#' + sec : ''));
}
// Cada h2/h3 del apunte recibe un id estable (sacado del título) y un botón para copiar su link.
const sinEtiquetas = h => h.replace(/<[^>]*>/g, '').replace(/&[#\w]+;/g, ' ').trim();
const slug = t => sinEtiquetas(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50).replace(/-+$/, '') || 'seccion';
function seccionar(a) {
  if (a.secciones) return a;
  const usados = {}; a.secciones = [];
  a.cuerpoConIds = a.cuerpo.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, n, html) => {
    let id = slug(html); if (usados[id]) id += '-' + (++usados[id]); else usados[id] = 1;
    const t = sinEtiquetas(html);
    a.secciones.push({ id, t, n: Number(n) });
    return `<h${n} id="s-${id}">${html}<button class="ancla" onclick="linkSeccion(${arg(id)},${arg(t)})" aria-label="Copiar el link a «${esc(t)}»" title="Copiar el link a esta parte">🔗</button></h${n}>`;
  });
  return a;
}
// Todas las materias de grado como tarjetas: arriba las que tienen resumen; abajo, en punteado, las que faltan.
function vResumenes() {
  if (!D.resumenes) { cargarResumenes(); return '<p class="cargando">Cargando los resúmenes…</p>'; }
  if (V.prac) return vPractica();
  if (V.res.apunte) return vApunte();
  const R = D.resumenes;
  if (R.error) return '<p class="vacio">No se pudieron cargar los resúmenes. Probá recargar la página.</p>';
  const m = R.materias.find(x => x.id === V.res.materia);
  if (m) return vMateriaRes(m);
  const plan = id => D.plan.materias.find(x => x.id === id) || { id, nombre: id };
  const faltan = D.plan.materias.filter(p => p.grupo === 'grado' && !R.materias.some(r => r.id === p.id));
  // Las que la persona cursa o tiene para final van primero.
  const est = id => (E.materias[id] || {}).estado, suya = id => est(id) === 'cursando' || est(id) === 'regular';
  const primero = L => L.slice().sort((x, y) => suya(y.id) - suya(x.id));
  const marca = id => est(id) === 'cursando' ? '<span class="chip">la cursás</span>' : est(id) === 'regular' ? '<span class="chip">te falta el final</span>' : '';
  const cabeza = p => `<span class="fila">${p.sigla ? `<span class="clave">${esc(p.sigla)}</span>` : ''}<span class="crece"></span>${marca(p.id)}</span>`;
  return `<p class="chico tenue">Mis apuntes de cada materia, hechos para estudiar: con preguntas para autoevaluarte y para practicar de a ${RONDA}.</p>
    <div class="busca-res"><label class="solo-lector" for="res-q">Buscar en los resúmenes</label>
      <input id="res-q" type="search" autocomplete="off" placeholder="🔎 Buscar en todos los resúmenes (ej.: gramaje, punto de equilibrio)" value="${esc(V.busq)}" onfocus="cargarBusqueda()" oninput="buscarRes(this.value)"></div>
    <div id="res-resultados" aria-live="polite">${resultadosRes()}</div>
    <p class="chico tenue"><a href="r/">Todos los apuntes en versión para leer</a> (sin abrir la app, para compartir o buscar en Google).</p>
    <div id="res-tarjetas" ${V.busq.trim().length >= 3 ? 'hidden' : ''}>
    <div class="titulo-sec"><h2>Con resumen</h2><span class="chico tenue">${R.materias.length} de ${R.materias.length + faltan.length} materias</span></div>
    <div class="res-grilla">${primero(R.materias).map(r => {
      const preg = r.apuntes.reduce((t, a) => t + (a.preguntas || 0), 0);
      return `<button class="res-mat" onclick="verRes(${arg(r.id)})">${cabeza(plan(r.id))}<b>${esc(r.nombre)}</b>
        <span class="chico tenue">${r.apuntes.length} apuntes${preg ? ` · ${preg} preguntas` : ''}${r.pdfs.length ? ` · ${r.pdfs.length} PDF` : ''}</span>
        <span class="chico tenue">Para ${esc(r.examen)} · ${r.anio}</span>${avanceLectura(r)}</button>`;
    }).join('')}</div>
    ${faltan.length ? `<div class="titulo-sec"><h2>Todavía sin resumen</h2><span class="chico tenue">Se suman a medida que las curso</span></div>
    <div class="res-grilla chica">${primero(faltan).map(p => `<div class="res-mat falta">${cabeza(p)}<b>${esc(p.nombre)}</b>
      <button class="enlace chico" onclick="pedirResumen(${arg(p.id)})">Pedila o compartí tus apuntes</button></div>`).join('')}</div>` : ''}</div>`;
}
function vMateriaRes(m) {
  return `<div class="fila"><button class="btn lin ch" onclick="verRes()">← Todas las materias</button><span class="crece"></span>
      <button class="btn lin ch" onclick="compartir(urlRes(${arg(m.id)}),${arg('Resúmenes de ' + m.nombre)},'materia',${arg(m.id)})">🔗 Compartir</button></div>
    <div class="titulo-sec"><h2>${esc(m.nombre)}</h2><span class="chico tenue">Para ${esc(m.examen)} · ${m.anio}${leidosDe(m) ? ` · ✓ ${leidosDe(m)} de ${m.apuntes.length} leídos` : ''}</span></div>
    ${(n => n ? `<div class="tarjeta practicar fila"><span class="crece"><b>🧠 Practicar</b><span class="chico tenue" style="display:block">${n} preguntas de todos los apuntes, de a ${RONDA}: primero las que nunca te salieron o te salieron mal.</span></span>
      <button class="btn" onclick="empezarPractica(${arg(m.id)})">Empezar</button></div>` : '')(m.apuntes.reduce((t, a) => t + (a.preguntas || 0), 0))}
    ${m.id === '0909' ? `<p class="chico" style="margin:-4px 0 8px">🧮 Para practicar el escandallo con tus números: <button class="enlace" onclick="irSim('escandallo')">simulador de escandallo</button>.</p>` : ''}
    <div class="tarjeta" style="padding:6px 16px">${m.apuntes.map(a => `<button class="evento fila-boton" onclick="abrirApunte(${arg(m.id)},${arg(a.id)})">
      <span class="clave">${esc(a.clave)}</span><span class="crece"><b>${esc(a.t)}</b><span class="chico tenue" style="display:block">${a.min} min de lectura${a.preguntas ? ' · ' + a.preguntas + ' preguntas para autoevaluarte' : ''}</span></span>${E.leidos[m.id + '/' + a.id] ? '<span class="chip ok">✓ leído</span>' : ''}<span aria-hidden="true">›</span></button>`).join('')}</div>
    ${m.pdfs.length ? `<details class="tarjeta"><summary class="resumen-pdf"><b>Hojas de repaso para imprimir</b> <span class="chip">${m.pdfs.length} PDF</span></summary>
      ${m.pdfs.map(p => `<a class="evento" style="color:inherit;text-decoration:none" href="resumenes/${esc(encodeURI(p.archivo))}" target="_blank" rel="noopener">📄 <span class="crece">${esc(p.t)}</span> ↗</a>`).join('')}</details>` : ''}`;
}
const leidosDe = m => m.apuntes.filter(a => E.leidos[m.id + '/' + a.id]).length;
function avanceLectura(m) {
  const n = leidosDe(m);
  return n ? `<span class="chico">✓ ${n} de ${m.apuntes.length} leídos</span><span class="barra" aria-hidden="true"><i style="width:${Math.round(n / m.apuntes.length * 100)}%"></i></span>` : '';
}
function marcarLeido(k) {
  if (!/^[\w.-]{1,60}\/[\w.-]{1,60}$/.test(k)) return;
  if (E.leidos[k]) delete E.leidos[k];
  else { E.leidos[k] = hoy(); medir('marcar_leido', { item_id: k }); aviso('✓ Marcado como leído'); }
  guardar(); render();
}
function imprimir(k) { medir('imprimir', { item_id: k }); window.print(); }

// BUSCADOR: resumenes/busqueda.json (lo arma resumenes_web.py) se baja recién cuando alguien va a buscar.
function cargarBusqueda() {
  return cargarBusqueda.p = cargarBusqueda.p || (async () => {
    try {
      const r = await fetch('resumenes/busqueda.json'); if (!r.ok) throw new Error();
      const b = await r.json();
      b.s = b.s.map(([m, a, sec, t, x]) => ({ m, a, sec, t, x, nt: sinTildes(t + ' ' + (b.apuntes[m + '/' + a] || '')), nx: sinTildes(x) }));
      D.busqueda = b;
    } catch (e) { D.busqueda = { error: true, s: [] }; }
    if (V.tab === 'resumenes' && $('#res-resultados')) buscarRes(V.busq);
  })();
}
function buscarRes(q) {
  V.busq = q;
  const caja = $('#res-resultados'), tarjetas = $('#res-tarjetas');
  if (caja) caja.innerHTML = resultadosRes();
  if (tarjetas) tarjetas.hidden = q.trim().length >= 3;
  if (q.trim().length >= 3) cargarBusqueda();
  clearTimeout(buscarRes.t);
  buscarRes.t = setTimeout(() => { if (V.busq.trim().length >= 3 && D.busqueda) medir('search', { search_term: V.busq.trim().slice(0, 60) }); }, 1500);
}
// Marca las palabras buscadas en un tramo del texto (las posiciones salen del texto sin tildes, que mide lo mismo).
function resaltar(x, nx, pals, desde, hasta) {
  const marcas = [];
  pals.forEach(p => { for (let i = nx.indexOf(p, desde); i >= 0 && i < hasta; i = nx.indexOf(p, i + p.length)) marcas.push([i, Math.min(hasta, i + p.length)]); });
  marcas.sort((a, b) => a[0] - b[0]);
  let h = '', pos = desde;
  marcas.forEach(([i, f]) => { if (i < pos) return; h += esc(x.slice(pos, i)) + '<mark>' + esc(x.slice(i, f)) + '</mark>'; pos = f; });
  return h + esc(x.slice(pos, hasta));
}
function resultadosRes() {
  const q = sinTildes(V.busq.trim());
  if (q.length < 3) return '';
  if (!D.busqueda) return '<p class="cargando">Buscando…</p>';
  if (D.busqueda.error) return '<p class="vacio">No se pudo cargar el buscador. Probá recargar la página.</p>';
  const pals = q.split(/\s+/).filter(p => p.length > 1);
  const hallados = [];
  D.busqueda.s.forEach(s => {
    let puntos = 0;
    for (const p of pals) { const t = s.nt.includes(p), x = s.nx.includes(p); if (!t && !x) return; puntos += (t ? 5 : 0) + (x ? 1 : 0); }
    hallados.push([puntos, s]);
  });
  if (!hallados.length) return `<p class="vacio">No encontré «${esc(V.busq.trim())}» en los resúmenes. Probá con otra palabra o sin tildes.</p>`;
  hallados.sort((a, b) => b[0] - a[0]);
  const plan = id => (D.plan.materias.find(x => x.id === id) || {}).sigla || '';
  return `<p class="chico tenue">${hallados.length > 40 ? 'Los 40 más relevantes de ' : ''}${hallados.length} resultado${hallados.length === 1 ? '' : 's'}</p>
    <div class="tarjeta" style="padding:6px 16px">${hallados.slice(0, 40).map(([, s]) => {
      const i = Math.max(0, ...pals.map(p => s.nx.indexOf(p)).filter(i => i >= 0).slice(0, 1)), desde = Math.max(0, i - 60), hasta = Math.min(s.x.length, i + 140);
      const ap = D.busqueda.apuntes[s.m + '/' + s.a] || '';
      return `<button class="evento fila-boton" onclick="verRes(${arg(s.m)},${arg(s.a)},${arg(s.sec)})">
        <span class="clave">${esc(plan(s.m))}</span><span class="crece"><b>${esc(s.t || ap)}</b>
        <span class="chico tenue" style="display:block">${esc(D.busqueda.materias[s.m] || '')}${s.t ? ' · ' + esc(ap) : ''}</span>
        ${s.x ? `<span class="chico extracto">${desde ? '…' : ''}${resaltar(s.x, s.nx, pals, desde, hasta)}${hasta < s.x.length ? '…' : ''}</span>` : ''}</span><span aria-hidden="true">›</span></button>`;
    }).join('')}</div>`;
}
function pedirResumen(id) {
  const p = D.plan.materias.find(x => x.id === id) || { nombre: id };
  medir('pedir_resumen', { item_id: id });
  idea({ titulo: '📚 ' + p.nombre, intro: 'Todavía no hay resumen de esta materia. Contame si te serviría (y para cuándo), o si tenés apuntes propios que quieras compartir.',
    ejemplo: 'Ej.: la curso este cuatrimestre y me vendría bien para el primer parcial…', prefijo: '[Resúmenes] ' + (p.sigla || p.nombre) + ': ' });
}
const LETRAS = 'abcd';
function vApunte() {
  const { materia, apunte } = V.res, k = materia + '/' + apunte, a = D.apuntes[k];
  const m = D.resumenes.materias.find(x => x.id === materia) || { nombre: '', apuntes: [] };
  const volver = `<button class="btn lin ch" onclick="verRes(${arg(materia)})">← ${esc(m.nombre) || 'Resúmenes'}</button>`;
  if (!a) return `<div class="fila">${volver}</div><p class="cargando">Cargando el apunte…</p>`;
  const i = m.apuntes.findIndex(x => x.id === apunte), ant = m.apuntes[i - 1], sig = m.apuntes[i + 1];
  const q = V.quiz[k] = V.quiz[k] || {};
  const cerradas = a.preguntas.filter(p => p.tipo !== 'abierta'), hechas = cerradas.filter(p => q[p.n] != null), bien = hechas.filter(p => q[p.n] === p.correcta);
  const pregunta = (p, j) => {
    const r = q[p.n], ya = r != null;
    if (p.tipo === 'abierta') return `<div class="pregunta"><p><b>${j + 1}.</b> ${p.texto}</p><details><summary>Ver respuesta</summary><div class="chico">${p.respuesta}</div></details></div>`;
    const ops = p.tipo === 'vf' ? ['Verdadero', 'Falso'] : p.opciones;
    const correcta = p.tipo === 'vf' ? ops[p.correcta] : LETRAS[p.correcta] + ')';
    return `<div class="pregunta"><p><b>${j + 1}.</b> ${p.tipo === 'vf' ? '<span class="chip">V o F</span> ' : ''}${p.texto}</p>
      <div class="opciones ${p.tipo}">${ops.map((o, x) => `<button class="opcion ${ya ? (x === p.correcta ? 'bien' : x === r ? 'mal' : 'apagada') : ''}" ${ya ? 'aria-disabled="true"' : ''}
        data-f="q${p.n}-${x}" onclick="responder(${arg(k)},${p.n},${x})">${p.tipo === 'opcion' ? `<b>${LETRAS[x]})</b> ` : ''}${p.tipo === 'vf' ? esc(o) : o}</button>`).join('')}</div>
      ${ya ? `<p class="chico devolucion ${r === p.correcta ? 'ok' : 'no'}" role="status"><b>${r === p.correcta ? '✓ ¡Bien!' : '✗ Era ' + correcta}</b> ${p.respuesta}</p>` : ''}</div>`;
  };
  seccionar(a);
  const base = `#resumenes/${esc(materia)}/${esc(apunte)}/`;
  const indice = a.secciones.length > 2 ? `<details class="indice-apunte"><summary>En este apunte <span class="chip">${a.secciones.length} partes</span></summary><ol>
    ${a.secciones.map(x => `<li class="${x.n === 3 ? 'sub' : ''}"><a href="${base}${esc(x.id)}">${esc(x.t)}</a></li>`).join('')}
    ${a.preguntas.length ? `<li><a href="${base}autoevaluacion">Autoevaluación</a></li>` : ''}</ol></details>` : '';
  const leido = !!E.leidos[k];
  const botonLeido = donde => `<button class="btn ${leido ? 'sec' : 'lin'} ch" data-f="leido-${donde}" aria-pressed="${leido}" onclick="marcarLeido(${arg(k)})">${leido ? '✓ Leído' : 'Marcar como leído'}</button>`;
  const clave = a.preguntas.length ? `<section class="solo-imprimir"><h2>Respuestas</h2><ol>${a.preguntas.map(p => `<li>${p.tipo === 'abierta' ? '' : `<b>${p.tipo === 'vf' ? ['Verdadero', 'Falso'][p.correcta] : LETRAS[p.correcta] + ')'}</b> `}${p.respuesta}</li>`).join('')}</ol></section>` : '';
  return `<div class="fila no-imprimir">${volver}<span class="crece"></span>${botonLeido('arriba')}
      <button class="btn lin ch" onclick="imprimir(${arg(k)})" aria-label="Imprimir o guardar como PDF">🖨️</button>
      <button class="btn lin ch" onclick="linkSeccion('',${arg(a.titulo)})">🔗 Compartir</button></div>
    <article class="tarjeta apunte"><p class="solo-imprimir chico">${esc(m.nombre)} · Resúmenes de Cursada (ficha.github.io/cursada)</p><h2>${esc(a.titulo)}</h2>${indice}${a.cuerpoConIds}</article>
    ${a.preguntas.length ? `<div class="titulo-sec" id="autoevaluacion"><h2>Autoevaluación <button class="ancla" onclick="linkSeccion('autoevaluacion','Autoevaluación')" aria-label="Copiar el link a la autoevaluación" title="Copiar el link a esta parte">🔗</button></h2>
      ${cerradas.length ? `<span class="chico">${hechas.length ? `<b>${bien.length} de ${hechas.length}</b> bien` : 'Tocá la opción que te parezca correcta'}${hechas.length ? ` · <button class="enlace" onclick="V.quiz[${arg(k)}]={};render()">Empezar de nuevo</button>` : ''}</span>` : ''}</div>
      <div class="tarjeta">${a.preguntas.map(pregunta).join('')}</div>` : ''}
    ${clave}
    <div class="tarjeta fin-apunte no-imprimir"><span class="crece">${leido ? '¡Listo! Lo tenés marcado como leído.' : '¿Terminaste de leerlo?'}</span>${botonLeido('abajo')}</div>
    <p class="solo-imprimir chico">Apunte de Fidel Chaves, hecho para estudiar: no reemplaza la bibliografía ni las clases. ${esc(urlRes(materia, apunte))}</p>
    <div class="fila no-imprimir" style="margin-top:12px">${ant ? `<button class="btn lin ch" onclick="abrirApunte(${arg(materia)},${arg(ant.id)})">← ${esc(ant.clave)}</button>` : ''}<span class="crece"></span>
      ${sig ? `<button class="btn sec ch" onclick="abrirApunte(${arg(materia)},${arg(sig.id)})">${esc(sig.clave)}: ${esc(sig.t)} →</button>` : ''}</div>`;
}
function irResumenes(materia) { V.tab = 'resumenes'; verRes(materia); }
function responder(k, n, x) { const q = V.quiz[k] = V.quiz[k] || {}; if (q[n] != null) return; q[n] = Number(x); render(); }

// PRÁCTICA: las preguntas de todos los apuntes de una materia, de a diez. Primero las que salieron mal más veces que bien,
// después las que nunca salieron y al final las que ya sabés. Recordar sin mirar (y volver unos días después) es lo que más ayuda a retener.
const RONDA = 10;
async function empezarPractica(materia) {
  if (!RE_ID.test(materia || '')) return;
  await cargarResumenes();
  const m = (D.resumenes.materias || []).find(x => x.id === materia);
  if (!m) return aviso('Esta materia todavía no tiene preguntas');
  cerrar();
  V.tab = 'resumenes'; V.res = { materia, apunte: '', sec: '' }; history.replaceState(null, '', '#' + hashActual());
  V.prac = { materia, cargando: true }; render(); window.scrollTo(0, 0);
  try {
    await Promise.all(m.apuntes.map(async a => {
      const k = materia + '/' + a.id;
      if (!D.apuntes[k]) { const r = await fetch('resumenes/' + k + '.json'); if (!r.ok) throw new Error(); D.apuntes[k] = await r.json(); }
    }));
  } catch (e) { V.prac = null; render(); return aviso('No se pudieron cargar las preguntas'); }
  if (!V.prac || V.prac.materia !== materia) return; // se fue a otro lado mientras cargaba
  medir('practicar', { item_id: materia });
  nuevaRonda();
}
function nuevaRonda() {
  const materia = V.prac.materia, m = D.resumenes.materias.find(x => x.id === materia);
  const todas = m.apuntes.flatMap(a => (D.apuntes[materia + '/' + a.id].preguntas || []).map(p => ({ k: materia + '/' + a.id + '/' + p.n, p, ap: a })));
  const peso = x => {
    const r = E.practica[x.k];
    if (!r) return 1 + Math.random();                         // nunca salió: entre 1 y 2
    const neto = r[1] - r[0];
    return neto > 0 ? 2 + neto + Math.random() : Math.random() * 0.7 + Math.min(diasDesde(r[2]), 30) / 100; // mal: arriba; sabida: abajo
  };
  V.prac = { materia, cola: todas.map(x => [peso(x), x]).sort((a, b) => b[0] - a[0]).slice(0, RONDA).map(x => x[1]), i: 0, r: null, bien: 0 };
  render(); window.scrollTo(0, 0);
}
function anotarPrac(k, bien) {
  const r = E.practica[k] || [0, 0, hoy()];
  r[bien ? 0 : 1]++; r[2] = hoy(); E.practica[k] = r;
  if (bien) V.prac.bien++;
  guardar(true);
}
function responderPrac(x) { const P = V.prac, it = P.cola[P.i]; if (P.r != null) return; P.r = Number(x); anotarPrac(it.k, P.r === it.p.correcta); render(); }
function verRespPrac() { V.prac.r = 'ver'; render(); }
function autoPrac(sabia) { if (V.prac.r !== 'ver') return; anotarPrac(V.prac.cola[V.prac.i].k, sabia); siguientePrac(); }
function siguientePrac() { V.prac.i++; V.prac.r = null; render(); }
function vPractica() {
  const P = V.prac, m = (D.resumenes.materias || []).find(x => x.id === P.materia) || { nombre: '' };
  const volver = `<div class="fila"><button class="btn lin ch" onclick="V.prac=null;render()">← ${esc(m.nombre)}</button>`;
  if (P.cargando) return volver + '</div><p class="cargando">Juntando las preguntas…</p>';
  if (P.i >= P.cola.length) {
    const mal = P.cola.length - P.bien;
    return volver + `</div><div class="tarjeta practica"><h2>${P.bien} de ${P.cola.length} bien</h2>
      <p>${mal ? (mal === 1 ? 'La que fallaste vuelve' : 'Las ' + mal + ' que fallaste vuelven') + ' primero en la próxima ronda.' : '¡Todas bien! La próxima ronda trae preguntas que todavía no practicaste.'}</p>
      <p class="chico tenue">Practicar sin mirar el apunte, y volver a hacerlo unos días después, es lo que más ayuda a retener. Si cargás la fecha del parcial en Mi carrera, en el Calendario te sugiero cuándo repasar.</p>
      <div class="botones"><button class="btn" onclick="nuevaRonda()">Otra ronda</button><button class="btn lin" onclick="V.prac=null;render()">Volver a la materia</button></div></div>`;
  }
  const it = P.cola[P.i], p = it.p, r = P.r;
  let cuerpo;
  if (p.tipo === 'abierta') {
    cuerpo = r == null ? `<p class="chico tenue">Pensá la respuesta (o escribila en un papel) y después mirala.</p><div class="botones"><button class="btn" data-f="pq-ver" onclick="verRespPrac()">Ver la respuesta</button></div>`
      : `<div class="devolucion chico">${p.respuesta}</div><p class="chico" style="margin:12px 0 0"><b>¿La sabías?</b></p>
        <div class="botones"><button class="btn sec" data-f="pq-si" onclick="autoPrac(true)">Sí, la sabía</button><button class="btn lin" data-f="pq-no" onclick="autoPrac(false)">No, o más o menos</button></div>`;
  } else {
    const ops = p.tipo === 'vf' ? ['Verdadero', 'Falso'] : p.opciones, ya = r != null;
    const correcta = p.tipo === 'vf' ? ops[p.correcta] : LETRAS[p.correcta] + ')';
    cuerpo = `<div class="opciones ${p.tipo}">${ops.map((o, x) => `<button class="opcion ${ya ? (x === p.correcta ? 'bien' : x === r ? 'mal' : 'apagada') : ''}" ${ya ? 'aria-disabled="true"' : ''}
        data-f="pq-${P.i}-${x}" onclick="responderPrac(${x})">${p.tipo === 'opcion' ? `<b>${LETRAS[x]})</b> ` : ''}${p.tipo === 'vf' ? esc(o) : o}</button>`).join('')}</div>
      ${ya ? `<p class="chico devolucion ${r === p.correcta ? 'ok' : 'no'}" role="status"><b>${r === p.correcta ? '✓ ¡Bien!' : '✗ Era ' + correcta}</b> ${p.respuesta}</p>
        <div class="botones"><button class="btn" data-f="pq-sig" onclick="siguientePrac()">${P.i + 1 < P.cola.length ? 'Siguiente' : 'Ver cómo me fue'}</button></div>` : ''}`;
  }
  return volver + `<span class="crece"></span><span class="chico tenue">Pregunta ${P.i + 1} de ${P.cola.length}</span></div>
    <div class="barra" aria-hidden="true" style="margin:8px 0 12px"><i style="width:${Math.round(P.i * 100 / P.cola.length)}%"></i></div>
    <div class="tarjeta practica"><p class="chico tenue" style="margin:0 0 6px">${esc(it.ap.clave)} · ${esc(it.ap.t)}</p>
    <p class="enunciado">${p.tipo === 'vf' ? '<span class="chip">V o F</span> ' : ''}${p.texto}</p>${cuerpo}</div>`;
}

// =====================================================================
// BIBLIOTECA: libros recomendados para editar (datos/biblioteca.json; tapas en biblioteca/)
// =====================================================================
async function cargarBiblioteca() {
  if (D.biblioteca || cargarBiblioteca.va) return;
  cargarBiblioteca.va = true;
  try { D.biblioteca = await json('biblioteca.json'); } catch (e) { D.biblioteca = { libros: [], temas: [], error: true }; }
  if (V.tab === 'biblioteca') render();
}
// Tapa: la imagen guardada, o una tapa tipográfica si no hay (o si la imagen no carga).
const tapa = (l, grande) => `<div class="tapa ${grande ? 'grande' : ''}" style="--tono:${COLORES[(l.t.length + l.autor.length) % COLORES.length]}">
  <span class="tapa-texto"><b>${esc(l.t)}</b><small>${esc(l.autor)}</small></span>
  ${l.sinTapa ? '' : `<img src="biblioteca/${esc(l.id)}.jpg" alt="" loading="lazy" onerror="this.remove()">`}</div>`;
function vBiblioteca() {
  if (!D.biblioteca) { cargarBiblioteca(); return '<p class="cargando">Cargando la biblioteca…</p>'; }
  const B = D.biblioteca;
  if (!B.libros.length) return '<p class="vacio">No se pudo cargar la biblioteca. Probá recargar la página.</p>';
  const L = B.libros.filter(l => !V.tema || l.tema === V.tema);
  return `<p class="chico tenue" style="margin-top:0">${esc(B.nota)} Tocá una tapa para ver la ficha.</p>
    <div class="eligen" role="group" aria-label="Filtrar por tema" style="margin-bottom:14px">${[''].concat(B.temas).map(t => `<button class="btn ${V.tema === t ? '' : 'lin'} ch" aria-pressed="${V.tema === t}" data-f="tema-${esc(t)}" onclick="V.tema=${arg(t)};render()">${t ? esc(t) : 'Todos'}</button>`).join('')}</div>
    <div class="estante">
      <button class="libro sumar" onclick="sugerirLibro()"><span class="tapa"><span>¿Falta algún libro para recomendar?<b>Avisame.</b></span></span></button>
      ${L.map(l => `<button class="libro" onclick="abrirLibro(${arg(l.id)})" aria-label="${esc(l.t)}, de ${esc(l.autor)}: ver ficha">${tapa(l)}
        <span class="libro-t">${esc(l.t)}</span><span class="libro-a">${esc(l.autor)}</span></button>`).join('')}</div>`;
}
function abrirLibro(id) {
  const l = (D.biblioteca.libros || []).find(x => x.id === id);
  if (!l) return;
  const dato = (t, v) => v ? `<dt>${t}</dt><dd>${esc(v)}</dd>` : '';
  abrir(cab(esc(l.t)) + `<div class="ficha-libro">${tapa(l, true)}<div class="crece">
      ${l.subtitulo ? `<p style="margin:0 0 6px;font-style:italic">${esc(l.subtitulo)}</p>` : ''}
      <p style="margin:0 0 8px"><b>${esc(l.autor)}</b></p><span class="chip tin">${esc(l.tema)}</span>
      <dl class="datos-libro">${dato('Editorial', l.editorial)}${dato('Año de la edición', l.anio)}${dato('Páginas', l.paginas)}${dato('ISBN', l.isbn)}</dl></div></div>
    <p>${esc(l.sinopsis)}</p>
    ${l.link ? `<p><a href="${esc(l.link.url)}" target="_blank" rel="noopener">${esc(l.link.t)} ↗</a></p>` : ''}
    <div class="botones"><button class="btn" onclick="cerrar()">Listo</button></div>`, 'l:' + id);
}
function sugerirLibro() {
  idea({ titulo: '📚 Recomendar un libro', intro: '¿Qué libro sumarías a la biblioteca? Contame el título, quién lo escribió y por qué sirve para editar.',
    ejemplo: 'Ej.: “Manual de edición”, de tal autora: lo usé para…', prefijo: '[Biblioteca] ' });
}

// =====================================================================
// ESCANDALLO: simulador (las cuentas están en escandallo.js)
// =====================================================================
// Los simuladores, por materia (el orden de la pestaña sale de acá).
const SIMULADORES = [
  { id: 'papel', materia: '0905', ico: '📄', t: 'Cálculo de papel e imposición', d: 'Pliegos, resmas, kilos y costo de los interiores o de la tapa, con pinza, cola, calles e imposición. Compara los formatos de pliego.' },
  { id: 'escandallo', materia: '0909', ico: '🧮', t: 'Escandallo de un título', d: 'Si el precio de un libro es viable: del PVP al margen de contribución, con los puntos de equilibrio.' },
  { id: 'comparador', materia: '0909', ico: '⚖️', t: 'Comparador de títulos', d: 'Qué hacer con cada título del catálogo: dejarlo, bajarle costos, empujarlo o discontinuarlo.' }
];
// Explicaciones mínimas de cada concepto, según la cátedra de Administración de la Empresa Editorial.
const AYUDA = {
  pvp: 'Precio de venta al público. Lo fija el editor entre un piso (que cubra los costos) y un techo (lo que el mercado está dispuesto a pagar). El escandallo arranca acá.',
  tirada: 'Cantidad de ejemplares que se imprimen. El costo producto total se divide por la tirada para obtener el CPU.',
  modo: 'Cómo sabés lo que cuesta cada ejemplar: si ya tenés el CPU, si tenés los totales de una impresión offset o si es impresión por demanda.',
  cpu: 'Costo producto unitario: lo que cuesta producir cada ejemplar. CPU = CPT ÷ tirada.',
  preproduccion: 'Costos fijos del título, que no dependen de la tirada: corrección, diseño de tapa, traducción, armado de interiores, prólogo.',
  industrial: 'Costos variables, que dependen de la cantidad de ejemplares: imprenta, encuadernación, retractilado, fajas.',
  cpt: 'Costo producto total: preproducción + industriales. Son los costos directos de producir el título.',
  demanda: 'En la impresión por demanda se presupuesta cada ejemplar: interior (en pliegos A3) + tapa + encuadernado.',
  paginas: 'Cantidad de páginas del libro. Se divide por las páginas que entran en un pliego para saber cuántos pliegos lleva el interior.',
  porPliego: 'Cuántas páginas entran en un pliego A3: 8 en formato 14 × 21 cm; 4 en 15 × 22 cm o A4.',
  precioPliego: 'Lo que cuesta imprimir un pliego A3 del interior.',
  tapasPorPliego: 'Cuántas tapas entran en un pliego A3: 2 en 14 × 21 cm; 1 si llevan solapas, o en 15 × 22 cm y A4.',
  precioTapa: 'Lo que cuesta un pliego A3 de tapa (a color, en ilustración de 350 g). El costo de cada tapa depende de cuántas entran.',
  encuadernado: 'Precio fijo por ejemplar.',
  descuento: 'Lo que se queda la librería o el distribuidor por vender el libro: un porcentaje del PVP.',
  canales: 'Si vendés por varios canales, el descuento promedio ponderado es la suma, canal por canal, de descuento × participación ÷ 100.',
  plazo: 'Días que pasan entre que el canal vende el libro y la editorial lo cobra. Se pondera igual que el descuento.',
  inu: 'Ingreso neto unitario: lo que le llega a la editorial por cada libro. INU = PVP − descuento comercial.',
  invendibles: 'Previsión por libros que no se van a vender, por obsoletos o deteriorados. Se calcula sobre el CPU.',
  derechos: 'Lo que cobra el autor por cada ejemplar vendido, por lo general entre 8 y 15 % del PVP. Las obras de dominio público no pagan.',
  incobrables: 'Previsión por libros vendidos y facturados que nunca se cobran. Se calcula sobre el INU.',
  comisiones: 'Lo que cobran los vendedores por cada venta, además del sueldo. Se calcula sobre el INU.',
  flete: 'Flete o depósito contratado para este título (si son propios, van en el costo de estructura). Se calcula sobre el INU.',
  publicidad: 'Campaña de este título en particular (la publicidad institucional va en estructura). Se calcula sobre el INU.',
  gastos: 'Gastos comerciales: costos directos que aparecen al distribuir y vender el libro. Si el libro no se vendiera, no existirían.',
  cdu: 'Costo directo unitario: CPU + gastos comerciales. Lo que cuesta, en total, cada ejemplar.',
  mcu: 'Margen de contribución unitario: lo que queda del INU después de pagar el libro. MCU = INU − CDU. Con eso se paga la estructura.',
  mcuPct: 'MCU ÷ INU: qué parte de lo que entra por cada libro queda como margen. Con menos de 25 o 30 %, por lo general no conviene publicar.',
  cdt: 'Costo directo total: CDU × tirada.',
  ce: 'Costo de estructura: sueldos, alquiler, servicios… lo que no se puede atribuir a un título. Poné la parte que tiene que cubrir este libro (por ejemplo, la de un mes).',
  cgt: 'Costo global total: CDT + CE. Todos los costos de editar el libro.',
  marginal: 'Lo que cuesta producir un ejemplar más: es igual al CDU. Sube el CDT, pero no el costo de estructura.',
  peEstructura: 'Punto de equilibrio: cuántos libros hay que vender para que el margen pague la estructura. CE ÷ MCU.',
  peEdicion: 'Cuántos libros hay que vender para recuperar lo que costó la edición. CDT ÷ INU.',
  peAbsorcion: 'Cuántos libros hay que vender para cubrir todo, edición y estructura. (CE + CDT) ÷ INU.',
  cmpMct: 'Margen de contribución total: MCU × Q. Lo que aporta el título, en pesos, para pagar la estructura y dejar ganancia. Dice si el título se vende.',
  cmpMctPct: 'MCT% = MCT ÷ INT (es igual al MCU%). Cuánto de lo que ingresa por el título queda como margen. Dice si el título es rentable.',
  cmpIng: 'Ingreso neto total (INT) de cada título = INU × Q. El ingreso neto global (ING) es la suma de todos.',
  cmpMcg: 'Margen de contribución global: la suma de los MCT de todos los títulos. Es lo que la editorial tiene para pagar su estructura (CE) y ganar.',
  cmpProm: 'Los dos promedios que dividen el cuadro: MCTp = MCG ÷ cantidad de títulos y MCT%p = MCG ÷ ING. Un título es A si su MCT está por encima del promedio (C si no) y B si su MCT% lo está (D si no).',
  cmpPe: 'Punto de equilibrio para varios títulos, suponiendo que se mantiene la mezcla de ventas estimada: el ingreso neto necesario (CE + ganancia) se divide por el MCT%p, y se reparte entre los títulos según su peso en el ING.'
};
const escS = () => (E.escandallo = E.escandallo || JSON.parse(JSON.stringify(Escandallo.EJEMPLO)));
// "?" al lado de cada concepto: muestra u oculta su explicación (data-ay une el botón con su texto).
const ay = k => `<button type="button" class="ayuda-q" aria-expanded="${V.ayuda[k] ? 'true' : 'false'}" aria-label="Qué es esto" data-f="ay-${k}" onclick="verAyuda(${arg(k)})">?</button>`;
const exp = k => `<span class="explica" data-ay="${k}" ${V.ayuda[k] ? '' : 'hidden'}>${esc(AYUDA[k])}</span>`;
function verAyuda(k) {
  V.ayuda[k] = !V.ayuda[k];
  document.querySelectorAll(`[data-ay="${CSS.escape(k)}"]`).forEach(el => { el.hidden = !V.ayuda[k]; });
  document.querySelectorAll(`[data-f="ay-${CSS.escape(k)}"]`).forEach(el => el.setAttribute('aria-expanded', V.ayuda[k] ? 'true' : 'false'));
}
const campoEsc = (k, t, suf, ph) => `<div class="campo-esc"><label class="c" for="esc-${k}">${t} ${ay(k)}</label>${exp(k)}
  <div class="con-unidad">${suf === '$' ? '<span>$</span>' : ''}<input id="esc-${k}" inputmode="decimal" autocomplete="off" value="${esc(escS()[k] || '')}" placeholder="${esc(ph || '')}" oninput="setEsc(${arg(k)},this.value)">${suf && suf !== '$' ? `<span>${suf}</span>` : ''}</div></div>`;
const $$ = v => { const r = Math.round(v * 100) / 100, d = Number.isInteger(r) ? 0 : 2; return (r < 0 ? '−$ ' : '$ ') + Math.abs(r).toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d }); };
const n2 = (v, d) => v.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: d == null ? 2 : d });

function vEscandalloUno() {
  const s = escS();
  const modo = (id, t) => `<label class="elige ${s.modo === id ? 'on' : ''}"><input type="radio" name="esc-modo" data-f="modo-${id}" ${s.modo === id ? 'checked' : ''} onchange="setEsc('modo',${arg(id)},true)"><span>${t}</span></label>`;
  return `<p class="chico tenue" style="margin-top:0">El escandallo dice si el precio de un libro es viable: del PVP se descuenta lo que se queda el canal y lo que cuesta el libro, y lo que sobra (el margen de contribución) tiene que pagar la estructura de la editorial. Tocá <b>?</b> al lado de cada concepto para ver qué es. Basado en la cátedra de Administración de la Empresa Editorial; tus cifras se guardan en este navegador.</p>
    <div class="fila" style="margin-bottom:10px"><button class="btn sec ch" onclick="ejemploEsc()">Cargar el ejemplo de la clase</button><button class="btn lin ch" onclick="vaciarEsc()">Vaciar</button></div>
    <div class="esc">
    <div class="esc-datos">
      <div class="tarjeta"><h3>1. El libro</h3><div class="dos">${campoEsc('pvp', 'Precio de venta al público (PVP)', '$')}${campoEsc('tirada', 'Tirada', 'ejemplares')}</div></div>
      <div class="tarjeta"><h3>2. Lo que cuesta cada ejemplar ${ay('modo')}</h3>${exp('modo')}
        <div class="eligen" style="margin-top:8px">${modo('cpu', 'Ya sé el CPU')}${modo('offset', 'Offset: tengo los costos totales')}${modo('demanda', 'Impresión por demanda')}</div>
        ${s.modo === 'cpu' ? campoEsc('cpu', 'Costo producto unitario (CPU)', '$')
          : s.modo === 'offset' ? `<div class="dos">${campoEsc('preproduccion', 'Costos de preproducción (totales)', '$')}${campoEsc('industrial', 'Costos industriales (totales)', '$')}</div>`
          : `<p class="chico tenue" style="margin:8px 0 0">${esc(AYUDA.demanda)}</p><div class="dos">${campoEsc('paginas', 'Páginas del libro', 'págs.')}${campoEsc('porPliego', 'Páginas por pliego A3', 'págs.', '8')}
            ${campoEsc('precioPliego', 'Precio del pliego A3 (interior)', '$')}${campoEsc('tapasPorPliego', 'Tapas por pliego A3', 'tapas', '2')}
            ${campoEsc('precioTapa', 'Precio del pliego A3 (tapa)', '$')}${campoEsc('encuadernado', 'Encuadernado por ejemplar', '$')}</div>`}</div>
      <div class="tarjeta"><h3>3. Lo que se queda el canal</h3>
        <label class="chico"><input type="checkbox" data-f="usar-canales" style="min-height:0" ${s.usarCanales ? 'checked' : ''} onchange="setEsc('usarCanales',this.checked,true)"> Vendo por varios canales (promedio ponderado) ${ay('canales')}</label>${exp('canales')}
        ${s.usarCanales ? vCanales(s) : campoEsc('descuento', 'Descuento comercial', '% del PVP')}</div>
      <div class="tarjeta"><h3>4. Gastos comerciales ${ay('gastos')}</h3>${exp('gastos')}<div class="dos">
        ${campoEsc('invendibles', 'Invendibles', '% del CPU')}${campoEsc('derechos', 'Derechos de autor', '% del PVP')}
        ${campoEsc('incobrables', 'Incobrables', '% del INU')}${campoEsc('comisiones', 'Comisión de vendedores', '% del INU')}
        ${campoEsc('flete', 'Flete y depósito', '% del INU')}${campoEsc('publicidad', 'Publicidad y marketing', '% del INU')}</div></div>
      <div class="tarjeta"><h3>5. La estructura (opcional)</h3>${campoEsc('ce', 'Costo de estructura que tiene que cubrir este libro', '$')}
        <p class="chico tenue" style="margin:6px 0 0">Con este dato calculo el costo global y los puntos de equilibrio.</p></div>
    </div>
    <div class="esc-res" id="esc-res" aria-live="polite">${escResultado()}</div></div>`;
}
// ---------- Comparador de títulos ----------
const cmpS = () => (E.comparador = E.comparador || JSON.parse(JSON.stringify(Escandallo.EJEMPLO_COMPARADOR)));
// ---------- Pestaña Simuladores: una tarjeta por simulador, agrupadas por materia ----------
function vSimuladores() {
  const sim = SIMULADORES.find(x => x.id === V.sim);
  const plan = id => D.plan.materias.find(x => x.id === id) || { id, nombre: id, sigla: '' };
  if (sim) {
    const p = plan(sim.materia);
    return `<div class="fila"><button class="btn lin ch" onclick="irSim('')">← Todos los simuladores</button><span class="crece"></span></div>
      <div class="titulo-sec"><h2>${esc(sim.t)}</h2><span class="chico tenue">${esc(p.nombre)}</span></div>` + { escandallo: vEscandalloUno, comparador: vComparador, papel: vPapel }[sim.id]();
  }
  const est = id => (E.materias[id] || {}).estado, marca = id => est(id) === 'cursando' ? '<span class="chip">la cursás</span>' : est(id) === 'regular' ? '<span class="chip">te falta el final</span>' : '';
  const materias = [...new Set(SIMULADORES.map(x => x.materia))].sort();
  return `<p class="chico tenue" style="margin-top:0">Calculadoras para las materias que piden hacer cuentas. Cada una está basada en lo que enseña su cátedra, y tus cifras se guardan solo en este navegador.</p>` +
    materias.map(id => {
      const p = plan(id);
      return `<div class="titulo-sec"><h2>${esc(p.nombre)}</h2></div>
        <div class="res-grilla">${SIMULADORES.filter(x => x.materia === id).map(x => `<button class="res-mat" onclick="irSim(${arg(x.id)})"><span class="fila"><span class="clave">${esc(p.sigla)}</span><span class="crece"></span>${marca(id)}</span>
          <b>${x.ico} ${esc(x.t)}</b><span class="chico tenue">${esc(x.d)}</span></button>`).join('')}</div>`;
    }).join('');
}
function irSim(id) {
  V.tab = 'simuladores'; V.sim = id; history.replaceState(null, '', '#' + hashActual()); render(); window.scrollTo(0, 0);
  if (id) medir('select_content', { content_type: 'simulador', item_id: id });
}
function vComparador() {
  const c = cmpS();
  const cel = (i, k, t, ph) => `<td><input data-f="cmp${i}${k}" ${k === 't' ? '' : 'inputmode="decimal"'} aria-label="${t} del título ${i + 1}" value="${esc(c.titulos[i][k])}" placeholder="${esc(ph || '')}" oninput="setCmp(${i},${arg(k)},this.value)"></td>`;
  const filas = c.titulos.map((t, i) => `<tr>${cel(i, 't', 'Nombre', 'Título')}${cel(i, 'pvp', 'PVP')}${cel(i, 'desc', 'Descuento')}${cel(i, 'inu', 'INU')}${cel(i, 'cdu', 'CDU')}${cel(i, 'q', 'Ventas estimadas')}
    <td><button class="btn lin ch" aria-label="Quitar el título ${i + 1}" onclick="quitarCmp(${i})">✕</button></td></tr>`).join('');
  return `<p class="chico tenue" style="margin-top:0">Compará varios títulos para decidir qué hacer con cada uno: cuál dejar como está, a cuál bajarle los costos, en cuál invertir más en marketing y cuál discontinuar. Cargá para cada uno el <b>INU</b> (o el PVP y el descuento), el <b>CDU</b> y las <b>ventas estimadas</b>; el INU y el CDU salen del escandallo de cada libro. Método de Maradei (<i>Administración editorial: herramientas útiles</i>, cap. 5). Tus cifras se guardan en este navegador.</p>
    <div class="fila" style="margin-bottom:10px"><button class="btn sec ch" onclick="ejemploCmp()">Cargar el ejemplo del libro</button><button class="btn sec ch" onclick="traerCmp()">Traer el libro del simulador</button><button class="btn lin ch" onclick="vaciarCmp()">Vaciar</button></div>
    <div class="tarjeta"><h3>Los títulos</h3><div class="tabla-scroll"><table class="tabla canales"><thead><tr><th>Título</th><th>PVP $</th><th>Desc. %</th><th>INU $</th><th>CDU $</th><th>Ventas (Q)</th><th><span class="solo-lector">Quitar</span></th></tr></thead><tbody>${filas}</tbody></table></div>
      <p class="chico tenue" style="margin:6px 0 0">Si cargás el INU, se usa ese; si no, se calcula como PVP − descuento. <button class="btn lin ch" onclick="sumarCmp()">＋ Título</button></p>
      <div class="dos">${campoCmp('ce', 'Costo de estructura (CE) para el punto de equilibrio', '$')}${campoCmp('ganancia', 'Ganancia buscada', '$')}</div></div>
    <div id="cmp-res" aria-live="polite">${cmpResultado()}</div>`;
}
const campoCmp = (k, t, suf) => `<div class="campo-esc"><label class="c" for="cmp-${k}">${t}</label><div class="con-unidad"><span>${suf}</span><input id="cmp-${k}" inputmode="decimal" autocomplete="off" value="${esc(cmpS()[k] || '')}" oninput="setCmpG(${arg(k)},this.value)"></div></div>`;
function cmpResultado() {
  const c = cmpS(), r = Escandallo.comparar(c.titulos, c);
  if (r.titulos.length < 2 || r.ing <= 0) return '<div class="tarjeta"><p class="vacio" style="padding:10px">Cargá al menos dos títulos con INU, CDU y ventas.</p></div>';
  const pc = (v, d) => n2(v * 100, d == null ? 1 : d) + ' %', lib = v => n2(Math.ceil(v - 1e-9), 0);
  const dato = (b, t, k) => `<div class="dato"><b>${b}</b><span>${t} ${ay(k)}</span>${exp(k)}</div>`;
  const grupos = ['AB', 'AD', 'CB', 'CD'].map(q => {
    const L = r.titulos.filter(x => x.cuadrante === q), a = Escandallo.ACCIONES[q];
    return `<div class="tarjeta" style="border-left:5px solid var(--${a.tono})"><div class="fila"><b class="crece">${a.accion}</b><span class="chip ${a.tono}">${q}</span></div>
      <p class="chico" style="margin:4px 0">${L.length ? L.map(x => `<b>${esc(x.t)}</b>`).join(', ') : '<span class="tenue">Ninguno</span>'}</p><p class="chico tenue" style="margin:0">${a.texto}</p></div>`;
  }).join('');
  let pe = '';
  if (r.pe && (Escandallo.n(c.ce) > 0 || Escandallo.n(c.ganancia) > 0)) {
    const P = r.pe, tb = z => `<tr><th scope="row">Título</th>${r.titulos.map(x => `<th>${esc(x.t)}</th>`).join('')}<th>Total</th></tr>
      <tr><th scope="row">Libros</th>${z.porTitulo.map(x => `<td>${lib(x.libros)}</td>`).join('')}<td><b>${lib(z.libros)}</b></td></tr>
      <tr><th scope="row">Ingreso neto</th>${z.porTitulo.map(x => `<td>${$$(x.dinero)}</td>`).join('')}<td><b>${$$(z.dinero)}</b></td></tr>`;
    const bloque = (t, z, nota) => `<h4 style="margin:14px 0 4px">${t}</h4><p class="chico tenue" style="margin:0 0 4px">${nota}${z.factor > 1 ? ' <span class="chip mal">más que las ventas estimadas</span>' : ''}</p><div class="tabla-scroll"><table class="tabla">${tb(z)}</table></div>`;
    pe = `<div class="tarjeta"><h3>Puntos de equilibrio de los ${r.titulos.length} títulos ${ay('cmpPe')}</h3>${exp('cmpPe')}
      <p class="chico tenue" style="margin:0">Se mantiene la mezcla de ventas estimada. Ingreso neto promedio por libro: ${$$(P.inuPromedio)} · margen por libro: ${$$(P.mcuPromedio)}.</p>
      ${P.costeoDirecto ? bloque('Costeo directo: pagar la estructura y la ganancia', P.costeoDirecto, `(CE + ganancia) ÷ MCT%p = ${$$(P.necesario)} ÷ ${pc(r.mctPctP, 2)}`)
        : '<p class="chico alerta">El margen global es cero o negativo: ningún volumen paga la estructura.</p>'}
      ${bloque('Solo recuperar la edición', P.edicion, `Costo directo total de los títulos: ${$$(P.cdt)}`)}
      ${bloque('Costeo por absorción: estructura, edición y ganancia', P.absorcion, `CE + CDT + ganancia = ${$$(Escandallo.n(c.ce) + P.cdt + Escandallo.n(c.ganancia))} (con las tiradas ya impresas)`)}
      <h4 style="margin:14px 0 4px">Distribución del ingreso (con las ventas estimadas)</h4>
      <p class="chico" style="margin:0">Ingreso neto global ${$$(P.distribucion.ing)} = costo directo ${$$(P.distribucion.cdt)} + estructura ${$$(P.distribucion.ce)} + <b>${P.distribucion.resultado >= 0 ? 'ganancia' : 'pérdida'} ${$$(Math.abs(P.distribucion.resultado))}</b>.</p></div>`;
  }
  return `<div class="tarjeta"><h3>El panorama</h3><div class="resumen">
      ${dato($$(r.ing), 'Ingreso neto global (ING)', 'cmpIng')}${dato($$(r.mcg), 'Margen de contribución global (MCG)', 'cmpMcg')}
      ${dato(pc(r.mctPctP), 'MCT%p (promedio)', 'cmpProm')}${dato($$(r.mctP), 'MCTp (promedio por título)', 'cmpProm')}</div></div>
    <div class="titulo-sec"><h2>Qué hacer con cada título</h2></div><div class="esc-grupos">${grupos}</div>
    <div class="tarjeta"><h3>Los números de cada título</h3><div class="tabla-scroll"><table class="tabla"><thead><tr><th>Título</th><th>Q</th><th>INU</th><th>MCU</th><th>INT ${ay('cmpIng')}</th><th>MCT ${ay('cmpMct')}</th><th>MCT% ${ay('cmpMctPct')}</th><th>% del ING</th><th>% del MCG</th><th>Cuadrante</th></tr></thead><tbody>
      ${r.titulos.map(x => `<tr><td><b>${esc(x.t)}</b></td><td>${n2(x.q, 0)}</td><td>${$$(x.inu)}</td><td>${$$(x.mcu)}</td><td>${$$(x.int)}</td><td>${$$(x.mct)}</td><td>${pc(x.mctPct)}</td><td>${pc(x.partIng)}</td><td>${pc(x.partMcg, 2)}</td><td><span class="chip ${x.tono}">${x.cuadrante}</span></td></tr>`).join('')}
      <tr><td><b>Total</b></td><td>${n2(r.qTot, 0)}</td><td></td><td></td><td><b>${$$(r.ing)}</b></td><td><b>${$$(r.mcg)}</b></td><td><b>${pc(r.mctPctP)}</b></td><td>100 %</td><td>100 %</td><td></td></tr></tbody></table></div>
      <p class="chico tenue" style="margin:8px 0 0">A: MCT por encima del promedio (${$$(r.mctP)}) · C: por debajo · B: MCT% por encima del promedio (${pc(r.mctPctP)}) · D: por debajo. ${ay('cmpProm')}</p>${exp('cmpProm')}</div>
    ${pe}`;
}
let cmpT;
const guardarCmp = () => { clearTimeout(cmpT); cmpT = setTimeout(guardar, 300); };
function setCmp(i, k, v) { const t = cmpS().titulos[i]; if (!t) return; t[k] = v; guardarCmp(); $('#cmp-res').innerHTML = cmpResultado(); }
function setCmpG(k, v) { cmpS()[k] = v; guardarCmp(); $('#cmp-res').innerHTML = cmpResultado(); }
const tituloVacio = () => ({ t: '', pvp: '', desc: '', inu: '', cdu: '', q: '' });
function sumarCmp() { const L = cmpS().titulos; if (L.length >= 20) return aviso('Hasta 20 títulos'); L.push(tituloVacio()); guardar(); render(); }
function quitarCmp(i) { cmpS().titulos.splice(i, 1); guardar(); render(); }
function ejemploCmp() { E.comparador = JSON.parse(JSON.stringify(Escandallo.EJEMPLO_COMPARADOR)); guardar(); render(); aviso('Ejemplo del libro cargado'); }
function vaciarCmp() { E.comparador = { ce: '', ganancia: '', titulos: [tituloVacio(), tituloVacio()] }; guardar(); render(); }
// Suma al comparador el libro que está en el simulador (su INU, su CDU y la tirada como ventas estimadas).
function traerCmp() {
  const r = Escandallo.calcular(escS());
  if (!r.inu || !r.tirada) return aviso('Completá el PVP y la tirada en el simulador');
  const L = cmpS().titulos;
  const f = v => String(Math.round(v * 100) / 100).replace('.', ','), t = { t: 'Libro del simulador', pvp: '', desc: '', inu: f(r.inu), cdu: f(r.cdu), q: String(r.tirada) };
  const vacio = L.findIndex(x => !x.inu && !x.cdu && !x.q);
  if (vacio >= 0) L[vacio] = t; else if (L.length >= 20) return aviso('Hasta 20 títulos'); else L.push(t);
  guardar(); render(); aviso('Libro del simulador agregado');
}

function vCanales(s) {
  return `<table class="tabla canales"><thead><tr><th>Canal</th><th>Descuento %</th><th>Participación %</th><th>Plazo de cobro (días) ${ay('plazo')}</th><th><span class="solo-lector">Quitar</span></th></tr></thead><tbody>
    ${s.canales.map((c, i) => `<tr><td><input data-f="c${i}t" aria-label="Canal ${i + 1}" value="${esc(c.t)}" oninput="setCanal(${i},'t',this.value)"></td>
      ${['desc', 'part', 'plazo'].map(k => `<td><input data-f="c${i}${k}" inputmode="decimal" aria-label="${{ desc: 'Descuento', part: 'Participación', plazo: 'Plazo de cobro' }[k]} del canal ${i + 1}" value="${esc(c[k])}" oninput="setCanal(${i},${arg(k)},this.value)"></td>`).join('')}
      <td><button class="btn lin ch" aria-label="Quitar el canal ${i + 1}" onclick="quitarCanal(${i})">✕</button></td></tr>`).join('')}</tbody></table>
    ${exp('plazo')}<button class="btn lin ch" style="margin-top:6px" onclick="sumarCanal()">＋ Canal</button>`;
}
function escResultado() {
  const s = escS(), r = Escandallo.calcular(s);
  if (!r.pvp || !r.tirada) return '<div class="tarjeta"><p class="vacio" style="padding:10px">Completá al menos el PVP y la tirada.</p></div>';
  const fila = (k, t, v, cls) => `<tr class="${cls || ''}"><th scope="row">${t} ${k ? ay(k) : ''}${k ? exp(k) : ''}</th><td>${v}</td></tr>`;
  const g = r.gastos, ch = r.canales;
  const pct = Math.round(r.mcuPct * 10000) / 100, nivel = r.mcu <= 0 ? 'mal' : pct < 25 ? 'mal' : pct < 30 ? 'ojo' : 'ok';
  // Los umbrales de 25 y 30 % son el criterio de la cátedra de Administración de la Empresa Editorial, no una regla general.
  const veredicto = { ok: 'Viable: el margen supera el 30 % (criterio de la cátedra).', ojo: 'En el límite: el margen está entre 25 y 30 % (criterio de la cátedra).', mal: r.mcu <= 0 ? 'No cierra: el libro cuesta más de lo que ingresa.' : 'No conviene: el margen es menor que el 25 % (criterio de la cátedra).' }[nivel];
  const pe = (k, t, v) => `<div class="dato"><b>${v == null ? '—' : n2(Math.ceil(v - 1e-9), 0)}</b><span>${t} ${ay(k)}</span>${exp(k)}${v != null && v > r.tirada ? '<span class="chip mal">más que la tirada</span>' : ''}</div>`;
  return `<div class="tarjeta"><h3>El escandallo</h3>
    ${ch ? `<p class="chico ${Math.abs(ch.part - 100) > 0.001 ? 'alerta' : 'tenue'}" style="margin:4px 0 8px">Descuento promedio ponderado: <b>${n2(ch.desc)} %</b> · plazo de cobro promedio: <b>${n2(ch.plazo, 1)} días</b>${Math.abs(ch.part - 100) > 0.001 ? ` · ⚠ las participaciones suman ${n2(ch.part)} %, no 100 %` : ''}</p>` : ''}
    ${r.dem ? `<p class="chico tenue" style="margin:4px 0 8px">Por ejemplar: interior ${n2(r.dem.pliegos)} pliegos = ${$$(r.dem.interior)}, tapa ${$$(r.dem.tapa)} y encuadernado ${$$(r.dem.encuadernado)} → ${$$(r.dem.unitario)}.</p>` : ''}
    <table class="escandallo"><tbody>
      ${fila('pvp', 'PVP', $$(r.pvp))}
      ${fila('descuento', '− Descuento comercial (' + n2(r.descPct) + ' %)', $$(r.descuento))}
      ${fila('inu', '= Ingreso neto unitario (INU)', $$(r.inu), 'sub')}
      ${s.modo !== 'cpu' ? fila('cpt', 'Costo producto total (CPT)', $$(r.cpt), 'nota') : ''}
      ${fila('cpu', '− Costo producto unitario (CPU)', $$(r.cpu))}
      ${fila('invendibles', '− Invendibles', $$(g.invendibles))}${fila('derechos', '− Derechos de autor', $$(g.derechos))}
      ${fila('incobrables', '− Incobrables', $$(g.incobrables))}${fila('comisiones', '− Comisión de vendedores', $$(g.comisiones))}
      ${fila('flete', '− Flete y depósito', $$(g.flete))}${fila('publicidad', '− Publicidad y marketing', $$(g.publicidad))}
      ${fila('mcu', '= Margen de contribución unitario (MCU)', $$(r.mcu), 'total')}
      ${fila('mcuPct', 'MCU %', n2(r.mcuPct, 4) + ' <span class="tenue">(' + n2(pct) + ' %)</span>', 'total')}
    </tbody></table>
    <div class="veredicto ${nivel}"><div class="barra"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i><span class="marca25"></span><span class="marca30"></span></div><b>${veredicto}</b></div></div>
    <div class="tarjeta"><h3>Costos</h3><div class="resumen">
      <div class="dato"><b>${$$(r.cdu)}</b><span>Costo directo unitario (CDU), <b class="por">por ejemplar</b> ${ay('cdu')}</span>${exp('cdu')}</div>
      <div class="dato"><b>${$$(r.totalGastos)}</b><span>Gastos comerciales, <b class="por">por ejemplar</b> ${ay('gastos')}</span>${exp('gastos')}</div>
      <div class="dato"><b>${$$(r.cdt)}</b><span>Costo directo total (CDT), <b class="por">toda la tirada</b> ${ay('cdt')}</span>${exp('cdt')}</div>
      ${r.ce ? `<div class="dato"><b>${$$(r.cgt)}</b><span>Costo global total (CGT), <b class="por">toda la tirada</b> ${ay('cgt')}</span>${exp('cgt')}</div>` : ''}
      <div class="dato"><b>${$$(r.marginal)}</b><span>Costo marginal, <b class="por">un ejemplar más</b> ${ay('marginal')}</span>${exp('marginal')}</div></div></div>
    <div class="tarjeta"><h3>Puntos de equilibrio <span class="chico tenue">(en ejemplares)</span></h3><div class="resumen">
      ${r.ce ? pe('peEstructura', 'para pagar la estructura', r.pe.estructura) : ''}${pe('peEdicion', 'para recuperar la edición', r.pe.edicion)}${r.ce ? pe('peAbsorcion', 'para cubrir todo', r.pe.absorcion) : ''}</div>
      ${r.ce ? '' : '<p class="chico tenue" style="margin:8px 0 0">Cargá el costo de estructura (paso 5) para ver los otros dos.</p>'}</div>
    ${nivel !== 'ok' ? `<div class="tarjeta"><h3>Cómo mejorar el margen</h3><ul class="chico" style="margin:0;padding-left:20px">
      <li>Bajar costos rubro por rubro: sacar las solapas, un papel de menor gramaje, otro presupuesto de imprenta.</li>
      <li>Si los costos ya no bajan, subir el PVP hasta el techo que pone el mercado.</li>
      <li>Revisar los canales: los de mayor descuento comen el margen.</li>
      <li>Recién si no se puede mover ni el piso ni el techo, se descarta el libro por inviable.</li></ul></div>` : ''}`;
}
let escT;
function setEsc(k, v, todo) {
  escS()[k] = v;
  clearTimeout(escT); escT = setTimeout(guardar, 300);
  if (todo) render(); else $('#esc-res').innerHTML = escResultado();
}
function setCanal(i, k, v) { const c = escS().canales[i]; if (!c) return; c[k] = v; clearTimeout(escT); escT = setTimeout(guardar, 300); $('#esc-res').innerHTML = escResultado(); }
function sumarCanal() { const L = escS().canales; if (L.length >= 12) return aviso('Hasta 12 canales'); L.push({ t: '', desc: '', part: '', plazo: '' }); guardar(); render(); }
function quitarCanal(i) { escS().canales.splice(i, 1); guardar(); render(); }
function ejemploEsc() { E.escandallo = JSON.parse(JSON.stringify(Escandallo.EJEMPLO)); guardar(); render(); aviso('Ejemplo de la clase 2 cargado'); }
function vaciarEsc() {
  const s = escS();
  CAMPOS_ESC.forEach(k => { s[k] = ''; });
  s.canales = [{ t: 'Librerías', desc: '', part: '', plazo: '' }];
  guardar(); render();
}

// =====================================================================
// CÁLCULO DE PAPEL E IMPOSICIÓN (FPI): las cuentas están en papel.js
// =====================================================================
Object.assign(AYUDA, {
  papTipo: 'Interiores: el pliego se plega en cuadernillos y se imponen dobles páginas (las dos páginas enfrentadas). Tapa: se imprime abierta (solapa + tapa + lomo + tapa + solapa), una pose por ejemplar.',
  papAncho: 'Formato del libro cerrado, en centímetros. Ancho y alto de una página (la tapa tiene el mismo alto).',
  papPaginas: 'Páginas del interior, sin la tapa. Se llevan al múltiplo de 8 más cercano por exceso (las que sobran son páginas en blanco).',
  papSolapa: 'Ancho de cada solapa, en cm. Poné 0 si la tapa no lleva solapas.',
  papLomo: 'Ancho del lomo, en cm. Si no lo sabés, calculalo con el espesor de la hoja en el cálculo de interiores y traelo acá.',
  papTirada: 'Ejemplares que querés tener. La demasía se suma aparte.',
  papDemasia: 'Papel de más para pruebas, puesta a punto y descarte, en % de la tirada. La cátedra usa 10 % de referencia (5 % en el TP integrador). No es la demasía de sangrado de las calles.',
  papGramaje: 'Gramaje en g/m². El papel se calcula por superficie y se paga por peso: el gramaje conecta las dos cosas.',
  papPrecio: 'Precio del kilo de papel. Cada papel (obra, ilustración) tiene el suyo.',
  papPaquete: 'Cómo se vende el papel. El papel de interiores se compra por resma (500 hojas); la cartulina y el ilustración, en paquetes de 100, 150 o 250. Se redondea hacia arriba al paquete entero.',
  papFormato: 'Pliego de compra: el formato estándar que se le pide a la papelera. Elegí el que mejor aproveche la superficie (abajo se comparan todos).',
  papCortes: 'Pliego de impresión: a veces el de compra se corta a la mitad o en cuartos para usar una máquina más chica. El papel entra siempre por su lado ancho.',
  papCalle: 'Calles: espacio entre piezas, 1 cm de referencia; con imágenes al corte no baja de 6 mm (3 mm de sangrado por lado). Laterales: margen en los extremos del lado largo (1 a 1,5 cm). Pinza: franja por donde la máquina agarra el papel (2 a 3 cm). Cola: la franja del extremo opuesto (1,5 a 2 cm). Pinza y cola se descuentan del lado corto del pliego de impresión.',
  papForzar: 'Opcional. Si la imprenta te dijo cuántas páginas entran por pliego de impresión (8, 16, 32…), poné ese dato y se usa en lugar de la imposición calculada.',
  papEspesor: 'Opcional. Espesor de una hoja en micrones (lo da el proveedor). Con eso se aproxima el lomo: hojas × espesor. En cartoné, sumá el cartón.',
  papKgResma: 'Kilos por resma = ancho × alto × gramaje ÷ 20.000 (cm, g/m²; resma de 500 hojas). El 20.000 pasa de cm² a m² y de g a kg ya multiplicado por las 500 hojas.',
  papPliegos: 'Pliegos de compra = ejemplares con demasía × pliegos de impresión por libro ÷ cortes. Interiores: pliegos por libro = páginas ÷ páginas por pliego.',
  papDesperdicio: 'Superficie del pliego de impresión que no ocupan las piezas: calles, pinza, cola, laterales y lo que no entra.',
  papCuadernillos: 'Si las páginas no dan un múltiplo exacto del pliego, el libro mezcla cuadernillos de distinto tamaño (32, 16, 8). Los chicos se repiten en el pliego, por eso la cuenta es proporcional.'
});
const papS = () => (E.papel = E.papel || JSON.parse(JSON.stringify(Papel.EJEMPLO)));
const papAy = k => 'pap' + k[0].toUpperCase() + k.slice(1);
// ayK: la clave de la ayuda; false = sin botón "?" (para no repetir el mismo botón en la pantalla).
const campoPap = (k, t, suf, ph, ayK) => `<div class="campo-esc"><label class="c" for="pap-${k}">${t} ${ayK === false ? '' : ay(ayK || papAy(k))}</label>${ayK === false ? '' : exp(ayK || papAy(k))}
  <div class="con-unidad">${suf === '$' ? '<span>$</span>' : ''}<input id="pap-${k}" inputmode="decimal" autocomplete="off" value="${esc(papS()[k] || '')}" placeholder="${esc(ph || '')}" oninput="setPap(${arg(k)},this.value)">${suf && suf !== '$' ? `<span>${suf}</span>` : ''}</div></div>`;
const selPap = (k, t, opts, ayK) => `<div class="campo-esc"><label class="c" for="pap-${k}">${t} ${ay(ayK)}</label>${exp(ayK)}
  <select id="pap-${k}" class="sel-pap" onchange="setPap(${arg(k)},this.value,true)">${opts.map(([v, x]) => `<option value="${esc(v)}" ${String(papS()[k]) === String(v) ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select></div>`;

function vPapel() {
  const s = papS(), tapa = s.tipo === 'tapa';
  const tipo = (id, t) => `<label class="elige ${s.tipo === id ? 'on' : ''}"><input type="radio" name="pap-tipo" data-f="pap-tipo-${id}" ${s.tipo === id ? 'checked' : ''} onchange="setPap('tipo',${arg(id)},true)"><span>${t}</span></label>`;
  return `<p class="chico tenue" style="margin-top:0">Cuánto papel hay que comprar y cuánto cuesta: a partir del formato del libro, calcula cuántas piezas entran en cada pliego (con calles, pinza, cola y laterales), los pliegos, las resmas, los kilos y el costo. Tocá <b>?</b> al lado de cada dato para ver qué es. Basado en la guía de cálculo de papel de la cátedra de Fundamentos de la Producción de Impresos.</p>
    <div class="eligen" style="margin-bottom:10px">${tipo('interior', '📖 Interiores')}${tipo('tapa', '🗂️ Tapa')} ${ay('papTipo')}</div>${exp('papTipo')}
    <div class="fila" style="margin:10px 0"><button class="btn sec ch" onclick="ejemploPap()">Cargar el ejemplo de la cátedra</button><button class="btn lin ch" onclick="vaciarPap()">Vaciar</button></div>
    <div class="esc"><div class="esc-datos">
      <div class="tarjeta"><h3>1. El libro</h3><div class="dos">${campoPap('ancho', 'Ancho cerrado', 'cm')}${campoPap('alto', 'Alto cerrado', 'cm', '', false)}
        ${tapa ? campoPap('solapa', 'Solapa (cada una)', 'cm', '0') + campoPap('lomo', 'Lomo', 'cm') : campoPap('paginas', 'Páginas del interior', 'págs.')}
        ${campoPap('tirada', 'Tirada', 'ejemplares')}${campoPap('demasia', 'Demasía', '% de la tirada', '10')}
        ${tapa ? '' : campoPap('espesor', 'Espesor de una hoja (opcional)', 'µm')}</div></div>
      <div class="tarjeta"><h3>2. El papel</h3><div class="dos">${campoPap('gramaje', 'Gramaje', 'g/m²')}${campoPap('precioKg', 'Precio del kilo', '$', '', 'papPrecio')}
        ${selPap('hojasPaquete', 'Se vende en', [['500', 'Resmas de 500 hojas'], ['250', 'Paquetes de 250'], ['150', 'Paquetes de 150'], ['100', 'Paquetes de 100']], 'papPaquete')}</div></div>
      <div class="tarjeta"><h3>3. El pliego</h3><div class="dos">${selPap('formato', 'Pliego de compra (cm)', Papel.FORMATOS.map(f => [f.id, f.t]).concat([['otro', 'Otro…']]), 'papFormato')}
        ${selPap('cortes', 'Pliego de impresión', Object.keys(Papel.CORTES).map(k => [k, Papel.CORTES[k]]), 'papCortes')}
        ${s.formato === 'otro' ? campoPap('fa', 'Medida del pliego: un lado', 'cm', '', false) + campoPap('fb', 'El otro lado', 'cm', '', false) : ''}</div></div>
      <div class="tarjeta"><h3>4. Calles, pinza y cola ${ay('papCalle')}</h3>${exp('papCalle')}<div class="dos">${campoPap('calle', 'Calles', 'cm', '1', false)}${campoPap('lateral', 'Laterales', 'cm', '1', false)}${campoPap('pinza', 'Pinza', 'cm', '3', false)}${campoPap('cola', 'Cola', 'cm', '2', false)}</div>
        ${tapa ? '' : campoPap('forzar', 'Páginas por pliego, si te lo dio la imprenta (opcional)', 'págs.')}
        <p class="chico tenue" style="margin:6px 0 0">Son medidas de referencia de la cátedra: confirmalas con la imprenta.</p></div>
    </div><div class="esc-res" id="pap-res" aria-live="polite">${papResultado()}</div></div>
    <div id="pap-cmp">${papComparacion()}</div>`;
}

// Dibujo del pliego de impresión: bandas de pinza y cola, laterales, y las piezas que entran.
function papDibujo(r) {
  const I = r.imp, L = I.largo, C = I.corto, m = r.m;
  const gw = I.nx * I.pw + Math.max(0, I.nx - 1) * m.calle, gh = I.ny * I.ph + Math.max(0, I.ny - 1) * m.calle;
  const x0 = m.lateral + (I.U - gw) / 2, y0 = m.pinza + (I.V - gh) / 2;
  let piezas = '';
  for (let i = 0; i < I.nx * I.ny; i++) {
    const cx = i % I.nx, cy = Math.floor(i / I.nx), x = x0 + cx * (I.pw + m.calle), y = y0 + cy * (I.ph + m.calle), usada = i < I.usadas;
    piezas += `<rect class="imp-pieza ${usada ? '' : 'sobra'}" x="${x}" y="${y}" width="${I.pw}" height="${I.ph}"/>`;
    if (usada && r.tipo === 'interior') piezas += I.rotada ? `<line class="imp-plie" x1="${x}" y1="${y + I.ph / 2}" x2="${x + I.pw}" y2="${y + I.ph / 2}"/>` : `<line class="imp-plie" x1="${x + I.pw / 2}" y1="${y}" x2="${x + I.pw / 2}" y2="${y + I.ph}"/>`;
  }
  const dim = `${n2(L, 1)} × ${n2(C, 1)} cm`;
  return `<svg class="imp" viewBox="-1 -1 ${L + 2} ${C + 2}" role="img" aria-label="Pliego de impresión de ${dim}: entran ${I.usadas} ${r.tipo === 'interior' ? 'dobles páginas' : 'tapas'} por cara">
    <rect class="imp-hoja" x="0" y="0" width="${L}" height="${C}"/>
    <rect class="imp-banda" x="0" y="0" width="${L}" height="${m.pinza}"/><rect class="imp-banda" x="0" y="${C - m.cola}" width="${L}" height="${m.cola}"/>
    <rect class="imp-banda lat" x="0" y="${m.pinza}" width="${m.lateral}" height="${C - m.pinza - m.cola}"/><rect class="imp-banda lat" x="${L - m.lateral}" y="${m.pinza}" width="${m.lateral}" height="${C - m.pinza - m.cola}"/>
    ${piezas}</svg>
    <p class="chico tenue" style="margin:4px 0 0"><span class="imp-ref"></span> pinza y cola · <span class="imp-ref lat"></span> laterales · pliego de impresión de ${dim}${r.cortes > 1 ? ` (${r.cortes === 2 ? 'mitad' : 'cuarto'} del de compra)` : ''}</p>`;
}

function papResultado() {
  const s = papS(), r = Papel.calcular(s), tapa = r.tipo === 'tapa';
  if (r.incompleto) return `<div class="tarjeta"><p class="vacio" style="padding:10px">Completá ${tapa ? 'el formato' : 'el formato, las páginas'}, la tirada, el gramaje y el pliego.</p></div>`;
  if (r.noEntra) return `<div class="tarjeta"><h3>No entra</h3>${papDibujo(r)}<p class="chico alerta">${tapa ? 'La tapa abierta' : 'Ni una doble página'} (${n2(r.pieza.w, 1)} × ${n2(r.pieza.h, 1)} cm) no entra en este pliego con esos márgenes. Probá otro formato, un corte menos o menos solapa.</p></div>`;
  const fila = (k, t, v, cls) => `<tr class="${cls || ''}"><th scope="row">${t} ${k ? ay(k) : ''}${k ? exp(k) : ''}</th><td>${v}</td></tr>`;
  const avisos = [];
  if (!tapa && r.sobra > 0) avisos.push(`Entran ${r.imp.encajan} dobles páginas por cara, pero el plegado exige una potencia de 2: se usan ${r.imp.usadas}.`);
  if (!tapa && r.blancas > 0) avisos.push(`${r.paginas} páginas no es múltiplo de 8: se agregan ${r.blancas} en blanco (${r.finales} en total).`);
  const cuad = !tapa && r.cuadernillos.lista.length && !r.cuadernillos.resto ? r.cuadernillos.lista.map(c => `${c.cantidad} de ${c.paginas}`).join(' + ') : '';
  const lomo = !tapa && Papel.n(s.espesor) > 0 ? Papel.lomo(r.finales, s.espesor) : 0;
  return `<div class="tarjeta"><h3>Imposición</h3>${papDibujo(r)}
    <p style="margin:8px 0 0"><b>${r.imp.usadas}</b> ${tapa ? (r.imp.usadas === 1 ? 'tapa' : 'tapas') : 'dobles páginas'} por cara${tapa ? '' : ` → <b>${r.porImpresion} páginas</b> por pliego de impresión`}${r.cortes > 1 ? ` · <b>${r.porCompra}</b> ${tapa ? 'tapas' : 'páginas'} por pliego de compra` : ''}.</p>
    <p class="chico tenue" style="margin:2px 0 0">${tapa ? `Tapa abierta: ${n2(r.pieza.w, 1)} × ${n2(r.pieza.h, 1)} cm (solapa + tapa + lomo + tapa + solapa).` : `Doble página: ${n2(r.pieza.w, 1)} × ${n2(r.pieza.h, 1)} cm.`} Desperdicio de superficie: <b>${n2(r.desperdicio * 100, 1)} %</b> ${ay('papDesperdicio')}</p>${exp('papDesperdicio')}
    ${avisos.map(a => `<p class="chico alerta" style="margin:6px 0 0">⚠ ${esc(a)}</p>`).join('')}</div>
    <div class="tarjeta"><h3>El papel</h3><table class="escandallo"><tbody>
      ${fila('', 'Ejemplares con demasía (' + n2(r.dem) + ' %)', n2(r.ejemplares, 0))}
      ${tapa ? '' : fila('papCuadernillos', 'Pliegos de impresión por libro', n2(r.pliegosLibro, 3) + (cuad ? ` <span class="tenue">(${esc(cuad)} págs.)</span>` : ''))}
      ${fila('papPliegos', 'Pliegos de compra', n2(r.pliegos, 0), 'sub')}
      ${fila('', r.hojasPaq === 500 ? 'Resmas' : 'Paquetes de ' + r.hojasPaq, n2(r.paquetes, 0) + ` <span class="tenue">(${n2(r.hojas, 0)} hojas)</span>`)}
      ${fila('papKgResma', 'Kilos por resma de 500', n2(r.kgResma, 3) + ' kg')}
      ${fila('', 'Kilos totales', n2(r.kg, 2) + ' kg', 'sub')}
      ${r.precioKg ? fila('', 'Precio por resma · por hoja', $$(r.precioResma) + ' · ' + $$(r.precioHoja)) + fila('', 'Costo total del papel', $$(r.costo), 'total') + fila('', 'Por ejemplar (de la tirada pedida)', $$(r.costoEjemplar)) : ''}
    </tbody></table>${r.precioKg ? '' : '<p class="chico tenue" style="margin:8px 0 0">Cargá el precio del kilo para ver el costo.</p>'}</div>
    ${lomo ? `<div class="tarjeta"><h3>Lomo aproximado</h3><p style="margin:0"><b>${n2(lomo, 2)} cm</b> <span class="chico tenue">(${n2(r.finales / 2, 0)} hojas × ${esc(s.espesor)} µm)</span></p>
      <button class="btn lin ch" style="margin-top:8px" onclick="lomoATapa(${arg(lomo.toFixed(2).replace('.', ','))})">Usarlo en la tapa</button></div>` : ''}${papPasos(r, s)}`;
}

// La misma cuenta, paso a paso y con los números de quien la hace (para poder repetirla a mano en el parcial).
function papPasos(r, s) {
  const tapa = r.tipo === 'tapa', I = r.imp, m = r.m, f = (v, d) => n2(v, d == null ? 2 : d), pie = I.pw, alt = I.ph;
  const L = [];
  L.push(tapa ? `<b>La tapa abierta:</b> solapa + tapa + lomo + tapa + solapa = ${f(Papel.n(s.solapa))} + ${f(r.ancho)} + ${f(Papel.n(s.lomo))} + ${f(r.ancho)} + ${f(Papel.n(s.solapa))} = <b>${f(r.pieza.w)} cm</b>, por ${f(r.alto)} cm de alto.`
    : `<b>La doble página</b> (las dos páginas enfrentadas): 2 × ${f(r.ancho)} = ${f(r.pieza.w)} cm de ancho por ${f(r.alto)} cm de alto.`);
  L.push(`<b>El pliego de impresión:</b> ${r.cortes === 1 ? 'el de compra entero' : r.cortes === 2 ? 'la mitad del de compra' : 'un cuarto del de compra'}, de ${f(I.largo, 1)} × ${f(I.corto, 1)} cm. El papel entra por su lado ancho: la pinza y la cola se restan del lado corto y los laterales, del largo.
    <br>Lado largo útil = ${f(I.largo, 1)} − 2 × ${f(m.lateral)} (laterales) = <b>${f(I.U, 1)} cm</b>
    <br>Lado corto útil = ${f(I.corto, 1)} − ${f(m.pinza)} (pinza) − ${f(m.cola)} (cola) = <b>${f(I.V, 1)} cm</b>`);
  L.push(`<b>Cuántas entran</b> (con ${f(m.calle)} cm de calle entre piezas), probando la pieza de ${f(pie)} × ${f(alt)} cm${I.rotada ? ' girada' : ''}:
    <br>A lo largo: (${f(I.U, 1)} + ${f(m.calle)}) ÷ (${f(pie)} + ${f(m.calle)}) = ${f((I.U + m.calle) / (pie + m.calle), 2)} → <b>${I.nx}</b>
    <br>A lo corto: (${f(I.V, 1)} + ${f(m.calle)}) ÷ (${f(alt)} + ${f(m.calle)}) = ${f((I.V + m.calle) / (alt + m.calle), 2)} → <b>${I.ny}</b>
    <br>${I.nx} × ${I.ny} = <b>${I.encajan}</b> ${tapa ? 'tapas' : 'dobles páginas'} por cara${!tapa && I.usadas !== I.encajan ? `. El plegado pide 1, 2, 4, 8, 16… dobles páginas: se usan <b>${I.usadas}</b>.` : '.'}`);
  if (tapa) L.push(`<b>Tapas por pliego de compra:</b> ${r.porImpresion} × ${r.cortes} = <b>${r.porCompra}</b>.`);
  else L.push(`<b>Páginas por pliego de impresión:</b> ${I.usadas} dobles páginas × 2 páginas × 2 caras = <b>${r.porImpresion}</b>.${Papel.n(s.forzar) > 0 ? ' (Usé el dato que cargaste de la imprenta.)' : ''}`);
  if (!tapa) {
    L.push(`<b>Páginas del libro:</b> ${f(r.paginas, 0)} ${r.blancas ? `→ el múltiplo de 8 más cercano por exceso es ${f(r.finales, 0)} (${r.blancas} en blanco)` : '(ya es múltiplo de 8)'}.
      <br>Pliegos de impresión por libro = ${f(r.finales, 0)} ÷ ${r.porImpresion} = <b>${f(r.pliegosLibro, 3)}</b>`);
  }
  L.push(`<b>Ejemplares con demasía:</b> ${f(r.tirada, 0)} × (1 + ${f(r.dem)} ÷ 100) = <b>${f(r.ejemplares, 0)}</b>.`);
  L.push(`<b>Pliegos de compra:</b> ${tapa ? `${f(r.ejemplares, 0)} ÷ ${r.porImpresion} tapas por pliego de impresión` : `${f(r.ejemplares, 0)} × ${f(r.pliegosLibro, 3)}`} = ${f(r.impresiones, 1)} pliegos de impresión${r.cortes > 1 ? ` ÷ ${r.cortes} cortes` : ''} = ${f(r.impresiones / r.cortes, 2)} → se redondea hacia arriba: <b>${f(r.pliegos, 0)}</b>.`);
  L.push(`<b>${r.hojasPaq === 500 ? 'Resmas' : 'Paquetes de ' + r.hojasPaq}:</b> ${f(r.pliegos, 0)} ÷ ${r.hojasPaq} = ${f(r.pliegos / r.hojasPaq, 2)} → <b>${f(r.paquetes, 0)}</b> (${f(r.hojas, 0)} hojas).`);
  L.push(`<b>Kilos por resma de 500 hojas:</b> (ancho × alto × gramaje) ÷ 20.000 = (${f(r.compra.b, 1)} × ${f(r.compra.a, 1)} × ${f(r.gramaje)}) ÷ 20.000 = <b>${f(r.kgResma, 3)} kg</b>.`);
  L.push(`<b>Kilos totales:</b> ${f(r.hojas, 0)} hojas × ${f(r.kgResma, 3)} ÷ 500 = <b>${f(r.kg, 2)} kg</b>.`);
  if (r.precioKg) L.push(`<b>Costo:</b> ${f(r.kg, 2)} kg × ${$$(r.precioKg)} = <b>${$$(r.costo)}</b>. Por ejemplar: ${$$(r.costo)} ÷ ${f(r.tirada, 0)} = ${$$(r.costoEjemplar)}.`);
  return `<details class="tarjeta pasos"><summary><b>✍️ Cómo se hace a mano</b></summary><p class="chico tenue" style="margin:6px 0">La misma cuenta, paso a paso y con tus números.</p><ol>${L.map(x => `<li>${x}</li>`).join('')}</ol></details>`;
}

// Compara el mismo trabajo con cada formato de pliego de compra, del más barato al más caro.
function papComparacion() {
  const s = papS(), L = Papel.comparar(s);
  if (!L.length) return '';
  const tapa = s.tipo === 'tapa', precio = Papel.n(s.precioKg) > 0;
  return `<div class="tarjeta"><h3>Comparar formatos de pliego</h3>
    <p class="chico tenue" style="margin:0 0 8px">El mismo trabajo con cada formato de compra (pliego de impresión: ${esc(Papel.CORTES[s.cortes].toLowerCase())}). El más barato no siempre es el que parece más justo a ojo: cada formato pesa distinto por resma.</p>
    <div class="tabla-scroll"><table class="tabla"><thead><tr><th>Pliego</th><th>${tapa ? 'Tapas' : 'Págs.'} por pliego</th><th>Kg por resma</th><th>Pliegos</th><th>Kilos</th>${precio ? '<th>Costo</th><th>Dif.</th>' : ''}<th>Desperd.</th></tr></thead><tbody>
    ${L.map(x => `<tr ${x.id === s.formato ? 'class="sel"' : ''}><td><b>${esc(x.t)}</b>${x.mejor ? ' <span class="chip ok">más barato</span>' : ''}${x.id === s.formato ? ' <span class="chip tin">el tuyo</span>' : ''}</td>
      ${x.noEntra ? `<td colspan="${precio ? 7 : 5}" class="tenue">no entra</td>` : `<td>${x.porCompra}</td><td>${n2(x.kgResma, 2)}</td><td>${n2(x.pliegos, 0)}</td><td>${n2(x.kg, 1)}</td>${precio ? `<td>${$$(x.costo)}</td><td>${x.mejor ? '—' : '+' + n2(x.difPct * 100, 1) + ' %'}</td>` : ''}<td>${n2(x.desperdicio * 100, 1)} %</td>`}</tr>`).join('')}
    </tbody></table></div></div>`;
}
let papT;
function setPap(k, v, todo) {
  papS()[k] = v;
  clearTimeout(papT); papT = setTimeout(guardar, 300);
  if (todo) render(); else { $('#pap-res').innerHTML = papResultado(); $('#pap-cmp').innerHTML = papComparacion(); }
}
function ejemploPap() { const t = papS().tipo; E.papel = JSON.parse(JSON.stringify(t === 'tapa' ? Papel.EJEMPLO_TAPA : Papel.EJEMPLO)); guardar(); render(); aviso('Ejemplo de la cátedra cargado'); }
function vaciarPap() {
  const s = papS();
  CAMPOS_PAPEL.forEach(k => { s[k] = ''; });
  s.formato = '58x92'; s.cortes = '1'; s.hojasPaquete = s.tipo === 'tapa' ? '250' : '500';
  Object.assign(s, { calle: '1', lateral: '1', pinza: '3', cola: '2' });
  guardar(); render();
}
function lomoATapa(v) { const s = papS(); s.lomo = v; s.tipo = 'tapa'; guardar(); render(); aviso('Lomo pasado a la tapa'); }

// =====================================================================
// GLOSARIO: términos clave de todas las materias (datos/glosario.json, armado con 104-edicion-cursada/glosario.py)
// Un término que se usa en varias materias lleva la etiqueta de cada una; si significa algo distinto en cada una, trae una acepción por materia.
// =====================================================================
async function cargarGlosario() {
  if (D.glosario || cargarGlosario.va) return;
  cargarGlosario.va = true;
  try { D.glosario = await json('glosario.json'); } catch (e) { D.glosario = { terminos: [], materias: [], error: true }; }
  if (V.tab === 'glosario') render();
}
const sinTildes = t => String(t == null ? '' : t).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function glosarioFiltrado() {
  const G = D.glosario, q = sinTildes(V.glo.q).trim();
  return G.terminos.filter(x => (!V.glo.mat || x.materias.indexOf(V.glo.mat) >= 0)
    && (!q || sinTildes([x.t, x.sigla || '', (x.alias || []).join(' '), x.acepciones.map(a => a.def).join(' ')].join(' ')).indexOf(q) >= 0));
}
function glosarioLista() {
  const G = D.glosario, L = glosarioFiltrado();
  if (!L.length) return '<p class="vacio">No hay términos con ese filtro.</p>';
  const nombre = id => (G.materias.find(m => m.id === id) || {}).corto || id;
  const chips = ids => ids.map(id => `<span class="chip tin" title="${esc((G.materias.find(m => m.id === id) || {}).nombre || '')}">${esc(nombre(id))}</span>`).join(' ');
  let letra = '';
  return `<p class="chico tenue" style="margin:0 0 8px">${L.length} término${L.length === 1 ? '' : 's'}</p>` + L.map(x => {
    const ini = sinTildes(x.t).charAt(0).toUpperCase(), cab = ini !== letra ? (letra = ini, `<div class="glo-letra" aria-hidden="true">${esc(ini)}</div>`) : '';
    const multi = x.acepciones.length > 1;
    return cab + `<article class="tarjeta glo"><div class="fila"><h3 class="crece">${esc(x.t)}${x.sigla ? ` <span class="tenue">(${esc(x.sigla)})</span>` : ''}</h3>
      <span class="glo-tags">${chips(x.materias)}</span></div>
      ${multi ? `<p class="chico tenue" style="margin:2px 0 6px">Significa algo distinto según la materia:</p>` : ''}
      ${x.acepciones.map((a, i) => `<p class="glo-def">${multi ? `<span class="glo-ac">${i + 1}. ${chips(a.materias)}</span> ` : ''}${esc(a.def)}</p>`).join('')}</article>`;
  }).join('');
}
function vGlosario() {
  if (!D.glosario) { cargarGlosario(); return '<p class="cargando">Cargando el glosario…</p>'; }
  const G = D.glosario;
  if (!G.terminos.length) return '<p class="vacio">No se pudo cargar el glosario. Probá recargar la página.</p>';
  const mats = [{ id: '', corto: 'Todas' }].concat(G.materias);
  return `<p class="chico tenue" style="margin-top:0">Los términos clave de cada materia, para buscar rápido. Si una palabra se usa en más de una materia, aparece con la etiqueta de cada una; si significa algo distinto en cada una, se separan las acepciones. Armado a partir de mis apuntes.</p>
    <div class="eligen" role="group" aria-label="Filtrar por materia" style="margin-bottom:10px">${mats.map(m => `<button class="btn ${V.glo.mat === m.id ? '' : 'lin'} ch" aria-pressed="${V.glo.mat === m.id}" data-f="glo-${esc(m.id)}" title="${esc(m.nombre || '')}" onclick="V.glo.mat=${arg(m.id)};render()">${esc(m.corto)}</button>`).join('')}</div>
    <label class="solo-lector" for="glo-q">Buscar un término</label>
    <input id="glo-q" type="search" autocomplete="off" placeholder="Buscar un término o parte de su definición" value="${esc(V.glo.q)}" style="width:100%;margin-bottom:12px" oninput="V.glo.q=this.value;$('#glo-lista').innerHTML=glosarioLista()">
    <div id="glo-lista">${glosarioLista()}</div>`;
}

// =====================================================================
// LINKS ÚTILES y SUGERENCIAS
// =====================================================================
// NOVEDADES: el registro completo de lo que se fue publicando (datos/novedades.json, el mismo que arma el mail de los lunes).
async function cargarNovedades() {
  if (D.novedades || cargarNovedades.va) return;
  cargarNovedades.va = true;
  try { D.novedades = await json('novedades.json'); } catch (e) { D.novedades = { novedades: [], error: true }; }
  if (V.tab === 'novedades') render();
}
function vNovedades() {
  if (!D.novedades) { cargarNovedades(); return '<p class="cargando">Cargando las novedades…</p>'; }
  if (D.novedades.error) return '<p class="vacio">No se pudieron cargar las novedades. Probá recargar la página.</p>';
  const N = D.novedades.novedades.filter(x => Number.isInteger(x.v)), vers = [...new Set(N.map(x => x.v))].sort((a, b) => b - a);
  const tema = Object.fromEntries(TEMAS_NOV.map(([k, t]) => [k, t.split(' ')[0]]));
  const tarjeta = x => `<div class="tarjeta nov-item"><b class="nov-t">${esc(x.titulo)}</b>
    ${x.texto ? `<p class="chico" style="margin:6px 0 0">${esc(x.texto)}</p>` : ''}
    <p class="chico tenue" style="margin:8px 0 0">${tema[x.tipo] || ''} ${esc((TEMAS_NOV.find(t => t[0] === x.tipo) || ['', ''])[1].replace(/^\S+\s/, ''))}${x.para ? ' · Para: ' + esc(x.para) : ''}${enlaceNov(x.url)}</p></div>`;
  return `<p class="chico tenue" style="margin-top:0">Todo lo que se fue sumando a Cursada, desde la primera versión hasta hoy. Es lo mismo que te llega por mail los lunes.</p>
    <p class="botones"><button class="btn ch" onclick="avisame()">🔔 Recibirlas por mail</button><button class="btn lin ch" onclick="idea()">💡 Pedir algo</button></p>` +
    vers.map(v => { const L = N.filter(x => x.v === v).sort((a, b) => a.fecha < b.fecha ? 1 : -1);
      return `<div class="titulo-sec"><h2>v${v}${v === vers[0] ? ' <span class="chip ok">última</span>' : ''}</h2><span class="chico tenue">${fmtLarga(L[0].fecha)}</span></div>${L.map(tarjeta).join('')}`; }).join('');
}
const enlaceNov = u => { const r = typeof u === 'string' && /^https:\/\/ficha\.github\.io\/cursada\/(#[a-z]+)?$/.test(u) ? u.replace(/^https:\/\/ficha\.github\.io\/cursada\//, '') : ''; return r && r !== '#donar' ? ` · <a href="${esc(r)}">Verlo en Cursada →</a>` : ''; };
const fmtLarga = s => { const d = fecha(s); return d.getDate() + ' de ' + MESES_LARGO[d.getMonth()] + ' de ' + d.getFullYear(); };
const MESES_LARGO = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

function vLinks() {
  const G = D.plan.guia;
  return (G ? `<div class="titulo-sec"><h2>Lo básico de la cursada</h2></div><div class="tarjeta guia">${G.items.map(i => `<details><summary>${esc(i.t)}</summary><p class="chico">${esc(i.d)}</p></details>`).join('')}
    <p class="chico tenue" style="margin:10px 0 0">${esc(G.fuente)}</p></div>` : '') +
    `<p class="chico tenue">Los sitios oficiales que más se usan durante la cursada. Si falta alguno, avisame con 💡 Sugerencias.</p>` +
    (D.plan.links || []).map(g => `<div class="titulo-sec"><h2>${esc(g.grupo)}</h2></div><div class="tarjeta" style="padding:6px 16px">
      ${g.links.map(l => `<a class="evento" style="text-decoration:none;color:inherit" href="${esc(l.url)}" target="_blank" rel="noopener"><span class="crece"><b style="color:var(--tinta)">${esc(l.t)} ↗</b>
        ${l.d ? `<span class="chico tenue" style="display:block">${esc(l.d)}</span>` : ''}</span></a>`).join('')}</div>`).join('') +
    (D.plan.verificado ? `<p class="chico tenue verificado">✓ Links revisados el ${fmt(D.plan.verificado)}.</p>` : '');
}
// El sitio es estático: la sugerencia va a un buzón aparte (un Apps Script, ver 104-edicion-cursada/sugerencias)
// que filtra bots y la anota en una planilla de Fidel. No viaja ningún dato de notas ni de horarios.
const BUZON = 'https://script.google.com/macros/s/AKfycby-TbCIhqczXLYYUZXjagKyphO9sNYmZvTakpeUW_iI3lqSmahk_nUjBLJMBpFDkW5m/exec';
let ideaAbierta = 0, ideaPrefijo = '';
// El mismo buzón sirve para todo: o (opcional) cambia el título, la explicación, el ejemplo y un prefijo para el texto.
function idea(o) {
  o = o && typeof o === 'object' ? o : {};
  ideaAbierta = Date.now(); ideaPrefijo = o.prefijo || '';
  abrir(cab(esc(o.titulo || '💡 Sugerencias y comentarios')) + `<p class="chico tenue" style="margin-top:0">${esc(o.intro || '¿Falta algo, hay un dato viejo o un error? ¿Se te ocurre una mejora? Escribilo y listo.')}</p>
    <textarea id="i-t" maxlength="2000" style="min-height:130px" placeholder="${esc(o.ejemplo || 'Ej.: cambió el horario de la comisión 3 de Corrección; estaría bueno poder…')}"></textarea>
    <input id="i-c" style="width:100%;margin-top:8px" maxlength="120" placeholder="Tu mail, solo si querés que te responda (opcional)" autocomplete="email">
    <div aria-hidden="true" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden"><label>No completar<input id="i-w" tabindex="-1" autocomplete="off"></label></div>
    <div class="botones"><button class="btn" id="i-b" onclick="mandarIdea()">Enviar</button><button class="btn lin" onclick="cerrar()">Cancelar</button></div>
    <p class="chico tenue" id="i-n">Le llega a Fidel. No se manda nada de tus notas ni de tus horarios. <a href="#novedades" onclick="cerrar()">Ver lo que se fue sumando</a>.</p>`);
  setTimeout(() => $('#i-t').focus(), 50);
}
async function mandarIdea() {
  const texto = val('i-t');
  if (texto.length < 5) return aviso('Escribí tu sugerencia');
  const boton = $('#i-b');
  boton.disabled = true; boton.textContent = 'Enviando…';
  try {
    // text/plain evita la consulta previa (preflight) del navegador, que Apps Script no responde.
    const r = await fetch(BUZON, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ sitio: 'cursada', texto: (ideaPrefijo + texto).slice(0, 2000), contacto: val('i-c'), web: val('i-w'), ms: Date.now() - ideaAbierta, seccion: V.tab }) });
    const j = await r.json();
    if (!j.ok) throw new Error(j.error || 'No se pudo enviar');
    cerrar(); aviso(ideaPrefijo ? '¡Gracias! Recomendación enviada 📚' : '¡Gracias! Sugerencia enviada 💡');
  } catch (e) {
    boton.disabled = false; boton.textContent = 'Enviar';
    // Si el buzón no responde, queda el plan B: el mail de siempre, con el texto ya cargado.
    $('#i-n').innerHTML = `No se pudo enviar (${esc(e.message || 'sin conexión')}). Probá de nuevo o <a href="mailto:${CONTACTO}?subject=${encodeURIComponent('Cursada: sugerencia')}&body=${encodeURIComponent(texto)}">mandala por mail</a>.`;
  }
}

// =====================================================================
// DATOS: exportar, importar, borrar
// =====================================================================
// =====================================================================
// NOVEDADES POR MAIL: los lunes a las 8, lo nuevo del gestor que le importa a cada persona.
// Habla con el mismo script del buzón (Novedades.gs). Doble confirmación: el mail se guarda recién al confirmar desde el link.
// Los links de los mails son de este sitio: #confirmar=TOKEN, #novedades=TOKEN y #baja=TOKEN (se borran de la barra al abrirse).
// =====================================================================
// Apagado hasta desplegar Novedades.gs en el script del buzón (ver 104-edicion-cursada/REFERENCIA.md); con false no se ve el botón ni el cartel.
const NOVEDADES = true;
const TEMAS_NOV = [['herramientas', '🛠️ Funciones y herramientas nuevas'], ['resumenes', '📚 Resúmenes y apuntes nuevos'], ['fechas', '📅 Cambios en fechas, mesas de examen y horarios']];
let novAbierta = 0, novToken = '';
async function postNov(cuerpo) {
  // text/plain evita la consulta previa (preflight) del navegador, que Apps Script no responde.
  const r = await fetch(BUZON, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(Object.assign({ sitio: 'cursada' }, cuerpo)) });
  const j = await r.json();
  if (!j.ok) throw new Error(j.error || 'No se pudo completar');
  return j;
}
const checksTemas = marcados => TEMAS_NOV.map(([k, t]) => `<label class="chico fila nov-op"><input type="checkbox" data-f="nt-${k}" id="nt-${k}" ${!marcados || marcados.indexOf(k) >= 0 ? 'checked' : ''}> <span>${t}</span></label>`).join('');
const temasMarcados = () => TEMAS_NOV.map(t => t[0]).filter(k => { const el = document.getElementById('nt-' + k); return el && el.checked; });
function avisame() {
  if (!NOVEDADES) return;
  const cursando = D.plan ? D.plan.materias.filter(m => (E.materias[m.id] || {}).estado === 'cursando') : [];
  novAbierta = Date.now();
  abrir(cab('🔔 Novedades de Cursada') + `<p style="margin-top:0">Dejame tu mail y los <b>lunes a las 8:00</b> te llega solo lo nuevo del gestor que te importa. Es gratis, y si un lunes no hay nada para vos, no te escribo.</p>
    <label class="c" for="n-m">Tu mail</label>
    <input id="n-m" type="email" style="width:100%" maxlength="120" autocomplete="email" placeholder="nombre@ejemplo.com">
    <div class="c">¿Qué querés recibir?</div>${checksTemas()}
    ${cursando.length ? `<label class="chico fila nov-op" style="margin-top:6px"><input type="checkbox" id="n-mat" checked> <span>De las materias, solo las que estoy cursando (${cursando.map(m => esc(nombreDe(m))).join(', ')})</span></label>` : ''}
    <div aria-hidden="true" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden"><label>No completar<input id="n-w" tabindex="-1" autocomplete="off"></label></div>
    <div class="botones"><button class="btn" id="n-b" onclick="enviarAviso()">Suscribirme</button><button class="btn lin" onclick="cerrar()">Cancelar</button></div>
    <p class="chico tenue" id="n-n">Uso tu mail solo para esto y no lo comparto. Primero te mando un mail para que confirmes (si no confirmás, se borra) y en cada novedad vas a tener el link para cambiar lo que recibís o darte de baja. No se manda nada de tus notas ni de tus horarios.</p>`, 'nov');
  setTimeout(() => $('#n-m').focus(), 50);
}
async function enviarAviso() {
  const email = val('n-m'), temas = temasMarcados();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return aviso('Revisá el mail');
  if (!temas.length) return aviso('Elegí al menos un tema');
  const boton = $('#n-b'), solo = document.getElementById('n-mat');
  const materias = solo && solo.checked ? D.plan.materias.filter(m => (E.materias[m.id] || {}).estado === 'cursando').map(m => m.id) : [];
  boton.disabled = true; boton.textContent = 'Enviando…';
  try {
    await postNov({ accion: 'suscribir', email, temas, materias, web: val('n-w'), ms: Date.now() - novAbierta });
    abrir(cab('📬 Revisá tu mail') + `<p>Te mandé un mail a <b>${esc(email)}</b> para que confirmes. Tocá el botón que trae y listo: desde el próximo lunes te llegan las novedades.</p>
      <p class="chico tenue">Si no lo ves en unos minutos, mirá en <b>Spam</b> o <b>Promociones</b>. Si te equivocaste de mail, simplemente no lo confirmes y se borra solo.</p>
      <div class="botones"><button class="btn" onclick="cerrar()">Listo</button></div>`, 'nov');
  } catch (e) {
    boton.disabled = false; boton.textContent = 'Suscribirme';
    $('#n-n').innerHTML = `<span class="alerta">${esc(e.message || 'Sin conexión')}</span> Probá de nuevo en un rato, o escribime a <a href="mailto:${CONTACTO}">${CONTACTO}</a>.`;
  }
}
// Los links de los mails: se leen una vez y se borran de la barra de direcciones.
function manejarLinkNov() {
  if (location.hash === '#donar') { history.replaceState(null, '', location.pathname + location.search); if (DONAR.alias) abrirDonar(); return true; }   // el botón del mail
  const m = location.hash.match(/^#(confirmar|baja|novedades)=([0-9a-f-]{36})$/);
  if (!m) return false;
  history.replaceState(null, '', location.pathname + location.search);
  novToken = m[2];
  ({ confirmar: confirmarNov, baja: pedirBaja, novedades: verPrefsNov }[m[1]])();
  return true;
}
const errNov = e => `<p class="alerta">${esc(e.message || 'Sin conexión')}</p><p class="chico tenue">Probá de nuevo más tarde o escribime a <a href="mailto:${CONTACTO}">${CONTACTO}</a>.</p><div class="botones"><button class="btn" onclick="cerrar()">Cerrar</button></div>`;
async function confirmarNov() {
  abrir(cab('🔔 Novedades de Cursada') + '<p class="cargando">Confirmando tu mail…</p>', 'nov');
  try {
    await postNov({ accion: 'confirmar', token: novToken });
    abrir(cab('✅ ¡Listo!') + `<p>Tu mail quedó confirmado. Desde el próximo lunes, a las 8:00, te llega lo nuevo de Cursada que elegiste recibir. Si un lunes no hay nada para vos, no te escribo.</p>
      <div class="botones"><button class="btn" onclick="cerrar()">Seguir en Cursada</button><button class="btn lin" onclick="verPrefsNov()">Cambiar lo que recibo</button></div>`, 'nov');
  } catch (e) { abrir(cab('No se pudo confirmar') + errNov(e), 'nov'); }
}
async function verPrefsNov() {
  abrir(cab('🔔 Lo que recibís') + '<p class="cargando">Buscando tus preferencias…</p>', 'nov');
  try {
    const p = await postNov({ accion: 'ver', token: novToken });
    const mats = D.plan ? D.plan.materias.filter(m => m.grupo !== 'idiomas' && m.grupo !== 'final') : [];
    abrir(cab('🔔 Lo que recibís') + `<p style="margin-top:0">Cambiá lo que te llega los lunes a las 8:00.</p><div class="c">Temas</div>${checksTemas(p.temas)}
      <details style="margin-top:10px"><summary class="chico"><b>Limitar a algunas materias</b> (opcional)${p.materias.length ? ` · ${p.materias.length} elegidas` : ''}</summary>
        <p class="chico tenue" style="margin:6px 0">Sin ninguna marcada, recibís de todas. Si marcás alguna, las novedades de una materia solo te llegan si es una de esas.</p>
        ${mats.map(m => `<label class="chico fila nov-op"><input type="checkbox" class="nm" value="${esc(m.id)}" data-f="nm-${esc(m.id)}" ${p.materias.indexOf(m.id) >= 0 ? 'checked' : ''}> <span>${esc(nombreDe(m))}</span></label>`).join('')}</details>
      <div class="botones"><button class="btn" id="n-g" onclick="guardarNov()">Guardar</button><button class="btn lin" onclick="pedirBaja()">Darme de baja</button><button class="btn lin" onclick="cerrar()">Cerrar</button></div>
      <p class="chico tenue" id="n-n"></p>`, 'nov');
  } catch (e) { abrir(cab('No se pudo abrir') + errNov(e), 'nov'); }
}
async function guardarNov() {
  const temas = temasMarcados(), materias = [...document.querySelectorAll('#dlg .nm:checked')].map(x => x.value);
  if (!temas.length) return aviso('Elegí al menos un tema (o darte de baja)');
  const b = $('#n-g'); b.disabled = true;
  try { await postNov({ accion: 'guardar', token: novToken, temas, materias }); cerrar(); aviso('Listo, guardé tus preferencias'); }
  catch (e) { b.disabled = false; $('#n-n').innerHTML = `<span class="alerta">${esc(e.message || 'Sin conexión')}</span>`; }
}
function pedirBaja() {
  abrir(cab('¿Darte de baja?') + `<p>Dejás de recibir las novedades y borro tu mail. Si más adelante querés volver, te suscribís de nuevo.</p>
    <div class="botones"><button class="btn" id="n-x" onclick="confirmarBaja()">Sí, darme de baja</button><button class="btn lin" onclick="cerrar()">Mejor no</button></div><p class="chico tenue" id="n-n"></p>`, 'nov');
}
async function confirmarBaja() {
  const b = $('#n-x'); b.disabled = true;
  try { await postNov({ accion: 'baja', token: novToken }); abrir(cab('Listo, ya estás de baja') + '<p>No te escribo más y borré tu mail. ¡Gracias por haber seguido Cursada!</p><div class="botones"><button class="btn" onclick="cerrar()">Cerrar</button></div>', 'nov'); }
  catch (e) { b.disabled = false; $('#n-n').innerHTML = `<span class="alerta">${esc(e.message || 'Sin conexión')}</span>`; }
}

function abrirDatos() {
  abrir(cab('Tus datos') + `<p>Todo lo que cargás (notas, fechas, horarios) se guarda <b>solo en este navegador</b>. No guardo nada de lo que cargás: no hay cuentas ni servidor, y nadie más lo ve, ni siquiera yo. La única excepción es tu mail, si te suscribís a las novedades: lo uso solo para mandarte eso y te das de baja cuando quieras. Google Analytics (solo si aceptás las cookies) cuenta visitas, no tus datos.</p>
    <p><b>Queda guardado</b> aunque cierres la página o apagues la computadora: está ahí la próxima vez que entres desde <b>el mismo navegador y el mismo dispositivo</b>.</p>
    <p style="margin-bottom:4px"><b>Se pierde</b> (o no lo vas a ver) si:</p>
    <ul style="margin-top:0;padding-left:22px">
      <li>entrás desde otro dispositivo (el celular y la compu no se sincronizan) o desde otro navegador;</li>
      <li>usás una ventana de incógnito o privada: se borra al cerrarla;</li>
      <li>borrás los datos de navegación (cookies y datos de sitios) o desinstalás el navegador;</li>
      <li>usás Safari (iPhone, iPad o Mac) y pasás más de 7 días sin entrar: Safari borra solo lo que guardan los sitios que no visitás (<a href="https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/" target="_blank" rel="noopener">lo explica WebKit</a>).</li>
    </ul>
    <p>Para no perder nada, descargá una copia cada tanto; con ella también pasás tus datos a otro dispositivo.</p>
    <p class="chico tenue">Si esta computadora es compartida (la de la facultad, un locutorio), cualquiera que abra esta página acá va a ver lo que cargaste: al terminar, descargá tu copia y tocá “Borrar todo”.</p>
    <div class="botones"><button class="btn" onclick="exportar()">Descargar una copia</button>
      <label class="btn sec" style="display:inline-flex;align-items:center;cursor:pointer">Cargar una copia<input type="file" accept=".json,application/json" hidden onchange="importar(this.files[0])"></label>
      <button class="btn pel" onclick="borrarTodo()">Borrar todo</button></div>
    <p class="chico tenue" style="margin-top:14px">La copia es un archivo .json: guardalo en tu Drive o mandátelo por mail, y con “Cargar una copia” lo recuperás en cualquier dispositivo.</p>`);
}
function exportar() {
  if (V.demo) return aviso('Estás viendo el ejemplo: salí del ejemplo para descargar tu copia');
  E.copia = hoy(); guardar(true);
  descargar('cursada-' + hoy() + '.json', JSON.stringify(E, null, 1), 'application/json');
  if (V.tab === 'carrera') render(); // se va el recordatorio de la copia
}
function importar(archivo) {
  if (!archivo) return;
  if (V.demo) { E = V.demo; V.demo = null; }
  if (archivo.size > 1e6) return aviso('Ese archivo es demasiado grande para ser una copia de Cursada');
  const r = new FileReader();
  r.onload = () => {
    try { const e = JSON.parse(r.result); if (!e || e.v !== 1 || typeof e.materias !== 'object') throw new Error(); E = normalizar(e); guardar(); cerrar(); render(); aviso('Copia cargada'); }
    catch (err) { aviso('Ese archivo no es una copia de Cursada'); }
  };
  r.readAsText(archivo);
}
function borrarTodo() { if (!confirm('¿Borrar todas tus notas, fechas y horarios de este navegador? No se puede deshacer.')) return; V.demo = null; E = estadoVacio(); guardar(); cerrar(); render(); aviso('Datos borrados'); }

arrancar();
