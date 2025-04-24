
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDataExport = () => {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  
  const exportUserData = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour exporter vos données');
      return;
    }
    
    try {
      setIsExporting(true);
      
      // Récupérer les données de profil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) throw profileError;
      
      // Récupérer les alertes
      const { data: alertsData, error: alertsError } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('user_id', user.id);
        
      if (alertsError) throw alertsError;
      
      // Récupérer les favoris
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('*, properties(*)')
        .eq('user_id', user.id);
        
      if (favoritesError) throw favoritesError;
      
      // Récupérer l'historique des paiements
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('user_id', user.id);
        
      if (paymentsError) throw paymentsError;
      
      // Assembler les données
      const userData = {
        profile: profileData,
        alerts: alertsData,
        favorites: favoritesData,
        payments: paymentsData,
        exported_at: new Date().toISOString()
      };
      
      // Créer le fichier à télécharger
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Télécharger le fichier
      const a = document.createElement('a');
      a.href = url;
      a.download = `alertimmo_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyer
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
      toast.success('Vos données ont été exportées avec succès');
      
    } catch (error: any) {
      console.error('Erreur lors de l\'exportation des données:', error);
      toast.error('Erreur lors de l\'exportation des données');
    } finally {
      setIsExporting(false);
    }
  };
  
  return {
    exportUserData,
    isExporting
  };
};
