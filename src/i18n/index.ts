
// Re-export du hook useTranslation de react-i18next
export { useTranslation } from 'react-i18next';

// Re-export des autres modules
export { useLanguageSwitch } from './hooks/useLanguageSwitch';
export { languageNames, LANGUAGE_STORAGE_KEY } from './constants';
export { default as i18n } from './i18nConfig';
