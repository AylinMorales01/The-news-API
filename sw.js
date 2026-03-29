const CACHE_NAME = 'v1_swiss_news_cache';
const urlsToCache = [
  './',
  './index.html',
  './script.js',
  'https://via.placeholder.com/150'
];

// Instalación del Service Worker
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting());
      })
  );
});

// Estrategia de carga: Primero busca en internet, si falla, usa el caché
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});