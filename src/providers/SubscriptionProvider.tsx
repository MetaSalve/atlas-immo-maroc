
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'free' | 'premium';

interface SubscriptionContextType {
  tier: SubscriptionTier;
  loading: boolean;
  allowedAlerts: number;
  maxFavorites: number;
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

  // Define access limits based on subscription tier
  const allowedAlerts = tier === 'premium' ? Infinity : 3;
  const maxFavorites = tier === 'premium' ? Infinity : 10;

  // Check if the user has a premium subscription
  const checkSubscriptionStatus = async () => {
    if (!user) {
      setTier('free');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      
      // Ensure the subscription_tier is cast as SubscriptionTier type
      const userTier = (data?.subscription_tier || 'free') as SubscriptionTier;
      setTier(userTier);
    } catch (error) {
      console.error('Error checking subscription status:', error);
      // Default to free tier if there's an error
      setTier('free');
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
      isFeatureEnabled,
      checkFeatureAccess
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

