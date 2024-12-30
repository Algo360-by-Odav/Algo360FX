import React, { useState } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Typography,
  IconButton,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  TrendingUp,
  Warning,
  Info,
  Settings,
  AccountCircle,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';
import { Notification } from '../../services/notifications/NotificationService';
import NotificationItem from './NotificationItem';

interface NotificationGroup {
  date: string;
  notifications: Notification[];
}

interface NotificationGroupsProps {
  notifications: Notification[];
}

const NotificationGroups: React.FC<NotificationGroupsProps> = observer(
  ({ notifications }) => {
    const theme = useTheme();
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

    const groupNotifications = (): NotificationGroup[] => {
      const groups: { [key: string]: Notification[] } = {};

      notifications.forEach((notification) => {
        const date = format(new Date(notification.timestamp), 'yyyy-MM-dd');
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(notification);
      });

      return Object.entries(groups)
        .map(([date, notifications]) => ({
          date,
          notifications: notifications.sort(
            (a, b) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          ),
        }))
        .sort((a, b) => b.date.localeCompare(a.date));
    };

    const toggleGroup = (date: string) => {
      const newExpandedGroups = new Set(expandedGroups);
      if (expandedGroups.has(date)) {
        newExpandedGroups.delete(date);
      } else {
        newExpandedGroups.add(date);
      }
      setExpandedGroups(newExpandedGroups);
    };

    const getGroupTitle = (date: string): string => {
      const notificationDate = new Date(date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (format(notificationDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
        return 'Today';
      } else if (
        format(notificationDate, 'yyyy-MM-dd') ===
        format(yesterday, 'yyyy-MM-dd')
      ) {
        return 'Yesterday';
      } else {
        return format(notificationDate, 'MMMM d, yyyy');
      }
    };

    const getUnreadCount = (notifications: Notification[]): number => {
      return notifications.filter((notification) => !notification.read).length;
    };

    const getPriorityCount = (
      notifications: Notification[],
      priority: string
    ): number => {
      return notifications.filter(
        (notification) => notification.priority === priority
      ).length;
    };

    const groups = groupNotifications();

    return (
      <List>
        {groups.map((group) => (
          <React.Fragment key={group.date}>
            <ListItem
              button
              onClick={() => toggleGroup(group.date)}
              sx={{
                bgcolor: theme.palette.background.default,
                '&:hover': {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="subtitle2">
                      {getGroupTitle(group.date)}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      {getUnreadCount(group.notifications) > 0 && (
                        <Chip
                          label={`${getUnreadCount(
                            group.notifications
                          )} unread`}
                          size="small"
                          color="primary"
                        />
                      )}
                      {getPriorityCount(group.notifications, 'high') > 0 && (
                        <Chip
                          label={`${getPriorityCount(
                            group.notifications,
                            'high'
                          )} high`}
                          size="small"
                          color="error"
                        />
                      )}
                      <IconButton
                        edge="end"
                        size="small"
                        sx={{ ml: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleGroup(group.date);
                        }}
                      >
                        {expandedGroups.has(group.date) ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </Box>
                  </Box>
                }
              />
            </ListItem>
            <Collapse
              in={expandedGroups.has(group.date)}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {group.notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onDelete={() => {
                      // Handle delete
                    }}
                  />
                ))}
              </List>
            </Collapse>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    );
  }
);

export default NotificationGroups;
