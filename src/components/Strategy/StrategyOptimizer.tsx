import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Save as SaveIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useStore } from '../../hooks/useStore';
import { Strategy, OptimizationResult, Parameter } from '../../types/trading';
import { formatPercentage } from '../../utils/formatters';
import WalkForwardAnalysis from './WalkForwardAnalysis';
import MonteCarloSimulation from './MonteCarloSimulation';

interface StrategyOptimizerProps {
  strategy: Strategy;
  onSave: (optimizedStrategy: Strategy) => void;
}

const StrategyOptimizer: React.FC<StrategyOptimizerProps> = observer(({
  strategy,
  onSave,
}) => {
  const theme = useTheme();
  const { backtestingStore } = useStore();
  const [optimizationParams, setOptimizationParams] = React.useState<Parameter[]>(
    []
  );
  const [optimizationMetric, setOptimizationMetric] = React.useState('sharpeRatio');
  const [isOptimizing, setIsOptimizing] = React.useState(false);
  const [optimizationResults, setOptimizationResults] = React.useState<OptimizationResult | null>(null);
  const [selectedResult, setSelectedResult] = React.useState<number | null>(null);
  const [showWalkForward, setShowWalkForward] = React.useState(false);
  const [showMonteCarlo, setShowMonteCarlo] = React.useState(false);

  React.useEffect(() => {
    // Extract parameters from strategy that can be optimized
    const params: Parameter[] = [];
    
    // Add indicator parameters
    strategy.entryRules.forEach(rule => {
      rule.conditions.forEach(condition => {
        Object.entries(condition.parameters).forEach(([name, value]) => {
          if (typeof value === 'number') {
            params.push({
              name: `${condition.indicator}_${name}`,
              currentValue: value,
              min: value * 0.5,
              max: value * 2,
              step: 1,
            });
          }
        });
      });
    });

    // Add risk management parameters
    params.push({
      name: 'riskPerTrade',
      currentValue: strategy.riskManagement.riskPerTrade,
      min: 0.1,
      max: 5,
      step: 0.1,
    });

    setOptimizationParams(params);
  }, [strategy]);

  const handleParamChange = (index: number, field: keyof Parameter, value: number) => {
    setOptimizationParams(prev => {
      const newParams = [...prev];
      newParams[index] = { ...newParams[index], [field]: value };
      return newParams;
    });
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const results = await backtestingStore.optimizeStrategy(
        strategy,
        optimizationParams,
        optimizationMetric
      );
      setOptimizationResults(results);
    } catch (error) {
      console.error('Optimization failed:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSaveOptimized = () => {
    if (optimizationResults && selectedResult !== null) {
      const optimizedStrategy = backtestingStore.applyOptimizationResult(
        strategy,
        optimizationResults.results[selectedResult]
      );
      onSave(optimizedStrategy);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Optimization Parameters */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Optimization Parameters
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Optimization Metric</InputLabel>
              <Select
                value={optimizationMetric}
                label="Optimization Metric"
                onChange={(e) => setOptimizationMetric(e.target.value)}
              >
                <MenuItem value="sharpeRatio">Sharpe Ratio</MenuItem>
                <MenuItem value="sortinoRatio">Sortino Ratio</MenuItem>
                <MenuItem value="calmarRatio">Calmar Ratio</MenuItem>
                <MenuItem value="profitFactor">Profit Factor</MenuItem>
                <MenuItem value="netProfit">Net Profit</MenuItem>
              </Select>
            </FormControl>

            {optimizationParams.map((param, index) => (
              <Box key={param.name} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {param.name}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Min"
                      type="number"
                      value={param.min}
                      onChange={(e) =>
                        handleParamChange(index, 'min', Number(e.target.value))
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Max"
                      type="number"
                      value={param.max}
                      onChange={(e) =>
                        handleParamChange(index, 'max', Number(e.target.value))
                      }
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Step"
                      type="number"
                      value={param.step}
                      onChange={(e) =>
                        handleParamChange(index, 'step', Number(e.target.value))
                      }
                    />
                  </Grid>
                </Grid>
                <Slider
                  value={param.currentValue}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  onChange={(_, value) =>
                    handleParamChange(index, 'currentValue', value as number)
                  }
                  valueLabelDisplay="auto"
                />
              </Box>
            ))}

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={handleOptimize}
                disabled={isOptimizing}
              >
                {isOptimizing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Run Optimization'
                )}
              </Button>
              <Button
                variant="outlined"
                startIcon={<TrendingUpIcon />}
                onClick={() => setShowWalkForward(true)}
              >
                Walk Forward Analysis
              </Button>
              <Button
                variant="outlined"
                onClick={() => setShowMonteCarlo(true)}
              >
                Monte Carlo
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Optimization Results */}
        {optimizationResults && (
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Optimization Results
              </Typography>

              {/* 3D Surface Plot */}
              <Box sx={{ height: 400, mb: 2 }}>
                <ResponsiveContainer>
                  <ScatterChart>
                    <CartesianGrid />
                    <XAxis
                      dataKey="param1"
                      name={optimizationParams[0]?.name}
                      unit=""
                    />
                    <YAxis
                      dataKey="param2"
                      name={optimizationParams[1]?.name}
                      unit=""
                    />
                    <ZAxis
                      dataKey="metric"
                      range={[50, 500]}
                      name={optimizationMetric}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value: any) =>
                        `${optimizationMetric}: ${Number(value).toFixed(2)}`
                      }
                    />
                    <Scatter
                      data={optimizationResults.surfacePlot}
                      fill={theme.palette.primary.main}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </Box>

              {/* Results Table */}
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Rank</TableCell>
                      {optimizationParams.map((param) => (
                        <TableCell key={param.name}>{param.name}</TableCell>
                      ))}
                      <TableCell align="right">{optimizationMetric}</TableCell>
                      <TableCell align="right">Sharpe</TableCell>
                      <TableCell align="right">Max DD</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {optimizationResults.results.map((result, index) => (
                      <TableRow
                        key={index}
                        selected={selectedResult === index}
                        onClick={() => setSelectedResult(index)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>{index + 1}</TableCell>
                        {optimizationParams.map((param) => (
                          <TableCell key={param.name}>
                            {result.parameters[param.name].toFixed(2)}
                          </TableCell>
                        ))}
                        <TableCell align="right">
                          {result.metrics[optimizationMetric].toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {result.metrics.sharpeRatio.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          {formatPercentage(result.metrics.maxDrawdown)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveOptimized}
                  disabled={selectedResult === null}
                >
                  Apply Selected Parameters
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Walk Forward Analysis Dialog */}
      {showWalkForward && (
        <WalkForwardAnalysis
          strategy={strategy}
          optimizationParams={optimizationParams}
          onClose={() => setShowWalkForward(false)}
        />
      )}

      {/* Monte Carlo Simulation Dialog */}
      {showMonteCarlo && (
        <MonteCarloSimulation
          strategy={strategy}
          onClose={() => setShowMonteCarlo(false)}
        />
      )}
    </Box>
  );
});

export default StrategyOptimizer;
