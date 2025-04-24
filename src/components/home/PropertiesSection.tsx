
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyGrid } from '@/components/property/PropertyGrid';

interface PropertiesSectionProps {
  title: string;
  properties: any[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  isLoading: boolean;
}

export const PropertiesSection = ({
  title,
  properties,
  favorites,
  onToggleFavorite,
  isLoading
}: PropertiesSectionProps) => {
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-playfair text-navy">{title}</h2>
        <button 
          onClick={() => navigate('/search')}
          className="text-skyblue hover:underline text-sm"
        >
          Voir tout
        </button>
      </div>
      <PropertyGrid 
        properties={properties}
        favorites={favorites}
        onToggleFavorite={onToggleFavorite}
        isLoading={isLoading}
      />
    </section>
  );
};

