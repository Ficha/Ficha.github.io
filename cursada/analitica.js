// Cursada: Google Analytics con consentimiento (Consent Mode v2), igual que el resto del sitio.
// Se carga antes que gtag.js: arranca todo denegado y solo cuenta visitas si la persona acepta.
// La decisión se guarda en "fc-consent", la misma clave que usa ficha.github.io: quien ya eligió
// en el sitio no vuelve a ver el aviso. Analytics nunca recibe lo que la persona carga en Cursada.
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
gtag('js', new Date());
gtag('config', 'G-631LPGC1XE');

(function () {
  const CLAVE = 'fc-consent';
  const aplicar = v => gtag('consent', 'update', { analytics_storage: v === 'granted' ? 'granted' : 'denied', ad_storage: 'denied' });
  let guardado = null;
  try { guardado = localStorage.getItem(CLAVE); } catch (e) { }
  if (guardado === 'granted' || guardado === 'denied') aplicar(guardado);

  function mostrar() {
    let b = document.getElementById('galletas');
    if (!b) {
      b = document.createElement('div');
      b.id = 'galletas';
      b.className = 'galletas';
      b.setAttribute('role', 'region');
      b.setAttribute('aria-label', 'Cookies');
      b.innerHTML = '<p>Uso Google Analytics para saber cuánta gente usa Cursada. Solo cuenta visitas: no ve tus notas ni tus horarios. Sin cookies de publicidad.</p>'
        + '<div class="botones"><button class="btn ch" type="button" data-v="granted">Aceptar</button>'
        + '<button class="btn lin ch" type="button" data-v="denied">Rechazar</button></div>';
      b.addEventListener('click', e => {
        const v = e.target.getAttribute && e.target.getAttribute('data-v');
        if (!v) return;
        try { localStorage.setItem(CLAVE, v); } catch (err) { }
        aplicar(v);
        b.classList.remove('on');
      });
      document.body.appendChild(b);
    }
    b.classList.add('on');
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (guardado !== 'granted' && guardado !== 'denied') mostrar();
    const cambiar = document.getElementById('cookies');
    if (cambiar) cambiar.addEventListener('click', mostrar);
  });
})();
