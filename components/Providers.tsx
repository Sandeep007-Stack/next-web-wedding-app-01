"use client";

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { ReactNode, useMemo } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function Providers({ children }: { children: ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  const primary = useThemeStore((s) => s.primaryColor);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: primary },
        },
        shape: { borderRadius: 8 },
        typography: {
          fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
        },
      }),
    [mode, primary],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
