import React from 'react';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../../stores/AuthStore';
import { Navigate } from 'react-router-dom';
import AccessDenied from '../AccessDenied';
import { User, UserRole } from '@/types/user';

interface PermissionGuardProps {
  requiredRoles: UserRole[];
  children: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = observer(({
  requiredRoles,
  children,
}) => {
  const { user } = useAuth();

  const hasRequiredRole = (user: User) => {
    if (!user || !user.role) return false;
    return requiredRoles.includes(user.role as UserRole);
  };

  if (!user || !hasRequiredRole(user)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
});

export default PermissionGuard;
