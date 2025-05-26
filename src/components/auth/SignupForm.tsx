
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, KeyRound, Eye, EyeOff, Loader2, AlertTriangle } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            minLength={8}
            autoComplete="new-password"
            pattern="^(?=.*[A-Z])(?=.*[0-9]).{8,}$"
            title="Le mot de passe doit contenir au moins 8 caractères, dont une majuscule et un chiffre"
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
        <p className="text-xs text-muted-foreground">
          Minimum 8 caractères, avec au moins une majuscule et un chiffre
        </p>
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
