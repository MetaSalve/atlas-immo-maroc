
import React, { createContext, useContext, useState } from 'react';

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, defaultValue?: string) => string;
}

// Traductions statiques
const translations = {
  fr: {
    'app.title': 'AlertImmo',
    'nav.home': 'Accueil',
    'nav.properties': 'Propriétés',
    'nav.search': 'Recherche',
    'nav.favorites': 'Favoris',
    'nav.alerts': 'Alertes',
    'nav.profile': 'Profil',
    'auth.login': 'Connexion',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.language': 'Langue',
  },
  en: {
    'app.title': 'AlertImmo',
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.search': 'Search',
    'nav.favorites': 'Favorites',
    'nav.alerts': 'Alerts',
    'nav.profile': 'Profile',
    'auth.login': 'Login',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.language': 'Language',
  },
  ar: {
    'app.title': 'AlertImmo',
    'nav.home': 'الرئيسية',
    'nav.properties': 'العقارات',
    'nav.search': 'البحث',
    'nav.favorites': 'المفضلة',
    'nav.alerts': 'التنبيهات',
    'nav.profile': 'الملف الشخصي',
    'auth.login': 'تسجيل الدخول',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.language': 'اللغة',
  }
};

const I18nContext = createContext<I18nContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
});

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('fr');

  const t = (key: string, defaultValue?: string): string => {
    const currentTranslations = translations[language as keyof typeof translations] || translations.fr;
    return currentTranslations[key as keyof typeof currentTranslations] || defaultValue || key;
  };

  const value: I18nContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
