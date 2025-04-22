
import { Property } from '@/types/property';
import { PropertyCard } from './PropertyCard';

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
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-2xl" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
