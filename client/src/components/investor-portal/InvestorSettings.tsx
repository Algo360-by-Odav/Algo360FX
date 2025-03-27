import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
} from '@mui/material';
import {
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useStores } from '../../stores/StoreProvider';

interface BrokerConnection {
  id: string;
  name: string;
  status: 'Connected' | 'Disconnected';
  lastConnected?: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
  lastUsed?: string;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  investmentOpportunities: boolean;
  performanceReports: boolean;
  riskAlerts: boolean;
}

export const InvestorSettings: React.FC = observer(() => {
  // Sample data - replace with actual data from your store
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    currency: 'USD',
    language: 'English',
    timezone: 'UTC-8',
  });

  const [brokerConnections, setBrokerConnections] = useState<BrokerConnection[]>([
    {
      id: '1',
      name: 'Alpha Broker',
      status: 'Connected',
      lastConnected: '2024-03-25 14:30:00',
    },
    {
      id: '2',
      name: 'Beta Trading',
      status: 'Disconnected',
      lastConnected: '2024-03-24 09:15:00',
    },
  ]);

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Trading Bot',
      key: 'ak_1234567890abcdef',
      status: 'Active',
      createdAt: '2024-03-20',
      lastUsed: '2024-03-25 15:45:00',
    },
  ]);

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    sms: false,
    investmentOpportunities: true,
    performanceReports: true,
    riskAlerts: true,
  });

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'api' | 'broker'>();
  const [newName, setNewName] = useState('');

  const handleSave = () => {
    // Here you would typically save the changes to your store
    console.log('Saving changes:', {
      profile,
      brokerConnections,
      apiKeys,
      notificationSettings,
    });
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleOpenDialog = (type: 'api' | 'broker') => {
    setDialogType(type);
    setDialogOpen(true);
    setNewName('');
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogType(undefined);
    setNewName('');
  };

  const handleAddBroker = () => {
    if (!newName) return;
    const newBroker: BrokerConnection = {
      id: Date.now().toString(),
      name: newName,
      status: 'Disconnected',
    };
    setBrokerConnections([...brokerConnections, newBroker]);
    handleCloseDialog();
  };

  const handleAddApiKey = () => {
    if (!newName) return;
    const newApiKey: ApiKey = {
      id: Date.now().toString(),
      name: newName,
      key: `ak_${Math.random().toString(36).substr(2, 16)}`,
      status: 'Active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setApiKeys([...apiKeys, newApiKey]);
    handleCloseDialog();
  };

  const handleRemoveBroker = (id: string) => {
    setBrokerConnections(brokerConnections.filter((broker) => broker.id !== id));
  };

  const handleRemoveApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  const handleCopyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  const handleNotificationChange = (setting: keyof NotificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting],
    });
  };

  return (
    <Box>
      {showSuccessAlert && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully
        </Alert>
      )}

      {/* Profile Settings */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Profile Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={profile.currency}
                label="Currency"
                onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="EUR">EUR</MenuItem>
                <MenuItem value="GBP">GBP</MenuItem>
                <MenuItem value="JPY">JPY</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={profile.language}
                label="Language"
                onChange={(e) => setProfile({ ...profile, language: e.target.value })}
              >
                <MenuItem value="English">English</MenuItem>
                <MenuItem value="Spanish">Spanish</MenuItem>
                <MenuItem value="French">French</MenuItem>
                <MenuItem value="German">German</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Timezone</InputLabel>
              <Select
                value={profile.timezone}
                label="Timezone"
                onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
              >
                <MenuItem value="UTC-8">Pacific Time (UTC-8)</MenuItem>
                <MenuItem value="UTC-5">Eastern Time (UTC-5)</MenuItem>
                <MenuItem value="UTC+0">UTC</MenuItem>
                <MenuItem value="UTC+1">Central European Time (UTC+1)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Broker Connections */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Broker Connections</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('broker')}
          >
            Add Broker
          </Button>
        </Box>
        <List>
          {brokerConnections.map((broker, index) => (
            <React.Fragment key={broker.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemText
                  primary={broker.name}
                  secondary={`Last connected: ${broker.lastConnected || 'Never'}`}
                />
                <ListItemSecondaryAction>
                  <Chip
                    label={broker.status}
                    color={broker.status === 'Connected' ? 'success' : 'default'}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveBroker(broker.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* API Keys */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">API Keys</Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('api')}
          >
            Generate New Key
          </Button>
        </Box>
        <List>
          {apiKeys.map((apiKey, index) => (
            <React.Fragment key={apiKey.id}>
              {index > 0 && <Divider />}
              <ListItem>
                <ListItemText
                  primary={apiKey.name}
                  secondary={`Created: ${apiKey.createdAt}${
                    apiKey.lastUsed ? ` • Last used: ${apiKey.lastUsed}` : ''
                  }`}
                />
                <ListItemSecondaryAction>
                  <Chip
                    label={apiKey.status}
                    color={apiKey.status === 'Active' ? 'success' : 'default'}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Tooltip title="Copy API Key">
                    <IconButton
                      onClick={() => handleCopyApiKey(apiKey.key)}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    edge="end"
                    onClick={() => handleRemoveApiKey(apiKey.id)}
                    color="error"
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Notification Settings */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Notification Settings
        </Typography>
        <List>
          <ListItem>
            <ListItemText primary="Email Notifications" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={notificationSettings.email}
                onChange={() => handleNotificationChange('email')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="SMS Notifications" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={notificationSettings.sms}
                onChange={() => handleNotificationChange('sms')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Investment Opportunities"
              secondary="Get notified about new investment opportunities"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={notificationSettings.investmentOpportunities}
                onChange={() => handleNotificationChange('investmentOpportunities')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Performance Reports"
              secondary="Receive periodic performance reports"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={notificationSettings.performanceReports}
                onChange={() => handleNotificationChange('performanceReports')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Risk Alerts"
              secondary="Get notified about important risk events"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={notificationSettings.riskAlerts}
                onChange={() => handleNotificationChange('riskAlerts')}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>

      {/* Save Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          startIcon={<CheckIcon />}
        >
          Save Changes
        </Button>
      </Box>

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {dialogType === 'broker' ? 'Add Broker Connection' : 'Generate New API Key'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CloseIcon />}>
            Cancel
          </Button>
          <Button
            onClick={dialogType === 'broker' ? handleAddBroker : handleAddApiKey}
            variant="contained"
            startIcon={<CheckIcon />}
            disabled={!newName}
          >
            {dialogType === 'broker' ? 'Add' : 'Generate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default InvestorSettings;
