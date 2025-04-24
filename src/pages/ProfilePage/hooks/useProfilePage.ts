
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
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [hasCSRFProtection, setHasCSRFProtection] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastLoginTime, setLastLoginTime] = useState<Date | null>(null);
  
  // Protection pour les tentatives de connexion suspectes
  useEffect(() => {
    const storedAttempts = localStorage.getItem('login_attempts');
    const storedTime = localStorage.getItem('last_login_time');
    
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts));
    }
    
    if (storedTime) {
      setLastLoginTime(new Date(storedTime));
    }
  }, []);
  
  // Génération d'un token CSRF
  useEffect(() => {
    const generateCSRFToken = () => {
      const token = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
      setCsrfToken(token);
      
      // Dans une implémentation réelle, ce token serait stocké dans une session sécurisée côté serveur
      sessionStorage.setItem('csrf_token', token);
    };
    
    generateCSRFToken();
  }, []);

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

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    
    if (!/[A-Z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une majuscule";
    }
    
    if (!/[0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins un chiffre";
    }
    
    return null;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Vérification du token CSRF
    const storedToken = sessionStorage.getItem('csrf_token');
    
    if (hasCSRFProtection && (!csrfToken || csrfToken !== storedToken)) {
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
    
    // Vérification du token CSRF
    const storedToken = sessionStorage.getItem('csrf_token');
    
    if (hasCSRFProtection && (!csrfToken || csrfToken !== storedToken)) {
      toast.error('Erreur de sécurité: token CSRF invalide');
      return;
    }
    
    // Validation des mots de passe
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      setIsUpdating(true);
      
      // Dans une implémentation réelle, il faudrait vérifier l'ancien mot de passe
      // avant de permettre la mise à jour
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast.success('Mot de passe mis à jour avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Régénérer un nouveau token CSRF après une opération sensible
      const newToken = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
      setCsrfToken(newToken);
      sessionStorage.setItem('csrf_token', newToken);
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour du mot de passe', {
        description: error.message
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Fonction pour détecter les tentatives de connexion suspectes
  const trackLoginAttempt = (success: boolean) => {
    const currentAttempts = loginAttempts + (success ? 0 : 1);
    const now = new Date();
    
    setLoginAttempts(currentAttempts);
    setLastLoginTime(now);
    
    localStorage.setItem('login_attempts', currentAttempts.toString());
    localStorage.setItem('last_login_time', now.toISOString());
    
    // Réinitialiser les tentatives après 30 minutes
    if (lastLoginTime) {
      const timeDiffMs = now.getTime() - lastLoginTime.getTime();
      if (timeDiffMs > 30 * 60 * 1000) {
        setLoginAttempts(success ? 0 : 1);
        localStorage.setItem('login_attempts', success ? '0' : '1');
      }
    }
    
    // Si trop de tentatives échouées, bloquer temporairement
    if (currentAttempts >= 5) {
      const remainingTimeMs = lastLoginTime 
        ? Math.max(0, (30 * 60 * 1000) - (now.getTime() - lastLoginTime.getTime())) 
        : 30 * 60 * 1000;
        
      return {
        blocked: true,
        remainingTime: Math.ceil(remainingTimeMs / (60 * 1000))
      };
    }
    
    return { blocked: false };
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
