
import { Home, Search, Heart, Map, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
      <div className="grid h-full grid-cols-5">
        <NavItem to="/" icon={<Home />} label="Accueil" />
        <NavItem to="/search" icon={<Search />} label="Recherche" />
        <NavItem to="/map" icon={<Map />} label="Carte" />
        <NavItem to="/favorites" icon={<Heart />} label="Favoris" />
        <NavItem to="/profile" icon={<User />} label="Compte" />
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
