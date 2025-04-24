import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { RecoveryForm } from '@/components/auth/RecoveryForm';
import { SecurityFooter } from '@/components/auth/SecurityFooter';
import { useAuthValidation } from '@/hooks/useAuthValidation';
import { supabase } from '@/integrations/supabase/client';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockExpiryMinutes, setBlockExpiryMinutes] = useState(0);
  const { signInWithEmail, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { errorMessage, setErrorMessage, validateLogin, validateSignup, validateEmail } = useAuthValidation();

  useEffect(() => {
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
    setCsrfToken(token);
    sessionStorage.setItem('csrf_token', token);
    
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
  }, []);

  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (isBlocked) {
      setErrorMessage(`Trop de tentatives de connexion échouées. Veuillez réessayer dans ${blockExpiryMinutes} minutes.`);
      return;
    }
    
    const form = e.target as HTMLFormElement;
    const passwordInput = form.querySelector('input[type="password"]') as HTMLInputElement;
    const password = passwordInput.value;
    
    if (isLogin) {
      if (!validateLogin(email, password)) return;
    } else {
      if (!validateSignup(email, password)) return;
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <Card className="w-full max-w-md p-6 space-y-6 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {isRecovery ? 'Récupération de mot de passe' : (isLogin ? 'Connexion' : 'Créer un compte')}
          </CardTitle>
          <CardDescription>
            {isRecovery 
              ? 'Saisissez votre adresse email pour recevoir un lien de réinitialisation'
              : (isLogin 
                ? 'Connectez-vous pour accéder à votre compte' 
                : 'Inscription pour accéder à tous les services')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isRecovery ? (
            <RecoveryForm
              email={email}
              setEmail={setEmail}
              isLoading={isLoading}
              errorMessage={errorMessage}
              csrfToken={csrfToken}
              onSubmit={handleRecoverySubmit}
            />
          ) : isLogin ? (
            <LoginForm
              email={email}
              setEmail={setEmail}
              isLoading={isLoading}
              errorMessage={errorMessage}
              csrfToken={csrfToken}
              isBlocked={isBlocked}
              blockExpiryMinutes={blockExpiryMinutes}
              onSubmit={handleSubmit}
              onForgotPassword={() => setIsRecovery(true)}
            />
          ) : (
            <SignupForm
              email={email}
              setEmail={setEmail}
              isLoading={isLoading}
              errorMessage={errorMessage}
              csrfToken={csrfToken}
              onSubmit={handleSubmit}
            />
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 text-center">
          {!isRecovery && (
            <div className="text-sm text-muted-foreground">
              {isLogin ? 'Pas encore de compte?' : 'Vous avez déjà un compte?'}
              {' '}
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrorMessage(null);
                }}
                disabled={isBlocked}
              >
                {isLogin ? "S'inscrire" : 'Se connecter'}
              </Button>
            </div>
          )}
          
          {isRecovery && (
            <Button 
              variant="link" 
              className="mx-auto"
              onClick={() => setIsRecovery(false)}
            >
              Retour à la connexion
            </Button>
          )}
          
          <SecurityFooter />
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
