import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useStore } from '../../hooks/useStore';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const MetricCard: React.FC<{
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}> = ({ title, value, change, icon }) => {
  const theme = useTheme();
  
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" component="div">
              {value}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: change >= 0 ? theme.palette.success.main : theme.palette.error.main,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              {change >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              {formatPercentage(Math.abs(change))}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.palette.primary.main + '20',
              borderRadius: '50%',
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const PerformanceDashboard: React.FC = observer(() => {
  const theme = useTheme();
  const { analyticsStore } = useStore();
  const [selectedPeriod, setSelectedPeriod] = React.useState('1M');

  const equityData = React.useMemo(() => {
    return analyticsStore.getEquityCurve(selectedPeriod);
  }, [analyticsStore, selectedPeriod]);

  const winRateData = React.useMemo(() => {
    const { winRate, lossRate } = analyticsStore.getWinRate(selectedPeriod);
    return [
      { name: 'Wins', value: winRate },
      { name: 'Losses', value: lossRate },
    ];
  }, [analyticsStore, selectedPeriod]);

  const COLORS = [theme.palette.success.main, theme.palette.error.main];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Performance Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Metric Cards */}
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Total P&L"
            value={formatCurrency(analyticsStore.totalPnL)}
            change={analyticsStore.pnLChange}
            icon={<TimelineIcon />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Win Rate"
            value={formatPercentage(analyticsStore.winRate)}
            change={analyticsStore.winRateChange}
            icon={<AssessmentIcon />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Sharpe Ratio"
            value={analyticsStore.sharpeRatio.toFixed(2)}
            change={analyticsStore.sharpeRatioChange}
            icon={<TimelineIcon />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            title="Max Drawdown"
            value={formatPercentage(analyticsStore.maxDrawdown)}
            change={analyticsStore.drawdownChange}
            icon={<TrendingDownIcon />}
          />
        </Grid>

        {/* Equity Curve */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Equity Curve
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="colorPnL" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={theme.palette.primary.main}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={theme.palette.primary.main}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="equity"
                  stroke={theme.palette.primary.main}
                  fillOpacity={1}
                  fill="url(#colorPnL)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Win Rate Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Win/Loss Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={winRateData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {winRateData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Additional Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Advanced Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Typography color="text.secondary">Sortino Ratio</Typography>
                <Typography variant="h6">
                  {analyticsStore.sortinoRatio.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography color="text.secondary">Calmar Ratio</Typography>
                <Typography variant="h6">
                  {analyticsStore.calmarRatio.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography color="text.secondary">Profit Factor</Typography>
                <Typography variant="h6">
                  {analyticsStore.profitFactor.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography color="text.secondary">Recovery Factor</Typography>
                <Typography variant="h6">
                  {analyticsStore.recoveryFactor.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default PerformanceDashboard;
