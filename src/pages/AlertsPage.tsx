
import { AlertCircle } from 'lucide-react';
import { AlertForm } from '@/components/alerts/AlertForm';
import { AlertsList } from '@/components/alerts/AlertsList';
import { useAlerts } from '@/hooks/useAlerts';
import { useAuth } from '@/providers/AuthProvider';
import { useSubscription } from '@/providers/SubscriptionProvider';
import { useEffect, useState } from 'react';
import { SimpleSearchFilters, SimpleSearchFiltersValues } from '@/components/search/SimpleSearchFilters';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FeatureGate } from '@/components/access/FeatureGate';

const AlertsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { alerts, isLoading, fetchAlerts, createAlert } = useAlerts();
  const { tier, allowedAlerts } = useSubscription();
  const [filters, setFilters] = useState<SimpleSearchFiltersValues>({
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
    if (user) {
      fetchAlerts();
    }
  }, [user]);

  const handleFilterChange = (newFilters: Partial<SimpleSearchFiltersValues>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    // Nothing to do here since filters are automatically applied
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'all',
      type: 'all',
      location: '',
      priceMin: 0,
      priceMax: 10000000,
      bedroomsMin: 0,
      bathroomsMin: 0,
      areaMin: 0,
    });
  };

  const canCreateAlert = tier === 'premium' || alerts.length < allowedAlerts;

  if (!user) {
    return (
      <div className="py-6">
        <Alert className="mb-4">
          <AlertTitle>Connexion requise</AlertTitle>
          <AlertDescription>
            Vous devez être connecté pour accéder à vos alertes.
            <div className="mt-3">
              <Button onClick={() => navigate('/auth')}>Se connecter</Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6 font-playfair text-deepblue">Mes alertes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts list */}
        <div className="lg:col-span-2">
          <AlertsList 
            alerts={alerts}
            isLoading={isLoading}
            onAlertsChange={fetchAlerts}
          />
          
          {alerts.length > 0 && (
            <div className="flex items-start space-x-2 text-sm text-muted-foreground mt-4">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Les notifications sont envoyées par email lorsque de nouveaux biens correspondant 
                à vos critères sont ajoutés. Vous pouvez activer ou désactiver chaque alerte 
                selon vos besoins.
              </p>
            </div>
          )}

          {tier === 'free' && alerts.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Vous avez utilisé {alerts.length} sur {allowedAlerts} alertes disponibles.</p>
            </div>
          )}
        </div>
        
        {/* Create new alert */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold font-playfair text-terracotta">Nouvelle alerte</h2>
          
          {!canCreateAlert && (
            <FeatureGate feature="unlimited_alerts">
              {/* Pass empty element to satisfy the children prop requirement */}
              <></>
            </FeatureGate>
          )}

          {canCreateAlert && (
            <>
              <Card className="p-4">
                <SimpleSearchFilters
                  values={filters}
                  onChange={handleFilterChange}
                  onApplyFilters={handleApplyFilters}
                  onResetFilters={handleResetFilters}
                />
              </Card>
              
              <AlertForm 
                onSave={fetchAlerts} 
                createAlert={createAlert} 
                initialValues={filters}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
