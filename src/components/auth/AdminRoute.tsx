
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from "sonner";
import { LoadingFallback } from '@/components/common/LoadingFallback';
import { PageTransition } from '@/components/ui/animations';

interface AdminRouteProps {
  element: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ element }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const location = useLocation();
  
  const isLoading = authLoading || roleLoading;
  
  if (isLoading) {
    return <LoadingFallback />;
  }

  // Vérifier si l'utilisateur est connecté et a le rôle administrateur
  if (!user || !isAdmin) {
    toast.error("Accès non autorisé", {
      description: "Vous n'avez pas les autorisations nécessaires pour accéder à cette section",
      position: "top-center",
      id: "admin-required",
    });
    
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }
  
  return <PageTransition>{element}</PageTransition>;
};
