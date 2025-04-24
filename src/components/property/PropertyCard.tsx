import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from '@/types/property';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { OptimizedImage } from '@/components/image/OptimizedImage';

interface PropertyCardProps {
  property: Property;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
}

export const PropertyCard = ({ property, onToggleFavorite, isFavorite }: PropertyCardProps) => {
  return (
    <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
      <div className="relative aspect-[16/9]">
        <OptimizedImage
          src={property.images[0] || '/placeholder.svg'}
          alt={property.title}
          className="object-cover w-full h-full"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-white hover:text-primary focus:text-primary bg-black/20 hover:bg-black/40 focus:bg-black/40 rounded-full"
          onClick={() => onToggleFavorite(property.id)}
          aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-primary text-primary' : 'text-white'}`} />
        </Button>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{property.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-sm">{property.location.city}, {property.type}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 py-4">
        <div className="space-y-1">
          <p className="text-sm font-medium leading-none">{formatPrice(property.price, property.priceUnit)}</p>
          <p className="text-sm text-muted-foreground">
            {property.area} m², {property.bedrooms} chambres, {property.bathrooms} salles de bain
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <a href={property.source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:underline">
          Source: {property.source.name}
        </a>
      </CardFooter>
    </Card>
  );
};
