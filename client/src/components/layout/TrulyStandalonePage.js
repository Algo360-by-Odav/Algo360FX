// TrulyStandalonePage.js
// A wrapper component for truly standalone pages with no navigation elements

import React from 'react';
import { Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/storeProviderJs';

const TrulyStandalonePage = observer(({ children }) => {
  const { themeStore } = useStores();
  
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeStore.isDarkMode ? 'dark' : 'light',
          primary: {
            main: '#1976d2',
          },
          background: {
            default: themeStore.isDarkMode ? '#0A192F' : '#f5f5f5',
            paper: themeStore.isDarkMode ? '#1A2B45' : '#ffffff',
          },
        },
      }),
    [themeStore.isDarkMode]
  );
  
  return React.createElement(
    ThemeProvider,
    { theme: theme },
    [
      React.createElement(CssBaseline, { key: 'cssbaseline' }),
      React.createElement(
        Box,
        { 
          key: 'main-container',
          sx: { display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' } 
        },
        React.createElement(
          Box,
          {
            key: 'content',
            component: "main",
            sx: {
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
            }
          },
          children
        )
      )
    ]
  );
});

export default TrulyStandalonePage;
