
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { Property } from '@/types/property';
import { mockProperties } from '@/data/mockProperties';
import { useToast } from '@/hooks/use-toast';

const FavoritesPage = () => {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  
  // In a real app, we would load favorites from localStorage or an API
  useEffect(() => {
    // Demo: initialize with some random favorites
    const initialFavorites = ['p2', 'p4'];
    setFavorites(initialFavorites);
  }, []);
  
  useEffect(() => {
    // Filter properties based on favorites
    const properties = mockProperties.filter((property) => 
      favorites.includes(property.id)
    );
    setFavoriteProperties(properties);
  }, [favorites]);
  
  const handleToggleFavorite = (id: string) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(id)) {
        toast({
          title: 'Retiré des favoris',
          description: mockProperties.find(p => p.id === id)?.title,
          duration: 2000,
        });
        return prevFavorites.filter((favId) => favId !== id);
      } else {
        return prevFavorites;
      }
    });
  };
  
  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">Mes favoris</h1>
      
      {favoriteProperties.length > 0 ? (
        <PropertyGrid
          properties={favoriteProperties}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
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
