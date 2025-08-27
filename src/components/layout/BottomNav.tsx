
import { Home, Heart, User, Bell } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';
import { useTranslation } from '@/i18n';

export const BottomNav = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
      <div className="grid h-full grid-cols-4">
        <NavItem to="/" icon={<Home />} label={t('nav.home')} />
        {user ? (
          <>
            <NavItem to="/favorites" icon={<Heart />} label={t('nav.favorites')} />
            <NavItem to="/alerts" icon={<Bell />} label={t('nav.alerts')} />
            <NavItem to="/profile" icon={<User />} label={t('nav.profile')} />
          </>
        ) : (
          <>
            <NavItem to="/auth" icon={<Heart />} label={t('nav.favorites')} />
            <NavItem to="/auth" icon={<Bell />} label={t('nav.alerts')} />
            <NavItem to="/auth" icon={<User />} label={t('nav.profile')} />
          </>
        )}
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex flex-col items-center justify-center h-full",
          isActive
            ? "text-primary"
            : "text-foreground/60 hover:text-foreground"
        )
      }
    >
      <div className="flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs mt-1">{label}</span>
    </NavLink>
  );
};
