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
  CardHeader,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  Speed,
  Assessment,
  Refresh,
} from '@mui/icons-material';

const Dashboard = observer(() => {
  const rootStore = useRootStore();
  const { portfolioStore, marketStore, riskStore, hftStore } = rootStore;

  const performanceData = {
    dailyPnL: 2500.50,
    weeklyPnL: 12000.75,
    monthlyPnL: 45000.25,
    totalEquity: 1000000.00,
    winRate: 0.65,
    sharpeRatio: 1.8,
    drawdown: -0.05,
  };

  const marketOverview = {
    volatilityIndex: 15.5,
    marketSentiment: 'Bullish',
    activePositions: 8,
    openOrders: 12,
  };

  const renderMetricCard = (title: string, value: any, icon: React.ReactNode, trend?: 'up' | 'down') => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
          {icon}
        </Box>
        <Typography variant="h4" component="div" sx={{ mb: 1 }}>
          {typeof value === 'number' && title.includes('PnL') 
            ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
            : value}
        </Typography>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', color: trend === 'up' ? 'success.main' : 'error.main' }}>
            {trend === 'up' ? <TrendingUp /> : <TrendingDown />}
            <Typography variant="body2" sx={{ ml: 1 }}>
              {trend === 'up' ? '+2.5%' : '-1.2%'} from yesterday
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderPerformanceMetrics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={3}>
        {renderMetricCard(
          'Daily P&L',
          performanceData.dailyPnL,
          <ShowChart color="primary" />,
          'up'
        )}
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        {renderMetricCard(
          'Total Equity',
          performanceData.totalEquity,
          <Assessment color="primary" />,
          'up'
        )}
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        {renderMetricCard(
          'Win Rate',
          `${(performanceData.winRate * 100).toFixed(1)}%`,
          <TrendingUp color="success" />
        )}
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        {renderMetricCard(
          'Drawdown',
          `${(performanceData.drawdown * 100).toFixed(1)}%`,
          <TrendingDown color="error" />
        )}
      </Grid>
    </Grid>
  );

  const renderMarketOverview = () => (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12} lg={8}>
        <Card>
          <CardHeader
            title="Active Positions"
            action={
              <Tooltip title="Refresh">
                <IconButton>
                  <Refresh />
                </IconButton>
              </Tooltip>
            }
          />
          <CardContent>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body1" color="textSecondary">
                Position chart will be implemented here
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={4}>
        <Card sx={{ height: '100%' }}>
          <CardHeader title="Market Overview" />
          <CardContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Volatility Index
              </Typography>
              <Typography variant="h6">
                {marketOverview.volatilityIndex}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={marketOverview.volatilityIndex} 
                sx={{ mt: 1 }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Market Sentiment
              </Typography>
              <Typography variant="h6" color="success.main">
                {marketOverview.marketSentiment}
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Active Positions
              </Typography>
              <Typography variant="h6">
                {marketOverview.activePositions}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Open Orders
              </Typography>
              <Typography variant="h6">
                {marketOverview.openOrders}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Trading Dashboard
      </Typography>
      {renderPerformanceMetrics()}
      {renderMarketOverview()}
    </Box>
  );
});

export default Dashboard;
