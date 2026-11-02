'use strict';
// Cursada se mudó a galera.com.ar. Este archivo lo carga el puente (index.html) y cada página vieja:
// lleva a la misma ruta de Galera conservando el # y, si la persona tiene datos acá, pasa por el puente para llevárselos.
(() => {
  const DESTINO = 'https://galera.com.ar', BASE = '/cursada/', CLAVE = 'cursada.v1';
  const ruta = location.pathname.startsWith(BASE) ? location.pathname.slice(BASE.length).replace(/(^|\/)index\.html$/, '$1') : '';
  const esPuente = ruta === '';
  const hay = e => e && e.v === 1 && Object.keys(e.materias || {}).length + Object.keys(e.horarios || {}).length > 0;
  const leer = () => { try { const e = JSON.parse(localStorage.getItem(CLAVE)); return hay(e) ? e : null; } catch (err) { return null; } };
  // Solo rutas del propio sitio: letras, números, guiones, puntos y barras.
  const limpia = r => (/^[\w\-./]*$/.test(r) && !r.includes('..')) ? r : '';
  const ir = (r, hash) => location.replace(DESTINO + '/' + limpia(r) + location.search + (hash || ''));

  const datos = leer();
  // Con # (links de los mails: #confirmar=, #baja=, #novedades=, #donar…) se va directo y se conserva.
  if (location.hash && location.hash.length > 1) return ir(ruta, location.hash);
  if (!datos) return ir(ruta);
  if (!esPuente) return location.replace(BASE + '?ir=' + encodeURIComponent(ruta));

  // ---------- puente: llevar los datos ----------
  const dest = limpia(decodeURIComponent((location.search.match(/[?&]ir=([^&]*)/) || [])[1] || ''));
  document.addEventListener('DOMContentLoaded', () => {
    const $ = id => document.getElementById(id), msg = $('m-msg');
    $('m-datos').hidden = false;
    $('m-sin').addEventListener('click', () => location.replace(DESTINO + '/' + dest));
    $('m-copia').addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([localStorage.getItem(CLAVE)], { type: 'application/json' }));
      a.download = 'cursada-mis-datos.json'; document.body.appendChild(a); a.click(); a.remove();
    });
    $('m-llevar').addEventListener('click', async () => {
      $('m-llevar').disabled = true; msg.textContent = 'Preparando tus datos…';
      try {
        let t = await Traspaso.empaquetar(datos);
        if (t.length > 110000) t = await Traspaso.empaquetar(datos, true);   // sin el historial de práctica
        if (t.length > 110000) throw new Error('pesan demasiado');
        location.replace(DESTINO + '/' + dest + '#datos=' + t);
      } catch (err) {
        $('m-llevar').disabled = false;
        msg.textContent = 'No pude armar el link con tus datos (' + (err.message || 'error') + '). Descargá una copia y, en Galera, cargala desde «Tus datos».';
      }
    });
  });
})();
