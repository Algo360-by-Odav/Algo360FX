import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useStore } from '../../hooks/useStore';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Strategy } from '../../types/trading';

interface StrategyReportProps {
  strategy: Strategy;
}

const StrategyReport: React.FC<StrategyReportProps> = ({ strategy }) => {
  const theme = useTheme();
  const { analyticsStore } = useStore();
  const [timeframe, setTimeframe] = React.useState('1M');

  // Get report data
  const {
    performanceMetrics,
    tradeStatistics,
    monthlyReturns,
    drawdownPeriods,
    profitDistribution,
    riskMetrics,
  } = React.useMemo(() => analyticsStore.getStrategyReport(strategy.id, timeframe), [
    strategy.id,
    timeframe,
    analyticsStore,
  ]);

  const handleExportReport = () => {
    analyticsStore.exportStrategyReport(strategy.id, timeframe);
  };

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Report Header */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Strategy Performance Report</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Time Period</InputLabel>
                <Select
                  value={timeframe}
                  label="Time Period"
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <MenuItem value="1M">1 Month</MenuItem>
                  <MenuItem value="3M">3 Months</MenuItem>
                  <MenuItem value="6M">6 Months</MenuItem>
                  <MenuItem value="1Y">1 Year</MenuItem>
                  <MenuItem value="YTD">Year to Date</MenuItem>
                </Select>
              </FormControl>
              <Button variant="contained" onClick={handleExportReport}>
                Export Report
              </Button>
            </Box>
          </Box>
        </Grid>

        {/* Strategy Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Strategy Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Typography color="text.secondary" gutterBottom>
                  Net Profit
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(performanceMetrics.netProfit)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography color="text.secondary" gutterBottom>
                  Return
                </Typography>
                <Typography variant="h6">
                  {formatPercentage(performanceMetrics.return)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography color="text.secondary" gutterBottom>
                  Sharpe Ratio
                </Typography>
                <Typography variant="h6">
                  {performanceMetrics.sharpeRatio.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography color="text.secondary" gutterBottom>
                  Max Drawdown
                </Typography>
                <Typography variant="h6" color="error">
                  {formatPercentage(performanceMetrics.maxDrawdown)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Equity Curve */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Equity Curve
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={performanceMetrics.equityCurve}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Line
                    type="monotone"
                    dataKey="equity"
                    stroke={theme.palette.primary.main}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Monthly Returns */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Monthly Returns
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={monthlyReturns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPercentage(value)} />
                  <Bar
                    dataKey="return"
                    fill={theme.palette.primary.main}
                    name="Return"
                  >
                    {monthlyReturns.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.return >= 0 ? theme.palette.success.main : theme.palette.error.main}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Trade Statistics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Trade Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="text.secondary" gutterBottom>
                  Total Trades
                </Typography>
                <Typography variant="h6">
                  {tradeStatistics.totalTrades}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" gutterBottom>
                  Win Rate
                </Typography>
                <Typography variant="h6">
                  {formatPercentage(tradeStatistics.winRate)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" gutterBottom>
                  Average Win
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(tradeStatistics.averageWin)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" gutterBottom>
                  Average Loss
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(tradeStatistics.averageLoss)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" gutterBottom>
                  Profit Factor
                </Typography>
                <Typography variant="h6">
                  {tradeStatistics.profitFactor.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" gutterBottom>
                  Recovery Factor
                </Typography>
                <Typography variant="h6">
                  {tradeStatistics.recoveryFactor.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Risk Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Risk Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="text.secondary" gutterBottom>
                  Value at Risk (95%)
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(riskMetrics.valueAtRisk)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" gutterBottom>
                  Expected Shortfall
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(riskMetrics.expectedShortfall)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" gutterBottom>
                  Sortino Ratio
                </Typography>
                <Typography variant="h6">
                  {riskMetrics.sortinoRatio.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" gutterBottom>
                  Calmar Ratio
                </Typography>
                <Typography variant="h6">
                  {riskMetrics.calmarRatio.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Drawdown Periods */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Drawdown Periods
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell align="right">Drawdown</TableCell>
                    <TableCell align="right">Duration (Days)</TableCell>
                    <TableCell align="right">Recovery Time (Days)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drawdownPeriods.map((period, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(period.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(period.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        {formatPercentage(period.drawdown)}
                      </TableCell>
                      <TableCell align="right">{period.duration}</TableCell>
                      <TableCell align="right">{period.recoveryTime}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Profit Distribution */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Profit Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={profitDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="frequency"
                    fill={theme.palette.primary.main}
                    name="Frequency"
                  >
                    {profitDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.range.includes('-') ? theme.palette.error.main : theme.palette.success.main}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StrategyReport;
