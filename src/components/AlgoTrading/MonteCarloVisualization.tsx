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
  BarChart,
  Bar,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import { MonteCarloResult } from '../../services/MonteCarloSimulator';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface MonteCarloVisualizationProps {
  result: MonteCarloResult;
  initialEquity: number;
}

export const MonteCarloVisualization: React.FC<MonteCarloVisualizationProps> = observer(
  ({ result, initialEquity }) => {
    // Prepare data for equity curve chart
    const equityCurveData = result.expectedEquityCurve.map((value, index) => ({
      index,
      expected: value,
      worst: result.worstCase[index],
      best: result.bestCase[index],
      ci95Lower: result.confidenceIntervals[0].lower[index],
      ci95Upper: result.confidenceIntervals[0].upper[index],
      ci90Lower: result.confidenceIntervals[1].lower[index],
      ci90Upper: result.confidenceIntervals[1].upper[index],
      ci80Lower: result.confidenceIntervals[2].lower[index],
      ci80Upper: result.confidenceIntervals[2].upper[index],
    }));

    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Monte Carlo Analysis
        </Typography>

        <Grid container spacing={3}>
          {/* Equity Curve with Confidence Intervals */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Equity Curve Projections
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={equityCurveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="index" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label: number) => `Period ${label}`}
                  />
                  <Legend />

                  {/* 80% Confidence Interval */}
                  <Area
                    type="monotone"
                    dataKey="ci80Upper"
                    stackId="1"
                    stroke="none"
                    fill="#82ca9d"
                    fillOpacity={0.1}
                  />
                  <Area
                    type="monotone"
                    dataKey="ci80Lower"
                    stackId="1"
                    stroke="none"
                    fill="#82ca9d"
                    fillOpacity={0.1}
                  />

                  {/* 90% Confidence Interval */}
                  <Area
                    type="monotone"
                    dataKey="ci90Upper"
                    stackId="2"
                    stroke="none"
                    fill="#8884d8"
                    fillOpacity={0.1}
                  />
                  <Area
                    type="monotone"
                    dataKey="ci90Lower"
                    stackId="2"
                    stroke="none"
                    fill="#8884d8"
                    fillOpacity={0.1}
                  />

                  {/* 95% Confidence Interval */}
                  <Area
                    type="monotone"
                    dataKey="ci95Upper"
                    stackId="3"
                    stroke="none"
                    fill="#ffc658"
                    fillOpacity={0.1}
                  />
                  <Area
                    type="monotone"
                    dataKey="ci95Lower"
                    stackId="3"
                    stroke="none"
                    fill="#ffc658"
                    fillOpacity={0.1}
                  />

                  {/* Expected, Best, and Worst Cases */}
                  <Line
                    type="monotone"
                    dataKey="expected"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                    name="Expected"
                  />
                  <Line
                    type="monotone"
                    dataKey="best"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                    name="Best Case"
                  />
                  <Line
                    type="monotone"
                    dataKey="worst"
                    stroke="#ff8042"
                    strokeWidth={2}
                    dot={false}
                    name="Worst Case"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Drawdown Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Drawdown Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={result.drawdownDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="maxDrawdown"
                    tickFormatter={(value: number) => formatPercentage(value)}
                  />
                  <YAxis
                    tickFormatter={(value: number) => formatPercentage(value)}
                  />
                  <Tooltip
                    formatter={(value: number) => formatPercentage(value)}
                    labelFormatter={(label: number) => `Drawdown: ${formatPercentage(label)}`}
                  />
                  <Bar
                    dataKey="frequency"
                    fill="#8884d8"
                    name="Probability"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Final Equity Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Final Equity Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={result.finalEquityDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="value"
                    tickFormatter={(value: number) => formatCurrency(value)}
                  />
                  <YAxis
                    tickFormatter={(value: number) => formatPercentage(value)}
                  />
                  <Tooltip
                    formatter={(value: number) => formatPercentage(value)}
                    labelFormatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar
                    dataKey="frequency"
                    fill="#82ca9d"
                    name="Probability"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Summary Statistics */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Simulation Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Initial Equity
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(initialEquity)}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Expected Final Equity
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(result.expectedEquityCurve[result.expectedEquityCurve.length - 1])}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">
                    95% CI Range
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(result.confidenceIntervals[0].lower[result.confidenceIntervals[0].lower.length - 1])} -{' '}
                    {formatCurrency(result.confidenceIntervals[0].upper[result.confidenceIntervals[0].upper.length - 1])}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={3}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Max Drawdown (95th percentile)
                  </Typography>
                  <Typography variant="body1">
                    {formatPercentage(
                      result.drawdownDistribution[Math.floor(result.drawdownDistribution.length * 0.95)].maxDrawdown
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  }
);

export default MonteCarloVisualization;
