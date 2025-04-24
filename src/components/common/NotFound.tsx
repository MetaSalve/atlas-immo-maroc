
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MetaTags } from './MetaTags';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <MetaTags 
        title="Page non trouvée - AlertImmo" 
        description="La page que vous recherchez n'existe pas ou a été déplacée."
      />
      
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">Page non trouvée</h2>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={() => navigate(-1)} variant="outline">
            Retour
          </Button>
          <Button onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </>
  );
};
