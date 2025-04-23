import { useProperties } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchBar } from '@/components/search/SearchBar';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { useNavigate } from 'react-router-dom';
import { Layers3, Globe, Bell } from 'lucide-react';

const MoroccanHeroImage = () => (
  <img
    src="/lovable-uploads/ed94eaf4-699c-4b4d-b440-4ae06aba60a0.png"
    alt="Zellige marocain traditionnel"
    className="absolute inset-0 w-full h-full object-cover opacity-20 z-0"
    draggable={false}
    style={{ objectFit: 'cover', borderRadius: '1.25rem' }}
  />
);

const ZelligeBackground = () => (
  <img
    src="/lovable-uploads/8f920b64-4b0a-4b83-a337-fca2ea58f64d.png"
    alt="Motif zellige marocain"
    className="absolute top-0 left-0 w-full h-full object-cover opacity-15 z-0"
    draggable={false}
    style={{ objectFit: 'cover' }}
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
      <section className="relative py-12 px-4 rounded-2xl bg-gradient-to-br from-navy/90 to-skyblue/80 text-white overflow-hidden min-h-[340px]">
        <MoroccanHeroImage />
        <div className="relative max-w-2xl mx-auto text-center z-10">
          <div className="mb-2 pb-1 font-bold text-lg uppercase tracking-wider text-gold">
            Notifications en temps réel
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 font-playfair text-white drop-shadow">
            Le premier agrégateur d'annonces immobilières au Maroc
          </h1>
          <div className="flex justify-center gap-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-medium">Sources multiples</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-medium">Notifications en temps réel</p>
            </div>
          </div>
          <SearchBar className="max-w-xl mx-auto" />
        </div>
      </section>
      
      <section className="bg-cream/60 p-6 rounded-lg text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 z-0"><ZelligeBackground /></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-4 font-playfair text-navy">Comment fonctionne Alerte Immo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-md shadow-sm">
              <div className="w-12 h-12 rounded-full bg-skyblue/20 flex items-center justify-center mb-4 mx-auto">
                <Globe className="h-6 w-6 text-skyblue" />
              </div>
              <h3 className="font-bold mb-2">Collecte Intelligente</h3>
              <p className="text-sm text-muted-foreground">Notre système analyse en continu les sites immobiliers et réseaux sociaux marocains.</p>
            </div>
            <div className="bg-white p-6 rounded-md shadow-sm">
              <div className="w-12 h-12 rounded-full bg-skyblue/20 flex items-center justify-center mb-4 mx-auto">
                <Layers3 className="h-6 w-6 text-skyblue" />
              </div>
              <h3 className="font-bold mb-2">Centralisation</h3>
              <p className="text-sm text-muted-foreground">Toutes les annonces sont regroupées et catégorisées pour faciliter votre recherche.</p>
            </div>
            <div className="bg-white p-6 rounded-md shadow-sm">
              <div className="w-12 h-12 rounded-full bg-skyblue/20 flex items-center justify-center mb-4 mx-auto">
                <Bell className="h-6 w-6 text-skyblue" />
              </div>
              <h3 className="font-bold mb-2">Alertes en temps réel</h3>
              <p className="text-sm text-muted-foreground">Recevez des notifications instantanées pour les nouvelles annonces qui correspondent à vos critères.</p>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-playfair text-navy">Biens en vedette</h2>
          <button 
            onClick={() => navigate('/search')}
            className="text-skyblue hover:underline text-sm"
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
          <h2 className="text-2xl font-bold font-playfair text-navy">Ajouts récents</h2>
          <button 
            onClick={() => navigate('/search')}
            className="text-skyblue hover:underline text-sm"
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
      
      <section className="rounded-xl bg-cream/60 p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 z-0"><ZelligeBackground /></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2 font-playfair text-navy">Recevez les nouvelles annonces en temps réel</h2>
          <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
            Inscrivez-vous pour recevoir des notifications personnalisées dès qu'un bien correspondant à vos critères est publié
          </p>
          <button 
            className="bg-skyblue text-white px-6 py-2 rounded-md hover:bg-royalblue transition-colors font-bold"
            onClick={() => navigate('/alerts')}
          >
            Créer une alerte
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
