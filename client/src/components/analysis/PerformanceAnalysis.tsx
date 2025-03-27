import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  FormControlLabel,
  Skeleton,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Legend,
  TimeScale,
  TimeSeriesScale,
  Tooltip as ChartTooltip,
  ChartOptions,
  ScriptableContext,
} from 'chart.js';
import type { ChartData, ChartDataset } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chartjs-adapter-date-fns';
import { Line, Bar } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import { usePerformanceData } from '../../hooks/usePerformanceData';
import { format } from 'date-fns';
import { CHART_COLORS, CHART_OPTIONS, TIMEFRAMES, type TimeFrame } from '../../config';
import {
  calculateMonthlyReturns,
  calculateProfitDistribution,
  calculateCorrelation,
  calculateComparison,
  findSignificantEvents,
  calculateRiskMetrics,
  analyzeTradeTimingByHour,
} from '../../utils/chartCalculations';
import { ChartSkeleton } from './ChartSkeleton';
import { StatsSkeleton } from './StatsSkeleton';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  TimeScale,
  TimeSeriesScale,
  zoomPlugin,
  annotationPlugin
);

interface ChartDataPoint {
  x: string | Date;
  y: number;
}

interface PerformanceDataPoint {
  date: string;
  balance: number;
  drawdown: number;
}

interface Trade {
  id: string;
  date: string;
  pair: string;
  type: 'Buy' | 'Sell';
  entry: number;
  exit: number;
  profit: number;
  pips: number;
}

interface PerformanceData {
  performance: PerformanceDataPoint[];
  trades: Trade[];
}

const PerformanceAnalysis: React.FC = () => {
  const { portfolioId } = useParams<{ portfolioId: string }>();
  const [timeframe, setTimeframe] = useState<TimeFrame>('1D');
  const [chartType, setChartType] = useState<string>('equity');
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [comparisonPeriod, setComparisonPeriod] = useState('1M');
  const chartRef = useRef<ChartJS>(null);

  const { data, loading, error, refetch } = usePerformanceData(portfolioId || '', timeframe);

  // Calculate performance metrics
  const totalReturn = data ? ((data.performance[data.performance.length - 1]?.balance || 0) / data.performance[0]?.balance - 1) * 100 : 0;
  const winRate = data ? data.trades.filter(t => t.profit > 0).length / data.trades.length : 0;
  const maxDrawdown = data ? Math.abs(Math.min(...data.performance.map(p => p.drawdown))) : 0;

  const getChartData = (): ChartData<'bar' | 'line', ChartDataPoint[]> => {
    if (!data) return { datasets: [] };

    switch (chartType) {
      case 'equity':
        return {
          labels: data.performance.map(p => p.date),
          datasets: [{
            label: 'Balance',
            data: data.performance.map(p => ({ x: p.date, y: p.balance })),
            borderColor: CHART_COLORS.primary,
            backgroundColor: CHART_COLORS.primary,
            borderWidth: 2,
            fill: false,
          }]
        };
      case 'returns':
        return calculateMonthlyReturns(data.performance);
      case 'profit-dist':
        return calculateProfitDistribution(data.trades);
      case 'correlation':
        return calculateCorrelation(data.trades);
      case 'comparison':
        return calculateComparison(data.performance, comparisonPeriod);
      case 'trade-timing':
        return analyzeTradeTimingByHour(data.trades);
      default:
        return { datasets: [] };
    }
  };

  const getChartOptions = (): ChartOptions<'bar' | 'line'> => {
    const baseOptions = CHART_OPTIONS;
    
    if (chartType === 'equity' && showAnnotations) {
      return {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          annotation: {
            annotations: findSignificantEvents(data?.performance || [])
          }
        }
      };
    }

    return baseOptions;
  };

  return (
    <Container maxWidth={false}>
      {/* Header with loading state */}
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" gutterBottom>
          {loading ? (
            <Skeleton width={300} height={40} />
          ) : (
            'Portfolio Performance Analysis'
          )}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {loading ? (
            <Skeleton width={400} height={24} />
          ) : (
            'Analyze your portfolio performance with advanced metrics and visualizations'
          )}
        </Typography>
      </Box>

      {/* Stats with loading state */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Balance
              </Typography>
              <Typography variant="h6">
                ${data?.performance[data.performance.length - 1]?.balance.toLocaleString() ?? '0'}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Total Return
              </Typography>
              <Typography variant="h6" color={totalReturn >= 0 ? 'success.main' : 'error.main'}>
                {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Win Rate
              </Typography>
              <Typography variant="h6">
                {(winRate * 100).toFixed(1)}%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Max Drawdown
              </Typography>
              <Typography variant="h6" color="error.main">
                {(maxDrawdown * 100).toFixed(2)}%
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Controls with loading state */}
      <Box sx={{ mb: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
            <Skeleton variant="rectangular" width={40} height={40} sx={{ borderRadius: 1 }} />
          </Box>
        ) : (
          <>
            <FormControl sx={{ minWidth: 120, mr: 2 }}>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={timeframe}
                label="Timeframe"
                onChange={(e) => setTimeframe(e.target.value as TimeFrame)}
              >
                {Object.entries(TIMEFRAMES).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <ToggleButtonGroup
              value={chartType}
              exclusive
              onChange={(_e, value) => value && setChartType(value)}
              aria-label="chart type"
            >
              <ToggleButton value="equity">Equity Curve</ToggleButton>
              <ToggleButton value="drawdown">Drawdown</ToggleButton>
              <ToggleButton value="returns">Monthly Returns</ToggleButton>
              <ToggleButton value="profit-dist">Profit Distribution</ToggleButton>
              <ToggleButton value="correlation">Pair Analysis</ToggleButton>
              <ToggleButton value="comparison">Period Comparison</ToggleButton>
              <ToggleButton value="distribution">Trade Distribution</ToggleButton>
              <ToggleButton value="risk-metrics">Risk Metrics</ToggleButton>
              <ToggleButton value="trade-timing">Trade Timing</ToggleButton>
            </ToggleButtonGroup>
          </>
        )}
      </Box>

      {/* Comparison period selection with loading state */}
      {chartType === 'comparison' && (
        <Box sx={{ mb: 3 }}>
          {loading ? (
            <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
          ) : (
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Compare With</InputLabel>
              <Select
                value={comparisonPeriod}
                label="Compare With"
                onChange={(e) => setComparisonPeriod(e.target.value)}
              >
                <MenuItem value="1M">Previous Month</MenuItem>
                <MenuItem value="3M">Previous 3 Months</MenuItem>
                <MenuItem value="6M">Previous 6 Months</MenuItem>
                <MenuItem value="1Y">Previous Year</MenuItem>
              </Select>
            </FormControl>
          )}
        </Box>
      )}

      {/* Annotations toggle with loading state */}
      {chartType === 'equity' && (
        <Box sx={{ mb: 3 }}>
          {loading ? (
            <Skeleton variant="rectangular" width={200} height={40} sx={{ borderRadius: 1 }} />
          ) : (
            <FormControlLabel
              control={
                <Switch
                  checked={showAnnotations}
                  onChange={(e) => setShowAnnotations(e.target.checked)}
                />
              }
              label="Show Significant Events"
            />
          )}
        </Box>
      )}

      {/* Main chart with loading state */}
      <Paper sx={{ p: 3, mb: 3 }}>
        {loading ? (
          <ChartSkeleton height={400} />
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error" gutterBottom>
              {error instanceof Error ? error.message : 'Failed to load chart data'}
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => refetch()}
              startIcon={<RefreshIcon />}
            >
              Retry
            </Button>
          </Box>
        ) : (
          <Box sx={{ height: 400 }}>
            {chartType === 'returns' || chartType === 'distribution' || chartType === 'profit-dist' || chartType === 'correlation' || chartType === 'trade-timing' ? (
              <Bar
                data={getChartData()}
                options={getChartOptions()}
              />
            ) : (
              <Line
                data={getChartData()}
                options={getChartOptions()}
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Secondary charts with loading state */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            {loading ? (
              <ChartSkeleton height={250} />
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Drawdown
                </Typography>
                <Box sx={{ height: '250px' }}>
                  <Line options={getChartOptions()} data={getChartData()} />
                </Box>
              </>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            {loading ? (
              <ChartSkeleton height={250} />
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Trade Distribution
                </Typography>
                <Box sx={{ height: '250px' }}>
                  <Bar options={getChartOptions()} data={getChartData()} />
                </Box>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PerformanceAnalysis;
