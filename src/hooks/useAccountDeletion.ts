
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useAccountDeletion = () => {
  const { user, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  
  const deleteAccount = async (reason?: string, password?: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour supprimer votre compte');
      return false;
    }
    
    if (!password) {
      toast.error('Le mot de passe est requis pour confirmer la suppression');
      return false;
    }
    
    try {
      setIsDeleting(true);
      
      // Vérifier le mot de passe avant de continuer
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || '',
        password
      });
      
      if (signInError) {
        toast.error('Mot de passe incorrect');
        return false;
      }
      
      // Enregistrer la raison de suppression si fournie
      if (reason) {
        const { error: reasonError } = await supabase
          .from('account_deletions')
          .insert({
            user_id: user.id,
            reason
          });
          
        if (reasonError) console.error('Erreur lors de l\'enregistrement de la raison de suppression:', reasonError);
      }
      
      // Supprimer les données utilisateur dans l'ordre pour respecter les contraintes FK
      const tables = [
        'favorites',
        'user_alerts',
        'notifications',
        'payment_transactions',
        'profiles'
      ];
      
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq('user_id', user.id);
          
        if (error) console.error(`Erreur lors de la suppression des données de ${table}:`, error);
      }
      
      // Supprimer le compte utilisateur
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (deleteError) {
        throw deleteError;
      }
      
      // Se déconnecter
      await signOut();
      
      toast.success('Votre compte a été supprimé avec succès');
      navigate('/');
      return true;
      
    } catch (error: any) {
      console.error('Erreur lors de la suppression du compte:', error);
      toast.error('Erreur lors de la suppression du compte');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };
  
  return {
    deleteAccount,
    isDeleting
  };
};
