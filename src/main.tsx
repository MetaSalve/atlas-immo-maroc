
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AppProviders } from "./providers/AppProviders";
import { HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <AppProviders>
        <App />
      </AppProviders>
    </HelmetProvider>
  </StrictMode>,
);
