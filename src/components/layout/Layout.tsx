
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NavBar } from './NavBar';
import { BottomNav } from './BottomNav';
import { useIsMobile } from '@/hooks/use-mobile';
import { Database } from 'lucide-react';
import { FadeIn } from '../ui/animations';
import { AccessibilityBar } from '../common/AccessibilityBar';
import { InstallPWA } from '../common/InstallPWA';
import { PWAStatus } from '../common/PWAStatus';
import { useTranslation } from '@/i18n';
import { useLanguageSwitch } from '@/i18n';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguageSwitch();
  
  // Gérer l'affichage RTL pour l'arabe
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
  }, [currentLanguage]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main id="main-content" className="flex-1 container pb-16" tabIndex={-1} aria-label={t('common.mainContent', 'Contenu principal')}>
        <FadeIn>
          {children}
        </FadeIn>
      </main>
      <InstallPWA />
      <PWAStatus />
      <AccessibilityBar />
      <footer className="container py-4 text-center text-sm text-muted-foreground border-t">
        <div className="flex items-center justify-center gap-2 font-medium">
          <Database className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>{t('app.tagline', 'Agrégateur d\'annonces immobilières depuis 2023')}</span>
        </div>
        <div className="mt-2 flex justify-center space-x-4">
          <Link to="/legal" className="hover:underline">{t('common.legal', 'Mentions légales')}</Link>
          <Link to="/privacy" className="hover:underline">{t('common.privacy', 'Politique de confidentialité')}</Link>
        </div>
      </footer>
      {isMobile && <BottomNav />}
    </div>
  );
};
