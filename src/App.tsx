
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
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

function App() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to home page if arriving at /auth while already logged in
  useEffect(() => {
    if (user && window.location.pathname === '/auth') {
      navigate('/');
    }
  }, [user, navigate]);

  // Configure security headers on application load
  useEffect(() => {
    configureSecurityHeaders();
    runSecurityChecks();
  }, []);

  return (
    <>
      <ErrorBoundary>
        <Routes>
          {routes.map((route: CustomRouteObject, index: number) => (
            <Route
              key={index}
              path={route.path as string}
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
      </ErrorBoundary>
      
      <CookieConsent />
    </>
  );
}

export default App;
