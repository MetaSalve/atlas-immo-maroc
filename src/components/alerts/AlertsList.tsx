
import { useState } from 'react';
import { Edit, Trash2, Loader2, Bell, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserAlert } from '@/types/alerts';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AlertsListProps {
  alerts: UserAlert[];
  isLoading: boolean;
  onAlertsChange: () => void;
}

export const AlertsList = ({ alerts, isLoading, onAlertsChange }: AlertsListProps) => {
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Jamais';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleAlertActive = async (id: string, currentActive: boolean) => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from('user_alerts')
        .update({ is_active: !currentActive })
        .eq('id', id);
        
      if (error) throw error;
      
      onAlertsChange();
      
      toast('Alerte mise à jour', {
        description: `L'alerte est maintenant ${!currentActive ? 'activée' : 'désactivée'}`
      });
    } catch (error) {
      console.error('Error updating alert:', error);
      toast('Erreur', {
        description: 'Impossible de mettre à jour l\'alerte'
      });
    } finally {
      setUpdatingId(null);
    }
  };
  
  const deleteAlert = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette alerte ?')) {
      return;
    }
    
    try {
      setDeletingId(id);
      const { error } = await supabase
        .from('user_alerts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      onAlertsChange();
      
      toast('Alerte supprimée', {
        description: 'L\'alerte a été supprimée avec succès'
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast('Erreur', {
        description: 'Impossible de supprimer l\'alerte'
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="border rounded-lg bg-background p-8 text-center">
        <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
        <h3 className="font-medium text-lg mb-1">Aucune alerte configurée</h3>
        <p className="text-muted-foreground">
          Créez votre première alerte pour être notifié des nouveaux biens immobiliers.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-1/3">Nom</TableHead>
            <TableHead className="w-1/3">Dernière notification</TableHead>
            <TableHead className="w-16 text-center">Active</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map(alert => (
            <TableRow key={alert.id}>
              <TableCell className="font-medium">
                {alert.name}
                <div className="text-xs text-muted-foreground mt-1">
                  Créée le {formatDate(alert.created_at)}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {alert.last_notification_at 
                  ? `${alert.last_notification_count || 0} nouveaux biens le ${formatDate(alert.last_notification_at)}`
                  : 'Jamais'
                }
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <Switch 
                    checked={alert.is_active} 
                    onCheckedChange={() => toggleAlertActive(alert.id, alert.is_active)}
                    disabled={updatingId === alert.id}
                  />
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => navigate('/search', { state: { filters: alert.filters } })}
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteAlert(alert.id)}
                    disabled={deletingId === alert.id}
                    className="text-destructive"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
