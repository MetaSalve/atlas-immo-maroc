
import { useState } from 'react';
import { 
  Filter, X, ChevronDown, 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

export interface SearchFiltersValues {
  status: 'for-sale' | 'for-rent' | 'all';
  type: string;
  location: string;
  priceMin: number;
  priceMax: number;
  bedroomsMin: number;
  bathroomsMin: number;
  areaMin: number;
}

interface SearchFiltersProps {
  initialValues?: Partial<SearchFiltersValues>;
  onFilterChange: (filters: SearchFiltersValues) => void;
}

const defaultFilters: SearchFiltersValues = {
  status: 'all',
  type: 'all',
  location: '',
  priceMin: 0,
  priceMax: 10000000,
  bedroomsMin: 0,
  bathroomsMin: 0,
  areaMin: 0,
};

export const SearchFilters = ({
  initialValues,
  onFilterChange
}: SearchFiltersProps) => {
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<SearchFiltersValues>({
    ...defaultFilters,
    ...initialValues
  });
  const [isOpen, setIsOpen] = useState(false);
  
  const handleFilterChange = <K extends keyof SearchFiltersValues>(
    key: K,
    value: SearchFiltersValues[K]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };
  
  const handleApplyFilters = () => {
    onFilterChange(filters);
    if (isMobile) {
      setIsOpen(false);
    }
  };
  
  const handleResetFilters = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    if (isMobile) {
      setIsOpen(false);
    }
  };
  
  const formatPrice = (price: number) => {
    return `${new Intl.NumberFormat('fr-FR').format(price)} MAD`;
  };
  
  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <Label>Type d'annonce</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Button
            variant={filters.status === 'all' ? 'default' : 'outline'}
            className="w-full"
            onClick={() => handleFilterChange('status', 'all')}
            type="button"
          >
            Tous
          </Button>
          <Button
            variant={filters.status === 'for-sale' ? 'default' : 'outline'}
            className="w-full"
            onClick={() => handleFilterChange('status', 'for-sale')}
            type="button"
          >
            À vendre
          </Button>
          <Button
            variant={filters.status === 'for-rent' ? 'default' : 'outline'}
            className="w-full"
            onClick={() => handleFilterChange('status', 'for-rent')}
            type="button"
          >
            À louer
          </Button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="location">Ville ou quartier</Label>
        <Input
          id="location"
          placeholder="Casablanca, Marrakech, Agdal..."
          className="mt-2"
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="type">Type de bien</Label>
        <Select
          value={filters.type}
          onValueChange={(value) => handleFilterChange('type', value)}
        >
          <SelectTrigger id="type" className="mt-2">
            <SelectValue placeholder="Tous types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous types</SelectItem>
            <SelectItem value="apartment">Appartement</SelectItem>
            <SelectItem value="house">Maison</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="riad">Riad</SelectItem>
            <SelectItem value="land">Terrain</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span>Prix</span>
              <span className="text-xs text-muted-foreground">
                {formatPrice(filters.priceMin)} - {formatPrice(filters.priceMax)}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-2">
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="priceMin">Prix minimum</Label>
                  <span className="text-xs text-muted-foreground">
                    {formatPrice(filters.priceMin)}
                  </span>
                </div>
                <Slider
                  id="priceMin"
                  min={0}
                  max={10000000}
                  step={50000}
                  value={[filters.priceMin]}
                  onValueChange={(value) => handleFilterChange('priceMin', value[0])}
                  className="mt-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="priceMax">Prix maximum</Label>
                  <span className="text-xs text-muted-foreground">
                    {formatPrice(filters.priceMax)}
                  </span>
                </div>
                <Slider
                  id="priceMax"
                  min={0}
                  max={10000000}
                  step={50000}
                  value={[filters.priceMax]}
                  onValueChange={(value) => handleFilterChange('priceMax', value[0])}
                  className="mt-2"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="rooms">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span>Chambres & Salles de bain</span>
              <span className="text-xs text-muted-foreground">
                {filters.bedroomsMin}+ ch. / {filters.bathroomsMin}+ sdb
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-2">
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="bedroomsMin">Chambres min.</Label>
                  <span className="text-xs text-muted-foreground">
                    {filters.bedroomsMin}+
                  </span>
                </div>
                <Slider
                  id="bedroomsMin"
                  min={0}
                  max={10}
                  step={1}
                  value={[filters.bedroomsMin]}
                  onValueChange={(value) => handleFilterChange('bedroomsMin', value[0])}
                  className="mt-2"
                />
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="bathroomsMin">Salles de bain min.</Label>
                  <span className="text-xs text-muted-foreground">
                    {filters.bathroomsMin}+
                  </span>
                </div>
                <Slider
                  id="bathroomsMin"
                  min={0}
                  max={5}
                  step={1}
                  value={[filters.bathroomsMin]}
                  onValueChange={(value) => handleFilterChange('bathroomsMin', value[0])}
                  className="mt-2"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="area">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <span>Surface</span>
              <span className="text-xs text-muted-foreground">
                {filters.areaMin}+ m²
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <div className="flex justify-between">
                <Label htmlFor="areaMin">Surface minimum</Label>
                <span className="text-xs text-muted-foreground">
                  {filters.areaMin} m²
                </span>
              </div>
              <Slider
                id="areaMin"
                min={0}
                max={1000}
                step={10}
                value={[filters.areaMin]}
                onValueChange={(value) => handleFilterChange('areaMin', value[0])}
                className="mt-2"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleResetFilters}
          type="button"
        >
          Réinitialiser
        </Button>
        <Button
          className="flex-1"
          onClick={handleApplyFilters}
          type="button"
        >
          Appliquer
        </Button>
      </div>
    </div>
  );
  
  const FiltersSummary = () => {
    const activeFilters: string[] = [];
    
    if (filters.status !== 'all') {
      activeFilters.push(filters.status === 'for-sale' ? 'À vendre' : 'À louer');
    }
    
    if (filters.type !== 'all') {
      activeFilters.push(filters.type);
    }
    
    if (filters.location) {
      activeFilters.push(filters.location);
    }
    
    if (filters.bedroomsMin > 0) {
      activeFilters.push(`${filters.bedroomsMin}+ ch.`);
    }
    
    if (filters.bathroomsMin > 0) {
      activeFilters.push(`${filters.bathroomsMin}+ sdb`);
    }
    
    if (filters.areaMin > 0) {
      activeFilters.push(`${filters.areaMin}+ m²`);
    }
    
    if (filters.priceMin > 0 || filters.priceMax < 10000000) {
      activeFilters.push(`${formatPrice(filters.priceMin)} - ${formatPrice(filters.priceMax)}`);
    }
    
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {activeFilters.map((filter, index) => (
          <div
            key={index}
            className="bg-muted rounded-full px-3 py-1 text-xs flex items-center gap-1"
          >
            <span>{filter}</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                // In a real application, we would clear the specific filter here
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        
        {activeFilters.length > 0 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleResetFilters();
            }}
            className="text-primary hover:text-primary/80 text-xs underline"
            type="button"
          >
            Réinitialiser tout
          </button>
        )}
      </div>
    );
  };
  
  if (isMobile) {
    return (
      <div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between" type="button">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filtres</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader>
              <SheetTitle>Filtres</SheetTitle>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto pb-24">
              <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>
        <FiltersSummary />
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filtres</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={handleResetFilters}
          type="button"
        >
          Réinitialiser
        </Button>
      </div>
      <FiltersContent />
      <FiltersSummary />
    </div>
  );
};
