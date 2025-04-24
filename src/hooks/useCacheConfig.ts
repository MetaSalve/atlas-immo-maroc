
import { QueryClient } from '@tanstack/react-query';

// Configuration de mise en cache pour différentes entités
export const cacheConfig = {
  properties: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  },
  alerts: {
    staleTime: 1000 * 60, // 1 minute
    cacheTime: 1000 * 60 * 10, // 10 minutes
  },
  profile: {
    staleTime: 1000 * 60 * 15, // 15 minutes
    cacheTime: 1000 * 60 * 60, // 60 minutes
  },
  // Nouvelles configurations par type de donnée
  search: {
    staleTime: 1000 * 60 * 2, // 2 minutes
    cacheTime: 1000 * 60 * 15, // 15 minutes
  },
  staticData: {
    staleTime: 1000 * 60 * 60, // 1 heure
    cacheTime: 1000 * 60 * 60 * 24, // 24 heures
  }
};

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // Default stale time: 1 minute
        retry: 1,
        refetchOnWindowFocus: false,
        // Nouvelles options par défaut
        refetchOnMount: 'always',
        refetchOnReconnect: true,
        // Mise en cache persistante côté client
        cacheTime: 1000 * 60 * 60, // 1 heure par défaut
      },
      mutations: {
        // Options pour les mutations
        retry: 2,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });
};

export const optimizedQueryKeys = {
  properties: {
    all: ['properties'] as const,
    lists: () => [...optimizedQueryKeys.properties.all, 'list'] as const,
    list: (filters: object) => [...optimizedQueryKeys.properties.lists(), filters] as const,
    details: (id: string) => [...optimizedQueryKeys.properties.all, 'detail', id] as const,
  },
  alerts: {
    all: ['alerts'] as const,
    user: (userId: string) => [...optimizedQueryKeys.alerts.all, userId] as const,
  },
  user: {
    all: ['user'] as const,
    profile: (id: string) => [...optimizedQueryKeys.user.all, 'profile', id] as const,
    favorites: (id: string) => [...optimizedQueryKeys.user.all, 'favorites', id] as const,
  },
  // Nouvelles clés pour une meilleure organisation
  search: {
    all: ['search'] as const,
    results: (query: string, filters?: object) => 
      [...optimizedQueryKeys.search.all, 'results', query, filters] as const,
  },
  static: {
    all: ['static'] as const,
    propertyTypes: () => [...optimizedQueryKeys.static.all, 'propertyTypes'] as const,
    cities: () => [...optimizedQueryKeys.static.all, 'cities'] as const,
  },
};

// Fonction utilitaire pour précharger les données fréquemment utilisées
export const preloadCommonQueries = (queryClient: QueryClient) => {
  // Préchargement des données statiques
  queryClient.prefetchQuery({
    queryKey: optimizedQueryKeys.static.propertyTypes(),
    queryFn: () => fetch('/api/property-types').then(res => res.json()),
    staleTime: cacheConfig.staticData.staleTime,
  });
  
  queryClient.prefetchQuery({
    queryKey: optimizedQueryKeys.static.cities(),
    queryFn: () => fetch('/api/cities').then(res => res.json()),
    staleTime: cacheConfig.staticData.staleTime,
  });
};
