
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from "sonner";
import { LoadingFallback } from '@/components/common/LoadingFallback';
import { PageTransition } from '@/components/ui/animations';

interface ProtectedRouteProps {
  element: React.ReactNode;
  requiresAuth?: boolean;
}

export const ProtectedRoute = ({ 
  element, 
  requiresAuth = true 
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <LoadingFallback />;
  }
  
  if (requiresAuth && !user) {
    toast.info("Connexion requise", {
      description: "Veuillez vous connecter pour accéder à cette fonctionnalité",
      position: "top-center",
    });
    
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }
  
  if (!requiresAuth && user) {
    return <Navigate to="/" replace />;
  }
  
  return <PageTransition>{element}</PageTransition>;
};
