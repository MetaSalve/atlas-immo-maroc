
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from "sonner";
import { LoadingFallback } from '@/components/common/LoadingFallback';
import { PageTransition } from '@/components/ui/animations';
import { useTranslation } from '@/i18n';

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
  const { t } = useTranslation();
  
  if (loading) {
    return <LoadingFallback />;
  }

  // Only check authentication for protected routes
  if (requiresAuth && !user) {
    toast.info(t('auth.loginRequired'), {
      description: t('auth.loginRequiredDescription'),
      position: "top-center",
      id: "auth-required",
    });
    
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  return <PageTransition>{element}</PageTransition>;
};
