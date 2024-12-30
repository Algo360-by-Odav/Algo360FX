import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface NotificationRule {
  id: string;
  type: 'performance' | 'risk' | 'technical' | 'system';
  condition: string;
  threshold: number;
  channels: string[];
  enabled: boolean;
}

interface NotificationChannel {
  type: 'email' | 'sms' | 'push';
  value: string;
  enabled: boolean;
}

const NotificationsWidget: React.FC = observer(() => {
  const [channels, setChannels] = useState<NotificationChannel[]>([
    { type: 'email', value: 'user@example.com', enabled: true },
    { type: 'sms', value: '+1234567890', enabled: false },
    { type: 'push', value: 'Browser', enabled: true },
  ]);

  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: '1',
      type: 'performance',
      condition: 'Daily P&L exceeds',
      threshold: 500,
      channels: ['email', 'push'],
      enabled: true,
    },
    {
      id: '2',
      type: 'risk',
      condition: 'Drawdown reaches',
      threshold: 10,
      channels: ['email', 'sms', 'push'],
      enabled: true,
    },
    {
      id: '3',
      type: 'technical',
      condition: 'Strategy deviation exceeds',
      threshold: 20,
      channels: ['email'],
      enabled: false,
    },
    {
      id: '4',
      type: 'system',
      condition: 'Connection lost for',
      threshold: 5,
      channels: ['push'],
      enabled: true,
    },
  ]);

  const [newRuleDialog, setNewRuleDialog] = useState(false);
  const [newRule, setNewRule] = useState<Partial<NotificationRule>>({
    type: 'performance',
    condition: '',
    threshold: 0,
    channels: [],
    enabled: true,
  });

  const handleChannelToggle = (index: number) => {
    const newChannels = [...channels];
    newChannels[index].enabled = !newChannels[index].enabled;
    setChannels(newChannels);
  };

  const handleRuleToggle = (id: string) => {
    setRules(rules.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const handleAddRule = () => {
    if (newRule.condition && newRule.threshold !== undefined) {
      const rule: NotificationRule = {
        id: Date.now().toString(),
        type: newRule.type || 'performance',
        condition: newRule.condition,
        threshold: newRule.threshold,
        channels: newRule.channels || [],
        enabled: true,
      };
      setRules([...rules, rule]);
      setNewRuleDialog(false);
      setNewRule({
        type: 'performance',
        condition: '',
        threshold: 0,
        channels: [],
        enabled: true,
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <CheckCircleIcon color="success" />;
      case 'risk':
        return <WarningIcon color="error" />;
      case 'technical':
        return <InfoIcon color="primary" />;
      case 'system':
        return <NotificationsIcon color="warning" />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Notifications & Alerts
        </Typography>

        <Grid container spacing={3}>
          {/* Notification Channels */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Notification Channels
            </Typography>
            <List>
              {channels.map((channel, index) => (
                <ListItem key={channel.type}>
                  <ListItemIcon>
                    {channel.type === 'email' ? <EmailIcon /> :
                     channel.type === 'sms' ? <PhoneIcon /> :
                     <NotificationsIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={channel.type.toUpperCase()}
                    secondary={channel.value}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={channel.enabled}
                      onChange={() => handleChannelToggle(index)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Notification Rules */}
          <Grid item xs={12} md={8}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1">
                Alert Rules
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() => setNewRuleDialog(true)}
              >
                Add Rule
              </Button>
            </Box>
            <List>
              {rules.map((rule) => (
                <ListItem
                  key={rule.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(rule.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body1">
                          {rule.condition} {rule.threshold}
                          {rule.type === 'risk' ? '%' : rule.type === 'system' ? ' min' : ''}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box display="flex" gap={1} mt={1}>
                        {rule.channels.map((channel) => (
                          <Chip
                            key={channel}
                            label={channel}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      checked={rule.enabled}
                      onChange={() => handleRuleToggle(rule.id)}
                    />
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteRule(rule.id)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>

        {/* Add Rule Dialog */}
        <Dialog open={newRuleDialog} onClose={() => setNewRuleDialog(false)}>
          <DialogTitle>Add Alert Rule</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Alert Type</InputLabel>
                  <Select
                    value={newRule.type}
                    label="Alert Type"
                    onChange={(e) => setNewRule({ ...newRule, type: e.target.value as any })}
                  >
                    <MenuItem value="performance">Performance</MenuItem>
                    <MenuItem value="risk">Risk</MenuItem>
                    <MenuItem value="technical">Technical</MenuItem>
                    <MenuItem value="system">System</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Condition"
                  value={newRule.condition}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Threshold"
                  type="number"
                  value={newRule.threshold}
                  onChange={(e) => setNewRule({ ...newRule, threshold: parseFloat(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Notification Channels</InputLabel>
                  <Select
                    multiple
                    value={newRule.channels || []}
                    label="Notification Channels"
                    onChange={(e) => setNewRule({ ...newRule, channels: e.target.value as string[] })}
                    renderValue={(selected) => (
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="sms">SMS</MenuItem>
                    <MenuItem value="push">Push Notification</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setNewRuleDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAddRule}
              disabled={!newRule.condition || newRule.threshold === undefined}
            >
              Add Rule
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
});

export default NotificationsWidget;
