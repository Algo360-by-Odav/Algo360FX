import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'premium_user' | 'user';
  requiredPermissions?: Array<{
    resource: string;
    action: 'read' | 'write' | 'delete' | 'manage';
  }>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = observer(({ 
  children, 
  requiredRole,
  requiredPermissions 
}) => {
  const location = useLocation();
  const { isLoggedIn, user } = authStore;

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    if (user?.role === 'user') {
      return <Navigate to="/mining/pricing" state={{ from: location }} replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Check permissions requirement
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(({ resource, action }) =>
      authStore.hasPermission(resource, action)
    );

    if (!hasAllPermissions) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Check route access
  if (!authStore.canAccessRoute(location.pathname)) {
    if (location.pathname.includes('/admin')) {
      return <Navigate to="/dashboard" replace />;
    }
    if (location.pathname.includes('/analytics')) {
      return <Navigate to="/mining/pricing" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
});

export default ProtectedRoute;
