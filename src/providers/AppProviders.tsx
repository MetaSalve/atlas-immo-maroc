
import React from 'react';
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

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30 * 1000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: import.meta.env.PROD,
    },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider>
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
  );
}
