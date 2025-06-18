
import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from './providers/AppProviders'
import App from './App.tsx'
import './index.css'
import { LoadingFallback } from './components/common/LoadingFallback'
import { initSentry } from './integrations/sentry'
import { ErrorBoundary } from './components/common/ErrorBoundary'

// Initialiser Sentry avant tout le reste
initSentry();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <React.Suspense fallback={<LoadingFallback />}>
        <AppProviders>
          <App />
        </AppProviders>
      </React.Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);
