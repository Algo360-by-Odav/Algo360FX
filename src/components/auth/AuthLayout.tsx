import React from 'react';
import { Box, Container, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Outlet, useLocation, Navigate } from 'react-router-dom';

const AuthContainer = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #0A1929 0%, #1A2027 100%)',
  padding: '20px',
});

const AuthCard = styled(Paper)({
  width: '100%',
  maxWidth: '450px',
  padding: '40px',
  borderRadius: '16px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
});

const AuthLayout: React.FC = () => {
  const location = useLocation();

  // If we're at /auth, redirect to /auth/login
  if (location.pathname === '/auth' || location.pathname === '/auth/') {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <AuthContainer>
      <Container maxWidth="sm">
        <AuthCard elevation={3}>
          <Outlet />
        </AuthCard>
      </Container>
    </AuthContainer>
  );
};

export default AuthLayout;
