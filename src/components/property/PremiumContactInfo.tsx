import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Lock } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

interface PremiumContactInfoProps {
  hasContactInfo: boolean;
  showPhone?: boolean;
  showEmail?: boolean;
}

export const PremiumContactInfo: React.FC<PremiumContactInfoProps> = ({ 
  hasContactInfo, 
  showPhone = true, 
  showEmail = true 
}) => {
  const { session } = useAuth();

  if (hasContactInfo) {
    return null; // Contact info is available, don't show upgrade message
  }

  if (!session) {
    return (
      <div className="bg-muted/30 border border-muted rounded-lg p-4 mt-3">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Lock className="h-4 w-4" />
          <span className="text-sm font-medium">Connexion requise</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Connectez-vous pour accéder aux informations de contact des propriétaires.
        </p>
        <Link 
          to="/auth"
          className="text-sm text-primary hover:text-primary/80 font-medium"
        >
          Se connecter →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-4 mt-3">
      <div className="flex items-center gap-2 text-primary mb-2">
        <CreditCard className="h-4 w-4" />
        <span className="text-sm font-medium">Abonnement Premium requis</span>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Accédez aux informations de contact des propriétaires avec un abonnement Premium.
      </p>
      <div className="flex flex-col gap-1 text-xs text-muted-foreground mb-3">
        <span>• Informations de contact complètes</span>
        <span>• Alertes illimitées</span>
        <span>• Accès prioritaire aux nouvelles annonces</span>
      </div>
      <Link 
        to="/subscription"
        className="text-sm text-primary hover:text-primary/80 font-medium"
      >
        Passer à Premium →
      </Link>
    </div>
  );
};