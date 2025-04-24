
import React, { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';
import { optimizedQueryKeys, cacheConfig } from './useCacheConfig';
import { useErrorHandler } from './useErrorHandler';
import { useCacheContext } from '@/providers/CacheProvider';

const PROPERTIES_PER_PAGE = 12;

export interface PropertyFilters {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
}

export const useProperties = (
  filters?: PropertyFilters, 
  page: number = 1,
  enablePrefetching: boolean = true
) => {
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();
  const { isOnline, getPersistedData, persistCriticalData } = useCacheContext();
  
  const queryKey = useMemo(() => 
    optimizedQueryKeys.properties.list({ ...filters, page }), 
    [filters, page]
  );

  const prefetchNextPage = useCallback(() => {
    if (!enablePrefetching || !isOnline) return;
    
    queryClient.prefetchQuery({
      queryKey: optimizedQueryKeys.properties.list({ ...filters, page: page + 1 }),
      queryFn: () => fetchProperties(filters, page + 1),
      staleTime: cacheConfig.properties.staleTime,
      gcTime: cacheConfig.properties.gcTime,
    });
  }, [queryClient, filters, page, enablePrefetching, isOnline]);

  const fetchProperties = async (currentFilters?: PropertyFilters, currentPage: number = 1) => {
    console.log(`Récupération des propriétés depuis Supabase - Page ${currentPage}...`);
    
    // Si hors ligne, tenter de récupérer depuis le cache persistent
    if (!isOnline) {
      const cacheKey = `properties_${JSON.stringify(currentFilters)}_page_${currentPage}`;
      const cachedData = getPersistedData(cacheKey);
      
      if (cachedData) {
        console.log('Utilisation des données en cache (mode hors ligne)');
        return cachedData;
      } else {
        throw new Error('Impossible de récupérer les données en mode hors ligne');
      }
    }
    
    const from = (currentPage - 1) * PROPERTIES_PER_PAGE;
    const to = from + PROPERTIES_PER_PAGE - 1;
    
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (currentFilters) {
      if (currentFilters.city) {
        query = query.ilike('city', `%${currentFilters.city}%`);
      }
      if (currentFilters.type) {
        query = query.eq('type', currentFilters.type);
      }
      if (currentFilters.status) {
        query = query.eq('status', currentFilters.status);
      }
      if (currentFilters.minPrice !== undefined) {
        query = query.gte('price', currentFilters.minPrice);
      }
      if (currentFilters.maxPrice !== undefined) {
        query = query.lte('price', currentFilters.maxPrice);
      }
      if (currentFilters.bedrooms !== undefined) {
        query = query.gte('bedrooms', currentFilters.bedrooms);
      }
      if (currentFilters.bathrooms !== undefined) {
        query = query.gte('bathrooms', currentFilters.bathrooms);
      }
    }

    const { data, error, count } = await query;
    
    if (error) {
      console.error('Erreur lors de la récupération des propriétés:', error);
      throw error;
    }
    
    console.log(`${data?.length || 0} propriétés récupérées sur un total de ${count || 'inconnu'}`);
    
    if (!data || data.length === 0) {
      return { properties: [], total: count || 0, page: currentPage };
    }
    
    const properties = data.map((property): Property => ({
      id: property.id,
      title: property.title,
      description: property.description || '',
      price: Number(property.price),
      priceUnit: property.price_unit as 'MAD' | 'EUR' | 'USD',
      area: Number(property.area),
      bedrooms: property.bedrooms || 0,
      bathrooms: property.bathrooms || 0,
      location: {
        address: property.address,
        city: property.city,
        district: property.district,
        coordinates: {
          lat: Number(property.lat) || 0,
          lng: Number(property.lng) || 0,
        },
      },
      images: property.images || [],
      type: property.type as 'apartment' | 'house' | 'villa' | 'riad' | 'land' | 'commercial' | 'other',
      status: property.status as 'for-sale' | 'for-rent',
      features: property.features || [],
      source: {
        name: property.source_name,
        logo: property.source_logo,
        url: property.source_url,
      },
      contactInfo: {
        name: property.contact_name,
        phone: property.contact_phone,
        email: property.contact_email,
      },
      createdAt: property.created_at,
      updatedAt: property.updated_at,
    }));
    
    const result = { properties, total: count || 0, page: currentPage };
    
    // Mettre en cache pour le mode hors ligne
    const cacheKey = `properties_${JSON.stringify(currentFilters)}_page_${currentPage}`;
    persistCriticalData(cacheKey, result);
    
    console.log(`${properties.length} propriétés transformées et prêtes à afficher`);
    return result;
  };

  const result = useQuery({
    queryKey,
    queryFn: () => fetchProperties(filters, page),
    staleTime: cacheConfig.properties.staleTime,
    gcTime: cacheConfig.properties.gcTime,
    refetchOnWindowFocus: false,
    retry: isOnline ? 1 : 0,
    enabled: isOnline,
    meta: {
      onError: (error: Error) => {
        handleError(error, { 
          showToast: true, 
          logToConsole: true 
        });
      }
    }
  });

  React.useEffect(() => {
    if (result.isSuccess && !result.isLoading) {
      prefetchNextPage();
    }
  }, [result.isSuccess, result.isLoading, prefetchNextPage]);

  return {
    ...result,
    data: result.data?.properties || [],
    totalCount: result.data?.total || 0,
    currentPage: result.data?.page || page,
    prefetchNextPage,
    isOffline: !isOnline && result.isError,
  };
};
