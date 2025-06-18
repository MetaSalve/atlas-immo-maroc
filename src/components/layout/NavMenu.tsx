
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Bell, User, Search, Home, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslation } from '@/i18n';

interface NavMenuProps {
  className?: string;
  onItemClick?: () => void;
}

export const NavMenu = ({ className = '', onItemClick }: NavMenuProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { 
      path: '/', 
      label: t('nav.home', 'Accueil'), 
      icon: Home,
      public: true 
    },
    { 
      path: '/properties', 
      label: t('nav.properties', 'Propriétés'), 
      icon: Building,
      public: true 
    },
    { 
      path: '/search', 
      label: t('nav.search', 'Recherche'), 
      icon: Search,
      public: true 
    },
    { 
      path: '/favorites', 
      label: t('nav.favorites', 'Favoris'), 
      icon: Heart,
      protected: true 
    },
    { 
      path: '/alerts', 
      label: t('nav.alerts', 'Alertes'), 
      icon: Bell,
      protected: true 
    },
    { 
      path: '/profile', 
      label: t('nav.profile', 'Profil'), 
      icon: User,
      protected: true 
    },
  ];

  // Ne pas afficher les éléments protégés pendant le chargement
  const visibleItems = menuItems.filter(item => 
    item.public || (item.protected && !loading && user)
  );

  return (
    <nav className={`flex flex-col space-y-2 ${className}`}>
      {visibleItems.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "default" : "ghost"}
            className="justify-start"
            asChild
            onClick={onItemClick}
          >
            <Link to={item.path} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
};
