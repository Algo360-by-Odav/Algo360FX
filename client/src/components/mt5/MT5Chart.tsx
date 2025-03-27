import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ShowChart as LineChartIcon,
  CandlestickChart as CandlestickIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Brush,
  Legend,
  Bar,
  ComposedChart,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';

export interface MT5ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface MT5ChartProps {
  symbol: string;
  accountNumber: number | undefined;
  onClose: () => void;
}

const timeframes = [
  { value: 'M1', label: '1 Minute' },
  { value: 'M5', label: '5 Minutes' },
  { value: 'M15', label: '15 Minutes' },
  { value: 'M30', label: '30 Minutes' },
  { value: 'H1', label: '1 Hour' },
  { value: 'H4', label: '4 Hours' },
  { value: 'D1', label: 'Daily' },
  { value: 'W1', label: 'Weekly' },
  { value: 'MN1', label: 'Monthly' },
];

const MT5Chart: React.FC<MT5ChartProps> = observer(({ symbol, onClose }) => {
  const [timeframe, setTimeframe] = useState('M15');
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [chartData, setChartData] = useState<MT5ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChartData();
    const interval = setInterval(fetchChartData, 1000); // Update every second
    return () => clearInterval(interval);
  }, [symbol, timeframe]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      setError(null);
      // In a real implementation, this would fetch data from MT5
      // For now, we'll generate mock data
      const mockData = generateMockData();
      setChartData(mockData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = (): MT5ChartData[] => {
    const data: MT5ChartData[] = [];
    const now = Date.now();
    const interval = getIntervalInMs(timeframe);
    
    for (let i = 0; i < 100; i++) {
      const timestamp = now - (99 - i) * interval;
      const basePrice = 1.2500 + Math.sin(i * 0.1) * 0.0100;
      const range = 0.0020;
      
      const open = basePrice + (Math.random() - 0.5) * range;
      const close = basePrice + (Math.random() - 0.5) * range;
      const high = Math.max(open, close) + Math.random() * range * 0.5;
      const low = Math.min(open, close) - Math.random() * range * 0.5;
      const volume = Math.floor(Math.random() * 1000) + 500;

      data.push({ timestamp, open, high, low, close, volume });
    }

    return data;
  };

  const getIntervalInMs = (tf: string): number => {
    const intervals: { [key: string]: number } = {
      'M1': 60 * 1000,
      'M5': 5 * 60 * 1000,
      'M15': 15 * 60 * 1000,
      'M30': 30 * 60 * 1000,
      'H1': 60 * 60 * 1000,
      'H4': 4 * 60 * 60 * 1000,
      'D1': 24 * 60 * 60 * 1000,
      'W1': 7 * 24 * 60 * 60 * 1000,
      'MN1': 30 * 24 * 60 * 60 * 1000,
    };
    return intervals[tf] || intervals['M15'];
  };

  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    if (timeframe.startsWith('M')) {
      return date.toLocaleTimeString();
    }
    return date.toLocaleDateString();
  };

  const renderCandlestickChart = (data: MT5ChartData[]) => {
    return (
      <ComposedChart data={data}>
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatTimestamp}
          scale="time"
          type="number"
          domain={['auto', 'auto']}
        />
        <YAxis
          domain={['auto', 'auto']}
          tickFormatter={(value) => value.toFixed(5)}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <RechartsTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload as MT5ChartData;
              return (
                <Box sx={{ bgcolor: 'background.paper', p: 1, border: 1, borderColor: 'divider' }}>
                  <Typography variant="body2">
                    Time: {formatTimestamp(data.timestamp)}
                  </Typography>
                  <Typography variant="body2">
                    Open: {data.open.toFixed(5)}
                  </Typography>
                  <Typography variant="body2">
                    High: {data.high.toFixed(5)}
                  </Typography>
                  <Typography variant="body2">
                    Low: {data.low.toFixed(5)}
                  </Typography>
                  <Typography variant="body2">
                    Close: {data.close.toFixed(5)}
                  </Typography>
                  <Typography variant="body2">
                    Volume: {data.volume}
                  </Typography>
                </Box>
              );
            }
            return null;
          }}
        />
        <Legend />
        {/* Render high-low line */}
        <Bar
          name="High"
          dataKey="high"
          fill="#00C853"
          fillOpacity={0}
          stroke="#00C853"
          yAxisId={0}
        />
        <Bar
          name="Low"
          dataKey="low"
          fill="#FF5252"
          fillOpacity={0}
          stroke="#FF5252"
          yAxisId={0}
        />
        {/* Render open-close body */}
        <Bar
          name="Price"
          dataKey={(data: MT5ChartData) => Math.abs(data.close - data.open)}
          fill={(data: MT5ChartData) => data.close >= data.open ? '#00C853' : '#FF5252'}
          stroke="none"
          yAxisId={0}
          stackId="candlestick"
          baseValue={(data: MT5ChartData) => Math.min(data.open, data.close)}
        />
        <Brush
          dataKey="timestamp"
          height={30}
          stroke="#8884d8"
          tickFormatter={formatTimestamp}
        />
      </ComposedChart>
    );
  };

  return (
    <Paper 
      sx={{ p: 3, height: '100%' }} 
      elevation={0}
      component="div"
      role="dialog"
      aria-modal="true"
    >
      <Box 
        sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }} 
        id="chart-dialog-title"
        component="header"
      >
        <Typography variant="h6" component="h2">
          {symbol} Chart
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }} component="div">
          <FormControl size="small">
            <InputLabel id="timeframe-select-label">Timeframe</InputLabel>
            <Select
              labelId="timeframe-select-label"
              id="timeframe-select"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              label="Timeframe"
              sx={{ minWidth: 120 }}
              MenuProps={{
                disablePortal: true,
                disableScrollLock: true
              }}
            >
              {timeframes.map((tf) => (
                <MenuItem key={tf.value} value={tf.value}>
                  {tf.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(_event, value) => value && setChartType(value)}
            size="small"
            aria-label="chart type"
          >
            <ToggleButton 
              value="candlestick" 
              aria-label="candlestick chart"
              tabIndex={0}
            >
              <Tooltip title="Candlestick" PopperProps={{ disablePortal: true }}>
                <CandlestickIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton 
              value="line" 
              aria-label="line chart"
              tabIndex={0}
            >
              <Tooltip title="Line" PopperProps={{ disablePortal: true }}>
                <LineChartIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
          <Tooltip title="Refresh" PopperProps={{ disablePortal: true }}>
            <IconButton 
              onClick={fetchChartData} 
              size="small" 
              aria-label="refresh chart"
              tabIndex={0}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Close" PopperProps={{ disablePortal: true }}>
            <IconButton 
              onClick={onClose} 
              size="small" 
              aria-label="close chart"
              edge="end"
              tabIndex={0}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading && !chartData.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 'calc(100% - 48px)' }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'candlestick' ? (
              renderCandlestickChart(chartData)
            ) : (
              <AreaChart data={chartData}>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTimestamp}
                  scale="time"
                  type="number"
                  domain={['auto', 'auto']}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => value.toFixed(5)}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as MT5ChartData;
                      return (
                        <Box sx={{ bgcolor: 'background.paper', p: 1, border: 1, borderColor: 'divider' }}>
                          <Typography variant="body2">
                            Time: {formatTimestamp(data.timestamp)}
                          </Typography>
                          <Typography variant="body2">
                            Price: {data.close.toFixed(5)}
                          </Typography>
                          <Typography variant="body2">
                            Volume: {data.volume}
                          </Typography>
                        </Box>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
                <Brush
                  dataKey="timestamp"
                  height={30}
                  stroke="#8884d8"
                  tickFormatter={formatTimestamp}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
});

export default MT5Chart;

