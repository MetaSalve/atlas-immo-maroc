
import { Property } from '@/types/property';
import { PropertyCard } from './PropertyCard';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { StaggeredList } from '@/components/ui/animations';

interface PropertyGridProps {
  properties: Property[];
  favorites?: string[];
  selectedProperties?: Property[];
  onToggleFavorite?: (id: string) => void;
  onPropertySelect?: (property: Property) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const PropertyGrid = ({
  properties,
  favorites = [],
  selectedProperties = [],
  onToggleFavorite,
  onPropertySelect,
  emptyMessage = "Aucun bien immobilier trouvé",
  isLoading = false,
  onLoadMore,
  hasMore = false,
}: PropertyGridProps) => {
  if (isLoading && properties.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" aria-live="polite" aria-busy="true">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4 animate-pulse" aria-hidden="true">
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
      <div className="flex flex-col items-center justify-center py-10" role="alert" aria-live="assertive">
        <p className="text-muted-foreground mb-4">{emptyMessage}</p>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6 max-w-md">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <h3 className="font-medium text-amber-800">Mode production</h3>
              <p className="text-sm text-amber-700">
                Aucun résultat disponible pour le moment. Les biens immobiliers seront affichés dès qu'ils seront disponibles.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div aria-live="polite">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
        <StaggeredList>
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={favorites.includes(property.id)}
              isSelected={selectedProperties.some(p => p.id === property.id)}
              onToggleFavorite={onToggleFavorite || (() => {})}
              onToggleSelect={() => onPropertySelect?.(property)}
              className="h-full"
            />
          ))}
        </StaggeredList>
      </div>
      
      {hasMore && onLoadMore && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={onLoadMore} 
            disabled={isLoading}
            aria-label="Charger plus de propriétés"
          >
            {isLoading ? "Chargement..." : "Afficher plus"}
          </Button>
        </div>
      )}
    </div>
  );
};
