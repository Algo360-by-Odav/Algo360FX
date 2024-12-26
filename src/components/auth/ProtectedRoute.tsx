import React, { useEffect, useState, startTransition } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/hooks/useRootStore';
import LoadingScreen from '@/components/loading/LoadingScreen';

const ProtectedRoute: React.FC = observer(() => {
  const { authStore } = useRootStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authStore.checkAuth();
      } finally {
        startTransition(() => {
          setIsLoading(false);
        });
      }
    };

    checkAuth();
  }, [authStore]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!authStore.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
});

export default ProtectedRoute;
