import React, { useState } from 'react';
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
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Info,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import { OptimizationResultNew } from '../../../types/optimization';
import { formatCurrency, formatNumber, formatPercentage } from '../../../utils/formatters';

interface OptimizationResultsProps {
  results: OptimizationResultNew;
}

const OptimizationResults: React.FC<OptimizationResultsProps> = ({ results }) => {
  const [selectedGeneration, setSelectedGeneration] = useState(0);

  const renderFitnessChart = () => (
    <Box sx={{ height: 400, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Fitness Evolution
      </Typography>
      <ResponsiveContainer>
        <LineChart data={results.generations}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="number" label={{ value: 'Generation', position: 'bottom' }} />
          <YAxis label={{ value: 'Fitness', angle: -90, position: 'insideLeft' }} />
          <RechartsTooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="bestFitness"
            name="Best Fitness"
            stroke="#4caf50"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="averageFitness"
            name="Average Fitness"
            stroke="#2196f3"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderParameterDistribution = () => (
    <Box sx={{ height: 400, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Parameter Distribution
      </Typography>
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="value" name="Parameter Value" />
          <YAxis type="number" dataKey="frequency" name="Frequency" />
          <RechartsTooltip />
          <Legend />
          {results.parameterDistribution.map((param) => (
            <Scatter
              key={param.parameter}
              name={param.parameter}
              data={param.values.map((value, index) => ({
                value,
                frequency: param.frequencies[index],
              }))}
              fill={`#${Math.floor(Math.random()*16777215).toString(16)}`}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderPerformanceMetrics = () => (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Sharpe Ratio
          </Typography>
          <Typography variant="h6" color="success.main">
            {formatNumber(results.finalPerformance.sharpeRatio, 2)}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Returns
          </Typography>
          <Typography variant="h6" color="success.main">
            {formatPercentage(results.finalPerformance.returns)}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Max Drawdown
          </Typography>
          <Typography variant="h6" color="error.main">
            {formatPercentage(results.finalPerformance.maxDrawdown)}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Win Rate
          </Typography>
          <Typography variant="h6" color="success.main">
            {formatPercentage(results.finalPerformance.winRate)}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderOptimizedParameters = () => (
    <TableContainer component={Paper} sx={{ mb: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Parameter</TableCell>
            <TableCell align="right">Original Value</TableCell>
            <TableCell align="right">Optimized Value</TableCell>
            <TableCell align="right">Change</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(results.bestParameters).map(([param, value]) => (
            <TableRow key={param}>
              <TableCell>{param}</TableCell>
              <TableCell align="right">
                {formatNumber(results.parameters[param] || 0, 4)}
              </TableCell>
              <TableCell align="right">{formatNumber(value, 4)}</TableCell>
              <TableCell align="right">
                <Chip
                  size="small"
                  icon={value > (results.parameters[param] || 0) ? <TrendingUp /> : <TrendingDown />}
                  label={`${formatPercentage((value - (results.parameters[param] || 0)) / (results.parameters[param] || 1))}`}
                  color={value > (results.parameters[param] || 0) ? 'success' : 'error'}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Optimization Results
      </Typography>

      {renderPerformanceMetrics()}
      {renderFitnessChart()}
      {renderParameterDistribution()}
      
      <Typography variant="h6" gutterBottom>
        Optimized Parameters
      </Typography>
      {renderOptimizedParameters()}
    </Paper>
  );
};

export default OptimizationResults;
