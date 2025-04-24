
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import * as QRCodeReact from 'qrcode.react';

interface TwoFactorQRSetupProps {
  totpUri: string | null;
  totpSecret: string | null;
  verificationCode: string;
  onVerificationCodeChange: (code: string) => void;
  onVerify: () => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const TwoFactorQRSetup = ({
  totpUri,
  totpSecret,
  verificationCode,
  onVerificationCodeChange,
  onVerify,
  onCancel,
  isLoading
}: TwoFactorQRSetupProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configuration de l'authentification à deux facteurs</CardTitle>
        <CardDescription>
          Scannez le code QR avec votre application d'authentification 
          (Google Authenticator, Microsoft Authenticator, etc.)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center py-4">
          {totpUri && (
            <QRCodeReact.QRCodeCanvas value={totpUri} size={200} />
          )}
        </div>
        
        {totpSecret && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Code secret (si vous ne pouvez pas scanner le QR)</p>
            <div className="p-2 bg-gray-50 rounded-md font-mono text-sm break-all">
              {totpSecret}
            </div>
          </div>
        )}
        
        <div className="mt-6 space-y-2">
          <label htmlFor="verificationCode" className="text-sm font-medium">
            Code de vérification
          </label>
          <Input
            id="verificationCode"
            value={verificationCode}
            onChange={(e) => onVerificationCodeChange(e.target.value)}
            maxLength={6}
            placeholder="123456"
            className="font-mono text-center tracking-wide"
          />
          <p className="text-xs text-muted-foreground">
            Entrez le code généré par votre application d'authentification
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button onClick={onVerify} disabled={isLoading || verificationCode.length !== 6}>
          {isLoading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Vérification...</>
          ) : (
            'Activer le 2FA'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
