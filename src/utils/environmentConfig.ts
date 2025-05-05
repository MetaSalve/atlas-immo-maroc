
/**
 * Configuration des variables d'environnement pour la production
 * Ce module centralise la gestion des variables d'environnement pour faciliter le déploiement
 */

// Valeurs par défaut utilisées en développement
const defaultConfig = {
  apiUrl: 'https://lomogmjwjnhvmcqkpjmg.supabase.co',
  stripePublicKey: 'pk_test_51JQwDKJ54Kn7nPwL8JGt9hgXlGRLBYiBfvS8BzFg5ZgmAQb3QPrdrN8JX3VLg3UAUdX9plME7HyssQdZrZ0HK0Kg00GdXU1Jri',
  mapboxToken: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
  enableAnalytics: false,
  maxUploadSize: 5242880, // 5MB
  enablePushNotifications: false,
};

// Mode de l'application (development ou production)
export const appMode = import.meta.env.MODE || 'development';

/**
 * Charge la configuration en fonction de l'environnement
 */
const loadConfig = () => {
  // Configuration de production
  if (appMode === 'production') {
    return {
      apiUrl: 'https://lomogmjwjnhvmcqkpjmg.supabase.co',
      stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || defaultConfig.stripePublicKey,
      mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN || defaultConfig.mapboxToken,
      enableAnalytics: true,
      maxUploadSize: 10485760, // 10MB en production
      enablePushNotifications: true,
      baseUrl: 'https://alertimmo.ma',
    };
  }

  // Configuration de staging
  if (appMode === 'staging') {
    return {
      apiUrl: 'https://lomogmjwjnhvmcqkpjmg.supabase.co',
      stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || defaultConfig.stripePublicKey,
      mapboxToken: import.meta.env.VITE_MAPBOX_TOKEN || defaultConfig.mapboxToken,
      enableAnalytics: true,
      maxUploadSize: 10485760,
      enablePushNotifications: false,
      baseUrl: 'https://staging.alertimmo.ma',
    };
  }

  // Configuration de développement (par défaut)
  return {
    ...defaultConfig,
    baseUrl: 'http://localhost:5173',
  };
};

// Configuration exportée
export const config = loadConfig();
