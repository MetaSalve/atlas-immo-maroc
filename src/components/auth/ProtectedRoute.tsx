
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from "sonner";
import { LoadingFallback } from '@/components/common/LoadingFallback';
import { PageTransition } from '@/components/ui/animations';

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiresAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  element, 
  requiresAuth = true 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  // Éviter d'afficher un toast si l'utilisateur est déjà sur la page d'authentification
  if (requiresAuth && !user) {
    // Afficher le toast uniquement si on n'est pas déjà sur la page d'authentification
    if (!location.pathname.includes('/auth')) {
      toast.info("Connexion requise", {
        description: "Veuillez vous connecter pour accéder à cette fonctionnalité",
        position: "top-center",
        // Limiter les notifications répétées
        id: "auth-required",
      });
    }
    
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  if (!requiresAuth && user) {
    return <Navigate to="/" replace />;
  }
  
  return <PageTransition>{element}</PageTransition>;
};
