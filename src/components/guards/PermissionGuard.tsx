import React from 'react';
import { observer } from 'mobx-react-lite';
import { useAuth } from '../../stores/AuthStore';
import { Navigate } from 'react-router-dom';
import AccessDenied from '../AccessDenied';

interface User {
  id: string;
  email: string;
  role: string;
  permissions: string[];
}

interface PermissionGuardProps {
  requiredPermissions: string[];
  children: React.ReactNode;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  requiredPermissions,
  children,
}) => {
  const { user } = useAuth();

  const hasRequiredPermissions = (user: User) => {
    if (!user || !user.permissions) return false;
    return requiredPermissions.every((permission) =>
      user.permissions.includes(permission)
    );
  };

  if (!user || !hasRequiredPermissions(user)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};

export default PermissionGuard;
