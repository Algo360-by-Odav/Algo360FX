import React from 'react';
import { observer } from 'mobx-react-lite';
import { authStore, Permission } from '../../stores/authStore';

interface RoleBasedRenderProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'premium_user' | 'user';
  requiredPermissions?: Array<{
    resource: string;
    action: Permission['action'];
  }>;
  fallback?: React.ReactNode;
}

export const RoleBasedRender: React.FC<RoleBasedRenderProps> = observer(({
  children,
  requiredRole,
  requiredPermissions,
  fallback = null,
}) => {
  const { user } = authStore;

  if (!user) return fallback;

  // Check role requirement
  if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return fallback;
  }

  // Check permissions requirement
  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(({ resource, action }) =>
      authStore.hasPermission(resource, action)
    );

    if (!hasAllPermissions) {
      return fallback;
    }
  }

  return <>{children}</>;
});

export default RoleBasedRender;
