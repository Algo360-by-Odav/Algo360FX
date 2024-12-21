import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';

interface Metric {
  label: string;
  value: number;
  format: 'currency' | 'percentage' | 'number';
  color?: string;
}

interface PerformanceMetricsProps {
  metrics: {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    netProfit: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
    averageTradeDuration: number;
    profitableMonths: number;
    maxConsecutiveWins: number;
    maxConsecutiveLosses: number;
  };
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ metrics }) => {
  const metricsList: Metric[] = [
    { label: 'Total Trades', value: metrics.totalTrades, format: 'number' },
    { label: 'Win Rate', value: metrics.winRate, format: 'percentage' },
    { label: 'Profit Factor', value: metrics.profitFactor, format: 'number' },
    {
      label: 'Net Profit',
      value: metrics.netProfit,
      format: 'currency',
      color: metrics.netProfit >= 0 ? '#4caf50' : '#f44336',
    },
    { label: 'Average Win', value: metrics.averageWin, format: 'currency' },
    { label: 'Average Loss', value: metrics.averageLoss, format: 'currency' },
    { label: 'Largest Win', value: metrics.largestWin, format: 'currency' },
    { label: 'Largest Loss', value: metrics.largestLoss, format: 'currency' },
    {
      label: 'Avg Trade Duration',
      value: metrics.averageTradeDuration,
      format: 'number',
    },
    {
      label: 'Profitable Months',
      value: metrics.profitableMonths,
      format: 'percentage',
    },
    {
      label: 'Max Consecutive Wins',
      value: metrics.maxConsecutiveWins,
      format: 'number',
    },
    {
      label: 'Max Consecutive Losses',
      value: metrics.maxConsecutiveLosses,
      format: 'number',
    },
  ];

  const formatValue = (metric: Metric) => {
    switch (metric.format) {
      case 'currency':
        return formatCurrency(metric.value);
      case 'percentage':
        return formatPercentage(metric.value);
      default:
        return metric.value.toLocaleString();
    }
  };

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {metricsList.map((metric) => (
        <Grid item xs={6} sm={4} md={3} key={metric.label}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              height: '100%',
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              {metric.label}
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: metric.color || 'white' }}
            >
              {formatValue(metric)}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default PerformanceMetrics;
