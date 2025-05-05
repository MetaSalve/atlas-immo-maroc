
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { passwordErrors, validatePasswordFields, clearErrors } = usePasswordValidation();

  // Clear errors when component unmounts
  useEffect(() => {
    return () => clearErrors();
  }, []);

  // Vérifier si le token est présent dans l'URL
  useEffect(() => {
    const checkToken = async () => {
      try {
        const hash = location.hash;
        
        // Si l'URL contient un access_token (flow de réinitialisation)
        if (hash && hash.includes('access_token=')) {
          setTokenValid(true);
          toast.info('Vous pouvez maintenant définir votre nouveau mot de passe');
        } else {
          // Si l'utilisateur arrive directement sans token, vérifier la session
          const { data } = await supabase.auth.getSession();
          if (data.session && data.session.access_token) {
            setTokenValid(true);
          } else {
            setTokenValid(false);
            toast.error('Lien de réinitialisation invalide ou expiré');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du token:', error);
        setTokenValid(false);
        toast.error('Erreur lors de la vérification du lien');
      } finally {
        setTokenChecked(true);
      }
    };
    
    checkToken();
  }, [location]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation using our custom hook
    const isValid = validatePasswordFields(password, confirmPassword);
    if (!isValid) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Mise à jour du mot de passe via AuthProvider
      await updatePassword(password);
      
      toast.success('Mot de passe modifié avec succès');
      navigate('/auth');
    } catch (error: any) {
      toast.error('Erreur lors de la réinitialisation', {
        description: error.message || 'Veuillez réessayer ou contacter le support'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Afficher un loader pendant la vérification du token
  if (!tokenChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <Card className="w-full max-w-md p-6 shadow-lg text-center">
          <CardContent className="py-10">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
            <p>Vérification du lien de réinitialisation...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <Card className="w-full max-w-md p-6 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Lien invalide</CardTitle>
            <CardDescription>
              Ce lien de réinitialisation est invalide ou a expiré
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                Pour des raisons de sécurité, les liens de réinitialisation sont valables uniquement pour une durée limitée.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-center pt-4">
            <Button onClick={() => navigate('/auth')}>
              Retour à la page de connexion
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Définition du mot de passe</CardTitle>
          <CardDescription>
            Choisissez un nouveau mot de passe sécurisé pour votre compte
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Nouveau mot de passe</label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="border-input"
                autoComplete="new-password"
              />
              {passwordErrors.main && (
                <p className="text-xs text-destructive">{passwordErrors.main}</p>
              )}
              {!passwordErrors.main && (
                <p className="text-xs text-muted-foreground">
                  Minimum 8 caractères, avec au moins une majuscule et un chiffre
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">Confirmer le mot de passe</label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="border-input"
                autoComplete="new-password"
              />
              {passwordErrors.confirmation && (
                <p className="text-xs text-destructive">{passwordErrors.confirmation}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Modification en cours...</>
              ) : (
                'Définir le nouveau mot de passe'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
