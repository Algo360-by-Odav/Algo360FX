import React from 'react';
import { Box } from '@mui/material';
import { Outlet, useLocation, Navigate } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  const location = useLocation();

  // If we're at /auth, redirect to /auth/login
  if (location.pathname === '/auth' || location.pathname === '/auth/') {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
      }}
    >
      <Outlet />
    </Box>
  );
};

export default AuthLayout;
