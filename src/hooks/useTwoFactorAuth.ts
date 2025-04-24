
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'sonner';

export const useTwoFactorAuth = () => {
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
      toast.error('Erreur lors de la récupération du statut 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  const generateTOTPSecret = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const mockSecret = 'JBSWY3DPEHPK3PXP';
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
      
      if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
        const mockRecoveryCodes = [
          'ABCDE-12345', 'FGHIJ-67890',
          'KLMNO-13579', 'PQRST-24680',
          'UVWXY-97531', 'ZABCD-86420'
        ];
        
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
      
      const { error } = await supabase
        .from('profiles')
        .update({
          two_factor_enabled: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setIsEnabled(false);
      setShowQR(false);
      setTotpSecret(null);
      setTotpUri(null);
      setVerificationCode('');
      setRecoveryCodes([]);
      setShowRecoveryCodes(false);
      
      toast.success('Authentification à deux facteurs désactivée');
    } catch (error: any) {
      console.error('Erreur lors de la désactivation du 2FA:', error);
      toast.error('Erreur lors de la désactivation du 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
