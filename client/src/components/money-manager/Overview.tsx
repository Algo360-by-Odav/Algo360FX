import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { useStores } from '../../stores/StoreProvider';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const Overview = observer(() => {
  const { moneyManagerStore } = useStores();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return '#4caf50';
      case 'medium':
        return '#ff9800';
      case 'high':
        return '#f44336';
      case 'medium-high':
        return '#ff5722';
      default:
        return '#757575';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Key Stats */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Assets Under Management
              </Typography>
              <Typography variant="h4">
                {formatCurrency(125000000)}
              </Typography>
              <Typography color="success.main" variant="subtitle2">
                +8.5% this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Portfolios
              </Typography>
              <Typography variant="h4">85</Typography>
              <Typography variant="subtitle2">
                Across 320 clients
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Performance
              </Typography>
              <Typography variant="h4">68.5%</Typography>
              <Typography variant="subtitle2">
                Win rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Risk Metrics
              </Typography>
              <Typography variant="h4">1.80</Typography>
              <Typography variant="subtitle2">
                Sharpe Ratio
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Strategy Performance */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Strategy Performance
            </Typography>
            <Grid container spacing={2}>
              {moneyManagerStore.getStrategyPerformance().map((strategy) => (
                <Grid item xs={12} key={strategy.name}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body1" sx={{ flex: 1 }}>
                      {strategy.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'success.main', mr: 2 }}
                    >
                      +{strategy.performance}%
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: getRiskLevelColor(strategy.riskLevel),
                        color: 'white',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.75rem',
                      }}
                    >
                      {strategy.riskLevel}
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={(strategy.performance / 15) * 100}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getRiskLevelColor(strategy.riskLevel),
                      },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Asset Allocation */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Asset Allocation Overview
            </Typography>
            <Box sx={{ mt: 2 }}>
              {moneyManagerStore.getAssetAllocation().map((asset) => (
                <Box key={asset.assetClass} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{asset.assetClass}</Typography>
                    <Typography>{asset.current}% / {asset.target}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={asset.current}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.200',
                    }}
                  />
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Box sx={{ mt: 2 }}>
              {moneyManagerStore.getRecentTrades().slice(0, 4).map((trade, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: 'background.default',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: trade.type === 'BUY' ? 'success.main' : 'error.main',
                          mr: 1,
                        }}
                      />
                      <Typography variant="body2">
                        {trade.type} {trade.pair}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(Math.abs(trade.profitLoss))} - {trade.date}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

