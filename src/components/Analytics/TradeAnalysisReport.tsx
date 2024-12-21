import React from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  ScatterChart,
  Scatter,
} from 'recharts';
import { useStore } from '../../hooks/useStore';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { Strategy } from '../../types/trading';

interface TradeAnalysisReportProps {
  strategy: Strategy;
}

const TradeAnalysisReport: React.FC<TradeAnalysisReportProps> = ({ strategy }) => {
  const theme = useTheme();
  const { analyticsStore } = useStore();
  const [timeframe, setTimeframe] = React.useState('1M');

  // Get trade analysis data
  const {
    tradeMetrics,
    tradingPatterns,
    timeAnalysis,
    pairAnalysis,
    profitAnalysis,
    psychologyMetrics,
  } = React.useMemo(() => analyticsStore.getTradeAnalysis(strategy.id, timeframe), [
    strategy.id,
    timeframe,
    analyticsStore,
  ]);

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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Trade Analysis Report</Typography>
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
          </Box>
        </Grid>

        {/* Trade Metrics Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Trade Metrics Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Typography color="text.secondary" gutterBottom>
                  Total Trades
                </Typography>
                <Typography variant="h6">{tradeMetrics.totalTrades}</Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography color="text.secondary" gutterBottom>
                  Win Rate
                </Typography>
                <Typography variant="h6">
                  {formatPercentage(tradeMetrics.winRate)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography color="text.secondary" gutterBottom>
                  Average RRR
                </Typography>
                <Typography variant="h6">
                  {tradeMetrics.averageRRR.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography color="text.secondary" gutterBottom>
                  Profit Factor
                </Typography>
                <Typography variant="h6">
                  {tradeMetrics.profitFactor.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Trading Patterns */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Trading Patterns
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={tradingPatterns}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="pattern" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      formatPercentage(value),
                      'Success Rate',
                    ]}
                  />
                  <Bar
                    dataKey="successRate"
                    fill={theme.palette.primary.main}
                    name="Success Rate"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Time Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Time Analysis
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={timeAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPercentage(value)} />
                  <Line
                    type="monotone"
                    dataKey="winRate"
                    stroke={theme.palette.primary.main}
                    name="Win Rate"
                  />
                  <Line
                    type="monotone"
                    dataKey="profitability"
                    stroke={theme.palette.secondary.main}
                    name="Profitability"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Pair Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Currency Pair Analysis
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="trades"
                    name="Number of Trades"
                    type="number"
                  />
                  <YAxis
                    dataKey="profitability"
                    name="Profitability"
                    unit="%"
                  />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter
                    data={pairAnalysis}
                    fill={theme.palette.primary.main}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Profit Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Profit Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={profitAnalysis}
                    dataKey="value"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {profitAnalysis.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Psychology Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Trading Psychology Metrics
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell>Interpretation</TableCell>
                    <TableCell>Recommendation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {psychologyMetrics.map((metric) => (
                    <TableRow key={metric.name}>
                      <TableCell>{metric.name}</TableCell>
                      <TableCell align="right">
                        {typeof metric.value === 'number'
                          ? formatPercentage(metric.value)
                          : metric.value}
                      </TableCell>
                      <TableCell>{metric.interpretation}</TableCell>
                      <TableCell>{metric.recommendation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Trade Journal Analysis */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Trade Journal Analysis
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Pair</TableCell>
                    <TableCell align="right">Entry</TableCell>
                    <TableCell align="right">Exit</TableCell>
                    <TableCell align="right">Profit/Loss</TableCell>
                    <TableCell>Setup Quality</TableCell>
                    <TableCell>Emotional State</TableCell>
                    <TableCell>Lessons Learned</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tradeMetrics.recentTrades.map((trade) => (
                    <TableRow key={trade.id}>
                      <TableCell>
                        {new Date(trade.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{trade.pair}</TableCell>
                      <TableCell align="right">{trade.entry}</TableCell>
                      <TableCell align="right">{trade.exit}</TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color:
                            trade.profitLoss > 0
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                        }}
                      >
                        {formatCurrency(trade.profitLoss)}
                      </TableCell>
                      <TableCell>{trade.setupQuality}</TableCell>
                      <TableCell>{trade.emotionalState}</TableCell>
                      <TableCell>{trade.lessonsLearned}</TableCell>
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
};

export default TradeAnalysisReport;
