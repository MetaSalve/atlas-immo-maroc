
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useProperties } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { HeroSearchSection } from '@/components/home/HeroSearchSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { PropertiesSection } from '@/components/home/PropertiesSection';
import { ContactSection } from '@/components/home/ContactSection';
import { MetaTags } from '@/components/common/MetaTags';
import { useTranslation } from '@/i18n';

const HomePage = () => {
  const { t } = useTranslation();
  const { data: properties = [], isLoading } = useProperties();
  const { favorites, toggleFavorite } = useFavorites();

  const featuredProperties = properties.slice(0, 3);
  const recentProperties = properties.slice(3, 9);

  return (
    <>
      <MetaTags />
      <div className="space-y-10">
        <HeroSearchSection />
        <div className="container">
          <FeaturesSection />
          <PropertiesSection 
            title={t('properties.featured')}
            properties={featuredProperties}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            isLoading={isLoading}
          />
          <PropertiesSection 
            title={t('properties.recent')}
            properties={recentProperties}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            isLoading={isLoading}
          />
          <ContactSection />
        </div>
      </div>
    </>
  );
};

export default HomePage;
