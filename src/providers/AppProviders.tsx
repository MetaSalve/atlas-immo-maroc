
import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/providers/AuthProvider';
import { SubscriptionProvider } from '@/providers/SubscriptionProvider';
import { NotificationsProvider } from '@/providers/NotificationsProvider';
import { AccessibilityProvider } from '@/providers/AccessibilityProvider';
import { CacheProvider } from '@/providers/CacheProvider';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { SecurityAuditProvider } from '@/providers/SecurityAuditProvider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { initSentry } from '@/integrations/sentry';
import { initializePerformanceMonitoring } from '@/utils/loadTesting';
import { config } from '@/utils/environmentConfig';

// Initialiser Sentry pour le monitoring d'erreurs en production
if (import.meta.env.PROD) {
  initSentry();
}

// Initialiser la surveillance des performances en production
if (config.enableAnalytics) {
  initializePerformanceMonitoring();
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Configuration par défaut pour les requêtes en prod
      retry: 2,
      staleTime: 30 * 1000, // 30 secondes
      gcTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: import.meta.env.PROD,
    },
  },
});

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  // We'll remove the useEffect causing problems for now to isolate the issue
  // We can add it back once the app is working again
  
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <BrowserRouter>
            <ThemeProvider defaultTheme="light" storageKey="alertimmo-theme">
              <ErrorBoundary>
                <AuthProvider>
                  <SubscriptionProvider>
                    <CacheProvider>
                      <SecurityAuditProvider>
                        <NotificationsProvider>
                          <AccessibilityProvider>
                            {children}
                            <SonnerToaster position="top-right" />
                            <Toaster />
                          </AccessibilityProvider>
                        </NotificationsProvider>
                      </SecurityAuditProvider>
                    </CacheProvider>
                  </SubscriptionProvider>
                </AuthProvider>
              </ErrorBoundary>
            </ThemeProvider>
          </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};
