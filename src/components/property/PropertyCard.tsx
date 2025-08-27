import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Property } from '@/types/property';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { Image } from '@/components/image/Image';
import { LazyLoadedImage } from '@/components/common/LazyLoadedImage';
import { motion } from 'framer-motion';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n';

interface PropertyCardProps {
  property: Property;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  className?: string;
}

export const PropertyCard = ({ 
  property, 
  onToggleFavorite, 
  isFavorite,
  isSelected,
  onToggleSelect,
  className 
}: PropertyCardProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.info(t('auth.login'), {
        description: t('auth.loginRequired'),
      });
      navigate('/auth');
      return;
    }
    onToggleFavorite(property.id);
  };

  const handleCardClick = () => {
    if (!user) {
      toast.info(t('auth.login'), {
        description: t('auth.loginRequired'),
      });
      navigate('/auth');
      return;
    }
    navigate(`/properties/${property.id}`);
  };

  const bedroomsText = property.bedrooms === 1 ? t('properties.bedrooms') : t('properties.bedroomsPlural');
  const bathroomsText = property.bathrooms === 1 ? t('properties.bathrooms') : t('properties.bathroomsPlural');

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="aspect-w-16 aspect-h-9">
        <LazyLoadedImage
          src={property.images[0] || '/placeholder.svg'}
          alt={property.title}
          className="object-cover w-full h-full"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-white hover:text-primary focus:text-primary bg-black/20 hover:bg-black/40 focus:bg-black/40 rounded-full"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? t('properties.removeFromFavorites') : t('properties.addToFavorites')}
          aria-pressed={isFavorite}
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
            {property.area} m², {property.bedrooms} {bedroomsText}, {property.bathrooms} {bathroomsText}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <a 
          href={property.source.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-muted-foreground hover:underline"
          aria-label={`${t('properties.source')}: ${property.source.name}`}
        >
          {t('properties.source')}: {property.source.name}
        </a>
      </CardFooter>
    </motion.div>
  );
};
