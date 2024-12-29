import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import MT5Page from './pages/MT5Page';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

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

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          {isAuthenticated && (
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                  Algo360FX
                </Typography>
                <Button color="inherit" component={Link} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" component={Link} to="/mt5">
                  MT5
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                  }}
                >
                  Logout
                </Button>
              </Toolbar>
            </AppBar>
          )}

          <Container>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<WelcomePage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />

              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={isAuthenticated ? (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h4">
                      Welcome to Algo360FX Dashboard
                    </Typography>
                  </Box>
                ) : (
                  <Navigate to="/auth/login" />
                )} 
              />
              <Route 
                path="/mt5" 
                element={isAuthenticated ? <MT5Page /> : <Navigate to="/auth/login" />} 
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
