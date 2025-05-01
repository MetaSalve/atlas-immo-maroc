
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

// Mock du hook useLanguageSwitch
vi.mock('@/i18n', () => ({
  useLanguageSwitch: () => ({
    currentLanguage: 'fr',
    switchLanguage: vi.fn(),
    availableLanguages: ['fr', 'en', 'ar', 'es']
  }),
  languageNames: {
    fr: 'Français',
    en: 'English',
    ar: 'العربية',
    es: 'Español'
  },
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

describe('LanguageSwitcher', () => {
  it('renders the language switcher correctly', () => {
    render(<LanguageSwitcher />);
    
    // Rechercher le bouton du sélecteur de langue
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Vérifier que l'icône du globe est présente
    const globeIcon = document.querySelector('svg');
    expect(globeIcon).toBeInTheDocument();
  });
  
  it('displays the current language', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('Français')).toBeInTheDocument();
  });
});
