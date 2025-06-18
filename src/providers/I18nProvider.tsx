
import React, { useEffect, useState } from 'react';

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [isI18nReady, setIsI18nReady] = useState(false);

  useEffect(() => {
    // Initialiser i18n de manière asynchrone
    const initI18n = async () => {
      try {
        await import('@/i18n');
        setIsI18nReady(true);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de i18n:', error);
        // Continuer sans i18n en cas d'erreur
        setIsI18nReady(true);
      }
    };

    initI18n();
  }, []);

  if (!isI18nReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
