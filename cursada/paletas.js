// Prototipo «tinta»: selector de paletas (primary, éxito, atención, peligro) para probar el color sobre las pantallas reales.
// Solo para decidir: cuando se elija una, sus valores pasan a tokens.css y este archivo se borra.
(() => {
  const PALETAS = {
    figma: { nombre: 'Figma (comunidad)', nota: 'Los de la plancha: azul vivo, verde y ámbar saturados.',
      claro: { primario: '#0671E0', ok: '#00805A', ojo: '#B86E00', mal: '#C33025' },
      oscuro: { primario: '#4196F0', ok: '#32C997', ojo: '#FFB240', mal: '#FF5A4F' } },
    pluma: { nombre: 'Tinta de pluma', nota: 'Azul tinta china, verde botella, ocre y bordó: colores de tinta, no de pantalla.',
      claro: { primario: '#1F3F7A', ok: '#2F6B4F', ojo: '#8F5F00', mal: '#9B2C24' },
      oscuro: { primario: '#8FB0F0', ok: '#7CC8A0', ojo: '#E8B35A', mal: '#F08A7E' } },
    cuatri: { nombre: 'Cuatricromía', nota: 'Cian, verde, amarillo oscuro y magenta de la imprenta (CMYK), apagados para el papel.',
      claro: { primario: '#0B6E8F', ok: '#3C7D3A', ojo: '#8A6A00', mal: '#B0245A' },
      oscuro: { primario: '#6CC4E0', ok: '#8AD08A', ojo: '#E6C250', mal: '#F08AB0' } },
    sello: { nombre: 'Sello', nota: 'Primary en rojo sello (como el de las correcciones); verde y ámbar de tintero; peligro en rojo más oscuro.',
      claro: { primario: '#A8321F', ok: '#2E6B47', ojo: '#8A5A00', mal: '#7A1F1F' },
      oscuro: { primario: '#F0907E', ok: '#7CC8A0', ojo: '#E8B35A', mal: '#F5A09A' } },
    ninguna: { nombre: 'Solo tinta', nota: 'Sin primary: el negro hace de primario; solo los estados llevan color.',
      claro: { primario: '#212121', ok: '#2F6B4F', ojo: '#8F5F00', mal: '#9B2C24' },
      oscuro: { primario: '#E8E5DF', ok: '#7CC8A0', ojo: '#E8B35A', mal: '#F08A7E' } }
  };
  const ETIQ = { primario: 'Primary', ok: 'Éxito', ojo: 'Atención', mal: 'Peligro' };
  let clave = 'pluma', aplicar = true, custom = null;
  try { const g = JSON.parse(localStorage.getItem('cursada.paleta') || '{}'); if (PALETAS[g.clave]) clave = g.clave; if (g.aplicar === false) aplicar = false; custom = g.custom || null; } catch (e) {}
  const q = new URLSearchParams(location.search).get('paleta'); if (PALETAS[q]) { clave = q; custom = null; }

  const oscuro = () => { const t = document.documentElement.dataset.theme; return t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches; };
  const lum = h => { const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4); return .2126 * c[0] + .7152 * c[1] + .0722 * c[2]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  const colores = () => ({ ...PALETAS[clave][oscuro() ? 'oscuro' : 'claro'], ...(custom || {}) });
  const guardar = () => { try { localStorage.setItem('cursada.paleta', JSON.stringify({ clave, aplicar, custom })); } catch (e) {} };

  const estilo = document.createElement('style'); document.head.appendChild(estilo);
  const aplicarCss = () => {
    const c = colores(), s = n => `color-mix(in srgb, ${c[n]} 11%, var(--bg))`;
    let css = `:root[data-pal], :root[data-pal][data-theme] { --ok: ${c.ok}; --ok-suave: ${s('ok')}; --verde: ${c.ok}; --ojo: ${c.ojo}; --ojo-suave: ${s('ojo')}; --mal: ${c.mal}; --rojo: ${c.mal}; --mal-suave: ${s('mal')}; --primario: ${c.primario}; --primario-suave: ${s('primario')}; }`;
    if (aplicar) css += `
      html[data-pal] input:focus, html[data-pal] select:focus, html[data-pal] textarea:focus, html[data-pal] button:focus-visible, html[data-pal] a:focus-visible { outline-color: var(--primario); }
      html[data-pal] .btn:not(.pel):not(.sec):not(.fantasma) { background: var(--primario); color: ${oscuro() ? '#1c1b19' : '#fff'}; border-color: var(--primario); }
      html[data-pal] .mat.cursando { border-left-color: var(--primario); }
      html[data-pal] .chip.tin { background: var(--primario-suave); color: var(--primario); }
      html[data-pal] .dir-letras button.on, html[data-pal] .ayuda-q[aria-expanded="true"] { background: var(--primario); border-color: var(--primario); }
      html[data-pal] [aria-current="page"], html[data-pal] .tab.on, html[data-pal] nav button.on { color: var(--primario); border-color: var(--primario); }`;
    estilo.textContent = css; document.documentElement.dataset.pal = clave;
  };

  const panel = document.createElement('div');
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Paleta de color');
  panel.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:9999;width:min(340px,calc(100vw - 24px));max-height:78vh;overflow:auto;background:var(--sup);color:var(--texto);border:1.5px solid var(--borde);border-radius:4px;font:13px/1.35 var(--fuente);padding:12px;box-sizing:border-box';
  document.body.appendChild(panel);
  let abierto = innerWidth > 720;
  const render = () => {
    const c = colores(), bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#f8f6f1';
    const bgh = /^#[0-9a-f]{6}$/i.test(bg) ? bg : (oscuro() ? '#1c1b19' : '#f8f6f1');
    const fila = k => { const r = ratio(c[k], bgh); return `<label style="display:grid;grid-template-columns:22px 1fr auto;gap:8px;align-items:center;margin:6px 0">
      <input type="color" data-k="${k}" value="${c[k].toLowerCase()}" style="width:22px;height:22px;padding:0;border:1px solid var(--borde-campo);background:none">
      <span><b>${ETIQ[k]}</b> <code style="color:var(--tenue)">${c[k].toUpperCase()}</code></span>
      <span title="Contraste contra el papel (AA texto ≥ 4,5)" style="font-variant-numeric:tabular-nums;color:${r >= 4.5 ? 'var(--texto)' : 'var(--rojo)'}">${r.toFixed(1)}:1 ${r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : 'bajo'}</span></label>`; };
    panel.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center"><b>Paleta de color</b><button data-x="cerrar" style="min-height:28px;padding:2px 8px;border:1px solid var(--borde-campo);background:none;color:var(--texto);border-radius:4px;cursor:pointer">${abierto ? '–' : '+'}</button></div>`
      + (abierto ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin:10px 0">${Object.entries(PALETAS).map(([k, p]) => `<button data-p="${k}" aria-pressed="${k === clave}" style="min-height:30px;padding:3px 9px;border:1.5px solid ${k === clave ? 'var(--borde)' : 'var(--borde-fino)'};background:${k === clave ? 'var(--sup2)' : 'none'};color:var(--texto);border-radius:4px;cursor:pointer;font:inherit">${p.nombre}</button>`).join('')}</div>
        <p style="margin:0 0 8px;color:var(--texto2)">${PALETAS[clave].nota}</p>
        ${['primario', 'ok', 'ojo', 'mal'].map(fila).join('')}
        <label style="display:flex;gap:8px;align-items:center;margin-top:8px"><input type="checkbox" data-a ${aplicar ? 'checked' : ''}> Aplicar el primary (enlaces, botones, foco)</label>
        <div style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">
          <span style="padding:3px 9px;border:1.5px solid var(--primario);color:var(--primario)">Primary</span>
          <span style="padding:3px 9px;background:var(--ok-suave);color:var(--ok);border:1px solid var(--ok)">✓ Aprobada</span>
          <span style="padding:3px 9px;background:var(--ojo-suave);color:var(--ojo);border:1px solid var(--ojo)">⚠ Ojo</span>
          <span style="padding:3px 9px;background:var(--mal-suave);color:var(--mal);border:1px solid var(--mal)">✕ Choque</span></div>
        <div style="margin-top:8px;color:var(--tenue)"><button data-x="reset" style="background:none;border:0;color:inherit;text-decoration:underline;cursor:pointer;font:inherit;padding:0">Volver a los valores de la paleta</button></div>` : '');
  };
  panel.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.p) { clave = b.dataset.p; custom = null; }
    else if (b.dataset.x === 'cerrar') abierto = !abierto;
    else if (b.dataset.x === 'reset') custom = null;
    else return;
    guardar(); aplicarCss(); render();
  });
  panel.addEventListener('input', e => {
    const t = e.target;
    if (t.dataset.k) { custom = { ...(custom || {}), [t.dataset.k]: t.value.toUpperCase() }; guardar(); aplicarCss(); const d = t.closest('label').querySelector('code'); if (d) d.textContent = t.value.toUpperCase(); }
  });
  panel.addEventListener('change', e => { if (e.target.dataset.k) render(); if (e.target.dataset.a !== undefined) { aplicar = e.target.checked; guardar(); aplicarCss(); } });
  new MutationObserver(() => { aplicarCss(); render(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { aplicarCss(); render(); });
  aplicarCss(); render();
})();
