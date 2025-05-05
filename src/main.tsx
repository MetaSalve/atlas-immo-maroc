
import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from './providers/AppProviders'
import App from './App.tsx'
import './index.css'
import { LoadingFallback } from './components/common/LoadingFallback'

// Initialize the root and render the application
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <AppProviders>
      <React.Suspense fallback={<LoadingFallback />}>
        <App />
      </React.Suspense>
    </AppProviders>
  </React.StrictMode>
);
