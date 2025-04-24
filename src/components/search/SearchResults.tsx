import { Property } from '@/types/property';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyMap } from '@/components/map/PropertyMap';
import { FadeIn, StaggeredList } from '@/components/ui/animations';

interface SearchResultsProps {
  showMap: boolean;
  properties: Property[];
  isLoading: boolean;
  searchQuery: string;
  favorites: string[];
  selectedProperties: Property[];
  onToggleFavorite: (id: string) => void;
  onPropertyClick: (property: Property) => void;
  onPropertySelect: (property: Property) => void;
}

export const SearchResults = ({
  showMap,
  properties,
  isLoading,
  searchQuery,
  favorites,
  selectedProperties,
  onToggleFavorite,
  onPropertyClick,
  onPropertySelect
}: SearchResultsProps) => {
  const resultsCount = properties.length;
  const resultsText = resultsCount > 1 ? 'résultats' : 'résultat';
  
  return (
    <main>
      <FadeIn>
        <div className="mb-4">
          <h1 
            className="text-2xl font-bold" 
            aria-live="polite"
            tabIndex={-1}
          >
            {resultsCount} {resultsText}
            {searchQuery && <span> pour "<span className="italic">{searchQuery}</span>"</span>}
          </h1>
        </div>
        
        {showMap ? (
          <PropertyMap
            properties={properties}
            onPropertyClick={onPropertyClick}
            className="sticky top-24"
            aria-label="Carte des propriétés"
          />
        ) : (
          <PropertyGrid
            properties={properties}
            favorites={favorites}
            selectedProperties={selectedProperties}
            onToggleFavorite={onToggleFavorite}
            onPropertySelect={onPropertySelect}
            isLoading={isLoading}
            emptyMessage="Aucun bien ne correspond à vos critères. Essayez d'élargir votre recherche."
          />
        )}

        {properties.length === 0 && !isLoading && (
          <div 
            className="mt-8 p-4 border border-muted rounded-lg bg-background"
            role="alert"
            aria-live="polite"
          >
            <h3 className="font-semibold text-lg mb-2">Aucun résultat trouvé</h3>
            <p>
              Aucun bien ne correspond à vos critères. Essayez de modifier vos filtres de recherche.
            </p>
          </div>
        )}
      </FadeIn>
    </main>
  );
};
