# Configuration Progressive Web App (PWA)

Ce document détaille la configuration nécessaire pour transformer AlertImmo en une Progressive Web App (PWA) fonctionnelle.

## 1. Manifest Web App

Créez un fichier `manifest.json` à la racine du dossier `public` :

```json
{
  "name": "AlertImmo | L'agrégateur d'annonces immobilières au Maroc",
  "short_name": "AlertImmo",
  "description": "Trouvez votre bien immobilier idéal au Maroc grâce à notre agrégateur d'annonces et nos alertes personnalisées",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4f46e5",
  "orientation": "any",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/screen1.png",
      "sizes": "1080x1920",
      "type": "image/png"
    },
    {
      "src": "/screenshots/screen2.png",
      "sizes": "1080x1920",
      "type": "image/png"
    }
  ],
  "related_applications": [],
  "prefer_related_applications": false,
  "shortcuts": [
    {
      "name": "Rechercher un bien",
      "short_name": "Recherche",
      "description": "Lancez une recherche de biens immobiliers",
      "url": "/search",
      "icons": [{ "src": "/icons/search.png", "sizes": "96x96" }]
    },
    {
      "name": "Mes favoris",
      "short_name": "Favoris",
      "description": "Accédez à vos biens favoris",
      "url": "/favorites",
      "icons": [{ "src": "/icons/favorite.png", "sizes": "96x96" }]
    }
  ],
  "categories": ["immobilier", "maison", "shopping"]
}
```

## 2. Service Worker

Créez un fichier `sw.js` à la racine du dossier `public` :

```javascript
// Nom du cache et ressources à mettre en cache
const CACHE_NAME = 'alertimmo-cache-v1';
const DYNAMIC_CACHE = 'alertimmo-dynamic-cache-v1';

// Ressources à mettre en cache immédiatement
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/index-*.js',
  '/assets/index-*.css',
  '/offline.html',
  '/placeholder.svg'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du service worker et nettoyage des anciens caches
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

// Stratégie de cache : Cache First avec Fallback sur le réseau
self.addEventListener('fetch', (event) => {
  // Exclure les requêtes API et authentification
  if (event.request.url.includes('/auth/') || 
      event.request.url.includes('supabase.co')) {
    return;
  }
  
  // Stratégie pour les requêtes GET uniquement
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retourne la réponse du cache si elle existe
        if (response) {
          // Mise à jour en fond pour les ressources non critiques
          if (!event.request.url.includes('api')) {
            fetch(event.request).then((freshResponse) => {
              if (freshResponse) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, freshResponse.clone());
                });
              }
            });
          }
          return response;
        }
        
        // Sinon, on fait la requête réseau
        return fetch(event.request)
          .then((response) => {
            // Ne pas mettre en cache si la réponse n'est pas valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Mettre en cache la nouvelle réponse
            const responseToCache = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(event.request, responseToCache);
            });
            
            return response;
          })
          .catch(() => {
            // Si la requête échoue, on retourne une page offline
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
            
            // Pour les images, retourner un placeholder
            if (event.request.destination === 'image') {
              return caches.match('/placeholder.svg');
            }
            
            return new Response('Contenu non disponible hors ligne');
          });
      })
  );
});

// Gestion des notifications push
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-96x96.png',
    data: {
      url: data.url
    },
    actions: [
      {
        action: 'view',
        title: 'Voir les détails'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Click sur une notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Gérer l'action "view" ou le clic par défaut
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Synchronisation en arrière-plan
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  } else if (event.tag === 'sync-alerts') {
    event.waitUntil(syncAlerts());
  }
});

// Fonctions de synchronisation
async function syncFavorites() {
  try {
    // Récupérer les données en attente de synchronisation
    const db = await openDB();
    const pendingFavorites = await db.getAll('pending-favorites');
    
    if (pendingFavorites.length > 0) {
      // Envoyer les données au serveur
      const results = await Promise.allSettled(
        pendingFavorites.map(async (fav) => {
          try {
            const response = await fetch('/api/favorites', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(fav)
            });
            
            if (response.ok) {
              // Supprimer l'élément synchronisé
              await db.delete('pending-favorites', fav.id);
              return true;
            }
          } catch (error) {
            console.error('Erreur lors de la synchronisation:', error);
          }
          return false;
        })
      );
      
      // Informer l'utilisateur du résultat
      const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
      if (successCount > 0) {
        self.registration.showNotification('Synchronisation terminée', {
          body: `${successCount} favoris ont été synchronisés`
        });
      }
    }
  } catch (error) {
    console.error('Erreur de synchronisation:', error);
  }
}

async function syncAlerts() {
  // Implémentation similaire à syncFavorites pour les alertes
  // ...
}

// Ouvrir la base de données IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('alertimmo-offline-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      // Créer les object stores nécessaires
      if (!db.objectStoreNames.contains('pending-favorites')) {
        db.createObjectStore('pending-favorites', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('pending-alerts')) {
        db.createObjectStore('pending-alerts', { keyPath: 'id' });
      }
    };
  });
}
```

## 3. Page Offline

Créez un fichier `offline.html` à la racine du dossier `public` :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AlertImmo - Hors ligne</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 20px;
      text-align: center;
      background-color: #f9fafb;
      color: #1f2937;
    }
    .container {
      max-width: 500px;
      padding: 40px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
    }
    h1 {
      margin-top: 0;
      font-size: 24px;
      color: #4f46e5;
    }
    p {
      margin: 16px 0;
      line-height: 1.5;
    }
    .icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    .button {
      background-color: #4f46e5;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      margin-top: 16px;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #4338ca;
    }
    .features {
      margin-top: 32px;
      text-align: left;
    }
    .features h2 {
      font-size: 18px;
      margin-bottom: 8px;
    }
    .features ul {
      padding-left: 24px;
    }
    .features li {
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">📶</div>
    <h1>Vous êtes hors ligne</h1>
    <p>La connexion à AlertImmo n'est pas disponible actuellement. Veuillez vérifier votre connexion internet et réessayer.</p>
    
    <button class="button" onclick="window.location.href='/'">Réessayer</button>
    
    <div class="features">
      <h2>Fonctionnalités disponibles hors ligne :</h2>
      <ul>
        <li>Consultation des dernières propriétés visitées</li>
        <li>Accès à vos favoris sauvegardés</li>
        <li>Consultation de vos alertes configurées</li>
      </ul>
    </div>
  </div>
  
  <script>
    // Vérifier périodiquement la connexion
    window.addEventListener('online', () => {
      window.location.reload();
    });
    
    setInterval(() => {
      if (navigator.onLine) {
        window.location.reload();
      }
    }, 5000);
  </script>
</body>
</html>
```

## 4. Intégration dans l'Application

Ajoutez le code suivant au fichier `index.html` dans la section `<head>` :

```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#4f46e5">
<link rel="apple-touch-icon" href="/icons/icon-192x192.png">
```

Et ajoutez ce script à la fin du fichier `index.html` juste avant la fermeture de `</body>` :

```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => {
          console.log('Service Worker enregistré!', reg);
          
          // Demander la permission pour les notifications
          if (Notification.permission === 'default') {
            Notification.requestPermission();
          }
          
          // Enregistrer pour les mises à jour périodiques
          if ('periodicSync' in reg) {
            try {
              reg.periodicSync.register({
                tag: 'alerts-update',
                minInterval: 24 * 60 * 60 * 1000 // Une fois par jour
              });
            } catch (error) {
              console.log('Periodic Sync non supporté ou erreur:', error);
            }
          }
        })
        .catch(err => console.log('Erreur d\'enregistrement du Service Worker:', err));
    });
    
    // Écouter les mises à jour du Service Worker
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
    
    // Gérer les installations différées
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      
      // Afficher un bouton d'installation personnalisé si besoin
      const installButton = document.getElementById('install-button');
      if (installButton) {
        installButton.style.display = 'block';
        
        installButton.addEventListener('click', (e) => {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('Utilisateur a accepté l\'installation');
            }
            deferredPrompt = null;
            installButton.style.display = 'none';
          });
        });
      }
    });
  }
</script>
```

## 5. Implémentation de la Persistance Offline

Créez un fichier utilitaire pour gérer la persistance des données offline :

### Structure du système de cache local

```javascript
// src/utils/offlineStorage.ts

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AlertImmoDBSchema extends DBSchema {
  favorites: {
    key: string;
    value: {
      id: string;
      userId: string;
      propertyId: string;
      createdAt: string;
      property: any; // Structure complète de la propriété
      pendingSync?: boolean;
    };
    indexes: { 'by-user': string };
  };
  alerts: {
    key: string;
    value: {
      id: string;
      userId: string;
      name: string;
      criteria: any;
      lastNotified: string;
      active: boolean;
      pendingSync?: boolean;
    };
    indexes: { 'by-user': string; 'by-active': boolean };
  };
  properties: {
    key: string;
    value: any; // Structure complète d'une propriété
    indexes: { 'by-type': string; 'by-city': string };
  };
  searches: {
    key: string;
    value: {
      query: string;
      timestamp: number;
      results: string[]; // IDs des propriétés
    };
  };
}

let dbPromise: Promise<IDBPDatabase<AlertImmoDBSchema>>;

export const initDB = async (): Promise<IDBPDatabase<AlertImmoDBSchema>> => {
  if (!dbPromise) {
    dbPromise = openDB<AlertImmoDBSchema>('alertimmo-offline', 1, {
      upgrade(db) {
        // Favorites store
        if (!db.objectStoreNames.contains('favorites')) {
          const favStore = db.createObjectStore('favorites', { keyPath: 'id' });
          favStore.createIndex('by-user', 'userId');
        }
        
        // Alerts store
        if (!db.objectStoreNames.contains('alerts')) {
          const alertStore = db.createObjectStore('alerts', { keyPath: 'id' });
          alertStore.createIndex('by-user', 'userId');
          alertStore.createIndex('by-active', 'active');
        }
        
        // Properties store
        if (!db.objectStoreNames.contains('properties')) {
          const propStore = db.createObjectStore('properties', { keyPath: 'id' });
          propStore.createIndex('by-type', 'type');
          propStore.createIndex('by-city', 'location.city');
        }
        
        // Searches store
        if (!db.objectStoreNames.contains('searches')) {
          db.createObjectStore('searches', { keyPath: 'query' });
        }
      }
    });
  }
  
  return dbPromise;
};

// Sauvegarde d'une propriété visitée
export const saveProperty = async (property: any): Promise<void> => {
  const db = await initDB();
  await db.put('properties', {
    ...property,
    lastVisited: new Date().toISOString()
  });
};

// Sauvegarde d'un favori
export const saveFavorite = async (favorite: any): Promise<void> => {
  const db = await initDB();
  await db.put('favorites', {
    ...favorite,
    pendingSync: navigator.onLine ? false : true
  });
  
  // Si la propriété n'est pas déjà sauvegardée, on la sauvegarde aussi
  if (favorite.property) {
    await saveProperty(favorite.property);
  }
  
  // Si on est online, on essaie de synchroniser immédiatement
  if (navigator.onLine) {
    syncFavorites();
  } else {
    // Si offline, on programme une synchronisation quand on sera de nouveau en ligne
    registerSyncEvent('sync-favorites');
  }
};

// Récupération des favoris
export const getFavorites = async (userId: string): Promise<any[]> => {
  const db = await initDB();
  return db.getAllFromIndex('favorites', 'by-user', userId);
};

// Sauvegarde d'une recherche
export const saveSearch = async (query: string, results: string[]): Promise<void> => {
  const db = await initDB();
  await db.put('searches', {
    query,
    timestamp: Date.now(),
    results
  });
};

// Récupération des dernières recherches
export const getRecentSearches = async (limit = 5): Promise<any[]> => {
  const db = await initDB();
  const searches = await db.getAll('searches');
  return searches
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

// Récupération des propriétés récemment visitées
export const getRecentlyViewedProperties = async (limit = 10): Promise<any[]> => {
  const db = await initDB();
  const properties = await db.getAll('properties');
  return properties
    .filter(p => p.lastVisited)
    .sort((a, b) => new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime())
    .slice(0, limit);
};

// Enregistrer un événement de synchronisation
const registerSyncEvent = async (tag: string): Promise<void> => {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    try {
      const reg = await navigator.serviceWorker.ready;
      await reg.sync.register(tag);
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de la synchronisation:', err);
    }
  }
};

// Synchroniser les favoris avec le serveur
export const syncFavorites = async (): Promise<void> => {
  if (!navigator.onLine) return;
  
  const db = await initDB();
  const pendingFavorites = await db.getAllFromIndex('favorites', 'pendingSync', true);
  
  if (pendingFavorites.length === 0) return;
  
  try {
    // À adapter selon votre API
    for (const favorite of pendingFavorites) {
      try {
        // Supprimer le flag pendingSync avant d'envoyer
        const { pendingSync, ...favoriteData } = favorite;
        
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(favoriteData)
        });
        
        if (response.ok) {
          // Marquer comme synchronisé
          await db.put('favorites', {
            ...favorite,
            pendingSync: false
          });
        }
      } catch (err) {
        console.error('Erreur lors de la synchronisation d\'un favori:', err);
      }
    }
  } catch (err) {
    console.error('Erreur lors de la synchronisation des favoris:', err);
  }
};

// Écouter les événements online/offline
export const setupNetworkListeners = (): void => {
  window.addEventListener('online', () => {
    console.log('L\'application est de nouveau en ligne');
    syncFavorites();
    // Autres synchronisations à ajouter si nécessaire
  });
  
  window.addEventListener('offline', () => {
    console.log('L\'application est hors ligne');
    // Afficher une notification à l'utilisateur si nécessaire
  });
};

// Initialiser les écouteurs au chargement de l'application
setupNetworkListeners();
```

## 6. Optimisations Supplémentaires

### Ajout d'un composant d'installation PWA

```typescript
// src/components/common/InstallPWA.tsx

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Empêcher Chrome d'afficher automatiquement la prompt
      e.preventDefault();
      // Stocker l'événement pour le déclencher plus tard
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Afficher la prompt
    deferredPrompt.prompt();
    
    // Attendre la décision de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    
    // Si l'utilisateur a installé, cacher le bouton
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    
    // L'événement ne peut être utilisé qu'une fois
    setDeferredPrompt(null);
  };

  // Ne rien afficher si l'application n'est pas installable
  if (!isInstallable) return null;

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-2 bg-primary/10 border-primary/30 text-primary"
      onClick={handleInstallClick}
    >
      <Download size={16} />
      Installer l'application
    </Button>
  );
};
```

### Ajout d'un DetectOffline Component

```typescript
// src/components/common/OfflineIndicator.tsx

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <Alert variant="destructive" className="fixed bottom-16 left-4 right-4 md:left-auto md:right-4 md:w-auto md:max-w-md z-50 flex items-center gap-2 shadow-lg">
      <WifiOff className="h-5 w-5" />
      <AlertDescription>
        Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.
      </AlertDescription>
    </Alert>
  );
};
```

### Ajout dans le Layout

Modifiez le composant Layout pour inclure ces nouveaux composants :

```typescript
// dans src/components/layout/Layout.tsx

import { InstallPWA } from '../common/InstallPWA';
import { OfflineIndicator } from '../common/OfflineIndicator';

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // ... keep existing code

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main id="main-content" className="flex-1 container pb-16" tabIndex={-1} aria-label="Contenu principal">
        <FadeIn>
          {children}
        </FadeIn>
      </main>
      <InstallPWA />
      <OfflineIndicator />
      <AccessibilityBar />
      <footer className="container py-4 text-center text-sm text-muted-foreground border-t">
        {/* ... keep existing code */}
      </footer>
      {isMobile && <BottomNav />}
    </div>
  );
};
```

## 7. Scripts de Construction et d'Optimisation

Ajoutez un script dans `package.json` pour générer automatiquement les assets PWA :

```json
"scripts": {
  "build:pwa": "vite build && workbox generateSW workbox-config.js",
  "preview": "vite preview"
},
```

Et créez un fichier `workbox-config.js` à la racine du projet :

```javascript
module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{js,css,html,png,jpg,svg,ico}'
  ],
  swDest: 'dist/sw.js',
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
        },
      },
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
      },
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 an
        },
      },
    }
  ],
};
```

## 8. Tests et Validation

Après avoir implémenté ces modifications, exécutez les vérifications suivantes :

1. Validez le manifest via le [Web Manifest Validator](https://manifest-validator.appspot.com/)
2. Testez l'installabilité via Chrome DevTools > Application > Manifest
3. Vérifiez le service worker via Chrome DevTools > Application > Service Workers
4. Effectuez un audit Lighthouse pour évaluer la compatibilité PWA
5. Testez le fonctionnement hors ligne en désactivant la connexion réseau
