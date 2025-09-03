import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Scale, X, Plus, MapPin, Bed, Bath, Square, Euro } from 'lucide-react';
import { Property } from '@/types/property';
import { formatPrice } from '@/lib/utils';

interface PropertyComparisonProps {
  properties: Property[];
  selectedProperties: string[];
  onToggleProperty: (propertyId: string) => void;
  onClearAll: () => void;
  className?: string;
}

export const PropertyComparison = ({ 
  properties, 
  selectedProperties, 
  onToggleProperty, 
  onClearAll,
  className 
}: PropertyComparisonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedProps = properties.filter(p => selectedProperties.includes(p.id));
  const maxProperties = 3;

  const getComparisonValue = (property: Property, metric: string): number | string => {
    switch (metric) {
      case 'price': return property.price;
      case 'pricePerSqm': return Math.round(property.price / property.area);
      case 'area': return property.area;
      case 'bedrooms': return property.bedrooms || 0;
      case 'bathrooms': return property.bathrooms || 0;
      default: return '-';
    }
  };

  const getBestValue = (metric: string, isHigherBetter: boolean = false) => {
    if (selectedProps.length === 0) return null;
    
    const values = selectedProps.map(p => getComparisonValue(p, metric)).filter(v => typeof v === 'number') as number[];
    if (values.length === 0) return null;
    
    return isHigherBetter ? Math.max(...values) : Math.min(...values);
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'price': return <Euro className="h-4 w-4" />;
      case 'area': return <Square className="h-4 w-4" />;
      case 'bedrooms': return <Bed className="h-4 w-4" />;
      case 'bathrooms': return <Bath className="h-4 w-4" />;
      default: return null;
    }
  };

  const metrics = [
    { key: 'price', label: 'Prix', format: (val: number) => formatPrice(val, 'MAD'), isHigherBetter: false },
    { key: 'pricePerSqm', label: 'Prix/m²', format: (val: number) => `${val.toLocaleString()} MAD/m²`, isHigherBetter: false },
    { key: 'area', label: 'Surface', format: (val: number) => `${val} m²`, isHigherBetter: true },
    { key: 'bedrooms', label: 'Chambres', format: (val: number) => val.toString(), isHigherBetter: true },
    { key: 'bathrooms', label: 'Salles de bain', format: (val: number) => val.toString(), isHigherBetter: true }
  ];

  if (selectedProperties.length === 0) {
    return (
      <Card className={`${className} opacity-50`}>
        <CardContent className="p-6 text-center">
          <Scale className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">
            Sélectionnez des propriétés pour les comparer
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Maximum {maxProperties} propriétés
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Comparaison ({selectedProps.length}/{maxProperties})
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Réduire' : 'Détails'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
            >
              Vider
            </Button>
          </div>
        </div>
        <CardDescription>
          Comparez les caractéristiques principales des propriétés sélectionnées
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Property Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedProps.map((property) => (
            <div key={property.id} className="relative border rounded-lg p-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => onToggleProperty(property.id)}
              >
                <X className="h-3 w-3" />
              </Button>
              
              <div className="space-y-2">
                <img
                  src={property.images[0] || '/placeholder.svg'}
                  alt={property.title}
                  className="w-full h-32 object-cover rounded"
                />
                <h4 className="font-medium text-sm line-clamp-2">{property.title}</h4>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {property.location.city}
                </div>
                <p className="font-semibold text-primary">
                  {formatPrice(property.price, property.priceUnit)}
                </p>
              </div>
            </div>
          ))}

          {/* Add more properties button */}
          {selectedProps.length < maxProperties && (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 flex flex-col items-center justify-center text-center min-h-[200px]">
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Sélectionnez une propriété pour la comparer
              </p>
            </div>
          )}
        </div>

        {isExpanded && selectedProps.length > 1 && (
          <>
            <Separator />
            
            {/* Detailed Comparison Table */}
            <div className="space-y-4">
              <h4 className="font-medium">Comparaison détaillée</h4>
              
              {metrics.map((metric) => {
                const bestValue = getBestValue(metric.key, metric.isHigherBetter);
                
                return (
                  <div key={metric.key} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {getMetricIcon(metric.key)}
                      {metric.label}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {selectedProps.map((property) => {
                        const value = getComparisonValue(property, metric.key);
                        const isBest = typeof value === 'number' && value === bestValue;
                        
                        return (
                          <div
                            key={property.id}
                            className={`p-2 rounded text-center text-sm ${
                              isBest ? 'bg-green-100 border border-green-300' : 'bg-muted'
                            }`}
                          >
                            {typeof value === 'number' ? metric.format(value) : value}
                            {isBest && (
                              <Badge variant="secondary" className="ml-1 text-xs">
                                Meilleur
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator />

            {/* Summary */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Résumé</h4>
              <div className="space-y-1 text-sm">
                <p>• Écart de prix: {(() => {
                  const prices = selectedProps.map(p => p.price);
                  const minPrice = Math.min(...prices);
                  const maxPrice = Math.max(...prices);
                  return formatPrice(maxPrice - minPrice, 'MAD');
                })()}</p>
                
                <p>• Surface moyenne: {(() => {
                  const avgArea = selectedProps.reduce((sum, p) => sum + p.area, 0) / selectedProps.length;
                  return Math.round(avgArea);
                })()} m²</p>
                
                <p>• Prix moyen au m²: {(() => {
                  const avgPricePerSqm = selectedProps.reduce((sum, p) => sum + (p.price / p.area), 0) / selectedProps.length;
                  return Math.round(avgPricePerSqm).toLocaleString();
                })()} MAD/m²</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};