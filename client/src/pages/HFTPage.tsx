import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  Timeline as PerformanceIcon,
  Speed as LatencyIcon,
  Memory as ResourceIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useStores } from '../stores/StoreProvider';
import { format } from 'date-fns';
import { HFTStrategy } from '../stores/hftStore';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const HFTPage: React.FC = observer(() => {
  const theme = useTheme();
  const { hftStore } = useStores();
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [editedConfig, setEditedConfig] = useState<Partial<HFTStrategy['config']> | null>(null);

  const handleStartStrategy = (strategyId: string) => {
    hftStore.startStrategy(strategyId);
  };

  const handleStopStrategy = (strategyId: string) => {
    hftStore.stopStrategy(strategyId);
  };

  const handleOpenSettings = (strategy: HFTStrategy) => {
    setSelectedStrategy(strategy.id);
    setEditedConfig(strategy.config);
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
    setSelectedStrategy(null);
    setEditedConfig(null);
  };

  const handleSaveSettings = () => {
    if (selectedStrategy && editedConfig) {
      hftStore.updateStrategyConfig(selectedStrategy, editedConfig);
      handleCloseSettings();
    }
  };

  const getStatusColor = (status: HFTStrategy['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'error':
        return 'error';
      case 'warming_up':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: HFTStrategy['status']) => {
    switch (status) {
      case 'active':
        return <SuccessIcon />;
      case 'error':
        return <WarningIcon />;
      case 'warming_up':
        return <CircularProgress size={20} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth={false}>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          High-Frequency Trading
        </Typography>
        
        {/* System Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Average Latency
              </Typography>
              <Typography variant="h4">
                {hftStore.systemMetrics.averageLatency.toFixed(3)} ms
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Active Strategies
              </Typography>
              <Typography variant="h4">
                {hftStore.systemMetrics.activeStrategies} / {hftStore.systemMetrics.totalStrategies}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                System Load
              </Typography>
              <Typography variant="h4">
                {hftStore.systemMetrics.systemLoad.toFixed(1)}%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Memory Usage
              </Typography>
              <Typography variant="h4">
                {(hftStore.systemMetrics.memoryUsage / 1024).toFixed(1)} GB
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Strategies */}
        <Grid container spacing={3}>
          {hftStore.strategies.map((strategy) => (
            <Grid item xs={12} key={strategy.id}>
              <Paper sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">{strategy.name}</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      {strategy.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={strategy.status}
                        color={getStatusColor(strategy.status)}
                        icon={getStatusIcon(strategy.status)}
                      />
                      <Chip label={strategy.type} variant="outlined" />
                      <Chip label={strategy.config.symbol} variant="outlined" />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      {strategy.status === 'active' ? (
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<StopIcon />}
                          onClick={() => handleStopStrategy(strategy.id)}
                        >
                          Stop
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<StartIcon />}
                          onClick={() => handleStartStrategy(strategy.id)}
                          disabled={strategy.status === 'warming_up'}
                        >
                          Start
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        startIcon={<SettingsIcon />}
                        onClick={() => handleOpenSettings(strategy)}
                      >
                        Settings
                      </Button>
                    </Box>
                  </Grid>
                  
                  {/* Performance Metrics */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Trades
                        </Typography>
                        <Typography variant="h6">{strategy.trades}</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Win Rate
                        </Typography>
                        <Typography variant="h6">{strategy.winRate.toFixed(1)}%</Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="subtitle2" color="textSecondary">
                          P&L
                        </Typography>
                        <Typography variant="h6" color={strategy.pnl >= 0 ? 'success.main' : 'error.main'}>
                          ${strategy.pnl.toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Latency
                        </Typography>
                        <Typography variant="h6">{strategy.latency.toFixed(3)} ms</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Strategy Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={handleCloseSettings}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Strategy Settings</DialogTitle>
        <DialogContent>
          {editedConfig && (
            <Box sx={{ mt: 2 }}>
              {/* Market Configuration */}
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Market Configuration</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Symbol</InputLabel>
                        <Select
                          value={editedConfig.symbol}
                          onChange={(e) => setEditedConfig({
                            ...editedConfig,
                            symbol: e.target.value as string
                          })}
                        >
                          <MenuItem value="EUR/USD">EUR/USD</MenuItem>
                          <MenuItem value="GBP/USD">GBP/USD</MenuItem>
                          <MenuItem value="BTC/USD">BTC/USD</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Timeframe</InputLabel>
                        <Select
                          value={editedConfig.timeframe}
                          onChange={(e) => setEditedConfig({
                            ...editedConfig,
                            timeframe: e.target.value as HFTStrategy['config']['timeframe']
                          })}
                        >
                          <MenuItem value="1s">1 Second</MenuItem>
                          <MenuItem value="5s">5 Seconds</MenuItem>
                          <MenuItem value="10s">10 Seconds</MenuItem>
                          <MenuItem value="30s">30 Seconds</MenuItem>
                          <MenuItem value="1m">1 Minute</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Position Management */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Position Management</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Max Positions"
                        type="number"
                        value={editedConfig.maxPositions}
                        onChange={(e) => setEditedConfig({
                          ...editedConfig,
                          maxPositions: Number(e.target.value)
                        })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Max Position Size"
                        type="number"
                        value={editedConfig.maxPositionSize}
                        onChange={(e) => setEditedConfig({
                          ...editedConfig,
                          maxPositionSize: Number(e.target.value)
                        })}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Position Sizing</InputLabel>
                        <Select
                          value={editedConfig.positionSizing}
                          onChange={(e) => setEditedConfig({
                            ...editedConfig,
                            positionSizing: e.target.value as HFTStrategy['config']['positionSizing']
                          })}
                        >
                          <MenuItem value="fixed">Fixed</MenuItem>
                          <MenuItem value="volatility_adjusted">Volatility Adjusted</MenuItem>
                          <MenuItem value="kelly_criterion">Kelly Criterion</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Risk Management */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Risk Management</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Max Drawdown (%)"
                        type="number"
                        value={editedConfig.maxDrawdown * 100}
                        onChange={(e) => setEditedConfig({
                          ...editedConfig,
                          maxDrawdown: Number(e.target.value) / 100
                        })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Risk Per Trade (%)"
                        type="number"
                        value={editedConfig.riskPerTrade * 100}
                        onChange={(e) => setEditedConfig({
                          ...editedConfig,
                          riskPerTrade: Number(e.target.value) / 100
                        })}
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>

              {/* Event Filters */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1">Event Filters</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editedConfig.eventFilters.newsEvents}
                            onChange={(e) => setEditedConfig({
                              ...editedConfig,
                              eventFilters: {
                                ...editedConfig.eventFilters,
                                newsEvents: e.target.checked
                              }
                            })}
                          />
                        }
                        label="News Events"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editedConfig.eventFilters.economicCalendar}
                            onChange={(e) => setEditedConfig({
                              ...editedConfig,
                              eventFilters: {
                                ...editedConfig.eventFilters,
                                economicCalendar: e.target.checked
                              }
                            })}
                          />
                        }
                        label="Economic Calendar"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editedConfig.eventFilters.volatilityFilter}
                            onChange={(e) => setEditedConfig({
                              ...editedConfig,
                              eventFilters: {
                                ...editedConfig.eventFilters,
                                volatilityFilter: e.target.checked
                              }
                            })}
                          />
                        }
                        label="Volatility Filter"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={editedConfig.eventFilters.liquidityFilter}
                            onChange={(e) => setEditedConfig({
                              ...editedConfig,
                              eventFilters: {
                                ...editedConfig.eventFilters,
                                liquidityFilter: e.target.checked
                              }
                            })}
                          />
                        }
                        label="Liquidity Filter"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings}>Cancel</Button>
          <Button onClick={handleSaveSettings} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
});

export default HFTPage;

