
import { AlertCircle } from 'lucide-react';
import { AlertForm } from '@/components/alerts/AlertForm';
import { AlertsList } from '@/components/alerts/AlertsList';
import { useAlerts } from '@/hooks/useAlerts';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect, useState } from 'react';
import { SimpleSearchFilters, SimpleSearchFiltersValues } from '@/components/search/SimpleSearchFilters';
import { SearchFiltersValues } from '@/components/search/SearchFilters';

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
    // Cette fonction sera appelée quand les filtres sont appliqués
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
  
  // Convert SimpleSearchFiltersValues to SearchFiltersValues
  const convertToSearchFiltersValues = (simpleFilters: SimpleSearchFiltersValues): SearchFiltersValues => {
    // Map the status from string to the expected union type
    let status: "all" | "for-sale" | "for-rent" = "all";
    if (simpleFilters.status === "for_sale") {
      status = "for-sale";
    } else if (simpleFilters.status === "for_rent") {
      status = "for-rent";
    }
    
    return {
      ...simpleFilters,
      status
    };
  };

  if (!user) {
    return null;
  }
  
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6 font-playfair text-deepblue">Mes alertes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Alerts list */}
        <div>
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
          
          <div className="border rounded-lg p-4 space-y-4">
            <SimpleSearchFilters
              values={filters}
              onChange={handleFilterChange}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
            />
            
            <AlertForm 
              onSave={fetchAlerts} 
              createAlert={createAlert} 
              initialValues={convertToSearchFiltersValues(filters)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPage;
