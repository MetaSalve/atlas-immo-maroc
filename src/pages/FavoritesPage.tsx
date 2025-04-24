
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { useProperties } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/providers/AuthProvider';
import { Loader2 } from 'lucide-react';

const FavoritesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: properties, isLoading: propertiesLoading } = useProperties();
  const { favorites, toggleFavorite, isLoading: favoritesLoading } = useFavorites();
  
  useEffect(() => {
    // Redirect to auth page if not logged in
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);
  
  if (!user) return null;
  
  const isLoading = propertiesLoading || favoritesLoading;
  
  // Filter properties based on favorites
  const favoriteProperties = properties?.filter((property) => favorites.includes(property.id)) || [];
  
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Mes favoris</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : favoriteProperties.length > 0 ? (
        <PropertyGrid
          properties={favoriteProperties}
          favorites={favorites}
          selectedProperties={[]}
          onToggleFavorite={toggleFavorite}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8 text-muted-foreground"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold mb-2">Vous n'avez pas encore de favoris</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Explorez les annonces et ajoutez-les à vos favoris en cliquant sur l'icône de cœur
          </p>
          <Link
            to="/search"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Explorer les annonces
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
