
import React, { useState } from 'react';
import { useProperties, PropertyFilters } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { SearchFilters } from '@/components/search/SearchFilters';
import { useTranslation } from '@/i18n';
import { DocumentHead } from '@/components/common/DocumentHead';

const PropertiesPage = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<PropertyFilters>({});
  const { data: properties = [], isLoading } = useProperties(filters);
  const { favorites, toggleFavorite } = useFavorites();

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container py-6">
      <DocumentHead title={`${t('properties.title')} | AlertImmo`} />

      <h1 className="text-3xl font-bold mb-6">{t('properties.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <SearchFilters onFilterChange={handleFilterChange} />
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
