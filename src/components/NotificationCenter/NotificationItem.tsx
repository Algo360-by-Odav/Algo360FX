import React, { useState } from 'react';
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Chip,
  Menu,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  Info,
  Settings,
  AccountCircle,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { Notification } from '../../services/notifications/NotificationService';
import { notificationStore } from '../../stores/NotificationStore';

interface NotificationItemProps {
  notification: Notification;
  onDelete: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onDelete,
}) => {
  const theme = useTheme();
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleMarkAsRead = async () => {
    await notificationStore.markAsRead(notification.id);
    setMenuAnchor(null);
  };

  const handleDelete = () => {
    onDelete();
    setMenuAnchor(null);
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'trade':
        return <TrendingUp color="primary" />;
      case 'alert':
        return <Warning color="warning" />;
      case 'news':
        return <Info color="info" />;
      case 'account':
        return <AccountCircle color="success" />;
      case 'system':
        return <Settings color="error" />;
      default:
        return <Info />;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  return (
    <ListItem
      sx={{
        bgcolor: notification.read ? 'transparent' : 'action.hover',
        '&:hover': {
          bgcolor: 'action.hover',
        },
      }}
    >
      <ListItemIcon>{getNotificationIcon()}</ListItemIcon>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: notification.read ? 'normal' : 'bold',
              }}
            >
              {notification.title}
            </Typography>
            <Chip
              label={notification.priority}
              size="small"
              sx={{
                bgcolor: `${getPriorityColor()}20`,
                color: getPriorityColor(),
                height: '20px',
              }}
            />
          </Box>
        }
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary">
              {notification.message}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.5, display: 'block' }}
            >
              {formatDistanceToNow(new Date(notification.timestamp), {
                addSuffix: true,
              })}
            </Typography>
          </Box>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          size="small"
          onClick={(e) => setMenuAnchor(e.currentTarget)}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </ListItemSecondaryAction>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        {!notification.read && (
          <MenuItem onClick={handleMarkAsRead}>
            <ListItemIcon>
              <DoneIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark as read</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </ListItem>
  );
};

export default NotificationItem;
