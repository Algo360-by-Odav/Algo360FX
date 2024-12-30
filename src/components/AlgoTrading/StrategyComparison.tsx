import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Bar,
  BarChart,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import { Strategy, BacktestResult } from '../../types/trading';
import { useAlgoTradingStore } from '../../stores/hooks';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface ComparisonMetrics {
  strategyName: string;
  totalReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  recoveryFactor: number;
  sortinoRatio: number;
  calmarRatio: number;
}

export const StrategyComparison: React.FC = observer(() => {
  const algoTradingStore = useAlgoTradingStore();
  const [selectedResults, setSelectedResults] = useState<BacktestResult[]>([]);
  const [comparisonMetrics, setComparisonMetrics] = useState<ComparisonMetrics[]>([]);
  const [equityCurves, setEquityCurves] = useState<any[]>([]);

  useEffect(() => {
    const results = algoTradingStore.getBacktestResults();
    setSelectedResults(results);

    // Calculate comparison metrics
    const metrics = results.map(result => ({
      strategyName: result.strategyName,
      totalReturn: result.metrics.totalReturn,
      sharpeRatio: result.metrics.sharpeRatio,
      maxDrawdown: result.metrics.maxDrawdown,
      winRate: result.metrics.winRate,
      profitFactor: result.metrics.profitFactor,
      recoveryFactor: result.metrics.recoveryFactor,
      sortinoRatio: result.metrics.sortinoRatio,
      calmarRatio: result.metrics.calmarRatio,
    }));
    setComparisonMetrics(metrics);

    // Prepare equity curves data
    const curves = results.map(result => {
      return result.equityCurve.map(point => ({
        timestamp: new Date(point.timestamp).toLocaleDateString(),
        [result.strategyName]: point.value,
      }));
    });

    // Merge equity curves data
    const mergedCurves = curves.reduce((acc, curve) => {
      curve.forEach((point, i) => {
        if (!acc[i]) {
          acc[i] = { timestamp: point.timestamp };
        }
        acc[i] = { ...acc[i], ...point };
      });
      return acc;
    }, [] as any[]);

    setEquityCurves(mergedCurves);
  }, [algoTradingStore]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Strategy Comparison
      </Typography>

      <Grid container spacing={3}>
        {/* Equity Curves Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Equity Curves
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={equityCurves}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedResults.map((result, index) => (
                  <Line
                    key={result.strategyName}
                    type="monotone"
                    dataKey={result.strategyName}
                    stroke={`hsl(${(index * 360) / selectedResults.length}, 70%, 50%)`}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Performance Metrics Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Strategy</TableCell>
                    <TableCell align="right">Total Return</TableCell>
                    <TableCell align="right">Sharpe Ratio</TableCell>
                    <TableCell align="right">Max Drawdown</TableCell>
                    <TableCell align="right">Win Rate</TableCell>
                    <TableCell align="right">Profit Factor</TableCell>
                    <TableCell align="right">Recovery Factor</TableCell>
                    <TableCell align="right">Sortino Ratio</TableCell>
                    <TableCell align="right">Calmar Ratio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {comparisonMetrics.map(metrics => (
                    <TableRow key={metrics.strategyName}>
                      <TableCell>{metrics.strategyName}</TableCell>
                      <TableCell align="right">{formatPercentage(metrics.totalReturn)}</TableCell>
                      <TableCell align="right">{metrics.sharpeRatio.toFixed(2)}</TableCell>
                      <TableCell align="right">{formatPercentage(metrics.maxDrawdown)}</TableCell>
                      <TableCell align="right">{formatPercentage(metrics.winRate)}</TableCell>
                      <TableCell align="right">{metrics.profitFactor.toFixed(2)}</TableCell>
                      <TableCell align="right">{metrics.recoveryFactor.toFixed(2)}</TableCell>
                      <TableCell align="right">{metrics.sortinoRatio.toFixed(2)}</TableCell>
                      <TableCell align="right">{metrics.calmarRatio.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Metrics Comparison Charts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Risk-Adjusted Returns
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strategyName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sharpeRatio" name="Sharpe Ratio" fill="#8884d8" />
                <Bar dataKey="sortinoRatio" name="Sortino Ratio" fill="#82ca9d" />
                <Bar dataKey="calmarRatio" name="Calmar Ratio" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Risk Metrics
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="strategyName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="maxDrawdown" name="Max Drawdown" fill="#ff8042" />
                <Bar dataKey="recoveryFactor" name="Recovery Factor" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default StrategyComparison;
