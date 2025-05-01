
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useTranslation } from '@/i18n';

export function MobileNav() {
  const { t } = useTranslation();
  const isLoggedIn = localStorage.getItem('sb-authuser') !== null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="grid gap-6 py-6">
          <Link to="/" className="font-medium transition-colors hover:text-primary">
            {t('nav.home')}
          </Link>
          <Link to="/properties" className="font-medium transition-colors hover:text-primary">
            {t('nav.properties')}
          </Link>
          <Link to="/alerts" className="font-medium transition-colors hover:text-primary">
            {t('nav.alerts')}
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="font-medium transition-colors hover:text-primary">
                {t('user.profile')}
              </Link>
              <Link to="/favorites" className="font-medium transition-colors hover:text-primary">
                {t('user.favorites')}
              </Link>
              <Link to="/notifications" className="font-medium transition-colors hover:text-primary">
                {t('user.notifications')}
              </Link>
              <Button variant="outline" className="w-full">
                {t('auth.logout')}
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button className="w-full">{t('auth.login')}</Button>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
