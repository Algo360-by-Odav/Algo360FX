import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { createChart, IChartApi, Time } from 'lightweight-charts';
import { useStore } from '@/context/StoreContext';

interface ChartData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

const TradingChart = () => {
  const { tradingStore } = useStore();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333',
      },
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: '#f0f0f0',
      },
      timeScale: {
        borderColor: '#f0f0f0',
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#4caf50',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#4caf50',
      wickDownColor: '#ef5350',
    });

    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    const formattedData: ChartData[] = tradingStore.historicalData.map((item) => ({
      time: item.time as Time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    candlestickSeries.setData(formattedData);
    volumeSeries.setData(formattedData.map(item => ({
      time: item.time,
      value: item.volume || 0,
      color: item.close >= item.open ? '#4caf50' : '#ef5350',
    })));

    chartRef.current = chart;

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
  }, [tradingStore.historicalData]);

  return <Box ref={chartContainerRef} sx={{ width: '100%', height: 400 }} />;
};

export default TradingChart;
