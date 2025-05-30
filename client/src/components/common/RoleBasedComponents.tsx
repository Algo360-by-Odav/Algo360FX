import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  IconButton,
  Tooltip,
  Badge,
  Chip,
  Typography,
  Box,
} from '@mui/material';
import {
  Lock as LockIcon,
  Star as StarIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import RoleBasedRender from '../auth/RoleBasedRender';
import { authStore } from '../../stores/authStore';

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  requiredRole?: 'admin' | 'premium_user' | 'user';
  requiredPermissions?: Array<{
    resource: string;
    action: 'read' | 'write' | 'delete' | 'manage';
  }>;
  tooltipText?: string;
  [key: string]: any; // For other MUI Button props
}

export const ActionButton = observer(({
  onClick,
  children,
  requiredRole,
  requiredPermissions,
  tooltipText = 'Upgrade required',
  ...props
}: ActionButtonProps) => (
  <RoleBasedRender
    requiredRole={requiredRole}
    requiredPermissions={requiredPermissions}
    fallback={
      <Tooltip title={tooltipText}>
        <span>
          <Button
            {...props}
            disabled
            startIcon={<LockIcon />}
            onClick={(e) => e.preventDefault()}
          >
            {children}
          </Button>
        </span>
      </Tooltip>
    }
  >
    <Button {...props} onClick={onClick}>
      {children}
    </Button>
  </RoleBasedRender>
));

export const RoleBadge = observer(() => {
  const { user } = authStore;
  if (!user) return null;

  const getRoleBadge = () => {
    switch (user.role) {
      case 'admin':
        return (
          <Chip
            icon={<AdminIcon />}
            label="Admin"
            color="error"
            size="small"
          />
        );
      case 'premium_user':
        return (
          <Chip
            icon={<StarIcon />}
            label="Premium"
            color="warning"
            size="small"
          />
        );
      default:
        return (
          <Chip
            label="Basic"
            color="default"
            size="small"
            variant="outlined"
          />
        );
    }
  };

  return getRoleBadge();
});

export const FeatureBox = observer(({
  title,
  description,
  children,
  requiredRole,
  requiredPermissions,
  upgradeMessage = 'Upgrade to access this feature',
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  requiredRole?: 'admin' | 'premium_user' | 'user';
  requiredPermissions?: Array<{
    resource: string;
    action: 'read' | 'write' | 'delete' | 'manage';
  }>;
  upgradeMessage?: string;
}) => (
  <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
    <Typography variant="h6" gutterBottom>
      {title}
      <RoleBadge />
    </Typography>
    <Typography variant="body2" color="text.secondary" paragraph>
      {description}
    </Typography>
    <RoleBasedRender
      requiredRole={requiredRole}
      requiredPermissions={requiredPermissions}
      fallback={
        <Box
          sx={{
            p: 2,
            bgcolor: 'action.hover',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <LockIcon color="action" />
          <Typography variant="body2" color="text.secondary">
            {upgradeMessage}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            href="/mining/pricing"
            sx={{ ml: 'auto' }}
          >
            Upgrade Now
          </Button>
        </Box>
      }
    >
      {children}
    </RoleBasedRender>
  </Box>
));

export const AdminActions = observer(({
  children
}: {
  children: React.ReactNode;
}) => (
  <RoleBasedRender requiredRole="admin">
    {children}
  </RoleBasedRender>
));

export const PremiumFeature = observer(({
  children,
  upgradeMessage = 'Upgrade to Premium to access this feature'
}: {
  children: React.ReactNode;
  upgradeMessage?: string;
}) => (
  <RoleBasedRender
    requiredRole="premium_user"
    fallback={
      <Box
        sx={{
          p: 2,
          bgcolor: 'warning.light',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <StarIcon color="warning" />
        <Typography variant="body2">
          {upgradeMessage}
        </Typography>
        <Button
          variant="contained"
          size="small"
          href="/mining/pricing"
          sx={{ ml: 'auto' }}
        >
          Upgrade to Premium
        </Button>
      </Box>
    }
  >
    {children}
  </RoleBasedRender>
));
