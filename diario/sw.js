// Service worker mínimo: hace que el navegador ofrezca instalar la app.
// No guarda nada en caché: la app vive en Google Apps Script y necesita conexión.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
