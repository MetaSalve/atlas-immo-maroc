
import { Property } from '@/types/property';
import { PropertyCard } from './PropertyCard';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface PropertyGridProps {
  properties: Property[];
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
  emptyMessage?: string;
  isLoading?: boolean;
}

export const PropertyGrid = ({
  properties,
  favorites = [],
  onToggleFavorite,
  emptyMessage = "Aucun bien immobilier trouvé",
  isLoading = false,
}: PropertyGridProps) => {
  const { toast } = useToast();
  const [isTestingAlerts, setIsTestingAlerts] = useState(false);

  const testAlertNotifications = async () => {
    try {
      setIsTestingAlerts(true);
      toast({
        title: "Test des alertes",
        description: "Tentative de déclenchement du processus de notification d'alertes...",
      });

      const { error } = await supabase.functions.invoke('process-alert-notifications');
      
      if (error) throw error;

      toast({
        title: "Test d'alertes réussi",
        description: "Le processus de notification a été exécuté avec succès. Vérifiez les logs dans Supabase.",
      });
    } catch (error) {
      console.error('Erreur lors du test des alertes:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de tester les notifications d'alertes. Vérifiez la console pour plus de détails.",
      });
    } finally {
      setIsTestingAlerts(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4 animate-pulse">
            <div className="h-48 bg-muted rounded-lg" />
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground mb-4">{emptyMessage}</p>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6 max-w-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800">Mode test</h3>
              <p className="text-sm text-amber-700">
                Vous pouvez tester les fonctionnalités de scraping et d'alertes pour vérifier que tout fonctionne correctement.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={testAlertNotifications}
            disabled={isTestingAlerts}
          >
            Tester les notifications d'alertes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          isFavorite={favorites.includes(property.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};
