// Prototipo «trama»: los párrafos explicativos pasan a quedar detrás de un «?» que los abre solo si se pide.
// Candidatos: párrafos tenues o chicos de más de 60 caracteres que no llevan botones ni campos. Cada pantalla se vuelve a revisar cuando la app redibuja.
(() => {
  const SEL = 'main p.tenue, main p.chico, main .titulo-sec + p, main .tarjeta > p, main .crece > p.tenue';
  const SALVAR = '.donar-fila, .invita, .galletas, [data-q], .q-texto';
  let n = 0;
  const pasada = () => {
    document.querySelectorAll(SEL).forEach(p => {
      if (p.dataset.q || p.closest(SALVAR) || p.closest('dialog')) return;
      const t = p.textContent.trim();
      if (t.length < 60 || p.querySelector('button, input, select, textarea')) return;
      p.dataset.q = '1';
      const id = 'q' + (++n);
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'q'; b.textContent = '?'; b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', id); b.setAttribute('aria-label', 'Más contexto');
      b.id = 'b' + id; p.dataset.btn = b.id; p.id = id; p.hidden = true; p.classList.add('q-texto');
      b.addEventListener('click', () => { const abre = p.hidden; p.hidden = !abre; b.setAttribute('aria-expanded', String(abre)); });
      const ant = p.previousElementSibling;
      const previo = ant && ant.classList.contains('q-texto') && ant.dataset.btn && document.getElementById(ant.dataset.btn);
      if (previo) {   // párrafos seguidos: un solo «?» abre todos
        const b0 = previo; p.dataset.btn = b0.id; p.hidden = true;
        b0.addEventListener('click', () => { p.hidden = b0.getAttribute('aria-expanded') !== 'true'; });
        return;
      }
      if (ant &&(/^H[1-4]$/.test(ant.tagName) || ant.classList.contains('titulo-sec'))) (ant.querySelector('h1,h2,h3,h4') || ant).appendChild(b);
      else { const f = document.createElement('div'); f.className = 'q-fila'; f.appendChild(b); p.before(f); }
    });
  };
  let t;
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(pasada, 30); }).observe(document.body, { childList: true, subtree: true });
  pasada();
})();
