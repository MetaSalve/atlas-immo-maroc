
import React from 'react';

interface I18nProviderProps {
  children: React.ReactNode;
}

// Provider simplifié qui ne fait que passer les enfants
export const I18nProvider = ({ children }: I18nProviderProps) => {
  return <>{children}</>;
};
