import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useAuthValidation } from '@/hooks/useAuthValidation';
import { useLoginAttempts } from '@/hooks/useLoginAttempts';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockExpiryMinutes, setBlockExpiryMinutes] = useState(0);
  const { signInWithEmail, signUp, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { errorMessage, setErrorMessage, validateLogin, validateSignup, validateEmail } = useAuthValidation();
  const { trackLoginAttempt } = useLoginAttempts();
  const { validatePasswordFields } = usePasswordValidation();

  useEffect(() => {
    // Generate CSRF token
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    setCsrfToken(token);
    sessionStorage.setItem('csrf_token', token);
    
    // Check login attempts
    const attempts = parseInt(localStorage.getItem('login_attempts') || '0');
    const lastAttemptTime = localStorage.getItem('last_login_time');
    
    if (attempts >= 5 && lastAttemptTime) {
      const lastTime = new Date(lastAttemptTime);
      const now = new Date();
      const timeDiff = now.getTime() - lastTime.getTime();
      const blockDuration = 30 * 60 * 1000; // 30 minutes
      
      if (timeDiff < blockDuration) {
        setIsBlocked(true);
        setBlockExpiryMinutes(Math.ceil((blockDuration - timeDiff) / (60 * 1000)));
      } else {
        localStorage.setItem('login_attempts', '0');
      }
    }
    
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  }, []);

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (isBlocked) {
      setErrorMessage(`Trop de tentatives de connexion échouées. Veuillez réessayer dans ${blockExpiryMinutes} minutes.`);
      return;
    }
    
    const form = e.target as HTMLFormElement;
    const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
    const password = passwordInput.value;
    
    if (isLogin) {
      if (!validateLogin(email, password)) return;
    } else {
      if (!validateEmail(email)) return;
      if (!validatePasswordFields(password)) return;
    }
    
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUp(email, password);
        toast.success('Compte créé avec succès. Veuillez vérifier votre email pour confirmer votre inscription.');
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      if (isLogin) {
        const blockStatus = trackLoginAttempt(false);
        if (blockStatus.blocked) {
          setIsBlocked(true);
          setBlockExpiryMinutes(blockStatus.remainingTime);
          setErrorMessage(`Trop de tentatives de connexion échouées. Veuillez réessayer dans ${blockStatus.remainingTime} minutes.`);
          return;
        }
      }
      
      if (error.message.includes('Invalid login')) {
        setErrorMessage('Email ou mot de passe incorrect');
      } else if (error.message.includes('already exists')) {
        setErrorMessage('Un compte avec cet email existe déjà');
      } else if (error.message.includes('rate limit')) {
        setErrorMessage('Trop de tentatives de connexion. Veuillez réessayer plus tard.');
      } else {
        setErrorMessage(error.message || 'Une erreur est survenue');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!validateEmail(email)) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Instructions de récupération envoyées', {
        description: 'Vérifiez votre boîte de réception pour réinitialiser votre mot de passe'
      });
      
      setIsRecovery(false);
    } catch (error: any) {
      console.error('Recovery error:', error);
      
      if (error.message.includes('rate limit')) {
        setErrorMessage('Trop de requêtes. Veuillez réessayer plus tard.');
      } else {
        setErrorMessage('Erreur lors de la récupération. Veuillez réessayer ultérieurement.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFormMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage(null);
  };

  const goToRecovery = () => setIsRecovery(true);
  const goToLogin = () => setIsRecovery(false);

  return {
    isLogin,
    isRecovery,
    email,
    setEmail,
    isLoading,
    pageLoading,
    csrfToken,
    isBlocked,
    blockExpiryMinutes,
    errorMessage,
    handleSubmit,
    handleRecoverySubmit,
    toggleFormMode,
    goToRecovery,
    goToLogin,
    authLoading,
    user
  };
};
