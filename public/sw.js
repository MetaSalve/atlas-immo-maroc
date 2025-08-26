const CACHE_NAME = 'alertimmo-cache-v3';
const DYNAMIC_CACHE = 'alertimmo-dynamic-cache-v3';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  '/placeholder.svg'
];

// Installation du service worker avec monitoring
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Mise en cache globale');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
      .catch(error => {
        console.error('[Service Worker] Erreur d\'installation:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, DYNAMIC_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('supabase.co')) {
    return;
  }
  
  if (event.request.method !== 'GET') return;

  // Navigation requests: always try network first to avoid stale HTML/JS
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Update cache for offline support
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }
  
  // Assets and other GET requests: cache-first, then network fallback
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        }).catch(() => {
          if (event.request.destination === 'image') {
            return caches.match('/placeholder.svg');
          }
          return new Response('Contenu non disponible hors ligne');
        });
      })
  );
});

// Monitoring des performances
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_CACHE_STATUS') {
    caches.keys().then(cacheNames => {
      Promise.all(
        cacheNames.map(cacheName => 
          caches.open(cacheName)
            .then(cache => cache.keys())
            .then(requests => ({
              cacheName,
              size: requests.length,
              urls: requests.map(req => req.url)
            }))
        )
      ).then(cacheStatus => {
        event.source.postMessage({
          type: 'CACHE_STATUS',
          status: cacheStatus
        });
      });
    });
  }
});
