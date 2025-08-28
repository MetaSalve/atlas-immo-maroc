import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';
import { useAuth } from '@/providers/AuthProvider';
import { useErrorHandler } from './useErrorHandler';

export const usePropertyDetail = (propertyId: string) => {
  const { session } = useAuth();
  const { handleError } = useErrorHandler();

  const fetchProperty = async (): Promise<Property | null> => {
    if (!propertyId) return null;

    let data: any = null;
    let error: any = null;

    // Use appropriate table/view based on authentication status
    if (session) {
      // Authenticated users can access full properties table with contact info
      const result = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .maybeSingle();
      
      data = result.data;
      error = result.error;
    } else {
      // Anonymous users call public function without contact info
      const result = await supabase.rpc('get_public_properties');
      
      if (result.error) {
        error = result.error;
        data = null;
      } else {
        // Find the specific property by ID from the function result
        data = result.data?.find((property: any) => property.id === propertyId) || null;
      }
    }

    if (error) {
      console.error('Erreur lors de la récupération de la propriété:', error);
      throw error;
    }

    if (!data) {
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || '',
      price: Number(data.price),
      priceUnit: data.price_unit as 'MAD' | 'EUR' | 'USD',
      area: Number(data.area),
      bedrooms: data.bedrooms || 0,
      bathrooms: data.bathrooms || 0,
      location: {
        address: data.address,
        city: data.city,
        district: data.district,
        coordinates: {
          lat: Number(data.lat) || 0,
          lng: Number(data.lng) || 0,
        },
      },
      images: data.images || [],
      type: data.type as 'apartment' | 'house' | 'villa' | 'riad' | 'land' | 'commercial' | 'other',
      status: data.status as 'for-sale' | 'for-rent',
      features: data.features || [],
      source: {
        name: data.source_name,
        logo: data.source_logo,
        url: data.source_url,
      },
      contactInfo: {
        // Handle different access levels for contact information
        name: data.contact_name || (session ? 'Premium requis' : 'Connexion requise'),
        phone: data.contact_phone || undefined,
        email: data.contact_email || undefined,
      },
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  };

  return useQuery({
    queryKey: ['property', propertyId, session?.user?.id],
    queryFn: fetchProperty,
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    meta: {
      onError: (error: Error) => {
        handleError(error, { 
          showToast: true, 
          logToConsole: true 
        });
      }
    }
  });
};