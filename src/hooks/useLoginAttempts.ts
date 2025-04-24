
import { useState, useEffect } from 'react';

export const useLoginAttempts = () => {
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastLoginTime, setLastLoginTime] = useState<Date | null>(null);

  useEffect(() => {
    const storedAttempts = localStorage.getItem('login_attempts');
    const storedTime = localStorage.getItem('last_login_time');
    
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts));
    }
    
    if (storedTime) {
      setLastLoginTime(new Date(storedTime));
    }
  }, []);

  const trackLoginAttempt = (success: boolean) => {
    const currentAttempts = loginAttempts + (success ? 0 : 1);
    const now = new Date();
    
    setLoginAttempts(currentAttempts);
    setLastLoginTime(now);
    
    localStorage.setItem('login_attempts', currentAttempts.toString());
    localStorage.setItem('last_login_time', now.toISOString());
    
    if (lastLoginTime) {
      const timeDiffMs = now.getTime() - lastLoginTime.getTime();
      if (timeDiffMs > 30 * 60 * 1000) {
        setLoginAttempts(success ? 0 : 1);
        localStorage.setItem('login_attempts', success ? '0' : '1');
      }
    }
    
    if (currentAttempts >= 5) {
      const remainingTimeMs = lastLoginTime 
        ? Math.max(0, (30 * 60 * 1000) - (now.getTime() - lastLoginTime.getTime())) 
        : 30 * 60 * 1000;
        
      return {
        blocked: true,
        remainingTime: Math.ceil(remainingTimeMs / (60 * 1000))
      };
    }
    
    return { blocked: false };
  };

  return { trackLoginAttempt, loginAttempts };
};
