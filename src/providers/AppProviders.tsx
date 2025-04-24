
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./AuthProvider";
import { SubscriptionProvider } from "./SubscriptionProvider";
import { NotificationsProvider } from "./NotificationsProvider";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { createQueryClient } from "@/hooks/useCacheConfig";

interface AppProvidersProps {
  children: React.ReactNode;
}

const queryClient = createQueryClient();

export const AppProviders = ({ children }: AppProvidersProps) => {
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
                      {children}
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
