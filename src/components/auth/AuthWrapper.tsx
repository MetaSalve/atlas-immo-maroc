
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { LoadingFallback } from '@/components/common/LoadingFallback';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Rediriger vers la page d'accueil si on arrive sur /auth alors qu'on est déjà connecté
  React.useEffect(() => {
    if (user && window.location.pathname === '/auth') {
      navigate('/');
    }
  }, [user, navigate]);

  if (loading) {
    return <LoadingFallback />;
  }

  return <>{children}</>;
};
