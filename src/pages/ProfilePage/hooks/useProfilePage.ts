
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProfilePage = () => {
  const { user } = useAuth();
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
    
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
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
    setFullName,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    handleUpdateProfile,
    handleUpdatePassword
  };
};
