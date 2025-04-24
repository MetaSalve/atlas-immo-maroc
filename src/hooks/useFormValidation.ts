
import { useState } from 'react';

export type ValidationRules = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  password?: boolean;
  match?: string;
};

export type ValidationErrors = Record<string, string>;

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = (
    name: string,
    value: string,
    rules: ValidationRules,
    allValues?: Record<string, string>
  ): string => {
    if (rules.required && (!value || value.trim() === '')) {
      return 'Ce champ est requis';
    }

    if (value) {
      if (rules.minLength && value.length < rules.minLength) {
        return `Doit contenir au moins ${rules.minLength} caractères`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return `Ne doit pas dépasser ${rules.maxLength} caractères`;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return 'Format invalide';
      }

      if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Email invalide';
      }

      if (rules.password) {
        if (value.length < 8) {
          return 'Le mot de passe doit contenir au moins 8 caractères';
        }

        if (!/[A-Z]/.test(value)) {
          return 'Le mot de passe doit contenir au moins une majuscule';
        }

        if (!/[0-9]/.test(value)) {
          return 'Le mot de passe doit contenir au moins un chiffre';
        }
      }

      if (rules.match && allValues && value !== allValues[rules.match]) {
        return 'Les valeurs ne correspondent pas';
      }
    }

    return '';
  };

  const validateForm = (
    values: Record<string, string>,
    validationRules: Record<string, ValidationRules>
  ): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    for (const fieldName in validationRules) {
      if (Object.prototype.hasOwnProperty.call(validationRules, fieldName)) {
        const error = validateField(fieldName, values[fieldName], validationRules[fieldName], values);
        if (error) {
          newErrors[fieldName] = error;
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors[fieldName];
  };

  // Validation de sécurité pour empêcher les injections XSS
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\//g, '&#x2F;');
  };

  return {
    errors,
    validateField,
    validateForm,
    getFieldError,
    sanitizeInput,
  };
};
