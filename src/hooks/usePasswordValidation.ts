import { useState } from 'react';
import { checkPasswordStrength, checkPasswordCompromised } from '@/utils/security/passwordSecurity';
import { toast } from '@/components/ui/use-toast';

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
  const validatePassword = (password: string): ValidationResult => {
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
   * Checks if password is potentially compromised
   * @param password The password to check
   */
  const checkIfPasswordCompromised = async (password: string): Promise<ValidationResult> => {
    try {
      const isCompromised = await checkPasswordCompromised(password);
      if (isCompromised) {
        return { 
          isValid: false, 
          error: "Ce mot de passe a été compromis dans une fuite de données. Veuillez en choisir un autre."
        };
      }
      return { isValid: true, error: null };
    } catch (error) {
      console.error("Erreur lors de la vérification des mots de passe compromis:", error);
      // En cas d'erreur, on continue sans bloquer
      return { isValid: true, error: null };
    }
  };

  /**
   * Validates a password and optionally its confirmation
   * @param password The main password
   * @param confirmPassword Optional confirmation password
   * @returns True if all validations pass
   */
  const validatePasswordFields = async (password: string, confirmPassword?: string): Promise<boolean> => {
    // Validation du format du mot de passe (synchrone)
    const mainResult = validatePassword(password);
    setPasswordErrors(prev => ({ ...prev, main: mainResult.error }));
    
    if (!mainResult.isValid) {
      return false;
    }
    
    // Vérification du mot de passe compromis (asynchrone)
    const compromisedCheck = await checkIfPasswordCompromised(password);
    if (!compromisedCheck.isValid) {
      setPasswordErrors(prev => ({ ...prev, main: compromisedCheck.error }));
      return false;
    }
    
    // Vérification de la correspondance si confirmPassword est fourni
    if (confirmPassword !== undefined) {
      const matchResult = validatePasswordMatch(password, confirmPassword);
      setPasswordErrors(prev => ({ ...prev, confirmation: matchResult.error }));
      return matchResult.isValid;
    }
    
    return true;
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
