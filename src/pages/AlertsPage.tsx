
import { AlertCircle } from 'lucide-react';
import { AlertForm } from '@/components/alerts/AlertForm';
import { AlertsList } from '@/components/alerts/AlertsList';
import { useAlerts } from '@/hooks/useAlerts';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect, useState } from 'react';
import { SimpleSearchFilters, SimpleSearchFiltersValues } from '@/components/search/SimpleSearchFilters';
import { Card } from '@/components/ui/card';

const AlertsPage = () => {
  const { user } = useAuth();
  const { alerts, isLoading, fetchAlerts, createAlert } = useAlerts();
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

  if (!user) {
    return null; // Will redirect in useEffect in useAlerts hook
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
        </div>
        
        {/* Create new alert */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold font-playfair text-terracotta">Nouvelle alerte</h2>
          
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
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;

