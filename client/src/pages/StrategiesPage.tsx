import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  IconButton,
  Tooltip,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  LinearProgress,
  Alert,
  Autocomplete
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  TrendingUp as ProfitIcon,
  TrendingDown as LossIcon,
  Timeline as BacktestIcon,
  Assessment as PerformanceIcon,
  Settings as SettingsIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useApp } from '@/context/AppContext';
import { strategyService, Strategy, CreateStrategyInput, UpdateStrategyInput } from '@/services/strategyService';
import { Line } from 'react-chartjs-2';

interface StrategySummary {
  totalStrategies: number;
  activeStrategies: number;
  totalPnl: number;
  averageWinRate: number;
  bestPerforming: string;
  worstPerforming: string;
  dailyPnL: number;
  monthlyPnL: number;
}

interface StrategyFormData {
  name: string;
  description: string;
  type: string;
  symbols: string[];
  parameters: {
    timeframe: string;
    riskPerTrade: number;
    maxDrawdown: number;
    takeProfitPips: number;
    stopLossPips: number;
    trailingStop: boolean;
    indicators: {
      name: string;
      parameters: Record<string, any>;
    }[];
    [key: string]: any;
  };
}

interface PerformanceMetrics {
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
  averageWinSize: number;
  averageLossSize: number;
  consecutiveWins: number;
  consecutiveLosses: number;
}

const defaultStrategyFormData: StrategyFormData = {
  name: '',
  description: '',
  type: 'TREND_FOLLOWING',
  symbols: [],
  parameters: {
    timeframe: '1h',
    riskPerTrade: 1,
    maxDrawdown: 10,
    takeProfitPips: 50,
    stopLossPips: 30,
    trailingStop: false,
    indicators: []
  }
};

const StrategiesPage: React.FC = () => {
  const theme = useTheme();
  const { showNotification } = useApp();
  const [loading, setLoading] = useState(true);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [summary, setSummary] = useState<StrategySummary | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formData, setFormData] = useState<StrategyFormData>(defaultStrategyFormData);
  const [tabValue, setTabValue] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    performance: 'all',
    symbol: 'all'
  });

  const [availableSymbols] = useState(['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD', 'USDCHF']);
  const [strategyTypes] = useState(['TREND_FOLLOWING', 'MEAN_REVERSION', 'BREAKOUT', 'SCALPING', 'GRID', 'MARTINGALE']);
  const [timeframes] = useState(['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w']);
  const [availableIndicators] = useState([
    { name: 'Moving Average', parameters: { period: 20, type: 'simple' } },
    { name: 'RSI', parameters: { period: 14, overbought: 70, oversold: 30 } },
    { name: 'MACD', parameters: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 } },
    { name: 'Bollinger Bands', parameters: { period: 20, deviations: 2 } }
  ]);

  const fetchStrategiesData = async () => {
    try {
      setLoading(true);
      const strategies = await strategyService.getStrategies();
      setStrategies(strategies);
      
      // Calculate summary from strategies
      const summary: StrategySummary = {
        totalStrategies: strategies.length,
        activeStrategies: strategies.filter(s => s.status === 'active').length,
        totalPnl: strategies.reduce((acc, s) => acc + (s.performance?.totalPnL || 0), 0),
        averageWinRate: strategies.reduce((acc, s) => acc + (s.performance?.winRate || 0), 0) / strategies.length,
        bestPerforming: strategies.reduce((best, s) => 
          (s.performance?.totalPnL || 0) > (best?.performance?.totalPnL || 0) ? s.name : best.name, strategies[0]),
        worstPerforming: strategies.reduce((worst, s) => 
          (s.performance?.totalPnL || 0) < (worst?.performance?.totalPnL || 0) ? s.name : worst.name, strategies[0]),
        dailyPnL: strategies.reduce((acc, s) => acc + (s.performance?.dailyPnL || 0), 0),
        monthlyPnL: strategies.reduce((acc, s) => acc + (s.performance?.monthlyPnL || 0), 0)
      };
      setSummary(summary);
    } catch (error: any) {
      showNotification(
        error.message || 'Failed to fetch strategies data',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategiesData();
  }, []);

  const handleSubmitStrategy = async () => {
    try {
      if (selectedStrategy) {
        const updatedStrategy = await strategyService.updateStrategy(selectedStrategy.id, formData as UpdateStrategyInput);
        showNotification('Strategy updated successfully', 'success');
      } else {
        const newStrategy = await strategyService.createStrategy(formData as CreateStrategyInput);
        showNotification('Strategy created successfully', 'success');
      }
      setFormDialogOpen(false);
      fetchStrategiesData();
    } catch (error: any) {
      showNotification(
        error.message || 'Failed to save strategy',
        'error'
      );
    }
  };

  const handleDeleteStrategy = async (strategyId: string) => {
    try {
      await strategyService.deleteStrategy(strategyId);
      showNotification('Strategy deleted successfully', 'success');
      fetchStrategiesData();
    } catch (error: any) {
      showNotification(
        error.message || 'Failed to delete strategy',
        'error'
      );
    }
  };

  const handleToggleStrategy = async (strategy: Strategy) => {
    try {
      if (strategy.status === 'active') {
        await strategyService.deactivateStrategy(strategy.id);
      } else {
        await strategyService.activateStrategy(strategy.id);
      }
      showNotification(`Strategy ${strategy.status === 'active' ? 'stopped' : 'started'} successfully`, 'success');
      fetchStrategiesData();
    } catch (error: any) {
      showNotification(
        error.message || 'Failed to toggle strategy',
        'error'
      );
    }
  };

  const handleBacktest = async (strategyId: string) => {
    try {
      const result = await strategyService.runBacktest(strategyId, {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
        initialBalance: 10000
      });
      
      setPerformanceMetrics({
        winRate: result.winRate,
        profitFactor: result.profitFactor,
        sharpeRatio: result.sharpeRatio,
        maxDrawdown: result.maxDrawdown,
        totalTrades: result.totalTrades,
        averageWinSize: result.averageWinSize,
        averageLossSize: result.averageLossSize,
        consecutiveWins: result.consecutiveWins,
        consecutiveLosses: result.consecutiveLosses
      });
      
      showNotification('Backtest completed successfully', 'success');
    } catch (error: any) {
      showNotification(
        error.message || 'Failed to run backtest',
        'error'
      );
    }
  };

  const handleOptimize = async (strategyId: string) => {
    try {
      const result = await strategyService.optimizeStrategy(strategyId, {
        parameters: formData.parameters,
        optimizationMetric: 'sharpeRatio'
      });
      
      setFormData(prev => ({
        ...prev,
        parameters: {
          ...prev.parameters,
          ...result.optimizedParameters
        }
      }));
      
      showNotification('Strategy optimization completed', 'success');
    } catch (error: any) {
      showNotification(
        error.message || 'Failed to optimize strategy',
        'error'
      );
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  const getFilteredStrategies = () => {
    return strategies.filter(strategy => {
      if (filters.status !== 'all' && strategy.status !== filters.status) return false;
      if (filters.type !== 'all' && strategy.parameters.type !== filters.type) return false;
      if (filters.symbol !== 'all' && !strategy.parameters.symbols.includes(filters.symbol)) return false;
      if (filters.performance === 'profitable' && (strategy.performance?.totalPnL || 0) <= 0) return false;
      if (filters.performance === 'losing' && (strategy.performance?.totalPnL || 0) >= 0) return false;
      return true;
    });
  };

  const renderPerformanceMetrics = () => {
    if (!performanceMetrics) return null;

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Win Rate</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={performanceMetrics.winRate} 
                    color={performanceMetrics.winRate >= 50 ? 'success' : 'error'}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {formatPercentage(performanceMetrics.winRate)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Profit Factor</Typography>
              <Typography variant="h4" color={performanceMetrics.profitFactor >= 1.5 ? 'success.main' : 'error.main'}>
                {performanceMetrics.profitFactor.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Sharpe Ratio</Typography>
              <Typography variant="h4" color={performanceMetrics.sharpeRatio >= 1 ? 'success.main' : 'error.main'}>
                {performanceMetrics.sharpeRatio.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Max Drawdown</Typography>
              <Typography variant="h4" color={performanceMetrics.maxDrawdown <= 20 ? 'success.main' : 'error.main'}>
                {formatPercentage(performanceMetrics.maxDrawdown)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  if (loading && !summary) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Strategy Manager
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Create, manage, and monitor your trading strategies
        </Typography>
      </Box>

      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Strategies
                </Typography>
                <Typography variant="h4">
                  {summary.totalStrategies}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Active Strategies
                </Typography>
                <Typography variant="h4">
                  {summary.activeStrategies}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total P&L
                </Typography>
                <Typography variant="h4" color={summary.totalPnl >= 0 ? 'success.main' : 'error.main'}>
                  {formatCurrency(summary.totalPnl)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Average Win Rate
                </Typography>
                <Typography variant="h4">
                  {formatPercentage(summary.averageWinRate)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setSelectedStrategy(null);
              setFormData(defaultStrategyFormData);
              setFormDialogOpen(true);
            }}
          >
            New Strategy
          </Button>
          <IconButton onClick={fetchStrategiesData}>
            <RefreshIcon />
          </IconButton>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredStrategies()
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((strategy) => (
                  <TableRow key={strategy.id}>
                    <TableCell>{strategy.name}</TableCell>
                    <TableCell>{strategy.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={strategy.status}
                        color={strategy.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(strategy.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedStrategy(strategy);
                            setFormData({
                              ...strategy,
                              type: strategy.parameters.type || 'TREND_FOLLOWING',
                              symbols: strategy.parameters.symbols || [],
                            });
                            setFormDialogOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={strategy.status === 'active' ? 'Stop' : 'Start'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleStrategy(strategy)}
                        >
                          {strategy.status === 'active' ? <StopIcon /> : <StartIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Backtest">
                        <IconButton
                          size="small"
                          onClick={() => handleBacktest(strategy.id)}
                        >
                          <BacktestIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteStrategy(strategy.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={getFilteredStrategies().length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedStrategy ? 'Edit Strategy' : 'New Strategy'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {strategyTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Symbols</InputLabel>
              <Select
                multiple
                value={formData.symbols}
                label="Symbols"
                onChange={(e) => setFormData({ ...formData, symbols: e.target.value as string[] })}
              >
                {availableSymbols.map((symbol) => (
                  <MenuItem key={symbol} value={symbol}>
                    {symbol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={formData.parameters.timeframe}
                label="Timeframe"
                onChange={(e) => setFormData({ ...formData, parameters: { ...formData.parameters, timeframe: e.target.value } })}
              >
                {timeframes.map((timeframe) => (
                  <MenuItem key={timeframe} value={timeframe}>
                    {timeframe}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Risk Per Trade</InputLabel>
              <Select
                value={formData.parameters.riskPerTrade}
                label="Risk Per Trade"
                onChange={(e) => setFormData({ ...formData, parameters: { ...formData.parameters, riskPerTrade: parseInt(e.target.value, 10) } })}
              >
                {[1, 2, 3, 4, 5].map((risk) => (
                  <MenuItem key={risk} value={risk}>
                    {risk}%
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Max Drawdown</InputLabel>
              <Select
                value={formData.parameters.maxDrawdown}
                label="Max Drawdown"
                onChange={(e) => setFormData({ ...formData, parameters: { ...formData.parameters, maxDrawdown: parseInt(e.target.value, 10) } })}
              >
                {[5, 10, 15, 20, 25].map((drawdown) => (
                  <MenuItem key={drawdown} value={drawdown}>
                    {drawdown}%
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Take Profit Pips</InputLabel>
              <Select
                value={formData.parameters.takeProfitPips}
                label="Take Profit Pips"
                onChange={(e) => setFormData({ ...formData, parameters: { ...formData.parameters, takeProfitPips: parseInt(e.target.value, 10) } })}
              >
                {[20, 30, 40, 50, 60].map((pips) => (
                  <MenuItem key={pips} value={pips}>
                    {pips} pips
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Stop Loss Pips</InputLabel>
              <Select
                value={formData.parameters.stopLossPips}
                label="Stop Loss Pips"
                onChange={(e) => setFormData({ ...formData, parameters: { ...formData.parameters, stopLossPips: parseInt(e.target.value, 10) } })}
              >
                {[10, 20, 30, 40, 50].map((pips) => (
                  <MenuItem key={pips} value={pips}>
                    {pips} pips
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Trailing Stop</InputLabel>
              <Select
                value={formData.parameters.trailingStop}
                label="Trailing Stop"
                onChange={(e) => setFormData({ ...formData, parameters: { ...formData.parameters, trailingStop: e.target.value === 'true' } })}
              >
                {['true', 'false'].map((stop) => (
                  <MenuItem key={stop} value={stop}>
                    {stop === 'true' ? 'Yes' : 'No'}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Indicators</InputLabel>
              <Select
                multiple
                value={formData.parameters.indicators}
                label="Indicators"
                onChange={(e) => setFormData({ ...formData, parameters: { ...formData.parameters, indicators: e.target.value } })}
              >
                {availableIndicators.map((indicator) => (
                  <MenuItem key={indicator.name} value={indicator.name}>
                    {indicator.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFormDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitStrategy} variant="contained">
            {selectedStrategy ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={filterDialogOpen} onClose={() => setFilterDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Filter Strategies
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                {['all', 'active', 'inactive'].map((status) => (
                  <MenuItem key={status} value={status}>
                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                label="Type"
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                {['all', ...strategyTypes].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type === 'all' ? 'All' : type.replace('_', ' ')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Performance</InputLabel>
              <Select
                value={filters.performance}
                label="Performance"
                onChange={(e) => setFilters({ ...filters, performance: e.target.value })}
              >
                {['all', 'profitable', 'losing'].map((performance) => (
                  <MenuItem key={performance} value={performance}>
                    {performance === 'all' ? 'All' : performance.charAt(0).toUpperCase() + performance.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Symbol</InputLabel>
              <Select
                value={filters.symbol}
                label="Symbol"
                onChange={(e) => setFilters({ ...filters, symbol: e.target.value })}
              >
                {['all', ...availableSymbols].map((symbol) => (
                  <MenuItem key={symbol} value={symbol}>
                    {symbol === 'all' ? 'All' : symbol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => setFilterDialogOpen(false)} variant="contained">
            Apply
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={(e, value) => setTabValue(value)}>
          <Tab label="Strategies" />
          <Tab label="Performance Metrics" />
        </Tabs>
        {tabValue === 0 && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<FilterIcon />}
              onClick={() => setFilterDialogOpen(true)}
            >
              Filter Strategies
            </Button>
          </Box>
        )}
        {tabValue === 1 && renderPerformanceMetrics()}
      </Box>
    </Container>
  );
};

export default StrategiesPage;
