import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../hooks/useStore';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const StrategyPerformance = observer(() => {
  const theme = useTheme();
  const { analyticsStore } = useStore();
  const [loading, setLoading] = React.useState(false);

  // Get performance metrics
  const metrics = React.useMemo(() => {
    return {
      netProfit: analyticsStore.getNetProfit(),
      winRate: analyticsStore.getWinRate(),
      profitFactor: analyticsStore.getProfitFactor(),
      sharpeRatio: analyticsStore.getSharpeRatio(),
      maxDrawdown: analyticsStore.getMaxDrawdown(),
      averageRRR: analyticsStore.getAverageRRR(),
      expectancy: analyticsStore.getExpectancy(),
      totalTrades: analyticsStore.getTotalTrades(),
    };
  }, [analyticsStore]);

  // Get equity curve data
  const equityCurve = React.useMemo(() => analyticsStore.getEquityCurve(), [analyticsStore]);

  // Get monthly returns
  const monthlyReturns = React.useMemo(() => analyticsStore.getMonthlyReturns(), [analyticsStore]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Performance Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography color="text.secondary" variant="body2">
                  Net Profit
                </Typography>
                <Typography variant="h6" color={metrics.netProfit >= 0 ? 'success.main' : 'error.main'}>
                  {formatCurrency(metrics.netProfit)}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography color="text.secondary" variant="body2">
                  Win Rate
                </Typography>
                <Typography variant="h6">
                  {formatPercentage(metrics.winRate)}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography color="text.secondary" variant="body2">
                  Profit Factor
                </Typography>
                <Typography variant="h6">
                  {metrics.profitFactor.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography color="text.secondary" variant="body2">
                  Sharpe Ratio
                </Typography>
                <Typography variant="h6">
                  {metrics.sharpeRatio.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography color="text.secondary" variant="body2">
                  Max Drawdown
                </Typography>
                <Typography variant="h6" color="error.main">
                  {formatPercentage(metrics.maxDrawdown)}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography color="text.secondary" variant="body2">
                  Average RRR
                </Typography>
                <Typography variant="h6">
                  {metrics.averageRRR.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography color="text.secondary" variant="body2">
                  Expectancy
                </Typography>
                <Typography variant="h6">
                  {metrics.expectancy.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography color="text.secondary" variant="body2">
                  Total Trades
                </Typography>
                <Typography variant="h6">
                  {metrics.totalTrades}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Equity Curve */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Equity Curve
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={equityCurve}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke={theme.palette.primary.main}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Monthly Returns */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Returns
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={monthlyReturns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPercentage(value)} />
                  <Bar
                    dataKey="return"
                    fill={theme.palette.primary.main}
                    name="Return"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default StrategyPerformance;
