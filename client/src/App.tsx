import React from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Toolbar,
  Typography,
  Container,
} from '@mui/material';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import MT5Page from './pages/MT5Page';
import PortfolioPage from './pages/PortfolioPage';
import PositionsPage from './pages/PositionsPage';
import StrategiesPage from './pages/StrategiesPage';

import ErrorBoundary from './components/ErrorBoundary';
import LoadingOverlay from './components/LoadingOverlay';
import NotificationSystem from './components/NotificationSystem';
import { AppProvider, useApp } from './context/AppContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const AppContent: React.FC = () => {
  const { state } = useApp();
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <>
      <LoadingOverlay open={state.isLoading} message={state.loadingMessage || undefined} />
      <NotificationSystem />
      
      <Box sx={{ flexGrow: 1 }}>
        {isAuthenticated && (
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Algo360FX
                {!state.isConnected && (
                  <Typography
                    component="span"
                    sx={{
                      ml: 2,
                      fontSize: '0.8rem',
                      color: 'error.main',
                    }}
                  >
                    (Disconnected)
                  </Typography>
                )}
              </Typography>
              <Button color="inherit" component={Link} to="/portfolio">
                Portfolio
              </Button>
              <Button color="inherit" component={Link} to="/positions">
                Positions
              </Button>
              <Button color="inherit" component={Link} to="/strategies">
                Strategies
              </Button>
              <Button color="inherit" component={Link} to="/mt5">
                MT5
              </Button>
              <Button 
                color="inherit" 
                onClick={() => {
                  localStorage.removeItem('token');
                  window.location.href = '/#/';
                }}
              >
                Logout
              </Button>
            </Toolbar>
          </AppBar>
        )}

        <Container>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/portfolio" replace />
                ) : (
                  <WelcomePage />
                )
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/portfolio"
              element={isAuthenticated ? <PortfolioPage /> : <Navigate to="/" replace />}
            />
            <Route
              path="/positions"
              element={isAuthenticated ? <PositionsPage /> : <Navigate to="/" replace />}
            />
            <Route
              path="/strategies"
              element={isAuthenticated ? <StrategiesPage /> : <Navigate to="/" replace />}
            />
            <Route
              path="/mt5"
              element={isAuthenticated ? <MT5Page /> : <Navigate to="/" replace />}
            />
          </Routes>
        </Container>
      </Box>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppProvider>
          <Router>
            <AppContent />
          </Router>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
