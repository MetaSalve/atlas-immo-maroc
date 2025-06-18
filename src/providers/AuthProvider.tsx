
import { createContext, useContext, useState, ReactNode } from 'react';

type AuthContextType = {
  user: any;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log('AuthProvider: Rendering started');
  
  // Test simple sans hooks complexes
  const contextValue = {
    user: null,
    loading: false
  };
  
  console.log('AuthProvider: Context value created', contextValue);
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
