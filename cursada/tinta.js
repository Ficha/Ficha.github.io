// Prototipo «tinta»: cambia los emojis de la interfaz por íconos de línea de un solo trazo, del color del texto.
// Los signos tipográficos (✓ ✕ ✗ ★ ⚠ ♥) quedan como texto, sin la variante de color. Lo que no tiene ícono se saca.
(() => {
  const P = {
    libro: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M8 7h7',
    idea: 'M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z',
    link: 'M9 15l6-6M10 7l1-1a3.5 3.5 0 0 1 5 5l-1 1M14 17l-1 1a3.5 3.5 0 0 1-5-5l1-1',
    campana: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
    flecha: 'M5 12h14M13 6l6 6-6 6',
    fecha: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
    pluma: 'M4 20l4-1L19 8l-3-3L5 16zM14 7l3 3',
    blanco: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
    copa: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8',
    hoja: 'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7',
    regla: 'M3 17L17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2',
    balanza: 'M12 4v16M8 20h8M5 8h14M5 8l-3 6a3 3 0 0 0 6 0zM19 8l-3 6a3 3 0 0 0 6 0z',
    aula: 'M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5',
    foto: 'M4 8h4l2-3h4l2 3h4v11H4zM12 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    prensa: 'M7 9V3h10v6M5 9h14v8H5zM8 14h8v7H8z',
    taza: 'M5 8h11v6a5 5 0 0 1-10 0zM16 10h2a2 2 0 0 1 0 4h-2M8 3v2M11 3v2',
    alfiler: 'M12 17v5M8 3h8l-1 6 3 4H6l3-4z',
    guardar: 'M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6',
    rueda: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2',
    lupa: 'M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM15 15l5 5',
    globo: 'M4 5h16v11H9l-5 4z',
    mundo: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
    sobre: 'M4 6h16v12H4zM4 7l8 6 8-6',
    caja: 'M4 8h16v12H4zM9 8V5h6v3',
    celu: 'M8 3h8v18H8zM11 18h2',
    triangulo: 'M12 5l8 14H4z',
  };
  const E = { '📚': 'libro', '📖': 'libro', '📑': 'libro', '💡': 'idea', '✨': 'idea', '🔗': 'link', '📎': 'link', '🔔': 'campana', '👉': 'flecha',
    '📅': 'fecha', '🗓': 'fecha', '✍': 'pluma', '✏': 'pluma', '📝': 'pluma', '🧠': 'blanco', '🎯': 'blanco', '🕹': 'copa', '🏆': 'copa',
    '📄': 'hoja', '📋': 'hoja', '📰': 'hoja', '🗂': 'hoja', '📐': 'regla', '🧮': 'regla', '⚖': 'balanza', '🎓': 'aula', '🏫': 'aula', '🏛': 'aula',
    '📷': 'foto', '🖨': 'prensa', '☕': 'taza', '📌': 'alfiler', '💾': 'guardar', '⚙': 'rueda', '🛠': 'rueda', '🔎': 'lupa', '🔍': 'lupa',
    '💬': 'globo', '🗣': 'globo', '🤝': 'globo', '🌐': 'mundo', '🌎': 'mundo', '🧭': 'mundo', '📬': 'sobre', '💼': 'caja', '🏢': 'caja',
    '🏪': 'caja', '🛒': 'caja', '🚚': 'caja', '📱': 'celu', '🔺': 'triangulo' };
  const TEXTO = { '✅': '✓', '💲': '$' };
  const RE = /([\u{1F300}-\u{1FAFF}☀-➿⭐])️?\s?/gu;
  const svg = n => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="${P[n]}"/></svg>`;
  const SIGNOS = '✓✕✗★⚠♥♡◐';
  function nodo(t) {
    const s = t.nodeValue; RE.lastIndex = 0;
    if (!RE.test(s)) { if (s.includes('️')) t.nodeValue = s.replace(/️/g, ''); return; }
    const padre = t.parentNode; if (!padre) return;
    const sinHTML = /^(OPTION|TITLE|TEXTAREA|SCRIPT|STYLE)$/.test(padre.nodeName) || padre.closest('svg');
    let html = '', hubo = false;
    const esc = x => x.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    let ult = 0; RE.lastIndex = 0; let m;
    while ((m = RE.exec(s))) {
      const ch = m[1];
      html += esc(s.slice(ult, m.index)); ult = RE.lastIndex;
      if (SIGNOS.includes(ch)) { html += ch + (m[0].endsWith(' ') ? ' ' : ''); continue; }
      if (TEXTO[ch]) { html += TEXTO[ch] + (m[0].endsWith(' ') ? ' ' : ''); continue; }
      if (E[ch] && !sinHTML) { html += svg(E[ch]); hubo = true; }
    }
    html += esc(s.slice(ult));
    if (sinHTML || !hubo) { const tx = document.createElement('textarea'); tx.innerHTML = html; t.nodeValue = tx.value; return; }
    padre.replaceChild(document.createRange().createContextualFragment(html), t);
  }
  function pasar(raiz) {
    if (raiz.nodeType === 3) return nodo(raiz);
    if (raiz.nodeType !== 1) return;
    [raiz, ...raiz.querySelectorAll('[placeholder]')].forEach(e => { const p = e.getAttribute && e.getAttribute('placeholder'); if (p) { RE.lastIndex = 0; if (RE.test(p)) e.setAttribute('placeholder', p.replace(RE, '')); } });
    const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT), lista = [];
    while (w.nextNode()) lista.push(w.currentNode);
    lista.forEach(nodo);
  }
  const obs = new MutationObserver(ms => { obs.disconnect(); ms.forEach(m => m.addedNodes.forEach(pasar)); mirar(); });
  const mirar = () => obs.observe(document.body, { childList: true, subtree: true, characterData: false });
  pasar(document.body); mirar();
})();
