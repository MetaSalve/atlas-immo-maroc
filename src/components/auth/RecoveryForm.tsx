
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Loader2, AlertTriangle } from 'lucide-react';

interface RecoveryFormProps {
  email: string;
  setEmail: (email: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
  csrfToken: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const RecoveryForm = ({
  email,
  setEmail,
  isLoading,
  errorMessage,
  csrfToken,
  onSubmit,
}: RecoveryFormProps) => {
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
  );
};
