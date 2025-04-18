
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((property): Property => ({
        id: property.id,
        title: property.title,
        description: property.description || '',
        price: Number(property.price),
        priceUnit: property.price_unit as 'MAD' | 'EUR' | 'USD', // Type assertion for price_unit
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
        type: property.type as 'apartment' | 'house' | 'villa' | 'riad' | 'land' | 'commercial' | 'other', // Type assertion for type
        status: property.status as 'for-sale' | 'for-rent', // Type assertion for status
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
    },
  });
};
