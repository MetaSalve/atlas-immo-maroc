
import { useAuthPage } from '@/hooks/useAuthPage';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';
import { RecoveryForm } from '@/components/auth/RecoveryForm';
import { SecurityFooter } from '@/components/auth/SecurityFooter';
import { AuthLoading } from '@/components/auth/AuthLoading';

const AuthPage = () => {
  const {
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
  } = useAuthPage();

  if (pageLoading || authLoading) {
    return <AuthLoading />;
  }

  if (user) {
    return null; // This will redirect in the hook
  }

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
              onForgotPassword={goToRecovery}
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
                onClick={toggleFormMode}
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
              onClick={goToLogin}
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
