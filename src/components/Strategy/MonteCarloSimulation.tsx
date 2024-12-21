import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
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
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { Strategy, MonteCarloResult } from '../../types/trading';
import { useStore } from '../../hooks/useStore';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface MonteCarloSimulationProps {
  strategy: Strategy;
  onClose: () => void;
}

const MonteCarloSimulation: React.FC<MonteCarloSimulationProps> = ({
  strategy,
  onClose,
}) => {
  const theme = useTheme();
  const { backtestingStore } = useStore();
  const [simulationConfig, setSimulationConfig] = React.useState({
    numSimulations: 1000,
    timeHorizon: 12,
    confidenceLevel: 95,
    initialCapital: 100000,
  });
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [results, setResults] = React.useState<MonteCarloResult | null>(null);

  const handleConfigChange = (field: keyof typeof simulationConfig, value: any) => {
    setSimulationConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const results = await backtestingStore.runMonteCarloSimulation(
        strategy,
        simulationConfig
      );
      setResults(results);
    } catch (error) {
      console.error('Monte Carlo simulation failed:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Dialog open maxWidth="lg" fullWidth onClose={onClose}>
      <DialogTitle>Monte Carlo Simulation</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Configuration */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Simulation Configuration
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of Simulations"
                    value={simulationConfig.numSimulations}
                    onChange={(e) =>
                      handleConfigChange('numSimulations', Number(e.target.value))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Time Horizon (months)"
                    value={simulationConfig.timeHorizon}
                    onChange={(e) =>
                      handleConfigChange('timeHorizon', Number(e.target.value))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Confidence Level (%)"
                    value={simulationConfig.confidenceLevel}
                    onChange={(e) =>
                      handleConfigChange('confidenceLevel', Number(e.target.value))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Initial Capital"
                    value={simulationConfig.initialCapital}
                    onChange={(e) =>
                      handleConfigChange('initialCapital', Number(e.target.value))
                    }
                  />
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                onClick={handleSimulate}
                disabled={isSimulating}
                sx={{ mt: 2 }}
              >
                {isSimulating ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Run Simulation'
                )}
              </Button>
            </Paper>
          </Grid>

          {/* Results */}
          {results && (
            <Grid item xs={12} md={8}>
              {/* Equity Curves */}
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Simulated Equity Curves
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={results.equityCurves}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="median"
                        name="Median"
                        stroke={theme.palette.primary.main}
                        fill={theme.palette.primary.main}
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="upper95"
                        name="95th Percentile"
                        stroke={theme.palette.success.main}
                        fill={theme.palette.success.main}
                        fillOpacity={0.1}
                      />
                      <Area
                        type="monotone"
                        dataKey="lower95"
                        name="5th Percentile"
                        stroke={theme.palette.error.main}
                        fill={theme.palette.error.main}
                        fillOpacity={0.1}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>

              {/* Statistics */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Simulation Statistics
                </Typography>

                <Grid container spacing={2}>
                  {/* Terminal Value Statistics */}
                  <Grid item xs={12} sm={6}>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Terminal Value</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Return</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Median</TableCell>
                            <TableCell align="right">
                              {formatCurrency(results.statistics.medianValue)}
                            </TableCell>
                            <TableCell align="right">
                              {formatPercentage(results.statistics.medianReturn)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>95th Percentile</TableCell>
                            <TableCell align="right">
                              {formatCurrency(results.statistics.upper95Value)}
                            </TableCell>
                            <TableCell align="right">
                              {formatPercentage(results.statistics.upper95Return)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>5th Percentile</TableCell>
                            <TableCell align="right">
                              {formatCurrency(results.statistics.lower95Value)}
                            </TableCell>
                            <TableCell align="right">
                              {formatPercentage(results.statistics.lower95Return)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  {/* Risk Metrics */}
                  <Grid item xs={12} sm={6}>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Risk Metric</TableCell>
                            <TableCell align="right">Value</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Probability of Profit</TableCell>
                            <TableCell align="right">
                              {formatPercentage(results.statistics.profitProbability)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Maximum Drawdown (95%)</TableCell>
                            <TableCell align="right">
                              {formatPercentage(results.statistics.maxDrawdown95)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Value at Risk (95%)</TableCell>
                            <TableCell align="right">
                              {formatCurrency(results.statistics.valueAtRisk95)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>

                {/* Summary */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Key Findings
                  </Typography>
                  <Typography variant="body2">
                    • {results.statistics.profitProbability * 100}% chance of
                    profitable outcome after {simulationConfig.timeHorizon} months
                  </Typography>
                  <Typography variant="body2">
                    • Expected median return of{' '}
                    {formatPercentage(results.statistics.medianReturn)} with{' '}
                    {formatPercentage(results.statistics.upper95Return)} upside
                    potential
                  </Typography>
                  <Typography variant="body2">
                    • Maximum drawdown not expected to exceed{' '}
                    {formatPercentage(results.statistics.maxDrawdown95)} with 95%
                    confidence
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MonteCarloSimulation;
