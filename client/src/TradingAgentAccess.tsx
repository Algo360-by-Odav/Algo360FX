import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import TradingAgentPage from './pages/TradingAgentPage';

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

// Root component that just renders the Trading Agent Page
const Root = () => (
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TradingAgentPage />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(<Root />);
