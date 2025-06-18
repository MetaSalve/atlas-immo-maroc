
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';

// Intégration i18n
import '@/i18n';

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

// Version simplifiée pour déboguer
const AppProvidersBase = ({ children }: AppProvidersProps) => {
  console.log('AppProviders: Démarrage du rendu');
  console.log('React disponible:', !!React);
  console.log('React.useEffect disponible:', !!React.useEffect);
  
  // Test simple sans providers complexes d'abord
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
