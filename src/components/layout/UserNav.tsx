
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, User, Heart, Bell, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { useSubscription } from '@/providers/SubscriptionProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserNav = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { maxFavorites, allowedAlerts } = useSubscription();
  
  if (!user) {
    return (
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
        <Button 
          variant="default" 
          size="sm"
          className="bg-skyblue text-white font-bold hover:bg-royalblue hidden md:flex"
          onClick={() => navigate('/auth')}
        >
          Inscription
        </Button>
      </>
    );
  }

  return (
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
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="h-4 w-4 mr-2" /> Profil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/favorites')}>
          <Heart className="h-4 w-4 mr-2" /> Favoris ({maxFavorites})
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/alerts')}>
          <Bell className="h-4 w-4 mr-2" /> Alertes ({allowedAlerts})
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/subscription')}>
          <CreditCard className="h-4 w-4 mr-2" /> Abonnement
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
          <LogOut className="h-4 w-4 mr-2" /> Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
