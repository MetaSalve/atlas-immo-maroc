
import React from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from './providers/AppProviders'
import App from './App.tsx'
import './index.css'

// Initialize the root and render the application
const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
