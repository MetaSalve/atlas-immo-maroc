
import React from 'react';
import { useLocation } from 'react-router-dom';

interface PreloadOptions {
  priority?: 'high' | 'low';
  timeoutMs?: number;
}

export const useCodeSplitting = () => {
  const location = useLocation();
  const preloadedModules = React.useRef<Set<string>>(new Set());

  // Précharge intelligemment les modules en fonction des interactions utilisateur
  const preloadModule = React.useCallback((
    moduleLoader: () => Promise<any>,
    options: PreloadOptions = { priority: 'low', timeoutMs: 2000 }
  ) => {
    // Génère une clé unique basée sur la fonction moduleLoader
    const moduleKey = moduleLoader.toString();

    // Évite de précharger le même module plusieurs fois
    if (preloadedModules.current.has(moduleKey)) {
      return;
    }

    const { priority, timeoutMs } = options;

    // Précharge immédiatement les modules haute priorité
    if (priority === 'high') {
      moduleLoader();
      preloadedModules.current.add(moduleKey);
      return;
    }

    // Précharge les modules basse priorité quand le navigateur est inactif
    // ou après un délai
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        moduleLoader();
        preloadedModules.current.add(moduleKey);
      }, { timeout: timeoutMs });
    } else {
      setTimeout(() => {
        moduleLoader();
        preloadedModules.current.add(moduleKey);
      }, timeoutMs);
    }
  }, []);

  // Analyse la route actuelle pour précharger les modules probables
  React.useEffect(() => {
    // Précharge les modules en fonction de la route actuelle
    if (location.pathname.startsWith('/properties')) {
      preloadModule(() => import('@/pages/FavoritesPage'), { priority: 'high' });
      preloadModule(() => import('@/pages/SearchPage'), { priority: 'low' });
    } else if (location.pathname === '/search') {
      preloadModule(() => import('@/pages/PropertyDetailPage'), { priority: 'high' });
      preloadModule(() => import('@/pages/FavoritesPage'), { priority: 'low' });
    } else if (location.pathname === '/home') {
      preloadModule(() => import('@/pages/SearchPage'), { priority: 'high' });
      preloadModule(() => import('@/pages/PropertyDetailPage'), { priority: 'low' });
    } else if (location.pathname === '/auth') {
      preloadModule(() => import('@/pages/HomePage'), { priority: 'high' });
      preloadModule(() => import('@/pages/ResetPasswordPage'), { priority: 'low' });
    }
  }, [location.pathname, preloadModule]);

  return { preloadModule };
};
