import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  LinearProgress,
} from '@mui/material';
import { useRootStoreContext } from '../../stores/RootStoreContext';

const TradingPerformance: React.FC = observer(() => {
  const { algoTradingStore } = useRootStoreContext();

  // Sample performance metrics
  const metrics = {
    totalProfit: 385.00,
    profitToday: 45.75,
    totalTrades: 45,
    winRate: 67,
    averageProfit: 12.50,
    averageLoss: -8.25,
    sharpeRatio: 1.8,
    maxDrawdown: -5.2,
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Performance Metrics
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Profit
              </Typography>
              <Typography variant="h6" color={metrics.totalProfit >= 0 ? 'success.main' : 'error.main'}>
                ${metrics.totalProfit.toFixed(2)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Today's Profit
              </Typography>
              <Typography variant="h6" color={metrics.profitToday >= 0 ? 'success.main' : 'error.main'}>
                ${metrics.profitToday.toFixed(2)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Trades
              </Typography>
              <Typography variant="h6">
                {metrics.totalTrades}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Win Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={metrics.winRate} 
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">
                    {metrics.winRate}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Average Profit
              </Typography>
              <Typography variant="h6" color="success.main">
                ${metrics.averageProfit.toFixed(2)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Average Loss
              </Typography>
              <Typography variant="h6" color="error.main">
                ${metrics.averageLoss.toFixed(2)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Sharpe Ratio
              </Typography>
              <Typography variant="h6">
                {metrics.sharpeRatio.toFixed(2)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Max Drawdown
              </Typography>
              <Typography variant="h6" color="error.main">
                {metrics.maxDrawdown}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

export default TradingPerformance;
