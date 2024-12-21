import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Chip,
  Box,
} from '@mui/material';
import {
  Laptop,
  Smartphone,
  Tablet,
  Delete,
} from '@mui/icons-material';

interface Device {
  id: string;
  type: 'desktop' | 'mobile' | 'tablet';
  name: string;
  lastActive: Date;
  location: string;
  current: boolean;
}

const mockDevices: Device[] = [
  {
    id: '1',
    type: 'desktop',
    name: 'Windows PC',
    lastActive: new Date(),
    location: 'New York, USA',
    current: true,
  },
  {
    id: '2',
    type: 'mobile',
    name: 'iPhone 13',
    lastActive: new Date(Date.now() - 3600000),
    location: 'New York, USA',
    current: false,
  },
  {
    id: '3',
    type: 'tablet',
    name: 'iPad Pro',
    lastActive: new Date(Date.now() - 86400000),
    location: 'Boston, USA',
    current: false,
  },
];

const DeviceIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'desktop':
      return <Laptop />;
    case 'mobile':
      return <Smartphone />;
    case 'tablet':
      return <Tablet />;
    default:
      return <Laptop />;
  }
};

const DevicesList: React.FC = () => {
  const handleRemoveDevice = (deviceId: string) => {
    // Implement device removal logic
    console.log('Removing device:', deviceId);
  };

  return (
    <List>
      {mockDevices.map((device) => (
        <ListItem key={device.id}>
          <DeviceIcon type={device.type} />
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                {device.name}
                {device.current && (
                  <Chip
                    label="Current Device"
                    size="small"
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                )}
              </Box>
            }
            secondary={
              <Box sx={{ ml: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Last active: {device.lastActive.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Location: {device.location}
                </Typography>
              </Box>
            }
          />
          <ListItemSecondaryAction>
            {!device.current && (
              <IconButton
                edge="end"
                onClick={() => handleRemoveDevice(device.id)}
              >
                <Delete />
              </IconButton>
            )}
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
};

export default DevicesList;
