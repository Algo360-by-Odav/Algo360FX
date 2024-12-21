import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  Security,
  Notifications,
  Language,
  AccountCircle,
  Delete,
  Edit,
} from '@mui/icons-material';
import { useAuthStore } from '../../stores/AuthStore';
import DeleteAccountDialog from './components/DeleteAccountDialog';
import TimeZoneSelect from './components/TimeZoneSelect';
import LanguageSelect from './components/LanguageSelect';
import './Settings.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index} role="tabpanel">
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AccountSettings: React.FC = observer(() => {
  const authStore = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [settings, setSettings] = useState({
    email: authStore.user?.email || '',
    phone: authStore.user?.phone || '',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: true,
      trades: true,
      news: false,
      marketing: false,
    },
    tradingPreferences: {
      defaultLeverage: 1,
      riskLevel: 'medium',
      autoTrade: false,
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSettingChange = (
    section: string,
    setting: string,
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [setting]: value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    try {
      // Implement settings save logic
      console.log('Saving settings:', settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <Grid container>
          <Grid item xs={12}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab
                  icon={<AccountCircle />}
                  label="Account"
                  iconPosition="start"
                />
                <Tab
                  icon={<Security />}
                  label="Security"
                  iconPosition="start"
                />
                <Tab
                  icon={<Notifications />}
                  label="Notifications"
                  iconPosition="start"
                />
                <Tab
                  icon={<Language />}
                  label="Preferences"
                  iconPosition="start"
                />
              </Tabs>
            </Box>
          </Grid>

          <Grid item xs={12}>
            {/* Account Settings */}
            <TabPanel value={activeTab} index={0}>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={settings.email}
                    disabled
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    value={settings.phone}
                    onChange={(e) =>
                      setSettings({ ...settings, phone: e.target.value })
                    }
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom color="error">
                Danger Zone
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={() => setOpenDeleteDialog(true)}
              >
                Delete Account
              </Button>
            </TabPanel>

            {/* Security Settings */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="h6" gutterBottom>
                Security Settings
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary="Secure your account with 2FA"
                  />
                  <ListItemSecondaryAction>
                    <Button variant="outlined" color="primary">
                      Enable 2FA
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Password"
                    secondary="Last changed 30 days ago"
                  />
                  <ListItemSecondaryAction>
                    <Button variant="outlined">
                      Change Password
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Active Sessions"
                    secondary="Manage your active sessions"
                  />
                  <ListItemSecondaryAction>
                    <Button variant="outlined">
                      View Sessions
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </TabPanel>

            {/* Notification Settings */}
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h6" gutterBottom>
                Notification Preferences
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive important updates via email"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.email}
                      onChange={(e) =>
                        handleSettingChange(
                          'notifications',
                          'email',
                          e.target.checked
                        )
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Receive notifications on your device"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.push}
                      onChange={(e) =>
                        handleSettingChange(
                          'notifications',
                          'push',
                          e.target.checked
                        )
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Trade Notifications"
                    secondary="Get notified about your trades"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.trades}
                      onChange={(e) =>
                        handleSettingChange(
                          'notifications',
                          'trades',
                          e.target.checked
                        )
                      }
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </TabPanel>

            {/* Preferences */}
            <TabPanel value={activeTab} index={3}>
              <Typography variant="h6" gutterBottom>
                Regional Preferences
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <LanguageSelect
                    value={settings.language}
                    onChange={(value) =>
                      setSettings({ ...settings, language: value })
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TimeZoneSelect
                    value={settings.timezone}
                    onChange={(value) =>
                      setSettings({ ...settings, timezone: value })
                    }
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Trading Preferences
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Default Leverage"
                    type="number"
                    value={settings.tradingPreferences.defaultLeverage}
                    onChange={(e) =>
                      handleSettingChange(
                        'tradingPreferences',
                        'defaultLeverage',
                        Number(e.target.value)
                      )
                    }
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.tradingPreferences.autoTrade}
                        onChange={(e) =>
                          handleSettingChange(
                            'tradingPreferences',
                            'autoTrade',
                            e.target.checked
                          )
                        }
                      />
                    }
                    label="Enable Auto-Trading"
                  />
                </Grid>
              </Grid>
            </TabPanel>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleSaveSettings}
          sx={{ mr: 1 }}
        >
          Save Changes
        </Button>
      </Box>

      <DeleteAccountDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      />
    </Container>
  );
});

export default AccountSettings;
