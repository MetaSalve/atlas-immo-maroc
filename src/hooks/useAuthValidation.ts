
import { useState } from 'react';
import { useFormValidation } from './useFormValidation';
import { usePasswordValidation } from './usePasswordValidation';

export const useAuthValidation = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { validateField } = useFormValidation();
  const { validatePassword, validatePasswordFields } = usePasswordValidation();

  const validateEmail = (email: string): boolean => {
    const error = validateField('email', email, { required: true, email: true });
    if (error) {
      setErrorMessage(error);
      return false;
    }
    return true;
  };

  const validateLogin = (email: string, password: string): boolean => {
    if (!validateEmail(email)) return false;

    // For login, we only check if password is provided
    const passwordError = validateField('password', password, { required: true });
    if (passwordError) {
      setErrorMessage(passwordError);
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const validateSignup = async (email: string, password: string): Promise<boolean> => {
    if (!validateEmail(email)) return false;

    // Use our specialized password validation for signup
    const result = validatePassword(password);
    if (!result.isValid) {
      setErrorMessage(result.error);
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  return {
    errorMessage,
    setErrorMessage,
    validateEmail,
    validateLogin,
    validateSignup
  };
};
