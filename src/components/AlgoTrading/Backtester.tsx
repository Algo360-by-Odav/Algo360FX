import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/RootStoreContext';
import BacktestService, {
  BacktestResult,
  BacktestOptions,
} from '../../services/BacktestService';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

interface BacktestFormProps {
  onSubmit: (options: BacktestOptions) => void;
  isLoading: boolean;
}

const BacktestForm: React.FC<BacktestFormProps> = ({ onSubmit, isLoading }) => {
  const [options, setOptions] = useState<BacktestOptions>({
    startDate: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    endDate: Date.now(),
    initialCapital: 10000,
    symbol: 'EURUSD',
    timeframe: '1h',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(options);
  };

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Backtest Configuration
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="datetime-local"
              label="Start Date"
              value={new Date(options.startDate).toISOString().slice(0, 16)}
              onChange={(e) =>
                setOptions({
                  ...options,
                  startDate: new Date(e.target.value).getTime(),
                })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="datetime-local"
              label="End Date"
              value={new Date(options.endDate).toISOString().slice(0, 16)}
              onChange={(e) =>
                setOptions({
                  ...options,
                  endDate: new Date(e.target.value).getTime(),
                })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label="Initial Capital"
              value={options.initialCapital}
              onChange={(e) =>
                setOptions({
                  ...options,
                  initialCapital: parseFloat(e.target.value),
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Symbol"
              value={options.symbol}
              onChange={(e) =>
                setOptions({
                  ...options,
                  symbol: e.target.value.toUpperCase(),
                })
              }
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={options.timeframe}
                label="Timeframe"
                onChange={(e) =>
                  setOptions({
                    ...options,
                    timeframe: e.target.value,
                  })
                }
              >
                <MenuItem value="1m">1 Minute</MenuItem>
                <MenuItem value="5m">5 Minutes</MenuItem>
                <MenuItem value="15m">15 Minutes</MenuItem>
                <MenuItem value="1h">1 Hour</MenuItem>
                <MenuItem value="4h">4 Hours</MenuItem>
                <MenuItem value="1d">1 Day</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          disabled={isLoading}
          startIcon={<PlayArrowIcon />}
          sx={{ mt: 3 }}
        >
          {isLoading ? 'Running Backtest...' : 'Start Backtest'}
        </Button>
      </form>
    </Card>
  );
};

interface BacktestResultsProps {
  result: BacktestResult;
}

const BacktestResults: React.FC<BacktestResultsProps> = ({ result }) => {
  const theme = useTheme();

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Backtest Results
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Performance Metrics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Total Trades
              </Typography>
              <Typography variant="h6">{result.performance.totalTrades}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Win Rate
              </Typography>
              <Typography variant="h6">
                {result.performance.winRate.toFixed(2)}%
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Profit/Loss
              </Typography>
              <Typography
                variant="h6"
                color={
                  result.performance.profitLoss >= 0
                    ? 'success.main'
                    : 'error.main'
                }
              >
                ${result.performance.profitLoss.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Sharpe Ratio
              </Typography>
              <Typography variant="h6">
                {result.performance.sharpeRatio.toFixed(2)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Max Drawdown
              </Typography>
              <Typography variant="h6" color="error.main">
                {result.performance.maxDrawdown.toFixed(2)}%
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Profit Factor
              </Typography>
              <Typography variant="h6">
                {result.performance.profitFactor.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Equity Curve
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={result.equity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) =>
                    new Date(timestamp).toLocaleDateString()
                  }
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Equity']}
                  labelFormatter={(timestamp) =>
                    new Date(Number(timestamp)).toLocaleString()
                  }
                />
                <Area
                  type="monotone"
                  dataKey="equity"
                  stroke={theme.palette.primary.main}
                  fill={theme.palette.primary.light}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Drawdown Chart
          </Typography>
          <Box sx={{ height: 200 }}>
            <ResponsiveContainer>
              <LineChart data={result.equity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) =>
                    new Date(timestamp).toLocaleDateString()
                  }
                />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [
                    `${value.toFixed(2)}%`,
                    'Drawdown',
                  ]}
                  labelFormatter={(timestamp) =>
                    new Date(Number(timestamp)).toLocaleString()
                  }
                />
                <Line
                  type="monotone"
                  dataKey="drawdown"
                  stroke={theme.palette.error.main}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Trade History
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Entry Price</TableCell>
                  <TableCell align="right">Exit Price</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">P/L</TableCell>
                  <TableCell align="right">Pips</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>
                      <Chip
                        label={trade.type}
                        color={trade.type === 'BUY' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {trade.entryPrice.toFixed(5)}
                    </TableCell>
                    <TableCell align="right">
                      {trade.exitPrice.toFixed(5)}
                    </TableCell>
                    <TableCell align="right">{trade.quantity}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color:
                          trade.profitLoss >= 0
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                      }}
                    >
                      ${trade.profitLoss.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">{trade.pips.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Card>
  );
};

export const Backtester: React.FC = observer(() => {
  const { algoTradingStore } = useRootStore();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<BacktestResult | null>(null);

  const handleBacktest = async (options: BacktestOptions) => {
    try {
      setIsLoading(true);
      setProgress(0);

      const backtestService = BacktestService.getInstance();
      const strategy = algoTradingStore.runningStrategies[0];

      if (!strategy) {
        throw new Error('No active strategy to backtest');
      }

      const result = await backtestService.runBacktest(
        strategy.config,
        options,
        (progress) => setProgress(progress)
      );

      setResult(result);
    } catch (error) {
      console.error('Backtest failed:', error);
      // Handle error (show notification, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <BacktestForm onSubmit={handleBacktest} isLoading={isLoading} />

      {isLoading && (
        <Box sx={{ width: '100%', mb: 3 }}>
          <LinearProgress variant="determinate" value={progress} />
          <Typography variant="body2" color="text.secondary" align="center">
            Running backtest... {progress.toFixed(1)}%
          </Typography>
        </Box>
      )}

      {result && <BacktestResults result={result} />}
    </Box>
  );
});

export default Backtester;
