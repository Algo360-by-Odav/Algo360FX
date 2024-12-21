import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Settings,
  Timeline,
  Refresh,
  Save,
  Info,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Portfolio, RebalanceStrategy, RebalanceConfig, RebalanceResult } from '../../../types/portfolio';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';

interface PortfolioRebalancerProps {
  portfolio: Portfolio;
  onRebalance: (config: RebalanceConfig) => Promise<RebalanceResult>;
  onSaveConfig: (config: RebalanceConfig) => void;
  onExecuteTrades: (result: RebalanceResult) => Promise<void>;
}

const COLORS = ['#2196f3', '#4caf50', '#f44336', '#ff9800', '#9c27b0', '#00bcd4'];

const PortfolioRebalancer: React.FC<PortfolioRebalancerProps> = ({
  portfolio,
  onRebalance,
  onSaveConfig,
  onExecuteTrades,
}) => {
  const [config, setConfig] = useState<RebalanceConfig>({
    strategy: RebalanceStrategy.EQUAL_WEIGHT,
    rebalanceThreshold: 0.05,
    minTradeValue: 100,
    maxTradeValue: 10000,
    tradeInterval: 300000, // 5 minutes
    commissionRate: 0.001,
    minCommission: 1,
    slippageFactor: 0.1,
    autoRebalance: false,
    rebalanceInterval: 86400000, // 1 day
  });

  const [result, setResult] = useState<RebalanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRebalanceActive, setAutoRebalanceActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoRebalanceActive && config.autoRebalance) {
      timer = setInterval(handleRebalance, config.rebalanceInterval);
    }
    return () => clearInterval(timer);
  }, [autoRebalanceActive, config]);

  const handleRebalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const rebalanceResult = await onRebalance(config);
      setResult(rebalanceResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rebalance portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!result) return;
    try {
      setLoading(true);
      setError(null);
      await onExecuteTrades(result);
      await handleRebalance(); // Refresh after execution
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute trades');
    } finally {
      setLoading(false);
    }
  };

  const renderAllocationChart = () => (
    <Box sx={{ height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={Object.entries(result?.currentAllocation || {}).map(([symbol, value]) => ({
              name: symbol,
              value,
            }))}
            cx="30%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ name, value }) => `${name} (${formatPercentage(value)})`}
          >
            {Object.entries(result?.currentAllocation || {}).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Pie
            data={Object.entries(result?.targetAllocation || {}).map(([symbol, value]) => ({
              name: symbol,
              value,
            }))}
            cx="70%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ name, value }) => `${name} (${formatPercentage(value)})`}
          >
            {Object.entries(result?.targetAllocation || {}).map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderTrades = () => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Side</TableCell>
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">Est. Cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {result?.trades.map((trade, index) => (
            <TableRow key={index}>
              <TableCell>{trade.symbol}</TableCell>
              <TableCell align="right" sx={{ color: trade.side === 'buy' ? 'success.main' : 'error.main' }}>
                {trade.side.toUpperCase()}
              </TableCell>
              <TableCell align="right">{trade.quantity.toFixed(8)}</TableCell>
              <TableCell align="right">{formatCurrency(trade.price)}</TableCell>
              <TableCell align="right">{formatCurrency(trade.quantity * trade.price)}</TableCell>
              <TableCell align="right">{formatCurrency(trade.quantity * trade.price * config.commissionRate)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMetrics = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Turnover
          </Typography>
          <Typography variant="h6">
            {result ? formatPercentage(result.metrics.turnover) : '-'}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Trade Count
          </Typography>
          <Typography variant="h6">
            {result ? result.metrics.tradeCount : '-'}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Est. Cost
          </Typography>
          <Typography variant="h6">
            {result ? formatCurrency(result.metrics.estimatedCost) : '-'}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Tracking Error
          </Typography>
          <Typography variant="h6">
            {result ? formatPercentage(result.metrics.trackingError) : '-'}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5">Portfolio Rebalancer</Typography>
        <Box>
          <IconButton onClick={() => onSaveConfig(config)}>
            <Save />
          </IconButton>
          <IconButton onClick={() => setAutoRebalanceActive(!autoRebalanceActive)}>
            {autoRebalanceActive ? <Stop /> : <PlayArrow />}
          </IconButton>
        </Box>
      </Box>

      {/* Configuration */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Strategy</InputLabel>
              <Select
                value={config.strategy}
                onChange={(e) =>
                  setConfig({ ...config, strategy: e.target.value as RebalanceStrategy })
                }
              >
                <MenuItem value={RebalanceStrategy.EQUAL_WEIGHT}>Equal Weight</MenuItem>
                <MenuItem value={RebalanceStrategy.RISK_PARITY}>Risk Parity</MenuItem>
                <MenuItem value={RebalanceStrategy.MINIMUM_VARIANCE}>Minimum Variance</MenuItem>
                <MenuItem value={RebalanceStrategy.MAXIMUM_SHARPE}>Maximum Sharpe</MenuItem>
                <MenuItem value={RebalanceStrategy.MOMENTUM}>Momentum</MenuItem>
                <MenuItem value={RebalanceStrategy.DYNAMIC}>Dynamic</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Rebalance Threshold"
              type="number"
              value={config.rebalanceThreshold}
              onChange={(e) =>
                setConfig({
                  ...config,
                  rebalanceThreshold: parseFloat(e.target.value),
                })
              }
              InputProps={{
                inputProps: { min: 0, max: 1, step: 0.01 },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={config.autoRebalance}
                  onChange={(e) =>
                    setConfig({ ...config, autoRebalance: e.target.checked })
                  }
                />
              }
              label="Auto Rebalance"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Actions */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          onClick={handleRebalance}
          startIcon={<Refresh />}
          disabled={loading}
        >
          Rebalance
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExecute}
          startIcon={<PlayArrow />}
          disabled={!result || loading}
        >
          Execute Trades
        </Button>
      </Box>

      {/* Status */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Results */}
      {result && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Current vs Target Allocation
          </Typography>
          {renderAllocationChart()}

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Required Trades
          </Typography>
          {renderTrades()}

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Rebalance Metrics
          </Typography>
          {renderMetrics()}
        </Box>
      )}
    </Box>
  );
};

export default PortfolioRebalancer;
