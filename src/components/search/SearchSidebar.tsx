
import { Button } from '@/components/ui/button';
import { SimpleSearchFilters, SimpleSearchFiltersValues } from './SimpleSearchFilters';
import { Bell } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PropertyFilters } from '@/hooks/useProperties';

interface SearchSidebarProps {
  filters: PropertyFilters;
  onFilterChange: (filters: PropertyFilters) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onSaveAlert: () => void;
  propertiesCount: number;
}

export const SearchSidebar = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onResetFilters,
  onSaveAlert,
  propertiesCount,
}: SearchSidebarProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Convert PropertyFilters to SimpleSearchFiltersValues
  const simpleFilters: SimpleSearchFiltersValues = {
    status: filters.status || 'all',
    type: filters.type || 'all',
    location: filters.city || '',
    priceMin: filters.minPrice || 0,
    priceMax: filters.maxPrice || 10000000,
    bedroomsMin: filters.bedrooms || 0,
    bathroomsMin: filters.bathrooms || 0,
    areaMin: 0, // Not used in PropertyFilters, set default
  };

  // Convert SimpleSearchFiltersValues to PropertyFilters
  const handleSimpleFilterChange = (newFilters: Partial<SimpleSearchFiltersValues>) => {
    const propertyFilters: Partial<PropertyFilters> = {};
    
    if (newFilters.status !== undefined) {
      propertyFilters.status = newFilters.status === 'all' ? undefined : newFilters.status;
    }
    if (newFilters.type !== undefined) {
      propertyFilters.type = newFilters.type === 'all' ? undefined : newFilters.type;
    }
    if (newFilters.location !== undefined) {
      propertyFilters.city = newFilters.location;
    }
    if (newFilters.priceMin !== undefined) {
      propertyFilters.minPrice = newFilters.priceMin;
    }
    if (newFilters.priceMax !== undefined) {
      propertyFilters.maxPrice = newFilters.priceMax;
    }
    if (newFilters.bedroomsMin !== undefined) {
      propertyFilters.bedrooms = newFilters.bedroomsMin;
    }
    if (newFilters.bathroomsMin !== undefined) {
      propertyFilters.bathrooms = newFilters.bathroomsMin;
    }

    onFilterChange({ ...filters, ...propertyFilters });
  };

  const handleSaveAlert = () => {
    if (!user) {
      toast.info("Connexion requise", {
        description: "Veuillez vous connecter pour créer une alerte",
      });
      navigate('/auth');
      return;
    }
    onSaveAlert();
  };

  return (
    <div className="space-y-6">
      <SimpleSearchFilters
        values={simpleFilters}
        onChange={handleSimpleFilterChange}
        onApplyFilters={onApplyFilters}
        onResetFilters={onResetFilters}
      />
      
      <Button 
        onClick={handleSaveAlert}
        className="w-full bg-terracotta hover:bg-terracotta/90"
      >
        <Bell className="h-4 w-4 mr-2" />
        Sauvegarder comme alerte
      </Button>
    </div>
  );
};
