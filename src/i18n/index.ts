
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frTranslations from './locales/fr.json';
import enTranslations from './locales/en.json';

i18n
  // Détecter la langue de l'utilisateur
  .use(LanguageDetector)
  // Passer l'instance i18n à react-i18next
  .use(initReactI18next)
  // Initialiser i18next
  .init({
    resources: {
      fr: {
        translation: frTranslations
      },
      en: {
        translation: enTranslations
      }
    },
    fallbackLng: 'fr',
    debug: import.meta.env.DEV,
    
    interpolation: {
      escapeValue: false, // React échape déjà les valeurs
    },
    
    // Options de détection de langue
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'alertimmo_language',
      caches: ['localStorage'],
    }
  });

export default i18n;

// Hook utilitaire pour gérer le changement de langue
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
    availableLanguages: ['fr', 'en']
  };
};
