
import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Shield, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isRecovery, setIsRecovery] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithEmail, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (user) {
    navigate('/');
    return null;
  }

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    // Validation des entrées
    if (!validateEmail(email)) {
      setErrorMessage("L'adresse email n'est pas valide");
      return;
    }
    
    if (!validatePassword(password)) {
      setErrorMessage("Le mot de passe doit contenir au moins 8 caractères");
      return;
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
      
      // Messages d'erreur personnalisés
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
    
    if (!validateEmail(email)) {
      setErrorMessage("Veuillez saisir une adresse email valide");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success('Instructions de récupération envoyées', {
        description: 'Vérifiez votre boîte de réception pour réinitialiser votre mot de passe'
      });
      
      // Retourner à la page de connexion
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

  if (isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <Card className="w-full max-w-md p-6 space-y-6 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              Récupération de mot de passe
            </CardTitle>
            <CardDescription>
              Saisissez votre adresse email pour recevoir un lien de réinitialisation
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleRecoverySubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="recovery-email" className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="recovery-email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours...</>
                ) : (
                  'Envoyer les instructions'
                )}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="text-center">
            <Button 
              variant="link" 
              onClick={() => setIsRecovery(false)}
              className="mx-auto"
            >
              Retour à la connexion
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <Card className="w-full max-w-md p-6 space-y-6 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            {isLogin ? 'Connexion' : 'Créer un compte'}
          </CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Connectez-vous pour accéder à votre compte' 
              : 'Inscription pour accéder à tous les services'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {errorMessage && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
                {isLogin && (
                  <Button 
                    variant="link" 
                    className="text-xs p-0 h-auto font-normal"
                    type="button"
                    onClick={() => setIsRecovery(true)}
                  >
                    Mot de passe oublié?
                  </Button>
                )}
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                  minLength={8}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  }
                </Button>
              </div>
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  Minimum 8 caractères
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isLogin ? 'Connexion...' : 'Inscription...'}</>
              ) : (
                isLogin ? 'Se connecter' : "S'inscrire"
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 text-center">
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
            >
              {isLogin ? "S'inscrire" : 'Se connecter'}
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Connexion sécurisée SSL</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthPage;
