// Cursada se mudó a galera.com.ar: este service worker solo se borra a sí mismo y limpia lo que guardó.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k)))).then(() => self.registration.unregister())
));
