import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../hooks/useRootStore';
import { CircularProgress, Box } from '@mui/material';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = observer(({ children }) => {
  const location = useLocation();
  const { authStore } = useRootStore();

  // Show loading state while checking authentication
  if (authStore.isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If email verification is required and user is not verified
  if (authStore.requireEmailVerification && !authStore.user?.isVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  return <>{children}</>;
});

export default AuthGuard;
