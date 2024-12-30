import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { TradingStrategy } from '../../../types/algo-trading';
import { BacktestResult } from '../../../types/backtest';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';

interface ComparisonMetricsProps {
  strategies: TradingStrategy[];
  results: Record<string, BacktestResult>;
}

interface MetricDefinition {
  name: string;
  description: string;
  formatter: (value: number) => string;
  category: 'performance' | 'risk' | 'trade';
  importance: number;
}

const METRICS: MetricDefinition[] = [
  {
    name: 'Net Profit',
    description: 'Total profit after all fees and costs',
    formatter: formatCurrency,
    category: 'performance',
    importance: 1,
  },
  {
    name: 'Win Rate',
    description: 'Percentage of winning trades',
    formatter: formatPercentage,
    category: 'performance',
    importance: 1,
  },
  {
    name: 'Profit Factor',
    description: 'Ratio of gross profit to gross loss',
    formatter: (v) => v.toFixed(2),
    category: 'performance',
    importance: 1,
  },
  {
    name: 'Sharpe Ratio',
    description: 'Risk-adjusted return relative to risk-free rate',
    formatter: (v) => v.toFixed(2),
    category: 'risk',
    importance: 1,
  },
  {
    name: 'Max Drawdown',
    description: 'Largest peak-to-trough decline',
    formatter: formatPercentage,
    category: 'risk',
    importance: 1,
  },
  {
    name: 'Recovery Factor',
    description: 'Net profit divided by max drawdown',
    formatter: (v) => v.toFixed(2),
    category: 'risk',
    importance: 2,
  },
  {
    name: 'Sortino Ratio',
    description: 'Return relative to downside volatility',
    formatter: (v) => v.toFixed(2),
    category: 'risk',
    importance: 2,
  },
  {
    name: 'Calmar Ratio',
    description: 'Return relative to max drawdown',
    formatter: (v) => v.toFixed(2),
    category: 'risk',
    importance: 2,
  },
  {
    name: 'Total Trades',
    description: 'Number of completed trades',
    formatter: (v) => v.toString(),
    category: 'trade',
    importance: 1,
  },
  {
    name: 'Average Trade',
    description: 'Average profit per trade',
    formatter: formatCurrency,
    category: 'trade',
    importance: 2,
  },
  {
    name: 'Win/Loss Ratio',
    description: 'Average win divided by average loss',
    formatter: (v) => v.toFixed(2),
    category: 'trade',
    importance: 2,
  },
  {
    name: 'Expectancy',
    description: 'Expected profit per trade',
    formatter: formatCurrency,
    category: 'trade',
    importance: 1,
  },
];

const ComparisonMetrics: React.FC<ComparisonMetricsProps> = ({
  strategies,
  results,
}) => {
  const renderMetricSection = (category: string) => {
    const categoryMetrics = METRICS.filter((m) => m.category === category);

    return (
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                  {category} Metrics
                </Typography>
              </TableCell>
              {strategies.map((strategy) => (
                <TableCell key={strategy.id} align="right">
                  {strategy.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {categoryMetrics.map((metric) => (
              <TableRow key={metric.name}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {metric.name}
                    <Tooltip title={metric.description}>
                      <InfoIcon sx={{ ml: 1, fontSize: 16, color: 'text.secondary' }} />
                    </Tooltip>
                  </Box>
                </TableCell>
                {strategies.map((strategy) => {
                  const result = results[strategy.id];
                  const value = result.metrics[metric.name.toLowerCase().replace(/\s/g, '')];
                  const formattedValue = metric.formatter(value);

                  return (
                    <TableCell
                      key={strategy.id}
                      align="right"
                      sx={{
                        color:
                          value > 0
                            ? 'success.main'
                            : value < 0
                            ? 'error.main'
                            : 'inherit',
                      }}
                    >
                      {formattedValue}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderStatisticalAnalysis = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Risk-Adjusted Performance
          </Typography>
          <Table size="small">
            <TableBody>
              {strategies.map((strategy) => {
                const result = results[strategy.id];
                return (
                  <TableRow key={strategy.id}>
                    <TableCell>{strategy.name}</TableCell>
                    <TableCell align="right">
                      {(
                        (result.metrics.netProfit / result.metrics.maxDrawdown) *
                        result.metrics.sharpeRatio
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Consistency Score
          </Typography>
          <Table size="small">
            <TableBody>
              {strategies.map((strategy) => {
                const result = results[strategy.id];
                return (
                  <TableRow key={strategy.id}>
                    <TableCell>{strategy.name}</TableCell>
                    <TableCell align="right">
                      {(
                        (result.metrics.winRate *
                          result.metrics.profitFactor *
                          result.metrics.recoveryFactor) /
                        3
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box>
      {renderMetricSection('performance')}
      {renderMetricSection('risk')}
      {renderMetricSection('trade')}
      {renderStatisticalAnalysis()}
    </Box>
  );
};

export default ComparisonMetrics;
