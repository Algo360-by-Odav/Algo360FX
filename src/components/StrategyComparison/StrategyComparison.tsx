import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import InfoIcon from '@mui/icons-material/Info';
import CompareIcon from '@mui/icons-material/Compare';
import { Strategy, BacktestResult } from '../../types/trading';
import { backtestingService } from '../../services/backtesting/BacktestingService';
import { walkForwardAnalysisService, WalkForwardResult } from '../../services/strategy/WalkForwardAnalysisService';
import { monteCarloSimulationService, MonteCarloResult } from '../../services/strategy/MonteCarloSimulationService';
import './StrategyComparison.css';

interface StrategyComparisonProps {
  availableStrategies: Strategy[];
}

interface ComparisonResult {
  strategy: Strategy;
  backtest: BacktestResult;
  walkForward: WalkForwardResult;
  monteCarlo: MonteCarloResult;
}

const StrategyComparison: React.FC<StrategyComparisonProps> = observer(({
  availableStrategies,
}) => {
  const [selectedStrategies, setSelectedStrategies] = useState<Strategy[]>([]);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('1M');
  const [compareMode, setCompareMode] = useState<'performance' | 'risk' | 'robustness'>('performance');

  const runComparison = async () => {
    setIsLoading(true);
    try {
      const results: ComparisonResult[] = [];

      for (const strategy of selectedStrategies) {
        // Run backtest
        const backtestResult = await backtestingService.runBacktest({
          strategy,
          startDate: getStartDate(),
          endDate: new Date(),
          initialBalance: 10000,
        });

        // Run walk-forward analysis
        const walkForwardResult = await walkForwardAnalysisService.runAnalysis({
          strategy,
          startDate: getStartDate(),
          endDate: new Date(),
          inSampleSize: 60,
          outSampleSize: 30,
          overlap: 50,
          initialBalance: 10000,
          optimizationTarget: 'SHARPE_RATIO',
        });

        // Run Monte Carlo simulation
        const monteCarloResult = await monteCarloSimulationService.runSimulation({
          strategy,
          initialCapital: 10000,
          numSimulations: 1000,
          timeHorizon: getDaysForTimeframe(),
          confidenceInterval: 0.95,
          riskFreeRate: 0.02,
          tradingDaysPerYear: 252,
        });

        results.push({
          strategy,
          backtest: backtestResult,
          walkForward: walkForwardResult,
          monteCarlo: monteCarloResult,
        });
      }

      setComparisonResults(results);
    } finally {
      setIsLoading(false);
    }
  };

  const getStartDate = () => {
    const now = new Date();
    switch (timeframe) {
      case '1M':
        return new Date(now.setMonth(now.getMonth() - 1));
      case '3M':
        return new Date(now.setMonth(now.getMonth() - 3));
      case '6M':
        return new Date(now.setMonth(now.getMonth() - 6));
      case '1Y':
        return new Date(now.setFullYear(now.getFullYear() - 1));
      default:
        return new Date(now.setMonth(now.getMonth() - 1));
    }
  };

  const getDaysForTimeframe = () => {
    switch (timeframe) {
      case '1M': return 30;
      case '3M': return 90;
      case '6M': return 180;
      case '1Y': return 365;
      default: return 30;
    }
  };

  const getPerformanceMetrics = (result: ComparisonResult) => ({
    'Total Return': result.backtest.metrics.totalPnL.toFixed(2) + '%',
    'Sharpe Ratio': result.backtest.metrics.sharpeRatio.toFixed(2),
    'Max Drawdown': result.backtest.metrics.maxDrawdown.toFixed(2) + '%',
    'Win Rate': (result.backtest.metrics.winRate * 100).toFixed(2) + '%',
    'Profit Factor': result.backtest.metrics.profitFactor.toFixed(2),
  });

  const getRiskMetrics = (result: ComparisonResult) => ({
    'VaR (95%)': result.monteCarlo.riskMetrics.var95.toFixed(2) + '%',
    'CVaR (95%)': result.monteCarlo.riskMetrics.cvar95.toFixed(2) + '%',
    'Volatility': result.monteCarlo.riskMetrics.standardDeviation.toFixed(2) + '%',
    'Skewness': result.monteCarlo.riskMetrics.skewness.toFixed(2),
    'Kurtosis': result.monteCarlo.riskMetrics.kurtosis.toFixed(2),
  });

  const getRobustnessMetrics = (result: ComparisonResult) => ({
    'Robustness Factor': result.walkForward.summary.robustnessFactor.toFixed(2),
    'Optimization Efficiency': (result.walkForward.summary.optimizationEfficiency * 100).toFixed(2) + '%',
    'Predictive Power': result.walkForward.predictivePower.toFixed(2),
    'Parameter Stability': Object.values(result.walkForward.parameterStability)
      .reduce((acc, param) => acc + param.stabilityScore, 0).toFixed(2),
  });

  const getRadarData = () => {
    const metrics = comparisonResults.map(result => {
      const base = {
        name: result.strategy.name,
        'Return': result.backtest.metrics.totalPnL,
        'Sharpe': result.backtest.metrics.sharpeRatio * 10,
        'Stability': result.walkForward.summary.robustnessFactor * 100,
        'Efficiency': result.walkForward.summary.optimizationEfficiency * 100,
        'Risk-Adjusted': (result.backtest.metrics.totalPnL / result.monteCarlo.riskMetrics.standardDeviation) * 10,
      };
      return Object.entries(base).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: Number.isFinite(value) ? value : 0,
      }), {});
    });
    return metrics;
  };

  return (
    <Box className="strategy-comparison">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Strategy Comparison</Typography>
                <Box display="flex" gap={2}>
                  <FormControl size="small" style={{ minWidth: 200 }}>
                    <InputLabel>Select Strategies</InputLabel>
                    <Select
                      multiple
                      value={selectedStrategies.map(s => s.name)}
                      onChange={(e) => {
                        const selected = (Array.isArray(e.target.value) ? e.target.value : [e.target.value])
                          .map(name => availableStrategies.find(s => s.name === name)!)
                          .filter(Boolean);
                        setSelectedStrategies(selected);
                      }}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(Array.isArray(selected) ? selected : []).map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {availableStrategies.map(strategy => (
                        <MenuItem key={strategy.name} value={strategy.name}>
                          {strategy.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl size="small">
                    <InputLabel>Timeframe</InputLabel>
                    <Select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                    >
                      <MenuItem value="1M">1 Month</MenuItem>
                      <MenuItem value="3M">3 Months</MenuItem>
                      <MenuItem value="6M">6 Months</MenuItem>
                      <MenuItem value="1Y">1 Year</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    onClick={runComparison}
                    disabled={isLoading || selectedStrategies.length === 0}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <CompareIcon />}
                  >
                    Compare
                  </Button>
                </Box>
              </Box>

              {comparisonResults.length > 0 && (
                <>
                  <Box display="flex" justifyContent="center" mb={2}>
                    <Button
                      variant={compareMode === 'performance' ? 'contained' : 'outlined'}
                      onClick={() => setCompareMode('performance')}
                      sx={{ mr: 1 }}
                    >
                      Performance
                    </Button>
                    <Button
                      variant={compareMode === 'risk' ? 'contained' : 'outlined'}
                      onClick={() => setCompareMode('risk')}
                      sx={{ mr: 1 }}
                    >
                      Risk
                    </Button>
                    <Button
                      variant={compareMode === 'robustness' ? 'contained' : 'outlined'}
                      onClick={() => setCompareMode('robustness')}
                    >
                      Robustness
                    </Button>
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>Strategy Comparison Radar</Typography>
                          <ResponsiveContainer width="100%" height={400}>
                            <RadarChart data={getRadarData()}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="name" />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} />
                              {comparisonResults.map((result, index) => (
                                <Radar
                                  key={result.strategy.name}
                                  name={result.strategy.name}
                                  dataKey="value"
                                  stroke={`hsl(${index * 360 / comparisonResults.length}, 70%, 50%)`}
                                  fill={`hsl(${index * 360 / comparisonResults.length}, 70%, 50%)`}
                                  fillOpacity={0.3}
                                />
                              ))}
                              <Legend />
                            </RadarChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {compareMode === 'performance' ? 'Performance Metrics' :
                             compareMode === 'risk' ? 'Risk Metrics' : 'Robustness Metrics'}
                          </Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Metric</TableCell>
                                  {comparisonResults.map(result => (
                                    <TableCell key={result.strategy.name} align="right">
                                      {result.strategy.name}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {Object.entries(
                                  compareMode === 'performance' ? getPerformanceMetrics(comparisonResults[0]) :
                                  compareMode === 'risk' ? getRiskMetrics(comparisonResults[0]) :
                                  getRobustnessMetrics(comparisonResults[0])
                                ).map(([metric, _]) => (
                                  <TableRow key={metric}>
                                    <TableCell component="th" scope="row">
                                      {metric}
                                      <Tooltip title={getMetricDescription(metric)}>
                                        <IconButton size="small">
                                          <InfoIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </TableCell>
                                    {comparisonResults.map(result => (
                                      <TableCell key={result.strategy.name} align="right">
                                        {compareMode === 'performance' ? getPerformanceMetrics(result)[metric] :
                                         compareMode === 'risk' ? getRiskMetrics(result)[metric] :
                                         getRobustnessMetrics(result)[metric]}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>Equity Curves</Typography>
                          <ResponsiveContainer width="100%" height={400}>
                            <LineChart>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <RechartsTooltip />
                              <Legend />
                              {comparisonResults.map((result, index) => (
                                <Line
                                  key={result.strategy.name}
                                  data={result.backtest.equityCurve}
                                  dataKey="equity"
                                  name={result.strategy.name}
                                  stroke={`hsl(${index * 360 / comparisonResults.length}, 70%, 50%)`}
                                  dot={false}
                                />
                              ))}
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

const getMetricDescription = (metric: string): string => {
  const descriptions: { [key: string]: string } = {
    'Total Return': 'The overall percentage return of the strategy',
    'Sharpe Ratio': 'Risk-adjusted return relative to the risk-free rate',
    'Max Drawdown': 'Largest peak-to-trough decline',
    'Win Rate': 'Percentage of profitable trades',
    'Profit Factor': 'Ratio of gross profits to gross losses',
    'VaR (95%)': 'Maximum loss with 95% confidence',
    'CVaR (95%)': 'Expected loss beyond VaR',
    'Volatility': 'Standard deviation of returns',
    'Skewness': 'Asymmetry of returns distribution',
    'Kurtosis': 'Tail heaviness of returns distribution',
    'Robustness Factor': 'Ratio of out-of-sample to in-sample performance',
    'Optimization Efficiency': 'Percentage of successful out-of-sample periods',
    'Predictive Power': 'Correlation between in-sample and out-of-sample results',
    'Parameter Stability': 'Consistency of optimal parameters across periods',
  };
  return descriptions[metric] || 'No description available';
};

export default StrategyComparison;
