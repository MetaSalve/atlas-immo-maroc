
import React, { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';
import { optimizedQueryKeys, cacheConfig } from './useCacheConfig';
import { useErrorHandler } from './useErrorHandler';
import { useCache } from '@/providers/CacheProvider';
import { useNetwork } from '@/hooks/useNetwork';
import { useAuth } from '@/providers/AuthProvider';

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
  const { prefetchQuery } = useCache();
  const { isOnline } = useNetwork();
  const { session } = useAuth();
  
  const queryKey = useMemo(() => 
    optimizedQueryKeys.properties.list({ ...filters, page }), 
    [filters, page]
  );

  const prefetchNextPage = useCallback(() => {
    if (!enablePrefetching || !isOnline) return;
    
    const nextPageQueryKey = optimizedQueryKeys.properties.list({ ...filters, page: page + 1 });
    const queryKeyArray = Array.from(nextPageQueryKey) as string[];
    prefetchQuery(
      queryKeyArray,
      () => fetchProperties(filters, page + 1)
    );
  }, [prefetchQuery, filters, page, enablePrefetching, isOnline]);

  const fetchProperties = async (currentFilters?: PropertyFilters, currentPage: number = 1) => {
    console.log(`Récupération des propriétés depuis Supabase - Page ${currentPage}...`);
    
    if (!isOnline) {
      throw new Error('Impossible de récupérer les données en mode hors ligne');
    }
    
    const from = (currentPage - 1) * PROPERTIES_PER_PAGE;
    const to = from + PROPERTIES_PER_PAGE - 1;
    
    let data: any = null;
    let error: any = null;
    let count: number | null = null;
    
    // Use appropriate table/view based on authentication status
    if (session) {
      // Authenticated users can access full properties table with contact info
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

      const result = await query;
      data = result.data;
      error = result.error;
      count = result.count;
    } else {
      // Anonymous users call public function without contact info
      // Note: For anonymous users, we need to get all data first then apply filters in JavaScript
      // since RPC calls don't support the same chaining as table queries
      const result = await supabase.rpc('get_public_properties');
      
      let allData = result.data || [];
      error = result.error;
      
      // Apply filters in JavaScript for anonymous users
      if (currentFilters && allData.length > 0) {
        allData = allData.filter((property: any) => {
          if (currentFilters.city && !property.city?.toLowerCase().includes(currentFilters.city.toLowerCase())) {
            return false;
          }
          if (currentFilters.type && property.type !== currentFilters.type) {
            return false;
          }
          if (currentFilters.status && property.status !== currentFilters.status) {
            return false;
          }
          if (currentFilters.minPrice !== undefined && Number(property.price) < currentFilters.minPrice) {
            return false;
          }
          if (currentFilters.maxPrice !== undefined && Number(property.price) > currentFilters.maxPrice) {
            return false;
          }
          if (currentFilters.bedrooms !== undefined && (property.bedrooms || 0) < currentFilters.bedrooms) {
            return false;
          }
          if (currentFilters.bathrooms !== undefined && (property.bathrooms || 0) < currentFilters.bathrooms) {
            return false;
          }
          return true;
        });
      }
      
      // Sort by created_at descending (newest first)
      allData = allData.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      // Apply pagination manually
      count = allData.length;
      data = allData.slice(from, to + 1);
    }
    
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
        // Only include contact info for authenticated users
        name: session ? (property.contact_name || 'Contact non disponible') : 'Connexion requise',
        phone: session ? property.contact_phone : undefined,
        email: session ? property.contact_email : undefined,
      },
      createdAt: property.created_at,
      updatedAt: property.updated_at,
    }));
    
    const result = { properties, total: count || 0, page: currentPage };
    
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
