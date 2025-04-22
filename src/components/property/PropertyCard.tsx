
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Property } from '@/types/property';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
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
  
  const fallbackImage = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzR8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60';
  
  return (
    <Card className={cn("overflow-hidden rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
      <Link to={`/properties/${property.id}`} className="block">
        <div className="relative aspect-[4/3]">
          <img
            src={imageError ? fallbackImage : property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors"
          >
            <Heart
              className={cn(
                "h-5 w-5",
                isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-600"
              )}
            />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium line-clamp-1">{property.title}</h3>
            <span className="font-semibold text-skyblue">
              {formatPrice(property.price)} {property.priceUnit}
            </span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-1">
            {property.location.district}, {property.location.city}
          </p>
          
          <div className="mt-3 pt-3 border-t flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <span>{property.bedrooms} ch.</span>
              •
              <span>{property.area} m²</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};
