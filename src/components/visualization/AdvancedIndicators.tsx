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
  TextField,
  Switch,
  FormControlLabel,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';

interface PriceData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface IndicatorConfig {
  enabled: boolean;
  params: {
    [key: string]: number;
  };
}

interface AdvancedIndicatorsProps {
  data: PriceData[];
  height?: number;
  onIndicatorChange?: (indicators: any) => void;
}

const AdvancedIndicators: React.FC<AdvancedIndicatorsProps> = ({
  data,
  height = 400,
  onIndicatorChange,
}) => {
  const theme = useTheme();
  const [indicators, setIndicators] = React.useState({
    ichimoku: {
      enabled: false,
      params: {
        conversionPeriod: 9,
        basePeriod: 26,
        spanPeriod: 52,
        displacement: 26,
      },
    },
    pivotPoints: {
      enabled: false,
      params: {
        type: 'standard', // standard, fibonacci, woodie, camarilla, demark
      },
    },
    vwap: {
      enabled: false,
      params: {
        period: 'day', // day, week, month
      },
    },
  });

  // Ichimoku Cloud calculations
  const calculateIchimoku = () => {
    const { conversionPeriod, basePeriod, spanPeriod, displacement } = indicators.ichimoku.params;

    const calculateMiddlePoint = (period: number, index: number) => {
      const slice = data.slice(Math.max(0, index - period + 1), index + 1);
      const high = Math.max(...slice.map(d => d.high));
      const low = Math.min(...slice.map(d => d.low));
      return (high + low) / 2;
    };

    return data.map((_, i) => {
      // Conversion Line (Tenkan-sen)
      const conversionLine = calculateMiddlePoint(conversionPeriod, i);

      // Base Line (Kijun-sen)
      const baseLine = calculateMiddlePoint(basePeriod, i);

      // Leading Span A (Senkou Span A)
      const leadingSpanA = (conversionLine + baseLine) / 2;

      // Leading Span B (Senkou Span B)
      const leadingSpanB = calculateMiddlePoint(spanPeriod, i);

      // Lagging Span (Chikou Span)
      const laggingSpan = i >= displacement ? data[i - displacement].close : null;

      return {
        conversionLine,
        baseLine,
        leadingSpanA,
        leadingSpanB,
        laggingSpan,
      };
    });
  };

  // Pivot Points calculations
  const calculatePivotPoints = () => {
    const calculateStandardPivots = (high: number, low: number, close: number) => {
      const pivot = (high + low + close) / 3;
      return {
        pivot,
        r1: 2 * pivot - low,
        r2: pivot + (high - low),
        r3: high + 2 * (pivot - low),
        s1: 2 * pivot - high,
        s2: pivot - (high - low),
        s3: low - 2 * (high - pivot),
      };
    };

    const calculateFibonacciPivots = (high: number, low: number, close: number) => {
      const pivot = (high + low + close) / 3;
      return {
        pivot,
        r1: pivot + 0.382 * (high - low),
        r2: pivot + 0.618 * (high - low),
        r3: pivot + (high - low),
        s1: pivot - 0.382 * (high - low),
        s2: pivot - 0.618 * (high - low),
        s3: pivot - (high - low),
      };
    };

    const calculateCamarillaPivots = (high: number, low: number, close: number) => {
      return {
        r1: close + ((high - low) * 1.1) / 12,
        r2: close + ((high - low) * 1.1) / 6,
        r3: close + ((high - low) * 1.1) / 4,
        r4: close + ((high - low) * 1.1) / 2,
        s1: close - ((high - low) * 1.1) / 12,
        s2: close - ((high - low) * 1.1) / 6,
        s3: close - ((high - low) * 1.1) / 4,
        s4: close - ((high - low) * 1.1) / 2,
      };
    };

    const pivots = [];
    let currentPeriodStart = 0;

    for (let i = 1; i < data.length; i++) {
      const current = data[i];
      const previous = data[i - 1];

      // Check if we're at a new period
      const isNewPeriod = format(current.timestamp, 'yyyy-MM-dd') !== 
                         format(previous.timestamp, 'yyyy-MM-dd');

      if (isNewPeriod) {
        // Calculate pivots for the previous period
        const periodData = data.slice(currentPeriodStart, i);
        const high = Math.max(...periodData.map(d => d.high));
        const low = Math.min(...periodData.map(d => d.low));
        const close = periodData[periodData.length - 1].close;

        let periodPivots;
        switch (indicators.pivotPoints.params.type) {
          case 'fibonacci':
            periodPivots = calculateFibonacciPivots(high, low, close);
            break;
          case 'camarilla':
            periodPivots = calculateCamarillaPivots(high, low, close);
            break;
          default:
            periodPivots = calculateStandardPivots(high, low, close);
        }

        pivots.push({
          startIndex: currentPeriodStart,
          endIndex: i - 1,
          ...periodPivots,
        });

        currentPeriodStart = i;
      }
    }

    return pivots;
  };

  // VWAP calculations
  const calculateVWAP = () => {
    let cumulativeTPV = 0; // Total Price * Volume
    let cumulativeVolume = 0;
    let periodStart = 0;
    const vwap = [];

    for (let i = 0; i < data.length; i++) {
      const current = data[i];
      const typicalPrice = (current.high + current.low + current.close) / 3;
      
      // Check for new period based on VWAP settings
      const isNewPeriod = i > 0 && (
        indicators.vwap.params.period === 'day'
          ? format(current.timestamp, 'yyyy-MM-dd') !== format(data[i - 1].timestamp, 'yyyy-MM-dd')
          : indicators.vwap.params.period === 'week'
          ? format(current.timestamp, 'yyyy-ww') !== format(data[i - 1].timestamp, 'yyyy-ww')
          : format(current.timestamp, 'yyyy-MM') !== format(data[i - 1].timestamp, 'yyyy-MM')
      );

      if (isNewPeriod) {
        // Reset cumulative values for new period
        cumulativeTPV = 0;
        cumulativeVolume = 0;
        periodStart = i;
      }

      cumulativeTPV += typicalPrice * current.volume;
      cumulativeVolume += current.volume;

      vwap.push({
        value: cumulativeTPV / cumulativeVolume,
        upperBand: (cumulativeTPV / cumulativeVolume) * 1.01, // 1% upper band
        lowerBand: (cumulativeTPV / cumulativeVolume) * 0.99, // 1% lower band
      });
    }

    return vwap;
  };

  const renderChart = () => {
    const chartData = data.map((d, i) => ({
      timestamp: d.timestamp,
      price: d.close,
      ...(indicators.ichimoku.enabled && calculateIchimoku()[i]),
      ...(indicators.vwap.enabled && { vwap: calculateVWAP()[i].value }),
    }));

    const pivots = indicators.pivotPoints.enabled ? calculatePivotPoints() : [];

    return (
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(time) => format(time, 'HH:mm:ss')}
          />
          <YAxis />
          <RechartsTooltip
            labelFormatter={(label) => format(label, 'PPpp')}
          />
          <Legend />

          {/* Price Line */}
          <Line
            type="monotone"
            dataKey="price"
            stroke={theme.palette.primary.main}
            dot={false}
          />

          {/* Ichimoku Cloud */}
          {indicators.ichimoku.enabled && (
            <>
              <Line
                type="monotone"
                dataKey="conversionLine"
                stroke={theme.palette.success.main}
                dot={false}
                name="Conversion Line"
              />
              <Line
                type="monotone"
                dataKey="baseLine"
                stroke={theme.palette.error.main}
                dot={false}
                name="Base Line"
              />
              <Area
                type="monotone"
                dataKey="leadingSpanA"
                stroke="none"
                fill={theme.palette.success.light}
                fillOpacity={0.3}
                name="Leading Span A"
              />
              <Area
                type="monotone"
                dataKey="leadingSpanB"
                stroke="none"
                fill={theme.palette.error.light}
                fillOpacity={0.3}
                name="Leading Span B"
              />
              <Line
                type="monotone"
                dataKey="laggingSpan"
                stroke={theme.palette.info.main}
                dot={false}
                name="Lagging Span"
              />
            </>
          )}

          {/* VWAP */}
          {indicators.vwap.enabled && (
            <Line
              type="monotone"
              dataKey="vwap"
              stroke={theme.palette.secondary.main}
              dot={false}
              name="VWAP"
            />
          )}

          {/* Pivot Points */}
          {indicators.pivotPoints.enabled &&
            pivots.map((pivot, i) => (
              <React.Fragment key={i}>
                <ReferenceLine
                  y={pivot.pivot}
                  stroke={theme.palette.grey[500]}
                  strokeDasharray="3 3"
                  label="P"
                />
                <ReferenceLine
                  y={pivot.r1}
                  stroke={theme.palette.success.light}
                  strokeDasharray="3 3"
                  label="R1"
                />
                <ReferenceLine
                  y={pivot.r2}
                  stroke={theme.palette.success.main}
                  strokeDasharray="3 3"
                  label="R2"
                />
                <ReferenceLine
                  y={pivot.s1}
                  stroke={theme.palette.error.light}
                  strokeDasharray="3 3"
                  label="S1"
                />
                <ReferenceLine
                  y={pivot.s2}
                  stroke={theme.palette.error.main}
                  strokeDasharray="3 3"
                  label="S2"
                />
              </React.Fragment>
            ))}
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Advanced Indicators</Typography>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={indicators.ichimoku.enabled}
                    onChange={(e) =>
                      setIndicators({
                        ...indicators,
                        ichimoku: {
                          ...indicators.ichimoku,
                          enabled: e.target.checked,
                        },
                      })
                    }
                  />
                }
                label="Ichimoku"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={indicators.pivotPoints.enabled}
                    onChange={(e) =>
                      setIndicators({
                        ...indicators,
                        pivotPoints: {
                          ...indicators.pivotPoints,
                          enabled: e.target.checked,
                        },
                      })
                    }
                  />
                }
                label="Pivot Points"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={indicators.vwap.enabled}
                    onChange={(e) =>
                      setIndicators({
                        ...indicators,
                        vwap: {
                          ...indicators.vwap,
                          enabled: e.target.checked,
                        },
                      })
                    }
                  />
                }
                label="VWAP"
              />
            </Box>
          </Box>
        </Grid>

        {/* Indicator Settings */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {indicators.ichimoku.enabled && (
              <>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Conversion Period"
                    value={indicators.ichimoku.params.conversionPeriod}
                    onChange={(e) =>
                      setIndicators({
                        ...indicators,
                        ichimoku: {
                          ...indicators.ichimoku,
                          params: {
                            ...indicators.ichimoku.params,
                            conversionPeriod: Number(e.target.value),
                          },
                        },
                      })
                    }
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Base Period"
                    value={indicators.ichimoku.params.basePeriod}
                    onChange={(e) =>
                      setIndicators({
                        ...indicators,
                        ichimoku: {
                          ...indicators.ichimoku,
                          params: {
                            ...indicators.ichimoku.params,
                            basePeriod: Number(e.target.value),
                          },
                        },
                      })
                    }
                  />
                </Grid>
              </>
            )}

            {indicators.pivotPoints.enabled && (
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Pivot Type</InputLabel>
                  <Select
                    value={indicators.pivotPoints.params.type}
                    label="Pivot Type"
                    onChange={(e) =>
                      setIndicators({
                        ...indicators,
                        pivotPoints: {
                          ...indicators.pivotPoints,
                          params: {
                            type: e.target.value,
                          },
                        },
                      })
                    }
                  >
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="fibonacci">Fibonacci</MenuItem>
                    <MenuItem value="camarilla">Camarilla</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {indicators.vwap.enabled && (
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>VWAP Period</InputLabel>
                  <Select
                    value={indicators.vwap.params.period}
                    label="VWAP Period"
                    onChange={(e) =>
                      setIndicators({
                        ...indicators,
                        vwap: {
                          ...indicators.vwap,
                          params: {
                            period: e.target.value,
                          },
                        },
                      })
                    }
                  >
                    <MenuItem value="day">Daily</MenuItem>
                    <MenuItem value="week">Weekly</MenuItem>
                    <MenuItem value="month">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Chart */}
        <Grid item xs={12}>
          {renderChart()}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AdvancedIndicators;
