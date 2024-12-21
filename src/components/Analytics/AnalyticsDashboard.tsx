import React from 'react';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/RootStoreContext';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  Assessment,
  Timeline,
} from '@mui/icons-material';

const AnalyticsDashboard = observer(() => {
  const rootStore = useRootStore();
  const { analyticsStore } = rootStore;

  const performanceMetrics = {
    totalReturn: 25.5,
    sharpeRatio: 1.8,
    maxDrawdown: -12.3,
    winRate: 65.4,
    profitFactor: 2.1,
    averageWin: 450,
    averageLoss: -250,
    tradingDays: 120,
  };

  const tradingStats = [
    { period: 'Today', trades: 12, winRate: 75, pnl: 1200 },
    { period: 'This Week', trades: 45, winRate: 68, pnl: 3500 },
    { period: 'This Month', trades: 180, winRate: 65, pnl: 12000 },
    { period: 'This Year', trades: 850, winRate: 62, pnl: 45000 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Key Performance Metrics */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Return
              </Typography>
              <Typography variant="h4" color={performanceMetrics.totalReturn >= 0 ? 'success.main' : 'error.main'}>
                {performanceMetrics.totalReturn}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Sharpe Ratio
              </Typography>
              <Typography variant="h4">
                {performanceMetrics.sharpeRatio.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Win Rate
              </Typography>
              <Typography variant="h4">
                {performanceMetrics.winRate}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Profit Factor
              </Typography>
              <Typography variant="h4">
                {performanceMetrics.profitFactor.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Equity Curve
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  Equity curve chart will be implemented here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Trading Statistics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Trading Statistics
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Period</TableCell>
                      <TableCell align="right">Trades</TableCell>
                      <TableCell align="right">Win Rate</TableCell>
                      <TableCell align="right">P&L</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tradingStats.map((stat) => (
                      <TableRow key={stat.period}>
                        <TableCell>{stat.period}</TableCell>
                        <TableCell align="right">{stat.trades}</TableCell>
                        <TableCell align="right">{stat.winRate}%</TableCell>
                        <TableCell 
                          align="right"
                          sx={{ color: stat.pnl >= 0 ? 'success.main' : 'error.main' }}
                        >
                          ${stat.pnl.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Metrics */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Additional Metrics
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" gutterBottom>
                      Max Drawdown
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {performanceMetrics.maxDrawdown}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" gutterBottom>
                      Trading Days
                    </Typography>
                    <Typography variant="h6">
                      {performanceMetrics.tradingDays}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" gutterBottom>
                      Average Win
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      ${performanceMetrics.averageWin}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography color="textSecondary" gutterBottom>
                      Average Loss
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      ${performanceMetrics.averageLoss}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

export default AnalyticsDashboard;
