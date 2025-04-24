
export const usePasswordValidation = () => {
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }
    
    if (!/[A-Z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une majuscule";
    }
    
    if (!/[0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins un chiffre";
    }
    
    return null;
  };

  return { validatePassword };
};
