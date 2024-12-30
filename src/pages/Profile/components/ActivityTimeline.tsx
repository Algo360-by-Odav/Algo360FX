import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import {
  Typography,
  Box,
  Paper,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  Settings,
  Update,
  Assessment,
  Notifications,
  Security,
  AccountBalance,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

export interface Activity {
  id: string;
  type: 'trade' | 'strategy' | 'update' | 'analysis' | 'alert' | 'security' | 'account';
  description: string;
  timestamp: Date;
  details?: {
    [key: string]: string | number;
  };
  status?: 'success' | 'warning' | 'error' | 'info';
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
  switch (type) {
    case 'trade':
      return <TrendingUp />;
    case 'strategy':
      return <Settings />;
    case 'update':
      return <Update />;
    case 'analysis':
      return <Assessment />;
    case 'alert':
      return <Notifications />;
    case 'security':
      return <Security />;
    case 'account':
      return <AccountBalance />;
    default:
      return <TrendingUp />;
  }
};

const getActivityColor = (type: Activity['type'], status?: Activity['status']) => {
  if (status) {
    switch (status) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'primary';
    }
  }

  switch (type) {
    case 'trade':
      return 'primary';
    case 'strategy':
      return 'secondary';
    case 'update':
      return 'info';
    case 'analysis':
      return 'success';
    case 'alert':
      return 'warning';
    case 'security':
      return 'error';
    case 'account':
      return 'default';
    default:
      return 'primary';
  }
};

const ActivityDetails = ({ details }: { details?: Activity['details'] }) => {
  if (!details) return null;

  return (
    <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {Object.entries(details).map(([key, value]) => (
        <Chip
          key={key}
          label={`${key}: ${value}`}
          size="small"
          variant="outlined"
        />
      ))}
    </Box>
  );
};

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  if (!activities || activities.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          No recent activity
        </Typography>
      </Paper>
    );
  }

  return (
    <Timeline>
      {activities.map((activity) => (
        <TimelineItem key={activity.id}>
          <TimelineOppositeContent sx={{ flex: 0.2 }}>
            <Typography variant="caption" color="textSecondary">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot color={getActivityColor(activity.type, activity.status)}>
              <ActivityIcon type={activity.type} />
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                mb: 2,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Typography variant="body1">
                {activity.description}
              </Typography>
              <ActivityDetails details={activity.details} />
              <Box sx={{ mt: 1 }}>
                <Typography variant="caption" color="textSecondary">
                  {activity.timestamp.toLocaleString()}
                </Typography>
              </Box>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default ActivityTimeline;
