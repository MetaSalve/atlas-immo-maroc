
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, KeyRound, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';
import { usePasswordValidation } from '@/hooks/usePasswordValidation';

interface SignupFormProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
  csrfToken: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const SignupForm = ({
  email,
  setEmail,
  isLoading,
  errorMessage,
  csrfToken,
  onSubmit,
}: SignupFormProps) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { passwordErrors, validatePasswordFields, clearErrors } = usePasswordValidation();

  // Clear errors when component unmounts
  useEffect(() => {
    return () => clearErrors();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password before submitting
    const isPasswordValid = validatePasswordFields(password, confirmPassword);
    if (!isPasswordValid) {
      return;
    }
    
    // Continue with form submission
    onSubmit(e);
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
            disabled={isLoading}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="signup-password" className="text-sm font-medium">Mot de passe</label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="signup-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10"
            required
            disabled={isLoading}
            autoComplete="new-password"
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
            disabled={isLoading}
            autoComplete="new-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
        disabled={isLoading}
      >
        {isLoading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Inscription...</>
        ) : (
          "S'inscrire"
        )}
      </Button>
    </form>
  );
};
