import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'free' | 'premium';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  loading: boolean;
  allowedAlerts: number;
  maxFavorites: number;
  trialEndsAt: string | null;
  isFeatureEnabled: (feature: 'unlimited_alerts' | 'advanced_filters' | 'unlimited_favorites' | 'email_notifications' | 'property_comparisons') => boolean;
  checkFeatureAccess: (feature: string) => { allowed: boolean; message?: string };
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [loading, setLoading] = useState(true);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);

  // Define access limits based on subscription tier
  const allowedAlerts = tier === 'premium' ? Infinity : 3;
  const maxFavorites = tier === 'premium' ? Infinity : 10;

  // Check if the user has a premium subscription and set trial end date
  const checkSubscriptionStatus = async () => {
    if (!user) {
      setTier('free');
      setTrialEndsAt(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier, created_at')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      const userTier = ((data as any)?.subscription_tier || 'free') as SubscriptionTier;
      setTier(userTier);
      
      if (userTier === 'free') {
        // Set trial end date to 15 days after account creation
        const createdAt = new Date(data.created_at);
        const trialEnd = new Date(createdAt.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days
        setTrialEndsAt(trialEnd.toISOString());
      } else {
        setTrialEndsAt(null);
      }
    } catch (error) {
      console.error('Error checking subscription status:', error);
      setTier('free');
      setTrialEndsAt(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSubscriptionStatus();
  }, [user]);

  // Determine if a specific feature is enabled for the current subscription tier
  const isFeatureEnabled = (feature: 'unlimited_alerts' | 'advanced_filters' | 'unlimited_favorites' | 'email_notifications' | 'property_comparisons') => {
    if (tier === 'premium') return true;
    
    // Free tier feature limitations
    switch (feature) {
      case 'unlimited_alerts':
        return false;
      case 'advanced_filters':
        return false;
      case 'unlimited_favorites':
        return false;
      case 'email_notifications':
        return false;
      case 'property_comparisons':
        return false;
      default:
        return false;
    }
  };

  // Check if the user has access to a feature and return a message if not
  const checkFeatureAccess = (feature: string) => {
    if (tier === 'premium') return { allowed: true };

    switch (feature) {
      case 'unlimited_alerts':
        return {
          allowed: false,
          message: `Les utilisateurs gratuits sont limités à ${allowedAlerts} alertes. Passez à l'abonnement Premium pour des alertes illimitées.`
        };
      case 'advanced_filters':
        return {
          allowed: false,
          message: 'Les filtres avancés sont réservés aux abonnés Premium.'
        };
      case 'unlimited_favorites':
        return {
          allowed: maxFavorites > 0,
          message: `Les utilisateurs gratuits sont limités à ${maxFavorites} favoris. Passez à l'abonnement Premium pour des favoris illimités.`
        };
      case 'email_notifications':
        return {
          allowed: false,
          message: 'Les notifications par email sont réservées aux abonnés Premium.'
        };
      case 'property_comparisons':
        return {
          allowed: false,
          message: 'La comparaison de biens est réservée aux abonnés Premium.'
        };
      default:
        return { allowed: true };
    }
  };

  return (
    <SubscriptionContext.Provider value={{ 
      tier, 
      loading,
      allowedAlerts,
      maxFavorites,
      trialEndsAt,
      isFeatureEnabled,
      checkFeatureAccess 
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
