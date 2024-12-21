import React from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import {
  Typography,
  Box,
  Paper,
} from '@mui/material';
import {
  Login,
  Security,
  Edit,
  VpnKey,
} from '@mui/icons-material';

interface Activity {
  id: string;
  type: 'login' | 'security' | 'profile' | '2fa';
  description: string;
  timestamp: Date;
  location?: string;
  device?: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'login',
    description: 'Successful login',
    timestamp: new Date(),
    location: 'New York, USA',
    device: 'Windows PC',
  },
  {
    id: '2',
    type: 'security',
    description: 'Password changed',
    timestamp: new Date(Date.now() - 86400000),
    location: 'New York, USA',
    device: 'Windows PC',
  },
  {
    id: '3',
    type: 'profile',
    description: 'Profile information updated',
    timestamp: new Date(Date.now() - 172800000),
    location: 'New York, USA',
    device: 'iPhone 13',
  },
  {
    id: '4',
    type: '2fa',
    description: 'Two-factor authentication enabled',
    timestamp: new Date(Date.now() - 259200000),
    location: 'New York, USA',
    device: 'Windows PC',
  },
];

const ActivityIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'login':
      return <Login />;
    case 'security':
      return <Security />;
    case 'profile':
      return <Edit />;
    case '2fa':
      return <VpnKey />;
    default:
      return <Security />;
  }
};

const ActivityLog: React.FC = () => {
  return (
    <Timeline>
      {mockActivities.map((activity) => (
        <TimelineItem key={activity.id}>
          <TimelineSeparator>
            <TimelineDot color="primary">
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
              }}
            >
              <Typography variant="h6" component="h3">
                {activity.description}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2" color="textSecondary">
                  {activity.timestamp.toLocaleString()}
                </Typography>
                {activity.location && (
                  <Typography variant="body2" color="textSecondary">
                    Location: {activity.location}
                  </Typography>
                )}
                {activity.device && (
                  <Typography variant="body2" color="textSecondary">
                    Device: {activity.device}
                  </Typography>
                )}
              </Box>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

export default ActivityLog;
