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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  ComposedChart,
  Area,
} from 'recharts';
import { useStore } from '../../hooks/useStore';
import { formatPercentage, formatCurrency } from '../../utils/formatters';

const PerformanceAttribution: React.FC = () => {
  const theme = useTheme();
  const { analyticsStore } = useStore();
  const [timeframe, setTimeframe] = React.useState('1M');

  // Get attribution data
  const {
    returnAttribution,
    riskAttribution,
    factorAnalysis,
    styleAnalysis,
    performanceMetrics,
  } = React.useMemo(() => analyticsStore.getAttributionData(timeframe), [
    analyticsStore,
    timeframe,
  ]);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Time Period Selection */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Performance Attribution</Typography>
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

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Performance Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="text.secondary" gutterBottom>
                  Total Return
                </Typography>
                <Typography variant="h6">
                  {formatPercentage(performanceMetrics.totalReturn)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" gutterBottom>
                  Active Return
                </Typography>
                <Typography variant="h6">
                  {formatPercentage(performanceMetrics.activeReturn)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" gutterBottom>
                  Information Ratio
                </Typography>
                <Typography variant="h6">
                  {performanceMetrics.informationRatio.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="text.secondary" gutterBottom>
                  Tracking Error
                </Typography>
                <Typography variant="h6">
                  {formatPercentage(performanceMetrics.trackingError)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Return Attribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Return Attribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <ComposedChart data={returnAttribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPercentage(value)} />
                  <Legend />
                  <Bar
                    dataKey="allocation"
                    name="Allocation Effect"
                    fill={theme.palette.primary.main}
                  />
                  <Bar
                    dataKey="selection"
                    name="Selection Effect"
                    fill={theme.palette.secondary.main}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    name="Total Effect"
                    stroke={theme.palette.error.main}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Risk Attribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Risk Attribution
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Factor</TableCell>
                    <TableCell align="right">Contribution</TableCell>
                    <TableCell align="right">% of Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {riskAttribution.map((item) => (
                    <TableRow key={item.factor}>
                      <TableCell>{item.factor}</TableCell>
                      <TableCell align="right">
                        {formatPercentage(item.contribution)}
                      </TableCell>
                      <TableCell align="right">
                        {formatPercentage(item.percentOfTotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Factor Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Factor Analysis
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={factorAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="factor" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPercentage(value)} />
                  <Legend />
                  <Bar
                    dataKey="exposure"
                    name="Factor Exposure"
                    fill={theme.palette.primary.main}
                  />
                  <Bar
                    dataKey="contribution"
                    name="Return Contribution"
                    fill={theme.palette.secondary.main}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Style Analysis */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Style Analysis
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <LineChart data={styleAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPercentage(value)} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="momentum"
                    name="Momentum"
                    stackId="1"
                    stroke={theme.palette.primary.main}
                    fill={theme.palette.primary.main}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Value"
                    stackId="1"
                    stroke={theme.palette.secondary.main}
                    fill={theme.palette.secondary.main}
                  />
                  <Area
                    type="monotone"
                    dataKey="quality"
                    name="Quality"
                    stackId="1"
                    stroke={theme.palette.error.main}
                    fill={theme.palette.error.main}
                  />
                  <Area
                    type="monotone"
                    dataKey="size"
                    name="Size"
                    stackId="1"
                    stroke={theme.palette.warning.main}
                    fill={theme.palette.warning.main}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Attribution Details */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Attribution Details
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell align="right">Portfolio Weight</TableCell>
                    <TableCell align="right">Portfolio Return</TableCell>
                    <TableCell align="right">Benchmark Weight</TableCell>
                    <TableCell align="right">Benchmark Return</TableCell>
                    <TableCell align="right">Allocation Effect</TableCell>
                    <TableCell align="right">Selection Effect</TableCell>
                    <TableCell align="right">Total Effect</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {returnAttribution.map((item) => (
                    <TableRow key={item.category}>
                      <TableCell>{item.category}</TableCell>
                      <TableCell align="right">
                        {formatPercentage(item.portfolioWeight)}
                      </TableCell>
                      <TableCell align="right">
                        {formatPercentage(item.portfolioReturn)}
                      </TableCell>
                      <TableCell align="right">
                        {formatPercentage(item.benchmarkWeight)}
                      </TableCell>
                      <TableCell align="right">
                        {formatPercentage(item.benchmarkReturn)}
                      </TableCell>
                      <TableCell align="right">
                        {formatPercentage(item.allocation)}
                      </TableCell>
                      <TableCell align="right">
                        {formatPercentage(item.selection)}
                      </TableCell>
                      <TableCell align="right">
                        {formatPercentage(item.total)}
                      </TableCell>
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

export default PerformanceAttribution;
