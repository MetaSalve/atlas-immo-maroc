
import i18n from '../i18nConfig';

/**
 * Hook pour gérer le changement de langue
 */
export const useLanguageSwitch = () => {
  const currentLanguage = i18n.language;
  
  const switchLanguage = (language: string) => {
    i18n.changeLanguage(language);
    // Sauvegarder la préférence de langue
    localStorage.setItem('alertimmo_language', language);
  };
  
  return {
    currentLanguage,
    switchLanguage,
    availableLanguages: ['fr', 'en', 'ar', 'es']
  };
};
