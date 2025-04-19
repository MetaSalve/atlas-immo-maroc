
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Bell, Loader2, Edit, Trash, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SearchFiltersValues } from '@/components/search/SearchFilters';
import { AlertForm } from '@/components/alerts/AlertForm';

interface UserAlert {
  id: string;
  name: string;
  filters: SearchFiltersValues;
  is_active: boolean;
  created_at: string;
  last_notification_at: string | null;
}

const AlertsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [alerts, setAlerts] = useState<UserAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    fetchAlerts();
  }, [user, navigate]);
  
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
      setAlerts(data || []);
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
  
  const toggleAlertActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('user_alerts')
        .update({ is_active: !currentActive })
        .eq('id', id);
        
      if (error) throw error;
      
      setAlerts(alerts.map(alert => 
        alert.id === id ? { ...alert, is_active: !currentActive } : alert
      ));
      
      toast({
        title: 'Alerte mise à jour',
        description: `L'alerte est maintenant ${!currentActive ? 'activée' : 'désactivée'}`
      });
    } catch (error) {
      console.error('Error updating alert:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour l\'alerte'
      });
    }
  };
  
  const deleteAlert = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('user_alerts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setAlerts(alerts.filter(alert => alert.id !== id));
      
      toast({
        title: 'Alerte supprimée',
        description: 'L\'alerte a été supprimée avec succès'
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de supprimer l\'alerte'
      });
    }
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    return new Date(dateString).toLocaleString('fr-FR');
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Mes alertes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Alertes configurées</h2>
            {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
          </div>
          
          <div className="bg-white shadow rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Dernière notification</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center">
                        <Bell className="h-10 w-10 text-muted-foreground/50 mb-2" />
                        <p>Vous n'avez pas encore d'alertes configurées</p>
                        <p className="text-sm">Créez votre première alerte pour être notifié des nouveaux biens</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  alerts.map(alert => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div className="font-medium">{alert.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Créée le {formatDate(alert.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(alert.last_notification_at)}</TableCell>
                      <TableCell>
                        <Switch 
                          checked={alert.is_active} 
                          onCheckedChange={() => toggleAlertActive(alert.id, alert.is_active)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/search', { state: { filters: alert.filters } })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteAlert(alert.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {alerts.length > 0 && (
            <div className="flex items-start space-x-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Les notifications sont envoyées par email lorsque de nouveaux biens correspondant 
                à vos critères sont ajoutés. Vous pouvez activer ou désactiver chaque alerte 
                selon vos besoins.
              </p>
            </div>
          )}
        </div>
        
        {/* Create new alert */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Nouvelle alerte</h2>
          <AlertForm onSave={fetchAlerts} />
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
