import { useProperties } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchBar } from '@/components/search/SearchBar';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { useNavigate } from 'react-router-dom';
import { Layers3, Globe, Database } from 'lucide-react';

const MoroccanSalonHeroImage = () => (
  <img
    src="/lovable-uploads/photo-1721322800607-8c38375eef04"
    alt="Salon marocain avec zellige"
    className="absolute inset-0 w-full h-full object-cover opacity-30 z-0"
    draggable={false}
    style={{ objectFit: 'cover', borderRadius: '1.25rem' }}
  />
);

const HomePage = () => {
  const navigate = useNavigate();
  const { data: properties = [], isLoading } = useProperties();
  const { favorites, toggleFavorite } = useFavorites();

  const featuredProperties = properties.slice(0, 3);
  const recentProperties = properties.slice(3);

  return (
    <div className="py-6 space-y-10">
      <section className="relative py-12 px-4 rounded-2xl bg-gradient-to-br from-sand to-peach/90 text-textPrimary overflow-hidden min-h-[340px]">
        <MoroccanSalonHeroImage />
        <div className="relative max-w-2xl mx-auto text-center z-10">
          <div className="mb-2 pb-1 font-bold text-lg uppercase tracking-wider text-olive">
            Agrégateur nouvelle génération&nbsp;: Toutes les annonces du web, au même endroit
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 font-playfair text-darkgray drop-shadow">
            Retrouvez en un clic l'ensemble des annonces immobilières du web au Maroc
          </h1>
          <p className="mb-4 text-gray-800 font-medium">
            Atlas Immo n'est pas une agence ! Nous centralisons, trions et mettons à jour en continu les meilleures annonces venues de tous les grands sites marocains et réseaux sociaux.
          </p>
          <div className="flex justify-center gap-8 mb-8">
            <div className="flex flex-col items-center">
              <img src="/lovable-uploads/photo-1721322800607-8c38375eef04" alt="Annonces agrégées" className="w-12 h-12 mb-2 rounded-full object-cover bg-sand p-1 border" />
              <p className="text-sm">Annonces web centralisées</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-peach/60 flex items-center justify-center mb-2">
                <Layers3 className="h-6 w-6 text-darkgray" />
              </div>
              <p className="text-sm">Filtrage intelligent</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-sand/70 flex items-center justify-center mb-2">
                <Globe className="h-6 w-6 text-darkgray" />
              </div>
              <p className="text-sm">Sources multiples</p>
            </div>
          </div>
          <SearchBar className="max-w-xl mx-auto" />
        </div>
      </section>
      
      <section className="bg-sand/30 p-6 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4 font-playfair text-deepblue">Comment fonctionne Atlas Immo?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-md shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Collecte Automatisée</h3>
            <p className="text-sm text-muted-foreground">Notre système analyse en continu les sites immobiliers et réseaux sociaux marocains.</p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto">
              <Layers3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Traitement Intelligent</h3>
            <p className="text-sm text-muted-foreground">Les annonces sont traitées, catégorisées et enrichies pour faciliter votre recherche.</p>
          </div>
          <div className="bg-white p-6 rounded-md shadow-sm">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 mx-auto">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold mb-2">Résultats Consolidés</h3>
            <p className="text-sm text-muted-foreground">Trouvez toutes les opportunités immobilières en un seul endroit sans multiplier les recherches.</p>
          </div>
        </div>
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-playfair text-deepblue">Biens en vedette</h2>
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
          <h2 className="text-2xl font-bold font-playfair text-olive">Ajouts récents</h2>
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
      
      <section className="rounded-xl bg-sand/30 p-6 text-center">
        <h2 className="text-2xl font-bold mb-2 font-playfair text-terracotta">Recevez les nouvelles annonces en premier</h2>
        <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
          Inscrivez-vous pour recevoir les alertes personnalisées des nouveaux biens correspondant à vos critères de recherche
        </p>
        <button 
          className="bg-terracotta text-white px-6 py-2 rounded-md hover:bg-terracotta/90 transition-colors font-bold"
          onClick={() => navigate('/alerts')}
        >
          Créer une alerte
        </button>
      </section>
    </div>
  );
};

export default HomePage;
