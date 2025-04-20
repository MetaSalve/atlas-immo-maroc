
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserAlert } from '@/types/alerts';
import { useNavigate } from 'react-router-dom';
import { SearchFiltersValues } from '@/components/search/SearchFilters';

export const useAlerts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchAlerts = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Cast the data to ensure TypeScript compatibility
      const typedAlerts = data?.map(item => ({
        ...item,
        filters: item.filters as unknown as UserAlert['filters']
      })) || [];
      
      setAlerts(typedAlerts as UserAlert[]);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast('Impossible de charger vos alertes', {
        description: 'Une erreur est survenue lors du chargement des alertes.',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Créer une nouvelle alerte
  const createAlert = async (alertData: {name: string, filters: SearchFiltersValues, is_active: boolean}) => {
    if (!user) {
      navigate('/auth');
      return false;
    }
    
    try {
      // Convertir les filtres en JSON avant de les envoyer à Supabase
      const filtersJson = JSON.parse(JSON.stringify(alertData.filters));
      
      const { error } = await supabase
        .from('user_alerts')
        .insert({
          user_id: user.id,
          name: alertData.name,
          filters: filtersJson,
          is_active: alertData.is_active
        });
        
      if (error) throw error;
      
      toast('Alerte créée avec succès', {
        description: 'Vous recevrez des notifications pour les nouveaux biens correspondant à vos critères.',
        duration: 5000,
      });
      
      await fetchAlerts(); // Rafraîchir la liste des alertes
      return true;
    } catch (error) {
      console.error('Error creating alert:', error);
      toast('Erreur lors de la création de l\'alerte', {
        description: 'Veuillez réessayer plus tard.',
        duration: 5000,
      });
      return false;
    }
  };

  // Modifier une alerte existante
  const updateAlert = async (id: string, alertData: Partial<UserAlert>) => {
    if (!user) {
      navigate('/auth');
      return false;
    }
    
    try {
      // Convertir les filtres en JSON si présents
      const filtersJson = alertData.filters ? JSON.parse(JSON.stringify(alertData.filters)) : undefined;
      
      const { error } = await supabase
        .from('user_alerts')
        .update({
          name: alertData.name,
          filters: filtersJson,
          is_active: alertData.is_active
        })
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast('Alerte mise à jour', {
        duration: 3000,
      });
      
      await fetchAlerts();
      return true;
    } catch (error) {
      console.error('Error updating alert:', error);
      toast('Erreur lors de la mise à jour de l\'alerte', {
        description: 'Veuillez réessayer plus tard.',
        duration: 5000,
      });
      return false;
    }
  };

  // Supprimer une alerte
  const deleteAlert = async (id: string) => {
    if (!user) {
      navigate('/auth');
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('user_alerts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      toast('Alerte supprimée', {
        duration: 3000,
      });
      
      await fetchAlerts();
      return true;
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast('Erreur lors de la suppression de l\'alerte', {
        description: 'Veuillez réessayer plus tard.',
        duration: 5000,
      });
      return false;
    }
  };

  return {
    alerts,
    isLoading,
    fetchAlerts,
    createAlert,
    updateAlert,
    deleteAlert
  };
};
