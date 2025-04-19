
import { useState } from 'react';
import { Bell, Edit, Trash, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserAlert } from '@/types/alerts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AlertsListProps {
  alerts: UserAlert[];
  isLoading: boolean;
  onAlertsChange: () => void;
}

export const AlertsList = ({ alerts, isLoading, onAlertsChange }: AlertsListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    return new Date(dateString).toLocaleString('fr-FR');
  };

  const toggleAlertActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from('user_alerts')
        .update({ is_active: !currentActive })
        .eq('id', id);
        
      if (error) throw error;
      
      onAlertsChange();
      
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
      
      onAlertsChange();
      
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

  return (
    <div className="space-y-4">
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
    </div>
  );
};
