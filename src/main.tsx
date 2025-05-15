
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProviders } from './providers/AppProviders';
import { runSecurityChecks } from './utils/security';
import * as Sentry from '@sentry/react';
import { initSentry } from './integrations/sentry';

// Initialize Sentry for error tracking
initSentry();

// Run security checks
runSecurityChecks();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
