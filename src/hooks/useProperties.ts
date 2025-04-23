
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/property';

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('Récupération des propriétés depuis Supabase...');
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erreur lors de la récupération des propriétés:', error);
        throw error;
      }
      
      console.log(`${data?.length || 0} propriétés récupérées:`, data);
      
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
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
