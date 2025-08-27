import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProperties, PropertyFilters } from '@/hooks/useProperties';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchHeader } from './SearchHeader';
import { SearchResults } from './SearchResults';
import { SearchSidebar } from './SearchSidebar';
import { Property } from '@/types/property';
import { useTranslation } from '@/i18n';
import { toast } from 'sonner';

const SearchPage = () => {
  const { t } = useTranslation();
  
  // Safely initialize search params
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMap, setShowMap] = useState(false);
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  
  const initialQuery = searchParams.get('q') || '';
  
  const [filters, setFilters] = useState<PropertyFilters>({
    city: initialQuery,
    status: undefined,
    type: undefined,
    minPrice: 0,
    maxPrice: 10000000,
    bedrooms: 0,
    bathrooms: 0,
  });

  const { data: properties = [], isLoading } = useProperties(filters);
  const { favorites, toggleFavorite } = useFavorites();

  const searchQuery = searchParams.get('q') || '';

  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, city: query }));
    setSearchParams(query ? { q: query } : {});
  };

  const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    // Logic to apply filters can be added here if needed
    toast.success('Filtres appliqués');
  };

  const handleResetFilters = () => {
    setFilters({ 
      city: searchQuery,
      status: undefined,
      type: undefined,
      minPrice: 0,
      maxPrice: 10000000,
      bedrooms: 0,
      bathrooms: 0,
    });
    toast.info('Filtres réinitialisés');
  };

  const handleSaveAlert = () => {
    toast.success('Alerte sauvegardée avec succès');
  };

  const handleToggleView = () => {
    setShowMap(!showMap);
  };

  const handlePropertyClick = (property: Property) => {
    // Navigate to property detail page
    window.open(`/property/${property.id}`, '_blank');
  };

  const handlePropertySelect = (property: Property) => {
    setSelectedProperties(prev => {
      const isSelected = prev.some(p => p.id === property.id);
      if (isSelected) {
        return prev.filter(p => p.id !== property.id);
      } else {
        return [...prev, property];
      }
    });
  };

  return (
    <div className="container py-6">
      <SearchHeader
        searchQuery={searchQuery}
        showMap={showMap}
        onSearch={handleSearch}
        onToggleView={handleToggleView}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
        <SearchSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
          onSaveAlert={handleSaveAlert}
          propertiesCount={properties.length}
        />
        
        <SearchResults
          showMap={showMap}
          properties={properties}
          isLoading={isLoading}
          searchQuery={searchQuery}
          favorites={favorites}
          selectedProperties={selectedProperties}
          onToggleFavorite={toggleFavorite}
          onPropertyClick={handlePropertyClick}
          onPropertySelect={handlePropertySelect}
        />
      </div>
    </div>
  );
};

export default SearchPage;