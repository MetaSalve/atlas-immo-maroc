
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useSubscription } from '@/providers/SubscriptionProvider';
import { useAlerts } from '@/hooks/useAlerts';
import { AlertsList } from '@/components/alerts/AlertsList';
import { Info } from 'lucide-react';
import { SimpleSearchFilters } from '@/components/search/SimpleSearchFilters';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog } from '@/components/search/AlertDialog';
import { useState } from 'react';

const AlertsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { alerts, isLoading, createAlert, updateAlert, deleteAlert, fetchAlerts } = useAlerts();
  const { allowedAlerts } = useSubscription();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialFilters, setInitialFilters] = useState({
    status: 'all',
    type: 'all',
    location: '',
    priceMin: 0,
    priceMax: 10000000,
    bedroomsMin: 0,
    bathroomsMin: 0,
    areaMin: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleCreateAlert = () => {
    setIsDialogOpen(true);
  };

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Alertes configurées</h1>
            <Button 
              onClick={handleCreateAlert} 
              disabled={alerts.length >= allowedAlerts && allowedAlerts > 0}
              className="bg-terracotta hover:bg-terracotta/90"
            >
              Nouvelle alerte
            </Button>
          </div>

          <AlertsList 
            alerts={alerts} 
            isLoading={isLoading}
            onAlertsChange={fetchAlerts} 
          />

          <div className="mt-4 p-4 bg-background/80 border rounded-lg flex items-start gap-3">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Les notifications sont envoyées par email lorsque de nouveaux biens correspondant à vos critères sont ajoutés. 
              Vous pouvez activer ou désactiver chaque alerte selon vos besoins.
            </p>
          </div>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold mb-4">Filtres</h2>
              <SimpleSearchFilters 
                values={initialFilters}
                onChange={(values) => setInitialFilters(prev => ({...prev, ...values}))}
                onApplyFilters={() => {}}
                onResetFilters={() => {
                  setInitialFilters({
                    status: 'all',
                    type: 'all',
                    location: '',
                    priceMin: 0,
                    priceMax: 10000000,
                    bedroomsMin: 0,
                    bathroomsMin: 0,
                    areaMin: 0,
                  });
                }}
              />
              <Button 
                className="w-full mt-4 bg-terracotta hover:bg-terracotta/90" 
                onClick={handleCreateAlert}
                disabled={alerts.length >= allowedAlerts && allowedAlerts > 0}
              >
                Créer une alerte avec ces filtres
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={isDialogOpen}
        filters={initialFilters}
        onOpenChange={setIsDialogOpen}
        createAlert={createAlert}
      />
    </div>
  );
};

export default AlertsPage;
