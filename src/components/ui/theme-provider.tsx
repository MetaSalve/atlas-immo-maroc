
"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";
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
  // Create a client-only wrapper to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

// Export a theme toggle hook for convenience
export const ThemeContext = createContext({ theme: "light", setTheme: (theme: string) => {} });

export const useTheme = () => {
  return useContext(ThemeContext);
};
