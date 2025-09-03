
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import routes from "@/routes/routes";
import { NotFound } from "@/components/common/NotFound";
import { configureSecurityHeaders, runSecurityChecks } from "./utils/securityHeaders";
import { CookieConsent } from "@/components/common/CookieConsent";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { LiveChat } from "@/components/support/LiveChat";

function App() {
  // Configurer les en-têtes de sécurité au chargement de l'application
  useEffect(() => {
    configureSecurityHeaders();
    runSecurityChecks();
  }, []);

  return (
    <AuthWrapper>
      <GoogleAnalytics />
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <Layout>
                {route.element}
              </Layout>
            }
          />
        ))}
        <Route
          path="*"
          element={
            <Layout>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
      
      <CookieConsent />
      <LiveChat />
    </AuthWrapper>
  );
}

export default App;
