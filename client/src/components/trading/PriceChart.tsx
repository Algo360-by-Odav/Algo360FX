import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts';
import { PriceChartProps } from './types';

const PriceChart: React.FC<PriceChartProps> = ({
  symbol,
  data,
  onTimeframeChange,
  indicators = [],
  advanced = false,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const [timeframe, setTimeframe] = useState('5m');

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart with advanced options if enabled
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1a1a1a' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#1e1e1e' },
        horzLines: { color: '#1e1e1e' },
      },
      rightPriceScale: {
        borderColor: '#1e1e1e',
        autoScale: true,
        scaleMargins: advanced ? {
          top: 0.1,
          bottom: 0.2,
        } : {
          top: 0.2,
          bottom: 0.1,
        },
      },
      timeScale: {
        borderColor: '#1e1e1e',
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: number) => {
          const date = new Date(time * 1000);
          return date.toLocaleTimeString();
        },
      },
      crosshair: {
        vertLine: {
          color: '#303030',
          width: 1,
          style: 3,
          labelBackgroundColor: '#1e1e1e',
        },
        horzLine: {
          color: '#303030',
          width: 1,
          style: 3,
          labelBackgroundColor: '#1e1e1e',
        },
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: true,
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: true,
      },
    });

    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Add volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // Set as an overlay
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // Save refs
    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    // Generate some initial data if none provided
    if (data.length === 0) {
      const initialData = generateMockData();
      candlestickSeries.setData(initialData);
      volumeSeries.setData(initialData.map(d => ({
        time: d.time,
        value: d.volume || 0,
        color: (d as any).close >= (d as any).open ? '#26a69a' : '#ef5350',
      })));
    }

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [advanced]);

  // Update data
  useEffect(() => {
    if (candlestickSeriesRef.current && volumeSeriesRef.current && data.length > 0) {
      candlestickSeriesRef.current.setData(data);
      
      // Convert candlestick data to volume data
      const volumeData = data.map(candle => ({
        time: candle.time,
        value: candle.volume || 0,
        color: (candle as any).close >= (candle as any).open ? '#26a69a' : '#ef5350',
      }));
      
      volumeSeriesRef.current.setData(volumeData);
    }
  }, [data]);

  // Handle timeframe changes
  const handleTimeframeChange = (event: SelectChangeEvent<string>) => {
    const newTimeframe = event.target.value;
    setTimeframe(newTimeframe);
    onTimeframeChange(newTimeframe);
  };

  // Generate mock data for initial display
  const generateMockData = () => {
    const basePrice = 1.0921; // EUR/USD base price
    const data: CandlestickData[] = [];
    const now = new Date();
    
    for (let i = 50; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000);
      const volatility = 0.0002;
      const open = basePrice + (Math.random() - 0.5) * volatility;
      const close = open + (Math.random() - 0.5) * volatility;
      const high = Math.max(open, close) + Math.random() * volatility;
      const low = Math.min(open, close) - Math.random() * volatility;
      
      data.push({
        time: time.getTime() / 1000,
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000 + 100),
      });
    }
    
    return data;
  };

  const handleZoomIn = () => {
    if (chartRef.current) {
      chartRef.current.timeScale().zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (chartRef.current) {
      chartRef.current.timeScale().zoomOut();
    }
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent();
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, display: 'flex', gap: 1 }}>
        <FormControl size="small" variant="outlined" sx={{ minWidth: 120, bgcolor: 'background.paper' }}>
          <Select
            value={timeframe}
            onChange={handleTimeframeChange}
            sx={{ height: 32 }}
          >
            <MenuItem value="1m">1 Minute</MenuItem>
            <MenuItem value="5m">5 Minutes</MenuItem>
            <MenuItem value="15m">15 Minutes</MenuItem>
            <MenuItem value="30m">30 Minutes</MenuItem>
            <MenuItem value="1h">1 Hour</MenuItem>
            <MenuItem value="4h">4 Hours</MenuItem>
            <MenuItem value="1d">1 Day</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Zoom In">
          <IconButton size="small" onClick={handleZoomIn} sx={{ bgcolor: 'background.paper' }}>
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom Out">
          <IconButton size="small" onClick={handleZoomOut} sx={{ bgcolor: 'background.paper' }}>
            <ZoomOutIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Reset Zoom">
          <IconButton size="small" onClick={handleResetZoom} sx={{ bgcolor: 'background.paper' }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        ref={chartContainerRef}
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: '#1a1a1a',
          '& .tv-lightweight-charts': {
            width: '100% !important',
            height: '100% !important',
          },
        }}
      />
    </Box>
  );
};

export default PriceChart;
