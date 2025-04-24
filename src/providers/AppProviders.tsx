
import React, { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./AuthProvider";
import { SubscriptionProvider } from "./SubscriptionProvider";
import { NotificationsProvider } from "./NotificationsProvider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { createQueryClient, preloadCommonQueries } from "@/hooks/useCacheConfig";
import { AccessibilityProvider } from "./AccessibilityProvider";
import { CacheProvider } from "./CacheProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

const queryClient = createQueryClient();

export const AppProviders = ({ children }: AppProvidersProps) => {
  useEffect(() => {
    // Précharger les données communes au démarrage de l'application
    preloadCommonQueries(queryClient);
  }, []);

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            <TooltipProvider>
              <BrowserRouter>
                <AuthProvider>
                  <SubscriptionProvider>
                    <NotificationsProvider>
                      <AccessibilityProvider>
                        <CacheProvider>
                          {children}
                        </CacheProvider>
                      </AccessibilityProvider>
                    </NotificationsProvider>
                  </SubscriptionProvider>
                </AuthProvider>
              </BrowserRouter>
            </TooltipProvider>
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};
