
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserAlert } from '@/types/alerts';
import { useNavigate } from 'react-router-dom';

export const useAlerts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchAlerts = async () => {
    if (!user) return;
    
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
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de charger vos alertes'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchAlerts();
  }, [user, navigate]);

  return {
    alerts,
    isLoading,
    fetchAlerts
  };
};
