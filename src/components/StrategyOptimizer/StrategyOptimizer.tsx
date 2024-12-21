import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Slider,
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
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import InfoIcon from '@mui/icons-material/Info';
import { Strategy } from '../../types/trading';
import { mlStrategyOptimizer } from '../../services/strategy/MLStrategyOptimizer';
import './StrategyOptimizer.css';

interface StrategyOptimizerProps {
  strategies: Strategy[];
  onOptimizationComplete?: (optimizedStrategy: Strategy) => void;
}

const StrategyOptimizer: React.FC<StrategyOptimizerProps> = observer(({
  strategies,
  onOptimizationComplete,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [optimizationTarget, setOptimizationTarget] = useState<'RETURN' | 'SHARPE' | 'SORTINO' | 'CALMAR'>('SHARPE');
  const [populationSize, setPopulationSize] = useState(100);
  const [generations, setGenerations] = useState(50);
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [initialBalance, setInitialBalance] = useState(10000);

  const handleOptimize = async () => {
    if (!selectedStrategy) return;

    const result = await mlStrategyOptimizer.optimizeStrategy({
      strategy: selectedStrategy,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      initialBalance,
      optimizationTarget,
      populationSize,
      generations,
      crossoverRate: 0.8,
      mutationRate: 0.1,
      validationSplit: 0.2,
    });

    if (onOptimizationComplete) {
      const optimizedStrategy = {
        ...selectedStrategy,
        parameters: result.optimizedParameters,
      };
      onOptimizationComplete(optimizedStrategy);
    }
  };

  const renderConvergenceChart = () => {
    const history = mlStrategyOptimizer.getOptimizationHistory();
    if (history.length === 0) return null;

    const latest = history[history.length - 1];
    const data = latest.convergenceHistory.map((value, index) => ({
      generation: index + 1,
      loss: value,
    }));

    return (
      <Card className="chart-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Optimization Convergence
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="generation" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="loss"
                stroke="#8884d8"
                name="Loss"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderFeatureImportance = () => {
    const history = mlStrategyOptimizer.getOptimizationHistory();
    if (history.length === 0) return null;

    const latest = history[history.length - 1];
    const data = Object.entries(latest.featureImportance).map(([feature, importance]) => ({
      feature,
      importance: importance * 100,
    }));

    return (
      <Card className="chart-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Feature Importance
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="feature" />
              <PolarRadiusAxis />
              <Radar
                name="Importance"
                dataKey="importance"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderValidationMetrics = () => {
    const history = mlStrategyOptimizer.getOptimizationHistory();
    if (history.length === 0) return null;

    const latest = history[history.length - 1];
    const { mse, mae, r2 } = latest.validationMetrics;

    return (
      <Card className="metrics-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Validation Metrics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="subtitle2" color="textSecondary">
                MSE
              </Typography>
              <Typography variant="h6">{mse.toFixed(4)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle2" color="textSecondary">
                MAE
              </Typography>
              <Typography variant="h6">{mae.toFixed(4)}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle2" color="textSecondary">
                R²
              </Typography>
              <Typography variant="h6">{r2.toFixed(4)}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box className="strategy-optimizer">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Optimization Settings
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Strategy</InputLabel>
                <Select
                  value={selectedStrategy?.id || ''}
                  onChange={(e) =>
                    setSelectedStrategy(
                      strategies.find((s) => s.id === e.target.value) || null
                    )
                  }
                >
                  {strategies.map((strategy) => (
                    <MenuItem key={strategy.id} value={strategy.id}>
                      {strategy.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal">
                <InputLabel>Optimization Target</InputLabel>
                <Select
                  value={optimizationTarget}
                  onChange={(e) =>
                    setOptimizationTarget(e.target.value as typeof optimizationTarget)
                  }
                >
                  <MenuItem value="RETURN">Total Return</MenuItem>
                  <MenuItem value="SHARPE">Sharpe Ratio</MenuItem>
                  <MenuItem value="SORTINO">Sortino Ratio</MenuItem>
                  <MenuItem value="CALMAR">Calmar Ratio</MenuItem>
                </Select>
              </FormControl>

              <Box mt={2}>
                <Typography gutterBottom>
                  Population Size
                  <Tooltip title="Number of candidate solutions in each generation">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <Slider
                  value={populationSize}
                  onChange={(_, value) => setPopulationSize(value as number)}
                  min={50}
                  max={500}
                  step={50}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box mt={2}>
                <Typography gutterBottom>
                  Generations
                  <Tooltip title="Number of evolutionary iterations">
                    <IconButton size="small">
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <Slider
                  value={generations}
                  onChange={(_, value) => setGenerations(value as number)}
                  min={10}
                  max={100}
                  step={10}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <TextField
                fullWidth
                margin="normal"
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Initial Balance"
                type="number"
                value={initialBalance}
                onChange={(e) => setInitialBalance(Number(e.target.value))}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleOptimize}
                disabled={!selectedStrategy || mlStrategyOptimizer.isOptimizing()}
                sx={{ mt: 2 }}
              >
                {mlStrategyOptimizer.isOptimizing() ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Optimize Strategy'
                )}
              </Button>

              {mlStrategyOptimizer.isOptimizing() && (
                <Box mt={2} display="flex" alignItems="center">
                  <CircularProgress
                    variant="determinate"
                    value={mlStrategyOptimizer.getProgress()}
                    size={24}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {Math.round(mlStrategyOptimizer.getProgress())}% Complete
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {renderConvergenceChart()}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderFeatureImportance()}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderValidationMetrics()}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
});

export default StrategyOptimizer;
