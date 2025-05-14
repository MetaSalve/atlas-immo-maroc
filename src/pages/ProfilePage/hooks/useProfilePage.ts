
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCSRFToken } from '@/hooks/useCSRFToken';
import { useLoginAttempts } from '@/hooks/useLoginAttempts';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';

export const useProfilePage = () => {
  const { user } = useAuth();
  const { csrfToken, hasCSRFProtection, validateCSRFToken, regenerateToken } = useCSRFToken();
  const { trackLoginAttempt } = useLoginAttempts();
  const { validatePassword } = usePasswordValidation();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
    setIsLoading(false);
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setFullName(data.full_name || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Erreur lors du chargement du profil');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!validateCSRFToken(csrfToken)) {
      toast.error('Erreur de sécurité: token CSRF invalide');
      return;
    }
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: fullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast.success('Profil mis à jour avec succès');
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour du profil', {
        description: error.message
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCSRFToken(csrfToken)) {
      toast.error('Erreur de sécurité: token CSRF invalide');
      return;
    }
    
    // Fix: validatePassword now returns ValidationResult directly
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.error || 'Mot de passe invalide');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success('Mot de passe mis à jour avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      regenerateToken();
      
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour du mot de passe', {
        description: error.message
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isLoading,
    isUpdating,
    fullName,
    email,
    currentPassword,
    newPassword,
    confirmPassword,
    csrfToken,
    hasCSRFProtection,
    setFullName,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    handleUpdateProfile,
    handleUpdatePassword,
    trackLoginAttempt
  };
};
