import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  LinearProgress,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TradingMetric {
  name: string;
  value: number;
  change: number;
  target?: number;
}

interface TradingStatsProps {
  stats: {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
    sharpeRatio: number;
    drawdown: number;
  };
}

const MetricCard: React.FC<{ metric: TradingMetric }> = ({ metric }) => (
  <Paper sx={{ p: 2, height: '100%' }}>
    <Typography variant="subtitle2" color="textSecondary">
      {metric.name}
    </Typography>
    <Typography variant="h4" sx={{ my: 1 }}>
      {typeof metric.value === 'number' ? 
        (metric.name.toLowerCase().includes('ratio') ? 
          metric.value.toFixed(2) : 
          metric.value.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
          })
        ) : metric.value}
      {metric.name.toLowerCase().includes('rate') || metric.name.toLowerCase().includes('drawdown') ? '%' : ''}
    </Typography>
    {metric.change !== undefined && (
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography
          variant="body2"
          color={metric.change >= 0 ? 'success.main' : 'error.main'}
        >
          {metric.change >= 0 ? '+' : ''}{metric.change}%
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
          vs last month
        </Typography>
      </Box>
    )}
    {metric.target && (
      <>
        <LinearProgress
          variant="determinate"
          value={(metric.value / metric.target) * 100}
          sx={{ mb: 1 }}
        />
        <Typography variant="body2" color="textSecondary">
          Target: {metric.target}%
        </Typography>
      </>
    )}
  </Paper>
);

const TradingStats: React.FC<TradingStatsProps> = ({ stats }) => {
  const metrics: TradingMetric[] = [
    {
      name: 'Total Trades',
      value: stats.totalTrades,
      change: 0, // We'll need to implement historical comparison
    },
    {
      name: 'Win Rate',
      value: stats.winRate,
      change: 0,
      target: 70,
    },
    {
      name: 'Profit Factor',
      value: stats.profitFactor,
      change: 0,
      target: 2.5,
    },
    {
      name: 'Sharpe Ratio',
      value: stats.sharpeRatio,
      change: 0,
      target: 2.0,
    },
    {
      name: 'Max Drawdown',
      value: Math.abs(stats.drawdown),
      change: 0,
      target: 20,
    },
    {
      name: 'Average Win',
      value: stats.averageWin,
      change: 0,
    },
    {
      name: 'Average Loss',
      value: Math.abs(stats.averageLoss),
      change: 0,
    },
    {
      name: 'Largest Win',
      value: stats.largestWin,
      change: 0,
    },
  ];

  // We'll implement this when we have historical data
  const performanceData = [
    { month: 'Current', profit: stats.averageWin * (stats.totalTrades * stats.winRate / 100) },
  ];

  return (
    <Box>
      <Grid container spacing={3}>
        {metrics.map((metric) => (
          <Grid item xs={12} sm={6} md={3} key={metric.name}>
            <MetricCard metric={metric} />
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Performance Overview
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="profit"
                fill="#8884d8"
                name="Profit/Loss"
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default TradingStats;
