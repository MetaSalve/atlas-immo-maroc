
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frTranslations from './locales/fr.json';
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';
import esTranslations from './locales/es.json';
import { LANGUAGE_STORAGE_KEY } from './constants';

/**
 * Configuration et initialisation de i18next
 */
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
      },
      ar: {
        translation: arTranslations
      },
      es: {
        translation: esTranslations
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
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ['localStorage'],
    }
  });

export default i18n;
