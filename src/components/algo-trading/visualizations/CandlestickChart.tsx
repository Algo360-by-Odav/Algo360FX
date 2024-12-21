import React, { useState, useEffect, useRef } from 'react';
import { createChart, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { Box } from '@mui/material';
import { Trade } from '../../../types/trading';

interface CandlestickChartProps {
  data: {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
  }[];
  trades: Trade[];
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, trades }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [candlestickSeries, setCandlestickSeries] = useState<ISeriesApi<'Candlestick'> | null>(null);
  const [volumeSeries, setVolumeSeries] = useState<ISeriesApi<'Histogram'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartInstance = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: {
          color: '#253248',
        },
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: {
          color: 'rgba(197, 203, 206, 0.1)',
        },
        horzLines: {
          color: 'rgba(197, 203, 206, 0.1)',
        },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    setChart(chartInstance);

    const candleSeries = chartInstance.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    const volume = chartInstance.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    setCandlestickSeries(candleSeries);
    setVolumeSeries(volume);

    // Convert string dates to UTC timestamps
    const formattedData = data.map(item => ({
      ...item,
      time: Math.floor(new Date(item.time).getTime() / 1000) as Time,
    }));

    candleSeries.setData(formattedData);

    const volumeData = formattedData.map(item => ({
      time: item.time,
      value: item.volume,
      color: item.close >= item.open ? '#26a69a' : '#ef5350',
    }));

    volume.setData(volumeData);

    // Add trade markers
    const markers = trades.map(trade => ({
      time: Math.floor(new Date(trade.timestamp).getTime() / 1000) as Time,
      position: trade.type === 'BUY' ? 'belowBar' : 'aboveBar',
      color: trade.type === 'BUY' ? '#26a69a' : '#ef5350',
      shape: trade.type === 'BUY' ? 'arrowUp' : 'arrowDown',
      text: `${trade.type} ${trade.amount} @ ${trade.price}`,
    }));

    candleSeries.setMarkers(markers);

    const handleResize = () => {
      if (chartContainerRef.current) {
        chartInstance.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.remove();
    };
  }, [data, trades]);

  return (
    <Box
      ref={chartContainerRef}
      sx={{
        width: '100%',
        height: '500px',
        background: '#253248',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
};

export default CandlestickChart;
