
import { useState } from 'react';

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
    
    if (password.length < 8) {
      return { isValid: false, error: "Le mot de passe doit contenir au moins 8 caractères" };
    }
    
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: "Le mot de passe doit contenir au moins une majuscule" };
    }
    
    if (!/[0-9]/.test(password)) {
      return { isValid: false, error: "Le mot de passe doit contenir au moins un chiffre" };
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
  const validatePasswordFields = (password: string, confirmPassword?: string): boolean => {
    const mainResult = validatePassword(password);
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
