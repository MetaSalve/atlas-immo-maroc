
import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from './providers/AppProviders'
import App from './App.tsx'
import './index.css'
import { LoadingFallback } from './components/common/LoadingFallback'
import { initSentry } from './integrations/sentry'

// Initialiser Sentry avant tout le reste
initSentry();

const root = createRoot(document.getElementById("root")!);
root.render(
  <AppProviders>
    <React.Suspense fallback={<LoadingFallback />}>
      <App />
    </React.Suspense>
  </AppProviders>
);
