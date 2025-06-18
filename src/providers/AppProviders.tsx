
import React from 'react';
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

export function AppProviders({ children }: AppProvidersProps) {
  console.log('AppProviders: Rendering with correct React import');
  console.log('React available:', !!React);
  console.log('React.useEffect available:', !!(React && React.useEffect));
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="bottom-right" closeButton />
      </QueryClientProvider>
    </BrowserRouter>
  );
}
