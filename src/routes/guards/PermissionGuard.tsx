import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useAuth } from '@/stores/AuthStore';
import { UserRole } from '@/types/user';

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredPermissions?: string[];
}

const PermissionGuard: React.FC<PermissionGuardProps> = observer(({ 
  children, 
  requiredRoles = [], 
  requiredPermissions = [] 
}) => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const hasRequiredRole = requiredRoles.length === 0 || requiredRoles.includes(user.role);
  const hasRequiredPermissions = requiredPermissions.length === 0 || 
    requiredPermissions.every(permission => user.permissions.includes(permission));

  if (!hasRequiredRole || !hasRequiredPermissions) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
});

export default PermissionGuard;
