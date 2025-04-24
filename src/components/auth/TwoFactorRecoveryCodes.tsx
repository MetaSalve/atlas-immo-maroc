
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TwoFactorRecoveryCodesProps {
  recoveryCodes: string[];
  onComplete: () => void;
}

export const TwoFactorRecoveryCodes = ({ recoveryCodes, onComplete }: TwoFactorRecoveryCodesProps) => {
  const downloadRecoveryCodes = () => {
    if (recoveryCodes.length === 0) return;
    
    const codesText = recoveryCodes.join('\n');
    const blob = new Blob([codesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alertimmo-recovery-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Codes de récupération</CardTitle>
        <CardDescription>
          Conservez ces codes de récupération dans un endroit sûr. 
          Ils vous permettront de vous connecter si vous perdez l'accès à votre application d'authentification.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertDescription>
            <strong>Important: </strong> 
            Ces codes ne seront affichés qu'une seule fois. Conservez-les en lieu sûr.
          </AlertDescription>
        </Alert>
        
        <div className="p-4 bg-gray-50 rounded-md font-mono text-sm">
          {recoveryCodes.map((code, index) => (
            <div key={index} className="py-1">{code}</div>
          ))}
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button onClick={downloadRecoveryCodes} variant="outline">
            Télécharger les codes
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onComplete} className="w-full">
          J'ai sauvegardé mes codes de récupération
        </Button>
      </CardFooter>
    </Card>
  );
};
