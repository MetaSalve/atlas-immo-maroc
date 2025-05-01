
import React, { ReactNode } from 'react';
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

// Composant AppProviders avec monitoring d'erreurs
const AppProvidersComponent = ({ children }: AppProvidersProps) => {
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
export const AppProviders = withErrorBoundary(AppProvidersComponent, {
  fallback: <div className="p-8 text-center">Une erreur critique est survenue. Veuillez actualiser la page.</div>
});
