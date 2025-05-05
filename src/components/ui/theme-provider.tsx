
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps as NextThemeProviderProps } from "next-themes";

// Define our own interface that extends the base props
type ThemeProviderProps = NextThemeProviderProps & {
  // Add any additional props if needed
};

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "alertimmo-theme",
  ...props
}: ThemeProviderProps) {
  // We don't need to check mounting for SSR anymore since we're using "use client" directive
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
