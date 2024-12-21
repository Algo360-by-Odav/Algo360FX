import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
} from 'recharts';
import { Position } from '../../types/trading';
import { useStore } from '../../hooks/useStore';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface RiskAnalysisProps {
  positions: Position[];
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ positions }) => {
  const theme = useTheme();
  const { riskManagementStore } = useStore();

  // Get risk metrics
  const riskMetrics = React.useMemo(() => {
    return {
      valueAtRisk: riskManagementStore.getValueAtRisk(),
      expectedShortfall: riskManagementStore.getExpectedShortfall(),
      beta: riskManagementStore.getPortfolioBeta(),
      sharpeRatio: riskManagementStore.getSharpeRatio(),
      sortinoRatio: riskManagementStore.getSortinoRatio(),
      maxDrawdown: riskManagementStore.getMaxDrawdown(),
      correlationMatrix: riskManagementStore.getCorrelationMatrix(),
      volatility: riskManagementStore.getPortfolioVolatility(),
      stressTestResults: riskManagementStore.runStressTest(),
    };
  }, [riskManagementStore]);

  // Prepare correlation data for visualization
  const correlationData = React.useMemo(() => {
    return riskMetrics.correlationMatrix.map((row) => ({
      x: row.symbol1,
      y: row.symbol2,
      z: row.correlation * 100,
    }));
  }, [riskMetrics.correlationMatrix]);

  // Prepare stress test data for visualization
  const stressTestData = React.useMemo(() => {
    return riskMetrics.stressTestResults.scenarios.map((scenario) => ({
      name: scenario.name,
      impact: scenario.portfolioImpact * 100,
    }));
  }, [riskMetrics.stressTestResults]);

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Risk Metrics Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Risk Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography color="text.secondary" gutterBottom>
                  Value at Risk (95%)
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(riskMetrics.valueAtRisk)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography color="text.secondary" gutterBottom>
                  Expected Shortfall
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(riskMetrics.expectedShortfall)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography color="text.secondary" gutterBottom>
                  Portfolio Beta
                </Typography>
                <Typography variant="h6">
                  {riskMetrics.beta.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography color="text.secondary" gutterBottom>
                  Sharpe Ratio
                </Typography>
                <Typography variant="h6">
                  {riskMetrics.sharpeRatio.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography color="text.secondary" gutterBottom>
                  Sortino Ratio
                </Typography>
                <Typography variant="h6">
                  {riskMetrics.sortinoRatio.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography color="text.secondary" gutterBottom>
                  Portfolio Volatility
                </Typography>
                <Typography variant="h6">
                  {formatPercentage(riskMetrics.volatility)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Correlation Matrix */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Correlation Matrix
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="x"
                    type="category"
                    name="Symbol 1"
                    allowDuplicatedCategory={false}
                  />
                  <YAxis
                    dataKey="y"
                    type="category"
                    name="Symbol 2"
                    allowDuplicatedCategory={false}
                  />
                  <Tooltip
                    formatter={(value: any) =>
                      `Correlation: ${Number(value).toFixed(2)}%`
                    }
                  />
                  <Scatter
                    data={correlationData}
                    fill={theme.palette.primary.main}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Stress Test Results */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Stress Test Scenarios
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={stressTestData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) =>
                      `${value.toFixed(2)}% Impact`
                    }
                  />
                  <Bar
                    dataKey="impact"
                    fill={theme.palette.primary.main}
                    name="Portfolio Impact"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Position Risk Analysis */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Position Risk Analysis
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell align="right">Weight</TableCell>
                    <TableCell align="right">Beta</TableCell>
                    <TableCell align="right">Volatility</TableCell>
                    <TableCell align="right">VaR Contribution</TableCell>
                    <TableCell align="right">Risk Contribution</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {positions.map((position) => {
                    const metrics = riskManagementStore.getPositionRiskMetrics(
                      position.symbol
                    );
                    return (
                      <TableRow key={position.symbol}>
                        <TableCell>{position.symbol}</TableCell>
                        <TableCell align="right">
                          {formatPercentage(position.weight)}
                        </TableCell>
                        <TableCell align="right">
                          {metrics.beta.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {formatPercentage(metrics.volatility)}
                        </TableCell>
                        <TableCell align="right">
                          {formatPercentage(metrics.varContribution)}
                        </TableCell>
                        <TableCell align="right">
                          {formatPercentage(metrics.riskContribution)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RiskAnalysis;
