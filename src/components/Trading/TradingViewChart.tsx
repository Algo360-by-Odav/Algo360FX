import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useTradingStore } from '@/hooks/useTradingStore';
import { Box } from '@mui/material';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

interface TradingViewChartProps {
  symbol: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = observer(({ symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const tradingStore = useTradingStore();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { type: 'solid', color: '#1E1E1E' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: '#2B2B2B' },
        horzLines: { color: '#2B2B2B' },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: '#2B2B2B',
      },
      timeScale: {
        borderColor: '#2B2B2B',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Subscribe to market data
    tradingStore.subscribeToMarketData([symbol]);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
      tradingStore.unsubscribeFromMarketData([symbol]);
    };
  }, [symbol, tradingStore]);

  // Update chart when market data changes
  useEffect(() => {
    const marketData = tradingStore.marketData.get(symbol);
    if (marketData && candlestickSeriesRef.current) {
      candlestickSeriesRef.current.update({
        time: Date.now() / 1000,
        open: marketData.ask,
        high: marketData.ask,
        low: marketData.bid,
        close: marketData.bid,
      });
    }
  }, [symbol, tradingStore.marketData]);

  return (
    <Box ref={chartContainerRef} sx={{ width: '100%', height: '100%' }} />
  );
});

export default TradingViewChart;
