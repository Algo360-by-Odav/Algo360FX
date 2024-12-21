import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Slider,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Portfolio,
  OptimizationObjective,
  RiskMeasure,
  PortfolioConstraints,
  PortfolioOptimizationResult,
} from '../../../types/portfolio';
import { PortfolioAnalyzer } from '../../../services/portfolio/PortfolioAnalyzer';
import { formatPercentage, formatCurrency } from '../../../utils/formatters';

interface PortfolioOptimizerProps {
  portfolio: Portfolio;
  onOptimize: (result: PortfolioOptimizationResult) => void;
}

const PortfolioOptimizer: React.FC<PortfolioOptimizerProps> = ({
  portfolio,
  onOptimize,
}) => {
  const [objective, setObjective] = useState<OptimizationObjective>(
    OptimizationObjective.MAX_SHARPE
  );
  const [riskMeasure, setRiskMeasure] = useState<RiskMeasure>(
    RiskMeasure.VOLATILITY
  );
  const [constraints, setConstraints] = useState<PortfolioConstraints>({
    minWeight: 0.05,
    maxWeight: 0.4,
    maxVolatility: 0.2,
    maxDrawdown: 0.15,
    minDiversification: 0.6,
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [optimizationResult, setOptimizationResult] =
    useState<PortfolioOptimizationResult | null>(null);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    setError(null);

    try {
      const analyzer = new PortfolioAnalyzer();
      const result = await analyzer.optimizePortfolio(
        portfolio.strategies,
        {}, // backtestResults - would need to be passed from parent
        objective,
        constraints,
        riskMeasure
      );

      setOptimizationResult(result);
      onOptimize(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsOptimizing(false);
    }
  };

  const renderEfficientFrontier = () => {
    if (!optimizationResult) return null;

    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <ResponsiveContainer>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="risk"
              name="Risk"
              label={{ value: 'Risk', position: 'bottom' }}
            />
            <YAxis
              dataKey="return"
              name="Return"
              label={{ value: 'Return', angle: -90, position: 'left' }}
            />
            <Tooltip
              formatter={(value: number) => formatPercentage(value)}
              labelFormatter={(label) => `Risk: ${formatPercentage(label)}`}
            />
            <Legend />
            <Scatter
              name="Portfolio"
              data={optimizationResult.efficientFrontier}
              fill="#2196f3"
            />
            <Scatter
              name="Current Portfolio"
              data={[
                {
                  risk: portfolio.metrics.volatility,
                  return: portfolio.metrics.expectedReturn,
                },
              ]}
              fill="#f44336"
            />
            <Scatter
              name="Optimal Portfolio"
              data={[
                {
                  risk: optimizationResult.metrics.volatility,
                  return: optimizationResult.metrics.expectedReturn,
                },
              ]}
              fill="#4caf50"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const renderRiskContribution = () => {
    if (!optimizationResult) return null;

    const data = optimizationResult.strategies.map((strategy, index) => ({
      name: strategy.name,
      contribution: optimizationResult.riskContribution[index],
    }));

    return (
      <Box sx={{ height: 300, width: '100%' }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => formatPercentage(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="contribution"
              stroke="#2196f3"
              name="Risk Contribution"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Portfolio Optimization
        </Typography>

        <Grid container spacing={3}>
          {/* Optimization Settings */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Optimization Objective</InputLabel>
              <Select
                value={objective}
                onChange={(e) =>
                  setObjective(e.target.value as OptimizationObjective)
                }
                label="Optimization Objective"
              >
                <MenuItem value={OptimizationObjective.MAX_SHARPE}>
                  Maximize Sharpe Ratio
                </MenuItem>
                <MenuItem value={OptimizationObjective.MIN_RISK}>
                  Minimize Risk
                </MenuItem>
                <MenuItem value={OptimizationObjective.MAX_RETURN}>
                  Maximize Return
                </MenuItem>
                <MenuItem value={OptimizationObjective.RISK_PARITY}>
                  Risk Parity
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Risk Measure</InputLabel>
              <Select
                value={riskMeasure}
                onChange={(e) => setRiskMeasure(e.target.value as RiskMeasure)}
                label="Risk Measure"
              >
                <MenuItem value={RiskMeasure.VOLATILITY}>Volatility</MenuItem>
                <MenuItem value={RiskMeasure.VAR}>Value at Risk</MenuItem>
                <MenuItem value={RiskMeasure.CVAR}>
                  Conditional Value at Risk
                </MenuItem>
                <MenuItem value={RiskMeasure.DOWNSIDE_RISK}>
                  Downside Risk
                </MenuItem>
                <MenuItem value={RiskMeasure.TRACKING_ERROR}>
                  Tracking Error
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Constraints */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Portfolio Constraints
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Minimum Weight per Strategy
              </Typography>
              <Slider
                value={constraints.minWeight}
                onChange={(e, value) =>
                  setConstraints({ ...constraints, minWeight: value as number })
                }
                min={0}
                max={0.5}
                step={0.01}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => formatPercentage(value)}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Maximum Weight per Strategy
              </Typography>
              <Slider
                value={constraints.maxWeight}
                onChange={(e, value) =>
                  setConstraints({ ...constraints, maxWeight: value as number })
                }
                min={0.1}
                max={1}
                step={0.01}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => formatPercentage(value)}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Maximum Volatility
              </Typography>
              <Slider
                value={constraints.maxVolatility}
                onChange={(e, value) =>
                  setConstraints({
                    ...constraints,
                    maxVolatility: value as number,
                  })
                }
                min={0.05}
                max={0.5}
                step={0.01}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => formatPercentage(value)}
              />
            </Box>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={handleOptimize}
              disabled={isOptimizing}
              sx={{ mr: 2 }}
            >
              {isOptimizing ? (
                <CircularProgress size={24} sx={{ mr: 1 }} />
              ) : null}
              Optimize Portfolio
            </Button>
          </Grid>

          {/* Error Message */}
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Optimization Results */}
      {optimizationResult && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Optimization Results
          </Typography>

          <Grid container spacing={3}>
            {/* Key Metrics */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip
                  label={`Expected Return: ${formatPercentage(
                    optimizationResult.metrics.expectedReturn
                  )}`}
                  color="primary"
                />
                <Chip
                  label={`Volatility: ${formatPercentage(
                    optimizationResult.metrics.volatility
                  )}`}
                  color="primary"
                />
                <Chip
                  label={`Sharpe Ratio: ${optimizationResult.metrics.sharpeRatio.toFixed(
                    2
                  )}`}
                  color="primary"
                />
                <Chip
                  label={`Max Drawdown: ${formatPercentage(
                    optimizationResult.metrics.maxDrawdown
                  )}`}
                  color="error"
                />
              </Box>
            </Grid>

            {/* Efficient Frontier */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Efficient Frontier
              </Typography>
              {renderEfficientFrontier()}
            </Grid>

            {/* Risk Contribution */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Risk Contribution
              </Typography>
              {renderRiskContribution()}
            </Grid>

            {/* Optimized Weights */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Optimized Strategy Weights
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {optimizationResult.strategies.map((strategy) => (
                  <Chip
                    key={strategy.id}
                    label={`${strategy.name}: ${formatPercentage(
                      strategy.allocation
                    )}`}
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default PortfolioOptimizer;
