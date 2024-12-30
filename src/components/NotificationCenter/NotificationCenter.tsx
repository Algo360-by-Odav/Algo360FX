import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  IconButton,
  Typography,
  Badge,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Button,
  Divider,
  CircularProgress,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Notifications,
  TrendingUp,
  Warning,
  Info,
  AccountCircle,
  Settings,
  Close,
  MoreVert,
  CheckCircle,
  Error,
  Delete,
  Done,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { notificationStore } from '../../stores/NotificationStore';
import { Notification } from '../../services/notifications/NotificationService';
import NotificationItem from './NotificationItem';
import EmptyState from './EmptyState';
import './NotificationCenter.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, index, value }) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`notification-tabpanel-${index}`}
    aria-labelledby={`notification-tab-${index}`}
    sx={{ flexGrow: 1, overflow: 'auto' }}
  >
    {value === index && children}
  </Box>
);

const NotificationCenter: React.FC = observer(() => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      notificationStore.fetchNotifications();
    }
  }, [open]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    if (newValue === 0) {
      notificationStore.fetchNotifications();
    } else {
      notificationStore.fetchNotifications(1, 20, { read: true });
    }
  };

  const handleMarkAllRead = async () => {
    await notificationStore.markAllAsRead();
    setMenuAnchor(null);
  };

  const handleClearAll = async () => {
    setLoading(true);
    try {
      const notifications = notificationStore.notifications;
      for (const notification of notifications) {
        await notificationStore.deleteNotification(notification.id);
      }
    } finally {
      setLoading(false);
      setMenuAnchor(null);
    }
  };

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      await notificationStore.fetchNotifications(
        notificationStore.currentPage + 1
      );
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (notification: Notification) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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
    <>
      <IconButton
        color="inherit"
        onClick={() => setOpen(true)}
        sx={{ position: 'relative' }}
      >
        <Badge
          badgeContent={notificationStore.unreadCount}
          color="error"
          max={99}
        >
          <Notifications />
        </Badge>
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: '400px',
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6">Notifications</Typography>
          <Box>
            <IconButton
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              size="small"
            >
              <MoreVert />
            </IconButton>
            <IconButton onClick={() => setOpen(false)} size="small">
              <Close />
            </IconButton>
          </Box>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                Unread
                {notificationStore.unreadCount > 0 && (
                  <Chip
                    size="small"
                    label={notificationStore.unreadCount}
                    color="error"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            }
          />
          <Tab label="All" />
        </Tabs>

        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <TabPanel value={activeTab} index={0}>
            {notificationStore.notifications.length === 0 ? (
              <EmptyState
                icon={<Done sx={{ fontSize: 48 }} />}
                title="All caught up!"
                description="You have no unread notifications"
              />
            ) : (
              <List>
                {notificationStore.notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDelete={() =>
                      notificationStore.deleteNotification(notification.id)
                    }
                  />
                ))}
              </List>
            )}
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            {notificationStore.notifications.length === 0 ? (
              <EmptyState
                icon={<Notifications sx={{ fontSize: 48 }} />}
                title="No notifications"
                description="You don't have any notifications yet"
              />
            ) : (
              <List>
                {notificationStore.notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDelete={() =>
                      notificationStore.deleteNotification(notification.id)
                    }
                  />
                ))}
              </List>
            )}
          </TabPanel>

          {notificationStore.notifications.length > 0 &&
            notificationStore.currentPage * notificationStore.pageSize <
              notificationStore.total && (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Button
                  onClick={handleLoadMore}
                  disabled={loading}
                  startIcon={
                    loading && <CircularProgress size={20} color="inherit" />
                  }
                >
                  Load More
                </Button>
              </Box>
            )}
        </Box>

        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={handleMarkAllRead}>
            <ListItemIcon>
              <Done fontSize="small" />
            </ListItemIcon>
            <ListItemText>Mark all as read</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleClearAll}>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Clear all</ListItemText>
          </MenuItem>
        </Menu>
      </Drawer>
    </>
  );
});

export default NotificationCenter;
