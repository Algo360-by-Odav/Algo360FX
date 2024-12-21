import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/hooks/useRootStore';
import ChartWidget from '@components/Chart/ChartWidget';

interface BacktestResult {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  netProfit: number;
  averageTrade: number;
  winLossRatio: number;
  monthlyReturns: { month: string; return: number }[];
}

const defaultResult: BacktestResult = {
  totalTrades: 0,
  winRate: 0,
  profitFactor: 0,
  sharpeRatio: 0,
  maxDrawdown: 0,
  netProfit: 0,
  averageTrade: 0,
  winLossRatio: 0,
  monthlyReturns: [],
};

const Backtesting: React.FC = observer(() => {
  const { strategyStore } = useRootStore();
  const [selectedStrategy, setSelectedStrategy] = useState('');
  const [timeframe, setTimeframe] = useState('1h');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2023-12-31');
  const [symbol, setSymbol] = useState('EURUSD');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BacktestResult>(defaultResult);

  const handleBacktest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Here you would typically call your backtesting service
      // For now, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResult({
        totalTrades: 156,
        winRate: 65.4,
        profitFactor: 1.87,
        sharpeRatio: 1.45,
        maxDrawdown: -8.2,
        netProfit: 12500,
        averageTrade: 80.13,
        winLossRatio: 1.89,
        monthlyReturns: [
          { month: 'Jan 2023', return: 2.5 },
          { month: 'Feb 2023', return: 1.8 },
          { month: 'Mar 2023', return: -0.5 },
          // Add more monthly returns as needed
        ],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during backtesting');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3, height: '100%', overflow: 'auto' }}>
      <Grid container spacing={3}>
        {/* Configuration Panel */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Backtest Configuration
              </Typography>
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Strategy</InputLabel>
                  <Select
                    value={selectedStrategy}
                    label="Strategy"
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                  >
                    <MenuItem value="scalping">Scalping Strategy</MenuItem>
                    <MenuItem value="trend">Trend Following</MenuItem>
                    <MenuItem value="mean-reversion">Mean Reversion</MenuItem>
                    <MenuItem value="breakout">Breakout Strategy</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Symbol</InputLabel>
                  <Select
                    value={symbol}
                    label="Symbol"
                    onChange={(e) => setSymbol(e.target.value)}
                  >
                    <MenuItem value="EURUSD">EUR/USD</MenuItem>
                    <MenuItem value="GBPUSD">GBP/USD</MenuItem>
                    <MenuItem value="USDJPY">USD/JPY</MenuItem>
                    <MenuItem value="AUDUSD">AUD/USD</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Timeframe</InputLabel>
                  <Select
                    value={timeframe}
                    label="Timeframe"
                    onChange={(e) => setTimeframe(e.target.value)}
                  >
                    <MenuItem value="1m">1 Minute</MenuItem>
                    <MenuItem value="5m">5 Minutes</MenuItem>
                    <MenuItem value="15m">15 Minutes</MenuItem>
                    <MenuItem value="1h">1 Hour</MenuItem>
                    <MenuItem value="4h">4 Hours</MenuItem>
                    <MenuItem value="1d">1 Day</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  sx={{ mb: 2 }}
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  sx={{ mb: 3 }}
                  InputLabelProps={{ shrink: true }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleBacktest}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Run Backtest'
                  )}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Panel */}
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            {/* Chart */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Backtest Results
                  </Typography>
                  <ChartWidget symbol={symbol} interval={timeframe} />
                </CardContent>
              </Card>
            </Grid>

            {/* Performance Metrics */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Performance Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Trades
                    </Typography>
                    <Typography variant="h6">{result.totalTrades}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Win Rate
                    </Typography>
                    <Typography variant="h6">{result.winRate}%</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Net Profit
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      ${result.netProfit}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Max Drawdown
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {result.maxDrawdown}%
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Profit Factor
                    </Typography>
                    <Typography variant="h6">{result.profitFactor}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Sharpe Ratio
                    </Typography>
                    <Typography variant="h6">{result.sharpeRatio}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Average Trade
                    </Typography>
                    <Typography variant="h6">${result.averageTrade}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Win/Loss Ratio
                    </Typography>
                    <Typography variant="h6">{result.winLossRatio}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Monthly Returns */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Monthly Returns
                </Typography>
                <Grid container spacing={2}>
                  {result.monthlyReturns.map((month) => (
                    <Grid item xs={4} sm={3} key={month.month}>
                      <Typography variant="subtitle2" color="textSecondary">
                        {month.month}
                      </Typography>
                      <Typography
                        variant="h6"
                        color={month.return >= 0 ? 'success.main' : 'error.main'}
                      >
                        {month.return}%
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
});

export default Backtesting;
