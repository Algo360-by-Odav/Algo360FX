import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../hooks/useRootStore';

interface GuestGuardProps {
  children: React.ReactNode;
}

const GuestGuard: React.FC<GuestGuardProps> = observer(({ children }) => {
  const location = useLocation();
  const { authStore } = useRootStore();
  const from = location.state?.from?.pathname || '/dashboard';

  if (authStore.isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
});

export default GuestGuard;
