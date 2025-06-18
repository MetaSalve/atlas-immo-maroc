
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

type AppProvidersProps = {
  children: React.ReactNode;
};

// Client pour React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// Version ultra-simplifiée sans aucun hook
const AppProvidersBase = ({ children }: AppProvidersProps) => {
  console.log('AppProviders: Démarrage du rendu');
  console.log('React disponible:', !!React);
  
  // Initialisation synchrone de i18n si possible
  try {
    require('@/i18n');
    console.log('i18n initialisé avec succès');
  } catch (error) {
    console.log('i18n non disponible, continuer sans:', error);
  }
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="bottom-right" closeButton />
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export const AppProviders = AppProvidersBase;
