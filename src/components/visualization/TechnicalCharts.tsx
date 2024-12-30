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
  Switch,
  FormControlLabel,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ReferenceArea,
  Brush,
  Legend,
} from 'recharts';
import {
  Settings as SettingsIcon,
  AddCircle as AddCircleIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';

interface CandlestickData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Indicator {
  id: string;
  type: 'SMA' | 'EMA' | 'MACD' | 'RSI' | 'BB' | 'Volume';
  params: {
    period?: number;
    shortPeriod?: number;
    longPeriod?: number;
    signalPeriod?: number;
    standardDeviations?: number;
  };
  visible: boolean;
  color?: string;
}

interface TechnicalChartsProps {
  data: CandlestickData[];
  title: string;
  height?: number;
  onIndicatorChange?: (indicators: Indicator[]) => void;
}

const defaultIndicators: Indicator[] = [
  { id: 'sma20', type: 'SMA', params: { period: 20 }, visible: true, color: '#2196f3' },
  { id: 'sma50', type: 'SMA', params: { period: 50 }, visible: true, color: '#4caf50' },
  { id: 'volume', type: 'Volume', params: {}, visible: true, color: '#9e9e9e' },
];

const TechnicalCharts: React.FC<TechnicalChartsProps> = ({
  data,
  title,
  height = 600,
  onIndicatorChange,
}) => {
  const theme = useTheme();
  const [indicators, setIndicators] = React.useState<Indicator[]>(defaultIndicators);
  const [showSettings, setShowSettings] = React.useState(false);

  // Calculate technical indicators
  const calculateSMA = (period: number) => {
    return data.map((_, index) => {
      if (index < period - 1) return null;
      const slice = data.slice(index - period + 1, index + 1);
      const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
      return sum / period;
    });
  };

  const calculateEMA = (period: number) => {
    const k = 2 / (period + 1);
    let ema = data[0].close;
    return data.map((candle) => {
      ema = candle.close * k + ema * (1 - k);
      return ema;
    });
  };

  const calculateBollingerBands = (period: number, standardDeviations: number) => {
    const sma = calculateSMA(period);
    return data.map((_, index) => {
      if (index < period - 1) return { upper: null, middle: null, lower: null };
      const slice = data.slice(index - period + 1, index + 1);
      const mean = sma[index];
      const squaredDiffs = slice.map(d => Math.pow(d.close - mean!, 2));
      const stdDev = Math.sqrt(squaredDiffs.reduce((a, b) => a + b) / period);
      return {
        upper: mean! + standardDeviations * stdDev,
        middle: mean,
        lower: mean! - standardDeviations * stdDev,
      };
    });
  };

  const calculateMACD = (shortPeriod: number, longPeriod: number, signalPeriod: number) => {
    const shortEMA = calculateEMA(shortPeriod);
    const longEMA = calculateEMA(longPeriod);
    const macdLine = shortEMA.map((short, i) => short - longEMA[i]);
    const signalLine = macdLine.map((_, i) => {
      if (i < signalPeriod - 1) return null;
      const slice = macdLine.slice(i - signalPeriod + 1, i + 1);
      const sum = slice.reduce((a, b) => a + (b || 0), 0);
      return sum / signalPeriod;
    });
    return { macdLine, signalLine };
  };

  const calculateRSI = (period: number) => {
    let gains = 0;
    let losses = 0;
    const rsi = data.map((candle, i) => {
      if (i === 0) return null;
      const change = candle.close - data[i - 1].close;
      if (i <= period) {
        gains += Math.max(0, change);
        losses += Math.abs(Math.min(0, change));
        if (i < period) return null;
        return 100 - (100 / (1 + (gains / period) / (losses / period)));
      }
      gains = ((period - 1) * gains + Math.max(0, change)) / period;
      losses = ((period - 1) * losses + Math.abs(Math.min(0, change))) / period;
      return 100 - (100 / (1 + gains / losses));
    });
    return rsi;
  };

  const renderCandlesticks = () => {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(time) => format(time, 'HH:mm:ss')}
            minTickGap={30}
          />
          <YAxis yAxisId="price" domain={['auto', 'auto']} />
          <YAxis yAxisId="volume" orientation="right" />
          
          {/* Candlesticks */}
          <Bar
            dataKey="shadowH"
            yAxisId="price"
            fill="none"
            stroke={theme.palette.text.primary}
          />
          <Bar
            dataKey="shadowL"
            yAxisId="price"
            fill="none"
            stroke={theme.palette.text.primary}
          />
          <Bar
            dataKey="body"
            yAxisId="price"
            fill={(d) => (d.open > d.close ? theme.palette.error.main : theme.palette.success.main)}
          />

          {/* Technical Indicators */}
          {indicators.map((indicator) => {
            if (!indicator.visible) return null;

            switch (indicator.type) {
              case 'SMA':
                return (
                  <Line
                    key={indicator.id}
                    type="monotone"
                    data={calculateSMA(indicator.params.period!)}
                    stroke={indicator.color}
                    dot={false}
                    yAxisId="price"
                  />
                );
              case 'EMA':
                return (
                  <Line
                    key={indicator.id}
                    type="monotone"
                    data={calculateEMA(indicator.params.period!)}
                    stroke={indicator.color}
                    dot={false}
                    yAxisId="price"
                  />
                );
              case 'BB':
                const bb = calculateBollingerBands(
                  indicator.params.period!,
                  indicator.params.standardDeviations!
                );
                return (
                  <React.Fragment key={indicator.id}>
                    <Line
                      type="monotone"
                      data={bb.map((b) => b.upper)}
                      stroke={indicator.color}
                      dot={false}
                      yAxisId="price"
                    />
                    <Line
                      type="monotone"
                      data={bb.map((b) => b.middle)}
                      stroke={indicator.color}
                      dot={false}
                      yAxisId="price"
                      strokeDasharray="3 3"
                    />
                    <Line
                      type="monotone"
                      data={bb.map((b) => b.lower)}
                      stroke={indicator.color}
                      dot={false}
                      yAxisId="price"
                    />
                  </React.Fragment>
                );
              case 'Volume':
                return (
                  <Bar
                    key={indicator.id}
                    dataKey="volume"
                    yAxisId="volume"
                    fill={indicator.color}
                    opacity={0.5}
                  />
                );
              default:
                return null;
            }
          })}

          <Brush
            dataKey="timestamp"
            height={30}
            stroke={theme.palette.primary.main}
            tickFormatter={(time) => format(time, 'HH:mm:ss')}
          />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  const renderIndicatorSettings = () => {
    return (
      <Grid container spacing={2}>
        {indicators.map((indicator) => (
          <Grid item xs={12} key={indicator.id}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={indicator.visible}
                    onChange={(e) => {
                      const newIndicators = indicators.map((ind) =>
                        ind.id === indicator.id
                          ? { ...ind, visible: e.target.checked }
                          : ind
                      );
                      setIndicators(newIndicators);
                      onIndicatorChange?.(newIndicators);
                    }}
                  />
                }
                label={indicator.type}
              />
              {indicator.params.period && (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={indicator.params.period}
                    label="Period"
                    onChange={(e) => {
                      const newIndicators = indicators.map((ind) =>
                        ind.id === indicator.id
                          ? {
                              ...ind,
                              params: { ...ind.params, period: Number(e.target.value) },
                            }
                          : ind
                      );
                      setIndicators(newIndicators);
                      onIndicatorChange?.(newIndicators);
                    }}
                  >
                    {[5, 10, 20, 50, 100, 200].map((p) => (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <IconButton
                size="small"
                onClick={() => {
                  const newIndicators = indicators.filter((ind) => ind.id !== indicator.id);
                  setIndicators(newIndicators);
                  onIndicatorChange?.(newIndicators);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">{title}</Typography>
            <Box>
              <IconButton onClick={() => setShowSettings(!showSettings)}>
                <SettingsIcon />
              </IconButton>
              <IconButton
                onClick={() => {
                  const newIndicator: Indicator = {
                    id: `indicator_${indicators.length}`,
                    type: 'SMA',
                    params: { period: 20 },
                    visible: true,
                    color: theme.palette.primary.main,
                  };
                  const newIndicators = [...indicators, newIndicator];
                  setIndicators(newIndicators);
                  onIndicatorChange?.(newIndicators);
                }}
              >
                <AddCircleIcon />
              </IconButton>
            </Box>
          </Box>
        </Grid>

        {showSettings && (
          <Grid item xs={12}>
            {renderIndicatorSettings()}
          </Grid>
        )}

        <Grid item xs={12}>
          {renderCandlesticks()}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default TechnicalCharts;
