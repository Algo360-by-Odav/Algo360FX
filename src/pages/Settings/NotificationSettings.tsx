import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Container,
  Paper,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Email,
  PhonelinkRing,
  TrendingUp,
  NewReleases,
  Campaign,
  Warning,
  Schedule,
  AccountBalance,
} from '@mui/icons-material';
import { userStore } from '../../stores/UserStore';

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  channels: {
    email: boolean;
    push: boolean;
    sms?: boolean;
  };
  priority: 'high' | 'medium' | 'low';
}

const NotificationSettings: React.FC = observer(() => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [categories, setCategories] = React.useState<NotificationCategory[]>([
    {
      id: 'trades',
      title: 'Trade Execution',
      description: 'Notifications for trade entries, exits, and modifications',
      icon: <TrendingUp />,
      channels: { email: true, push: true, sms: true },
      priority: 'high',
    },
    {
      id: 'alerts',
      title: 'Price Alerts',
      description: 'Custom price alerts and market conditions',
      icon: <Warning />,
      channels: { email: true, push: true },
      priority: 'high',
    },
    {
      id: 'news',
      title: 'Market News',
      description: 'Important market news and economic events',
      icon: <NewReleases />,
      channels: { email: true, push: false },
      priority: 'medium',
    },
    {
      id: 'account',
      title: 'Account Activity',
      description: 'Login attempts, security changes, and profile updates',
      icon: <AccountBalance />,
      channels: { email: true, push: true, sms: true },
      priority: 'high',
    },
    {
      id: 'schedule',
      title: 'Scheduled Reports',
      description: 'Daily, weekly, and monthly performance reports',
      icon: <Schedule />,
      channels: { email: true, push: false },
      priority: 'medium',
    },
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Platform updates, features, and promotional content',
      icon: <Campaign />,
      channels: { email: false, push: false },
      priority: 'low',
    },
  ]);

  useEffect(() => {
    if (userStore.profile?.preferences.notifications) {
      // Sync with server state
      const serverNotifications = userStore.profile.preferences.notifications;
      setCategories(prev =>
        prev.map(category => ({
          ...category,
          channels: {
            ...category.channels,
            email: serverNotifications.email,
            push: serverNotifications.push,
          },
        }))
      );
    }
  }, [userStore.profile]);

  const handleChannelToggle = async (
    categoryId: string,
    channel: 'email' | 'push' | 'sms'
  ) => {
    try {
      const updatedCategories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            channels: {
              ...category.channels,
              [channel]: !category.channels[channel],
            },
          };
        }
        return category;
      });
      setCategories(updatedCategories);

      // Update server state
      await userStore.updateProfile({
        preferences: {
          notifications: {
            [categoryId]: {
              [channel]: !categories.find(c => c.id === categoryId)?.channels[channel],
            },
          },
        },
      });

      setSnackbarMessage('Notification preferences updated');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to update notification preferences');
      setSnackbarOpen(true);
    }
  };

  const handlePriorityChange = (categoryId: string, priority: 'high' | 'medium' | 'low') => {
    setCategories(prev =>
      prev.map(category =>
        category.id === categoryId ? { ...category, priority } : category
      )
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Paper
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1a1f2c 0%, #2d3748 100%)',
          borderRadius: '16px',
          mb: 3,
        }}
      >
        <NotificationsIcon sx={{ fontSize: 40, mr: 2 }} />
        <Box>
          <Typography variant="h5" gutterBottom>
            Notification Settings
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage how and when you receive notifications
          </Typography>
        </Box>
      </Paper>

      {/* Channel Settings */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: '16px' }}>
        <Typography variant="h6" gutterBottom>
          Notification Channels
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                height: '100%',
                bgcolor: 'background.paper',
              }}
            >
              <Email sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Email Notifications
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Receive detailed notifications via email
              </Typography>
              <Button variant="outlined" fullWidth>
                Verify Email
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                height: '100%',
                bgcolor: 'background.paper',
              }}
            >
              <PhonelinkRing sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Push Notifications
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Get instant alerts on your devices
              </Typography>
              <Button variant="outlined" fullWidth>
                Manage Devices
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 2,
                textAlign: 'center',
                height: '100%',
                bgcolor: 'background.paper',
              }}
            >
              <Warning sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                SMS Alerts
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Critical alerts via SMS
              </Typography>
              <Button variant="outlined" fullWidth>
                Add Phone Number
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Notification Categories */}
      <Paper sx={{ p: 3, borderRadius: '16px' }}>
        <Typography variant="h6" gutterBottom>
          Notification Categories
        </Typography>
        <List>
          {categories.map((category, index) => (
            <React.Fragment key={category.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemIcon>{category.icon}</ListItemIcon>
                <ListItemText
                  primary={category.title}
                  secondary={category.description}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={category.priority}
                      label="Priority"
                      onChange={(e) =>
                        handlePriorityChange(
                          category.id,
                          e.target.value as 'high' | 'medium' | 'low'
                        )
                      }
                    >
                      <MenuItem value="high">High</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="low">Low</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Switch
                      checked={category.channels.email}
                      onChange={() => handleChannelToggle(category.id, 'email')}
                      size="small"
                    />
                    <Switch
                      checked={category.channels.push}
                      onChange={() => handleChannelToggle(category.id, 'push')}
                      size="small"
                    />
                    {category.channels.sms !== undefined && (
                      <Switch
                        checked={category.channels.sms}
                        onChange={() => handleChannelToggle(category.id, 'sms')}
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
});

export default NotificationSettings;
