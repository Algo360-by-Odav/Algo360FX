import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../../stores/AuthStore';
import { config } from '../../config/config';
import { CircularProgress, Box } from '@mui/material';

export interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = observer(({ 
  children,
  requireAuth = true 
}) => {
  const auth = useAuth();
  const location = useLocation();

  // Allow access in development mode
  if (config.env === 'development' && !requireAuth) {
    return children || <Outlet />;
  }

  // Show loading state while checking authentication
  if (auth.loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #1a1f2c 0%, #2d3748 100%)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!auth.isAuthenticated && requireAuth) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Render children or outlet for nested routes
  return children || <Outlet />;
});

export default ProtectedRoute;
