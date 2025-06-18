
import React, { createContext, useContext, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface CacheContextType {
  clearCache: () => void;
  invalidateQueries: (queryKey: string[]) => void;
  prefetchQuery: (queryKey: string[], queryFn: () => Promise<any>) => void;
}

const CacheContext = createContext<CacheContextType | null>(null);

interface CacheProviderProps {
  children: ReactNode;
}

export function CacheProvider({ children }: CacheProviderProps) {
  const queryClient = useQueryClient();

  const clearCache = () => {
    queryClient.clear();
  };

  const invalidateQueries = (queryKey: string[]) => {
    queryClient.invalidateQueries({ queryKey });
  };

  const prefetchQuery = async (queryKey: string[], queryFn: () => Promise<any>) => {
    await queryClient.prefetchQuery({
      queryKey,
      queryFn,
    });
  };

  const value: CacheContextType = {
    clearCache,
    invalidateQueries,
    prefetchQuery,
  };

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
}

export function useCache() {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
}

export function useCacheAvailable() {
  const context = useContext(CacheContext);
  return context !== null;
}
