
import { useTranslation } from '@/i18n';

export const usePasswordValidation = () => {
  const { t } = useTranslation();
  
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return t('auth.passwordTooShort');
    }
    
    if (!/[A-Z]/.test(password)) {
      return t('auth.passwordNeedsUppercase');
    }
    
    if (!/[0-9]/.test(password)) {
      return t('auth.passwordNeedsNumber');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return t('auth.passwordNeedsSpecial');
    }
    
    return null;
  };

  return {
    validatePassword,
  };
};
