import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
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

import Login from './components/auth/Login';
import { SignUp } from './components/auth/SignUp';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './components/Dashboard';
import { PortfolioList } from './components/portfolio/PortfolioList';
import { Callback } from './components/auth/Callback';

import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingOverlay from './components/common/LoadingOverlay';
import NotificationSystem from './components/common/NotificationSystem';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { configureAWS } from './config/aws-config';

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

  useEffect(() => {
    configureAWS();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <LoadingOverlay open={state.isLoading} message={state.loadingMessage || undefined} />
      
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Algo360FX
          </Typography>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/portfolio" element={
            <ProtectedRoute>
              <PortfolioList />
            </ProtectedRoute>
          } />
        </Routes>
      </Container>

      <NotificationSystem />
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <AppProvider>
              <AppContent />
            </AppProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
