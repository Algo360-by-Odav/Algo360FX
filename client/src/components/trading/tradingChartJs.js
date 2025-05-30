// tradingChartJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { priceService } from '../../services/priceService';

const TradingChart = observer(({ symbol }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart instance
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: '#131722' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    chartRef.current = chart;

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    seriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!seriesRef.current) return;

    const handlePriceUpdate = (update) => {
      const time = new Date(update.timestamp).getTime() / 1000;
      if (seriesRef.current) {
        seriesRef.current.update({
          time,
          open: update.bid,
          high: update.ask,
          low: update.bid,
          close: update.ask,
        });
      }
    };

    priceService.subscribe(symbol, handlePriceUpdate);

    return () => {
      priceService.unsubscribe(symbol, handlePriceUpdate);
    };
  }, [symbol]);

  return React.createElement(Box, {
    ref: chartContainerRef,
    sx: {
      width: '100%',
      height: '100%',
      '& .tv-lightweight-charts': {
        width: '100% !important',
      },
    }
  });
});

export default TradingChart;
