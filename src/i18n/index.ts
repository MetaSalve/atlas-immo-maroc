
// Point d'entrée pour l'internationalisation
export { default as i18n } from './i18nConfig';
export { useLanguageSwitch } from './hooks/useLanguageSwitch';
export { languageNames, LANGUAGE_STORAGE_KEY } from './constants';

// Ré-exporter pour faciliter l'accès
export { useTranslation } from 'react-i18next';
