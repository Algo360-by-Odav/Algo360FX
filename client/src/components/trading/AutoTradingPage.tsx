import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Timeline as BacktestIcon,
  Settings as SettingsIcon,
  MoreVert as MoreIcon,
  Refresh as RefreshIcon,
  TrendingUp as ProfitIcon,
  TrendingDown as LossIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';
import StrategyBuilder from '../strategy/StrategyBuilder';
// Inline risk form component to avoid Vite errors
import BacktestResults from '../analysis/BacktestResults';
import PortfolioOptimizer from '../analysis/PortfolioOptimizer';
import { useStores } from '../../stores/StoreProvider';

const AutoTradingPage: React.FC = observer(() => {
  const { autoTradingStore } = useStores();
  const [activeTab, setActiveTab] = useState(0);
  const [openStrategyBuilder, setOpenStrategyBuilder] = useState(false);
  const [openRiskSettings, setOpenRiskSettings] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [backtestResults, setBacktestResults] = useState<any>(null);

  useEffect(() => {
    // Load initial data
    autoTradingStore.loadStrategies();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, strategyId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedStrategy(strategyId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedStrategy(null);
  };

  const handleStartStrategy = async () => {
    if (selectedStrategy) {
      try {
        await autoTradingStore.startStrategy(selectedStrategy);
        handleMenuClose();
      } catch (error) {
        console.error('Error starting strategy:', error);
      }
    }
  };

  const handleStopStrategy = async () => {
    if (selectedStrategy) {
      try {
        await autoTradingStore.stopStrategy(selectedStrategy);
        handleMenuClose();
      } catch (error) {
        console.error('Error stopping strategy:', error);
      }
    }
  };

  const handleEditStrategy = () => {
    setOpenStrategyBuilder(true);
    handleMenuClose();
  };

  const handleDeleteStrategy = async () => {
    if (selectedStrategy) {
      try {
        await autoTradingStore.deleteStrategy(selectedStrategy);
        handleMenuClose();
      } catch (error) {
        console.error('Error deleting strategy:', error);
      }
    }
  };

  const handleBacktest = async () => {
    if (selectedStrategy) {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 3); // 3 months of backtest data

        const results = await autoTradingStore.runBacktest(selectedStrategy, {
          startDate,
          endDate,
        });
        setBacktestResults(results);
        setActiveTab(1); // Switch to backtest results tab
        handleMenuClose();
      } catch (error) {
        console.error('Error running backtest:', error);
      }
    }
  };

  const handleOptimize = async (params: any) => {
    try {
      const results = await autoTradingStore.optimizePortfolio(
        autoTradingStore.strategies.map(s => s.id),
        params
      );
      return results;
    } catch (error) {
      console.error('Error optimizing portfolio:', error);
      throw error;
    }
  };

  if (autoTradingStore.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {autoTradingStore.error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => autoTradingStore.clearError()}>
          {autoTradingStore.error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Auto Trading</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenStrategyBuilder(true)}
            sx={{ mr: 1 }}
          >
            Create Strategy
          </Button>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setOpenRiskSettings(true)}
          >
            Risk Settings
          </Button>
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Active Strategies" />
        <Tab label="Backtest Results" />
        <Tab label="Portfolio Optimization" />
      </Tabs>

      {/* Active Strategies Tab */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {autoTradingStore.strategies.map((strategy) => (
            <Grid item xs={12} md={6} lg={4} key={strategy.id}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{strategy.name}</Typography>
                  <Box>
                    <Chip
                      size="small"
                      label={strategy.status}
                      color={strategy.status === 'ACTIVE' ? 'success' : 'default'}
                      sx={{ mr: 1 }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, strategy.id)}
                    >
                      <MoreIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {strategy.symbol} - {strategy.timeframe}
                </Typography>

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Return
                    </Typography>
                    <Typography
                      variant="h6"
                      color={strategy.metrics.totalReturn >= 0 ? 'success.main' : 'error.main'}
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      {strategy.metrics.totalReturn >= 0 ? <ProfitIcon /> : <LossIcon />}
                      {strategy.metrics.totalReturn.toFixed(2)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Win Rate
                    </Typography>
                    <Typography variant="h6">
                      {strategy.metrics.winRate.toFixed(1)}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Profit Factor
                    </Typography>
                    <Typography variant="h6">
                      {strategy.metrics.profitFactor.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Trades
                    </Typography>
                    <Typography variant="h6">
                      {strategy.metrics.trades}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                    <TimeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    Updated {format(new Date(strategy.lastUpdated), 'MMM d, HH:mm')}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Backtest Results Tab */}
      {activeTab === 1 && backtestResults && (
        <BacktestResults
          trades={backtestResults.trades}
          metrics={backtestResults.metrics}
          equityCurve={backtestResults.equityCurve}
          drawdownCurve={backtestResults.drawdownCurve}
        />
      )}

      {/* Portfolio Optimization Tab */}
      {activeTab === 2 && (
        <PortfolioOptimizer
          strategies={autoTradingStore.strategies.map(s => ({
            id: s.id,
            name: s.name,
            performance: {
              return: s.metrics.totalReturn / 100,
              volatility: 0.15, // Mock value, should be calculated from historical data
              sharpeRatio: s.metrics.sharpeRatio,
              maxDrawdown: s.metrics.maxDrawdown / 100,
              correlations: {},
            },
          }))}
          onOptimize={handleOptimize}
        />
      )}

      {/* Strategy Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleStartStrategy}>
          <StartIcon sx={{ mr: 1 }} /> Start Strategy
        </MenuItem>
        <MenuItem onClick={handleStopStrategy}>
          <StopIcon sx={{ mr: 1 }} /> Stop Strategy
        </MenuItem>
        <MenuItem onClick={handleEditStrategy}>
          <EditIcon sx={{ mr: 1 }} /> Edit Strategy
        </MenuItem>
        <MenuItem onClick={handleBacktest}>
          <BacktestIcon sx={{ mr: 1 }} /> Run Backtest
        </MenuItem>
        <MenuItem onClick={handleDeleteStrategy} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} /> Delete Strategy
        </MenuItem>
      </Menu>

      {/* Strategy Builder Dialog */}
      <Dialog
        open={openStrategyBuilder}
        onClose={() => setOpenStrategyBuilder(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {selectedStrategy ? 'Edit Strategy' : 'Create Strategy'}
        </DialogTitle>
        <DialogContent>
          <StrategyBuilder />
        </DialogContent>
      </Dialog>

      {/* Risk Management Dialog */}
      <Dialog
        open={openRiskSettings}
        onClose={() => setOpenRiskSettings(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Risk Management Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 3 }}>
            <Typography variant="body1" paragraph>
              Risk management settings are temporarily unavailable.
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              We're working on improving this feature. Please check back later.
            </Typography>
            <Button variant="contained" disabled>
              Save Settings
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
});

export default AutoTradingPage;

