
import { useState, useEffect, useCallback } from 'react';
import { useQueryClient, QueryKey } from '@tanstack/react-query';
import { optimizedQueryKeys, cacheConfig } from './useCacheConfig';
import { useNetwork } from './useNetwork';

interface CacheStatistics {
  hitRate: number;
  missRate: number;
  staleRate: number;
  totalQueries: number;
}

export const useAdvancedCache = () => {
  const queryClient = useQueryClient();
  const { isOnline } = useNetwork();
  const [cacheStats, setCacheStats] = useState<CacheStatistics>({
    hitRate: 0,
    missRate: 0,
    staleRate: 0,
    totalQueries: 0,
  });

  // Prépare les données fréquemment utilisées en fonction du contexte
  const prefetchContextualData = useCallback(() => {
    if (!isOnline) return;

    // Précharger les données fréquentes
    queryClient.prefetchQuery({
      queryKey: optimizedQueryKeys.static.cities(),
      queryFn: () => fetch('/api/cities').then(res => res.json()),
      staleTime: cacheConfig.staticData.staleTime,
      gcTime: cacheConfig.staticData.gcTime,
    });

    queryClient.prefetchQuery({
      queryKey: optimizedQueryKeys.static.propertyTypes(),
      queryFn: () => fetch('/api/property-types').then(res => res.json()),
      staleTime: cacheConfig.staticData.staleTime,
      gcTime: cacheConfig.staticData.gcTime,
    });
  }, [queryClient, isOnline]);

  // Invalide intelligemment le cache en fonction des mutations
  const invalidateRelatedQueries = useCallback((entity: string, id?: string) => {
    switch (entity) {
      case 'property':
        if (id) {
          queryClient.invalidateQueries({ queryKey: optimizedQueryKeys.properties.details(id) });
        }
        queryClient.invalidateQueries({ queryKey: optimizedQueryKeys.properties.lists() });
        break;
      case 'favorite':
        queryClient.invalidateQueries({ queryKey: optimizedQueryKeys.user.favorites('current') });
        break;
      case 'alert':
        queryClient.invalidateQueries({ queryKey: optimizedQueryKeys.alerts.all });
        break;
      case 'user':
        if (id) {
          queryClient.invalidateQueries({ queryKey: optimizedQueryKeys.user.profile(id) });
        }
        break;
      default:
        break;
    }
  }, [queryClient]);

  // Persiste certaines données dans le localStorage pour l'accès offline
  const persistCriticalData = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Error persisting data to localStorage:', error);
    }
  }, []);

  // Récupère les données persistées
  const getPersistedData = useCallback((key: string, maxAge = 24 * 60 * 60 * 1000) => {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;

      const { data, timestamp } = JSON.parse(item);
      const age = Date.now() - timestamp;

      if (age > maxAge) {
        localStorage.removeItem(`cache_${key}`);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error retrieving persisted data:', error);
      return null;
    }
  }, []);

  // Calcule les statistiques de cache
  const calculateCacheStats = useCallback(() => {
    const queryCache = queryClient.getQueryCache();
    const queries = queryCache.getAll();
    
    if (queries.length === 0) {
      setCacheStats({
        hitRate: 0,
        missRate: 0,
        staleRate: 0,
        totalQueries: 0,
      });
      return;
    }

    let hits = 0;
    let misses = 0;
    let stale = 0;

    queries.forEach(query => {
      if (query.state.status === 'success' && !query.state.dataUpdateCount) {
        misses++;
      } else if (query.state.status === 'success') {
        hits++;
        // Correction: Accéder à staleTime de façon sûre avec une conversion de type
        const options = query.options as any;  // Utiliser any pour contourner les limitations de TypeScript
        const staleTime = options?.staleTime || 0;
        
        if (query.state.dataUpdatedAt < Date.now() - staleTime) {
          stale++;
        }
      } else {
        misses++;
      }
    });

    setCacheStats({
      hitRate: hits / queries.length,
      missRate: misses / queries.length,
      staleRate: stale / queries.length,
      totalQueries: queries.length,
    });
  }, [queryClient]);

  // Optimise l'utilisation du cache
  const optimizeCacheUsage = useCallback(() => {
    // Supprimer les données obsolètes
    const now = Date.now();
    queryClient.getQueryCache().getAll().forEach(query => {
      const lastUpdated = query.state.dataUpdatedAt;
      if (lastUpdated && now - lastUpdated > 24 * 60 * 60 * 1000) {
        queryClient.removeQueries({ queryKey: query.queryKey });
      }
    });

    // Recalculer les statistiques
    calculateCacheStats();
  }, [queryClient, calculateCacheStats]);

  // Exécuter l'optimisation périodiquement
  useEffect(() => {
    const interval = setInterval(optimizeCacheUsage, 15 * 60 * 1000); // 15 minutes
    return () => clearInterval(interval);
  }, [optimizeCacheUsage]);

  // Précharger les données contextuelles au démarrage
  useEffect(() => {
    prefetchContextualData();
  }, [prefetchContextualData]);

  return {
    prefetchContextualData,
    invalidateRelatedQueries,
    persistCriticalData,
    getPersistedData,
    optimizeCacheUsage,
    cacheStats,
  };
};
