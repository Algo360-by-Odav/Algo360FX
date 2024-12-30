import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Slider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import { useStore } from '../../hooks/useStore';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const RiskAnalyzer: React.FC = observer(() => {
  const theme = useTheme();
  const { riskManagementStore, analyticsStore } = useStore();
  const [accountSize, setAccountSize] = React.useState(10000);
  const [riskPerTrade, setRiskPerTrade] = React.useState(1);
  const [entryPrice, setEntryPrice] = React.useState<number | ''>('');
  const [stopLoss, setStopLoss] = React.useState<number | ''>('');
  const [takeProfit, setTakeProfit] = React.useState<number | ''>('');

  // Calculate position size and risk metrics
  const calculations = React.useMemo(() => {
    if (!entryPrice || !stopLoss) return null;

    const riskAmount = (accountSize * riskPerTrade) / 100;
    const pips = Math.abs(Number(entryPrice) - Number(stopLoss));
    const positionSize = riskManagementStore.calculatePositionSize(
      accountSize,
      Number(entryPrice),
      Number(stopLoss),
      'EUR/USD'
    );

    const rewardRatio = takeProfit
      ? Math.abs(Number(takeProfit) - Number(entryPrice)) / pips
      : 0;

    return {
      riskAmount,
      pips,
      positionSize: positionSize.positionSize,
      rewardRatio,
      maxLoss: riskAmount,
      maxGain: takeProfit ? riskAmount * rewardRatio : 0,
    };
  }, [accountSize, riskPerTrade, entryPrice, stopLoss, takeProfit]);

  // Historical drawdown analysis
  const drawdownAnalysis = React.useMemo(() => {
    const trades = analyticsStore.trades;
    const drawdowns = trades.map((trade) => ({
      date: trade.exitTime,
      drawdown: trade.drawdown * 100,
    }));

    return drawdowns;
  }, [analyticsStore.trades]);

  // Correlation matrix data
  const correlationData = React.useMemo(() => {
    return riskManagementStore.getCorrelationMatrix();
  }, [riskManagementStore]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Risk Analysis
      </Typography>

      <Grid container spacing={3}>
        {/* Position Size Calculator */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Position Size Calculator
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Account Size"
                  type="number"
                  value={accountSize}
                  onChange={(e) => setAccountSize(Number(e.target.value))}
                  InputProps={{
                    startAdornment: '$',
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>Risk Per Trade (%)</Typography>
                <Slider
                  value={riskPerTrade}
                  onChange={(_, value) => setRiskPerTrade(value as number)}
                  min={0.1}
                  max={5}
                  step={0.1}
                  marks={[
                    { value: 0.1, label: '0.1%' },
                    { value: 1, label: '1%' },
                    { value: 2, label: '2%' },
                    { value: 5, label: '5%' },
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Entry Price"
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(Number(e.target.value))}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Stop Loss"
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Take Profit"
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(Number(e.target.value))}
                />
              </Grid>
            </Grid>

            {calculations && (
              <Box sx={{ mt: 2 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">
                    Recommended Position Size:{' '}
                    {calculations.positionSize.toFixed(2)} lots
                  </Typography>
                  <Typography variant="body2">
                    Risk Amount: {formatCurrency(calculations.riskAmount)}
                  </Typography>
                  {calculations.rewardRatio > 0 && (
                    <Typography variant="body2">
                      Risk/Reward Ratio: 1:{calculations.rewardRatio.toFixed(2)}
                    </Typography>
                  )}
                </Alert>

                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Maximum Loss</TableCell>
                        <TableCell align="right">
                          {formatCurrency(calculations.maxLoss)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Maximum Gain</TableCell>
                        <TableCell align="right">
                          {formatCurrency(calculations.maxGain)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Pips to Stop Loss</TableCell>
                        <TableCell align="right">
                          {calculations.pips.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Drawdown Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Drawdown Analysis
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={drawdownAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="drawdown"
                    fill={theme.palette.error.main}
                    name="Drawdown %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Correlation Matrix */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Correlation Matrix
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis
                    dataKey="x"
                    type="category"
                    name="Symbol 1"
                    allowDuplicatedCategory={false}
                  />
                  <YAxis
                    dataKey="y"
                    type="category"
                    name="Symbol 2"
                    allowDuplicatedCategory={false}
                  />
                  <ZAxis
                    dataKey="z"
                    type="number"
                    range={[50, 500]}
                    name="Correlation"
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value: any) =>
                      `Correlation: ${Number(value).toFixed(2)}`
                    }
                  />
                  <Scatter
                    data={correlationData}
                    fill={theme.palette.primary.main}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Risk Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Portfolio Risk Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Typography color="text.secondary" gutterBottom>
                  Value at Risk (95%)
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(riskManagementStore.valueAtRisk)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography color="text.secondary" gutterBottom>
                  Expected Shortfall
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(riskManagementStore.expectedShortfall)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography color="text.secondary" gutterBottom>
                  Portfolio Beta
                </Typography>
                <Typography variant="h6">
                  {riskManagementStore.portfolioBeta.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography color="text.secondary" gutterBottom>
                  Risk-Adjusted Return
                </Typography>
                <Typography variant="h6">
                  {formatPercentage(riskManagementStore.riskAdjustedReturn)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default RiskAnalyzer;
