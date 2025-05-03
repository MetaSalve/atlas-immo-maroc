
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

// Définition des types de rôles
export type UserRole = 'admin' | 'user';

export interface UserRoleInfo {
  roles: UserRole[];
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
  checkHasRole: (role: UserRole) => boolean;
}

// Hook pour récupérer et gérer les rôles de l'utilisateur
export function useUserRole(): UserRoleInfo {
  const { user } = useAuth();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setRoles([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Vérifier si l'utilisateur est administrateur via la fonction RPC
        const { data: isAdmin, error: adminCheckError } = await supabase
          .rpc('check_is_admin', { user_id_input: user.id });
        
        if (adminCheckError) throw adminCheckError;

        const userRoles: UserRole[] = ['user'];
        if (isAdmin) {
          userRoles.push('admin');
        }
        
        setRoles(userRoles);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des rôles utilisateur:', err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        setRoles(['user']); // Par défaut, attribuer le rôle utilisateur
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  const checkHasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  return {
    roles,
    isAdmin: roles.includes('admin'),
    isLoading,
    error,
    checkHasRole,
  };
}
