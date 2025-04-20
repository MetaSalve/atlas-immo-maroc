import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchFilters, SearchFiltersValues } from '@/components/search/SearchFilters';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyMap } from '@/components/map/PropertyMap';
import { MapPin, List, Bell, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Property } from '@/types/property';
import { useProperties } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';
import { AlertForm } from '@/components/alerts/AlertForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAlerts } from '@/hooks/useAlerts';

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

  const handleAlertDialogClose = () => {
    setShowAlertDialog(false);
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
          
          <div className="mt-4">
            <Button 
              onClick={handleSaveAlert} 
              className="w-full"
              variant="default"
              size="lg"
            >
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Sauvegarder comme alerte
            </Button>
          </div>
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

          {filteredProperties.length === 0 && !isLoading && (
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
      </div>

      <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une alerte</DialogTitle>
            <DialogDescription>
              Vous recevrez des notifications pour les nouveaux biens qui correspondent à ces critères.
            </DialogDescription>
          </DialogHeader>
          
          <AlertForm 
            initialValues={filters} 
            onSave={handleAlertDialogClose}
            createAlert={createAlert}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchPage;
