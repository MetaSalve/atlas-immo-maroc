
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, KeyRound, Eye, EyeOff, Loader2, AlertTriangle, Shield } from 'lucide-react';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';

interface SignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
  csrfToken: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  password?: string;
  setPassword?: (password: string) => void;
  confirmPassword?: string;
  setConfirmPassword?: (confirmPassword: string) => void;
}

export const SignupForm = ({
  email,
  setEmail,
  isLoading,
  errorMessage,
  csrfToken,
  onSubmit,
  password: propPassword,
  setPassword: propSetPassword,
  confirmPassword: propConfirmPassword,
  setConfirmPassword: propSetConfirmPassword,
}: SignupFormProps) => {
  const [localPassword, setLocalPassword] = useState('');
  const [localConfirmPassword, setLocalConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCheckingPassword, setIsCheckingPassword] = useState(false);
  const { passwordErrors, validatePasswordFields, clearErrors } = usePasswordValidation();
  
  // Utiliser soit les props ou l'état local
  const password = propPassword !== undefined ? propPassword : localPassword;
  const setPassword = propSetPassword || setLocalPassword;
  const confirmPassword = propConfirmPassword !== undefined ? propConfirmPassword : localConfirmPassword;
  const setConfirmPassword = propSetConfirmPassword || setLocalConfirmPassword;
  
  // Clear errors when component unmounts
  useEffect(() => {
    return () => clearErrors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCheckingPassword(true);
    
    try {
      // Validate password before submitting
      const isPasswordValid = await validatePasswordFields(password, confirmPassword);
      
      if (!isPasswordValid) {
        setIsCheckingPassword(false);
        return;
      }
      
      // Continue with form submission
      await onSubmit(e);
    } catch (error) {
      console.error("Error validating password:", error);
    } finally {
      setIsCheckingPassword(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="csrf_token" value={csrfToken} />
      
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription className="flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" />
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <label htmlFor="signup-email" className="text-sm font-medium">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-email"
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
            disabled={isLoading || isCheckingPassword}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-password" className="text-sm font-medium">Mot de passe</label>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            required
            disabled={isLoading || isCheckingPassword}
            autoComplete="new-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading || isCheckingPassword}
          >
            {showPassword ? 
              <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
              <Eye className="h-4 w-4 text-muted-foreground" />
            }
          </Button>
        </div>
        {passwordErrors.main && (
          <p className="text-xs text-destructive">{passwordErrors.main}</p>
        )}
        {!passwordErrors.main && (
          <p className="text-xs text-muted-foreground">
            Minimum 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-confirm-password" className="text-sm font-medium">Confirmer le mot de passe</label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-confirm-password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 pr-10"
            required
            disabled={isLoading || isCheckingPassword}
            autoComplete="new-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading || isCheckingPassword}
          >
            {showConfirmPassword ? 
              <EyeOff className="h-4 w-4 text-muted-foreground" /> : 
              <Eye className="h-4 w-4 text-muted-foreground" />
            }
          </Button>
        </div>
        {passwordErrors.confirmation && (
          <p className="text-xs text-destructive">{passwordErrors.confirmation}</p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || isCheckingPassword}
      >
        {isLoading || isCheckingPassword ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isCheckingPassword ? "Vérification..." : "Inscription..."}</>
        ) : (
          "S'inscrire"
        )}
      </Button>
    </form>
  );
};
