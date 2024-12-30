import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Slider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  useTheme,
} from '@mui/material';
import {
  VolumeUp,
  VolumeOff,
  PlayArrow,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  notificationSoundService,
  NotificationSoundType,
  NotificationPriority,
} from '../../services/notifications/NotificationSoundService';

const NotificationSoundSettings: React.FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(notificationSoundService.isEnabled());
  const [volume, setVolume] = useState(notificationSoundService.getVolume());

  const handleToggleSound = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    notificationSoundService.setEnabled(newEnabled);
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVolume = newValue as number;
    setVolume(newVolume);
    notificationSoundService.setVolume(newVolume);
  };

  const handlePreviewSound = (
    type: NotificationSoundType,
    priority: NotificationPriority = 'medium'
  ) => {
    notificationSoundService.previewSound(type, priority);
  };

  const soundTypes: Array<{
    type: NotificationSoundType;
    label: string;
    priority: NotificationPriority;
  }> = [
    { type: 'trade', label: 'Trade Notification', priority: 'high' },
    { type: 'alert', label: 'Alert Notification', priority: 'high' },
    { type: 'news', label: 'News Notification', priority: 'medium' },
    { type: 'account', label: 'Account Notification', priority: 'medium' },
    { type: 'system', label: 'System Notification', priority: 'low' },
  ];

  return (
    <>
      <Button
        startIcon={<SettingsIcon />}
        onClick={() => setOpen(true)}
        size="small"
      >
        Sound Settings
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Notification Sound Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={enabled}
                  onChange={handleToggleSound}
                  color="primary"
                />
              }
              label="Enable notification sounds"
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3,
            }}
          >
            <IconButton size="small">
              {enabled ? <VolumeUp /> : <VolumeOff />}
            </IconButton>
            <Slider
              value={volume}
              onChange={handleVolumeChange}
              disabled={!enabled}
              min={0}
              max={1}
              step={0.1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${Math.round(value * 100)}%`}
            />
          </Box>

          <Typography variant="subtitle2" gutterBottom>
            Preview Sounds
          </Typography>

          <List>
            {soundTypes.map(({ type, label, priority }) => (
              <ListItem key={type} divider>
                <ListItemText
                  primary={label}
                  secondary={`Priority: ${priority}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handlePreviewSound(type, priority)}
                    disabled={!enabled}
                    size="small"
                  >
                    <PlayArrow />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Notification sounds will play based on the type and priority of the
              notification. High-priority notifications will play an additional
              alert sound.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationSoundSettings;
