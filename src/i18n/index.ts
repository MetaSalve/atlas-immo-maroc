
import React from 'react';

// Type pour les clés de traduction
type TranslationKey = string;
type DefaultValue = string;

// Fonction de traduction simple qui retourne la valeur par défaut
export const useTranslation = () => {
  const t = (key: TranslationKey, defaultValue?: DefaultValue) => {
    // Pour l'instant, on retourne simplement la valeur par défaut ou la clé
    return defaultValue || key;
  };

  return { t };
};
