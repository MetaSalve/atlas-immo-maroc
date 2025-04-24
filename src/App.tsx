
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { CookieConsent } from "./components/common/CookieConsent";
import { SkipToContent } from "./components/common/SkipToContent";
import { AppProviders } from "./providers/AppProviders";
import { routes } from "./routes/routes";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { configureSecurityHeaders, runSecurityChecks } from "./utils/securityHeaders";

const App = () => {
  useEffect(() => {
    runSecurityChecks();
  }, []);

  return (
    <AppProviders>
      <SkipToContent />
      <Routes>
        {routes.map((route, index) => {
          if (route.children) {
            return (
              <Route key={index} element={route.element}>
                {route.children.map((childRoute, childIndex) => (
                  <Route
                    key={childIndex}
                    path={childRoute.path}
                    element={
                      <ProtectedRoute
                        element={childRoute.element}
                        requiresAuth={childRoute.authRequired}
                      />
                    }
                  />
                ))}
              </Route>
            );
          }
          return (
            <Route
              key={index}
              path={route.path}
              element={
                <ProtectedRoute
                  element={route.element}
                  requiresAuth={route.authRequired}
                />
              }
            />
          );
        })}
      </Routes>
      <Toaster />
      <Sonner />
      <CookieConsent />
    </AppProviders>
  );
};

export default App;
