import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useStores } from '../../stores/StoreProvider';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const ProviderAnalytics = observer(() => {
  const { signalProviderStore } = useStores();
  const [selectedProvider, setSelectedProvider] = useState(signalProviderStore.getProviders()[0]?.id);
  const [timeframe, setTimeframe] = useState('1M');

  const provider = signalProviderStore.getProviderById(selectedProvider);
  const signals = signalProviderStore.getSignalsByProvider(selectedProvider);

  // Sample performance data (replace with actual data from your store)
  const monthlyPerformance = [
    { month: 'Jan', return: 5.2, signals: 45, winRate: 68 },
    { month: 'Feb', return: 3.8, signals: 38, winRate: 71 },
    { month: 'Mar', return: 7.1, signals: 52, winRate: 75 },
    { month: 'Apr', return: 4.5, signals: 41, winRate: 70 },
    { month: 'May', return: 6.3, signals: 48, winRate: 73 },
    { month: 'Jun', return: 5.9, signals: 44, winRate: 72 },
  ];

  const pairDistribution = [
    { pair: 'EUR/USD', value: 35 },
    { pair: 'GBP/USD', value: 25 },
    { pair: 'USD/JPY', value: 20 },
    { pair: 'EUR/JPY', value: 15 },
    { pair: 'GBP/JPY', value: 5 },
  ];

  const riskMetrics = [
    { metric: 'Max Drawdown', value: -12.5, limit: -15 },
    { metric: 'Daily VaR (95%)', value: -2.1, limit: -3 },
    { metric: 'Sharpe Ratio', value: 2.1, limit: 1.5 },
    { metric: 'Sortino Ratio', value: 2.8, limit: 2 },
  ];

  return (
    <Box>
      {/* Controls */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Provider</InputLabel>
            <Select
              value={selectedProvider}
              label="Provider"
              onChange={(e) => setSelectedProvider(e.target.value)}
            >
              {signalProviderStore.getProviders().map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              label="Timeframe"
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <MenuItem value="1M">1 Month</MenuItem>
              <MenuItem value="3M">3 Months</MenuItem>
              <MenuItem value="6M">6 Months</MenuItem>
              <MenuItem value="1Y">1 Year</MenuItem>
              <MenuItem value="YTD">Year to Date</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Performance Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Performance Overview
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <LineChart
                  data={monthlyPerformance}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="return"
                    stroke="#8884d8"
                    name="Return %"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="winRate"
                    stroke="#82ca9d"
                    name="Win Rate %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Risk Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Risk Metrics
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell align="right">Value</TableCell>
                    <TableCell align="right">Limit</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {riskMetrics.map((metric) => (
                    <TableRow key={metric.metric}>
                      <TableCell>{metric.metric}</TableCell>
                      <TableCell align="right">{metric.value}</TableCell>
                      <TableCell align="right">{metric.limit}</TableCell>
                      <TableCell align="right">
                        <Typography
                          color={
                            metric.value > metric.limit ? 'success.main' : 'error.main'
                          }
                        >
                          {metric.value > metric.limit ? '✓' : '✗'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Pair Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Currency Pair Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pairDistribution}
                    dataKey="value"
                    nameKey="pair"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pairDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Monthly Statistics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Statistics
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Return %</TableCell>
                    <TableCell align="right">Signals</TableCell>
                    <TableCell align="right">Win Rate %</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {monthlyPerformance.map((month) => (
                    <TableRow key={month.month}>
                      <TableCell>{month.month}</TableCell>
                      <TableCell align="right">{month.return}%</TableCell>
                      <TableCell align="right">{month.signals}</TableCell>
                      <TableCell align="right">{month.winRate}%</TableCell>
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

