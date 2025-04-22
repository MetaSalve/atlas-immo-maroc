
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Bed, Bath, Maximize, Heart } from 'lucide-react';
import { Property } from '@/types/property';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  className?: string;
}

export const PropertyCard = ({
  property,
  isFavorite = false,
  onToggleFavorite,
  className
}: PropertyCardProps) => {
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onToggleFavorite) {
      onToggleFavorite(property.id);
      toast({
        title: isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
        description: property.title,
        duration: 2000,
      });
    }
  };
  
  const statusLabel = property.status === 'for-sale' ? 'À vendre' : 'À louer';
  const priceLabel = property.status === 'for-rent' ? '/mois' : '';
  
  const fallbackImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzR8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60';
  
  return (
    <Card className={cn("property-card group", className)}>
      <Link to={`/properties/${property.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={imageError ? fallbackImage : property.images[0]}
            alt={property.title}
            className="property-card-image transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          <div className="property-card-badge">{statusLabel}</div>
          <Button
            variant="ghost"
            size="icon"
            className="property-card-favorite"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite ? "fill-destructive text-destructive" : "text-muted-foreground"
              )}
            />
          </Button>
        </div>
        
        <CardContent className="property-card-content">
          <div className="property-card-price">
            {formatPrice(property.price)} {property.priceUnit} {priceLabel}
          </div>
          <h3 className="font-medium leading-tight mt-1 line-clamp-1">{property.title}</h3>
          <div className="property-card-location line-clamp-1">
            {property.location.district}, {property.location.city}
          </div>
          
          <div className="property-card-stats">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Maximize className="h-4 w-4" />
              <span>{property.area} m²</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>{property.type}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};
