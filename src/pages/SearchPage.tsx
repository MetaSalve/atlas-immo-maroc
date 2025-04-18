import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchFilters, SearchFiltersValues } from '@/components/search/SearchFilters';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyMap } from '@/components/map/PropertyMap';
import { MapPin, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Property } from '@/types/property';
import { useProperties } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';

const SearchPage = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: allProperties = [], isLoading } = useProperties();
  const { favorites, toggleFavorite } = useFavorites();
  const [showMap, setShowMap] = useState(false);
  
  const [filters, setFilters] = useState<SearchFiltersValues>({
    status: 'all',
    type: 'all',
    location: '',
    priceMin: 0,
    priceMax: 10000000,
    bedroomsMin: 0,
    bathroomsMin: 0,
    areaMin: 0,
  });
  
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties);
  
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const q = queryParams.get('q');
    if (q) {
      setSearchQuery(q);
      setFilters((prevFilters) => ({ ...prevFilters, location: q }));
    }
  }, [location.search]);
  
  useEffect(() => {
    let results = allProperties;
    
    if (filters.location) {
      const searchTerms = filters.location.toLowerCase();
      results = results.filter((property) => {
        const locationString = `${property.location.city} ${property.location.district} ${property.location.address}`.toLowerCase();
        return locationString.includes(searchTerms);
      });
    }
    
    results = results.filter((property) => {
      const statusMatch = filters.status === 'all' || property.status === filters.status;
      const typeMatch = filters.type === 'all' || property.type === filters.type;
      const priceMatch = property.price >= filters.priceMin && property.price <= filters.priceMax;
      const bedroomsMatch = filters.bedroomsMin === 0 || property.bedrooms >= filters.bedroomsMin;
      const bathroomsMatch = filters.bathroomsMin === 0 || property.bathrooms >= filters.bathroomsMin;
      const areaMatch = filters.areaMin === 0 || property.area >= filters.areaMin;
      
      return statusMatch && typeMatch && priceMatch && bedroomsMatch && bathroomsMatch && areaMatch;
    });
    
    setFilteredProperties(results);
  }, [filters, allProperties]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters((prevFilters) => ({ ...prevFilters, location: query }));
  };
  
  const handleFilterChange = (newFilters: SearchFiltersValues) => {
    setFilters(newFilters);
  };
  
  const handlePropertyClick = (property: Property) => {
    window.location.href = `/properties/${property.id}`;
  };
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <div className="flex gap-4 items-center">
          <SearchBar initialValue={searchQuery} onSearch={handleSearch} className="flex-1" />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowMap(!showMap)}
            className="flex-none"
          >
            {showMap ? <List className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <aside>
          <SearchFilters
            initialValues={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>
        
        <main>
          <div className="mb-4">
            <h1 className="text-2xl font-bold">
              {filteredProperties.length} {filteredProperties.length > 1 ? 'résultats' : 'résultat'}
              {searchQuery && <span> pour "{searchQuery}"</span>}
            </h1>
          </div>
          
          {showMap ? (
            <PropertyMap
              properties={filteredProperties}
              onPropertyClick={handlePropertyClick}
              className="sticky top-24"
            />
          ) : (
            <PropertyGrid
              properties={filteredProperties}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              isLoading={isLoading}
              emptyMessage="Aucun bien ne correspond à vos critères. Essayez d'élargir votre recherche."
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
