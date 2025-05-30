import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Switch,
  FormControlLabel,
  TextField,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useStores } from '../../stores/StoreProvider';

interface Strategy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'stopped';
  performance: {
    totalTrades: number;
    winRate: number;
    profitLoss: number;
    drawdown: number;
  };
  riskSettings: {
    maxPositions: number;
    maxDrawdown: number;
    positionSize: number;
    stopLoss: number;
    takeProfit: number;
  };
}

const AutoTradingSystem: React.FC = () => {
  const { tradingStore } = useStores();
  const [systemEnabled, setSystemEnabled] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [strategies] = useState<Strategy[]>([
    {
      id: '1',
      name: 'Trend Following Strategy',
      description: 'Uses moving averages and momentum indicators to follow market trends',
      status: 'active',
      performance: {
        totalTrades: 156,
        winRate: 62.5,
        profitLoss: 2450.75,
        drawdown: 8.2,
      },
      riskSettings: {
        maxPositions: 3,
        maxDrawdown: 15,
        positionSize: 2.5,
        stopLoss: 50,
        takeProfit: 100,
      },
    },
    {
      id: '2',
      name: 'Breakout Strategy',
      description: 'Identifies and trades price breakouts with volume confirmation',
      status: 'paused',
      performance: {
        totalTrades: 89,
        winRate: 58.4,
        profitLoss: 1280.50,
        drawdown: 12.5,
      },
      riskSettings: {
        maxPositions: 2,
        maxDrawdown: 20,
        positionSize: 2.0,
        stopLoss: 40,
        takeProfit: 80,
      },
    },
  ]);

  const handleSystemToggle = () => {
    setSystemEnabled(!systemEnabled);
  };

  const handleStrategyStatusChange = (strategyId: string, newStatus: 'active' | 'paused' | 'stopped') => {
    // Update strategy status in the store
    console.log('Updating strategy status:', strategyId, newStatus);
  };

  const handleOpenSettings = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setOpenSettings(true);
  };

  const handleCloseSettings = () => {
    setOpenSettings(false);
    setSelectedStrategy(null);
  };

  const handleSaveSettings = () => {
    // Save strategy settings
    handleCloseSettings();
  };

  const renderPerformanceMetrics = (strategy: Strategy) => (
    <Grid container spacing={2}>
      <Grid item xs={6} sm={3}>
        <Typography variant="subtitle2" color="text.secondary">
          Total Trades
        </Typography>
        <Typography variant="h6">
          {strategy.performance.totalTrades}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Typography variant="subtitle2" color="text.secondary">
          Win Rate
        </Typography>
        <Typography variant="h6" color={strategy.performance.winRate >= 50 ? 'success.main' : 'error.main'}>
          {strategy.performance.winRate}%
        </Typography>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Typography variant="subtitle2" color="text.secondary">
          Profit/Loss
        </Typography>
        <Typography variant="h6" color={strategy.performance.profitLoss >= 0 ? 'success.main' : 'error.main'}>
          ${strategy.performance.profitLoss.toFixed(2)}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={3}>
        <Typography variant="subtitle2" color="text.secondary">
          Max Drawdown
        </Typography>
        <Typography variant="h6" color={strategy.performance.drawdown <= 20 ? 'success.main' : 'error.main'}>
          {strategy.performance.drawdown}%
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Auto Trading System</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={systemEnabled}
                onChange={handleSystemToggle}
                color="primary"
              />
            }
            label={systemEnabled ? 'System Active' : 'System Inactive'}
          />
        </Box>

        <Alert severity={systemEnabled ? 'success' : 'info'} sx={{ mb: 3 }}>
          {systemEnabled
            ? 'Auto trading system is active and monitoring the market'
            : 'Auto trading system is currently disabled'}
        </Alert>

        <Typography variant="h6" gutterBottom>
          Active Strategies
        </Typography>

        {strategies.map((strategy) => (
          <Card key={strategy.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {strategy.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {strategy.description}
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title="Strategy Settings">
                    <IconButton onClick={() => handleOpenSettings(strategy)}>
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={strategy.status === 'active' ? 'Stop Strategy' : 'Start Strategy'}>
                    <IconButton
                      color={strategy.status === 'active' ? 'error' : 'success'}
                      onClick={() => handleStrategyStatusChange(
                        strategy.id,
                        strategy.status === 'active' ? 'stopped' : 'active'
                      )}
                    >
                      {strategy.status === 'active' ? <StopIcon /> : <StartIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />
              {renderPerformanceMetrics(strategy)}
            </CardContent>
          </Card>
        ))}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ mt: 2 }}
        >
          Add New Strategy
        </Button>
      </Paper>

      <Dialog open={openSettings} onClose={handleCloseSettings} maxWidth="md" fullWidth>
        <DialogTitle>
          Strategy Settings - {selectedStrategy?.name}
        </DialogTitle>
        <DialogContent>
          {selectedStrategy && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Risk Management
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Max Open Positions"
                      type="number"
                      value={selectedStrategy.riskSettings.maxPositions}
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Max Drawdown (%)"
                      type="number"
                      value={selectedStrategy.riskSettings.maxDrawdown}
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Position Size (%)"
                      type="number"
                      value={selectedStrategy.riskSettings.positionSize}
                      InputProps={{ inputProps: { min: 0.1, step: 0.1 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Stop Loss (pips)"
                      type="number"
                      value={selectedStrategy.riskSettings.stopLoss}
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Performance Metrics
                </Typography>
                {renderPerformanceMetrics(selectedStrategy)}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings}>Cancel</Button>
          <Button onClick={handleSaveSettings} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AutoTradingSystem;

