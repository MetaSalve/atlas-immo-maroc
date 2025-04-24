
/**
 * Utilitaires pour l'optimisation des performances
 */

// Fonction pour compresser les images
export const optimizeImage = (url: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
} = {}): string => {
  if (!url) return '';
  
  // Si c'est une URL externe, tenter d'utiliser un service d'optimisation
  if (url.startsWith('http')) {
    // Pour les URL non-optimisées, appliquer des paramètres d'optimisation
    const defaultOptions = {
      width: options.width || 800,
      quality: options.quality || 80,
      format: options.format || 'webp'
    };

    // Si c'est déjà optimisé ou une URL spéciale, retourner telle quelle
    if (url.includes('imgix.net') || url.includes('cloudinary.com')) {
      return url;
    }

    // Simuler un service d'optimisation simple
    // Dans une vraie implémentation, utiliser un CDN comme Cloudinary, imgix, etc.
    // Ici on retourne simplement l'URL originale
    return url;
  }

  // Pour les ressources locales, on pourrait appliquer une logique spécifique
  return url;
};

// Fonction de debounce pour limiter les appels fréquents
export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

// Fonction de throttle pour limiter la fréquence des appels
export const throttle = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastFunc: number = 0;
  let lastRan: number = 0;

  return (...args: Parameters<F>): void => {
    const now = Date.now();
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    if (!lastRan) {
      func(...args);
      lastRan = now;
    } else {
      lastFunc = now;
      timeout = setTimeout(() => {
        if (now - lastRan >= waitFor) {
          func(...args);
          lastRan = Date.now();
        }
      }, Math.max(waitFor - (now - lastRan), 0));
    }
  };
};

// Mise en cache côté client pour les requêtes fréquentes
interface CacheOptions {
  ttl: number; // Time to live en millisecondes
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class ClientCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultOptions: CacheOptions = { ttl: 5 * 60 * 1000 }; // 5 minutes par défaut

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.defaultOptions.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  set<T>(key: string, data: T, options?: Partial<CacheOptions>): void {
    const opts = { ...this.defaultOptions, ...options };
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });

    // Automatiquement nettoyer l'entrée après expiration
    setTimeout(() => {
      if (this.cache.has(key)) {
        this.cache.delete(key);
      }
    }, opts.ttl);
  }

  invalidate(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

// Instance exportée du cache client
export const clientCache = new ClientCache();
