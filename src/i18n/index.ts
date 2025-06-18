
// Fonction de traduction simple qui retourne la valeur par défaut
export const useTranslation = () => {
  const t = (key: string, defaultValue?: string) => {
    // Pour l'instant, on retourne simplement la valeur par défaut ou la clé
    return defaultValue || key;
  };

  return { t };
};

// Ré-exporter les autres modules nécessaires (temporairement désactivés pour le diagnostic)
// export { useLanguageSwitch } from './hooks/useLanguageSwitch';
// export { languageNames, LANGUAGE_STORAGE_KEY } from './constants';
// export { default as i18n } from './i18nConfig';

// Valeurs temporaires pour éviter les erreurs d'import
export const useLanguageSwitch = () => ({
  currentLanguage: 'fr',
  switchLanguage: (lang: string) => console.log('Switching to', lang),
  availableLanguages: ['fr', 'en', 'ar']
});

export const languageNames = {
  fr: 'Français',
  en: 'English',
  ar: 'العربية'
};

export const LANGUAGE_STORAGE_KEY = 'alertimmo_language';

export const i18n = {
  language: 'fr',
  changeLanguage: (lang: string) => console.log('Language changed to', lang)
};

export default i18n;
