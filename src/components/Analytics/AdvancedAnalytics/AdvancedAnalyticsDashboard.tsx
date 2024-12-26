import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Grid,
  Box,
  Card,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
} from '@mui/material';
import CorrelationMatrix from './CorrelationMatrix';
import VolatilityAnalysis from './VolatilityAnalysis';
import PortfolioOptimization from './PortfolioOptimization';

// Mock data - Replace with actual API calls
const mockData = {
  correlationData: [
    {
      id: 'EURUSD',
      data: [
        { x: 'EURUSD', y: 1 },
        { x: 'GBPUSD', y: 0.8 },
        { x: 'USDJPY', y: -0.3 },
        { x: 'AUDUSD', y: 0.6 },
      ],
    },
    {
      id: 'GBPUSD',
      data: [
        { x: 'EURUSD', y: 0.8 },
        { x: 'GBPUSD', y: 1 },
        { x: 'USDJPY', y: -0.2 },
        { x: 'AUDUSD', y: 0.5 },
      ],
    },
    {
      id: 'USDJPY',
      data: [
        { x: 'EURUSD', y: -0.3 },
        { x: 'GBPUSD', y: -0.2 },
        { x: 'USDJPY', y: 1 },
        { x: 'AUDUSD', y: -0.4 },
      ],
    },
    {
      id: 'AUDUSD',
      data: [
        { x: 'EURUSD', y: 0.6 },
        { x: 'GBPUSD', y: 0.5 },
        { x: 'USDJPY', y: -0.4 },
        { x: 'AUDUSD', y: 1 },
      ],
    },
  ],
  volatilityData: [
    {
      id: 'EURUSD',
      data: [
        { x: '2024-01-01', y: 8.2 },
        { x: '2024-01-15', y: 7.8 },
        { x: '2024-02-01', y: 9.1 },
        { x: '2024-02-15', y: 8.5 },
      ],
    },
    {
      id: 'GBPUSD',
      data: [
        { x: '2024-01-01', y: 9.5 },
        { x: '2024-01-15', y: 8.9 },
        { x: '2024-02-01', y: 10.2 },
        { x: '2024-02-15', y: 9.8 },
      ],
    },
  ],
  portfolioData: [
    {
      id: 'Current Portfolio',
      data: [
        { x: 12.5, y: 8.2 },
      ],
    },
    {
      id: 'Efficient Frontier',
      data: [
        { x: 8.0, y: 5.5 },
        { x: 10.0, y: 7.0 },
        { x: 12.0, y: 8.5 },
        { x: 14.0, y: 9.8 },
        { x: 16.0, y: 11.0 },
      ],
    },
  ],
};

const AdvancedAnalyticsDashboard: React.FC = observer(() => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(mockData);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(mockData);
        setError(null);
      } catch (err) {
        setError('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Grid container spacing={2}>
      {/* Market Overview */}
      <Grid item xs={12}>
        <Card sx={{ p: 2, mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Advanced Market Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive analysis of market correlations, volatility patterns, and portfolio optimization metrics.
          </Typography>
        </Card>
      </Grid>

      {/* Correlation Matrix */}
      <Grid item xs={12}>
        <CorrelationMatrix data={data.correlationData} />
      </Grid>

      {/* Volatility Analysis */}
      <Grid item xs={12} md={6}>
        <VolatilityAnalysis data={data.volatilityData} />
      </Grid>

      {/* Portfolio Optimization */}
      <Grid item xs={12} md={6}>
        <PortfolioOptimization data={data.portfolioData} />
      </Grid>

      {/* Additional Metrics */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Key Insights
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" color="primary">
                Correlation Insights
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Strong positive correlation between EUR/USD and GBP/USD (0.8) suggests potential pairs trading opportunities.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" color="primary">
                Volatility Patterns
              </Typography>
              <Typography variant="body2" color="text.secondary">
                GBP/USD shows higher average volatility (9.6%) compared to EUR/USD (8.4%), indicating increased risk and potential returns.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" color="primary">
                Portfolio Efficiency
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current portfolio allocation is slightly above the efficient frontier, suggesting room for optimization.
              </Typography>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
});

export default AdvancedAnalyticsDashboard;
