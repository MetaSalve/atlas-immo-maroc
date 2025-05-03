import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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

const queryClient = new QueryClient();

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  
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
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>
  );
};
