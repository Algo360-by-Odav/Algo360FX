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
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Assessment,
  Timeline,
  AttachMoney,
  ShowChart,
  Info,
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useStores } from '../../stores/StoreProvider';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const InvestorDashboard = observer(() => {
  const { investorPortalStore } = useStores();
  const profile = investorPortalStore.getProfile();
  const allocations = investorPortalStore.getAllocations();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  };

  // Sample data for charts
  const monthlyPerformance = [
    { month: 'Jan', return: 4.5, benchmark: 3.2 },
    { month: 'Feb', return: 3.8, benchmark: 2.8 },
    { month: 'Mar', return: 5.2, benchmark: 4.1 },
    { month: 'Apr', return: 4.1, benchmark: 3.5 },
    { month: 'May', return: 6.3, benchmark: 4.8 },
    { month: 'Jun', return: 5.5, benchmark: 4.2 },
  ];

  const assetAllocation = [
    { name: 'Forex', value: 45 },
    { name: 'Commodities', value: 25 },
    { name: 'Indices', value: 20 },
    { name: 'Crypto', value: 10 },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{ width: 64, height: 64, mr: 2, bgcolor: 'primary.main' }}
                  >
                    {profile.name[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{profile.name}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Chip
                        label={profile.type}
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={profile.riskProfile}
                        size="small"
                        color={
                          profile.riskProfile === 'Conservative'
                            ? 'success'
                            : profile.riskProfile === 'Moderate'
                            ? 'warning'
                            : 'error'
                        }
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Account Size
                    </Typography>
                    <Typography variant="h6">
                      {formatCurrency(profile.accountSize)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      YTD Return
                    </Typography>
                    <Typography
                      variant="h6"
                      color={profile.performance.yearToDate > 0 ? 'success.main' : 'error.main'}
                    >
                      {formatPercent(profile.performance.yearToDate)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Overview
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <LineChart
                  data={monthlyPerformance}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="return"
                    stroke="#8884d8"
                    name="Portfolio Return %"
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    stroke="#82ca9d"
                    name="Benchmark %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Asset Allocation */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Asset Allocation
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={assetAllocation}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Portfolio Stats */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Portfolio Value
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(profile.portfolio.totalValue)}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={profile.portfolio.pnl > 0 ? 'success.main' : 'error.main'}
                  >
                    {profile.portfolio.pnl > 0 ? '+' : ''}
                    {formatCurrency(profile.portfolio.pnl)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Cash Balance
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(profile.portfolio.cashBalance)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Available for Investment
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Margin Utilized
                  </Typography>
                  <Typography variant="h5">
                    {formatCurrency(profile.portfolio.marginUsed)}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(profile.portfolio.marginUsed / profile.portfolio.totalValue) * 100}
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Open Positions
                  </Typography>
                  <Typography variant="h5">
                    {profile.portfolio.openPositions}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Investments
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activity
            </Typography>
            <Grid container spacing={2}>
              {allocations.map((allocation) => (
                <Grid item xs={12} key={allocation.id}>
                  <Box
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1">
                          {investorPortalStore.getOpportunityById(allocation.opportunityId)?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatCurrency(allocation.amount)} Invested
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Typography variant="body2" color="text.secondary">
                          Current Value
                        </Typography>
                        <Typography variant="subtitle1">
                          {formatCurrency(allocation.performance.currentValue)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Typography variant="body2" color="text.secondary">
                          Total Return
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color={allocation.performance.totalReturn > 0 ? 'success.main' : 'error.main'}
                        >
                          {formatPercent(allocation.performance.totalReturn)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={2}>
                        <Typography variant="body2" color="text.secondary">
                          Unrealized P/L
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          color={allocation.performance.unrealizedPnL > 0 ? 'success.main' : 'error.main'}
                        >
                          {formatCurrency(allocation.performance.unrealizedPnL)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Info />}
                            sx={{ mr: 1 }}
                          >
                            Details
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<TrendingUp />}
                          >
                            Manage
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

