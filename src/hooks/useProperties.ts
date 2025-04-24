
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';
import { optimizedQueryKeys, cacheConfig } from './useCacheConfig';
import { useErrorHandler } from './useErrorHandler';

export interface PropertyFilters {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
}

export const useProperties = (filters?: PropertyFilters) => {
  const { handleError } = useErrorHandler();

  const fetchProperties = async () => {
    console.log('Récupération des propriétés depuis Supabase...');
    
    let query = supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    // Appliquer les filtres si présents
    if (filters) {
      if (filters.city) {
        query = query.ilike('city', `%${filters.city}%`);
      }
      if (filters.type) {
        query = query.eq('type', filters.type);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.bedrooms !== undefined) {
        query = query.gte('bedrooms', filters.bedrooms);
      }
      if (filters.bathrooms !== undefined) {
        query = query.gte('bathrooms', filters.bathrooms);
      }
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Erreur lors de la récupération des propriétés:', error);
      throw error;
    }
    
    console.log(`${data?.length || 0} propriétés récupérées`);
    
    if (!data || data.length === 0) {
      // Vérifier s'il y a des données dans la table
      const { count, error: countError } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Erreur lors du comptage des propriétés:', countError);
      } else {
        console.log(`Nombre total de propriétés dans la base: ${count}`);
      }
      
      return [];
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
    
    console.log(`${properties.length} propriétés transformées et prêtes à afficher`);
    return properties;
  };

  return useQuery({
    queryKey: optimizedQueryKeys.properties.list(filters || {}),
    queryFn: fetchProperties,
    staleTime: cacheConfig.properties.staleTime,
    gcTime: cacheConfig.properties.cacheTime,
    refetchOnWindowFocus: false,
    retry: 1,
    onError: (error) => {
      handleError(error, { 
        showToast: true, 
        logToConsole: true 
      });
    }
  });
};
