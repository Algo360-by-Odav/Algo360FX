import React, { useState } from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Divider,
} from '@mui/material';
import { observer } from 'mobx-react-lite';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const Settings: React.FC = observer(() => {
  const [tabValue, setTabValue] = useState(0);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sound: true,
      priceAlerts: true,
      newsAlerts: true,
      tradeExecutions: true,
    },
    appearance: {
      theme: 'dark',
      chartStyle: 'candlestick',
      defaultTimeframe: '1H',
      showGrid: true,
    },
    trading: {
      defaultLotSize: '0.1',
      riskPerTrade: '1',
      stopLoss: '50',
      takeProfit: '100',
      confirmOrders: true,
      showPositionSize: true,
    },
    security: {
      twoFactor: true,
      sessionTimeout: '30',
      ipWhitelist: '',
    },
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Notifications" />
            <Tab label="Appearance" />
            <Tab label="Trading" />
            <Tab label="Security" />
          </Tabs>
        </Box>

        {/* Notifications Settings */}
        <TabPanel value={tabValue} index={0}>
          <List>
            <ListItem>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive important updates via email"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.notifications.email}
                  onChange={() => {}}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Push Notifications"
                secondary="Receive notifications in your browser"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.notifications.push}
                  onChange={() => {}}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Sound Alerts"
                secondary="Play sound for important events"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.notifications.sound}
                  onChange={() => {}}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Alert Types
            </Typography>
            <ListItem>
              <ListItemText
                primary="Price Alerts"
                secondary="Notifications for price movements"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.notifications.priceAlerts}
                  onChange={() => {}}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="News Alerts"
                secondary="Important market news and events"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.notifications.newsAlerts}
                  onChange={() => {}}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Trade Executions"
                secondary="Order fills and trade updates"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  checked={settings.notifications.tradeExecutions}
                  onChange={() => {}}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </TabPanel>

        {/* Appearance Settings */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={settings.appearance.theme}
                  label="Theme"
                >
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="light">Light</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Chart Style</InputLabel>
                <Select
                  value={settings.appearance.chartStyle}
                  label="Chart Style"
                >
                  <MenuItem value="candlestick">Candlestick</MenuItem>
                  <MenuItem value="line">Line</MenuItem>
                  <MenuItem value="bar">Bar</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Default Timeframe</InputLabel>
                <Select
                  value={settings.appearance.defaultTimeframe}
                  label="Default Timeframe"
                >
                  <MenuItem value="1M">1 Minute</MenuItem>
                  <MenuItem value="5M">5 Minutes</MenuItem>
                  <MenuItem value="15M">15 Minutes</MenuItem>
                  <MenuItem value="1H">1 Hour</MenuItem>
                  <MenuItem value="4H">4 Hours</MenuItem>
                  <MenuItem value="1D">1 Day</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.appearance.showGrid}
                    onChange={() => {}}
                  />
                }
                label="Show Grid Lines on Charts"
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Trading Settings */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Default Lot Size"
                value={settings.trading.defaultLotSize}
                type="number"
                inputProps={{ step: '0.01' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Risk per Trade (%)"
                value={settings.trading.riskPerTrade}
                type="number"
                inputProps={{ step: '0.1' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Default Stop Loss (pips)"
                value={settings.trading.stopLoss}
                type="number"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Default Take Profit (pips)"
                value={settings.trading.takeProfit}
                type="number"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.trading.confirmOrders}
                    onChange={() => {}}
                  />
                }
                label="Confirm Orders Before Execution"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.trading.showPositionSize}
                    onChange={() => {}}
                  />
                }
                label="Show Position Size Calculator"
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Security Settings */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security.twoFactor}
                    onChange={() => {}}
                  />
                }
                label="Two-Factor Authentication"
              />
              {settings.security.twoFactor && (
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2 }}
                >
                  Configure 2FA
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Session Timeout</InputLabel>
                <Select
                  value={settings.security.sessionTimeout}
                  label="Session Timeout"
                >
                  <MenuItem value="15">15 minutes</MenuItem>
                  <MenuItem value="30">30 minutes</MenuItem>
                  <MenuItem value="60">1 hour</MenuItem>
                  <MenuItem value="never">Never</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="IP Whitelist"
                value={settings.security.ipWhitelist}
                multiline
                rows={4}
                helperText="Enter IP addresses separated by commas"
              />
            </Grid>
          </Grid>
        </TabPanel>
      </Card>
    </Box>
  );
});

export default Settings;
