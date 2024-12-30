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
  Chip,
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
  ScatterChart,
  Scatter,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import InfoIcon from '@mui/icons-material/Info';
import { Strategy } from '../../types/trading';
import { portfolioOptimizer } from '../../services/portfolio/PortfolioOptimizer';
import './PortfolioOptimizer.css';

interface PortfolioOptimizerProps {
  strategies: Strategy[];
  onOptimizationComplete?: (allocations: any) => void;
}

const PortfolioOptimizer: React.FC<PortfolioOptimizerProps> = observer(({
  strategies,
  onOptimizationComplete,
}) => {
  const [selectedStrategies, setSelectedStrategies] = useState<Strategy[]>([]);
  const [optimizationTarget, setOptimizationTarget] = useState<'SHARPE' | 'RETURN' | 'RISK_PARITY' | 'MIN_VARIANCE'>('SHARPE');
  const [riskFreeRate, setRiskFreeRate] = useState(0.02);
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [initialBalance, setInitialBalance] = useState(10000);
  const [constraints, setConstraints] = useState({
    minWeight: 0.05,
    maxWeight: 0.4,
    targetReturn: undefined as number | undefined,
    maxDrawdown: undefined as number | undefined,
    minSharpe: undefined as number | undefined,
  });

  const handleOptimize = async () => {
    if (selectedStrategies.length === 0) return;

    const result = await portfolioOptimizer.optimizePortfolio({
      strategies: selectedStrategies,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      initialBalance,
      riskFreeRate,
      constraints,
      optimizationTarget,
    });

    if (onOptimizationComplete) {
      onOptimizationComplete(result);
    }
  };

  const renderEfficientFrontier = () => {
    const history = portfolioOptimizer.getOptimizationHistory();
    if (history.length === 0) return null;

    const latest = history[history.length - 1];
    const data = latest.efficientFrontier.map(point => ({
      risk: point.risk * 100,
      return: point.return * 100,
    }));

    const currentPortfolio = {
      risk: latest.metrics.volatility * 100,
      return: latest.metrics.expectedReturn * 100,
    };

    return (
      <Card className="chart-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Efficient Frontier
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="risk"
                name="Risk (%)"
                label={{ value: 'Risk (%)', position: 'bottom' }}
              />
              <YAxis
                dataKey="return"
                name="Return (%)"
                label={{ value: 'Return (%)', angle: -90, position: 'left' }}
              />
              <RechartsTooltip />
              <Legend />
              <Scatter
                name="Efficient Frontier"
                data={data}
                fill="#8884d8"
                line
              />
              <Scatter
                name="Current Portfolio"
                data={[currentPortfolio]}
                fill="#ff0000"
                shape="star"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderRiskDecomposition = () => {
    const history = portfolioOptimizer.getOptimizationHistory();
    if (history.length === 0) return null;

    const latest = history[history.length - 1];
    const data = latest.riskDecomposition.map(item => ({
      strategy: item.strategy,
      systematic: item.systematicRisk * 100,
      specific: item.specificRisk * 100,
    }));

    return (
      <Card className="chart-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Risk Decomposition
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="strategy" />
              <PolarRadiusAxis />
              <Radar
                name="Systematic Risk"
                dataKey="systematic"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Radar
                name="Specific Risk"
                dataKey="specific"
                stroke="#82ca9d"
                fill="#82ca9d"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderCorrelationMatrix = () => {
    const history = portfolioOptimizer.getOptimizationHistory();
    if (history.length === 0) return null;

    const latest = history[history.length - 1];
    return (
      <Card className="correlation-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Strategy Correlations
          </Typography>
          <div className="correlation-matrix">
            {latest.correlationMatrix.map((row, i) => (
              <div key={i} className="correlation-row">
                {row.map((value, j) => (
                  <Tooltip
                    key={j}
                    title={`${selectedStrategies[i].name} vs ${selectedStrategies[j].name}`}
                  >
                    <div
                      className="correlation-cell"
                      style={{
                        backgroundColor: `rgba(${value > 0 ? '0,128,0' : '255,0,0'},${Math.abs(value)})`,
                      }}
                    >
                      {value.toFixed(2)}
                    </div>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStressTest = () => {
    const history = portfolioOptimizer.getOptimizationHistory();
    if (history.length === 0) return null;

    const latest = history[history.length - 1];
    return (
      <Card className="stress-test-card">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Stress Test Results
          </Typography>
          <div className="stress-test-grid">
            {latest.stressTest.map((test, index) => (
              <div key={index} className="stress-test-item">
                <Typography variant="subtitle2">{test.scenario}</Typography>
                <Typography
                  variant="h6"
                  className={test.impact < 0 ? 'negative' : 'positive'}
                >
                  {(test.impact * 100).toFixed(2)}%
                </Typography>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box className="portfolio-optimizer">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Portfolio Settings
              </Typography>
              <div className="strategy-selection">
                <Typography variant="subtitle2" gutterBottom>
                  Selected Strategies
                </Typography>
                <div className="strategy-chips">
                  {selectedStrategies.map((strategy) => (
                    <Chip
                      key={strategy.id}
                      label={strategy.name}
                      onDelete={() =>
                        setSelectedStrategies(
                          selectedStrategies.filter((s) => s.id !== strategy.id)
                        )
                      }
                      className="strategy-chip"
                    />
                  ))}
                </div>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Add Strategy</InputLabel>
                  <Select
                    value=""
                    onChange={(e) => {
                      const strategy = strategies.find(
                        (s) => s.id === e.target.value
                      );
                      if (strategy) {
                        setSelectedStrategies([...selectedStrategies, strategy]);
                      }
                    }}
                  >
                    {strategies
                      .filter((s) => !selectedStrategies.includes(s))
                      .map((strategy) => (
                        <MenuItem key={strategy.id} value={strategy.id}>
                          {strategy.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>

              <FormControl fullWidth margin="normal">
                <InputLabel>Optimization Target</InputLabel>
                <Select
                  value={optimizationTarget}
                  onChange={(e) =>
                    setOptimizationTarget(e.target.value as typeof optimizationTarget)
                  }
                >
                  <MenuItem value="SHARPE">Maximize Sharpe Ratio</MenuItem>
                  <MenuItem value="RETURN">Maximize Return</MenuItem>
                  <MenuItem value="RISK_PARITY">Risk Parity</MenuItem>
                  <MenuItem value="MIN_VARIANCE">Minimize Variance</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                margin="normal"
                label="Risk-Free Rate"
                type="number"
                value={riskFreeRate}
                onChange={(e) => setRiskFreeRate(Number(e.target.value))}
                InputProps={{
                  inputProps: { min: 0, max: 1, step: 0.001 },
                }}
              />

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

              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Constraints
                <Tooltip title="Set portfolio constraints">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Typography>

              <TextField
                fullWidth
                margin="normal"
                label="Minimum Weight"
                type="number"
                value={constraints.minWeight}
                onChange={(e) =>
                  setConstraints({
                    ...constraints,
                    minWeight: Number(e.target.value),
                  })
                }
                InputProps={{
                  inputProps: { min: 0, max: 1, step: 0.01 },
                }}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Maximum Weight"
                type="number"
                value={constraints.maxWeight}
                onChange={(e) =>
                  setConstraints({
                    ...constraints,
                    maxWeight: Number(e.target.value),
                  })
                }
                InputProps={{
                  inputProps: { min: 0, max: 1, step: 0.01 },
                }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleOptimize}
                disabled={
                  selectedStrategies.length === 0 ||
                  portfolioOptimizer.isOptimizing()
                }
                sx={{ mt: 2 }}
              >
                {portfolioOptimizer.isOptimizing() ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Optimize Portfolio'
                )}
              </Button>

              {portfolioOptimizer.isOptimizing() && (
                <Box mt={2} display="flex" alignItems="center">
                  <CircularProgress
                    variant="determinate"
                    value={portfolioOptimizer.getProgress()}
                    size={24}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {Math.round(portfolioOptimizer.getProgress())}% Complete
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {renderEfficientFrontier()}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderRiskDecomposition()}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderCorrelationMatrix()}
            </Grid>
            <Grid item xs={12}>
              {renderStressTest()}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
});

export default PortfolioOptimizer;
