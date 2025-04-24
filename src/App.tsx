import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { routes } from "@/routes/routes";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { NotFound } from "@/components/common/NotFound";
import { configureSecurityHeaders, runSecurityChecks } from "./utils/securityHeaders";
import { useAuth } from "./providers/AuthProvider";
import { CookieConsent } from "@/components/common/CookieConsent";
import { CustomRouteObject } from "./routes/types";

function App() {
  const location = useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Rediriger vers la page d'accueil si on arrive sur /auth alors qu'on est déjà connecté
  useEffect(() => {
    if (user && location.pathname === '/auth') {
      navigate('/');
    }
  }, [user, location.pathname, navigate]);

  // Configurer les en-têtes de sécurité au chargement de l'application
  useEffect(() => {
    configureSecurityHeaders();
    runSecurityChecks();
  }, []);

  return (
    <>
      <Routes>
        {routes.map((route: CustomRouteObject, index: number) => (
          <Route
            key={index}
            {...route}
            element={
              <Layout>
                <ProtectedRoute
                  element={route.element}
                  requiresAuth={route.authRequired}
                />
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
    </>
  );
}

export default App;
