
import React from 'react';

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

// Traductions statiques temporaires
const translations = {
  fr: {
    'app.title': 'AlertImmo',
    'nav.home': 'Accueil',
    'nav.properties': 'Propriétés',
    'nav.search': 'Recherche',
    'nav.favorites': 'Favoris',
    'nav.alerts': 'Alertes',
    'nav.profile': 'Profil',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
  },
  en: {
    'app.title': 'AlertImmo',
    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.search': 'Search',
    'nav.favorites': 'Favorites',
    'nav.alerts': 'Alerts',
    'nav.profile': 'Profile',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
  },
  ar: {
    'app.title': 'AlertImmo',
    'nav.home': 'الرئيسية',
    'nav.properties': 'العقارات',
    'nav.search': 'البحث',
    'nav.favorites': 'المفضلة',
    'nav.alerts': 'التنبيهات',
    'nav.profile': 'الملف الشخصي',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
  }
};

// Context avec valeur par défaut
const I18nContext = React.createContext<I18nContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
});

interface I18nProviderProps {
  children: React.ReactNode;
}

// Provider classe pour éviter les hooks
class I18nProviderClass extends React.Component<I18nProviderProps, { language: string }> {
  constructor(props: I18nProviderProps) {
    super(props);
    this.state = { language: 'fr' };
    console.log('I18nProvider: Initialized with class component');
  }

  setLanguage = (lang: string) => {
    console.log('I18nProvider: Setting language to', lang);
    this.setState({ language: lang });
  };

  t = (key: string, defaultValue?: string): string => {
    const { language } = this.state;
    const currentTranslations = translations[language as keyof typeof translations] || translations.fr;
    return currentTranslations[key as keyof typeof currentTranslations] || defaultValue || key;
  };

  render() {
    const value: I18nContextType = {
      language: this.state.language,
      setLanguage: this.setLanguage,
      t: this.t,
    };

    return React.createElement(
      I18nContext.Provider,
      { value },
      this.props.children
    );
  }
}

// Hook personnalisé
export function useI18n() {
  const context = React.useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Export du provider
export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  return React.createElement(I18nProviderClass, { children });
};
