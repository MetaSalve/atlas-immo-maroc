
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useSubscription } from '@/providers/SubscriptionProvider';
import { toast } from "sonner";
import { LoadingFallback } from '@/components/common/LoadingFallback';
import { PageTransition } from '@/components/ui/animations';

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiresAuth?: boolean;
  requiresSubscription?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  element, 
  requiresAuth = true,
  requiresSubscription = false
}) => {
  const { user, loading: authLoading } = useAuth();
  const { tier, loading: subscriptionLoading } = useSubscription();
  const location = useLocation();
  
  const isLoading = authLoading || subscriptionLoading;
  
  if (isLoading) {
    return <LoadingFallback />;
  }

  // Vérifier si l'authentification est requise
  if (requiresAuth && !user) {
    toast.info("Connexion requise", {
      description: "Veuillez vous connecter pour accéder à cette fonctionnalité",
      position: "top-center",
      id: "auth-required",
    });
    
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  // Vérifier si un abonnement premium est requis
  if (requiresSubscription && tier !== 'premium') {
    toast.info("Abonnement requis", {
      description: "Cette fonctionnalité nécessite un abonnement premium",
      position: "top-center",
      id: "subscription-required",
    });
    
    return <Navigate to="/subscription" state={{ from: location.pathname }} replace />;
  }
  
  return <PageTransition>{element}</PageTransition>;
};
