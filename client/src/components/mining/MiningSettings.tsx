import React, { useState } from 'react';
import withMiningObserver from './withMiningObserver';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  Paper,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Settings,
  Save,
  ExpandMore,
  PowerSettingsNew,
  Speed,
  Bolt,
  MonetizationOn,
  CheckCircle,
  Warning,
  Security,
  Sync,
  Notifications,
  Language,
  CloudDownload,
  DarkMode,
  LightMode,
  ColorLens,
  RestartAlt,
  Delete,
  Info
} from '@mui/icons-material';

interface Props {
  store: any;
}

const MiningSettings: React.FC<Props> = ({ store }) => {
  // Create a safeguarded settings object with default values
  const safeSettings = {
    general: {
      theme: 'system',
      notifications: true,
      soundAlerts: true,
      autoUpdates: true,
      language: 'en',
      currency: 'USD',
      temperatureUnit: 'C',
      hashRateUnit: 'MH/s'
    },
    mining: {
      autoStart: false,
      autoRestart: false,
      idleDetection: false,
      minimumIdleTime: 10,
      stopOnUserActivity: false,
      powerManagement: 'balanced',
      maxTemperature: 75,
      nightMode: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
        reducedPower: 70
      }
    },
    appearance: {
      compactView: false,
      darkMode: 'system',
      showDetailedStats: true,
      animationsEnabled: true,
      accentColor: '#2196f3'
    },
    advanced: {
      enableOverclocking: false,
      manageExternalDevices: false,
      loggingLevel: 'info',
      autoTuning: false,
      developerMode: false,
      customMiningParams: '',
      startWithOS: false,
      minimizeToTray: false,
      preventSleep: false,
      priority: {
        high: false,
        affinity: 'all-cores'
      },
      api: {
        enabled: false,
        port: 4000,
        readonly: true,
        allowRemote: false,
        token: ''
      }
    }
  };
  
  // Merge actual settings with defaults
  const settings = store?.settings ? {
    general: { ...safeSettings.general, ...store.settings?.general },
    mining: { ...safeSettings.mining, ...store.settings?.mining },
    appearance: { ...safeSettings.appearance, ...store.settings?.appearance },
    advanced: { 
      ...safeSettings.advanced, 
      ...store.settings?.advanced,
      priority: { ...safeSettings.advanced.priority, ...store.settings?.advanced?.priority },
      api: { ...safeSettings.advanced.api, ...store.settings?.advanced?.api }
    }
  } : safeSettings;
  
  // Check if store is undefined
  if (!store) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Loading Mining Settings...</Typography>
        </Paper>
      </Box>
    );
  }
  const [expandedPanel, setExpandedPanel] = useState<string | false>('general');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: string; callback: () => void } | null>(null);
  
  const handlePanelChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedPanel(isExpanded ? panel : false);
  };
  
  const handleSaveSettings = () => {
    // In a real app, this would save all settings
    setNotification({
      open: true,
      message: 'Settings saved successfully',
      severity: 'success'
    });
  };
  
  const handleResetSettings = () => {
    setConfirmAction({
      type: 'reset',
      callback: () => {
        // In a real app, this would reset settings to defaults
        setNotification({
          open: true,
          message: 'Settings reset to defaults',
          severity: 'info'
        });
        setConfirmDialogOpen(false);
      }
    });
    setConfirmDialogOpen(true);
  };
  
  const handleClearData = () => {
    setConfirmAction({
      type: 'clear',
      callback: () => {
        // In a real app, this would clear all mining data
        setNotification({
          open: true,
          message: 'Mining data has been cleared',
          severity: 'warning'
        });
        setConfirmDialogOpen(false);
      }
    });
    setConfirmDialogOpen(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Mining Settings
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RestartAlt />}
            onClick={handleResetSettings}
            sx={{ mr: 2 }}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </Box>
      </Box>

      {/* General Settings */}
      <Accordion 
        expanded={expandedPanel === 'general'} 
        onChange={handlePanelChange('general')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="general-settings-content"
          id="general-settings-header"
        >
          <Typography variant="h6">General Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Appearance" />
                <Divider />
                <CardContent>
                  <FormControlLabel
                    control={<Switch checked={store.settings.darkMode} />}
                    label="Dark Mode"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="theme-color-label">Theme Color</InputLabel>
                    <Select
                      labelId="theme-color-label"
                      value={store.settings.themeColor}
                      label="Theme Color"
                    >
                      <MenuItem value="blue">Blue</MenuItem>
                      <MenuItem value="green">Green</MenuItem>
                      <MenuItem value="purple">Purple</MenuItem>
                      <MenuItem value="orange">Orange</MenuItem>
                      <MenuItem value="red">Red</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <FormControlLabel
                    control={<Switch checked={store.settings.compactView} />}
                    label="Compact View"
                    sx={{ display: 'block' }}
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Notifications" />
                <Divider />
                <CardContent>
                  <FormControlLabel
                    control={<Switch checked={store.settings.notifications.enabled} />}
                    label="Enable Notifications"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Notification Types
                  </Typography>
                  
                  <FormControlLabel
                    control={<Switch checked={store.settings.notifications.critical} />}
                    label="Critical Alerts"
                    sx={{ ml: 2, display: 'block' }}
                  />
                  
                  <FormControlLabel
                    control={<Switch checked={store.settings.notifications.warnings} />}
                    label="Warnings"
                    sx={{ ml: 2, display: 'block' }}
                  />
                  
                  <FormControlLabel
                    control={<Switch checked={store.settings.notifications.info} />}
                    label="Information"
                    sx={{ ml: 2, display: 'block' }}
                  />
                  
                  <FormControlLabel
                    control={<Switch checked={store.settings.notifications.achievements} />}
                    label="Achievements"
                    sx={{ ml: 2, display: 'block' }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Mining Settings */}
      <Accordion 
        expanded={expandedPanel === 'mining'} 
        onChange={handlePanelChange('mining')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="mining-settings-content"
          id="mining-settings-header"
        >
          <Typography variant="h6">Mining Configuration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="Auto-Mining Settings" 
                  action={
                    <Tooltip title="Configure how mining equipment automatically operates">
                      <IconButton size="small">
                        <Info />
                      </IconButton>
                    </Tooltip>
                  }
                />
                <Divider />
                <CardContent>
                  <FormControlLabel
                    control={<Switch checked={settings.mining.autoStart} />}
                    label="Auto-start mining on system boot"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <FormControlLabel
                    control={<Switch checked={settings.mining.autoRestart} />}
                    label="Auto-restart after failures"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Auto-shutdown Temperature
                  </Typography>
                  <Slider
                    value={settings.mining.maxTemperature}
                    min={70}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 70, label: '70°C' },
                      { value: 85, label: '85°C' },
                      { value: 100, label: '100°C' },
                    ]}
                    sx={{ mb: 3 }}
                  />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Power Consumption Limit
                  </Typography>
                  <Slider
                    value={store.settings.mining.powerLimit}
                    min={50}
                    max={100}
                    step={5}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 50, label: '50%' },
                      { value: 75, label: '75%' },
                      { value: 100, label: '100%' },
                    ]}
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardHeader title="Performance Optimization" />
                <Divider />
                <CardContent>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="optimization-mode-label">Optimization Mode</InputLabel>
                    <Select
                      labelId="optimization-mode-label"
                      value={store.settings.mining.optimizationMode}
                      label="Optimization Mode"
                    >
                      <MenuItem value="efficiency">Efficiency (Power Saving)</MenuItem>
                      <MenuItem value="balanced">Balanced</MenuItem>
                      <MenuItem value="performance">Performance (Max Hashrate)</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    GPU Memory Clock Offset
                  </Typography>
                  <Slider
                    value={store.settings.mining.memoryOffset}
                    min={-500}
                    max={1500}
                    step={50}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: -500, label: '-500' },
                      { value: 0, label: '0' },
                      { value: 1500, label: '1500' },
                    ]}
                    sx={{ mb: 3 }}
                  />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    GPU Core Clock Offset
                  </Typography>
                  <Slider
                    value={store.settings.mining.coreOffset}
                    min={-200}
                    max={200}
                    step={10}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: -200, label: '-200' },
                      { value: 0, label: '0' },
                      { value: 200, label: '200' },
                    ]}
                  />
                </CardContent>
              </Card>
              
              <Alert severity="warning">
                Incorrect overclocking settings may cause system instability. Use caution when adjusting these values.
              </Alert>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Pool & Network Settings */}
      <Accordion 
        expanded={expandedPanel === 'pool'} 
        onChange={handlePanelChange('pool')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="pool-settings-content"
          id="pool-settings-header"
        >
          <Typography variant="h6">Pool & Network Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Pool Configuration" />
                <Divider />
                <CardContent>
                  <FormControlLabel
                    control={<Switch checked={store.settings.pool.autoSwitch} />}
                    label="Auto-switch to most profitable pool"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Minimum Efficiency Threshold for Auto-Switch
                  </Typography>
                  <Slider
                    value={store.settings.pool.minEfficiencyThreshold * 100}
                    min={80}
                    max={99}
                    step={1}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 80, label: '80%' },
                      { value: 90, label: '90%' },
                      { value: 99, label: '99%' },
                    ]}
                    sx={{ mb: 3 }}
                  />
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel id="preferred-pool-label">Preferred Pool</InputLabel>
                    <Select
                      labelId="preferred-pool-label"
                      value={store.settings.pool.preferredPool}
                      label="Preferred Pool"
                    >
                      {store.poolStats.availablePools.map((pool: string) => (
                        <MenuItem key={pool} value={pool}>{pool}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    label="Wallet Address"
                    value={store.settings.pool.walletAddress}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Worker Name"
                    value={store.settings.pool.workerName}
                    variant="outlined"
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader title="Network Configuration" />
                <Divider />
                <CardContent>
                  <FormControlLabel
                    control={<Switch checked={store.settings.network.useSSL} />}
                    label="Use SSL for pool connections"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <FormControlLabel
                    control={<Switch checked={store.settings.network.useBackupPools} />}
                    label="Use backup pools when primary is unavailable"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <FormControlLabel
                    control={<Switch checked={store.settings.network.useProxy} />}
                    label="Use proxy for mining connections"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Proxy Address"
                    value={store.settings.network.proxyAddress}
                    variant="outlined"
                    disabled={!store.settings.network.useProxy}
                    sx={{ mb: 2 }}
                  />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Connection Timeout (seconds)
                  </Typography>
                  <Slider
                    value={store.settings.network.connectionTimeout}
                    min={10}
                    max={120}
                    step={5}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 10, label: '10s' },
                      { value: 60, label: '60s' },
                      { value: 120, label: '120s' },
                    ]}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Advanced Settings */}
      <Accordion 
        expanded={expandedPanel === 'advanced'} 
        onChange={handlePanelChange('advanced')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="advanced-settings-content"
          id="advanced-settings-header"
        >
          <Typography variant="h6">Advanced Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="Data Management" 
                  action={
                    <Chip
                      label="Advanced"
                      color="warning"
                      size="small"
                    />
                  }
                />
                <Divider />
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    Data Retention Period
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <Select
                      value={store.settings.advanced.dataRetention}
                    >
                      <MenuItem value={7}>7 days</MenuItem>
                      <MenuItem value={30}>30 days</MenuItem>
                      <MenuItem value={90}>90 days</MenuItem>
                      <MenuItem value={365}>1 year</MenuItem>
                      <MenuItem value={-1}>Indefinitely</MenuItem>
                    </Select>
                  </FormControl>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleClearData}
                    fullWidth
                  >
                    Clear All Mining Data
                  </Button>
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Export & Import
                  </Typography>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CloudDownload />}
                    sx={{ mb: 2 }}
                  >
                    Export Settings
                  </Button>
                  
                  <Button
                    variant="outlined"
                    fullWidth
                  >
                    Import Settings
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardHeader 
                  title="System Integration" 
                  action={
                    <Tooltip title="These settings affect how mining software integrates with your operating system">
                      <IconButton size="small">
                        <Info />
                      </IconButton>
                    </Tooltip>
                  }
                />
                <Divider />
                <CardContent>
                  <FormControlLabel
                    control={<Switch checked={settings.advanced.startWithOS} />}
                    label="Start application with operating system"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <FormControlLabel
                    control={<Switch checked={settings.advanced.minimizeToTray} />}
                    label="Minimize to system tray"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <FormControlLabel
                    control={<Switch checked={settings.advanced.preventSleep} />}
                    label="Prevent system sleep while mining"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <FormControlLabel
                    control={<Switch checked={settings.advanced.priority.high} />}
                    label="Run mining software with high priority"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    API Access
                  </Typography>
                  
                  <FormControlLabel
                    control={<Switch checked={settings.advanced.api.enabled} />}
                    label="Enable API access"
                    sx={{ mb: 2, display: 'block' }}
                  />
                  
                  <TextField
                    fullWidth
                    label="API Port"
                    type="number"
                    value={settings.advanced.api.port}
                    variant="outlined"
                    disabled={!settings.advanced.api.enabled}
                    sx={{ mb: 2 }}
                  />
                  
                  <FormControlLabel
                    control={<Switch checked={settings.advanced.api.readonly} />}
                    label="Read-only API (recommended)"
                    disabled={!settings.advanced.api.enabled}
                    sx={{ mb: 2, display: 'block', ml: 2 }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>
          {confirmAction?.type === 'reset' ? 'Reset Settings' : 'Clear Mining Data'}
        </DialogTitle>
        <DialogContent>
          {confirmAction?.type === 'reset' ? (
            <Typography>
              Are you sure you want to reset all settings to their default values? This action cannot be undone.
            </Typography>
          ) : (
            <Typography>
              Are you sure you want to clear all mining data? This will delete all history, statistics, and performance data. This action cannot be undone.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => confirmAction?.callback()} 
            color={confirmAction?.type === 'clear' ? 'error' : 'primary'}
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification */}
      <Alert
        severity={notification.severity as any}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
          display: notification.open ? 'flex' : 'none',
          boxShadow: 3
        }}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        {notification.message}
      </Alert>
    </Box>
  );
};

export default withMiningObserver(MiningSettings);
