
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
  }
};

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60, // Default stale time: 1 minute
        retry: 1,
        refetchOnWindowFocus: false,
        onError: (error) => {
          console.error('Query error:', error);
          // On pourrait implémenter une logique de notification d'erreur ici
        },
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
};
