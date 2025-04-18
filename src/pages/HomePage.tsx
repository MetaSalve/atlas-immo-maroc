import { useProperties } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchBar } from '@/components/search/SearchBar';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const { data: properties = [], isLoading } = useProperties();
  const { favorites, toggleFavorite } = useFavorites();
  
  const featuredProperties = properties.slice(0, 3);
  const recentProperties = properties.slice(3);
  
  return (
    <div className="py-6 space-y-10">
      <section className="relative py-12 px-4 rounded-2xl bg-gradient-to-br from-deepblue to-deepblue/90 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1582407947304-fd86f028f716')] opacity-15 bg-cover bg-center" />
        <div className="relative max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Trouvez votre bien immobilier idéal au Maroc
          </h1>
          <p className="text-white/90 mb-8">
            Découvrez les meilleures offres de vente et location partout au Maroc
          </p>
          <SearchBar className="max-w-xl mx-auto" />
        </div>
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Biens en vedette</h2>
          <button 
            onClick={() => navigate('/search')}
            className="text-primary hover:underline text-sm"
          >
            Voir tout
          </button>
        </div>
        <PropertyGrid 
          properties={featuredProperties}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          isLoading={isLoading}
        />
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Ajouts récents</h2>
          <button 
            onClick={() => navigate('/search')}
            className="text-primary hover:underline text-sm"
          >
            Voir tout
          </button>
        </div>
        <PropertyGrid 
          properties={recentProperties}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          isLoading={isLoading}
        />
      </section>
      
      <section className="rounded-xl bg-muted p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Recevez les nouvelles annonces en premier</h2>
        <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
          Inscrivez-vous pour recevoir les alertes personnalisées des nouveaux biens correspondant à vos critères de recherche
        </p>
        <button className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors">
          Créer une alerte
        </button>
      </section>
    </div>
  );
};

export default HomePage;
