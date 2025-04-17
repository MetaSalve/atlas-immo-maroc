
import { useState } from 'react';
import { Search, List, MapPin } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Property } from '@/types/property';
import { mockProperties } from '@/data/mockProperties';

const MapPage = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [showList, setShowList] = useState(false);
  
  const handleToggleFavorite = (id: string) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(id)) {
        return prevFavorites.filter((favId) => favId !== id);
      } else {
        return [...prevFavorites, id];
      }
    });
  };
  
  return (
    <div className="py-6 h-[calc(100vh-10rem)]">
      <div className="mb-4 flex items-center gap-4">
        <SearchBar className="flex-1" />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowList(!showList)}
        >
          {showList ? <MapPin className="h-4 w-4" /> : <List className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-4 h-full">
        <div className="bg-muted rounded-lg flex items-center justify-center h-full overflow-hidden relative">
          <div className="text-muted-foreground">
            Carte en cours de chargement...
            <br />
            (Mode démo: intégration de carte en développement)
          </div>
          
          {/* Marqueurs simulés */}
          <div className="absolute top-1/4 left-1/3">
            <div className="bg-primary text-primary-foreground p-1 rounded-full">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <div className="absolute top-1/2 left-2/3">
            <div className="bg-primary text-primary-foreground p-1 rounded-full">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <div className="absolute top-2/3 left-1/4">
            <div className="bg-primary text-primary-foreground p-1 rounded-full">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
        </div>
        
        {showList && (
          <div className="bg-background rounded-lg border overflow-y-auto h-full">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Résultats ({mockProperties.length})</h2>
              <div className="space-y-4">
                {mockProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    className="border hover:border-primary"
                    isFavorite={favorites.includes(property.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapPage;
