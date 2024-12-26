import React, { useState, useEffect, useRef } from 'react';
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
  Button,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useMediaQuery
} from '@mui/material';
import {
  ShowChart as ShowChartIcon,
  BarChart as CandlestickIcon,
  Timeline as TimelineIcon,
  Compare as CompareIcon,
  Draw as DrawIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  Save as SaveIcon,
  Folder as FolderIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { createChart, IChartApi, CrosshairMode, ISeriesApi, Time } from 'lightweight-charts';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import { useRootStore } from '@/stores/RootStoreContext';
import { Candle, TimeFrame, ChartSettings } from '@/types/trading';
import IndicatorSelector from './chart/IndicatorSelector';
import ChartControls from './chart/ChartControls';
import { ChartAnalysisService, Pattern } from '@/services/ChartAnalysisService';
import { scaleTime, scaleLinear } from 'd3-scale';

interface TradingChartProps {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
}

const TradingChart: React.FC<TradingChartProps> = observer(({
  symbol,
  onSymbolChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { marketStore } = useRootStore();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const areaSeriesRef = useRef<ISeriesApi<'Area'> | null>(null);
  const xScaleRef = useRef(scaleTime());
  const yScaleRef = useRef(scaleLinear());

  // Chart state
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');
  const [timeframe, setTimeframe] = useState<TimeFrame>('1h');
  const [data, setData] = useState<Candle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [error, setError] = useState<string | null>(null);
  const [indicatorDialogOpen, setIndicatorDialogOpen] = useState(false);

  // Drawing tools state
  const [drawingTool, setDrawingTool] = useState<string | null>(null);
  const [drawingAnchor, setDrawingAnchor] = useState<{ x: number; y: number } | null>(null);
  const [drawings, setDrawings] = useState<any[]>([]);
  const [drawingMenu, setDrawingMenu] = useState<null | HTMLElement>(null);

  // Comparison state
  const [comparisonSymbols, setComparisonSymbols] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<{ [key: string]: Candle[] }>({});
  const [compareMenu, setCompareMenu] = useState<null | HTMLElement>(null);
  const [compareInput, setCompareInput] = useState('');

  // Technical indicators state
  const [showPatterns, setShowPatterns] = useState(false);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [showRSI, setShowRSI] = useState(false);
  const [showMACD, setShowMACD] = useState(false);
  const [showBollingerBands, setShowBollingerBands] = useState(false);
  const [showIchimoku, setShowIchimoku] = useState(false);
  const [showStochastic, setShowStochastic] = useState(false);
  const [showATR, setShowATR] = useState(false);
  const [rsiData, setRsiData] = useState<number[]>([]);
  const [macdData, setMacdData] = useState<{ macd: number[]; signal: number[]; histogram: number[] }>({
    macd: [],
    signal: [],
    histogram: [],
  });
  const [bollingerBands, setBollingerBands] = useState<{
    middle: number[];
    upper: number[];
    lower: number[];
  }>({ middle: [], upper: [], lower: [] });
  const [ichimokuData, setIchimokuData] = useState<{
    conversionLine: number[];
    baseLine: number[];
    leadingSpanA: number[];
    leadingSpanB: number[];
    laggingSpan: number[];
  }>({
    conversionLine: [],
    baseLine: [],
    leadingSpanA: [],
    leadingSpanB: [],
    laggingSpan: [],
  });
  const [stochasticData, setStochasticData] = useState<{
    k: number[];
    d: number[];
  }>({ k: [], d: [] });
  const [atrData, setAtrData] = useState<number[]>([]);

  // Layout state
  const [savedLayouts, setSavedLayouts] = useState<{ name: string; settings: any }[]>([]);
  const [layoutMenu, setLayoutMenu] = useState<null | HTMLElement>(null);

  // Chart settings
  const [chartSettings, setChartSettings] = useState<ChartSettings>({
    showVolume: true,
    showGrid: true,
    showCrosshair: true,
    showLegend: true,
    drawingMode: false,
    theme: 'light',
  });

  // Indicator settings
  const [indicatorSettings, setIndicatorSettings] = useState({
    bollingerBands: {
      period: 20,
      stdDev: 2
    },
    rsi: {
      period: 14,
      overbought: 70,
      oversold: 30
    },
    macd: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9
    },
    stochastic: {
      period: 14,
      smoothK: 3,
      smoothD: 3
    },
    atr: {
      period: 14
    }
  });

  // Settings dialog state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);

  // Resize observer
  React.useEffect(() => {
    if (!chartContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const chartHeight = isMobile ? window.innerHeight * 0.6 : Math.max(height, 600);
      setDimensions({ width, height: chartHeight });
    });

    resizeObserver.observe(chartContainerRef.current);
    return () => resizeObserver.disconnect();
  }, [isMobile]);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      layout: {
        background: { color: theme.palette.background.paper },
        textColor: theme.palette.text.primary,
      },
      grid: {
        vertLines: { color: theme.palette.divider },
        horzLines: { color: theme.palette.divider },
      },
    });

    chartRef.current = chart;

    // Clear previous series refs
    candlestickSeriesRef.current = null;
    lineSeriesRef.current = null;
    areaSeriesRef.current = null;

    // Create new series based on chart type
    if (chartType === 'candlestick') {
      const series = chart.addCandlestickSeries({
        upColor: theme.palette.success.main,
        downColor: theme.palette.error.main,
        borderVisible: false,
        wickUpColor: theme.palette.success.main,
        wickDownColor: theme.palette.error.main,
      });
      candlestickSeriesRef.current = series;
    } else if (chartType === 'line') {
      const series = chart.addLineSeries({
        color: theme.palette.primary.main,
        lineWidth: 2,
      });
      lineSeriesRef.current = series;
    } else {
      const series = chart.addAreaSeries({
        lineColor: theme.palette.primary.main,
        topColor: theme.palette.primary.main + '80',
        bottomColor: theme.palette.primary.main + '10',
      });
      areaSeriesRef.current = series;
    }

    // Update data for the active series
    if (data.length > 0) {
      const chartData = data.map((candle: Candle) => ({
        time: candle.time,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }));

      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(chartData);
      } else if (lineSeriesRef.current) {
        lineSeriesRef.current.setData(chartData.map(d => ({ 
          time: d.time,
          value: d.close 
        })));
      } else if (areaSeriesRef.current) {
        areaSeriesRef.current.setData(chartData.map(d => ({ 
          time: d.time,
          value: d.close 
        })));
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        candlestickSeriesRef.current = null;
        lineSeriesRef.current = null;
        areaSeriesRef.current = null;
      }
    };
  }, [dimensions, chartType, data, theme]);

  // Handle canvas drawing
  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!drawingTool || !chartRef.current) return;

    const chartElement = chartRef.current.chartElement();
    if (!chartElement) return;

    const rect = chartElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (!drawingAnchor) {
      setDrawingAnchor({ x, y });
    } else {
      const ctx = chartElement.getContext('2d');
      if (ctx) {
        drawShape(ctx, drawingTool, drawingAnchor, { x, y });
        setDrawings([...drawings, { tool: drawingTool, start: drawingAnchor, end: { x, y } }]);
        setDrawingAnchor(null);
        setDrawingTool(null);
      }
    }
  };

  // Update data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await marketStore.fetchCandles(symbol, timeframe);
        if (!chartRef.current) return;

        // Remove existing series
        if (candlestickSeriesRef.current) {
          chartRef.current.removeSeries(candlestickSeriesRef.current);
        }

        // Create new series based on chart type
        let series;
        switch (chartType) {
          case 'candlestick':
            series = chartRef.current.addCandlestickSeries({
              upColor: theme.palette.success.main,
              downColor: theme.palette.error.main,
              borderVisible: false,
              wickUpColor: theme.palette.success.main,
              wickDownColor: theme.palette.error.main,
            });
            break;
          case 'line':
            series = chartRef.current.addLineSeries({
              color: theme.palette.primary.main,
              lineWidth: 2,
            });
            break;
          case 'area':
            series = chartRef.current.addAreaSeries({
              lineColor: theme.palette.primary.main,
              topColor: theme.palette.primary.main + '50',
              bottomColor: theme.palette.primary.main + '10',
            });
            break;
        }

        candlestickSeriesRef.current = series;

        // Set data
        series.setData(data.map(candle => ({
          time: candle.time,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          value: candle.close, // For line and area charts
        })));

        chartRef.current.timeScale().fitContent();
      } catch (error) {
        console.error('Error fetching candle data:', error);
      }
    };

    fetchData();
  }, [symbol, timeframe, chartType, theme]);

  const handleChartTypeChange = (event: React.MouseEvent<HTMLElement>, newType: 'candlestick' | 'line' | 'area' | null) => {
    if (newType) {
      setChartType(newType);
    }
  };

  const handleTimeframeChange = (event: any) => {
    setTimeframe(event.target.value);
  };

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

  // Calculate technical indicators when data changes
  useEffect(() => {
    if (data.length > 0) {
      if (showBollingerBands) {
        const bands = ChartAnalysisService.calculateBollingerBands(
          data,
          indicatorSettings.bollingerBands.period,
          indicatorSettings.bollingerBands.stdDev
        );
        setBollingerBands(bands);
      }

      if (showIchimoku) {
        const ichimoku = ChartAnalysisService.calculateIchimoku(data);
        setIchimokuData(ichimoku);
      }

      if (showStochastic) {
        const stochastic = ChartAnalysisService.calculateStochastic(
          data,
          indicatorSettings.stochastic.period,
          indicatorSettings.stochastic.smoothK,
          indicatorSettings.stochastic.smoothD
        );
        setStochasticData(stochastic);
      }

      if (showATR) {
        const atr = ChartAnalysisService.calculateATR(
          data,
          indicatorSettings.atr.period
        );
        setAtrData(atr);
      }

      // Calculate RSI
      if (showRSI) {
        const rsi = ChartAnalysisService.calculateRSI(
          data,
          indicatorSettings.rsi.period
        );
        setRsiData(rsi);
      }

      // Calculate MACD
      if (showMACD) {
        const macd = ChartAnalysisService.calculateMACD(
          data,
          indicatorSettings.macd.fastPeriod,
          indicatorSettings.macd.slowPeriod,
          indicatorSettings.macd.signalPeriod
        );
        setMacdData(macd);
      }

      // Find patterns
      if (showPatterns) {
        const foundPatterns = [
          ...ChartAnalysisService.recognizePatterns(data),
          ...ChartAnalysisService.findHarmonicPatterns(data),
          ...ChartAnalysisService.findDivergencePatterns(data, rsiData)
        ];
        setPatterns(foundPatterns);
      }
    }
  }, [
    data,
    showBollingerBands,
    showIchimoku,
    showStochastic,
    showATR,
    showRSI,
    showMACD,
    showPatterns,
    indicatorSettings,
    rsiData
  ]);

  // Handle drawing interactions
  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!drawingTool) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setDrawingAnchor({ x, y });
    },
    [drawingTool]
  );

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!drawingTool || !drawingAnchor) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update temporary drawing preview
      const ctx = (e.currentTarget as HTMLCanvasElement).getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, dimensions.width, dimensions.height);
        drawShape(ctx, drawingTool, drawingAnchor, { x, y });
      }
    },
    [drawingTool, drawingAnchor, dimensions]
  );

  const handleMouseUp = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!drawingTool || !drawingAnchor) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Save the drawing
      setDrawings([
        ...drawings,
        {
          type: drawingTool,
          start: drawingAnchor,
          end: { x, y },
        },
      ]);

      setDrawingAnchor(null);
    },
    [drawingTool, drawingAnchor, drawings]
  );

  // Drawing helper function
  const drawShape = (
    ctx: CanvasRenderingContext2D,
    type: string,
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    ctx.beginPath();
    ctx.strokeStyle = theme.palette.primary.main;
    ctx.lineWidth = 2;

    switch (type) {
      case 'line':
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        break;
      case 'rectangle':
        ctx.rect(
          start.x,
          start.y,
          end.x - start.x,
          end.y - start.y
        );
        break;
      case 'fibonacci':
        const height = end.y - start.y;
        const levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
        levels.forEach(level => {
          const y = start.y + height * level;
          ctx.moveTo(start.x, y);
          ctx.lineTo(end.x, y);
          ctx.fillText(`${(level * 100).toFixed(1)}%`, start.x - 50, y);
        });
        break;
    }
    ctx.stroke();
  };

  // Handle comparison data fetching
  React.useEffect(() => {
    const fetchComparisonData = async () => {
      for (const sym of comparisonSymbols) {
        if (!comparisonData[sym]) {
          try {
            const data = await marketStore.fetchCandles(sym, timeframe);
            setComparisonData(prev => ({
              ...prev,
              [sym]: data
            }));
          } catch (error) {
            console.error(`Error fetching comparison data for ${sym}:`, error);
          }
        }
      }
    };

    fetchComparisonData();
  }, [comparisonSymbols, timeframe, marketStore]);

  // Add layout management functions
  const saveCurrentLayout = (name: string) => {
    const layout = {
      name,
      settings: {
        chartType,
        showPatterns,
        showRSI,
        showMACD,
        showBollingerBands,
        showIchimoku,
        showStochastic,
        showATR,
        drawings,
        comparisonSymbols,
        chartSettings,
        indicatorSettings
      }
    };
    setSavedLayouts(prev => [...prev, layout]);
  };

  const loadLayout = (layout: any) => {
    setChartType(layout.settings.chartType);
    setShowPatterns(layout.settings.showPatterns);
    setShowRSI(layout.settings.showRSI);
    setShowMACD(layout.settings.showMACD);
    setShowBollingerBands(layout.settings.showBollingerBands);
    setShowIchimoku(layout.settings.showIchimoku);
    setShowStochastic(layout.settings.showStochastic);
    setShowATR(layout.settings.showATR);
    setDrawings(layout.settings.drawings);
    setComparisonSymbols(layout.settings.comparisonSymbols);
    setChartSettings(layout.settings.chartSettings);
    setIndicatorSettings(layout.settings.indicatorSettings);
  };

  const renderPattern = (pattern: Pattern) => {
    const startX = xScaleRef.current(data[pattern.start].date);
    const endX = xScaleRef.current(data[pattern.end].date);
    const startY = yScaleRef.current(data[pattern.start].high);
    const endY = yScaleRef.current(data[pattern.end].high);

    switch (pattern.type) {
      case 'Head and Shoulders':
        return (
          <>
            <path
              d={`M ${startX} ${startY} Q ${(startX + endX) / 2} ${startY - 20} ${endX} ${endY}`}
              stroke={theme.palette.warning.main}
              strokeWidth={2}
              fill="none"
              strokeDasharray="5,5"
            />
            <text
              x={startX}
              y={startY - 30}
              fill={theme.palette.warning.main}
              fontSize={12}
            >
              {pattern.type} ({Math.round(pattern.probability * 100)}%)
            </text>
          </>
        );

      case 'Double Top':
      case 'Double Bottom':
        return (
          <>
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke={theme.palette.info.main}
              strokeWidth={2}
              strokeDasharray="5,5"
            />
            <text
              x={startX}
              y={startY - 20}
              fill={theme.palette.info.main}
              fontSize={12}
            >
              {pattern.type} ({Math.round(pattern.probability * 100)}%)
            </text>
          </>
        );

      case 'Ascending Triangle':
      case 'Descending Triangle':
      case 'Symmetrical Triangle':
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        return (
          <>
            <path
              d={`M ${startX} ${startY} L ${endX} ${endY} L ${midX} ${midY} Z`}
              stroke={theme.palette.success.main}
              strokeWidth={2}
              fill={theme.palette.success.main}
              fillOpacity={0.1}
            />
            <text
              x={startX}
              y={startY - 20}
              fill={theme.palette.success.main}
              fontSize={12}
            >
              {pattern.type} ({Math.round(pattern.probability * 100)}%)
            </text>
          </>
        );

      default:
        return null;
    }
  };

  const renderPatterns = () => {
    if (!showPatterns || !patterns.length) return null;

    return patterns.map((pattern, index) => (
      <g key={`pattern-${index}`}>
        {renderPattern(pattern)}
        <text
          x={xScaleRef.current(data[pattern.start].date)}
          y={yScaleRef.current(data[pattern.start].high)}
          fill={theme.palette.text.primary}
          fontSize={12}
        >
          {pattern.type} ({Math.round(pattern.probability * 100)}%)
        </text>
      </g>
    ));
  };

  // Chart setup
  const xScale = xScaleRef.current;
  const xAccessor = (d: Candle) => d.date;

  // Error display
  if (error) {
    return (
      <Paper elevation={2}>
        <Box p={2} height={600} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
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

  if (!data.length) {
    return (
      <Paper elevation={2}>
        <Box p={2} height={600} display="flex" alignItems="center" justifyContent="center">
          <Typography>Loading chart data...</Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={2}
      sx={{
        height: '100%',
        overflow: 'hidden',
        ...(isMobile && {
          m: 0,
          borderRadius: 0,
        }),
      }}
    >
      <Box p={isMobile ? 1 : 2}>
        <Grid 
          container 
          spacing={isMobile ? 1 : 2} 
          alignItems="center" 
          mb={isMobile ? 1 : 2}
          sx={{
            display: isMobile ? 'none' : 'flex',
          }}
        >
          <Grid item xs>
            <Typography variant="h6">{symbol} - {timeframe}</Typography>
          </Grid>
          <Grid item>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={handleChartTypeChange}
                size="small"
              >
                <ToggleButton value="candlestick">
                  <Tooltip title="Candlestick Chart" arrow>
                    <CandlestickIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="line">
                  <Tooltip title="Line Chart" arrow>
                    <ShowChartIcon />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="area">
                  <Tooltip title="Area Chart" arrow>
                    <TimelineIcon />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={timeframe}
                  onChange={handleTimeframeChange}
                  displayEmpty
                >
                  <MenuItem value="1m">1 Minute</MenuItem>
                  <MenuItem value="5m">5 Minutes</MenuItem>
                  <MenuItem value="15m">15 Minutes</MenuItem>
                  <MenuItem value="30m">30 Minutes</MenuItem>
                  <MenuItem value="1h">1 Hour</MenuItem>
                  <MenuItem value="4h">4 Hours</MenuItem>
                  <MenuItem value="1d">1 Day</MenuItem>
                  <MenuItem value="1w">1 Week</MenuItem>
                  <MenuItem value="1M">1 Month</MenuItem>
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

          <Grid item>
            <IconButton
              onClick={(e) => setDrawingMenu(e.currentTarget)}
              color={drawingTool ? 'primary' : 'default'}
            >
              <Tooltip title="Drawing Tools">
                <DrawIcon />
              </Tooltip>
            </IconButton>
            <Menu
              anchorEl={drawingMenu}
              open={Boolean(drawingMenu)}
              onClose={() => setDrawingMenu(null)}
            >
              <MenuItem onClick={() => {
                setDrawingTool('line');
                setDrawingMenu(null);
              }}>
                <ListItemIcon>
                  <TimelineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Trend Line</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                setDrawingTool('fibonacci');
                setDrawingMenu(null);
              }}>
                <ListItemIcon>
                  <ShowChartIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Fibonacci</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                setDrawingTool('rectangle');
                setDrawingMenu(null);
              }}>
                <ListItemIcon>
                  <CandlestickIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Rectangle</ListItemText>
              </MenuItem>
              {drawingTool && (
                <MenuItem onClick={() => {
                  setDrawingTool(null);
                  setDrawings([]);
                  setDrawingMenu(null);
                }}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Clear All</ListItemText>
                </MenuItem>
              )}
            </Menu>
          </Grid>

          <Grid item>
            <IconButton
              onClick={(e) => setCompareMenu(e.currentTarget)}
              color={comparisonSymbols.length > 0 ? 'primary' : 'default'}
            >
              <Tooltip title="Compare">
                <CompareIcon />
              </Tooltip>
            </IconButton>
            <Menu
              anchorEl={compareMenu}
              open={Boolean(compareMenu)}
              onClose={() => setCompareMenu(null)}
            >
              <Box sx={{ p: 2, width: 250 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Add Symbol to Compare
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <FormControl fullWidth>
                      <input
                        type="text"
                        value={compareInput}
                        onChange={(e) => setCompareInput(e.target.value.toUpperCase())}
                        placeholder="Enter symbol"
                        style={{
                          padding: '8px',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => {
                        if (compareInput && !comparisonSymbols.includes(compareInput)) {
                          setComparisonSymbols([...comparisonSymbols, compareInput]);
                          setCompareInput('');
                        }
                      }}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
                {comparisonSymbols.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Active Comparisons
                    </Typography>
                    {comparisonSymbols.map((sym) => (
                      <Box
                        key={sym}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2">{sym}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setComparisonSymbols(comparisonSymbols.filter(s => s !== sym));
                            const newData = { ...comparisonData };
                            delete newData[sym];
                            setComparisonData(newData);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Menu>
          </Grid>

          {/* New Analysis Tools */}
          <Grid item>
            <IconButton
              onClick={() => setShowPatterns(!showPatterns)}
              color={showPatterns ? 'primary' : 'default'}
            >
              <Tooltip title="Pattern Recognition">
                <SearchIcon />
              </Tooltip>
            </IconButton>
          </Grid>

          <Grid item>
            <IconButton
              onClick={() => setShowRSI(!showRSI)}
              color={showRSI ? 'primary' : 'default'}
            >
              <Tooltip title="RSI">
                <ShowChartIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={() => {
                setSelectedIndicator('RSI');
                setSettingsOpen(true);
              }}
            >
              <Tooltip title="RSI Settings">
                <SettingsIcon />
              </Tooltip>
            </IconButton>
          </Grid>

          <Grid item>
            <IconButton
              onClick={() => setShowMACD(!showMACD)}
              color={showMACD ? 'primary' : 'default'}
            >
              <Tooltip title="MACD">
                <TrendingUpIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={() => {
                setSelectedIndicator('MACD');
                setSettingsOpen(true);
              }}
            >
              <Tooltip title="MACD Settings">
                <SettingsIcon />
              </Tooltip>
            </IconButton>
          </Grid>

          <Grid item>
            <IconButton
              onClick={() => setShowBollingerBands(!showBollingerBands)}
              color={showBollingerBands ? 'primary' : 'default'}
            >
              <Tooltip title="Bollinger Bands">
                <ShowChartIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={() => {
                setSelectedIndicator('Bollinger Bands');
                setSettingsOpen(true);
              }}
            >
              <Tooltip title="Bollinger Bands Settings">
                <SettingsIcon />
              </Tooltip>
            </IconButton>
          </Grid>

          <Grid item>
            <IconButton
              onClick={() => setShowIchimoku(!showIchimoku)}
              color={showIchimoku ? 'primary' : 'default'}
            >
              <Tooltip title="Ichimoku Cloud">
                <TimelineIcon />
              </Tooltip>
            </IconButton>
          </Grid>

          <Grid item>
            <IconButton
              onClick={() => setShowStochastic(!showStochastic)}
              color={showStochastic ? 'primary' : 'default'}
            >
              <Tooltip title="Stochastic">
                <TrendingUpIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={() => {
                setSelectedIndicator('Stochastic');
                setSettingsOpen(true);
              }}
            >
              <Tooltip title="Stochastic Settings">
                <SettingsIcon />
              </Tooltip>
            </IconButton>
          </Grid>

          <Grid item>
            <IconButton
              onClick={() => setShowATR(!showATR)}
              color={showATR ? 'primary' : 'default'}
            >
              <Tooltip title="ATR">
                <BarChartIcon />
              </Tooltip>
            </IconButton>
            <IconButton
              onClick={() => {
                setSelectedIndicator('ATR');
                setSettingsOpen(true);
              }}
            >
              <Tooltip title="ATR Settings">
                <SettingsIcon />
              </Tooltip>
            </IconButton>
          </Grid>

          {/* Layout Management */}
          <Grid item>
            <IconButton onClick={(e) => setLayoutMenu(e.currentTarget)}>
              <Tooltip title="Layouts">
                <FolderIcon />
              </Tooltip>
            </IconButton>
            <Menu
              anchorEl={layoutMenu}
              open={Boolean(layoutMenu)}
              onClose={() => setLayoutMenu(null)}
            >
              <MenuItem onClick={() => {
                const name = prompt('Enter layout name:');
                if (name) saveCurrentLayout(name);
                setLayoutMenu(null);
              }}>
                <ListItemIcon>
                  <SaveIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Save Current Layout</ListItemText>
              </MenuItem>
              <Divider />
              {savedLayouts.map(layout => (
                <MenuItem
                  key={layout.name}
                  onClick={() => {
                    loadLayout(layout);
                    setLayoutMenu(null);
                  }}
                >
                  <ListItemText>{layout.name}</ListItemText>
                </MenuItem>
              ))}
            </Menu>
          </Grid>
        </Grid>

        <div 
          ref={chartContainerRef} 
          style={{ 
            width: '100%', 
            height: dimensions.height,
            touchAction: 'pan-y pinch-zoom',
          }}
        >
          <Box sx={{ flexGrow: 1, minHeight: isMobile ? 300 : 400 }} />
        </div>

        <Dialog 
          open={indicatorDialogOpen} 
          onClose={() => setIndicatorDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Add Indicator</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="subtitle2" gutterBottom>
                    Moving Averages
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          // Add SMA indicator
                          setIndicatorDialogOpen(false);
                        }}
                      >
                        SMA
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          // Add EMA indicator
                          setIndicatorDialogOpen(false);
                        }}
                      >
                        EMA
                      </Button>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="subtitle2" gutterBottom>
                    Oscillators
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setShowRSI(true);
                          setIndicatorDialogOpen(false);
                        }}
                      >
                        RSI
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setShowMACD(true);
                          setIndicatorDialogOpen(false);
                        }}
                      >
                        MACD
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setShowStochastic(true);
                          setIndicatorDialogOpen(false);
                        }}
                      >
                        Stochastic
                      </Button>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Typography variant="subtitle2" gutterBottom>
                    Volatility
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setShowBollingerBands(true);
                          setIndicatorDialogOpen(false);
                        }}
                      >
                        Bollinger Bands
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setShowATR(true);
                          setIndicatorDialogOpen(false);
                        }}
                      >
                        ATR
                      </Button>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIndicatorDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Paper>
  );
});

export default TradingChart;
