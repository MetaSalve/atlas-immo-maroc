
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
        await supabase
          .from('account_deletions')
          .insert({
            user_id: user.id,
            reason
          });
      }
      
      // Supprimer les données utilisateur dans l'ordre
      await supabase.from('favorites').delete().eq('user_id', user.id);
      await supabase.from('user_alerts').delete().eq('user_id', user.id);
      await supabase.from('notifications').delete().eq('user_id', user.id);
      await supabase.from('payment_transactions').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);
      
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
