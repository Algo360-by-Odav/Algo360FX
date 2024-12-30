import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/hooks/useRootStore';
import { createTheme } from './createTheme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = observer(({ children }) => {
  const { settingsStore } = useRootStore();
  const { theme: themeMode, direction } = settingsStore.appearance;

  const theme = React.useMemo(
    () =>
      createTheme({
        mode: themeMode,
        direction,
      }),
    [themeMode, direction]
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
});

export default ThemeProvider;
