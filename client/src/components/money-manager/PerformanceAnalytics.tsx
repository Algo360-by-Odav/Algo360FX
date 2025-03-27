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
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useStores } from '../../stores/StoreProvider';

export const PerformanceAnalytics = observer(() => {
  const { moneyManagerStore } = useStores();
  const metrics = moneyManagerStore.getPerformanceMetrics();
  const riskAnalysis = moneyManagerStore.getRiskAnalysis();
  const portfolioData = moneyManagerStore.getPortfolioPerformance();

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Key Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Key Performance Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Return
                    </Typography>
                    <Typography variant="h5" color="success.main">
                      +{metrics.totalReturn}%
                    </Typography>
                    <Typography variant="caption">
                      YTD: +{metrics.ytdReturn}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Sharpe Ratio
                    </Typography>
                    <Typography variant="h5">
                      {metrics.sharpeRatio}
                    </Typography>
                    <Typography variant="caption">
                      3M: {metrics.sharpeRatio3M}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Max Drawdown
                    </Typography>
                    <Typography variant="h5" color="error.main">
                      {metrics.maxDrawdown}%
                    </Typography>
                    <Typography variant="caption">
                      1Y: {metrics.maxDrawdown1Y}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Win Rate
                    </Typography>
                    <Typography variant="h5">
                      {metrics.winRate}%
                    </Typography>
                    <Typography variant="caption">
                      MTD: +{metrics.winRateMTD}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Risk Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Risk Analysis
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Value at Risk (VaR)
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(riskAnalysis.valueAtRisk)}
                  </Typography>
                  <Chip
                    label={riskAnalysis.riskLevel}
                    size="small"
                    sx={{
                      bgcolor: getRiskLevelColor(riskAnalysis.riskLevel),
                      color: 'white',
                      mt: 1,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Beta
                  </Typography>
                  <Typography variant="h6">{riskAnalysis.beta}</Typography>
                  <Chip
                    label={riskAnalysis.betaLevel}
                    size="small"
                    sx={{
                      bgcolor: getRiskLevelColor(riskAnalysis.betaLevel),
                      color: 'white',
                      mt: 1,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Volatility
                  </Typography>
                  <Typography variant="h6">{riskAnalysis.volatility}%</Typography>
                  <Chip
                    label={riskAnalysis.volatilityLevel}
                    size="small"
                    sx={{
                      bgcolor: getRiskLevelColor(riskAnalysis.volatilityLevel),
                      color: 'white',
                      mt: 1,
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Correlation
                  </Typography>
                  <Typography variant="h6">{riskAnalysis.correlation}</Typography>
                  <Chip
                    label={riskAnalysis.correlationLevel}
                    size="small"
                    sx={{
                      bgcolor: getRiskLevelColor(riskAnalysis.correlationLevel),
                      color: 'white',
                      mt: 1,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Portfolio Performance Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Portfolio Performance vs Benchmark
            </Typography>
            <Box sx={{ width: '100%', height: 400 }}>
              <ResponsiveContainer>
                <LineChart
                  data={portfolioData.months.map((month, index) => ({
                    month,
                    portfolio: portfolioData.portfolio[index],
                    benchmark: portfolioData.benchmark[index],
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="portfolio"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Portfolio"
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmark"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name="Benchmark"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

