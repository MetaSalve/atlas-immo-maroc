
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "alertimmo-theme",
  ...props
}: ThemeProviderProps) {
  // Utilisez un état pour suivre le montage côté client
  const [mounted, setMounted] = React.useState(false);

  // Définir mounted à true après le premier rendu côté client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Rendu conditionnel pour éviter les erreurs d'hydratation
  // Renvoie simplement les enfants pendant le rendu côté serveur
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider
      defaultTheme={defaultTheme}
      storageKey={storageKey}
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
