
import React from 'react';
import { Heart, Share2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslation } from '@/i18n';

interface QuickActionsProps {
  propertyId: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCreateAlert?: (propertyData: any) => void;
}

export const QuickActions = ({
  propertyId,
  isFavorite,
  onToggleFavorite,
  onCreateAlert
}: QuickActionsProps) => {
  const { t } = useTranslation();

  const handleShare = async () => {
    const url = `${window.location.origin}/property/${propertyId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Propriété AlertImmo',
          url: url,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success(t('property.linkCopied', 'Lien copié dans le presse-papier'));
      } catch (error) {
        toast.error(t('property.shareError', 'Erreur lors du partage'));
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={isFavorite ? "default" : "outline"}
        size="sm"
        onClick={() => onToggleFavorite(propertyId)}
        className="flex items-center gap-1"
      >
        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        {isFavorite ? t('property.removeFromFavorites') : t('property.addToFavorites')}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-1"
      >
        <Share2 className="h-4 w-4" />
        {t('property.share', 'Partager')}
      </Button>
      
      {onCreateAlert && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCreateAlert({ propertyId })}
          className="flex items-center gap-1"
        >
          <AlertCircle className="h-4 w-4" />
          {t('property.createAlert', 'Créer une alerte')}
        </Button>
      )}
    </div>
  );
};
