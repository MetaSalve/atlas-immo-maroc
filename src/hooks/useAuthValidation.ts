
import { useState } from 'react';
import { useFormValidation } from './useFormValidation';

export const useAuthValidation = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { validateField } = useFormValidation();

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

    const passwordError = validateField('password', password, { required: true });
    if (passwordError) {
      setErrorMessage(passwordError);
      return false;
    }

    setErrorMessage(null);
    return true;
  };

  const validateSignup = (email: string, password: string): boolean => {
    if (!validateEmail(email)) return false;

    const passwordError = validateField('password', password, {
      required: true,
      minLength: 8,
      pattern: /^(?=.*[A-Z])(?=.*[0-9])/
    });
    if (passwordError) {
      setErrorMessage(passwordError);
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
