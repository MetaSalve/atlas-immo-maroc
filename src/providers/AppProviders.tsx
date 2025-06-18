
import * as React from 'react';
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

// Composant AppProviders principal
const AppProvidersBase = ({ children }: AppProvidersProps) => {
  console.log('AppProviders: Rendu commencé');
  
  return React.createElement(HelmetProvider, null,
    React.createElement(BrowserRouter, null,
      React.createElement(QueryClientProvider, { client: queryClient },
        React.createElement(CacheProvider, null,
          React.createElement(ErrorBoundary, null,
            React.createElement(AuthProvider, null,
              React.createElement(SubscriptionProvider, null,
                React.createElement(AccessibilityProvider, null,
                  React.createElement(NotificationsProvider, null,
                    children,
                    React.createElement(Toaster, { 
                      richColors: true, 
                      position: "bottom-right", 
                      closeButton: true 
                    })
                  )
                )
              )
            )
          )
        )
      )
    )
  );
};

// Exporter avec le suivi d'erreurs Sentry
export const AppProviders = withErrorBoundary(AppProvidersBase, {
  fallback: React.createElement('div', {
    className: "flex items-center justify-center min-h-screen"
  }, React.createElement('div', {
    className: "p-8 text-center max-w-md"
  }, [
    React.createElement('h2', {
      key: 'title',
      className: "text-xl font-semibold text-red-600 mb-4"
    }, 'Erreur critique'),
    React.createElement('p', {
      key: 'description',
      className: "text-gray-600 mb-4"
    }, 'Une erreur critique est survenue lors du chargement de l\'application.'),
    React.createElement('button', {
      key: 'button',
      onClick: () => window.location.reload(),
      className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    }, 'Actualiser la page')
  ]))
});
