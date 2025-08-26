
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './AuthProvider';
import { CacheProvider } from './CacheProvider';
import { SubscriptionProvider } from './SubscriptionProvider';
import { NotificationsProvider } from './NotificationsProvider';
import { I18nProvider } from './I18nProvider';
import { AccessibilityProvider } from './AccessibilityProvider';

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
  console.log('AppProviders: Starting provider hierarchy setup');
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nProvider>
            <AccessibilityProvider>
              <AuthProvider>
                <SubscriptionProvider>
                  <NotificationsProvider>
                    <CacheProvider>
                      {children}
                      <Toaster richColors position="bottom-right" closeButton />
                    </CacheProvider>
                  </NotificationsProvider>
                </SubscriptionProvider>
              </AuthProvider>
            </AccessibilityProvider>
          </I18nProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
