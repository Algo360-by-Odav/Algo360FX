import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Slider,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts';
import {
  Refresh,
  Info,
  TrendingUp,
  ShowChart,
  Timeline,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface Asset {
  symbol: string;
  weight: number;
  returns: number;
  volatility: number;
  sharpeRatio: number;
  correlation: Record<string, number>;
}

interface OptimizationResult {
  weights: Record<string, number>;
  expectedReturn: number;
  expectedRisk: number;
  sharpeRatio: number;
}

const PortfolioOptimizer: React.FC = observer(() => {
  const [riskTolerance, setRiskTolerance] = useState<number>(50);
  const [rebalanceFrequency, setRebalanceFrequency] = useState<string>('Monthly');
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult>({
    weights: {
      'EUR/USD': 30,
      'GBP/USD': 25,
      'USD/JPY': 20,
      'AUD/USD': 15,
      'USD/CAD': 10,
    },
    expectedReturn: 15.5,
    expectedRisk: 8.2,
    sharpeRatio: 1.89,
  });

  const assets: Asset[] = [
    {
      symbol: 'EUR/USD',
      weight: 30,
      returns: 12.5,
      volatility: 8.2,
      sharpeRatio: 1.52,
      correlation: { 'EUR/USD': 1, 'GBP/USD': 0.75, 'USD/JPY': -0.2 },
    },
    {
      symbol: 'GBP/USD',
      weight: 25,
      returns: 10.8,
      volatility: 9.1,
      sharpeRatio: 1.18,
      correlation: { 'EUR/USD': 0.75, 'GBP/USD': 1, 'USD/JPY': -0.15 },
    },
    {
      symbol: 'USD/JPY',
      weight: 20,
      returns: 8.5,
      volatility: 7.5,
      sharpeRatio: 1.13,
      correlation: { 'EUR/USD': -0.2, 'GBP/USD': -0.15, 'USD/JPY': 1 },
    },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const handleOptimize = () => {
    // Implement portfolio optimization logic here
    console.log('Optimizing portfolio...');
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Optimization Controls */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Optimization Parameters
            </Typography>
            
            <Box mb={3}>
              <Typography gutterBottom>Risk Tolerance</Typography>
              <Slider
                value={riskTolerance}
                onChange={(_, value) => setRiskTolerance(value as number)}
                valueLabelDisplay="auto"
                marks={[
                  { value: 0, label: 'Conservative' },
                  { value: 50, label: 'Moderate' },
                  { value: 100, label: 'Aggressive' },
                ]}
              />
            </Box>

            <Box mb={3}>
              <TextField
                select
                fullWidth
                label="Rebalance Frequency"
                value={rebalanceFrequency}
                onChange={(e) => setRebalanceFrequency(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </TextField>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleOptimize}
            >
              Optimize Portfolio
            </Button>
          </Paper>
        </Grid>

        {/* Optimization Results */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Optimized Portfolio</Typography>
              <IconButton>
                <Refresh />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              {/* Portfolio Metrics */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Expected Return
                        </Typography>
                        <Typography variant="h5" color="success.main">
                          {formatPercent(optimizationResult.expectedReturn)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Expected Risk
                        </Typography>
                        <Typography variant="h5" color="error.main">
                          {formatPercent(optimizationResult.expectedRisk)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <Card>
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          Sharpe Ratio
                        </Typography>
                        <Typography variant="h5">
                          {optimizationResult.sharpeRatio.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              {/* Portfolio Allocation Chart */}
              <Grid item xs={12} md={4}>
                <Box height={200}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(optimizationResult.weights).map(([name, value]) => ({
                          name,
                          value,
                        }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {Object.entries(optimizationResult.weights).map((entry, index) => (
                          <Cell key={entry[0]} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>

            {/* Asset Details Table */}
            <TableContainer sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    <TableCell align="right">Weight</TableCell>
                    <TableCell align="right">Returns</TableCell>
                    <TableCell align="right">Volatility</TableCell>
                    <TableCell align="right">Sharpe Ratio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.symbol}>
                      <TableCell>{asset.symbol}</TableCell>
                      <TableCell align="right">{formatPercent(asset.weight)}</TableCell>
                      <TableCell align="right">{formatPercent(asset.returns)}</TableCell>
                      <TableCell align="right">{formatPercent(asset.volatility)}</TableCell>
                      <TableCell align="right">{asset.sharpeRatio.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Correlation Matrix */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Correlation Matrix
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Asset</TableCell>
                    {assets.map((asset) => (
                      <TableCell key={asset.symbol} align="right">
                        {asset.symbol}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assets.map((asset) => (
                    <TableRow key={asset.symbol}>
                      <TableCell>{asset.symbol}</TableCell>
                      {assets.map((correlatedAsset) => (
                        <TableCell
                          key={correlatedAsset.symbol}
                          align="right"
                          sx={{
                            backgroundColor: `rgba(0, 128, 255, ${
                              Math.abs(asset.correlation[correlatedAsset.symbol] || 0) * 0.2
                            })`,
                          }}
                        >
                          {(asset.correlation[correlatedAsset.symbol] || 0).toFixed(2)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default PortfolioOptimizer;
