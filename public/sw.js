const CACHE_NAME = 'alertimmo-cache-v1';
const DYNAMIC_CACHE = 'alertimmo-dynamic-cache-v1';

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
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('[Service Worker] Utilisation du cache pour:', event.request.url);
          return response;
        }
        
        console.log('[Service Worker] Récupération depuis le réseau:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
                console.log('[Service Worker] Nouvelle ressource mise en cache:', event.request.url);
              });
            
            return response;
          })
          .catch((error) => {
            console.error('[Service Worker] Erreur de récupération:', error);
            
            if (event.request.mode === 'navigate') {
              console.log('[Service Worker] Redirection vers la page hors ligne');
              return caches.match('/offline.html');
            }
            
            if (event.request.destination === 'image') {
              console.log('[Service Worker] Utilisation de l\'image placeholder');
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
