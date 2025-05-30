import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
  TextField,
  Slider,
  Alert
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const SettingsTab: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    trade: true,
    news: false,
  });
  const [defaultLeverage, setDefaultLeverage] = useState('100');
  const [riskLevel, setRiskLevel] = useState(50);

  const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotifications({
      ...notifications,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSaveSettings = () => {
    // Implement settings save logic
    console.log('Settings saved');
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#121212', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: 'text.primary' }}>Settings</Typography>
        <Button variant="contained" color="primary" onClick={handleSaveSettings}>
          Save Changes
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Display Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: '#1a1a1a', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <DisplaySettingsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Display Settings</Typography>
            </Box>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Theme</InputLabel>
              <Select
                value={theme}
                label="Theme"
                onChange={(e) => setTheme(e.target.value)}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Chart Type</InputLabel>
              <Select
                defaultValue="candlestick"
                label="Chart Type"
              >
                <MenuItem value="candlestick">Candlestick</MenuItem>
                <MenuItem value="line">Line</MenuItem>
                <MenuItem value="bar">Bar</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, bgcolor: '#1a1a1a', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <NotificationsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Notifications</Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={notifications.email}
                  onChange={handleNotificationChange}
                  name="email"
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.push}
                  onChange={handleNotificationChange}
                  name="push"
                />
              }
              label="Push Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.trade}
                  onChange={handleNotificationChange}
                  name="trade"
                />
              }
              label="Trade Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.news}
                  onChange={handleNotificationChange}
                  name="news"
                />
              }
              label="Market News Alerts"
            />
          </Paper>
        </Grid>

        {/* Trading Settings */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, bgcolor: '#1a1a1a', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AccountBalanceIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Trading Settings</Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Default Leverage</InputLabel>
                  <Select
                    value={defaultLeverage}
                    label="Default Leverage"
                    onChange={(e) => setDefaultLeverage(e.target.value)}
                  >
                    <MenuItem value="50">1:50</MenuItem>
                    <MenuItem value="100">1:100</MenuItem>
                    <MenuItem value="200">1:200</MenuItem>
                    <MenuItem value="500">1:500</MenuItem>
                  </Select>
                </FormControl>

                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>Risk Level</Typography>
                  <Slider
                    value={riskLevel}
                    onChange={(e, newValue) => setRiskLevel(newValue as number)}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 0, label: 'Low' },
                      { value: 50, label: 'Medium' },
                      { value: 100, label: 'High' },
                    ]}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Higher leverage increases both potential profits and risks.
                </Alert>
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable Stop Loss by Default"
                />
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable Take Profit by Default"
                />
                <FormControlLabel
                  control={<Switch />}
                  label="Confirm Orders Before Execution"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsTab;
