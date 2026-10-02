const CACHE_NAME = 'acm-cellar-cache-v3';

// Cache-First strategy: Stores 3D GLB models, textures, and assets persistently in browser
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignore non-GET requests or unsupported schemes
  if (event.request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // CRITICAL: Bypass Service Worker for video streaming and HTTP Range requests.
  // Video playback uses HTTP 206 Range requests; Service Worker interception breaks
  // browser media buffering and triggers an infinite high-frequency request loop that crashes servers.
  if (
    event.request.headers.has('range') ||
    url.pathname.endsWith('.mp4') ||
    url.pathname.endsWith('.webm') ||
    url.pathname.endsWith('.ogg') ||
    url.pathname.includes('/videos/')
  ) {
    return;
  }

  // Bypass cache for development files (.js, .css, .html) so updates are always loaded
  if (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.endsWith('.html') || url.pathname === '/') {
    return;
  }

  // Cache-First: Return from cache immediately if available, otherwise fetch and cache
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Only cache successful basic/cors responses
        if (!networkResponse || (networkResponse.status !== 200 && networkResponse.status !== 0)) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch((err) => {
        console.warn('Network request failed for:', event.request.url, err);
      });
    })
  );
});
