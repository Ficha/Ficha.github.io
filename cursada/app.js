// Cursada: gestor para la carrera de Edición (FFyL, UBA). Todo corre en el navegador:
// el plan, el calendario y la oferta horaria son archivos de datos (datos/*.json) y lo que carga
// cada persona se guarda en su localStorage. Sin servidor ni cuentas.
'use strict';

const CLAVE = 'cursada.v1';
const ESTADOS = { pendiente: 'Pendiente', cursando: 'Cursando', regular: 'Regular (falta el final)', aprobada: 'Aprobada' };
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const DIAS_C = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const COLORES = ['#1f6f8b', '#8a4fa0', '#c2571a', '#2e7d4f', '#b03a5b', '#5a6acf', '#8b6f1f', '#3d7f86'];
const D = { plan: null, calendario: null, ofertas: [], mesas: [], indice: null };
const TABS = [['carrera', 'Mi carrera'], ['horarios', 'Horarios'], ['calendario', 'Calendario'], ['links', 'Links útiles']];
const CONTACTO = 'fidelchaves96@gmail.com'; // el mismo mail público de ficha.github.io
const V = { tab: 'carrera', vista: 'tabla', oferta: '', verPasados: false, sugeridas: null };
let E = cargarEstado();

// ---------- utilidades ----------
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const iso = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const hoy = () => iso(new Date());
const fecha = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const fmt = s => { const d = fecha(s); return DIAS_C[d.getDay()] + ' ' + d.getDate() + ' ' + MESES[d.getMonth()]; };
const fmtRango = (a, b) => !b || a === b ? fmt(a) : fecha(a).getDate() + (a.slice(0, 7) === b.slice(0, 7) ? '' : ' ' + MESES[fecha(a).getMonth()]) + ' al ' + fecha(b).getDate() + ' ' + MESES[fecha(b).getMonth()];
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
let avisoT;
function aviso(t) { const a = $('#aviso'); a.textContent = t; a.classList.add('on'); clearTimeout(avisoT); avisoT = setTimeout(() => a.classList.remove('on'), 2400); }

// ---------- estado (localStorage) ----------
function estadoVacio() { return { v: 1, carrera: 'edicion', materias: {}, horarios: {} }; }
function cargarEstado() {
  try { const e = JSON.parse(localStorage.getItem(CLAVE)); if (e && e.v === 1) return Object.assign(estadoVacio(), e); } catch (err) { }
  return estadoVacio();
}
function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(E)); } catch (err) { aviso('No se pudo guardar en este navegador'); } }
const mat = id => (E.materias[id] = E.materias[id] || { estado: 'pendiente', examenes: [] });
const datosMateria = id => D.plan.materias.find(m => m.id === id);
// Datos de la opción elegida en una electiva (programa, régimen), si los tiene.
function opcion(m) { const e = E.materias[m.id]; return (m.opciones || []).find(o => e && o.id === e.opcion) || null; }
const nombreDe = m => { const o = opcion(m), e = E.materias[m.id] || {}; return o ? o.nombre : (m.libre && e.detalle ? 'Seminario: ' + e.detalle : m.nombre); };

// ---------- carga de datos ----------
async function json(archivo) { const r = await fetch('datos/' + archivo); if (!r.ok) throw new Error(archivo); return r.json(); }
async function arrancar() {
  try {
    D.indice = await json('indice.json');
    const c = D.indice.carreras.find(x => x.id === E.carrera) || D.indice.carreras[0];
    D.plan = await json(c.archivo);
    D.calendario = await json(D.indice.calendarios[D.indice.calendarios.length - 1].archivo);
    D.ofertas = await Promise.all(D.indice.ofertas.filter(o => o.carrera === D.plan.id).map(o => json(o.archivo)));
    D.mesas = (await Promise.all((D.indice.mesas || []).filter(o => o.carrera === D.plan.id).map(o => json(o.archivo).catch(() => null)))).filter(Boolean);
    V.oferta = D.ofertas.length ? D.ofertas[D.ofertas.length - 1].id : '';
  } catch (err) {
    $('#main').innerHTML = '<p class="vacio">No se pudieron cargar los datos (' + esc(err.message) + '). Probá recargar la página.</p>';
    return;
  }
  $('#subtitulo').textContent = 'Gestor para la carrera de ' + D.plan.nombre + ' · ' + D.plan.facultad;
  $('#fuentes').innerHTML = 'Fuentes: ' + D.plan.fuentes.concat([D.calendario.fuente]).map(f => `<a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.t)}</a>`).join(', ') + '.';
  const h = location.hash.replace('#', '');
  if (TABS.some(t => t[0] === h)) V.tab = h;
  render();
}
window.addEventListener('hashchange', () => { const h = location.hash.replace('#', ''); if (TABS.some(t => t[0] === h) && h !== V.tab) { V.tab = h; render(); } });

function ir(tab) { V.tab = tab; history.replaceState(null, '', '#' + tab); render(); window.scrollTo(0, 0); }
function render() {
  $('#pestanas').innerHTML = TABS.map(([id, t]) => `<button role="tab" aria-selected="${V.tab === id}" onclick="ir('${id}')">${t}</button>`).join('') +
    '<span style="flex:1"></span><button onclick="idea()" title="Dejar una sugerencia o un comentario">💡 Sugerencias</button>';
  $('#main').innerHTML = { carrera: vCarrera, horarios: vHorarios, calendario: vCalendario, links: vLinks }[V.tab]();
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
  const notas = D.plan.materias.map(m => Number(String((E.materias[m.id] || {}).nota || '').replace(',', '.'))).filter((n, i) => n > 0 && (E.materias[D.plan.materias[i].id] || {}).estado === 'aprobada');
  return { materias: [ok(materias), materias.length], idiomas: [ok(de('idiomas')), de('idiomas').length], final: [ok(de('final')), de('final').length],
    cursando: D.plan.materias.filter(m => (E.materias[m.id] || {}).estado === 'cursando').length,
    regulares: D.plan.materias.filter(m => (E.materias[m.id] || {}).estado === 'regular').length,
    promedio: notas.length ? (notas.reduce((a, b) => a + b, 0) / notas.length) : null, total: [ok(D.plan.materias), D.plan.materias.length] };
}
function vCarrera() {
  const p = progreso(), pr = promedios();
  const dato = (n, t, barra) => `<div class="dato"><b>${n}</b><span>${t}</span>${barra != null ? `<div class="barra"><i style="width:${barra}%"></i></div>` : ''}</div>`;
  const h = [`<div class="tarjeta"><div class="resumen">
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
    <button class="btn lin ch" onclick="window.print()">Imprimir</button></div>`);
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
    <div class="tarjeta" style="padding:6px 12px"><table class="tabla"><thead><tr><th>Materia</th><th>Se dicta</th><th>Estado</th><th>Nota</th><th></th></tr></thead><tbody>
    ${L.map(m => {
      const e = E.materias[m.id] || { estado: 'pendiente' }, o = opcion(m);
      const cuat = (o && o.cuat) || m.cuat || [], reg = (o && o.regimen) || m.regimen, prog = (o && o.programa) || m.programa;
      return `<tr class="${e.estado}"><td><button class="nombre" onclick="abrirMateria('${m.id}')">${esc(nombreDe(m))}</button>
        <div class="chico tenue">${m.codigo || (o && o.codigo) ? esc(m.codigo || o.codigo) + ' · ' : ''}${m.electiva && !o && !(m.libre && e.detalle) ? 'A elegir · ' : ''}${reg ? esc(reg) : ''} ${proximaFecha(m.id)}${(e.aplazos || []).length ? ` <span class="chip mal">${e.aplazos.length} ${e.aplazos.length === 1 ? 'aplazo' : 'aplazos'}</span>` : ''}</div></td>
        <td class="ctl">${cuat.map(c => `<span class="chip">${c}</span>`).join(' ')}</td>
        <td class="ctl"><select aria-label="Estado de ${esc(m.nombre)}" onchange="setEstado('${m.id}',this.value)">${Object.keys(ESTADOS).map(k => `<option value="${k}" ${e.estado === k ? 'selected' : ''}>${ESTADOS[k]}</option>`).join('')}</select></td>
        <td class="ctl"><input class="nota" inputmode="decimal" placeholder="Nota" aria-label="Nota de ${esc(m.nombre)}" value="${esc(e.nota || '')}" onchange="setNota('${m.id}',this.value)"></td>
        <td class="ctl">${prog ? `<a class="chico" href="${esc(prog)}" target="_blank" rel="noopener">Programa</a>` : ''}</td></tr>`;
    }).join('')}</tbody></table></div>`;
}
function setEstado(id, estado) { mat(id).estado = estado; guardar(); render(); }
function setNota(id, v) {
  const n = String(v).trim().replace(',', '.');
  if (n && !(Number(n) >= 1 && Number(n) <= 10)) { aviso('La nota va de 1 a 10'); render(); return; }
  mat(id).nota = n.replace('.', ',');
  if (n && Number(n) >= 4 && mat(id).estado !== 'aprobada') mat(id).estado = 'aprobada';
  guardar(); render();
}
function vRecorrido() {
  const celdas = [];
  D.plan.areas.forEach(a => {
    celdas.push(`<div class="area">${esc(a)}</div>`);
    for (let mod = 1; mod <= 4; mod++) {
      celdas.push('<div class="celda">' + D.plan.materias.filter(m => m.area === a && m.modulo === mod).map(m =>
        `<button class="mat ${(E.materias[m.id] || {}).estado || ''}" onclick="abrirMateria('${m.id}')">${esc(nombreDe(m))}</button>`).join('') + '</div>');
    }
  });
  return `<p class="chico tenue">Orden sugerido por el Departamento de Edición, por áreas. No es obligatorio: la carrera no tiene correlatividades.
    <span class="chip mos">cursando</span> <span class="chip ojo">regular</span> <span class="chip ok">aprobada</span></p>
    <div class="recorrido"><div></div>${[1, 2, 3, 4].map(n => `<div class="cab">Módulo ${n}</div>`).join('')}${celdas.join('')}</div>
    <p class="chico tenue" style="margin-top:12px">Idiomas y pasantía o tesina no figuran acá: se cursan en paralelo. Están en la vista Tabla.</p>`;
}

// ---------- ficha de una materia ----------
function abrir(html) { const d = $('#dlg'); d.innerHTML = `<div class="in">${html}</div>`; if (!d.open) d.showModal(); }
function cerrar() { const d = $('#dlg'); if (d.open) d.close(); }
$('#dlg').addEventListener('click', e => { if (e.target.id === 'dlg') cerrar(); });
const cab = t => `<div class="cab"><h2 class="crece">${t}</h2><button class="x" onclick="cerrar()" aria-label="Cerrar">✕</button></div>`;
const val = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };

function abrirMateria(id) {
  const m = datosMateria(id), e = mat(id), o = opcion(m);
  const prog = (o && o.programa) || m.programa, reg = (o && o.regimen) || m.regimen;
  const recursos = (D.plan.recursos || {})[(o && o.id) || m.id] || [];
  abrir(cab(esc(nombreDe(m))) + `
    <p class="chico tenue" style="margin:0">${[m.codigo || (o && o.codigo), m.area, m.modulo ? 'módulo ' + m.modulo : '', reg].filter(Boolean).map(esc).join(' · ')}</p>
    ${m.ayuda ? `<p class="chico">${esc(m.ayuda)}</p>` : ''}
    ${m.opciones ? `<label class="c">¿Cuál elegís?</label><select id="m-op" onchange="campo('${id}','opcion',this.value);abrirMateria('${id}')"><option value="">Todavía no sé</option>${m.opciones.map(x => `<option value="${x.id}" ${e.opcion === x.id ? 'selected' : ''}>${esc(x.nombre)}</option>`).join('')}</select>` : ''}
    ${m.libre ? `<label class="c">¿Qué seminario?</label><input id="m-det" style="width:100%" value="${esc(e.detalle || '')}" placeholder="Nombre del seminario" onchange="campo('${id}','detalle',this.value)">` : ''}
    <div class="fila"><div class="crece"><label class="c">Estado</label><select style="width:100%" onchange="campo('${id}','estado',this.value)">${Object.keys(ESTADOS).map(k => `<option value="${k}" ${e.estado === k ? 'selected' : ''}>${ESTADOS[k]}</option>`).join('')}</select></div>
      <div><label class="c">Nota final</label><input class="nota" style="width:90px" inputmode="decimal" value="${esc(e.nota || '')}" onchange="setNota('${id}',this.value)"></div></div>
    <div class="fila"><div class="crece"><label class="c">Cuándo la cursaste o cursás</label><input style="width:100%" value="${esc(e.cuando || '')}" placeholder="Ej.: 2.º cuatrimestre 2026" onchange="campo('${id}','cuando',this.value)"></div>
      <div><label class="c">Fecha de aprobación</label><input type="date" value="${esc(e.aprobada || '')}" onchange="campo('${id}','aprobada',this.value)"></div></div>
    <label class="c">Aplazos (finales desaprobados; cuentan para el promedio)</label>
    <div class="fila">${(e.aplazos || []).map((a, i) => `<span class="chip mal" style="font-size:.85rem;padding:4px 10px">${esc(a)} <button class="enlace" style="color:inherit;text-decoration:none" onclick="borrarAplazo('${id}',${i})" aria-label="Quitar aplazo">✕</button></span>`).join('')}
      <select id="m-ap" aria-label="Nota del aplazo"><option value="2">2</option><option value="1">1</option><option value="3">3</option></select>
      <button class="btn lin ch" onclick="sumarAplazo('${id}')">＋ Agregar aplazo</button></div>
    ${mesasDe(m).length ? `<label class="c">Mesas de examen publicadas</label>` + mesasDe(m).map(x => `<div class="fila chico" style="padding:4px 0"><span class="crece">${fmt(x.fecha)}${x.hora ? ', ' + esc(x.hora) + ' h' : ''}${x.aula ? ' · aula ' + esc(x.aula) : ''} <span class="tenue">(${esc(x.llamado || x.turno)})</span></span>
      ${x.fecha >= hoy() ? `<button class="btn lin ch" onclick="mesaAMisFechas('${id}','${x.fecha}','${esc(x.hora)}','${esc(x.aula)}')">Voy a esta</button>` : ''}</div>`).join('') : ''}
    ${prog ? `<p style="margin:12px 0 0"><a href="${esc(prog)}" target="_blank" rel="noopener">Programa oficial${m.programa_anio ? ' (' + m.programa_anio + ')' : ''} ↗</a></p>` : ''}
    ${recursos.length ? `<label class="c">Apuntes y recursos</label>${recursos.map(r => `<p style="margin:2px 0"><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.t)} ↗</a></p>`).join('')}` : ''}
    <div class="titulo-sec"><h3>Parciales, entregas y finales</h3></div>
    ${(e.examenes || []).slice().sort((a, b) => (a.fecha || '') < (b.fecha || '') ? -1 : 1).map(x => `<div class="fila" style="padding:6px 0;border-bottom:1px solid var(--borde)">
      <span class="crece"><b>${esc(x.tipo)}</b>${x.detalle ? ' · ' + esc(x.detalle) : ''}<span class="chico tenue" style="display:block">${x.fecha ? fmt(x.fecha) + (x.hora ? ', ' + esc(x.hora) + ' h' : '') : 'sin fecha'}${x.nota ? ' · nota: ' + esc(x.nota) : ''}</span></span>
      <input class="nota" style="width:70px" inputmode="decimal" placeholder="Nota" value="${esc(x.nota || '')}" onchange="notaExamen('${id}','${x.id}',this.value)">
      <button class="btn lin ch" onclick="borrarExamen('${id}','${x.id}')" aria-label="Borrar">✕</button></div>`).join('') || '<p class="chico tenue">Todavía no cargaste fechas.</p>'}
    <div class="fila" style="margin-top:8px"><select id="x-tipo"><option>Parcial</option><option>Recuperatorio</option><option>Entrega</option><option>Final</option><option>Otro</option></select>
      <input type="date" id="x-fecha"><input type="time" id="x-hora" style="width:110px"><input id="x-det" class="crece" placeholder="Detalle (opcional)">
      <button class="btn sec" onclick="sumarExamen('${id}')">Agregar</button></div>
    <label class="c">Mis notas</label><textarea placeholder="Cátedra, comisión, bibliografía que falta, contactos…" onchange="campo('${id}','apuntes',this.value)">${esc(e.apuntes || '')}</textarea>
    <div class="botones"><button class="btn" onclick="cerrar()">Listo</button></div>`);
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
function hor() { return (E.horarios[V.oferta] = E.horarios[V.oferta] || { materias: [], elegidas: {}, propias: [], bloqueos: [], sinSabado: false }); }
const oferta = () => D.ofertas.find(o => o.id === V.oferta) || { comisiones: [], nombre: '' };
const comisiones = () => oferta().comisiones.concat(hor().propias);
// Id de materia de una comisión → nombre para mostrar (del plan, o el texto libre que se cargó a mano).
const extra = id => (oferta().extras || []).find(x => x.id === id);
function nombreMateria(id) { const x = extra(id); if (x) return x.tipo + ': ' + x.nombre; const m = D.plan.materias.find(x => x.id === id || (x.opciones || []).some(o => o.id === id)); if (!m) return id; const o = (m.opciones || []).find(x => x.id === id); return o ? o.nombre : m.nombre; }
const SIGLAS = { '0921': 'EEM', '0922': 'EPP', '0912': 'PPEP', '0923': 'PPIP' };
const siglaMateria = id => { const x = extra(id); if (x) return x.tipo.slice(0, 3).toUpperCase() + ' ' + x.nombre.split(/\s+/)[0]; if (SIGLAS[id]) return SIGLAS[id];
  const m = D.plan.materias.find(x => x.id === id); return m ? m.sigla : nombreMateria(id).split(/\s+/).map(w => w[0]).join('').slice(0, 5).toUpperCase(); };
function elegidas() { const h = hor(), C = comisiones(); return Object.keys(h.elegidas).filter(k => h.materias.indexOf(k.split('|')[0]) >= 0).map(k => C.find(c => c.id === h.elegidas[k])).filter(Boolean); }
const colorDe = id => COLORES[Math.max(0, hor().materias.indexOf(id)) % COLORES.length];

function vHorarios() {
  const h = hor(), of = oferta(), C = comisiones();
  const disponibles = [...new Set(C.map(c => c.materia))];
  const sel = elegidas(), ch = Horarios.choques(sel), r = Horarios.resumen(sel, h.bloqueos);
  const out = [];
  out.push(`<div class="fila" style="margin-bottom:10px">${D.ofertas.length > 1 ? `<select onchange="V.oferta=this.value;V.sugeridas=null;render()">${D.ofertas.map(o => `<option value="${o.id}" ${o.id === V.oferta ? 'selected' : ''}>${esc(o.nombre)}</option>`).join('')}</select>` : `<h2>${esc(of.nombre)}</h2>`}
    <span class="crece"></span><button class="btn sec ch" onclick="horarioPropio()">＋ Cargar un horario a mano</button></div>`);
  if (of.nota && !of.comisiones.length) out.push(`<div class="tarjeta chico">${esc(of.nota)}</div>`);
  if (of.fuente) out.push(`<p class="chico tenue">Oferta publicada por la Facultad${of.actualizado ? ', cargada el ' + fmt(of.actualizado) : ''}. <a href="${esc(of.fuente)}" target="_blank" rel="noopener">Ver la planilla original</a>. Puede haber cambios de último momento.</p>`);

  // 1. Qué materias.
  out.push(`<div class="titulo-sec"><h2>1. ¿Qué querés cursar?</h2></div><div class="tarjeta">`);
  out.push(disponibles.length ? `<div class="fila">${disponibles.map(id => `<label class="chip" style="cursor:pointer;padding:6px 10px;font-size:.85rem;${h.materias.indexOf(id) >= 0 ? 'background:' + colorDe(id) + ';color:#fff' : ''}">
      <input type="checkbox" style="min-height:0;margin-right:4px" ${h.materias.indexOf(id) >= 0 ? 'checked' : ''} onchange="quieroCursar('${esc(id)}',this.checked)">${esc(nombreMateria(id))}</label>`).join('')}</div>`
    : '<p class="vacio" style="padding:10px">No hay horarios cargados para este cuatrimestre. Cargá los de tus materias con “Cargar un horario a mano”.</p>');
  out.push('</div>');

  // 2. Comisiones.
  if (h.materias.length) {
    out.push(`<div class="titulo-sec"><h2>2. Elegí comisiones</h2><button class="btn ch" onclick="sugerir()">✨ Sugerir combinaciones</button></div>`);
    if (V.sugeridas) out.push(vSugeridas());
    Horarios.grupos(h.materias, C).forEach(g => {
      const clave = g.materia + '|' + g.tipo;
      out.push(`<div class="tarjeta" style="border-left:5px solid ${colorDe(g.materia)}"><b>${esc(nombreMateria(g.materia))}</b> <span class="chip">${esc(g.tipo)}</span>
        ${g.opciones.map(c => `<label class="comision"><input type="radio" name="${esc(clave)}" ${h.elegidas[clave] === c.id ? 'checked' : ''} onchange="elegirComision('${esc(clave)}','${c.id}')">
          <span class="crece"><b>${esc(c.nombre || 'Única')}</b> · ${c.bloques.map(b => Horarios.DIAS[b.dia] + ' ' + b.desde + '-' + b.hasta).join(' y ')}
          <span class="chico tenue" style="display:block">${[c.docente, c.aula, c.modalidad].filter(Boolean).map(esc).join(' · ')}${c.propia ? ' · cargado por vos' : ''}</span></span>
          ${c.propia ? `<button class="btn lin ch" onclick="event.preventDefault();borrarPropia('${c.id}')" aria-label="Borrar">✕</button>` : ''}</label>`).join('')}</div>`);
    });
  }

  // 3. La semana.
  out.push(`<div class="titulo-sec"><h2>${h.materias.length ? '3. ' : ''}Tu semana</h2><button class="btn lin ch" onclick="bloqueo()">＋ Horario en que no puedo</button></div>`);
  if (ch.length) out.push(`<div class="tarjeta" style="border-color:var(--mal);background:var(--mal-suave)"><b>⚠ ${ch.length === 1 ? 'Hay una superposición' : 'Hay ' + ch.length + ' superposiciones'}</b>
    ${ch.map(x => `<div class="chico">${Horarios.DIAS[x.dia]} ${x.desde}-${x.hasta}: ${esc(siglaMateria(x.a.materia))} (${esc(x.a.tipo)}) con ${esc(siglaMateria(x.b.materia))} (${esc(x.b.tipo)})</div>`).join('')}</div>`);
  if (r.enBloqueo) out.push(`<div class="tarjeta" style="border-color:var(--ojo);background:var(--ojo-suave)"><b>Se pisa con un horario en que no podés</b> (${Math.round(r.enBloqueo / 60 * 10) / 10} h).</div>`);
  if (sel.length) out.push(`<p class="chico tenue">${r.dias.length} ${r.dias.length === 1 ? 'día' : 'días'} por semana (${r.dias.map(d => Horarios.DIAS[d].toLowerCase()).join(', ')}) · ${Math.round(r.clase / 60 * 10) / 10} h de clase${r.huecos ? ' · ' + Math.round(r.huecos / 60 * 10) / 10 + ' h de huecos' : ''}</p>`);
  out.push(grilla(sel, h.bloqueos, ch));
  if (h.bloqueos.length) out.push(`<p class="chico tenue" style="margin-top:8px">No puedo: ${h.bloqueos.map((b, i) => `${esc(b.t || '')} ${Horarios.DIAS[b.dia].toLowerCase()} ${b.desde}-${b.hasta} <button class="enlace" onclick="borrarBloqueo(${i})">quitar</button>`).join(' · ')}</p>`);
  return out.join('');
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
  return `<div class="grilla"><div class="dia"></div>${[1, 2, 3, 4, 5, 6].map(d => `<div class="dia">${Horarios.DIAS[d]}</div>`).join('')}
    <div style="height:${alto}px;position:relative">${horas.map(m => `<div class="hora" style="position:absolute;right:0;top:${(m - desde) * PX}px">${Horarios.hhmm(m)}</div>`).join('')}</div>
    ${[1, 2, 3, 4, 5, 6].map(col).join('')}</div>`;
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
    <p class="chico tenue" style="margin:4px 0 10px">Probé ${s.recortado ? 'las primeras 20.000 de ' : ''}${s.total.toLocaleString('es-AR')} combinaciones. Primero evito superposiciones, después tus horarios ocupados, y después busco menos días y menos huecos.</p>
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
    <input id="h-otra" style="width:100%;margin-top:6px" placeholder="Nombre, si no está en la lista">
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
  if (m === '__otra') { m = val('h-otra'); if (!m) return aviso('Escribí el nombre de la materia'); }
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
  const todos = c.eventos.concat(misFechas(), mias).sort((a, b) => a.desde < b.desde ? -1 : a.desde > b.desde ? 1 : 0);
  const futuros = todos.filter(e => e.hasta >= t), pasados = todos.filter(e => e.hasta < t);
  const periodo = c.periodos.find(p => p.desde <= t && p.hasta >= t);
  const chip = { examen: ['mal', 'Exámenes'], inscripcion: ['tin', 'Inscripción'], cursada: ['ok', 'Cursada'], tramite: ['ojo', 'Trámite'], info: ['', 'Info'], mio: ['mos', 'Tuyo'], mesa: ['mal', 'Mesa'] };
  const turnos = D.mesas.map(tn => `<details class="tarjeta"><summary style="cursor:pointer"><b>Mesas de examen: ${esc(tn.nombre)}</b> <span class="chico tenue">(${tn.mesas.length}, cargadas el ${fmt(tn.actualizado)})</span></summary>
    <p class="chico tenue">${esc(tn.nota)} <a href="${esc(tn.fuente)}" target="_blank" rel="noopener">Ver la planilla de la Facultad</a>.</p>
    ${tn.mesas.map(x => `<div class="evento"><div class="cuando">${fmt(x.fecha)}</div><div class="crece">${esc(x.nombre)}<span class="chico tenue" style="display:block">${[x.hora && x.hora + ' h', x.aula && 'aula ' + x.aula, x.llamado].filter(Boolean).map(esc).join(' · ')}</span></div></div>`).join('')}</details>`).join('');
  const fila = e => { const enCurso = e.desde <= t && e.hasta >= t; return `<div class="evento ${enCurso ? 'hoy' : ''} ${e.hasta < t ? 'pasado' : ''}"><div class="cuando">${fmtRango(e.desde, e.hasta)}</div>
    <div class="crece">${e.materia ? `<button class="enlace" onclick="abrirMateria('${e.materia}')">${esc(e.t)}</button>` : esc(e.t)}${e.hora ? ' · ' + esc(e.hora) + ' h' : ''}${enCurso && e.desde !== e.hasta ? ' <span class="chico tenue">(en curso)</span>' : ''}</div>
    <span class="chip ${chip[e.tipo][0]}">${chip[e.tipo][1]}</span></div>`; };
  let semana = '';
  if (periodo) { const n = Math.floor((fecha(t) - fecha(periodo.desde)) / 6048e5) + 1, tot = Math.ceil((fecha(periodo.hasta) - fecha(periodo.desde)) / 6048e5); semana = `<div class="tarjeta"><b>${esc(periodo.nombre)}</b>: semana ${n} de ${tot}<div class="barra"><i style="width:${Math.round(n * 100 / tot)}%;background:var(--tinta)"></i></div></div>`; }
  return `${semana}<div class="titulo-sec"><h2>Lo que viene</h2>${misFechas().length ? '<button class="btn sec ch" onclick="exportarIcs()">Llevar mis fechas al calendario (.ics)</button>' : ''}</div>
    <p class="chico tenue" style="margin:-4px 0 8px">Calendario académico ${c.anio} de la Facultad más tus parciales y finales (se cargan desde cada materia, en Mi carrera). ${esc(c.nota)}</p>
    <div class="tarjeta" style="padding:6px 16px">${futuros.map(fila).join('') || '<p class="vacio">No queda nada en el calendario de este año.</p>'}</div>
    ${turnos}
    ${pasados.length ? `<button class="btn lin ch" onclick="V.verPasados=!V.verPasados;render()">${V.verPasados ? 'Ocultar' : 'Ver'} lo que ya pasó (${pasados.length})</button>${V.verPasados ? `<div class="tarjeta" style="padding:6px 16px;margin-top:10px">${pasados.map(fila).join('')}</div>` : ''}` : ''}`;
}
function descargar(nombre, texto, tipo) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([texto], { type: tipo })); a.download = nombre; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }
function exportarIcs() {
  const f = s => s.replace(/-/g, ''), sig = s => { const d = fecha(s); d.setDate(d.getDate() + 1); return iso(d).replace(/-/g, ''); };
  const evs = misFechas().map((e, i) => ['BEGIN:VEVENT', 'UID:cursada-' + i + '-' + f(e.desde) + '@ficha.github.io', 'DTSTAMP:' + f(hoy()) + 'T000000Z',
    e.hora ? 'DTSTART:' + f(e.desde) + 'T' + e.hora.replace(':', '') + '00' : 'DTSTART;VALUE=DATE:' + f(e.desde),
    e.hora ? 'DURATION:PT2H' : 'DTEND;VALUE=DATE:' + sig(e.desde), 'SUMMARY:' + e.t.replace(/[,;]/g, ' '), 'END:VEVENT'].join('\r\n'));
  descargar('mis-fechas-cursada.ics', ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cursada//ficha.github.io//ES'].concat(evs, ['END:VCALENDAR']).join('\r\n'), 'text/calendar');
}

// =====================================================================
// LINKS ÚTILES y SUGERENCIAS
// =====================================================================
function vLinks() {
  return `<p class="chico tenue">Los sitios oficiales que más se usan durante la cursada. Si falta alguno, avisame con 💡 Sugerencias.</p>` +
    (D.plan.links || []).map(g => `<div class="titulo-sec"><h2>${esc(g.grupo)}</h2></div><div class="tarjeta" style="padding:6px 16px">
      ${g.links.map(l => `<a class="evento" style="text-decoration:none;color:inherit" href="${esc(l.url)}" target="_blank" rel="noopener"><span class="crece"><b style="color:var(--tinta)">${esc(l.t)} ↗</b>
        ${l.d ? `<span class="chico tenue" style="display:block">${esc(l.d)}</span>` : ''}</span></a>`).join('')}</div>`).join('');
}
// Sin servidor no hay formulario propio: la sugerencia se manda por mail o como un "issue" público en GitHub.
function idea() {
  abrir(cab('💡 Sugerencias y comentarios') + `<p class="chico tenue" style="margin-top:0">¿Falta algo, hay un dato viejo o un error? ¿Se te ocurre una mejora? Escribilo acá.</p>
    <textarea id="i-t" style="min-height:130px" placeholder="Ej.: el horario de la comisión 3 de Corrección cambió; estaría bueno poder…"></textarea>
    <div class="botones"><button class="btn" onclick="mandarIdea('mail')">Mandar por mail</button>
      <button class="btn sec" onclick="mandarIdea('github')">Publicar en GitHub</button><button class="btn lin" onclick="mandarIdea('copiar')">Copiar</button></div>
    <p class="chico tenue">“Mandar por mail” abre tu correo con el mensaje listo para Fidel. “Publicar en GitHub” lo deja como un pedido público (necesita cuenta de GitHub). No se manda nada de tus notas ni tus datos.</p>`);
  setTimeout(() => $('#i-t').focus(), 50);
}
function mandarIdea(como) {
  const t = val('i-t');
  if (!t) return aviso('Escribí tu sugerencia');
  const asunto = 'Cursada: ' + t.replace(/\s+/g, ' ').slice(0, 60);
  if (como === 'mail') location.href = 'mailto:' + CONTACTO + '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(t + '\n\n(Enviado desde ficha.github.io/cursada)');
  else if (como === 'github') window.open('https://github.com/Ficha/Ficha.github.io/issues/new?title=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(t + '\n\n_Desde Cursada._'), '_blank', 'noopener');
  else (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => aviso('Copiado'), () => aviso('No se pudo copiar'));
}

// =====================================================================
// DATOS: exportar, importar, borrar
// =====================================================================
function abrirDatos() {
  abrir(cab('Tus datos') + `<p>Todo lo que cargás (notas, fechas, horarios) se guarda <b>solo en este navegador</b>. Nadie más lo ve, ni siquiera yo.
    Si cambiás de dispositivo o borrás los datos del navegador, se pierde: hacé una copia cada tanto.</p>
    <div class="botones"><button class="btn" onclick="exportar()">Descargar una copia</button>
      <label class="btn sec" style="display:inline-flex;align-items:center;cursor:pointer">Cargar una copia<input type="file" accept=".json,application/json" hidden onchange="importar(this.files[0])"></label>
      <button class="btn pel" onclick="borrarTodo()">Borrar todo</button></div>`);
}
function exportar() { descargar('cursada-' + hoy() + '.json', JSON.stringify(E, null, 1), 'application/json'); }
function importar(archivo) {
  if (!archivo) return;
  const r = new FileReader();
  r.onload = () => {
    try { const e = JSON.parse(r.result); if (!e || e.v !== 1 || typeof e.materias !== 'object') throw new Error(); E = Object.assign(estadoVacio(), e); guardar(); cerrar(); render(); aviso('Copia cargada'); }
    catch (err) { aviso('Ese archivo no es una copia de Cursada'); }
  };
  r.readAsText(archivo);
}
function borrarTodo() { if (!confirm('¿Borrar todas tus notas, fechas y horarios de este navegador? No se puede deshacer.')) return; E = estadoVacio(); guardar(); cerrar(); render(); aviso('Datos borrados'); }

arrancar();
