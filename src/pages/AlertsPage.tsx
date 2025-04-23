
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useSubscription } from '@/providers/SubscriptionProvider';
import { useAlerts } from '@/hooks/useAlerts';
import { AlertItem } from '@/components/alerts/AlertItem';
import { AlertForm } from '@/components/alerts/AlertForm';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { FeatureGate } from '@/components/access/FeatureGate';

const AlertsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { alerts, isLoading, createAlert, updateAlert, deleteAlert } = useAlerts();
  const { allowedAlerts } = useSubscription();
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const canCreateAlert = alerts.length < allowedAlerts;

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Mes alertes</h1>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : alerts.length > 0 ? (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onUpdate={updateAlert}
              onDelete={deleteAlert}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Vous n'avez pas encore d'alertes.</p>
        </div>
      )}

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold font-playfair text-terracotta">Nouvelle alerte</h2>
          
          {!canCreateAlert && (
            <FeatureGate feature="unlimited_alerts">
              <div></div>
            </FeatureGate>
          )}

          {canCreateAlert && (
            <Button onClick={() => setIsCreating(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Créer une alerte
            </Button>
          )}
        </div>

        {isCreating && (
          <AlertForm 
            onCreate={createAlert} 
            onCancel={() => setIsCreating(false)} 
          />
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
