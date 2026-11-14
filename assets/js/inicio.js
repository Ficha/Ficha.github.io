// Arranque común a todas las páginas: consentimiento de analytics (Google Consent Mode v2),
// carga diferida de gtag.js y modo "sober up" antes del primer render.
// Es archivo propio (no inline) para que la CSP no necesite 'unsafe-inline' en script-src.
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
// Consentimiento: denegado por defecto hasta que el usuario elija
gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied' });

// gtag.js se carga recién tras la primera interacción (o 4 s): no compite con el primer render.
(function () {
  var done = false;
  function load() {
    if (done) return; done = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-631LPGC1XE';
    document.head.appendChild(s);
  }
  ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(function (e) {
    window.addEventListener(e, load, { once: true, passive: true });
  });
  window.addEventListener('load', function () { setTimeout(load, 4000); });
})();

gtag('js', new Date());
gtag('config', 'G-631LPGC1XE');

// Modo sober up: se aplica antes del primer render para que no parpadee
try{if(localStorage.getItem('fc-sober')==='1')document.documentElement.setAttribute('data-sober','')}catch(e){}
