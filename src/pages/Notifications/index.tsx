import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  TrendingUp,
  AttachMoney,
  Event,
  Delete,
  Error,
  CheckCircle,
  Info,
} from '@mui/icons-material';
import { useRootStore } from '../../hooks/useRootStore';
import { format } from 'date-fns';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'trade':
      return <TrendingUp color="primary" />;
    case 'deposit':
      return <AttachMoney color="success" />;
    case 'event':
      return <Event color="info" />;
    case 'error':
      return <Error color="error" />;
    case 'success':
      return <CheckCircle color="success" />;
    default:
      return <Info color="primary" />;
  }
};

const NotificationsPage: React.FC = observer(() => {
  const { notificationStore } = useRootStore();
  const { notifications, markAsRead, deleteNotification } = notificationStore;

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <NotificationsIcon sx={{ mr: 2 }} />
        <Typography variant="h4">Notifications</Typography>
      </Box>

      <List>
        {notifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem
              sx={{
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                '&:hover': { bgcolor: 'action.selected' },
              }}
            >
              <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
              <ListItemText
                primary={notification.message}
                secondary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(notification.timestamp), 'PPp')}
                    </Typography>
                    <Chip
                      label={notification.type}
                      size="small"
                      color={
                        notification.type === 'error' ? 'error' : 'primary'
                      }
                      variant="outlined"
                    />
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteNotification(notification.id)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
        {notifications.length === 0 && (
          <ListItem>
            <ListItemText
              primary="No notifications"
              secondary="You're all caught up!"
            />
          </ListItem>
        )}
      </List>
    </Container>
  );
});

export default NotificationsPage;
