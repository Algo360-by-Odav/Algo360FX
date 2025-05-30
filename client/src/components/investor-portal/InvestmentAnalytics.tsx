import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  Divider,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Info as InfoIcon } from '@mui/icons-material';

export const InvestmentAnalytics: React.FC = observer(() => {
  const [timeframe, setTimeframe] = useState('1Y');
  const [comparisonMetric, setComparisonMetric] = useState('benchmark');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
    }).format(value / 100);
  };

  // Sample data for analytics
  const performanceData = [
    { month: 'Jan', portfolio: 4.5, benchmark: 3.2 },
    { month: 'Feb', portfolio: 3.8, benchmark: 2.8 },
    { month: 'Mar', portfolio: -1.2, benchmark: -2.1 },
    { month: 'Apr', portfolio: 2.9, benchmark: 2.5 },
    { month: 'May', portfolio: 1.8, benchmark: 1.2 },
    { month: 'Jun', portfolio: 3.2, benchmark: 2.8 },
  ];

  const riskMetrics = {
    sharpeRatio: 1.8,
    beta: 0.92,
    alpha: 2.3,
    volatility: 12.5,
  };

  const allocationData = [
    { name: 'Stocks', value: 45 },
    { name: 'Bonds', value: 30 },
    { name: 'Real Estate', value: 15 },
    { name: 'Cash', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box>
      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={timeframe}
                label="Timeframe"
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <MenuItem value="1M">1 Month</MenuItem>
                <MenuItem value="3M">3 Months</MenuItem>
                <MenuItem value="6M">6 Months</MenuItem>
                <MenuItem value="1Y">1 Year</MenuItem>
                <MenuItem value="3Y">3 Years</MenuItem>
                <MenuItem value="5Y">5 Years</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Comparison</InputLabel>
              <Select
                value={comparisonMetric}
                label="Comparison"
                onChange={(e) => setComparisonMetric(e.target.value)}
              >
                <MenuItem value="benchmark">Benchmark</MenuItem>
                <MenuItem value="sector">Sector Average</MenuItem>
                <MenuItem value="peers">Peer Group</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Performance Metrics */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Performance Analysis</Typography>
              <Tooltip title="Portfolio performance compared to benchmark">
                <IconButton size="small">
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <RechartsTooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="portfolio"
                  stroke="#8884d8"
                  name="Portfolio"
                />
                <Line
                  type="monotone"
                  dataKey="benchmark"
                  stroke="#82ca9d"
                  name="Benchmark"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Risk Metrics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Risk Metrics</Typography>
              <Tooltip title="Key risk indicators">
                <IconButton size="small">
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Sharpe Ratio
                    </Typography>
                    <Typography variant="h6">{riskMetrics.sharpeRatio}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Beta
                    </Typography>
                    <Typography variant="h6">{riskMetrics.beta}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Alpha
                    </Typography>
                    <Typography variant="h6">{formatPercent(riskMetrics.alpha)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Volatility
                    </Typography>
                    <Typography variant="h6">{formatPercent(riskMetrics.volatility)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Asset Allocation */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Asset Allocation</Typography>
              <Tooltip title="Current portfolio allocation">
                <IconButton size="small">
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Attribution Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Attribution Analysis</Typography>
              <Tooltip title="Performance attribution by strategy">
                <IconButton size="small">
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="portfolio" fill="#8884d8" name="Portfolio" />
                <Bar dataKey="benchmark" fill="#82ca9d" name="Benchmark" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default InvestmentAnalytics;
