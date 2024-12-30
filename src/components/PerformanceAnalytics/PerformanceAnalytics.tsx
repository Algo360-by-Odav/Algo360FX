import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { performanceAnalytics, PerformanceMetrics } from '../../services/analytics/PerformanceAnalyticsService';
import './PerformanceAnalytics.css';

const timeRanges = [
  { label: 'Today', days: 1 },
  { label: 'Week', days: 7 },
  { label: 'Month', days: 30 },
  { label: '3 Months', days: 90 },
  { label: 'Year', days: 365 },
  { label: 'All Time', days: -1 }
];

const PerformanceAnalytics: React.FC = observer(() => {
  const theme = useTheme();
  const [selectedRange, setSelectedRange] = useState(30); // Default to 1 month
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [equityData, setEquityData] = useState<any[]>([]);

  useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    if (selectedRange > 0) {
      startDate.setDate(endDate.getDate() - selectedRange);
    } else {
      startDate.setFullYear(2000); // For "All Time" view
    }

    const calculatedMetrics = performanceAnalytics.calculateMetrics(startDate, endDate);
    setMetrics(calculatedMetrics);

    const equityCurve = performanceAnalytics.calculateEquityCurve(startDate, endDate);
    setEquityData(equityCurve.map(point => ({
      timestamp: new Date(point.timestamp).toLocaleDateString(),
      equity: point.equity,
      balance: point.balance,
      drawdown: point.drawdown
    })));
  }, [selectedRange]);

  const MetricCard: React.FC<{ title: string; value: string | number; color?: string }> = ({ title, value, color }) => (
    <Card className="metric-card">
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h6" style={{ color: color }}>
          {typeof value === 'number' ? value.toFixed(2) : value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box className="performance-analytics">
      <Box className="header">
        <Typography variant="h5">Performance Analytics</Typography>
        <FormControl variant="outlined" size="small">
          <InputLabel>Time Range</InputLabel>
          <Select
            value={selectedRange}
            onChange={(e) => setSelectedRange(Number(e.target.value))}
            label="Time Range"
          >
            {timeRanges.map(range => (
              <MenuItem key={range.days} value={range.days}>
                {range.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {metrics && (
        <>
          <Grid container spacing={2} className="metrics-grid">
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Total P&L"
                value={`$${metrics.totalPnL}`}
                color={metrics.totalPnL >= 0 ? theme.palette.success.main : theme.palette.error.main}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Win Rate"
                value={`${(metrics.winRate * 100).toFixed(1)}%`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Profit Factor"
                value={metrics.profitFactor}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Sharpe Ratio"
                value={metrics.sharpeRatio}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className="charts-grid">
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Equity Curve</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={equityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="equity"
                        stroke={theme.palette.primary.main}
                        name="Equity"
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="balance"
                        stroke={theme.palette.secondary.main}
                        name="Balance"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="drawdown"
                        stroke={theme.palette.error.main}
                        name="Drawdown %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Trade Distribution</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { type: 'Winning Trades', value: metrics.winRate * 100 },
                      { type: 'Losing Trades', value: (1 - metrics.winRate) * 100 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill={theme.palette.primary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Risk Metrics</Typography>
                  <Box className="risk-metrics">
                    <Typography>
                      Max Drawdown: {metrics.maxDrawdown.toFixed(2)}%
                    </Typography>
                    <Typography>
                      Risk/Reward Ratio: {metrics.riskRewardRatio.toFixed(2)}
                    </Typography>
                    <Typography>
                      Average Win: ${metrics.averageWin.toFixed(2)}
                    </Typography>
                    <Typography>
                      Average Loss: ${metrics.averageLoss.toFixed(2)}
                    </Typography>
                    <Typography>
                      Trades per Day: {metrics.tradesPerDay.toFixed(1)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
});

export default PerformanceAnalytics;
