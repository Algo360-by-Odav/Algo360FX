import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { theme } from './theme';

// Components
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import VerifyEmail from './components/auth/VerifyEmail';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { PortfolioList } from './components/portfolio/PortfolioList';
import { Callback } from './components/auth/Callback';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

// Initialize AWS Amplify
import { Amplify } from 'aws-amplify';
import { awsConfig } from './config/aws-config';

Amplify.configure(awsConfig);

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <AppProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/callback" element={<Callback />} />
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/portfolios" element={<PortfolioList />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Routes>
            </Router>
          </AppProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
