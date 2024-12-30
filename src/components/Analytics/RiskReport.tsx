import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  HeatMap,
} from 'recharts';
import { useStore } from '../../hooks/useStore';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Strategy } from '../../types/trading';

interface RiskReportProps {
  strategy: Strategy;
}

const RiskReport: React.FC<RiskReportProps> = ({ strategy }) => {
  const theme = useTheme();
  const { riskStore } = useStore();
  const [timeframe, setTimeframe] = React.useState('1M');

  // Get risk metrics
  const {
    riskMetrics,
    stressTests,
    correlationMatrix,
    exposures,
    riskDecomposition,
    scenarioAnalysis,
  } = React.useMemo(() => riskStore.getRiskAnalysis(strategy.id, timeframe), [
    strategy.id,
    timeframe,
    riskStore,
  ]);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Report Header */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Risk Analysis Report</Typography>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Time Period</InputLabel>
              <Select
                value={timeframe}
                label="Time Period"
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <MenuItem value="1M">1 Month</MenuItem>
                <MenuItem value="3M">3 Months</MenuItem>
                <MenuItem value="6M">6 Months</MenuItem>
                <MenuItem value="1Y">1 Year</MenuItem>
                <MenuItem value="YTD">Year to Date</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        {/* Risk Metrics Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Risk Metrics Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Typography color="text.secondary" gutterBottom>
                  Value at Risk (95%)
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(riskMetrics.valueAtRisk)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography color="text.secondary" gutterBottom>
                  Expected Shortfall
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(riskMetrics.expectedShortfall)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography color="text.secondary" gutterBottom>
                  Beta
                </Typography>
                <Typography variant="h6">
                  {riskMetrics.beta.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography color="text.secondary" gutterBottom>
                  Volatility
                </Typography>
                <Typography variant="h6">
                  {formatPercentage(riskMetrics.volatility)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Risk Decomposition */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Risk Decomposition
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={riskDecomposition}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="factor" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPercentage(value)} />
                  <Bar
                    dataKey="contribution"
                    fill={theme.palette.primary.main}
                    name="Risk Contribution"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Factor Exposures */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Factor Exposures
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="exposure" name="Exposure" />
                  <YAxis dataKey="risk" name="Risk" />
                  <Tooltip formatter={(value) => value.toFixed(2)} />
                  <Scatter
                    data={exposures}
                    fill={theme.palette.primary.main}
                    name="Factors"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Correlation Matrix */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Correlation Matrix
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    {correlationMatrix.assets.map((asset) => (
                      <TableCell key={asset} align="right">
                        {asset}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {correlationMatrix.data.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{correlationMatrix.assets[i]}</TableCell>
                      {row.map((value, j) => (
                        <TableCell
                          key={j}
                          align="right"
                          sx={{
                            backgroundColor: `rgba(${
                              value >= 0 ? '0, 255, 0' : '255, 0, 0'
                            }, ${Math.abs(value) * 0.2})`,
                          }}
                        >
                          {value.toFixed(2)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Stress Tests */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Stress Test Results
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Scenario</TableCell>
                    <TableCell align="right">Impact</TableCell>
                    <TableCell align="right">VaR Change</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stressTests.map((test) => (
                    <TableRow key={test.scenario}>
                      <TableCell>{test.scenario}</TableCell>
                      <TableCell align="right">
                        {formatPercentage(test.impact)}
                      </TableCell>
                      <TableCell align="right">
                        {formatPercentage(test.varChange)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Scenario Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Scenario Analysis
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={scenarioAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="change" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPercentage(value)} />
                  <Line
                    type="monotone"
                    dataKey="impact"
                    stroke={theme.palette.primary.main}
                    name="Portfolio Impact"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Risk Limits and Breaches */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Risk Limits and Breaches
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell align="right">Current</TableCell>
                    <TableCell align="right">Limit</TableCell>
                    <TableCell align="right">Usage (%)</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {riskMetrics.limits.map((limit) => (
                    <TableRow key={limit.metric}>
                      <TableCell>{limit.metric}</TableCell>
                      <TableCell align="right">
                        {formatPercentage(limit.current)}
                      </TableCell>
                      <TableCell align="right">
                        {formatPercentage(limit.limit)}
                      </TableCell>
                      <TableCell align="right">
                        {formatPercentage(limit.usage)}
                      </TableCell>
                      <TableCell>
                        <Typography
                          color={
                            limit.usage > 1
                              ? 'error'
                              : limit.usage > 0.8
                              ? 'warning'
                              : 'success'
                          }
                        >
                          {limit.usage > 1
                            ? 'Breach'
                            : limit.usage > 0.8
                            ? 'Warning'
                            : 'Normal'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RiskReport;
