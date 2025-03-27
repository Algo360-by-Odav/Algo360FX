import React, { useEffect } from 'react';
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { StoreContext } from '../../stores/StoreProvider';
import { format } from 'date-fns';

interface NewsNotification {
  id: string;
  title: string;
  timestamp: string;
  read: boolean;
  type: 'high_impact' | 'breaking' | 'price_alert';
}

const NewsNotifications: React.FC = observer(() => {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error('NewsNotifications must be used within a StoreProvider');
  }
  const { newsStore } = store;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = React.useState<NewsNotification[]>([]);

  useEffect(() => {
    // Subscribe to news updates
    const unsubscribe = subscribeToNewsUpdates((newNotification) => {
      setNotifications(prev => [newNotification, ...prev]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification: NewsNotification) => {
    // Mark notification as read
    setNotifications(prev =>
      prev.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
    
    // Handle notification action based on type
    switch (notification.type) {
      case 'high_impact':
        // Navigate to news details
        break;
      case 'breaking':
        // Show breaking news modal
        break;
      case 'price_alert':
        // Navigate to chart
        break;
    }
    
    handleClose();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ ml: 2 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              No new notifications
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                py: 1.5,
                px: 2,
                borderLeft: 3,
                borderColor: getNotificationColor(notification.type),
                bgcolor: notification.read ? 'inherit' : 'action.hover',
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  {!notification.read && (
                    <CircleIcon
                      sx={{
                        fontSize: 8,
                        color: 'primary.main',
                        mr: 1,
                      }}
                    />
                  )}
                  <Typography variant="subtitle2">
                    {notification.title}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {format(new Date(notification.timestamp), 'MMM d, HH:mm')}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
});

// Helper function to get notification color
function getNotificationColor(type: NewsNotification['type']): string {
  switch (type) {
    case 'high_impact':
      return 'error.main';
    case 'breaking':
      return 'warning.main';
    case 'price_alert':
      return 'info.main';
    default:
      return 'grey.300';
  }
}

// Mock function to simulate subscribing to news updates
function subscribeToNewsUpdates(callback: (notification: NewsNotification) => void) {
  const interval = setInterval(() => {
    // Simulate receiving new notifications
    const types: NewsNotification['type'][] = ['high_impact', 'breaking', 'price_alert'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    callback({
      id: Math.random().toString(36).substr(2, 9),
      title: `New ${randomType.replace('_', ' ')} news alert`,
      timestamp: new Date().toISOString(),
      read: false,
      type: randomType,
    });
  }, 300000); // Every 5 minutes

  return () => clearInterval(interval);
}

export default NewsNotifications;

