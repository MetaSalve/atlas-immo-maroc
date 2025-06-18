
import React from 'react';

interface I18nProviderProps {
  children: React.ReactNode;
}

// Provider simplifié qui ne fait que passer les enfants sans utiliser de hooks
export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  return <>{children}</>;
};
