import React, { ReactNode, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './AuthProvider';
import { SubscriptionProvider } from './SubscriptionProvider';
import { AccessibilityProvider } from './AccessibilityProvider';
import { CacheProvider } from './CacheProvider';
import { NotificationsProvider } from './NotificationsProvider';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { withErrorBoundary } from '@/integrations/sentry';

// Intégration i18n
import '@/i18n';

type AppProvidersProps = {
  children: ReactNode;
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

// Composant AppProviders principal
const AppProvidersBase: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <AuthProvider>
              <SubscriptionProvider>
                <CacheProvider>
                  <AccessibilityProvider>
                    <NotificationsProvider>
                      {children}
                      <Toaster richColors position="bottom-right" closeButton />
                    </NotificationsProvider>
                  </AccessibilityProvider>
                </CacheProvider>
              </SubscriptionProvider>
            </AuthProvider>
          </ErrorBoundary>
        </QueryClientProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
};

// Exporter avec le suivi d'erreurs Sentry
export const AppProviders = withErrorBoundary(AppProvidersBase, {
  fallback: (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 text-center max-w-md">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Erreur critique</h2>
        <p className="text-gray-600 mb-4">
          Une erreur critique est survenue lors du chargement de l'application.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Actualiser la page
        </button>
      </div>
    </div>
  )
});
