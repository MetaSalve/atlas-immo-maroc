
import React from 'react';
import { useProperties } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { PropertiesSection } from '@/components/home/PropertiesSection';
import { ContactSection } from '@/components/home/ContactSection';
import { MetaTags } from '@/components/common/MetaTags';
import { useTranslation } from '@/i18n';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const HomePage = () => {
  const { t } = useTranslation();
  const { data: properties = [], isLoading } = useProperties();
  const { favorites, toggleFavorite } = useFavorites();

  const featuredProperties = properties.slice(0, 3);
  const recentProperties = properties.slice(3);

  return (
    <>
      <MetaTags />
      <div className="py-6 space-y-10">
        <ErrorBoundary>
          <HeroSection />
        </ErrorBoundary>
        <ErrorBoundary>
          <FeaturesSection />
        </ErrorBoundary>
        <ErrorBoundary>
          <PropertiesSection 
            title={t('properties.featured')}
            properties={featuredProperties}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            isLoading={isLoading}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <PropertiesSection 
            title={t('properties.recent')}
            properties={recentProperties}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            isLoading={isLoading}
          />
        </ErrorBoundary>
        <ErrorBoundary>
          <ContactSection />
        </ErrorBoundary>
      </div>
    </>
  );
};

export default HomePage;
