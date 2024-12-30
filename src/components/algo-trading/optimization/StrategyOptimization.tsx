import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Slider,
  CircularProgress,
  Alert,
  Chip,
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
  ScatterChart,
  Scatter,
} from 'recharts';
import {
  OptimizationMethod,
  OptimizationMetric,
  OptimizationConfig,
  OptimizationProgress,
  OptimizationResult,
} from '../../../types/optimization';
import { TradingStrategy } from '../../../types/algo-trading';
import { useAlgoTradingStore } from '../../../stores/AlgoTradingStore';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';

interface StrategyOptimizationProps {
  strategy: TradingStrategy;
}

const StrategyOptimization: React.FC<StrategyOptimizationProps> = ({
  strategy,
}) => {
  const algoTradingStore = useAlgoTradingStore();
  const [config, setConfig] = useState<Partial<OptimizationConfig>>({
    method: OptimizationMethod.GRID_SEARCH,
    optimizationMetric: OptimizationMetric.SHARPE_RATIO,
    startDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
    endDate: new Date(),
    parameters: {},
    walkForwardPeriods: 5,
    monteCarloIterations: 100,
    generations: 10,
    populationSize: 50,
    mutationRate: 0.1,
    maxDrawdown: 20,
    minTradeCount: 30,
    minWinRate: 50,
    minProfitFactor: 1.5,
  });
  const [progress, setProgress] = useState<OptimizationProgress | null>(null);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async () => {
    try {
      setError(null);
      setProgress({
        status: 'running',
        progress: 0,
        currentIteration: 0,
        totalIterations: 0,
      });

      const optimizationResult = await algoTradingStore.optimizeStrategy(
        strategy,
        config as OptimizationConfig
      );

      setResult(optimizationResult);
      setProgress({
        status: 'completed',
        progress: 100,
        currentIteration: 100,
        totalIterations: 100,
        bestResult: optimizationResult,
      });
    } catch (err) {
      setError(err.message);
      setProgress({
        status: 'failed',
        progress: 0,
        currentIteration: 0,
        totalIterations: 0,
        error: err.message,
      });
    }
  };

  const renderOptimizationSettings = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Optimization Method</InputLabel>
          <Select
            value={config.method}
            onChange={(e) =>
              setConfig({ ...config, method: e.target.value as OptimizationMethod })
            }
          >
            <MenuItem value={OptimizationMethod.GRID_SEARCH}>Grid Search</MenuItem>
            <MenuItem value={OptimizationMethod.WALK_FORWARD}>
              Walk Forward
            </MenuItem>
            <MenuItem value={OptimizationMethod.MONTE_CARLO}>
              Monte Carlo
            </MenuItem>
            <MenuItem value={OptimizationMethod.GENETIC}>
              Genetic Algorithm
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Optimization Metric</InputLabel>
          <Select
            value={config.optimizationMetric}
            onChange={(e) =>
              setConfig({
                ...config,
                optimizationMetric: e.target.value as OptimizationMetric,
              })
            }
          >
            <MenuItem value={OptimizationMetric.SHARPE_RATIO}>
              Sharpe Ratio
            </MenuItem>
            <MenuItem value={OptimizationMetric.NET_PROFIT}>Net Profit</MenuItem>
            <MenuItem value={OptimizationMetric.WIN_RATE}>Win Rate</MenuItem>
            <MenuItem value={OptimizationMetric.PROFIT_FACTOR}>
              Profit Factor
            </MenuItem>
            <MenuItem value={OptimizationMetric.MAX_DRAWDOWN}>
              Max Drawdown
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Method-specific settings */}
      {config.method === OptimizationMethod.WALK_FORWARD && (
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Walk Forward Periods"
            type="number"
            value={config.walkForwardPeriods}
            onChange={(e) =>
              setConfig({
                ...config,
                walkForwardPeriods: parseInt(e.target.value),
              })
            }
          />
        </Grid>
      )}

      {config.method === OptimizationMethod.MONTE_CARLO && (
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Monte Carlo Iterations"
            type="number"
            value={config.monteCarloIterations}
            onChange={(e) =>
              setConfig({
                ...config,
                monteCarloIterations: parseInt(e.target.value),
              })
            }
          />
        </Grid>
      )}

      {config.method === OptimizationMethod.GENETIC && (
        <>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Generations"
              type="number"
              value={config.generations}
              onChange={(e) =>
                setConfig({
                  ...config,
                  generations: parseInt(e.target.value),
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Population Size"
              type="number"
              value={config.populationSize}
              onChange={(e) =>
                setConfig({
                  ...config,
                  populationSize: parseInt(e.target.value),
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Mutation Rate"
              type="number"
              inputProps={{ step: 0.01, min: 0, max: 1 }}
              value={config.mutationRate}
              onChange={(e) =>
                setConfig({
                  ...config,
                  mutationRate: parseFloat(e.target.value),
                })
              }
            />
          </Grid>
        </>
      )}

      {/* Constraints */}
      <Grid item xs={12}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Optimization Constraints
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography gutterBottom>Max Drawdown (%)</Typography>
            <Slider
              value={config.maxDrawdown}
              onChange={(_, value) =>
                setConfig({ ...config, maxDrawdown: value as number })
              }
              min={0}
              max={50}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography gutterBottom>Min Trade Count</Typography>
            <Slider
              value={config.minTradeCount}
              onChange={(_, value) =>
                setConfig({ ...config, minTradeCount: value as number })
              }
              min={10}
              max={100}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography gutterBottom>Min Win Rate (%)</Typography>
            <Slider
              value={config.minWinRate}
              onChange={(_, value) =>
                setConfig({ ...config, minWinRate: value as number })
              }
              min={30}
              max={80}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography gutterBottom>Min Profit Factor</Typography>
            <Slider
              value={config.minProfitFactor}
              onChange={(_, value) =>
                setConfig({ ...config, minProfitFactor: value as number })
              }
              min={1}
              max={3}
              step={0.1}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="contained"
          onClick={handleOptimize}
          disabled={progress?.status === 'running'}
          sx={{ mr: 2 }}
        >
          {progress?.status === 'running' ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Optimizing...
            </>
          ) : (
            'Start Optimization'
          )}
        </Button>
      </Grid>
    </Grid>
  );

  const renderResults = () => {
    if (!result) return null;

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Optimization Results
        </Typography>

        <Grid container spacing={3}>
          {/* Best Parameters */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Best Parameters
              </Typography>
              <Grid container spacing={1}>
                {Object.entries(result.parameters).map(([key, value]) => (
                  <Grid item xs={6} key={key}>
                    <Chip
                      label={`${key}: ${value}`}
                      sx={{ width: '100%' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Performance Metrics */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Performance Metrics
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Net Profit
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(result.performance.netProfit)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Sharpe Ratio
                  </Typography>
                  <Typography variant="h6">
                    {result.performance.sharpeRatio.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Win Rate
                  </Typography>
                  <Typography variant="h6">
                    {formatPercentage(result.performance.winRate)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Max Drawdown
                  </Typography>
                  <Typography variant="h6">
                    {formatPercentage(result.performance.maxDrawdown)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Results Distribution */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Results Distribution
              </Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="performance.sharpeRatio"
                      name="Sharpe Ratio"
                      domain={['auto', 'auto']}
                    />
                    <YAxis
                      dataKey="performance.netProfit"
                      name="Net Profit"
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        typeof value === 'number'
                          ? value.toFixed(2)
                          : value
                      }
                    />
                    <Legend />
                    <Scatter
                      name="Parameter Combinations"
                      data={result.allResults}
                      fill="#8884d8"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Strategy Optimization
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {renderOptimizationSettings()}
        {renderResults()}
      </Paper>
    </Box>
  );
};

export default StrategyOptimization;
