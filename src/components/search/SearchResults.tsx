
import { Property } from '@/types/property';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyMap } from '@/components/map/PropertyMap';

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
  return (
    <main>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          {properties.length} {properties.length > 1 ? 'résultats' : 'résultat'}
          {searchQuery && <span> pour "{searchQuery}"</span>}
        </h1>
      </div>
      
      {showMap ? (
        <PropertyMap
          properties={properties}
          onPropertyClick={onPropertyClick}
          className="sticky top-24"
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
        <div className="mt-8 p-4 border border-muted rounded-lg bg-background">
          <h3 className="font-semibold text-lg mb-2">Notes sur le fonctionnement en production:</h3>
          <p className="text-sm mb-3">
            En production, le système de scraping collectera régulièrement des annonces immobilières depuis différentes 
            sources (sites web, réseaux sociaux). Cette fonctionnalité est configurée via les Edge Functions de Supabase:
          </p>
          <ul className="list-disc pl-5 text-sm space-y-2">
            <li>Les Edge Functions <code>process-scraping-queue</code> et <code>process-alert-notifications</code> 
            collectent et traitent les données immobilières.</li>
            <li>Les données sont stockées dans la base de données Supabase et associées à leurs critères de recherche.</li>
            <li>Quand un utilisateur effectue une recherche, les résultats correspondant à ses critères lui sont présentés.</li>
            <li>Pour les alertes, le système vérifie régulièrement les nouvelles propriétés et envoie des notifications.</li>
          </ul>
        </div>
      )}
    </main>
  );
};
