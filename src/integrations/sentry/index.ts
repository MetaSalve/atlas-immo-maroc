
import * as Sentry from '@sentry/react';

export const initSentry = () => {
  // Ne pas initialiser Sentry en développement
  if (import.meta.env.DEV) {
    console.log('[Sentry] Monitoring désactivé en développement');
    return;
  }
  
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  if (!dsn) {
    console.warn('[Sentry] DSN manquant, le monitoring ne sera pas activé');
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      new Sentry.BrowserTracing({
        // Trace 10% des transactions pour les performances
        tracePropagationTargets: ['localhost', /^https:\/\/alertimmo\.com/],
      }),
      new Sentry.Replay(),
    ],
    
    // Capture des performances sur 10% des sessions
    tracesSampleRate: 0.1,
    
    // Capture des replays d'erreurs
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Environnement
    environment: import.meta.env.MODE,
    
    // Informations de version
    release: import.meta.env.VITE_APP_VERSION || 'development',
    
    // Ne pas capturer les erreurs en développement
    enabled: import.meta.env.PROD,
    
    // Ignorer certaines erreurs
    ignoreErrors: [
      // Erreurs de réseau communes
      /Network Error/i,
      /Failed to fetch/i,
      // Erreurs liées à l'extension React DevTools
      /ResizeObserver loop/i,
    ],
  });

  // Ajouter le contexte utilisateur si disponible
  const userJson = localStorage.getItem('sb-authuser');
  if (userJson) {
    try {
      const userData = JSON.parse(userJson);
      if (userData && userData.user) {
        Sentry.setUser({
          id: userData.user.id,
          email: userData.user.email,
        });
      }
    } catch (e) {
      console.error('[Sentry] Erreur lors de la récupération des données utilisateur', e);
    }
  }
};

// Wrapper pour capturer les erreurs manuellement
export const captureError = (error: Error, context?: Record<string, any>) => {
  console.error('[Error]', error);
  
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      contexts: { additionalData: context || {} },
    });
  }
};

// Décorateur pour surveiller une fonction et capturer ses erreurs
export function withErrorMonitoring<T extends (...args: any[]) => any>(
  fn: T, 
  context?: string
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    try {
      return fn(...args);
    } catch (error) {
      captureError(error as Error, { 
        context, 
        functionName: fn.name,
        arguments: JSON.stringify(args),
      });
      throw error;
    }
  };
}

// Composant HOC pour surveiller les erreurs dans les composants React
export const withErrorBoundary = Sentry.withErrorBoundary;
