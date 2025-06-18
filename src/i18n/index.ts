
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

// Ré-exporter les autres modules nécessaires
export { useLanguageSwitch } from './hooks/useLanguageSwitch';
export { languageNames, LANGUAGE_STORAGE_KEY } from './constants';
export { default as i18n } from './i18nConfig';
