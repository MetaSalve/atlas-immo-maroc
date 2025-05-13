
import { useState } from 'react';
import { checkPasswordStrength, checkPasswordCompromised } from '@/utils/security/passwordSecurity';

type ValidationResult = {
  isValid: boolean;
  error: string | null;
};

export const usePasswordValidation = () => {
  const [passwordErrors, setPasswordErrors] = useState<{
    main: string | null;
    confirmation: string | null;
  }>({
    main: null,
    confirmation: null,
  });

  /**
   * Validates a password against security requirements
   * @param password The password to validate
   * @returns Validation result with error message if invalid
   */
  const validatePassword = async (password: string): Promise<ValidationResult> => {
    if (!password) {
      return { isValid: false, error: "Le mot de passe est requis" };
    }
    
    // Vérifier la force du mot de passe
    const strengthCheck = checkPasswordStrength(password);
    if (!strengthCheck.isStrong) {
      return { 
        isValid: false, 
        error: strengthCheck.feedback.length > 0 
          ? strengthCheck.feedback[0] 
          : "Le mot de passe n'est pas assez fort" 
      };
    }
    
    // Vérifier si le mot de passe a été compromis
    const isCompromised = await checkPasswordCompromised(password);
    if (isCompromised) {
      return { 
        isValid: false, 
        error: "Ce mot de passe a été compromis dans une fuite de données. Veuillez en choisir un autre."
      };
    }
    
    // Password is valid
    return { isValid: true, error: null };
  };

  /**
   * Validates that two passwords match
   * @param password The main password
   * @param confirmPassword The confirmation password
   * @returns Validation result with error message if invalid
   */
  const validatePasswordMatch = (password: string, confirmPassword: string): ValidationResult => {
    if (!confirmPassword) {
      return { isValid: false, error: "La confirmation du mot de passe est requise" };
    }
    
    if (password !== confirmPassword) {
      return { isValid: false, error: "Les mots de passe ne correspondent pas" };
    }
    
    return { isValid: true, error: null };
  };

  /**
   * Validates a password and optionally its confirmation
   * @param password The main password
   * @param confirmPassword Optional confirmation password
   * @returns True if all validations pass
   */
  const validatePasswordFields = async (password: string, confirmPassword?: string): Promise<boolean> => {
    const mainResult = await validatePassword(password);
    setPasswordErrors(prev => ({ ...prev, main: mainResult.error }));
    
    if (confirmPassword !== undefined) {
      const matchResult = validatePasswordMatch(password, confirmPassword);
      setPasswordErrors(prev => ({ ...prev, confirmation: matchResult.error }));
      return mainResult.isValid && matchResult.isValid;
    }
    
    return mainResult.isValid;
  };

  const clearErrors = () => {
    setPasswordErrors({ main: null, confirmation: null });
  };

  return {
    passwordErrors,
    validatePassword,
    validatePasswordMatch,
    validatePasswordFields,
    clearErrors
  };
};
