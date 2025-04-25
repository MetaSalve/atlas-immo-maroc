
import { useSubscription } from '@/providers/SubscriptionProvider';
import { differenceInDays, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, CheckCircle } from 'lucide-react';

export const SubscriptionStatus = () => {
  const { tier, trialEndsAt } = useSubscription();
  const navigate = useNavigate();
  
  const isPremium = tier === 'premium';
  const isFree = tier === 'free';
  
  // Calculate days remaining in trial or subscription
  const getStatusInfo = () => {
    if (!trialEndsAt && isFree) {
      return {
        badge: 'Gratuit',
        message: 'Compte standard',
        variant: 'outline' as const,
        daysRemaining: null,
        showUpgrade: true
      };
    }
    
    if (isPremium) {
      const subscriptionEnd = new Date(trialEndsAt || new Date());
      const daysRemaining = differenceInDays(subscriptionEnd, new Date());
      return {
        badge: 'Premium',
        message: `Renouvellement le ${format(subscriptionEnd, 'dd MMMM yyyy', { locale: fr })}`,
        variant: 'default' as const,
        daysRemaining,
        showUpgrade: false
      };
    }
    
    if (trialEndsAt) {
      const trialEnd = new Date(trialEndsAt);
      const daysRemaining = differenceInDays(trialEnd, new Date());
      
      if (daysRemaining <= 0) {
        return {
          badge: 'Essai expiré',
          message: 'Votre période d\'essai est terminée',
          variant: 'destructive' as const,
          daysRemaining: 0,
          showUpgrade: true
        };
      }
      
      return {
        badge: 'Essai gratuit',
        message: `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}`,
        variant: 'secondary' as const,
        daysRemaining,
        showUpgrade: true
      };
    }
    
    return {
      badge: 'Gratuit',
      message: 'Compte standard',
      variant: 'outline' as const,
      daysRemaining: null,
      showUpgrade: true
    };
  };
  
  const { badge, message, variant, showUpgrade } = getStatusInfo();
  
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Badge variant={variant} className="flex items-center gap-1">
        {isPremium && <CheckCircle className="h-3 w-3" />}
        {badge}
      </Badge>
      
      <span className="text-sm text-muted-foreground">{message}</span>
      
      {showUpgrade && (
        <Button 
          size="sm" 
          variant="outline"
          className="ml-auto"
          onClick={() => navigate('/subscription')}
        >
          <CreditCard className="h-4 w-4 mr-1" />
          Passer à Premium
        </Button>
      )}
    </div>
  );
};
