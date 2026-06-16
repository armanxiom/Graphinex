const CACHE_NAME = 'graphinex-runtime-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/assets/hero/hero-background.avif',
  '/assets/hero/hero-card.avif',
  '/Graphinex%20logo/logo.avif'
];

const STATIC_ASSET_DESTINATIONS = new Set(['style', 'script', 'image', 'font', 'video', 'audio']);

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const networkResponsePromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }

      return response;
    })
    .catch(() => undefined);

  return cachedResponse ?? (await networkResponsePromise);
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE_URLS);
      self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );

      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          const cache = await caches.open(CACHE_NAME);
          cache.put('/index.html', response.clone());
          return response;
        } catch {
          const cache = await caches.open(CACHE_NAME);
          return (await cache.match('/index.html')) ?? (await cache.match('/'));
        }
      })()
    );
    return;
  }

  if (url.origin === self.location.origin && (STATIC_ASSET_DESTINATIONS.has(request.destination) || /\.(avif|webp|png|jpe?g|gif|svg|mp4|webm|css|js|woff2?)$/i.test(url.pathname))) {
    event.respondWith(staleWhileRevalidate(request));
  }
});
