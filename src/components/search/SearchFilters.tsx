
import { useState, useRef, useEffect } from 'react';
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
import { useTranslation } from '@/i18n';

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
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [filters, setFilters] = useState<SearchFiltersValues>({
    ...defaultFilters,
    ...initialValues
  });
  const [isOpen, setIsOpen] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Apply filter changes with debounce
  const applyFilterChanges = (newFilters: SearchFiltersValues) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      onFilterChange(newFilters);
    }, 500); // Increased debounce time for better performance
  };
  
  // Update a single filter
  const handleFilterChange = <K extends keyof SearchFiltersValues>(
    key: K,
    value: SearchFiltersValues[K]
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Don't apply filter changes immediately for location changes
    // to prevent search while typing
    if (key !== 'location') {
      applyFilterChanges(newFilters);
    }
  };
  
  // Special handler for location input to avoid premature search
  const handleLocationChange = (value: string) => {
    const newFilters = { ...filters, location: value };
    setFilters(newFilters);
  };
  
  // Handle location input blur to apply filter
  const handleLocationBlur = () => {
    applyFilterChanges(filters);
  };
  
  // Handle manual filter application (for mobile view)
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
  
  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);
  
  const formatPrice = (price: number) => {
    return `${new Intl.NumberFormat('fr-FR').format(price)} MAD`;
  };
  
  const FiltersContent = () => (
    <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
      <div>
        <Label>{t('filters.listingType')}</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          <Button
            variant={filters.status === 'all' ? 'default' : 'outline'}
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleFilterChange('status', 'all');
            }}
            type="button"
          >
            {t('filters.all')}
          </Button>
          <Button
            variant={filters.status === 'for-sale' ? 'default' : 'outline'}
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleFilterChange('status', 'for-sale');
            }}
            type="button"
          >
            {t('filters.forSale')}
          </Button>
          <Button
            variant={filters.status === 'for-rent' ? 'default' : 'outline'}
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleFilterChange('status', 'for-rent');
            }}
            type="button"
          >
            {t('filters.forRent')}
          </Button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="location">{t('filters.cityOrNeighborhood')}</Label>
        <Input
          id="location"
          placeholder={t('filters.cityPlaceholder')}
          className="mt-2"
          value={filters.location}
          onChange={(e) => handleLocationChange(e.target.value)}
          onBlur={handleLocationBlur}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      
      <div>
        <Label htmlFor="type">{t('filters.propertyType')}</Label>
        <Select
          value={filters.type}
          onValueChange={(value) => handleFilterChange('type', value)}
        >
          <SelectTrigger id="type" className="mt-2" onClick={(e) => e.stopPropagation()}>
            <SelectValue placeholder={t('filters.allTypes')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.allTypes')}</SelectItem>
            <SelectItem value="apartment">{t('filters.apartment')}</SelectItem>
            <SelectItem value="house">{t('filters.house')}</SelectItem>
            <SelectItem value="villa">{t('filters.villa')}</SelectItem>
            <SelectItem value="riad">{t('filters.riad')}</SelectItem>
            <SelectItem value="land">{t('filters.land')}</SelectItem>
            <SelectItem value="commercial">{t('filters.commercial')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="price">
          <AccordionTrigger onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span>{t('filters.price')}</span>
              <span className="text-xs text-muted-foreground">
                {formatPrice(filters.priceMin)} - {formatPrice(filters.priceMax)}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-2" onClick={(e) => e.stopPropagation()}>
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="priceMin">{t('filters.priceMin')}</Label>
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
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                />
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="priceMax">{t('filters.priceMax')}</Label>
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
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="rooms">
          <AccordionTrigger onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span>{t('filters.rooms')}</span>
              <span className="text-xs text-muted-foreground">
                {filters.bedroomsMin}+ ch. / {filters.bathroomsMin}+ sdb
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6 pt-2" onClick={(e) => e.stopPropagation()}>
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="bedroomsMin">{t('filters.bedroomsMin')}</Label>
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
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                />
              </div>
              
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="bathroomsMin">{t('filters.bathroomsMin')}</Label>
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
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="area">
          <AccordionTrigger onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2">
              <span>{t('filters.surface')}</span>
              <span className="text-xs text-muted-foreground">
                {filters.areaMin}+ m²
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between">
                <Label htmlFor="areaMin">{t('filters.surfaceMin')}</Label>
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
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            handleResetFilters();
          }}
          type="button"
        >
          {t('search.reset')}
        </Button>
        <Button
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            handleApplyFilters();
          }}
          type="button"
        >
          {t('search.apply')}
        </Button>
      </div>
    </div>
  );
  
  const FiltersSummary = () => {
    const activeFilters: string[] = [];
    
    if (filters.status !== 'all') {
      activeFilters.push(filters.status === 'for-sale' ? t('filters.forSale') : t('filters.forRent'));
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
                e.stopPropagation();
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
              e.stopPropagation();
              handleResetFilters();
            }}
            className="text-primary hover:text-primary/80 text-xs underline"
            type="button"
          >
            {t('search.resetAll')}
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
                <span>{t('search.filters')}</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader>
              <SheetTitle>{t('search.filters')}</SheetTitle>
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
        <h3 className="font-medium">{t('search.filters')}</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleResetFilters();
          }}
          type="button"
        >
          {t('search.reset')}
        </Button>
      </div>
      <FiltersContent />
      <FiltersSummary />
    </div>
  );
};
