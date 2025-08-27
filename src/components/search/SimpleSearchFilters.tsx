
import { useState, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export interface SimpleSearchFiltersValues {
  status: string;
  type: string;
  location: string;
  priceMin: number;
  priceMax: number;
  bedroomsMin: number;
  bathroomsMin: number;
  areaMin: number;
}

interface SimpleSearchFiltersProps {
  values: SimpleSearchFiltersValues;
  onChange: (newFilters: Partial<SimpleSearchFiltersValues>) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

export const SimpleSearchFilters = ({
  values,
  onChange,
  onApplyFilters,
  onResetFilters
}: SimpleSearchFiltersProps) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([values.priceMin, values.priceMax]);

  useEffect(() => {
    setPriceRange([values.priceMin, values.priceMax]);
  }, [values.priceMin, values.priceMax]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const handlePriceApply = () => {
    onChange({
      priceMin: priceRange[0],
      priceMax: priceRange[1]
    });
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-background">
      <div>
        <h3 className="text-lg font-semibold mb-3">Filtres</h3>
        
        <div className="space-y-4">
          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={values.status} 
              onValueChange={(value) => onChange({ status: value })}
            >
              <SelectTrigger className="w-full" id="status">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="for_sale">À vendre</SelectItem>
                <SelectItem value="for_rent">À louer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Property Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type de bien</Label>
            <Select 
              value={values.type} 
              onValueChange={(value) => onChange({ type: value })}
            >
              <SelectTrigger className="w-full" id="type">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="apartment">Appartement</SelectItem>
                <SelectItem value="house">Maison</SelectItem>
                <SelectItem value="land">Terrain</SelectItem>
                <SelectItem value="commercial">Commerce</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Location Filter */}
          <div className="space-y-2">
            <Label htmlFor="location">Localisation</Label>
            <Input
              id="location"
              placeholder="Ville, quartier, adresse..."
              value={values.location}
              onChange={(e) => onChange({ location: e.target.value })}
              className="w-full"
            />
          </div>
          
          {/* Price Range */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="price-range">Prix</Label>
              <div className="text-sm">
                {(priceRange[0] || 0).toLocaleString('fr-FR')}€ - {(priceRange[1] || 0).toLocaleString('fr-FR')}€
              </div>
            </div>
            <Slider
              id="price-range"
              defaultValue={[values.priceMin, values.priceMax]}
              min={0}
              max={10000000}
              step={5000}
              value={priceRange}
              onValueChange={handlePriceChange}
              onValueCommit={handlePriceApply}
              className="mt-2"
            />
          </div>
          
          {/* Bedrooms */}
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Chambres (min)</Label>
            <Select 
              value={values.bedroomsMin?.toString() || "0"} 
              onValueChange={(value) => onChange({ bedroomsMin: parseInt(value) })}
            >
              <SelectTrigger className="w-full" id="bedrooms">
                <SelectValue placeholder="Chambres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Peu importe</SelectItem>
                <SelectItem value="1">1+ chambre</SelectItem>
                <SelectItem value="2">2+ chambres</SelectItem>
                <SelectItem value="3">3+ chambres</SelectItem>
                <SelectItem value="4">4+ chambres</SelectItem>
                <SelectItem value="5">5+ chambres</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Bathrooms */}
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Salles de bain (min)</Label>
            <Select 
              value={values.bathroomsMin?.toString() || "0"} 
              onValueChange={(value) => onChange({ bathroomsMin: parseInt(value) })}
            >
              <SelectTrigger className="w-full" id="bathrooms">
                <SelectValue placeholder="Salles de bain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Peu importe</SelectItem>
                <SelectItem value="1">1+ salle de bain</SelectItem>
                <SelectItem value="2">2+ salles de bain</SelectItem>
                <SelectItem value="3">3+ salles de bain</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Area */}
          <div className="space-y-2">
            <Label htmlFor="area">Surface (min) en m²</Label>
            <Input
              id="area"
              type="number"
              min={0}
              placeholder="Surface minimum"
              value={values.areaMin || ''}
              onChange={(e) => onChange({ areaMin: parseInt(e.target.value) || 0 })}
              className="w-full"
            />
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <Button onClick={onApplyFilters} className="w-full">
          Appliquer les filtres
        </Button>
        <Button 
          onClick={onResetFilters} 
          variant="outline" 
          className="w-full"
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  );
};
