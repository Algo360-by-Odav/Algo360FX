import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Button,
  Card,
  CardContent,
  Menu,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  MarkEmailRead as MarkReadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface Notification {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: 'Trading' | 'Risk' | 'Compliance' | 'System';
}

export const Notifications: React.FC = observer(() => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNotification, setSelectedNotification] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    unreadOnly: false,
    trading: true,
    risk: true,
    compliance: true,
    system: true,
  });

  // Sample data - replace with actual data from your store
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'warning',
      title: 'High Risk Exposure',
      message: 'EUR/USD position exceeds risk threshold',
      timestamp: '2024-03-25 14:30:00',
      read: false,
      category: 'Risk',
    },
    {
      id: '2',
      type: 'success',
      title: 'Trade Executed',
      message: 'Buy order for GBP/USD executed successfully',
      timestamp: '2024-03-25 14:25:00',
      read: true,
      category: 'Trading',
    },
    {
      id: '3',
      type: 'info',
      title: 'Compliance Update',
      message: 'New KYC requirements effective from next month',
      timestamp: '2024-03-25 14:20:00',
      read: false,
      category: 'Compliance',
    },
  ];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, notificationId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notificationId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Trading':
        return 'primary';
      case 'Risk':
        return 'error';
      case 'Compliance':
        return 'warning';
      case 'System':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filters.unreadOnly && notification.read) return false;
    switch (notification.category) {
      case 'Trading':
        return filters.trading;
      case 'Risk':
        return filters.risk;
      case 'Compliance':
        return filters.compliance;
      case 'System':
        return filters.system;
      default:
        return true;
    }
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Notifications</Typography>
        <Box>
          <Button startIcon={<FilterIcon />} sx={{ mr: 1 }} variant="outlined" size="small">
            Filter
          </Button>
          <Button startIcon={<RefreshIcon />} variant="outlined" size="small">
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={filters.unreadOnly}
              onChange={(e) => setFilters({ ...filters, unreadOnly: e.target.checked })}
            />
          }
          label="Unread Only"
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          {Object.entries(filters)
            .filter(([key]) => key !== 'unreadOnly')
            .map(([key, value]) => (
              <Chip
                key={key}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                color={value ? 'primary' : 'default'}
                onClick={() => setFilters({ ...filters, [key]: !value })}
                size="small"
                variant={value ? 'filled' : 'outlined'}
              />
            ))}
        </Box>
      </Box>

      {/* Notifications List */}
      <List>
        {filteredNotifications.map((notification) => (
          <React.Fragment key={notification.id}>
            <ListItem
              sx={{
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <ListItemIcon>{getNotificationIcon(notification.type)}</ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="subtitle2">{notification.title}</Typography>
                    <Chip
                      label={notification.category}
                      size="small"
                      color={getCategoryColor(notification.category)}
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.timestamp}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(e) => handleMenuClick(e, notification.id)}
                >
                  <MoreVertIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
      >
        <MenuItem>
          <ListItemIcon>
            <MarkReadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Mark as Read</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
});

export default Notifications;
