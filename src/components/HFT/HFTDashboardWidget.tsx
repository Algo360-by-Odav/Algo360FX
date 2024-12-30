import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Speed,
  TrendingUp,
  Warning,
  CheckCircle,
  PlayArrow,
  Stop,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../hooks/useRootStore';
import { useNavigate } from 'react-router-dom';

const HFTDashboardWidget: React.FC = observer(() => {
  const { hftStore } = useRootStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Start monitoring when component mounts
    hftStore.startMonitoring();
    return () => {
      // Cleanup when component unmounts
      hftStore.stopMonitoring();
    };
  }, [hftStore]);

  const performanceHistory = hftStore.getPerformanceHistory();
  const activeStrategies = hftStore.getActiveStrategies();

  const latestPerformance = performanceHistory[performanceHistory.length - 1];

  const handleNavigateToHFT = () => {
    navigate('/hft');
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Speed color="primary" />
            <Typography variant="h6">HFT Overview</Typography>
          </Box>
          <Tooltip title="Go to HFT Dashboard">
            <IconButton onClick={handleNavigateToHFT} size="small">
              <TrendingUp />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={2}>
          {/* Active Strategies */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Active Strategies
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {activeStrategies.map((strategy) => (
                <Chip
                  key={strategy.name}
                  label={strategy.name}
                  size="small"
                  icon={strategy.status === 'active' ? <CheckCircle /> : <Warning />}
                  color={strategy.status === 'active' ? 'success' : 'warning'}
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>

          {/* Performance Metrics */}
          {latestPerformance && (
            <>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2" color="textSecondary">
                  Win Rate
                </Typography>
                <Typography variant="h6">
                  {(latestPerformance.metrics.winRate * 100).toFixed(1)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={latestPerformance.metrics.winRate * 100}
                  color="success"
                  sx={{ mt: 1 }}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2" color="textSecondary">
                  Sharpe Ratio
                </Typography>
                <Typography variant="h6">
                  {latestPerformance.metrics.sharpeRatio.toFixed(2)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(latestPerformance.metrics.sharpeRatio * 33.33, 100)}
                  color="primary"
                  sx={{ mt: 1 }}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2" color="textSecondary">
                  Profit Factor
                </Typography>
                <Typography variant="h6">
                  {latestPerformance.metrics.profitFactor.toFixed(2)}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(latestPerformance.metrics.profitFactor * 50, 100)}
                  color="info"
                  sx={{ mt: 1 }}
                />
              </Grid>

              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2" color="textSecondary">
                  Drawdown
                </Typography>
                <Typography variant="h6">
                  {(latestPerformance.metrics.maxDrawdown * 100).toFixed(2)}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={latestPerformance.metrics.maxDrawdown * 100}
                  color="error"
                  sx={{ mt: 1 }}
                />
              </Grid>

              {/* Latency Metrics */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Latency:
                  </Typography>
                  <Chip
                    label={`Mean: ${latestPerformance.metrics.latency.mean.toFixed(2)}ms`}
                    size="small"
                    color="default"
                  />
                  <Chip
                    label={`P95: ${latestPerformance.metrics.latency.p95.toFixed(2)}ms`}
                    size="small"
                    color="default"
                  />
                  <Chip
                    label={`P99: ${latestPerformance.metrics.latency.p99.toFixed(2)}ms`}
                    size="small"
                    color="default"
                  />
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
});

export default HFTDashboardWidget;
