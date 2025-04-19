
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useFavorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(fav => fav.property_id);
    },
    enabled: !!user,
  });

  const toggleFavorite = useMutation({
    mutationFn: async (propertyId: string) => {
      if (!user) {
        navigate('/auth');
        throw new Error('Vous devez être connecté pour ajouter des favoris');
      }
      
      const isFavorite = favorites.includes(propertyId);
      
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);
          
        if (error) throw error;
        
        toast.success('Bien retiré des favoris');
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: user.id, property_id: propertyId });
          
        if (error) throw error;
        
        toast.success('Bien ajouté aux favoris');
      }
      
      return { propertyId, isFavorite };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      toast.error(error.message || 'Une erreur est survenue');
    }
  });

  return {
    favorites,
    toggleFavorite: toggleFavorite.mutate,
    isLoading: isLoading || toggleFavorite.isPending,
  };
};
