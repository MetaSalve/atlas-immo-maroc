
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { addDays } from 'date-fns';
import { useSubscription } from '@/providers/SubscriptionProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FreeTrialCard } from './subscription/FreeTrialCard';
import { PremiumSubscriptionCard } from './subscription/PremiumSubscriptionCard';

export const SubscriptionTab = () => {
  const { tier, maxFavorites, allowedAlerts, trialEndsAt } = useSubscription();
  const navigate = useNavigate();
  
  const isPremium = tier === 'premium';
  const isFree = tier === 'free';
  
  const trialDays = 15;
  const today = new Date();
  const trialEndDate = trialEndsAt ? new Date(trialEndsAt) : addDays(today, trialDays);
  const daysRemaining = Math.max(0, Math.ceil((trialEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const trialProgress = Math.min(100, ((trialDays - daysRemaining) / trialDays) * 100);

  const handleUpgradeSubscription = () => {
    navigate('/subscription');
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        method: 'POST'
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error redirecting to customer portal:', error);
      toast.error("Une erreur est survenue lors de l'accès au portail de paiement");
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        method: 'POST'
      });

      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error redirecting to customer portal:', error);
      toast.error("Une erreur est survenue lors de l'annulation de l'abonnement");
    }
  };

  const subscriptionData = {
    renewalDate: isPremium ? addDays(today, 30) : null,
  };

  if (isFree) {
    return (
      <FreeTrialCard
        daysRemaining={daysRemaining}
        trialProgress={trialProgress}
        trialEndDate={trialEndDate}
        maxFavorites={maxFavorites}
        allowedAlerts={allowedAlerts}
        onUpgrade={handleUpgradeSubscription}
      />
    );
  }

  return (
    <PremiumSubscriptionCard
      renewalDate={subscriptionData.renewalDate!}
      onManagePayment={handleManageSubscription}
      onCancelSubscription={handleCancelSubscription}
    />
  );
};
