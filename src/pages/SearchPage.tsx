import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProperties } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/providers/AuthProvider';
import { useAlerts } from '@/hooks/useAlerts';
import { Property } from '@/types/property';
import { toast } from 'sonner';
import { SearchHeader } from '@/components/search/SearchHeader';
import { SearchSidebar } from '@/components/search/SearchSidebar';
import { SearchResults } from '@/components/search/SearchResults';
import { AlertDialog } from '@/components/search/AlertDialog';
import { SimpleSearchFiltersValues } from '@/components/search/SimpleSearchFilters';
import { PropertyCompare } from '@/components/property/PropertyCompare';

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: allProperties = [], isLoading } = useProperties();
  const { favorites, toggleFavorite } = useFavorites();
  const [showMap, setShowMap] = useState(false);
  const { createAlert } = useAlerts();
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  
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
  
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(allProperties);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  
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
  
  const handleFilterChange = (newFilters: Partial<SimpleSearchFiltersValues>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const handleApplyFilters = () => {
    toast("Filtres appliqués", {
      description: "Les résultats ont été mis à jour selon vos critères.",
    });
  };
  
  const handleResetFilters = () => {
    const defaultFilters = {
      status: 'all',
      type: 'all',
      location: '',
      priceMin: 0,
      priceMax: 10000000,
      bedroomsMin: 0,
      bathroomsMin: 0,
      areaMin: 0,
    };
    setFilters(defaultFilters);
    toast("Filtres réinitialisés", {
      description: "Tous les filtres ont été réinitialisés.",
    });
  };
  
  const handlePropertyClick = (property: Property) => {
    navigate(`/properties/${property.id}`);
  };

  const handleSaveAlert = () => {
    if (!user) {
      toast('Connexion requise', {
        description: 'Vous devez être connecté pour créer une alerte',
        action: {
          label: 'Se connecter',
          onClick: () => navigate('/auth')
        }
      });
      return;
    }
    
    setShowAlertDialog(true);
  };
  
  const handlePropertySelect = (property: Property) => {
    setSelectedProperties(prev => {
      if (prev.find(p => p.id === property.id)) {
        return prev.filter(p => p.id !== property.id);
      }
      if (prev.length >= 3) {
        toast("Maximum 3 biens", {
          description: "Vous ne pouvez comparer que 3 biens à la fois.",
        });
        return prev;
      }
      return [...prev, property];
    });
  };
  
  return (
    <div className="py-6">
      <SearchHeader
        searchQuery={searchQuery}
        showMap={showMap}
        onSearch={handleSearch}
        onToggleView={() => setShowMap(!showMap)}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        <SearchSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          onSaveAlert={handleSaveAlert}
        />
        
        <div className="space-y-6">
          {selectedProperties.length > 0 && (
            <PropertyCompare 
              properties={selectedProperties} 
              onClose={() => setSelectedProperties([])} 
            />
          )}
          
          <SearchResults
            showMap={showMap}
            properties={filteredProperties}
            isLoading={isLoading}
            searchQuery={searchQuery}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onPropertyClick={handlePropertyClick}
            selectedProperties={selectedProperties}
            onPropertySelect={handlePropertySelect}
          />
        </div>
      </div>

      <AlertDialog
        open={showAlertDialog}
        filters={filters}
        onOpenChange={setShowAlertDialog}
        createAlert={createAlert}
      />
    </div>
  );
};

export default SearchPage;
