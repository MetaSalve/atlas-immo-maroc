
import { useProperties } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchBar } from '@/components/search/SearchBar';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const { data: properties = [], isLoading } = useProperties();
  const { favorites, toggleFavorite } = useFavorites();

  const featuredProperties = properties.slice(0, 4);
  const recentProperties = properties.slice(4);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-skyblue">ImmoMaroc</h1>
            <button 
              onClick={() => navigate('/auth')}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <span className="sr-only">Profile</span>
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6">
        {/* Search Section */}
        <div className="mb-8">
          <SearchBar className="w-full" />
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button className="px-4 py-2 rounded-full bg-skyblue text-white text-sm whitespace-nowrap">
              En vedette
            </button>
            <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm whitespace-nowrap">
              Location
            </button>
            <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm whitespace-nowrap">
              Vente
            </button>
            <button className="px-4 py-2 rounded-full bg-white border border-gray-200 text-sm whitespace-nowrap">
              Vacances 
            </button>
          </div>
        </div>

        {/* Featured Properties */}
        <section className="mb-8">
          <PropertyGrid 
            properties={featuredProperties}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            isLoading={isLoading}
          />
        </section>

        {/* Recent Properties */}
        <section>
          <PropertyGrid 
            properties={recentProperties}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            isLoading={isLoading}
          />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
