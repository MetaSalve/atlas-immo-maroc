
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, KeyRound, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
  csrfToken: string;
  isBlocked: boolean;
  blockExpiryMinutes: number;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onForgotPassword: () => void;
}

export const LoginForm = ({
  email,
  setEmail,
  isLoading,
  errorMessage,
  csrfToken,
  isBlocked,
  blockExpiryMinutes,
  onSubmit,
  onForgotPassword,
}: LoginFormProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { clearErrors } = usePasswordValidation();

  // Clear errors when component unmounts
  useEffect(() => {
    return () => clearErrors();
  }, []);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" name="csrf_token" value={csrfToken} />
      <input type="hidden" name="password" value={password} />
      
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
      
      {isBlocked && (
        <Alert variant="destructive">
          <AlertDescription>
            <div className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <div>
                <p className="font-medium">Accès temporairement bloqué</p>
                <p>
                  Suite à plusieurs tentatives échouées, l'accès est bloqué pour {blockExpiryMinutes} minutes. 
                  Veuillez réessayer ultérieurement.
                </p>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

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
            disabled={isLoading || isBlocked}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium">Mot de passe</label>
          <Button 
            variant="link" 
            className="text-xs p-0 h-auto font-normal"
            type="button"
            onClick={onForgotPassword}
            disabled={isBlocked}
          >
            Mot de passe oublié?
          </Button>
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
            disabled={isLoading || isBlocked}
            autoComplete="current-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isBlocked}
          >
            {showPassword ? 
              <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
              <Eye className="h-4 w-4 text-muted-foreground" />
            }
          </Button>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || isBlocked}
      >
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connexion...</>
        ) : (
          'Se connecter'
        )}
      </Button>
    </form>
  );
};
