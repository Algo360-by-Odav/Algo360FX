import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Badge,
  Button,
  Tabs,
  Tab,
  Chip,
  Divider,
} from '@mui/material';
import {
  Close,
  NotificationsActive,
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Info,
  Delete,
  MoreVert,
} from '@mui/icons-material';
import './NotificationCenter.css';

interface Notification {
  id: string;
  type: 'trade' | 'alert' | 'system' | 'bot';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  action?: {
    label: string;
    handler: () => void;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'trade',
    title: 'Trade Executed',
    message: 'Buy order for EUR/USD executed at 1.2150',
    timestamp: new Date(),
    read: false,
    priority: 'high',
    action: {
      label: 'View Trade',
      handler: () => console.log('View trade'),
    },
  },
  {
    id: '2',
    type: 'alert',
    title: 'Price Alert',
    message: 'EUR/USD reached your target price of 1.2200',
    timestamp: new Date(),
    read: false,
    priority: 'medium',
  },
  {
    id: '3',
    type: 'bot',
    title: 'Bot Status',
    message: 'Trend Follower Pro has completed 10 successful trades',
    timestamp: new Date(),
    read: true,
    priority: 'low',
    action: {
      label: 'View Bot',
      handler: () => console.log('View bot'),
    },
  },
];

interface NotificationCenterProps {
  open: boolean;
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({
  open,
  onClose,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState(mockNotifications);

  const getNotificationIcon = (type: string, priority: string) => {
    switch (type) {
      case 'trade':
        return priority === 'high' ? (
          <TrendingUp color="success" />
        ) : (
          <TrendingDown color="error" />
        );
      case 'alert':
        return <Warning color="warning" />;
      case 'system':
        return <Info color="info" />;
      case 'bot':
        return <CheckCircle color="success" />;
      default:
        return <Info />;
    }
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notif) => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      className="notification-drawer"
    >
      <Box className="notification-header">
        <Box className="header-title">
          <Typography variant="h6">Notifications</Typography>
          <Badge
            badgeContent={notifications.filter((n) => !n.read).length}
            color="error"
          >
            <NotificationsActive />
          </Badge>
        </Box>
        <Box className="header-actions">
          <Button size="small" onClick={markAllAsRead}>
            Mark all as read
          </Button>
          <Button size="small" onClick={clearAll}>
            Clear all
          </Button>
          <IconButton size="small" onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </Box>

      <Tabs
        value={tabValue}
        onChange={(e, v) => setTabValue(v)}
        className="notification-tabs"
      >
        <Tab label="All" />
        <Tab label="Trades" />
        <Tab label="Alerts" />
        <Tab label="Bots" />
      </Tabs>

      <List className="notification-list">
        {notifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem
              className={`notification-item ${
                !notification.read ? 'unread' : ''
              }`}
            >
              <ListItemIcon>
                {getNotificationIcon(notification.type, notification.priority)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box className="notification-title">
                    <Typography variant="subtitle2">
                      {notification.title}
                    </Typography>
                    <Chip
                      size="small"
                      label={notification.type}
                      className={`type-chip ${notification.type}`}
                    />
                  </Box>
                }
                secondary={
                  <Box className="notification-content">
                    <Typography variant="body2">
                      {notification.message}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      className="timestamp"
                    >
                      {notification.timestamp.toLocaleTimeString()}
                    </Typography>
                    {notification.action && (
                      <Button
                        size="small"
                        onClick={notification.action.handler}
                        className="action-button"
                      >
                        {notification.action.label}
                      </Button>
                    )}
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={() => deleteNotification(notification.id)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default NotificationCenter;
