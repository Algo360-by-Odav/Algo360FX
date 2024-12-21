import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Card,
  IconButton,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Timeline,
  BarChart,
  ShowChart,
  CandlestickChart,
  Settings,
  AddCircleOutline,
  RemoveCircleOutline,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';
import { createChart, IChartApi, DeepPartial, ChartOptions, Time } from 'lightweight-charts';
import { observer } from 'mobx-react-lite';
import './ChartWidget.css';

interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface ChartWidgetProps {
  symbol: string;
  interval?: string;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

const ChartWidget: React.FC<ChartWidgetProps> = observer(({
  symbol = 'EURUSD',
  interval = '1D',
  fullscreen = false,
  onToggleFullscreen,
}) => {
  const theme = useTheme();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [timeframe, setTimeframe] = useState(interval);
  const [settingsAnchor, setSettingsAnchor] = useState<null | HTMLElement>(null);

  const generateData = (): ChartData[] => {
    const data: ChartData[] = [];
    const now = new Date();
    for (let i = 0; i < 100; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const basePrice = 1.1000;
      const volatility = 0.002;
      const open = basePrice + (Math.random() - 0.5) * volatility;
      const high = open + Math.random() * volatility;
      const low = open - Math.random() * volatility;
      const close = (open + high + low) / 3;

      data.unshift({
        time: date.toISOString().split('T')[0],
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000),
      });
    }
    return data;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        background: { color: theme.palette.background.paper },
        textColor: theme.palette.text.primary,
      },
      grid: {
        vertLines: { color: theme.palette.divider },
        horzLines: { color: theme.palette.divider },
      },
      rightPriceScale: {
        borderColor: theme.palette.divider,
      },
      timeScale: {
        borderColor: theme.palette.divider,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
      },
    };

    const newChart = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 400,
    });

    chartRef.current = newChart;
    const data = generateData();
    
    if (chartType === 'candlestick') {
      const candlestickSeries = newChart.addCandlestickSeries({
        upColor: theme.palette.success.main,
        downColor: theme.palette.error.main,
        borderVisible: false,
        wickUpColor: theme.palette.success.main,
        wickDownColor: theme.palette.error.main,
      });
      candlestickSeries.setData(data);
    } else {
      const lineSeries = newChart.addLineSeries({
        color: theme.palette.primary.main,
        lineWidth: 2,
      });
      lineSeries.setData(data.map(d => ({ time: d.time, value: d.close })));
    }

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [chartType, theme]);

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: 'candlestick' | 'line'
  ) => {
    if (newType !== null) {
      setChartType(newType);
    }
  };

  const handleTimeframeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeframe: string
  ) => {
    if (newTimeframe !== null) {
      setTimeframe(newTimeframe);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!chartRef.current) return;

    const timeScale = chartRef.current.timeScale();
    const currentVisibleRange = timeScale.getVisibleRange();
    
    if (!currentVisibleRange) return;

    const start = new Date(currentVisibleRange.from as string).getTime();
    const end = new Date(currentVisibleRange.to as string).getTime();
    const range = end - start;
    const factor = direction === 'in' ? 0.5 : 2;
    const newRange = range * factor;

    timeScale.setVisibleRange({
      from: new Date(end - newRange).toISOString(),
      to: end.toString(),
    });
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: { xs: '300px', sm: '400px' } 
    }}>
      <Box
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          gap: 1
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <Typography variant="subtitle1" component="div">
            {symbol}
          </Typography>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={handleChartTypeChange}
            size="small"
            sx={{ 
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            <ToggleButton value="candlestick">
              <Tooltip title="Candlestick">
                <CandlestickChart />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="line">
              <Tooltip title="Line">
                <ShowChart />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          width: { xs: '100%', sm: 'auto' }
        }}>
          <ToggleButtonGroup
            value={timeframe}
            exclusive
            onChange={handleTimeframeChange}
            size="small"
          >
            <ToggleButton value="1H">1H</ToggleButton>
            <ToggleButton value="4H">4H</ToggleButton>
            <ToggleButton value="1D">1D</ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={() => handleZoom('in')}>
              <AddCircleOutline />
            </IconButton>
            <IconButton size="small" onClick={() => handleZoom('out')}>
              <RemoveCircleOutline />
            </IconButton>
          </Box>

          {onToggleFullscreen && (
            <IconButton size="small" onClick={onToggleFullscreen}>
              {fullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          )}
        </Box>
      </Box>

      <Box
        ref={chartContainerRef}
        sx={{
          flex: 1,
          minHeight: 0,
          '& .tv-lightweight-charts': {
            width: '100% !important',
            height: '100% !important'
          }
        }}
      />
    </Card>
  );
});

export default ChartWidget;
