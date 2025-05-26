
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useProperties } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { SearchFilters } from '@/components/search/SearchFilters';
import { useTranslation } from '@/i18n';

const PropertiesPage = () => {
  const { t } = useTranslation();
  const { data: properties = [], isLoading } = useProperties();
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div className="container py-6">
      <Helmet>
        <title>{t('properties.title')} | AlertImmo</title>
      </Helmet>

      <h1 className="text-3xl font-bold mb-6">{t('properties.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <SearchFilters />
        </div>
        <div>
          <PropertyGrid 
            properties={properties}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
