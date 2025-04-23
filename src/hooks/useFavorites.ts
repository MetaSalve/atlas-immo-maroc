
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { useSubscription } from '@/providers/SubscriptionProvider';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { tier, maxFavorites } = useSubscription();

  // Fetch favorites from the database
  const loadFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const propertyIds = data.map(item => item.property_id);
      setFavorites(propertyIds);
      console.log(`Loaded ${propertyIds.length} favorites for user ${user.id}`);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Impossible de charger vos favoris');
    } finally {
      setLoading(false);
    }
  };

  // Add a property to favorites
  const addFavorite = async (propertyId: string) => {
    if (!user) {
      toast('Connectez-vous pour ajouter des favoris', {
        action: {
          label: 'Se connecter',
          onClick: () => window.location.href = '/auth',
        },
      });
      return false;
    }

    // Check if the user can add more favorites
    if (tier === 'free' && favorites.length >= maxFavorites) {
      toast('Limite de favoris atteinte', {
        description: `Les utilisateurs gratuits sont limités à ${maxFavorites} favoris. Passez à l'abonnement Premium pour des favoris illimités.`,
        action: {
          label: 'Passer à Premium',
          onClick: () => window.location.href = '/subscription',
        },
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, property_id: propertyId });

      if (error) throw error;

      setFavorites(prev => [...prev, propertyId]);
      toast.success('Bien ajouté aux favoris');
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error("Impossible d'ajouter ce bien aux favoris");
      return false;
    }
  };

  // Remove a property from favorites
  const removeFavorite = async (propertyId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId);

      if (error) throw error;

      setFavorites(prev => prev.filter(id => id !== propertyId));
      toast.success('Bien retiré des favoris');
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Impossible de retirer ce bien des favoris');
      return false;
    }
  };

  // Check if a property is in favorites
  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId);
  };

  // Toggle favorite status
  const toggleFavorite = async (propertyId: string) => {
    if (isFavorite(propertyId)) {
      return await removeFavorite(propertyId);
    } else {
      return await addFavorite(propertyId);
    }
  };

  // Load favorites when the user changes
  useEffect(() => {
    loadFavorites();
  }, [user]);

  return {
    favorites,
    loading,
    isLoading: loading, // Alias for loading to match other hooks
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite, // Exported toggle function
    refreshFavorites: loadFavorites,
    hasReachedLimit: tier === 'free' && favorites.length >= maxFavorites
  };
};
