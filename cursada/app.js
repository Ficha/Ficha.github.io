// Cursada: gestor para la carrera de Edición (FFyL, UBA). Todo corre en el navegador:
// el plan, el calendario y la oferta horaria son archivos de datos (datos/*.json) y lo que carga
// cada persona se guarda en su localStorage. Sin servidor ni cuentas.
'use strict';

const CLAVE = 'cursada.v1';
const ESTADOS = { pendiente: 'Pendiente', cursando: 'Cursando', regular: 'Regular (falta el final)', aprobada: 'Aprobada' };
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DIAS_C = ['dom.', 'lun.', 'mar.', 'mié.', 'jue.', 'vie.', 'sáb.']; // con punto: "mar. 3 mar" (martes 3 de marzo) no se confunde
const COLORES = ['#1a5f78', '#7b4592', '#a8470f', '#276b44', '#a03352', '#4a59b8', '#7a5f12', '#2f6a70']; // todos con contraste de 5:1 o más contra texto blanco
const D = { plan: null, calendario: null, ofertas: [], ofertasMeta: [], mesas: [], indice: null, resumenes: null, apuntes: {}, biblioteca: null, glosario: null };
const TABS = [['carrera', 'Mi carrera'], ['horarios', 'Horarios'], ['calendario', 'Calendario'], ['resumenes', 'Resúmenes'], ['biblioteca', 'Biblioteca'], ['escandallo', 'Escandallo'], ['glosario', 'Glosario'], ['links', 'Links útiles']];
const CONTACTO = 'fidelchaves96@gmail.com'; // el mismo mail público de ficha.github.io
const V = { escVista: 'uno', tab: 'carrera', vista: 'tabla', oferta: '', verPasados: false, sugeridas: null, verAprobadas: false, verSem: false,
  res: { materia: '', apunte: '' }, quiz: {}, ayuda: {}, tema: '', glo: { q: '', mat: '' } };
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
function estadoVacio() { return { v: 1, carrera: 'edicion', vioAyuda: false, materias: {}, horarios: {}, escandallo: null, comparador: null }; }
// Todo lo que entra (de localStorage o de un archivo importado) se reconstruye campo por campo:
// solo tipos, formatos y largos esperados. Lo que no encaja se descarta.
const RE_ID = /^[\w.-]{1,60}$/, RE_FECHA = /^\d{4}-\d\d-\d\d$/, RE_HORA = /^\d\d:\d\d$/;
const TIPOS = ['Teórico', 'Práctico', 'Teórico-práctico'];
const MODOS_ESC = ['cpu', 'offset', 'demanda'];
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
  return out;
}
function cargarEstado() {
  try { const e = JSON.parse(localStorage.getItem(CLAVE)); if (e && e.v === 1) return normalizar(e); } catch (err) { }
  return estadoVacio();
}
// El estado se carga recién acá: normalizar() usa constantes (RE_ID, TIPOS…) que antes de este punto todavía no existen,
// y leerlo más arriba fallaba en silencio y arrancaba vacío (y el primer cambio pisaba lo guardado).
let E = cargarEstado();
function guardar() {
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
  $('#subtitulo').textContent = 'Gestor para la carrera de ' + D.plan.nombre + ' · ' + D.plan.facultad;
  $('#fuentes').innerHTML = 'Fuentes: ' + D.plan.fuentes.concat([D.calendario.fuente, D.calendario.fuente_feriados].filter(Boolean)).map(f => `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.t)}</a>`).join(', ') + '.';
  document.querySelectorAll('[data-nov]').forEach(el => { el.hidden = !NOVEDADES; });
  if (DONAR.alias) $('#donar').innerHTML = `<button class="btn sec ch" type="button" onclick="abrirDonar()">☕ Doná para mantener este proyecto</button>`;
  const h = location.hash.replace('#', '');
  if (TABS.some(t => t[0] === h)) V.tab = h;
  render();
  manejarLinkNov(); // links de los mails de novedades (#confirmar=, #novedades=, #baja=)
  cargarResumenes(); // índice chico: sirve para ofrecer los resúmenes desde la ficha de cada materia
}
window.addEventListener('hashchange', () => { const h = location.hash.replace('#', ''); if (TABS.some(t => t[0] === h) && h !== V.tab) { V.tab = h; render(); } });

function ir(tab) { V.tab = tab; history.replaceState(null, '', '#' + tab); render(); window.scrollTo(0, 0); }
// Identifica un control para devolverle el foco después de redibujar (si no, quien navega con teclado lo pierde en cada cambio).
const claveFoco = el => el.getAttribute('data-f') || el.id || ((el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 80) + '|' + el.tagName);
function conFoco(raiz, dibujar) {
  const act = document.activeElement, k = act && raiz.contains(act) ? claveFoco(act) : null;
  dibujar();
  if (k) { const el = [...raiz.querySelectorAll('input, select, textarea, button, a[href], summary')].find(x => claveFoco(x) === k); if (el) el.focus({ preventScroll: true }); }
}
function render() {
  $('#pestanas').innerHTML = TABS.map(([id, t]) => `<button ${V.tab === id ? 'aria-current="page"' : ''} onclick="ir(${arg(id)})">${t}</button>`).join('');
  conFoco($('#main'), () => { $('#main').innerHTML = { carrera: vCarrera, horarios: vHorarios, calendario: vCalendario, resumenes: vResumenes, biblioteca: vBiblioteca, escandallo: vEscandallo, glosario: vGlosario, links: vLinks }[V.tab](); });
}

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
  return { aplazos, sinCbc: prom(grupos.carrera), conCbc: prom(todo), sinCbcSinAplazos: prom(sinAp(grupos.carrera)), conCbcSinAplazos: prom(sinAp(todo)) };
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
function vCarrera() {
  const p = progreso(), pr = promedios();
  const dato = (n, t, barra) => `<div class="dato"><b>${n}</b><span>${t}</span>${barra != null ? `<div class="barra"><i style="width:${barra}%"></i></div>` : ''}</div>`;
  const ayuda = !E.vioAyuda && !Object.keys(E.materias).length ? `<div class="tarjeta" style="border-left:5px solid var(--mostaza)"><b>Para empezar</b>
    <p class="chico" style="margin:6px 0">Marcá el estado de cada materia y cargá tus notas: el progreso y el promedio se calculan solos. Tocá el nombre de una materia para anotar parciales, finales y aplazos. En <b>Horarios</b> armás la cursada sin superposiciones.</p>
    <p class="chico" style="margin:6px 0"><b>Tu privacidad:</b> no guardo nada de lo que cargás. No hay cuentas ni servidor: tus notas, fechas y horarios quedan solo en este navegador y nadie más los ve, ni siquiera yo. Solo me llega lo que me mandes a propósito con 💡 Sugerencias, tu mail si te suscribís a las novedades y, si aceptás las cookies, un conteo de visitas de Google Analytics, que no ve lo que cargás.</p>
    <p class="chico" style="margin:6px 0"><b>Tus datos quedan guardados</b> aunque cierres la página, y los ves la próxima vez que entres desde este mismo navegador. <b>Se pierden</b> si entrás desde otro dispositivo o navegador, en modo incógnito, si borrás los datos de navegación o, en Safari, si pasás más de 7 días sin entrar. Para no perderlos, descargá una copia con 💾 Mis datos.</p>
    <button class="btn sec ch" onclick="E.vioAyuda=true;guardar();render()">Entendido</button></div>` : '';
  // Avance: cada requisito del plan (CBC, materias de grado, niveles de idioma y pasantía o tesina) pesa lo mismo.
  const av = Math.round(p.total[0] * 100 / p.total[1]), avReg = Math.round(p.regulares * 100 / p.total[1]);
  const avance = `<div class="avance"><div class="fila"><b class="crece">Llevás el ${av} % de la carrera</b><span class="chico tenue">${p.total[0]} de ${p.total[1]} requisitos aprobados${p.regulares ? ` · ${p.regulares} con el final pendiente` : ''}</span></div>
    <div class="barra grande" role="progressbar" aria-label="Avance de la carrera" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${av}"><i style="width:${av}%"></i>${avReg ? `<i class="reg" style="width:${avReg}%" title="Regulares: falta el final"></i>` : ''}</div></div>`;
  const h = [ayuda + `<div class="tarjeta">${avance}<div class="resumen">
    ${dato(p.materias[0] + '<small class="tenue" style="font-size:1rem"> / ' + p.materias[1] + '</small>', 'materias aprobadas', Math.round(p.materias[0] * 100 / p.materias[1]))}
    ${dato(p.idiomas[0] + '<small class="tenue" style="font-size:1rem"> / ' + p.idiomas[1] + '</small>', 'niveles de idioma', Math.round(p.idiomas[0] * 100 / p.idiomas[1]))}
    ${dato(p.final[0] ? '✓' : '—', 'pasantía o tesina')}
    ${dato(fmtProm(pr.sinCbc), 'promedio sin CBC')}${dato(fmtProm(pr.conCbc), 'promedio con CBC')}
    ${dato(p.cursando, 'cursando ahora')}${dato(p.regulares, 'finales pendientes')}</div>
    <p class="chico tenue" style="margin:12px 0 0">${pr.aplazos ? `<b>Con ${pr.aplazos} ${pr.aplazos === 1 ? 'aplazo' : 'aplazos'}.</b> Sin contarlos: ${fmtProm(pr.sinCbcSinAplazos)} sin CBC y ${fmtProm(pr.conCbcSinAplazos)} con CBC. ` : ''}
      El promedio usa la nota final de cada materia aprobada${pr.aplazos ? '' : ' y los aplazos que cargues en cada materia'}; los idiomas no promedian.</p>
    <p class="chico tenue" style="margin:6px 0 0">${esc(D.plan.requisitos)} ${esc(D.plan.nota)}</p></div>`];
  h.push(`<div class="fila" style="margin-bottom:10px"><button class="btn ${V.vista === 'tabla' ? '' : 'lin'} ch" onclick="V.vista='tabla';render()">Tabla</button>
    <button class="btn ${V.vista === 'recorrido' ? '' : 'lin'} ch" onclick="V.vista='recorrido';render()">Recorrido sugerido</button><span class="crece"></span>
    <button class="btn sec ch" onclick="exportar()">⬇ Descargar copia de mis datos</button><button class="btn lin ch" onclick="window.print()">Imprimir</button></div>`);
  h.push(V.vista === 'recorrido' ? vRecorrido() : D.plan.grupos.map(vGrupo).join(''));
  return h.join('');
}
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
      const cuat = (o && o.cuat) || m.cuat || [], reg = (o && o.regimen) || m.regimen, progs = programas(m, o);
      // Las electivas con opciones fijas se eligen acá mismo (los seminarios y la pasantía o tesina, desde su ficha).
      const elige = m.opciones && m.id !== 'final' ? `<select class="elige-op" data-f="op${esc(m.id)}" aria-label="¿Cuál cursaste o vas a cursar? (${esc(m.nombre)})" onchange="campo(${arg(m.id)},'opcion',this.value)">
        <option value="">¿Cuál elegiste?</option>${m.opciones.map(x => `<option value="${esc(x.id)}" ${e.opcion === x.id ? 'selected' : ''}>${esc(x.nombre)}</option>`).join('')}</select>` : '';
      return `<tr class="${e.estado}"><td><button class="nombre" onclick="abrirMateria(${arg(m.id)})">${esc(nombreDe(m))}</button>${elige}
        <div class="chico tenue">${m.codigo || (o && o.codigo) ? esc(m.codigo || o.codigo) + ' · ' : ''}${m.electiva && !o && !(m.libre && e.detalle) && !elige ? 'A elegir · ' : ''}${reg ? esc(reg) : ''} ${proximaFecha(m.id)}${(e.aplazos || []).length ? ` <span class="chip mal">${e.aplazos.length} ${e.aplazos.length === 1 ? 'aplazo' : 'aplazos'}</span>` : ''}</div></td>
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
  const progs = programas(m, o), reg = (o && o.regimen) || m.regimen, previas = (o && o.previas) || m.previas;
  const recursos = (D.plan.recursos || {})[(o && o.id) || m.id] || [];
  abrir(cab(esc(nombreDe(m))) + `
    <p class="chico tenue" style="margin:0">${[m.codigo || (o && o.codigo), m.area, m.modulo ? 'módulo ' + m.modulo : '', reg].filter(Boolean).map(esc).join(' · ')}</p>
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
    ${D.resumenes && D.resumenes.materias.some(x => x.id === ((o && o.id) || m.id)) ? `<p style="margin:12px 0 0"><button class="btn sec ch" onclick="cerrar();irResumenes(${arg((o && o.id) || m.id)})">📚 Resúmenes y autoevaluación de esta materia</button></p>` : ''}
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
  const todos = c.eventos.concat(fer, misFechas(), mias).sort((a, b) => a.desde < b.desde ? -1 : a.desde > b.desde ? 1 : 0);
  const futuros = todos.filter(e => e.hasta >= t), pasados = todos.filter(e => e.hasta < t);
  const periodo = c.periodos.find(p => p.desde <= t && p.hasta >= t);
  const chip = { examen: ['mal', 'Exámenes'], inscripcion: ['tin', 'Inscripción'], cursada: ['ok', 'Cursada'], tramite: ['ojo', 'Trámite'], info: ['', 'Info'], mio: ['mos', 'Tuyo'], mesa: ['mal', 'Mesa'], feriado: ['ojo', 'Feriado'] };
  const turnos = D.mesas.map(tn => `<details class="tarjeta"><summary style="cursor:pointer"><b>Mesas de examen: ${esc(tn.nombre)}</b> <span class="chico tenue">(${tn.mesas.length}, cargadas el ${fmt(tn.actualizado)})</span></summary>
    <p class="chico tenue">${esc(tn.nota)} <a href="${esc(tn.fuente)}" target="_blank" rel="noopener">Ver la planilla de la Facultad</a>.</p>
    ${tn.mesas.map(x => `<div class="evento"><div class="cuando">${fmt(x.fecha)}</div><div class="crece">${esc(x.nombre)}<span class="chico tenue" style="display:block">${[x.hora && x.hora + ' h', x.aula && 'aula ' + x.aula, x.llamado].filter(Boolean).map(esc).join(' · ')}</span></div></div>`).join('')}</details>`).join('');
  const fila = e => { const enCurso = e.desde <= t && e.hasta >= t; return `<div class="evento ${enCurso ? 'hoy' : ''} ${e.hasta < t ? 'pasado' : ''}"><div class="cuando">${fmtRango(e.desde, e.hasta)}</div>
    <div class="crece">${e.materia ? `<button class="enlace" onclick="abrirMateria(${arg(e.materia)})">${esc(e.t)}</button>` : esc(e.t)}${e.hora ? ' · ' + esc(e.hora) + ' h' : ''}${enCurso && e.desde !== e.hasta ? ' <span class="chico tenue">(en curso)</span>' : ''}</div>
    <span class="chip ${(chip[e.tipo] || chip.info)[0]}">${(chip[e.tipo] || chip.info)[1]}</span></div>`; };
  let semana = '';
  if (periodo) { const n = Math.floor((fecha(t) - fecha(periodo.desde)) / 6048e5) + 1, tot = Math.ceil((fecha(periodo.hasta) - fecha(periodo.desde)) / 6048e5); semana = `<div class="tarjeta"><b>${esc(periodo.nombre)}</b>: semana ${n} de ${tot}<div class="barra"><i style="width:${Math.round(n * 100 / tot)}%;background:var(--tinta)"></i></div></div>`; }
  return `${semana}<div class="titulo-sec"><h2>Lo que viene</h2><span class="fila">${V.oferta && E.horarios[V.oferta] && elegidas().length && periodoDe(V.oferta) ? '<button class="btn sec ch" onclick="ayudaCalendario()">📅 Llevar mi cursada al calendario</button>' : ''}${misFechas().length ? '<button class="btn sec ch" onclick="exportarIcs()">Llevar mis fechas al calendario (.ics)</button>' : ''}</span></div>
    <p class="chico tenue" style="margin:-4px 0 8px">Calendario académico ${c.anio} de la Facultad más tus parciales y finales (se cargan desde cada materia, en Mi carrera). ${esc(c.nota)}</p>
    <div class="tarjeta" style="padding:6px 16px">${futuros.map(fila).join('') || '<p class="vacio">No queda nada en el calendario de este año.</p>'}</div>
    ${turnos}
    ${pasados.length ? `<button class="btn lin ch" onclick="V.verPasados=!V.verPasados;render()">${V.verPasados ? 'Ocultar' : 'Ver'} lo que ya pasó (${pasados.length})</button>${V.verPasados ? `<div class="tarjeta" style="padding:6px 16px;margin-top:10px">${pasados.map(fila).join('')}</div>` : ''}` : ''}`;
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
// RESÚMENES: apuntes propios por materia (resumenes/*.json, los arma gestor-facultad/resumenes.py)
// =====================================================================
async function cargarResumenes() {
  if (D.resumenes || cargarResumenes.va) return;
  cargarResumenes.va = true;
  try { const r = await fetch('resumenes/indice.json'); if (!r.ok) throw new Error(); D.resumenes = await r.json(); }
  catch (e) { D.resumenes = { materias: [], error: true }; }
  if (V.tab === 'resumenes') render();
}
async function abrirApunte(materia, id) {
  if (!RE_ID.test(materia) || !RE_ID.test(id)) return;
  V.res = { materia, apunte: id };
  const k = materia + '/' + id;
  if (!D.apuntes[k]) {
    render();
    try { const r = await fetch('resumenes/' + k + '.json'); if (!r.ok) throw new Error(); D.apuntes[k] = await r.json(); }
    catch (e) { V.res.apunte = ''; aviso('No se pudo cargar el apunte'); }
  }
  render(); window.scrollTo(0, 0);
}
function vResumenes() {
  if (!D.resumenes) { cargarResumenes(); return '<p class="cargando">Cargando los resúmenes…</p>'; }
  if (V.res.apunte) return vApunte();
  const R = D.resumenes;
  if (!R.materias.length) return '<p class="vacio">No se pudieron cargar los resúmenes. Probá recargar la página.</p>';
  return `<p class="chico tenue">${esc(R.nota)}</p>` + R.materias.map(m => `<div class="titulo-sec" id="res-${esc(m.id)}"><h2>${esc(m.nombre)}</h2><span class="chico tenue">Para el ${esc(m.examen)} · ${m.anio}</span></div>
    ${m.id === '0909' ? `<p class="chico" style="margin:-4px 0 8px">🧮 Para practicar el escandallo con tus números: <button class="enlace" onclick="ir('escandallo')">simulador de escandallo</button>.</p>` : ''}
    <div class="tarjeta" style="padding:6px 16px">${m.apuntes.map(a => `<button class="evento fila-boton" onclick="abrirApunte(${arg(m.id)},${arg(a.id)})">
      <span class="clave">${esc(a.clave)}</span><span class="crece"><b>${esc(a.t)}</b><span class="chico tenue" style="display:block">${a.min} min de lectura${a.preguntas ? ' · ' + a.preguntas + ' preguntas para autoevaluarte' : ''}</span></span><span aria-hidden="true">›</span></button>`).join('')}</div>
    ${m.pdfs.length ? `<details class="tarjeta"><summary class="resumen-pdf"><b>Hojas de repaso para imprimir</b> <span class="chip">${m.pdfs.length} PDF</span></summary>
      ${m.pdfs.map(p => `<a class="evento" style="color:inherit;text-decoration:none" href="resumenes/${esc(encodeURI(p.archivo))}" target="_blank" rel="noopener">📄 <span class="crece">${esc(p.t)}</span> ↗</a>`).join('')}</details>` : ''}`).join('');
}
const LETRAS = 'abcd';
function vApunte() {
  const { materia, apunte } = V.res, k = materia + '/' + apunte, a = D.apuntes[k];
  const m = D.resumenes.materias.find(x => x.id === materia) || { nombre: '', apuntes: [] };
  const volver = `<button class="btn lin ch" onclick="V.res.apunte='';render()">← ${esc(m.nombre) || 'Resúmenes'}</button>`;
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
  return `<div class="fila">${volver}<span class="crece"></span><span class="chico tenue">${esc(m.nombre)}</span></div>
    <article class="tarjeta apunte"><h2>${esc(a.titulo)}</h2>${a.cuerpo}</article>
    ${a.preguntas.length ? `<div class="titulo-sec" id="autoevaluacion"><h2>Autoevaluación</h2>
      ${cerradas.length ? `<span class="chico">${hechas.length ? `<b>${bien.length} de ${hechas.length}</b> bien` : 'Tocá la opción que te parezca correcta'}${hechas.length ? ` · <button class="enlace" onclick="V.quiz[${arg(k)}]={};render()">Empezar de nuevo</button>` : ''}</span>` : ''}</div>
      <div class="tarjeta">${a.preguntas.map(pregunta).join('')}</div>` : ''}
    <div class="fila" style="margin-top:12px">${ant ? `<button class="btn lin ch" onclick="abrirApunte(${arg(materia)},${arg(ant.id)})">← ${esc(ant.clave)}</button>` : ''}<span class="crece"></span>
      ${sig ? `<button class="btn sec ch" onclick="abrirApunte(${arg(materia)},${arg(sig.id)})">${esc(sig.clave)}: ${esc(sig.t)} →</button>` : ''}</div>`;
}
function irResumenes(materia) { V.res = { materia, apunte: '' }; ir('resumenes'); setTimeout(() => { const el = document.getElementById('res-' + materia); if (el) el.scrollIntoView(); }, 50); }
function responder(k, n, x) { const q = V.quiz[k] = V.quiz[k] || {}; if (q[n] != null) return; q[n] = Number(x); render(); }

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
function vEscandallo() {
  const b = (id, t) => `<label class="elige ${V.escVista === id ? 'on' : ''}"><input type="radio" name="esc-vista" data-f="vista-${id}" ${V.escVista === id ? 'checked' : ''} onchange="V.escVista=${arg(id)};render()"><span>${t}</span></label>`;
  return `<div class="eligen" style="margin-bottom:12px">${b('uno', 'Un título: escandallo')}${b('varios', 'Varios títulos: compararlos')}</div>` + (V.escVista === 'varios' ? vComparador() : vEscandalloUno());
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
  const veredicto = { ok: 'Viable: el margen supera el 30 %.', ojo: 'En el límite: el margen está entre 25 y 30 %.', mal: r.mcu <= 0 ? 'No cierra: el libro cuesta más de lo que ingresa.' : 'No conviene: el margen es menor que el 25 %.' }[nivel];
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
      <div class="dato"><b>${$$(r.cdu)}</b><span>Costo directo unitario (CDU) ${ay('cdu')}</span>${exp('cdu')}</div>
      <div class="dato"><b>${$$(r.totalGastos)}</b><span>Gastos comerciales por libro ${ay('gastos')}</span>${exp('gastos')}</div>
      <div class="dato"><b>${$$(r.cdt)}</b><span>Costo directo total (CDT) ${ay('cdt')}</span>${exp('cdt')}</div>
      ${r.ce ? `<div class="dato"><b>${$$(r.cgt)}</b><span>Costo global total (CGT) ${ay('cgt')}</span>${exp('cgt')}</div>` : ''}
      <div class="dato"><b>${$$(r.marginal)}</b><span>Costo marginal ${ay('marginal')}</span>${exp('marginal')}</div></div></div>
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
// GLOSARIO: términos clave de todas las materias (datos/glosario.json, armado con gestor-facultad/glosario.py)
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
  return `<p class="chico tenue" style="margin-top:0">Los términos clave de cada materia, para buscar rápido. Si una palabra se usa en más de una materia, aparece con la etiqueta de cada una; si significa algo distinto en cada una, se separan las acepciones. Armado a partir de mis apuntes: pueden tener errores (avisame con 💡 Sugerencias).</p>
    <div class="eligen" role="group" aria-label="Filtrar por materia" style="margin-bottom:10px">${mats.map(m => `<button class="btn ${V.glo.mat === m.id ? '' : 'lin'} ch" aria-pressed="${V.glo.mat === m.id}" data-f="glo-${esc(m.id)}" title="${esc(m.nombre || '')}" onclick="V.glo.mat=${arg(m.id)};render()">${esc(m.corto)}</button>`).join('')}</div>
    <label class="solo-lector" for="glo-q">Buscar un término</label>
    <input id="glo-q" type="search" autocomplete="off" placeholder="Buscar un término o parte de su definición" value="${esc(V.glo.q)}" style="width:100%;margin-bottom:12px" oninput="V.glo.q=this.value;$('#glo-lista').innerHTML=glosarioLista()">
    <div id="glo-lista">${glosarioLista()}</div>`;
}

// =====================================================================
// LINKS ÚTILES y SUGERENCIAS
// =====================================================================
function vLinks() {
  const G = D.plan.guia;
  return (G ? `<div class="titulo-sec"><h2>Lo básico de la cursada</h2></div><div class="tarjeta guia">${G.items.map(i => `<details><summary>${esc(i.t)}</summary><p class="chico">${esc(i.d)}</p></details>`).join('')}
    <p class="chico tenue" style="margin:10px 0 0">${esc(G.fuente)}</p></div>` : '') +
    `<p class="chico tenue">Los sitios oficiales que más se usan durante la cursada. Si falta alguno, avisame con 💡 Sugerencias.</p>` +
    (D.plan.links || []).map(g => `<div class="titulo-sec"><h2>${esc(g.grupo)}</h2></div><div class="tarjeta" style="padding:6px 16px">
      ${g.links.map(l => `<a class="evento" style="text-decoration:none;color:inherit" href="${esc(l.url)}" target="_blank" rel="noopener"><span class="crece"><b style="color:var(--tinta)">${esc(l.t)} ↗</b>
        ${l.d ? `<span class="chico tenue" style="display:block">${esc(l.d)}</span>` : ''}</span></a>`).join('')}</div>`).join('');
}
// El sitio es estático: la sugerencia va a un buzón aparte (un Apps Script, ver gestor-facultad/sugerencias)
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
    <p class="chico tenue" id="i-n">Le llega a Fidel. No se manda nada de tus notas ni de tus horarios.</p>`);
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
// Apagado hasta desplegar Novedades.gs en el script del buzón (ver gestor-facultad/REFERENCIA.md); con false no se ve el botón ni el cartel.
const NOVEDADES = false;
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
      <li>usás Safari (iPhone, iPad o Mac) y pasás más de 7 días sin entrar: Safari borra solo lo que guardan los sitios que no visitás.</li>
    </ul>
    <p>Para no perder nada, descargá una copia cada tanto; con ella también pasás tus datos a otro dispositivo.</p>
    <p class="chico tenue">Si esta computadora es compartida (la de la facultad, un locutorio), cualquiera que abra esta página acá va a ver lo que cargaste: al terminar, descargá tu copia y tocá “Borrar todo”.</p>
    <div class="botones"><button class="btn" onclick="exportar()">Descargar una copia</button>
      <label class="btn sec" style="display:inline-flex;align-items:center;cursor:pointer">Cargar una copia<input type="file" accept=".json,application/json" hidden onchange="importar(this.files[0])"></label>
      <button class="btn pel" onclick="borrarTodo()">Borrar todo</button></div>
    <p class="chico tenue" style="margin-top:14px">La copia es un archivo .json: guardalo en tu Drive o mandátelo por mail, y con “Cargar una copia” lo recuperás en cualquier dispositivo.</p>`);
}
function exportar() { descargar('cursada-' + hoy() + '.json', JSON.stringify(E, null, 1), 'application/json'); }
function importar(archivo) {
  if (!archivo) return;
  if (archivo.size > 1e6) return aviso('Ese archivo es demasiado grande para ser una copia de Cursada');
  const r = new FileReader();
  r.onload = () => {
    try { const e = JSON.parse(r.result); if (!e || e.v !== 1 || typeof e.materias !== 'object') throw new Error(); E = normalizar(e); guardar(); cerrar(); render(); aviso('Copia cargada'); }
    catch (err) { aviso('Ese archivo no es una copia de Cursada'); }
  };
  r.readAsText(archivo);
}
function borrarTodo() { if (!confirm('¿Borrar todas tus notas, fechas y horarios de este navegador? No se puede deshacer.')) return; E = estadoVacio(); guardar(); cerrar(); render(); aviso('Datos borrados'); }

arrancar();
