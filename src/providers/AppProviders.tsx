
import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { I18nProvider } from './I18nProvider';

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

// Version simplifiée avec gestion sécurisée de i18n
const AppProvidersBase = ({ children }: AppProvidersProps) => {
  console.log('AppProviders: Démarrage du rendu');
  console.log('React disponible:', !!React);
  console.log('React.useEffect disponible:', !!React.useEffect);
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          {children}
          <Toaster richColors position="bottom-right" closeButton />
        </I18nProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export const AppProviders = AppProvidersBase;
