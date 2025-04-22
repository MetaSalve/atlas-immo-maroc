
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Heart, Map, Menu, UserCircle, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/providers/AuthProvider';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
            <img
              src="/lovable-uploads/8f920b64-4b0a-4b83-a337-fca2ea58f64d.png"
              alt="Atlas Immo - logo zellige"
              className="w-8 h-8 rounded-md object-cover border border-skyblue"
              draggable={false}
            />
            <span className="font-bold text-xl text-navy font-playfair">Atlas<span className="text-skyblue">Immo</span></span>
          </NavLink>
        </div>

        <div className="hidden md:flex items-center gap-1">
          <NavItem to="/" icon={<Home className="h-4 w-4 mr-2" />} label="Accueil" />
          <NavItem to="/search" icon={<Search className="h-4 w-4 mr-2" />} label="Recherche" />
          <NavItem to="/map" icon={<Map className="h-4 w-4 mr-2" />} label="Carte" />
          {user && (
            <>
              <NavItem to="/favorites" icon={<Heart className="h-4 w-4 mr-2" />} label="Favoris" />
              <NavItem to="/alerts" icon={<Bell className="h-4 w-4 mr-2" />} label="Alertes" />
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 text-navy">
                  <UserCircle className="h-4 w-4" />
                  <span className="hidden md:inline">{user.email?.split('@')[0]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-cream/70 text-navy">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/favorites')}>
                  <Heart className="h-4 w-4 mr-2" /> Favoris
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/alerts')}>
                  <Bell className="h-4 w-4 mr-2" /> Alertes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="h-4 w-4 mr-2" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex items-center gap-2 text-navy"
                onClick={() => navigate('/auth')}
              >
                <UserCircle className="h-4 w-4" />
                <span>Connexion</span>
              </Button>
              {!isMobile && (
                <Button 
                  variant="default" 
                  size="sm"
                  className="bg-skyblue text-white font-bold hover:bg-royalblue"
                  onClick={() => navigate('/auth')}
                >
                  Inscription
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
