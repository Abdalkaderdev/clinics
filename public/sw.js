const CACHE_VERSION = 'v4';
const CACHE_NAME = `beauty-land-card-${CACHE_VERSION}`;
const PRECACHE_URLS = [
  '/',
  '/images/beauty-final.png',
  '/images/beauty-final.webp',
  '/clinics_en.json',
  '/clinics_ar.json',
  '/clinics_ku.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      await cache.addAll(PRECACHE_URLS);
    } catch (_) {
      // Best-effort precache; ignore failures
    }
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('beauty-land-card-') && k !== CACHE_NAME).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

// Strategy:
// - For navigation (HTML): network-first with cache fallback (avoids mixed-version shells)
// - For assets (CSS/JS/images): stale-while-revalidate
// - For JSON (clinics): network-first with cache fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Bypass cross-origin analytics and opaque blocked requests
  if (url.origin !== self.location.origin) {
    return;
  }

  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (_) {
        const cached = await caches.match(req);
        return cached || caches.match('/');
      }
    })());
    return;
  }

  // JSON data: network-first
  if (req.destination === 'document' || req.destination === 'empty') {
    if (url.pathname.endsWith('.json')) {
      event.respondWith((async () => {
        try {
          const fresh = await fetch(req, { cache: 'no-cache' });
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch (_) {
          const cached = await caches.match(req);
          return cached || new Response('{}', { headers: { 'Content-Type': 'application/json' } });
        }
      })());
      return;
    }
  }

  // Assets: stale-while-revalidate
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    const fetchPromise = fetch(req).then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        cache.put(req, networkResponse.clone());
      }
      return networkResponse;
    }).catch(() => cached);
    return cached || fetchPromise;
  })());
});