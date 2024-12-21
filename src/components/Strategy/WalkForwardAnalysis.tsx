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
  Legend,
} from 'recharts';
import { Strategy, Parameter, WalkForwardResult } from '../../types/trading';
import { useStore } from '../../hooks/useStore';
import { formatPercentage, formatCurrency } from '../../utils/formatters';

interface WalkForwardAnalysisProps {
  strategy: Strategy;
  optimizationParams: Parameter[];
  onClose: () => void;
}

const WalkForwardAnalysis: React.FC<WalkForwardAnalysisProps> = ({
  strategy,
  optimizationParams,
  onClose,
}) => {
  const theme = useTheme();
  const { backtestingStore } = useStore();
  const [analysisConfig, setAnalysisConfig] = React.useState({
    inSampleSize: 6,
    outSampleSize: 3,
    totalPeriods: 4,
    optimizationMetric: 'sharpeRatio',
  });
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [results, setResults] = React.useState<WalkForwardResult | null>(null);

  const handleConfigChange = (field: keyof typeof analysisConfig, value: any) => {
    setAnalysisConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const results = await backtestingStore.runWalkForwardAnalysis(
        strategy,
        optimizationParams,
        analysisConfig
      );
      setResults(results);
    } catch (error) {
      console.error('Walk-forward analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Dialog open maxWidth="lg" fullWidth onClose={onClose}>
      <DialogTitle>Walk Forward Analysis</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {/* Configuration */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Analysis Configuration
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Optimization Metric</InputLabel>
                    <Select
                      value={analysisConfig.optimizationMetric}
                      label="Optimization Metric"
                      onChange={(e) =>
                        handleConfigChange('optimizationMetric', e.target.value)
                      }
                    >
                      <MenuItem value="sharpeRatio">Sharpe Ratio</MenuItem>
                      <MenuItem value="sortinoRatio">Sortino Ratio</MenuItem>
                      <MenuItem value="calmarRatio">Calmar Ratio</MenuItem>
                      <MenuItem value="profitFactor">Profit Factor</MenuItem>
                      <MenuItem value="netProfit">Net Profit</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="In-Sample Size (months)"
                    value={analysisConfig.inSampleSize}
                    onChange={(e) =>
                      handleConfigChange('inSampleSize', Number(e.target.value))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Out-Sample Size (months)"
                    value={analysisConfig.outSampleSize}
                    onChange={(e) =>
                      handleConfigChange('outSampleSize', Number(e.target.value))
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Number of Periods"
                    value={analysisConfig.totalPeriods}
                    onChange={(e) =>
                      handleConfigChange('totalPeriods', Number(e.target.value))
                    }
                  />
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                sx={{ mt: 2 }}
              >
                {isAnalyzing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Run Analysis'
                )}
              </Button>
            </Paper>
          </Grid>

          {/* Results */}
          {results && (
            <Grid item xs={12} md={8}>
              {/* Performance Comparison */}
              <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  In-Sample vs Out-Sample Performance
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={results.performanceComparison}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="inSample"
                        name="In-Sample"
                        stroke={theme.palette.primary.main}
                      />
                      <Line
                        type="monotone"
                        dataKey="outSample"
                        name="Out-Sample"
                        stroke={theme.palette.secondary.main}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>

              {/* Period Details */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Period Analysis
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Period</TableCell>
                        <TableCell align="right">In-Sample Return</TableCell>
                        <TableCell align="right">Out-Sample Return</TableCell>
                        <TableCell align="right">Robustness Ratio</TableCell>
                        <TableCell align="right">Optimization Efficiency</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {results.periods.map((period) => (
                        <TableRow key={period.id}>
                          <TableCell>{period.id}</TableCell>
                          <TableCell align="right">
                            {formatPercentage(period.inSampleReturn)}
                          </TableCell>
                          <TableCell align="right">
                            {formatPercentage(period.outSampleReturn)}
                          </TableCell>
                          <TableCell align="right">
                            {period.robustnessRatio.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            {formatPercentage(period.optimizationEfficiency)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Summary Statistics */}
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                      <Typography color="text.secondary" gutterBottom>
                        Average Robustness Ratio
                      </Typography>
                      <Typography variant="h6">
                        {results.summary.averageRobustnessRatio.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography color="text.secondary" gutterBottom>
                        Optimization Efficiency
                      </Typography>
                      <Typography variant="h6">
                        {formatPercentage(results.summary.optimizationEfficiency)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography color="text.secondary" gutterBottom>
                        Parameter Stability
                      </Typography>
                      <Typography variant="h6">
                        {formatPercentage(results.summary.parameterStability)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography color="text.secondary" gutterBottom>
                        Overall Score
                      </Typography>
                      <Typography variant="h6">
                        {results.summary.overallScore.toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
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

export default WalkForwardAnalysis;
