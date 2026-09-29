// Service worker mínimo: hace que el navegador ofrezca instalar la app. No guarda nada en caché:
// la app vive en Google Apps Script y necesita conexión.
// Sin start_url en el manifest a propósito: así la app instalada abre la URL con la que se instaló (con la clave en el #).
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
