
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchFilters, SearchFiltersValues } from '@/components/search/SearchFilters';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { Property } from '@/types/property';
import { mockProperties } from '@/data/mockProperties';
import { useToast } from '@/hooks/use-toast';

const SearchPage = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
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
  
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);
  
  useEffect(() => {
    // Extract search query from URL
    const queryParams = new URLSearchParams(location.search);
    const q = queryParams.get('q');
    if (q) {
      setSearchQuery(q);
      setFilters((prevFilters) => ({ ...prevFilters, location: q }));
    }
  }, [location.search]);
  
  useEffect(() => {
    // Apply filters to properties
    let results = mockProperties;
    
    // Filter by search query/location
    if (filters.location) {
      const searchTerms = filters.location.toLowerCase();
      results = results.filter((property) => {
        const locationString = `${property.location.city} ${property.location.district} ${property.location.address}`.toLowerCase();
        return locationString.includes(searchTerms);
      });
    }
    
    // Filter by status
    if (filters.status !== 'all') {
      results = results.filter((property) => property.status === filters.status);
    }
    
    // Filter by type
    if (filters.type !== 'all') {
      results = results.filter((property) => property.type === filters.type);
    }
    
    // Filter by price
    results = results.filter(
      (property) => property.price >= filters.priceMin && property.price <= filters.priceMax
    );
    
    // Filter by bedrooms
    if (filters.bedroomsMin > 0) {
      results = results.filter((property) => property.bedrooms >= filters.bedroomsMin);
    }
    
    // Filter by bathrooms
    if (filters.bathroomsMin > 0) {
      results = results.filter((property) => property.bathrooms >= filters.bathroomsMin);
    }
    
    // Filter by area
    if (filters.areaMin > 0) {
      results = results.filter((property) => property.area >= filters.areaMin);
    }
    
    setFilteredProperties(results);
  }, [filters]);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters((prevFilters) => ({ ...prevFilters, location: query }));
  };
  
  const handleFilterChange = (newFilters: SearchFiltersValues) => {
    setFilters(newFilters);
  };
  
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
    <div className="py-6">
      <div className="mb-6">
        <SearchBar initialValue={searchQuery} onSearch={handleSearch} />
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
          
          <PropertyGrid
            properties={filteredProperties}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            emptyMessage="Aucun bien ne correspond à vos critères. Essayez d'élargir votre recherche."
          />
        </main>
      </div>
    </div>
  );
};

export default SearchPage;
