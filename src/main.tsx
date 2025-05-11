
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from './providers/AppProviders';
import App from './App.tsx';
import './index.css';

// Make sure the DOM is fully loaded before initializing React
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create the root before rendering
const root = createRoot(rootElement);

// Render the app with StrictMode to catch potential issues
root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
