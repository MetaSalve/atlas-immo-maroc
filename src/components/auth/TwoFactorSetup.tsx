
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Loader2, Shield } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import QRCode from 'qrcode.react';

interface TwoFactorSetupProps {
  onComplete?: () => void;
}

export const TwoFactorSetup = ({ onComplete }: TwoFactorSetupProps) => {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [totpUri, setTotpUri] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  const fetchTwoFactorStatus = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('two_factor_enabled')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      setIsEnabled(data?.two_factor_enabled || false);
    } catch (error) {
      console.error('Erreur lors de la récupération du statut 2FA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Charger le statut 2FA au chargement du composant
  useState(() => {
    fetchTwoFactorStatus();
  });

  const generateTOTPSecret = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Dans une implémentation réelle, nous utiliserions un endpoint sécurisé
      // qui génère un secret TOTP et le stocke de manière sécurisée
      // Pour cet exemple, simulons le processus
      
      // Simuler un secret TOTP
      const mockSecret = 'JBSWY3DPEHPK3PXP'; // Ceci est un exemple, pas un vrai secret
      const mockUri = `otpauth://totp/AlertImmo:${user.email}?secret=${mockSecret}&issuer=AlertImmo`;
      
      setTotpSecret(mockSecret);
      setTotpUri(mockUri);
      setShowQR(true);
    } catch (error) {
      console.error('Erreur lors de la génération du secret TOTP:', error);
      toast.error('Erreur lors de la configuration du 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTOTP = async () => {
    if (!user || !verificationCode) return;
    
    try {
      setIsLoading(true);
      
      // Dans une implémentation réelle, nous vérifierions le code avec notre backend
      // Pour cet exemple, simulons une vérification réussie si le code a 6 chiffres
      if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
        // Génération de codes de récupération
        const mockRecoveryCodes = [
          'ABCDE-12345', 'FGHIJ-67890',
          'KLMNO-13579', 'PQRST-24680',
          'UVWXY-97531', 'ZABCD-86420'
        ];
        
        // Mettre à jour le profil utilisateur
        await supabase
          .from('profiles')
          .update({
            two_factor_enabled: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
        
        setIsEnabled(true);
        setRecoveryCodes(mockRecoveryCodes);
        setShowRecoveryCodes(true);
        toast.success('Authentification à deux facteurs activée avec succès');
      } else {
        toast.error('Code de vérification invalide');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du code TOTP:', error);
      toast.error('Erreur lors de l\'activation du 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const disableTwoFactor = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Désactiver le 2FA dans le profil utilisateur
      await supabase
        .from('profiles')
        .update({
          two_factor_enabled: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      setIsEnabled(false);
      setShowQR(false);
      setTotpSecret(null);
      setTotpUri(null);
      setVerificationCode('');
      setRecoveryCodes([]);
      setShowRecoveryCodes(false);
      
      toast.success('Authentification à deux facteurs désactivée');
    } catch (error) {
      console.error('Erreur lors de la désactivation du 2FA:', error);
      toast.error('Erreur lors de la désactivation du 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    if (isEnabled) {
      disableTwoFactor();
    } else {
      generateTOTPSecret();
    }
  };

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

  const finishSetup = () => {
    setShowQR(false);
    setShowRecoveryCodes(false);
    if (onComplete) onComplete();
  };

  if (showRecoveryCodes) {
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
          <Button onClick={finishSetup} className="w-full">
            J'ai sauvegardé mes codes de récupération
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (showQR) {
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
              <QRCode value={totpUri} size={200} />
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
              onChange={(e) => setVerificationCode(e.target.value)}
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
          <Button variant="outline" onClick={() => setShowQR(false)}>
            Annuler
          </Button>
          <Button onClick={verifyTOTP} disabled={isLoading || verificationCode.length !== 6}>
            {isLoading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Vérification...</>
            ) : (
              'Activer le 2FA'
            )}
          </Button>
        </CardFooter>
      </Card>
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
