import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
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
  AreaChart,
  Area,
} from 'recharts';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import { Strategy, BacktestResult } from '../../types/trading';
import { backtestingService } from '../../services/backtesting/BacktestingService';
import { monteCarloSimulationService, MonteCarloResult } from '../../services/strategy/MonteCarloSimulationService';
import StrategyVisualization from '../StrategyVisualization/StrategyVisualization';
import './BacktestingDashboard.css';

interface BacktestingDashboardProps {
  strategy: Strategy;
  availableStrategies: Strategy[];
}

const BacktestingDashboard: React.FC<BacktestingDashboardProps> = observer(({
  strategy: initialStrategy,
  availableStrategies,
}) => {
  const [strategy, setStrategy] = useState(initialStrategy);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [monteCarloResult, setMonteCarloResult] = useState<MonteCarloResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [backtestConfig, setBacktestConfig] = useState({
    initialBalance: 10000,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    symbol: 'EURUSD',
    timeframe: '1h',
  });
  const [monteCarloConfig, setMonteCarloConfig] = useState({
    numSimulations: 1000,
    confidenceInterval: 0.95,
    riskFreeRate: 0.02,
    tradingDaysPerYear: 252,
  });

  const handleRunBacktest = async () => {
    setIsLoading(true);
    try {
      const result = await backtestingService.runBacktest({
        strategy,
        ...backtestConfig,
      });
      setBacktestResult(result);

      // Run Monte Carlo simulation
      const monteCarloResult = await monteCarloSimulationService.runSimulation({
        strategy,
        initialCapital: backtestConfig.initialBalance,
        numSimulations: monteCarloConfig.numSimulations,
        timeHorizon: Math.ceil((new Date(backtestConfig.endDate).getTime() - new Date(backtestConfig.startDate).getTime()) / (1000 * 60 * 60 * 24)),
        confidenceInterval: monteCarloConfig.confidenceInterval,
        riskFreeRate: monteCarloConfig.riskFreeRate,
        tradingDaysPerYear: monteCarloConfig.tradingDaysPerYear,
      });
      setMonteCarloResult(monteCarloResult);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportResults = () => {
    if (!backtestResult || !monteCarloResult) return;

    const results = {
      strategy: strategy.name,
      backtest: backtestResult,
      monteCarlo: monteCarloResult,
      config: {
        backtest: backtestConfig,
        monteCarlo: monteCarloConfig,
      },
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backtest-results-${strategy.name}-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box className="backtesting-dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Strategy Backtesting Dashboard</Typography>
                {(backtestResult || monteCarloResult) && (
                  <IconButton onClick={handleExportResults} title="Export Results">
                    <DownloadIcon />
                  </IconButton>
                )}
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Strategy</InputLabel>
                    <Select
                      value={strategy.name}
                      onChange={(e) => setStrategy(availableStrategies.find(s => s.name === e.target.value)!)}
                    >
                      {availableStrategies.map(s => (
                        <MenuItem key={s.name} value={s.name}>{s.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Initial Balance"
                    value={backtestConfig.initialBalance}
                    onChange={(e) => setBacktestConfig({
                      ...backtestConfig,
                      initialBalance: Number(e.target.value),
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Start Date"
                    value={backtestConfig.startDate}
                    onChange={(e) => setBacktestConfig({
                      ...backtestConfig,
                      startDate: e.target.value,
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label="End Date"
                    value={backtestConfig.endDate}
                    onChange={(e) => setBacktestConfig({
                      ...backtestConfig,
                      endDate: e.target.value,
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleRunBacktest}
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} /> : 'Run Backtest'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {(backtestResult || monteCarloResult) && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  centered
                >
                  <Tab label="Performance Metrics" />
                  <Tab label="Trade Analysis" />
                  <Tab label="Monte Carlo Simulation" />
                  <Tab label="Risk Analysis" />
                </Tabs>

                {activeTab === 0 && backtestResult && (
                  <Box mt={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">Total Return</Typography>
                            <Typography variant="h6" color={backtestResult.metrics.totalPnL >= 0 ? 'success.main' : 'error.main'}>
                              {backtestResult.metrics.totalPnL.toFixed(2)}%
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">Sharpe Ratio</Typography>
                            <Typography variant="h6">{backtestResult.metrics.sharpeRatio.toFixed(2)}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">Max Drawdown</Typography>
                            <Typography variant="h6" color="error.main">
                              {backtestResult.metrics.maxDrawdown.toFixed(2)}%
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">Win Rate</Typography>
                            <Typography variant="h6">
                              {(backtestResult.metrics.winRate * 100).toFixed(2)}%
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12}>
                        <ResponsiveContainer width="100%" height={400}>
                          <AreaChart data={backtestResult.equityCurve}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <RechartsTooltip />
                            <Area
                              type="monotone"
                              dataKey="equity"
                              stroke="#8884d8"
                              fill="#8884d8"
                              fillOpacity={0.3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {activeTab === 1 && backtestResult && (
                  <Box mt={3}>
                    <StrategyVisualization
                      strategy={strategy}
                      historicalData={backtestResult.historicalData}
                      trades={backtestResult.trades}
                      indicators={backtestResult.indicators}
                      patterns={[]}
                    />
                  </Box>
                )}

                {activeTab === 2 && monteCarloResult && (
                  <Box mt={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                              Expected Return
                              <Tooltip title="Average return across all simulations">
                                <InfoIcon fontSize="small" sx={{ ml: 1 }} />
                              </Tooltip>
                            </Typography>
                            <Typography variant="h6" color={monteCarloResult.expectedReturn >= 0 ? 'success.main' : 'error.main'}>
                              {monteCarloResult.expectedReturn.toFixed(2)}%
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                              Probability of Profit
                              <Tooltip title="Percentage of simulations resulting in profit">
                                <InfoIcon fontSize="small" sx={{ ml: 1 }} />
                              </Tooltip>
                            </Typography>
                            <Typography variant="h6">
                              {(monteCarloResult.probabilityOfProfit * 100).toFixed(2)}%
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                              95% VaR
                              <Tooltip title="Value at Risk with 95% confidence">
                                <InfoIcon fontSize="small" sx={{ ml: 1 }} />
                              </Tooltip>
                            </Typography>
                            <Typography variant="h6" color="error.main">
                              {monteCarloResult.riskMetrics.var95.toFixed(2)}%
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12}>
                        <ResponsiveContainer width="100%" height={400}>
                          <LineChart>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            {monteCarloResult.equityCurves.map((curve, index) => (
                              <Line
                                key={index}
                                data={curve.map((value, time) => ({ time, value }))}
                                dataKey="value"
                                stroke={`rgba(136, 132, 216, ${index === 0 ? 1 : 0.1})`}
                                dot={false}
                              />
                            ))}
                          </LineChart>
                        </ResponsiveContainer>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {activeTab === 3 && monteCarloResult && (
                  <Box mt={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                              Standard Deviation
                              <Tooltip title="Volatility of returns">
                                <InfoIcon fontSize="small" sx={{ ml: 1 }} />
                              </Tooltip>
                            </Typography>
                            <Typography variant="h6">
                              {monteCarloResult.riskMetrics.standardDeviation.toFixed(2)}%
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                              Skewness
                              <Tooltip title="Asymmetry of returns distribution">
                                <InfoIcon fontSize="small" sx={{ ml: 1 }} />
                              </Tooltip>
                            </Typography>
                            <Typography variant="h6">
                              {monteCarloResult.riskMetrics.skewness.toFixed(2)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                              Kurtosis
                              <Tooltip title="Tail heaviness of returns distribution">
                                <InfoIcon fontSize="small" sx={{ ml: 1 }} />
                              </Tooltip>
                            </Typography>
                            <Typography variant="h6">
                              {monteCarloResult.riskMetrics.kurtosis.toFixed(2)}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" color="textSecondary">
                              CVaR (95%)
                              <Tooltip title="Expected shortfall beyond VaR">
                                <InfoIcon fontSize="small" sx={{ ml: 1 }} />
                              </Tooltip>
                            </Typography>
                            <Typography variant="h6" color="error.main">
                              {monteCarloResult.riskMetrics.cvar95.toFixed(2)}%
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
});

export default BacktestingDashboard;
