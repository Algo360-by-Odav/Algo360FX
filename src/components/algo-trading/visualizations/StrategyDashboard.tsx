import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Brush,
} from 'recharts';
import TimelineIcon from '@mui/icons-material/Timeline';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import { TradingStrategy } from '../../../types/algo-trading';
import { BacktestResult } from '../../../types/backtest';
import { formatCurrency, formatPercentage, formatDate } from '../../../utils/formatters';
import HeatMap from './HeatMap';
import CandlestickChart from './CandlestickChart';
import VolumeProfile from './VolumeProfile';
import CorrelationMatrix from './CorrelationMatrix';

interface StrategyDashboardProps {
  strategy: TradingStrategy;
  backtestResult: BacktestResult;
  onShare?: () => void;
  onExport?: () => void;
}

const COLORS = ['#2196f3', '#4caf50', '#f44336', '#ff9800', '#9c27b0', '#00bcd4'];

const StrategyDashboard: React.FC<StrategyDashboardProps> = ({
  strategy,
  backtestResult,
  onShare,
  onExport,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeframe, setTimeframe] = useState('1D');
  const [selectedMetric, setSelectedMetric] = useState('equity');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const renderPerformanceMetrics = () => (
    <Grid container spacing={3}>
      {/* Key Performance Indicators */}
      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Net Profit
          </Typography>
          <Typography variant="h4" color={backtestResult.metrics.netProfit >= 0 ? 'success.main' : 'error.main'}>
            {formatCurrency(backtestResult.metrics.netProfit)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatPercentage(backtestResult.metrics.returnPercentage)} Return
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Win Rate
          </Typography>
          <Typography variant="h4">
            {formatPercentage(backtestResult.metrics.winRate)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {backtestResult.metrics.winningTrades} / {backtestResult.metrics.totalTrades} Trades
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Profit Factor
          </Typography>
          <Typography variant="h4">
            {backtestResult.metrics.profitFactor.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Risk/Reward Ratio
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={3}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Max Drawdown
          </Typography>
          <Typography variant="h4" color="error.main">
            {formatPercentage(backtestResult.metrics.maxDrawdown)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(backtestResult.metrics.maxDrawdownDate)}
          </Typography>
        </Paper>
      </Grid>

      {/* Equity Curve */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Equity Curve</Typography>
            <Box>
              <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
                <InputLabel>Timeframe</InputLabel>
                <Select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  label="Timeframe"
                >
                  <MenuItem value="1D">1 Day</MenuItem>
                  <MenuItem value="1W">1 Week</MenuItem>
                  <MenuItem value="1M">1 Month</MenuItem>
                  <MenuItem value="3M">3 Months</MenuItem>
                  <MenuItem value="1Y">1 Year</MenuItem>
                  <MenuItem value="ALL">All Time</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Metric</InputLabel>
                <Select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  label="Metric"
                >
                  <MenuItem value="equity">Equity</MenuItem>
                  <MenuItem value="drawdown">Drawdown</MenuItem>
                  <MenuItem value="underwater">Underwater</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer>
              <ComposedChart data={backtestResult.equityCurve}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="equity"
                  fill="#2196f3"
                  stroke="#2196f3"
                  fillOpacity={0.1}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="drawdown"
                  stroke="#f44336"
                  dot={false}
                />
                <Brush dataKey="date" height={30} stroke="#8884d8" />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderTradeAnalysis = () => (
    <Grid container spacing={3}>
      {/* Trade Distribution */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Trade Distribution
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={backtestResult.analysis.tradeDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#2196f3">
                  {backtestResult.analysis.tradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Win/Loss Distribution */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Win/Loss Distribution
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    {
                      name: 'Winning Trades',
                      value: backtestResult.metrics.winningTrades,
                    },
                    {
                      name: 'Losing Trades',
                      value: backtestResult.metrics.losingTrades,
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${formatPercentage(percent)}`}
                  outerRadius={80}
                  fill="#8884d8"
                >
                  <Cell fill="#4caf50" />
                  <Cell fill="#f44336" />
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Trade Duration Analysis */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Trade Duration Analysis
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="duration"
                  name="Duration"
                  unit="min"
                  type="number"
                />
                <YAxis
                  dataKey="profit"
                  name="Profit"
                  unit="$"
                />
                <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                <Legend />
                <Scatter
                  name="Trades"
                  data={backtestResult.trades.map((trade) => ({
                    duration: trade.duration,
                    profit: trade.profit,
                  }))}
                  fill="#2196f3"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Time Analysis */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Hourly Performance
          </Typography>
          <Box sx={{ height: 300 }}>
            <HeatMap
              data={backtestResult.analysis.timeAnalysis.hourly.map((hour) => ({
                hour: hour.hour,
                value: hour.profit,
                trades: hour.trades,
                winRate: hour.winRate,
              }))}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderMarketAnalysis = () => (
    <Grid container spacing={3}>
      {/* Price Action */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Price Action & Trade Entries
          </Typography>
          <Box sx={{ height: 500 }}>
            <CandlestickChart
              data={backtestResult.marketData}
              trades={backtestResult.trades}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Volume Profile */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Volume Profile
          </Typography>
          <Box sx={{ height: 400 }}>
            <VolumeProfile data={backtestResult.marketData} />
          </Box>
        </Paper>
      </Grid>

      {/* Market Regimes */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Market Regime Performance
          </Typography>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={backtestResult.analysis.marketRegimes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="regime" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="performance.return"
                  name="Return"
                  fill="#2196f3"
                />
                <Bar
                  yAxisId="right"
                  dataKey="performance.winRate"
                  name="Win Rate"
                  fill="#4caf50"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderRiskAnalysis = () => (
    <Grid container spacing={3}>
      {/* Risk Metrics */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Risk Metrics
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <ComposedChart data={[
                {
                  metric: 'Sharpe Ratio',
                  value: backtestResult.metrics.sharpeRatio,
                  baseline: 1.0
                },
                {
                  metric: 'Win Rate',
                  value: backtestResult.metrics.winRate * 100,
                  baseline: 50
                },
                {
                  metric: 'Profit Factor',
                  value: backtestResult.metrics.profitFactor,
                  baseline: 1.5
                },
                {
                  metric: 'Recovery Factor',
                  value: backtestResult.metrics.recoveryFactor,
                  baseline: 1.0
                },
                {
                  metric: 'Risk/Reward',
                  value: backtestResult.metrics.payoffRatio,
                  baseline: 1.5
                }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="metric" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="value" fill="#4CAF50" name="Strategy" />
                <Line type="monotone" dataKey="baseline" stroke="#FF9800" name="Baseline" />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Correlation Matrix */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Strategy Correlation
          </Typography>
          <Box sx={{ height: 300 }}>
            <CorrelationMatrix
              data={backtestResult.analysis.correlationMatrix}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Drawdown Analysis */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Drawdown Analysis
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer>
              <ComposedChart data={backtestResult.analysis.drawdownPeriods}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RechartsTooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="drawdown"
                  fill="#f44336"
                  stroke="#f44336"
                  fillOpacity={0.1}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="recovery"
                  stroke="#4caf50"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5">{strategy.name} Analysis Dashboard</Typography>
        <Box>
          <IconButton onClick={onShare}>
            <ShareIcon />
          </IconButton>
          <IconButton onClick={onExport}>
            <DownloadIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab
            icon={<TimelineIcon />}
            label="Performance"
            iconPosition="start"
          />
          <Tab
            icon={<BarChartIcon />}
            label="Trade Analysis"
            iconPosition="start"
          />
          <Tab
            icon={<BubbleChartIcon />}
            label="Market Analysis"
            iconPosition="start"
          />
          <Tab
            icon={<PieChartIcon />}
            label="Risk Analysis"
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && renderPerformanceMetrics()}
        {activeTab === 1 && renderTradeAnalysis()}
        {activeTab === 2 && renderMarketAnalysis()}
        {activeTab === 3 && renderRiskAnalysis()}
      </Box>
    </Box>
  );
};

export default StrategyDashboard;
