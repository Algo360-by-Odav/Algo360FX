import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
  FormControl,
  useTheme,
  Grid,
  Typography,
  Tooltip,
  Button
} from '@mui/material';
import {
  ShowChart as ShowChartIcon,
  Candlestick as CandlestickIcon,
} from '@mui/icons-material';
import {
  AreaSeries,
  CandlestickSeries,
  ChartCanvas,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  OHLCTooltip,
  XAxis,
  YAxis,
  VolumeSeries,
  Grid as ChartGrid,
  discontinuousTimeScaleProviderBuilder,
  Chart,
} from 'react-financial-charts';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { useStore } from '../../hooks/useStore';
import { Candle, TimeFrame, ChartSettings } from '../../types/trading';
import IndicatorSelector from './chart/IndicatorSelector';
import ChartControls from './chart/ChartControls';

interface TradingChartProps {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
}

const TradingChart: React.FC<TradingChartProps> = observer(({
  symbol,
  onSymbolChange,
}) => {
  const theme = useTheme();
  const { marketStore } = useStore();
  const [chartType, setChartType] = React.useState<'candlestick' | 'line'>('candlestick');
  const [timeframe, setTimeframe] = React.useState<TimeFrame>('1H');
  const [data, setData] = React.useState<Candle[]>([]);
  const [dimensions, setDimensions] = React.useState({ width: 800, height: 400 });
  const [chartSettings, setChartSettings] = React.useState<ChartSettings>({
    showGrid: true,
    showVolume: true,
    showCrosshair: true,
    showLegend: true,
    theme: 'light',
    drawingMode: false,
  });
  const [indicatorDialogOpen, setIndicatorDialogOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Resize observer
  React.useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height: Math.max(height, 400) });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Add data decimation
  const decimate = (data: Candle[], threshold: number = 2000): Candle[] => {
    if (data.length <= threshold) return data;
    const factor = Math.ceil(data.length / threshold);
    return data.filter((_, index) => index % factor === 0);
  };

  // Fetch historical data with error handling and retries
  React.useEffect(() => {
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000;

    const fetchData = async () => {
      try {
        setError(null);
        const historicalData = await marketStore.fetchHistoricalData(
          symbol,
          timeframe,
          100
        );
        
        const processedData = historicalData.map(candle => ({
          ...candle,
          date: new Date(candle.timestamp * 1000),
        }));

        // Apply decimation for large datasets
        const decimatedData = decimate(processedData);
        setData(decimatedData);
      } catch (error) {
        console.error('Failed to fetch historical data:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(fetchData, retryDelay * retryCount);
        } else {
          setError('Failed to load chart data. Please try again later.');
        }
      }
    };

    fetchData();
    
    // Subscribe to real-time updates with error handling
    const handleUpdate = (newCandle: Candle) => {
      try {
        setData((prevData) => {
          const updatedCandle = {
            ...newCandle,
            date: new Date(newCandle.timestamp * 1000),
          };
          const lastCandle = prevData[prevData.length - 1];
          if (lastCandle && lastCandle.timestamp === newCandle.timestamp) {
            return [...prevData.slice(0, -1), updatedCandle];
          }
          const newData = [...prevData, updatedCandle];
          return decimate(newData);
        });
      } catch (error) {
        console.error('Error processing candle update:', error);
      }
    };

    const unsubscribe = marketStore.subscribeToCandles(
      symbol,
      timeframe,
      handleUpdate
    );

    return () => {
      unsubscribe();
      // Cleanup subscriptions
      if (marketStore.unsubscribeFromCandles) {
        marketStore.unsubscribeFromCandles(symbol, timeframe);
      }
    };
  }, [symbol, timeframe, marketStore]);

  // Error display
  if (error) {
    return (
      <Paper elevation={2}>
        <Box p={2} height={400} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <Typography color="error" gutterBottom>{error}</Typography>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      </Paper>
    );
  }

  const timeScaleProvider = React.useMemo(() => {
    const provider = discontinuousTimeScaleProviderBuilder()
      .inputDateAccessor((d: Candle) => d.date)
      .setLocale(navigator.language) // Set locale for proper date formatting
      .build();
    return provider(data);
  }, [data]);

  const { data: scaledData, xScale, xAccessor, displayXAccessor } = timeScaleProvider;

  const xExtents = React.useMemo(() => {
    return [
      xAccessor(scaledData[Math.max(0, scaledData.length - 100)]),
      xAccessor(scaledData[scaledData.length - 1]),
    ];
  }, [scaledData, xAccessor]);

  if (!data.length) {
    return (
      <Paper elevation={2}>
        <Box p={2} height={400} display="flex" alignItems="center" justifyContent="center">
          <Typography>Loading chart data...</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={2}>
      <Box p={2}>
        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid item xs>
            <Typography variant="h6">{symbol} - {timeframe}</Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={(_, value) => value && setChartType(value)}
                size="small"
              >
                <ToggleButton value="candlestick">
                  <Tooltip title="Candlestick">
                    <CandlestickIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="line">
                  <Tooltip title="Line">
                    <ShowChartIcon />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>

              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value as TimeFrame)}
                  variant="outlined"
                >
                  <MenuItem value="1M">1M</MenuItem>
                  <MenuItem value="5M">5M</MenuItem>
                  <MenuItem value="15M">15M</MenuItem>
                  <MenuItem value="1H">1H</MenuItem>
                  <MenuItem value="4H">4H</MenuItem>
                  <MenuItem value="1D">1D</MenuItem>
                </Select>
              </FormControl>

              <ChartControls
                settings={chartSettings}
                onSettingsChange={(newSettings) => {
                  setChartSettings((prev) => ({ ...prev, ...newSettings }));
                }}
                onIndicatorAdd={() => setIndicatorDialogOpen(true)}
                onClearDrawings={() => {
                  // Implement clear drawings logic
                  console.log('Clear drawings');
                }}
              />
            </Box>
          </Grid>
        </Grid>

        <div ref={containerRef} style={{ width: '100%', height: dimensions.height }}>
          <ChartCanvas
            ratio={1}
            width={dimensions.width}
            height={dimensions.height}
            margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
            seriesName={symbol}
            data={scaledData}
            xScale={xScale}
            xAccessor={xAccessor}
            displayXAccessor={displayXAccessor}
            xExtents={xExtents}
            zoomEvent={!chartSettings.drawingMode}
            panEvent={!chartSettings.drawingMode}
          >
            <Chart id={1} yExtents={d => [d.high, d.low]}>
              {chartSettings.showGrid && <ChartGrid />}
              
              {chartType === 'candlestick' ? (
                <CandlestickSeries />
              ) : (
                <AreaSeries
                  yAccessor={d => d.close}
                  fill={theme.palette.primary.main}
                  strokeWidth={2}
                  stroke={theme.palette.primary.main}
                />
              )}

              {chartSettings.showVolume && (
                <VolumeSeries
                  yAccessor={d => d.volume}
                  opacity={0.5}
                />
              )}

              <XAxis />
              <YAxis />

              {chartSettings.showCrosshair && (
                <>
                  <CrossHairCursor />
                  <MouseCoordinateX
                    at="bottom"
                    orient="bottom"
                    displayFormat={timeFormat("%Y-%m-%d %H:%M")}
                  />
                  <MouseCoordinateY
                    at="right"
                    orient="right"
                    displayFormat={format(".2f")}
                  />
                </>
              )}

              {chartSettings.showLegend && (
                <OHLCTooltip origin={[8, 16]} />
              )}
            </Chart>
          </ChartCanvas>
        </div>

        <IndicatorSelector
          open={indicatorDialogOpen}
          onClose={() => setIndicatorDialogOpen(false)}
          onAdd={(indicator) => {
            // Implement indicator addition logic
            console.log('Add indicator:', indicator);
            setIndicatorDialogOpen(false);
          }}
        />
      </Box>
    </Paper>
  );
});

export default TradingChart;
