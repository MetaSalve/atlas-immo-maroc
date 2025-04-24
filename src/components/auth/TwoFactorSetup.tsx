
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';
import { TwoFactorQRSetup } from './TwoFactorQRSetup';
import { TwoFactorRecoveryCodes } from './TwoFactorRecoveryCodes';
import { useTwoFactorAuth } from '@/hooks/useTwoFactorAuth';

interface TwoFactorSetupProps {
  onComplete?: () => void;
}

export const TwoFactorSetup = ({ onComplete }: TwoFactorSetupProps) => {
  const {
    isEnabled,
    isLoading,
    showQR,
    totpSecret,
    totpUri,
    verificationCode,
    setVerificationCode,
    recoveryCodes,
    showRecoveryCodes,
    fetchTwoFactorStatus,
    generateTOTPSecret,
    verifyTOTP,
    disableTwoFactor,
    setShowQR,
    setShowRecoveryCodes
  } = useTwoFactorAuth();

  useEffect(() => {
    fetchTwoFactorStatus();
  }, []);

  const handleToggle = () => {
    if (isEnabled) {
      disableTwoFactor();
    } else {
      generateTOTPSecret();
    }
  };

  const finishSetup = () => {
    setShowQR(false);
    setShowRecoveryCodes(false);
    if (onComplete) onComplete();
  };

  if (showRecoveryCodes) {
    return <TwoFactorRecoveryCodes recoveryCodes={recoveryCodes} onComplete={finishSetup} />;
  }

  if (showQR && totpUri) {
    return (
      <TwoFactorQRSetup
        totpUri={totpUri}
        totpSecret={totpSecret}
        verificationCode={verificationCode}
        onVerificationCodeChange={setVerificationCode}
        onVerify={verifyTOTP}
        onCancel={() => setShowQR(false)}
        isLoading={isLoading}
      />
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Authentification à deux facteurs</CardTitle>
        <CardDescription>
          Ajoutez une couche de sécurité supplémentaire à votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Authentification à deux facteurs</p>
              <p className="text-sm text-muted-foreground">
                {isEnabled ? 'Activée' : 'Désactivée'}
              </p>
            </div>
          </div>
          <Switch 
            checked={isEnabled}
            onCheckedChange={handleToggle}
            disabled={isLoading}
            aria-label="Activer l'authentification à deux facteurs"
          />
        </div>
        
        {!isEnabled && (
          <Alert>
            <AlertDescription>
              L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire en demandant un code 
              généré par une application d'authentification en plus de votre mot de passe.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TwoFactorSetup;
