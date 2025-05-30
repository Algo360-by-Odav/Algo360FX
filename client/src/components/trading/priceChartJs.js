// priceChartJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { createChart } from 'lightweight-charts';

const PriceChart = ({
  symbol,
  data = [],
  onTimeframeChange,
  indicators = [],
  advanced = false,
}) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const [timeframe, setTimeframe] = useState('5m');

  // Custom tick mark formatter for time scale
  const tickMarkFormatter = (time) => {
    const date = new Date(time * 1000);
    return date.toLocaleTimeString();
  };

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
        tickMarkFormatter: tickMarkFormatter,
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
        color: d.close >= d.open ? '#26a69a' : '#ef5350',
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
        color: candle.close >= candle.open ? '#26a69a' : '#ef5350',
      }));
      
      volumeSeriesRef.current.setData(volumeData);
    }
  }, [data]);

  // Handle timeframe changes
  const handleTimeframeChange = (event) => {
    const newTimeframe = event.target.value;
    setTimeframe(newTimeframe);
    if (onTimeframeChange) {
      onTimeframeChange(newTimeframe);
    }
  };

  // Generate mock data for initial display
  const generateMockData = () => {
    const basePrice = 1.0921; // EUR/USD base price
    const data = [];
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

  // Create chart controls
  const createChartControls = () => {
    return React.createElement(Box, { 
      sx: { position: 'absolute', top: 8, right: 8, zIndex: 1, display: 'flex', gap: 1 }
    }, [
      // Timeframe selector
      React.createElement(FormControl, {
        key: "timeframe-control",
        size: "small",
        variant: "outlined",
        sx: { minWidth: 120, bgcolor: 'background.paper' }
      }, 
        React.createElement(Select, {
          value: timeframe,
          onChange: handleTimeframeChange,
          sx: { height: 32 }
        }, [
          React.createElement(MenuItem, { key: "1m", value: "1m" }, "1 Minute"),
          React.createElement(MenuItem, { key: "5m", value: "5m" }, "5 Minutes"),
          React.createElement(MenuItem, { key: "15m", value: "15m" }, "15 Minutes"),
          React.createElement(MenuItem, { key: "30m", value: "30m" }, "30 Minutes"),
          React.createElement(MenuItem, { key: "1h", value: "1h" }, "1 Hour"),
          React.createElement(MenuItem, { key: "4h", value: "4h" }, "4 Hours"),
          React.createElement(MenuItem, { key: "1d", value: "1d" }, "1 Day")
        ])
      ),
      
      // Zoom In button
      React.createElement(Tooltip, {
        key: "zoom-in-tooltip",
        title: "Zoom In"
      }, 
        React.createElement(IconButton, {
          size: "small",
          onClick: handleZoomIn,
          sx: { bgcolor: 'background.paper' }
        }, 
          React.createElement(ZoomInIcon)
        )
      ),
      
      // Zoom Out button
      React.createElement(Tooltip, {
        key: "zoom-out-tooltip",
        title: "Zoom Out"
      }, 
        React.createElement(IconButton, {
          size: "small",
          onClick: handleZoomOut,
          sx: { bgcolor: 'background.paper' }
        }, 
          React.createElement(ZoomOutIcon)
        )
      ),
      
      // Reset Zoom button
      React.createElement(Tooltip, {
        key: "reset-zoom-tooltip",
        title: "Reset Zoom"
      }, 
        React.createElement(IconButton, {
          size: "small",
          onClick: handleResetZoom,
          sx: { bgcolor: 'background.paper' }
        }, 
          React.createElement(RefreshIcon)
        )
      )
    ]);
  };

  // Main render
  return React.createElement(Box, { 
    sx: { position: 'relative', width: '100%', height: '100%' }
  }, [
    // Chart controls
    createChartControls(),
    
    // Chart container
    React.createElement(Box, {
      key: "chart-container",
      ref: chartContainerRef,
      sx: {
        width: '100%',
        height: '100%',
        bgcolor: '#1a1a1a',
        '& .tv-lightweight-charts': {
          width: '100% !important',
          height: '100% !important',
        },
      }
    })
  ]);
};

export default PriceChart;
