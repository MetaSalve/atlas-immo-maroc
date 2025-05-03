
import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import routes from "@/routes/routes";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { NotFound } from "@/components/common/NotFound";
import { configureSecurityHeaders, runSecurityChecks } from "./utils/securityHeaders";
import { useAuth } from "./providers/AuthProvider";
import { CookieConsent } from "@/components/common/CookieConsent";
import { CustomRouteObject } from "./routes/types";

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Rediriger vers la page d'accueil si on arrive sur /auth alors qu'on est déjà connecté
  useEffect(() => {
    if (user && window.location.pathname === '/auth') {
      navigate('/');
    }
  }, [user, navigate]);

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
            path={route.path}
            element={
              <Layout>
                {route.adminRequired ? (
                  <AdminRoute element={route.element} />
                ) : (
                  <ProtectedRoute
                    element={route.element}
                    requiresAuth={route.authRequired}
                    requiresSubscription={route.subscriptionRequired}
                  />
                )}
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
