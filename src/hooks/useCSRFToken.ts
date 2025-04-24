
import { useState, useEffect } from 'react';

export const useCSRFToken = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [hasCSRFProtection, setHasCSRFProtection] = useState(true);

  useEffect(() => {
    const generateCSRFToken = () => {
      const token = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
      setCsrfToken(token);
      sessionStorage.setItem('csrf_token', token);
    };
    
    generateCSRFToken();
  }, []);

  const validateCSRFToken = (token: string | null): boolean => {
    if (!hasCSRFProtection) return true;
    const storedToken = sessionStorage.getItem('csrf_token');
    return token === storedToken;
  };

  return { 
    csrfToken, 
    hasCSRFProtection, 
    validateCSRFToken,
    regenerateToken: () => {
      const newToken = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
      setCsrfToken(newToken);
      sessionStorage.setItem('csrf_token', newToken);
      return newToken;
    }
  };
};
