import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  IconButton,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  AccessTime,
  Star,
  People,
  CheckCircle,
  Notifications,
  Settings,
} from '@mui/icons-material';
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
import { useStores } from '../../stores/StoreProvider';

export const SignalDashboard = observer(() => {
  const { signalProviderStore } = useStores();
  const providers = signalProviderStore.getProviders();
  const activeSignals = signalProviderStore.getActiveSignals();

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
      default:
        return '#757575';
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Subscribed Providers */}
        {providers.map((provider) => (
          <Grid item xs={12} key={provider.id}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Provider Header */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}
                    >
                      {provider.name[0]}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" sx={{ mr: 1 }}>
                          {provider.name}
                        </Typography>
                        {provider.verified && (
                          <CheckCircle color="primary" sx={{ fontSize: 20 }} />
                        )}
                        <Chip
                          label={provider.risk.riskLevel}
                          size="small"
                          sx={{
                            ml: 2,
                            bgcolor: getRiskLevelColor(provider.risk.riskLevel),
                            color: 'white',
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {provider.description}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton>
                        <Notifications />
                      </IconButton>
                      <IconButton>
                        <Settings />
                      </IconButton>
                    </Box>
                  </Box>
                </Grid>

                {/* Performance Metrics */}
                <Grid item xs={12} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Return
                      </Typography>
                      <Typography variant="h4" color="success.main">
                        +{provider.performance.totalReturn}%
                      </Typography>
                      <Typography variant="caption">
                        Monthly: +{provider.performance.monthlyReturn}%
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Win Rate
                      </Typography>
                      <Typography variant="h4">
                        {provider.performance.winRate}%
                      </Typography>
                      <Typography variant="caption">
                        Profit Factor: {provider.performance.profitFactor}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Signals
                      </Typography>
                      <Typography variant="h4">
                        {provider.performance.totalSignals}
                      </Typography>
                      <Typography variant="caption">
                        Avg: {provider.performance.avgTradesPerMonth}/month
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Subscribers
                      </Typography>
                      <Typography variant="h4">
                        {provider.subscription.subscribers}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ color: 'gold', mr: 0.5 }} />
                        <Typography variant="caption">
                          {provider.subscription.rating} ({provider.subscription.reviews} reviews)
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Strategy Info */}
                <Grid item xs={12}>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Strategy Details
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Type: {provider.strategy.type}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Instruments: {provider.strategy.instruments.join(', ')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Timeframes: {provider.strategy.timeframes.join(', ')}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>

                {/* Active Signals */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Latest Signals
                  </Typography>
                  <Grid container spacing={2}>
                    {signalProviderStore
                      .getSignalsByProvider(provider.id)
                      .slice(0, 2)
                      .map((signal) => (
                        <Grid item xs={12} md={6} key={signal.id}>
                          <Card variant="outlined">
                            <CardContent>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="h6" sx={{ flex: 1 }}>
                                  {signal.pair}
                                </Typography>
                                <Chip
                                  label={signal.type}
                                  color={signal.type === 'BUY' ? 'success' : 'error'}
                                  size="small"
                                />
                              </Box>
                              <Grid container spacing={2}>
                                <Grid item xs={4}>
                                  <Typography variant="caption" color="text.secondary">
                                    Entry
                                  </Typography>
                                  <Typography>{signal.entryPrice}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography variant="caption" color="text.secondary">
                                    Stop Loss
                                  </Typography>
                                  <Typography>{signal.stopLoss}</Typography>
                                </Grid>
                                <Grid item xs={4}>
                                  <Typography variant="caption" color="text.secondary">
                                    Take Profit
                                  </Typography>
                                  <Typography>{signal.takeProfit[0]}</Typography>
                                </Grid>
                              </Grid>
                              <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Confidence
                                </Typography>
                                <LinearProgress
                                  variant="determinate"
                                  value={signal.confidence}
                                  sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: 'grey.200',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: signal.confidence > 70 ? 'success.main' : 'warning.main',
                                    },
                                  }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

