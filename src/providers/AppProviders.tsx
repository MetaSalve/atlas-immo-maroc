
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { CacheProvider } from '@/providers/CacheProvider';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '@/i18n';
import { Suspense } from 'react';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import { AuthProvider } from '@/providers/AuthProvider';
import { SubscriptionProvider } from '@/providers/SubscriptionProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { SecurityAuditProvider } from '@/providers/SecurityAuditProvider';
import { Toaster as SonnerToaster } from 'sonner';
import { NotificationsProvider } from '@/providers/NotificationsProvider';
import { AccessibilityProvider } from '@/providers/AccessibilityProvider';

// Create a QueryClient instance outside component to avoid recreation on rerenders
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
      retry: 1,
    },
  },
});

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18n}>
            <ThemeProvider defaultTheme="light" storageKey="alertimmo-theme">
              <CacheProvider>
                <Suspense fallback={<LoadingFallback />}>
                  <ErrorBoundary>
                    <AuthProvider>
                      <SubscriptionProvider>
                        <SecurityAuditProvider>
                          <NotificationsProvider>
                            <AccessibilityProvider>
                              {children}
                              <SonnerToaster position="top-right" />
                            </AccessibilityProvider>
                          </NotificationsProvider>
                        </SecurityAuditProvider>
                      </SubscriptionProvider>
                    </AuthProvider>
                  </ErrorBoundary>
                </Suspense>
              </CacheProvider>
            </ThemeProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};
