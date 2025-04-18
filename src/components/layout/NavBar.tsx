
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Heart, Map, Menu, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/providers/AuthProvider';

export const NavBar = () => {
  const isMobile = useIsMobile();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2">
          {!isMobile && (
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <NavLink to="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-1">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-deepblue">Atlas<span className="text-primary">Immo</span></span>
          </NavLink>
        </div>
        
        <div className="hidden md:flex items-center gap-1">
          <NavItem to="/" icon={<Home className="h-4 w-4 mr-2" />} label="Accueil" />
          <NavItem to="/search" icon={<Search className="h-4 w-4 mr-2" />} label="Recherche" />
          <NavItem to="/map" icon={<Map className="h-4 w-4 mr-2" />} label="Carte" />
          <NavItem to="/favorites" icon={<Heart className="h-4 w-4 mr-2" />} label="Favoris" />
        </div>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex items-center gap-2"
                onClick={() => signOut()}
              >
                <UserCircle className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex items-center gap-2"
                onClick={() => navigate('/auth')}
              >
                <UserCircle className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
              {!isMobile && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => navigate('/auth')}
                >
                  Sign Up
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

interface NavItemProps {
  to: string;
  icon?: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        cn("flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors", 
           isActive 
             ? "bg-accent/50 text-accent-foreground" 
             : "hover:bg-accent/30 text-foreground/70"
        )
      }
    >
      {icon}
      {label}
    </NavLink>
  );
};
