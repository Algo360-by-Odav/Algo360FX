import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/RootStoreContext';

interface AutomationSettings {
  enabled: boolean;
  maxDailyTrades: number;
  useSignalProvider: boolean;
  useAlgoTrading: boolean;
  useCopyTrading: boolean;
  maxDrawdown: number;
  tradingHours: {
    start: string;
    end: string;
  };
}

interface TradingStrategy {
  id: string;
  name: string;
  type: 'Signal' | 'Algo' | 'Copy';
  status: 'Active' | 'Paused' | 'Stopped';
  performance: number;
}

const AutomatedTrading: React.FC = observer(() => {
  const { tradingStore } = useRootStore();
  const [settings, setSettings] = useState<AutomationSettings>({
    enabled: false,
    maxDailyTrades: 10,
    useSignalProvider: true,
    useAlgoTrading: true,
    useCopyTrading: false,
    maxDrawdown: 5,
    tradingHours: {
      start: '09:00',
      end: '17:00',
    },
  });

  const [strategies] = useState<TradingStrategy[]>([
    {
      id: '1',
      name: 'Trend Following',
      type: 'Algo',
      status: 'Active',
      performance: 12.5,
    },
    {
      id: '2',
      name: 'Top Signals Pro',
      type: 'Signal',
      status: 'Active',
      performance: 8.3,
    },
    {
      id: '3',
      name: 'Master Trader Copy',
      type: 'Copy',
      status: 'Paused',
      performance: -2.1,
    },
  ]);

  const handleSettingChange = (setting: keyof AutomationSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleTimeChange = (type: 'start' | 'end') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSettings((prev) => ({
      ...prev,
      tradingHours: {
        ...prev.tradingHours,
        [type]: event.target.value,
      },
    }));
  };

  const getStatusColor = (status: TradingStrategy['status']) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Paused':
        return 'warning';
      case 'Stopped':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Main Control Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center' }}>
                {settings.enabled ? (
                  <PlayIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                ) : (
                  <StopIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
                )}
                <Typography variant="h6" gutterBottom>
                  Automated Trading
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enabled}
                      onChange={handleSettingChange('enabled')}
                      color="success"
                    />
                  }
                  label={settings.enabled ? 'Running' : 'Stopped'}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Settings Card */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Automation Settings
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Daily Trades"
                  type="number"
                  value={settings.maxDailyTrades}
                  onChange={handleSettingChange('maxDailyTrades')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Max Drawdown %"
                  type="number"
                  value={settings.maxDrawdown}
                  onChange={handleSettingChange('maxDrawdown')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Trading Start Time"
                  type="time"
                  value={settings.tradingHours.start}
                  onChange={handleTimeChange('start')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Trading End Time"
                  type="time"
                  value={settings.tradingHours.end}
                  onChange={handleTimeChange('end')}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.useSignalProvider}
                      onChange={handleSettingChange('useSignalProvider')}
                    />
                  }
                  label="Use Signal Provider"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.useAlgoTrading}
                      onChange={handleSettingChange('useAlgoTrading')}
                    />
                  }
                  label="Use Algo Trading"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.useCopyTrading}
                      onChange={handleSettingChange('useCopyTrading')}
                    />
                  }
                  label="Use Copy Trading"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Active Strategies */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Active Trading Strategies
            </Typography>
            <List>
              {strategies.map((strategy, index) => (
                <React.Fragment key={strategy.id}>
                  <ListItem
                    secondaryAction={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          color={strategy.performance >= 0 ? 'success.main' : 'error.main'}
                        >
                          {strategy.performance >= 0 ? '+' : ''}
                          {strategy.performance}%
                        </Typography>
                        <Chip
                          label={strategy.status}
                          size="small"
                          color={getStatusColor(strategy.status)}
                        />
                        <Button
                          size="small"
                          startIcon={<SettingsIcon />}
                          onClick={() => {
                            // Handle strategy settings
                            console.log('Configure strategy:', strategy.id);
                          }}
                        >
                          Configure
                        </Button>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={strategy.name}
                      secondary={`Type: ${strategy.type}`}
                    />
                  </ListItem>
                  {index < strategies.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Performance Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimelineIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Performance Summary
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Automated Trades
                </Typography>
                <Typography variant="h6">127</Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Success Rate
                </Typography>
                <Typography variant="h6" color="success.main">
                  68.5%
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Average Profit/Trade
                </Typography>
                <Typography variant="h6" color="success.main">
                  +12.3 pips
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Maximum Drawdown
                </Typography>
                <Typography variant="h6" color="error.main">
                  -3.2%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Warning */}
        <Grid item xs={12}>
          <Alert
            severity="warning"
            icon={<WarningIcon />}
          >
            Automated trading carries significant risks. Make sure to monitor your
            positions regularly and maintain proper risk management settings.
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
});

export default AutomatedTrading;

