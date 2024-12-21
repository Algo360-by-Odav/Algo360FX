import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Slider,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStoreContext } from '../../stores/RootStoreContext';
import PerformanceChart from '../charts/PerformanceChart';

interface OptimizationParams {
  riskTolerance: number;
  targetReturn: number;
  investmentHorizon: number;
  rebalanceFrequency: 'Monthly' | 'Quarterly' | 'Annually';
  constraints: {
    maxPositionSize: number;
    minPositionSize: number;
    sectorDiversification: boolean;
  };
}

interface OptimizedPortfolio {
  allocations: {
    symbol: string;
    weight: number;
    expectedReturn: number;
    risk: number;
  }[];
  metrics: {
    expectedReturn: number;
    risk: number;
    sharpeRatio: number;
    diversificationScore: number;
  };
}

const PortfolioOptimizer: React.FC = observer(() => {
  const { stockMarketStore } = useRootStoreContext();
  const [optimizationParams, setOptimizationParams] = useState<OptimizationParams>({
    riskTolerance: 50,
    targetReturn: 12,
    investmentHorizon: 5,
    rebalanceFrequency: 'Quarterly',
    constraints: {
      maxPositionSize: 20,
      minPositionSize: 5,
      sectorDiversification: true,
    },
  });

  const [optimizedPortfolio, setOptimizedPortfolio] = useState<OptimizedPortfolio>({
    allocations: [
      { symbol: 'AAPL', weight: 25, expectedReturn: 15, risk: 18 },
      { symbol: 'MSFT', weight: 20, expectedReturn: 14, risk: 16 },
      { symbol: 'GOOGL', weight: 15, expectedReturn: 13, risk: 17 },
      { symbol: 'AMZN', weight: 15, expectedReturn: 16, risk: 20 },
      { symbol: 'BRK.B', weight: 10, expectedReturn: 10, risk: 12 },
      { symbol: 'JPM', weight: 8, expectedReturn: 11, risk: 15 },
      { symbol: 'JNJ', weight: 7, expectedReturn: 8, risk: 10 },
    ],
    metrics: {
      expectedReturn: 13.2,
      risk: 15.5,
      sharpeRatio: 1.8,
      diversificationScore: 85,
    },
  });

  const handleParamChange = (param: keyof OptimizationParams, value: any) => {
    setOptimizationParams((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  const handleConstraintChange = (constraint: keyof OptimizationParams['constraints'], value: any) => {
    setOptimizationParams((prev) => ({
      ...prev,
      constraints: {
        ...prev.constraints,
        [constraint]: value,
      },
    }));
  };

  const optimizePortfolio = () => {
    // In a real implementation, this would call an optimization algorithm
    console.log('Optimizing portfolio with params:', optimizationParams);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Optimization Parameters */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Optimization Parameters
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                Risk Tolerance: {optimizationParams.riskTolerance}%
              </Typography>
              <Slider
                value={optimizationParams.riskTolerance}
                onChange={(e, value) => handleParamChange('riskTolerance', value)}
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                Target Return: {optimizationParams.targetReturn}%
              </Typography>
              <Slider
                value={optimizationParams.targetReturn}
                onChange={(e, value) => handleParamChange('targetReturn', value)}
                min={5}
                max={25}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                Investment Horizon (years): {optimizationParams.investmentHorizon}
              </Typography>
              <Slider
                value={optimizationParams.investmentHorizon}
                onChange={(e, value) => handleParamChange('investmentHorizon', value)}
                min={1}
                max={10}
                valueLabelDisplay="auto"
              />
            </Box>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Rebalance Frequency</InputLabel>
              <Select
                value={optimizationParams.rebalanceFrequency}
                label="Rebalance Frequency"
                onChange={(e) => handleParamChange('rebalanceFrequency', e.target.value)}
              >
                <MenuItem value="Monthly">Monthly</MenuItem>
                <MenuItem value="Quarterly">Quarterly</MenuItem>
                <MenuItem value="Annually">Annually</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="subtitle1" gutterBottom>
              Constraints
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Maximum Position Size: {optimizationParams.constraints.maxPositionSize}%
              </Typography>
              <Slider
                value={optimizationParams.constraints.maxPositionSize}
                onChange={(e, value) => handleConstraintChange('maxPositionSize', value)}
                min={5}
                max={50}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Minimum Position Size: {optimizationParams.constraints.minPositionSize}%
              </Typography>
              <Slider
                value={optimizationParams.constraints.minPositionSize}
                onChange={(e, value) => handleConstraintChange('minPositionSize', value)}
                min={1}
                max={10}
                valueLabelDisplay="auto"
              />
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={optimizePortfolio}
              sx={{ mt: 2 }}
            >
              Optimize Portfolio
            </Button>
          </Paper>
        </Grid>

        {/* Optimization Results */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Optimized Portfolio
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Expected Return
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {optimizedPortfolio.metrics.expectedReturn}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Risk Level
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {optimizedPortfolio.metrics.risk}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Sharpe Ratio
                    </Typography>
                    <Typography variant="h6">
                      {optimizedPortfolio.metrics.sharpeRatio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Diversification
                    </Typography>
                    <Typography variant="h6">
                      {optimizedPortfolio.metrics.diversificationScore}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Stock</TableCell>
                    <TableCell align="right">Weight</TableCell>
                    <TableCell align="right">Exp. Return</TableCell>
                    <TableCell align="right">Risk</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {optimizedPortfolio.allocations.map((allocation) => (
                    <TableRow key={allocation.symbol}>
                      <TableCell>{allocation.symbol}</TableCell>
                      <TableCell align="right">{allocation.weight}%</TableCell>
                      <TableCell align="right">{allocation.expectedReturn}%</TableCell>
                      <TableCell align="right">{allocation.risk}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Efficient Frontier
              </Typography>
              <PerformanceChart
                data={{
                  labels: ['5%', '10%', '15%', '20%', '25%'],
                  datasets: [
                    {
                      label: 'Risk-Return Trade-off',
                      data: [6, 9, 13, 18, 24],
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.4,
                    },
                    {
                      label: 'Current Portfolio',
                      data: [optimizedPortfolio.metrics.risk],
                      borderColor: 'rgb(255, 99, 132)',
                      pointRadius: 8,
                      type: 'scatter',
                    },
                  ],
                }}
                options={{
                  scales: {
                    x: {
                      title: {
                        display: true,
                        text: 'Risk',
                      },
                    },
                    y: {
                      title: {
                        display: true,
                        text: 'Expected Return',
                      },
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default PortfolioOptimizer;
