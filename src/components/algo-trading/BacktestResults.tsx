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
} from 'recharts';
import { BacktestResult } from '../../types/algo-trading';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface BacktestResultsProps {
  results: BacktestResult;
}

const BacktestResults: React.FC<BacktestResultsProps> = ({ results }) => {
  const metrics = [
    {
      label: 'Total Trades',
      value: results.performance.totalTrades,
      format: (v: number) => v.toString(),
    },
    {
      label: 'Win Rate',
      value: results.performance.winRate,
      format: (v: number) => formatPercentage(v),
    },
    {
      label: 'Net Profit',
      value: results.performance.netProfit,
      format: (v: number) => formatCurrency(v),
    },
    {
      label: 'ROI',
      value: results.performance.roi,
      format: (v: number) => formatPercentage(v),
    },
    {
      label: 'Profit Factor',
      value: results.performance.profitFactor,
      format: (v: number) => v.toFixed(2),
    },
    {
      label: 'Sharpe Ratio',
      value: results.performance.sharpeRatio,
      format: (v: number) => v.toFixed(2),
    },
    {
      label: 'Max Drawdown',
      value: results.performance.maxDrawdown,
      format: (v: number) => formatPercentage(v),
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
        Backtest Results
      </Typography>

      {/* Performance Metrics */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {metrics.map((metric) => (
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
                sx={{
                  color:
                    metric.label === 'Net Profit' || metric.label === 'ROI'
                      ? metric.value >= 0
                        ? '#4caf50'
                        : '#f44336'
                      : 'white',
                }}
              >
                {metric.format(metric.value)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Equity Curve */}
      <Paper
        sx={{ p: 2, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      >
        <Typography variant="subtitle1" sx={{ mb: 2, color: 'white' }}>
          Equity Curve
        </Typography>
        <Box sx={{ height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={results.equity}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
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
                stroke="rgba(255, 255, 255, 0.7)"
                tickFormatter={(value) => formatCurrency(value, 'USD', 0)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
                labelStyle={{ color: 'white' }}
                formatter={(value: number) => [
                  formatCurrency(value),
                  'Equity',
                ]}
                labelFormatter={(value) =>
                  new Date(value).toLocaleString()
                }
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2196f3"
                dot={false}
                name="Equity"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      {/* Trade List */}
      <Paper
        sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      >
        <Typography variant="subtitle1" sx={{ mb: 2, color: 'white' }}>
          Trade History
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Symbol
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Entry Date
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Exit Date
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Entry Price
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Exit Price
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  P&L
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell sx={{ color: 'white' }}>
                    {trade.symbol}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {new Date(trade.entryDate).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {new Date(trade.exitDate).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {formatCurrency(trade.entryPrice)}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {formatCurrency(trade.exitPrice)}
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {trade.quantity}
                  </TableCell>
                  <TableCell
                    sx={{
                      color: trade.pnl >= 0 ? '#4caf50' : '#f44336',
                    }}
                  >
                    {formatCurrency(trade.pnl)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default BacktestResults;
