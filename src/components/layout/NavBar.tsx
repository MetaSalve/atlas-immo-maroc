
import React from 'react';
import { Link } from 'react-router-dom';
import { UserNav } from '@/components/layout/UserNav';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Logo } from '@/components/layout/Logo';
import { MobileNav } from '@/components/layout/MobileNav';
import { useTranslation } from '@/i18n';

export const NavBar = () => {
  const { t } = useTranslation();
  
  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="font-medium transition-colors hover:text-primary">
              {t('nav.home')}
            </Link>
            <Link to="/properties" className="font-medium transition-colors hover:text-primary">
              {t('nav.properties')}
            </Link>
            <Link to="/alerts" className="font-medium transition-colors hover:text-primary">
              {t('nav.alerts')}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <UserNav />
          <MobileNav />
        </div>
      </div>
    </header>
  );
};
