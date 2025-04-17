
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, ArrowLeft, MapPin, Phone, Mail, Share2, 
  Clock, Home, Bed, Bath, Maximize, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PropertyImageCarousel } from '@/components/property/PropertyImageCarousel';
import { PropertyFeatureList } from '@/components/property/PropertyFeatureList';
import { Property } from '@/types/property';
import { mockProperties } from '@/data/mockProperties';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  useEffect(() => {
    // Simulate API fetch with a timeout
    const timer = setTimeout(() => {
      const foundProperty = mockProperties.find(p => p.id === id);
      setProperty(foundProperty || null);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
      description: property?.title,
      duration: 2000,
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Lien copié',
        description: 'L\'URL a été copiée dans le presse-papiers',
        duration: 2000,
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse text-muted-foreground">Chargement...</div>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold mb-4">Bien immobilier non trouvé</h1>
        <p className="text-muted-foreground mb-6">
          Le bien immobilier que vous recherchez n'existe pas ou a été supprimé.
        </p>
        <Link to="/" className="text-primary hover:underline">
          Retour à la page d'accueil
        </Link>
      </div>
    );
  }
  
  const statusLabel = property.status === 'for-sale' ? 'À vendre' : 'À louer';
  const priceLabel = property.status === 'for-rent' ? '/mois' : '';
  
  return (
    <div className="py-6">
      <div className="mb-6">
        <Link to="/search" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux résultats</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div>
          <PropertyImageCarousel images={property.images} title={property.title} />
          
          <div className="mt-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md text-sm font-medium">
                    {statusLabel}
                  </span>
                  <span className="bg-muted px-2 py-0.5 rounded-md text-sm">
                    {property.type}
                  </span>
                </div>
                <h1 className="text-2xl font-bold mt-2">{property.title}</h1>
                <div className="flex items-center text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span>{property.location.district}, {property.location.city}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleFavorite}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      isFavorite ? "fill-destructive text-destructive" : ""
                    )}
                  />
                </Button>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {property.bedrooms > 0 && (
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Bed className="h-4 w-4" />
                    <span className="text-sm">Chambres</span>
                  </div>
                  <span className="font-semibold">{property.bedrooms}</span>
                </div>
              )}
              
              {property.bathrooms > 0 && (
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Bath className="h-4 w-4" />
                    <span className="text-sm">Salles de bain</span>
                  </div>
                  <span className="font-semibold">{property.bathrooms}</span>
                </div>
              )}
              
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Maximize className="h-4 w-4" />
                  <span className="text-sm">Surface</span>
                </div>
                <span className="font-semibold">{property.area} m²</span>
              </div>
              
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Home className="h-4 w-4" />
                  <span className="text-sm">Type</span>
                </div>
                <span className="font-semibold capitalize">{property.type}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <div className="text-muted-foreground">
                <p>{property.description}</p>
              </div>
            </div>
            
            {property.features.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Caractéristiques</h2>
                <PropertyFeatureList features={property.features} />
              </div>
            )}
            
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Source de l'annonce</h2>
              <div className="flex items-center gap-3">
                {property.source.logo && (
                  <img 
                    src={property.source.logo} 
                    alt={property.source.name} 
                    className="h-8 w-auto"
                  />
                )}
                <div>
                  <p className="font-medium">{property.source.name}</p>
                  <a 
                    href={property.source.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm flex items-center gap-1"
                  >
                    Voir l'annonce originale
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Mise à jour le {formatDate(property.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="sticky top-20 border rounded-lg p-4 shadow-sm">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(property.price)} {property.priceUnit}
              <span className="text-sm font-normal">{priceLabel}</span>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Contacter</h3>
              <div className="text-muted-foreground">
                <p>{property.contactInfo.name}</p>
                
                {property.contactInfo.phone && (
                  <a 
                    href={`tel:${property.contactInfo.phone}`}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 mt-3"
                  >
                    <Phone className="h-4 w-4" />
                    <span>{property.contactInfo.phone}</span>
                  </a>
                )}
                
                {property.contactInfo.email && (
                  <a 
                    href={`mailto:${property.contactInfo.email}`}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 mt-2"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{property.contactInfo.email}</span>
                  </a>
                )}
              </div>
              
              <div className="mt-6 space-y-2">
                <Button className="w-full flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Appeler</span>
                </Button>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Envoyer un message</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
