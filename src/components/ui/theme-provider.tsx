
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// Import from the main package instead of looking for the dist/types path
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
  const [mounted, setMounted] = React.useState(false);

  // Set mounted to true after the first render on the client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering the ThemeProvider on the server to prevent hydration mismatch
  if (!mounted) {
    // Return children without the ThemeProvider during SSR and initial client render
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
