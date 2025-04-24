
import { Shield } from 'lucide-react';

export const SecurityFooter = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <Shield className="h-4 w-4 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">Connexion sécurisée SSL</span>
    </div>
  );
};
