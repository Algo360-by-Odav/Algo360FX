import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  CircularProgress,
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
} from 'recharts';
import { observer } from 'mobx-react-lite';
import { useRootStoreContext } from '../../stores/RootStoreContext';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { PerformanceMetrics, TimeFrame } from '../../types/trading';

interface PerformanceMetrics {
  totalPnL: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

interface EquityCurvePoint {
  timestamp: string;
  value: number;
}

const MetricCard: React.FC<{
  title: string;
  value: string;
  description?: string;
}> = ({ title, value, description }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="subtitle2" color="textSecondary">
        {title}
      </Typography>
      <Typography variant="h4" component="div" sx={{ my: 1 }}>
        {value}
      </Typography>
      {description && (
        <Typography variant="body2" color="textSecondary">
          {description}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const PerformanceAnalyticsWidget: React.FC = observer(() => {
  const theme = useTheme();
  const { analyticsStore } = useRootStoreContext();
  const [timeframe, setTimeframe] = useState<TimeFrame>('MONTH');
  const [isLoading, setIsLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceMetrics>({
    totalPnL: 0,
    winRate: 0,
    profitFactor: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
  });
  const [equityCurve, setEquityCurve] = useState<EquityCurvePoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await analyticsStore.calculatePerformanceMetrics(timeframe);
        const equityCurveData = analyticsStore.getEquityCurve(timeframe);
        
        setPerformanceData(data);
        setEquityCurve(equityCurveData.map(point => ({
          timestamp: point.timestamp,
          value: point.equity
        })));
      } catch (error) {
        console.error('Error fetching performance metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [analyticsStore, timeframe]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Performance Analytics</Typography>
        <FormControl variant="outlined" size="small">
          <InputLabel>Timeframe</InputLabel>
          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as TimeFrame)}
            label="Timeframe"
          >
            <MenuItem value="DAY">1 Day</MenuItem>
            <MenuItem value="WEEK">1 Week</MenuItem>
            <MenuItem value="MONTH">1 Month</MenuItem>
            <MenuItem value="YEAR">1 Year</MenuItem>
            <MenuItem value="ALL">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total P&L"
            value={formatCurrency(performanceData.totalPnL)}
            description="Net profit/loss"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Win Rate"
            value={formatPercentage(performanceData.winRate)}
            description="Percentage of winning trades"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Profit Factor"
            value={performanceData.profitFactor.toFixed(2)}
            description="Gross profit / Gross loss"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Max Drawdown"
            value={formatPercentage(performanceData.maxDrawdown)}
            description="Largest peak-to-trough decline"
          />
        </Grid>
      </Grid>

      {/* Equity Curve */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Equity Curve
          </Typography>
          <Box sx={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={equityCurve}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(timestamp: string) => new Date(timestamp).toLocaleString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={theme.palette.primary.main}
                  dot={false}
                  name="Equity"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
});

export default PerformanceAnalyticsWidget;
