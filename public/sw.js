const CACHE_NAME = 'beauty-land-card-v1';
const urlsToCache = [
  '/',
  '/images/beauty-final.png',
  '/images/beauty-final.webp',
  '/clinics_en.json',
  '/clinics_ar.json',
  '/clinics_ku.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});