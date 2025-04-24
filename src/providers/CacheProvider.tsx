
import React, { createContext, useContext } from 'react';
import { useAdvancedCache } from '@/hooks/useAdvancedCache';
import { useNetwork } from '@/hooks/useNetwork';

interface CacheContextType {
  invalidateRelatedQueries: (entity: string, id?: string) => void;
  persistCriticalData: (key: string, data: any) => void;
  getPersistedData: (key: string, maxAge?: number) => any;
  prefetchContextualData: () => void;
  cacheStats: {
    hitRate: number;
    missRate: number;
    staleRate: number;
    totalQueries: number;
  };
  isOnline: boolean;
  connectionType: string | null;
}

const CacheContext = createContext<CacheContextType | null>(null);

export const useCacheContext = () => {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCacheContext must be used within a CacheProvider');
  }
  return context;
};

export const CacheProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const {
    invalidateRelatedQueries,
    persistCriticalData,
    getPersistedData,
    prefetchContextualData,
    cacheStats,
  } = useAdvancedCache();
  
  const { isOnline, connectionType } = useNetwork();

  return (
    <CacheContext.Provider
      value={{
        invalidateRelatedQueries,
        persistCriticalData,
        getPersistedData,
        prefetchContextualData,
        cacheStats,
        isOnline,
        connectionType,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};
