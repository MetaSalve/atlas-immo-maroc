
import { Property } from '@/types/property';
import { PropertyCard } from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
  emptyMessage?: string;
}

export const PropertyGrid = ({
  properties,
  favorites = [],
  onToggleFavorite,
  emptyMessage = "Aucun bien immobilier trouvé"
}: PropertyGridProps) => {
  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground">{emptyMessage}</p>
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
