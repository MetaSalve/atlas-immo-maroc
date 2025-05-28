
import React from 'react';
import { SearchBar } from '@/components/search/SearchBar';
import { useTranslation } from '@/i18n';

export const HeroSearchSection = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {t('hero.title', 'Trouvez votre bien immobilier idéal')}
        </h1>
        <p className="text-xl mb-8 opacity-90">
          {t('hero.subtitle', 'Recherchez parmi des milliers d\'annonces mises à jour en temps réel')}
        </p>
        
        <div className="max-w-2xl mx-auto">
          <SearchBar className="bg-white rounded-lg shadow-lg" />
        </div>
        
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            📍 Casablanca
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            🏠 Rabat
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            🏢 Marrakech
          </span>
          <span className="bg-white/20 px-3 py-1 rounded-full">
            🏡 Fès
          </span>
        </div>
      </div>
    </section>
  );
};
