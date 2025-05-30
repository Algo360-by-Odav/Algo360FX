import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  Slider,
  Alert,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Notifications,
  Email,
  Telegram,
  WhatsApp,
  Delete,
  Edit,
  Save,
} from '@mui/icons-material';
import { useStores } from '../../stores/StoreProvider';

export const SignalSettings = observer(() => {
  const { signalProviderStore } = useStores();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [telegramNotifications, setTelegramNotifications] = useState(false);
  const [whatsappNotifications, setWhatsappNotifications] = useState(false);
  const [riskMultiplier, setRiskMultiplier] = useState(1);
  const [maxDrawdown, setMaxDrawdown] = useState(10);
  const [dailyLossLimit, setDailyLossLimit] = useState(5);

  const handleRiskMultiplierChange = (_: Event, newValue: number | number[]) => {
    setRiskMultiplier(newValue as number);
  };

  const handleMaxDrawdownChange = (_: Event, newValue: number | number[]) => {
    setMaxDrawdown(newValue as number);
  };

  const handleDailyLossLimitChange = (_: Event, newValue: number | number[]) => {
    setDailyLossLimit(newValue as number);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    color="primary"
                  />
                }
                label="Enable Notifications"
              />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Notification Channels
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive signals and updates via email"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Telegram Notifications"
                  secondary="Connect your Telegram account"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={telegramNotifications}
                    onChange={(e) => setTelegramNotifications(e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="WhatsApp Notifications"
                  secondary="Connect your WhatsApp number"
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    checked={whatsappNotifications}
                    onChange={(e) => setWhatsappNotifications(e.target.checked)}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Auto Trading Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Auto Trading Settings
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={<Switch defaultChecked color="primary" />}
                label="Enable Auto Trading"
              />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Risk Management
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Risk Multiplier</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Slider
                    value={riskMultiplier}
                    onChange={handleRiskMultiplierChange}
                    min={0.1}
                    max={2}
                    step={0.1}
                    marks={[
                      { value: 0.1, label: '0.1x' },
                      { value: 1, label: '1x' },
                      { value: 2, label: '2x' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    {riskMultiplier}x
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Maximum Drawdown (%)</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Slider
                    value={maxDrawdown}
                    onChange={handleMaxDrawdownChange}
                    min={5}
                    max={25}
                    marks={[
                      { value: 5, label: '5%' },
                      { value: 15, label: '15%' },
                      { value: 25, label: '25%' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    {maxDrawdown}%
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>Daily Loss Limit (%)</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                  <Slider
                    value={dailyLossLimit}
                    onChange={handleDailyLossLimitChange}
                    min={1}
                    max={10}
                    marks={[
                      { value: 1, label: '1%' },
                      { value: 5, label: '5%' },
                      { value: 10, label: '10%' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="text.secondary">
                    {dailyLossLimit}%
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Provider Subscriptions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Provider Subscriptions
            </Typography>
            <Grid container spacing={2}>
              {signalProviderStore.getProviders().map((provider) => (
                <Grid item xs={12} md={6} key={provider.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ flex: 1 }}>
                          {provider.name}
                        </Typography>
                        <Chip
                          label={`$${provider.subscription.price}/month`}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {provider.description}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <FormControlLabel
                              control={<Switch defaultChecked />}
                              label="Auto Trade"
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <Button
                              variant="outlined"
                              color="error"
                              startIcon={<Delete />}
                              fullWidth
                            >
                              Unsubscribe
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Save Settings */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<Save />}
            >
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});

