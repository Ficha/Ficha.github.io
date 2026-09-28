// Service worker: hace que el navegador ofrezca instalar la app y recibe los avisos de racha
// (Firebase Cloud Messaging). No guarda nada en caché: la app vive en Google Apps Script y necesita conexión.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyACBZt--0BMLK83SUxxfw8UB9G4428Vquw',
  authDomain: 'diario-escritura.firebaseapp.com',
  projectId: 'diario-escritura',
  storageBucket: 'diario-escritura.firebasestorage.app',
  messagingSenderId: '413843837113',
  appId: '1:413843837113:web:21e74157f0b106a6af0b68'
});
// Los avisos llegan con "notification": Firebase los muestra solo y al tocarlos abre la app (fcm_options.link).
firebase.messaging();

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
