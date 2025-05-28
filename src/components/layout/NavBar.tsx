
import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import { UserNav } from './UserNav';
import { MobileNav } from './MobileNav';
import { NotificationIndicator } from './NotificationIndicator';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslation } from '@/i18n';

export const NavBar = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary">
              {t('nav.home', 'Accueil')}
            </Link>
            <Link to="/properties" className="text-sm font-medium hover:text-primary">
              {t('nav.properties', 'Propriétés')}
            </Link>
            <Link to="/search" className="text-sm font-medium hover:text-primary">
              {t('nav.search', 'Recherche')}
            </Link>
            {user && (
              <>
                <Link to="/favorites" className="text-sm font-medium hover:text-primary">
                  {t('nav.favorites', 'Favoris')}
                </Link>
                <Link to="/alerts" className="text-sm font-medium hover:text-primary">
                  {t('nav.alerts', 'Alertes')}
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          
          {user ? (
            <>
              <NotificationIndicator />
              <UserNav />
            </>
          ) : (
            <Button asChild>
              <Link to="/auth">{t('auth.login', 'Connexion')}</Link>
            </Button>
          )}
          
          <MobileNav />
        </div>
      </div>
    </nav>
  );
};
