import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { backtestingService, BacktestConfig, BacktestResult } from '../../services/backtesting/BacktestingService';
import { Strategy } from '../../types/strategy';
import './Backtesting.css';

const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w'];

const Backtesting: React.FC = observer(() => {
  const theme = useTheme();
  const [config, setConfig] = useState<Partial<BacktestConfig>>({
    initialBalance: 10000,
    commission: 0.1,
    slippage: 0.05,
    useSpread: true,
  });
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunBacktest = async () => {
    if (!selectedStrategy || !config.symbol || !config.timeframe || !config.startDate || !config.endDate) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await backtestingService.runBacktest({
        strategy: selectedStrategy,
        parameters: selectedStrategy.defaultParameters,
        symbol: config.symbol,
        timeframe: config.timeframe,
        startDate: config.startDate,
        endDate: config.endDate,
        initialBalance: config.initialBalance!,
        commission: config.commission!,
        slippage: config.slippage!,
        useSpread: config.useSpread!,
      });
      setResult(result);
    } catch (error) {
      console.error('Backtest failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const MetricCard: React.FC<{ title: string; value: string | number; color?: string }> = ({ title, value, color }) => (
    <Card className="metric-card">
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h6" style={{ color }}>
          {typeof value === 'number' ? value.toFixed(2) : value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box className="backtesting-container">
      <Typography variant="h5" gutterBottom>
        Strategy Backtesting
      </Typography>

      <Grid container spacing={3}>
        {/* Configuration Panel */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configuration
              </Typography>

              <FormControl fullWidth margin="normal">
                <InputLabel>Strategy</InputLabel>
                <Select
                  value={selectedStrategy?.name || ''}
                  onChange={(e) => {
                    // TODO: Load strategy by name
                  }}
                >
                  {/* TODO: Add strategy options */}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                label="Symbol"
                value={config.symbol || ''}
                onChange={(e) => setConfig({ ...config, symbol: e.target.value })}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Timeframe</InputLabel>
                <Select
                  value={config.timeframe || ''}
                  onChange={(e) => setConfig({ ...config, timeframe: e.target.value })}
                >
                  {timeframes.map((tf) => (
                    <MenuItem key={tf} value={tf}>
                      {tf}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DatePicker
                label="Start Date"
                value={config.startDate || null}
                onChange={(date) => setConfig({ ...config, startDate: date || undefined })}
                slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
              />

              <DatePicker
                label="End Date"
                value={config.endDate || null}
                onChange={(date) => setConfig({ ...config, endDate: date || undefined })}
                slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Initial Balance"
                type="number"
                value={config.initialBalance}
                onChange={(e) => setConfig({ ...config, initialBalance: Number(e.target.value) })}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Commission (%)"
                type="number"
                value={config.commission}
                onChange={(e) => setConfig({ ...config, commission: Number(e.target.value) })}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Slippage (%)"
                type="number"
                value={config.slippage}
                onChange={(e) => setConfig({ ...config, slippage: Number(e.target.value) })}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleRunBacktest}
                disabled={isLoading}
                style={{ marginTop: 16 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Run Backtest'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Panel */}
        <Grid item xs={12} md={8}>
          {result && (
            <>
              {/* Performance Metrics */}
              <Grid container spacing={2} className="metrics-grid">
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Total P&L"
                    value={`$${result.metrics.totalPnL}`}
                    color={result.metrics.totalPnL >= 0 ? theme.palette.success.main : theme.palette.error.main}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Win Rate"
                    value={`${(result.metrics.winRate * 100).toFixed(1)}%`}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Profit Factor"
                    value={result.metrics.profitFactor}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <MetricCard
                    title="Sharpe Ratio"
                    value={result.metrics.sharpeRatio}
                  />
                </Grid>
              </Grid>

              {/* Equity Curve */}
              <Card className="chart-card">
                <CardContent>
                  <Typography variant="h6">Equity Curve</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={result.equityCurve}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="equity"
                        stroke={theme.palette.primary.main}
                        name="Equity"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="drawdown"
                        stroke={theme.palette.error.main}
                        name="Drawdown %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Returns */}
              <Card className="chart-card">
                <CardContent>
                  <Typography variant="h6">Monthly Returns</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={result.monthlyReturns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="month"
                        tickFormatter={(month) => new Date(2000, month).toLocaleString('default', { month: 'short' })}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value: number) => `${value.toFixed(2)}%`}
                        labelFormatter={(month) => new Date(2000, month).toLocaleString('default', { month: 'long' })}
                      />
                      <Bar
                        dataKey="return"
                        fill={theme.palette.primary.main}
                        name="Return %"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Trade List */}
              <Card className="trades-card">
                <CardContent>
                  <Typography variant="h6">Trade History</Typography>
                  <Box className="trades-list">
                    {result.trades.map((trade) => (
                      <Box
                        key={trade.id}
                        className={`trade-item ${trade.profit >= 0 ? 'profit' : 'loss'}`}
                      >
                        <Typography variant="body2">
                          {trade.symbol} {trade.side}
                        </Typography>
                        <Typography variant="body2">
                          Entry: ${trade.entryPrice.toFixed(2)}
                        </Typography>
                        <Typography variant="body2">
                          Exit: ${trade.exitPrice.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" className="trade-profit">
                          P&L: ${trade.profit.toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
});

export default Backtesting;
