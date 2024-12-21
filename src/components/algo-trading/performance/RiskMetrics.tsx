import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';

interface RiskMetricsProps {
  metrics: {
    drawdown: {
      timestamp: Date;
      value: number;
    }[];
    volatility: {
      timestamp: Date;
      value: number;
    }[];
    riskMetrics: {
      sharpeRatio: number;
      sortinoRatio: number;
      calmarRatio: number;
      maxDrawdown: number;
      averageDrawdown: number;
      drawdownDuration: number;
      recoveryFactor: number;
      valueAtRisk: number;
      expectedShortfall: number;
    };
  };
}

const RiskMetrics: React.FC<RiskMetricsProps> = ({ metrics }) => {
  const riskMetricsList = [
    {
      label: 'Sharpe Ratio',
      value: metrics.riskMetrics.sharpeRatio,
      format: 'number',
    },
    {
      label: 'Sortino Ratio',
      value: metrics.riskMetrics.sortinoRatio,
      format: 'number',
    },
    {
      label: 'Calmar Ratio',
      value: metrics.riskMetrics.calmarRatio,
      format: 'number',
    },
    {
      label: 'Max Drawdown',
      value: metrics.riskMetrics.maxDrawdown,
      format: 'percentage',
    },
    {
      label: 'Avg Drawdown',
      value: metrics.riskMetrics.averageDrawdown,
      format: 'percentage',
    },
    {
      label: 'Drawdown Duration',
      value: metrics.riskMetrics.drawdownDuration,
      format: 'days',
    },
    {
      label: 'Recovery Factor',
      value: metrics.riskMetrics.recoveryFactor,
      format: 'number',
    },
    {
      label: 'Value at Risk (95%)',
      value: metrics.riskMetrics.valueAtRisk,
      format: 'currency',
    },
    {
      label: 'Expected Shortfall',
      value: metrics.riskMetrics.expectedShortfall,
      format: 'currency',
    },
  ];

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'days':
        return `${value} days`;
      default:
        return value.toFixed(2);
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 3, color: 'white' }}>
        Risk Analysis
      </Typography>

      {/* Risk Metrics Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {riskMetricsList.map((metric) => (
          <Grid item xs={12} sm={6} md={4} key={metric.label}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                {metric.label}
              </Typography>
              <Typography variant="h6" sx={{ color: 'white' }}>
                {formatValue(metric.value, metric.format)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Drawdown Chart */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle2"
          sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}
        >
          Drawdown Analysis
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.drawdown}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.1)"
              />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString()
                }
                stroke="rgba(255, 255, 255, 0.7)"
              />
              <YAxis
                tickFormatter={(value) => formatPercentage(value)}
                stroke="rgba(255, 255, 255, 0.7)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                labelStyle={{ color: 'white' }}
                formatter={(value: number) => [
                  formatPercentage(value),
                  'Drawdown',
                ]}
                labelFormatter={(value) =>
                  new Date(value).toLocaleString()
                }
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#f44336"
                fill="#f4433630"
                name="Drawdown"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </Box>

      {/* Volatility Chart */}
      <Box>
        <Typography
          variant="subtitle2"
          sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.7)' }}
        >
          Volatility Analysis
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.volatility}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255, 255, 255, 0.1)"
              />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString()
                }
                stroke="rgba(255, 255, 255, 0.7)"
              />
              <YAxis
                tickFormatter={(value) => formatPercentage(value)}
                stroke="rgba(255, 255, 255, 0.7)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                labelStyle={{ color: 'white' }}
                formatter={(value: number) => [
                  formatPercentage(value),
                  'Volatility',
                ]}
                labelFormatter={(value) =>
                  new Date(value).toLocaleString()
                }
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#ff9800"
                dot={false}
                name="Volatility"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </Paper>
  );
};

export default RiskMetrics;
