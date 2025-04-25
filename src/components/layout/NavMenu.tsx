
import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NavMenu = () => {
  return (
    <div className="hidden md:flex items-center gap-1">
      <NavItem to="/" icon={<Home className="h-4 w-4 mr-2" />} label="Accueil" />
      <NavItem to="/search" icon={<Search className="h-4 w-4 mr-2" />} label="Recherche" />
      <NavItem to="/favorites" icon={<Heart className="h-4 w-4 mr-2" />} label="Favoris" />
      <NavItem to="/alerts" icon={<Bell className="h-4 w-4 mr-2" />} label="Alertes" />
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
          "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
          isActive 
            ? "bg-skyblue/20 text-skyblue" 
            : "hover:bg-cream/70 text-navy/70"
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  );
};
