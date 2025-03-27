import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { 
  createChart, 
  IChartApi, 
  DeepPartial, 
  ChartOptions,
  Time,
  HistogramData,
  CandlestickData,
  ISeriesApi,
  SeriesType,
  LineData,
  BarData,
  BarSeriesOptions,
  LineSeriesOptions,
  CandlestickSeriesOptions,
  AreaSeriesOptions
} from 'lightweight-charts';
import { observer } from 'mobx-react-lite';
import ChartToolbar from './ChartToolbar';

interface CustomTradingChartProps {
  symbol: string;
}

type ChartData = CandlestickData<Time> | LineData<Time> | BarData<Time>;

const CustomTradingChart: React.FC<CustomTradingChartProps> = observer(({ symbol }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<Map<string, ISeriesApi<SeriesType>>>(new Map());
  const [activeIndicators, setActiveIndicators] = useState<string[]>([]);

  const chartOptions: DeepPartial<ChartOptions> = {
    layout: {
      background: { color: 'transparent' },
      textColor: '#D9D9D9',
    },
    grid: {
      vertLines: { color: 'rgba(197, 203, 206, 0.1)' },
      horzLines: { color: 'rgba(197, 203, 206, 0.1)' },
    },
    crosshair: {
      mode: 0,
      vertLine: {
        width: 1,
        color: 'rgba(224, 227, 235, 0.1)',
        style: 0,
      },
      horzLine: {
        width: 1,
        color: 'rgba(224, 227, 235, 0.1)',
        style: 0,
      },
    },
    timeScale: {
      borderColor: 'rgba(197, 203, 206, 0.3)',
      timeVisible: true,
      secondsVisible: false,
    },
    rightPriceScale: {
      borderColor: 'rgba(197, 203, 206, 0.3)',
    },
  };

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        ...chartOptions,
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: '',
      });

      seriesRef.current.set('main', candlestickSeries);
      seriesRef.current.set('volume', volumeSeries);

      const currentTime = new Date().getTime();
      const data: CandlestickData<Time>[] = Array.from({ length: 100 }, (_, i) => {
        const time = currentTime - (100 - i) * 24 * 60 * 60 * 1000;
        const basePrice = 1.2000 + Math.random() * 0.1;
        const high = basePrice + Math.random() * 0.005;
        const low = basePrice - Math.random() * 0.005;
        return {
          time: time / 1000 as Time,
          open: basePrice,
          high,
          low,
          close: basePrice + (Math.random() - 0.5) * 0.005,
        };
      });

      const volumeData: HistogramData<Time>[] = data.map(candle => ({
        time: candle.time,
        value: Math.random() * 1000000,
        color: (candle.close >= candle.open) ? '#26a69a50' : '#ef535050',
      }));

      candlestickSeries.setData(data);
      volumeSeries.setData(volumeData);

      chartRef.current = chart;

      const handleResize = () => {
        if (chartContainerRef.current && chartRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }
  }, [symbol]);

  const calculateMA = (data: CandlestickData<Time>[], period: number) => {
    return data.map((item, index) => {
      if (index < period - 1) return { time: item.time, value: null };
      const sum = data
        .slice(index - period + 1, index + 1)
        .reduce((acc, curr) => acc + curr.close, 0);
      return {
        time: item.time,
        value: sum / period,
      };
    });
  };

  const calculateRSI = (data: CandlestickData<Time>[], period: number = 14) => {
    let gains: number[] = [];
    let losses: number[] = [];
    let rsi: { time: Time; value: number | null; }[] = [];

    for (let i = 1; i < data.length; i++) {
      const change = data[i].close - data[i - 1].close;
      gains.push(Math.max(0, change));
      losses.push(Math.max(0, -change));
    }

    const initialAvgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    const initialAvgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

    let avgGain = initialAvgGain;
    let avgLoss = initialAvgLoss;

    for (let i = 0; i < data.length; i++) {
      if (i < period) {
        rsi.push({ time: data[i].time, value: null });
        continue;
      }

      avgGain = ((avgGain * (period - 1)) + (gains[i - 1] || 0)) / period;
      avgLoss = ((avgLoss * (period - 1)) + (losses[i - 1] || 0)) / period;

      const rs = avgGain / avgLoss;
      const rsiValue = 100 - (100 / (1 + rs));

      rsi.push({ time: data[i].time, value: rsiValue });
    }

    return rsi;
  };

  const convertCandlestickToBar = (data: CandlestickData<Time>[]): BarData<Time>[] => {
    return data.map(candle => ({
      time: candle.time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));
  };

  const convertCandlestickToLine = (data: CandlestickData<Time>[]): LineData<Time>[] => {
    return data.map(candle => ({
      time: candle.time,
      value: candle.close,
    }));
  };

  const handleChartTypeChange = (type: 'candlestick' | 'line' | 'bar' | 'area') => {
    if (!chartRef.current) return;

    const chart = chartRef.current;
    const mainSeries = seriesRef.current.get('main');
    if (!mainSeries) return;

    const currentData = mainSeries.data() as CandlestickData<Time>[];
    chart.removeSeries(mainSeries);

    let newSeries;
    let newData;

    switch (type) {
      case 'candlestick':
        newSeries = chart.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        } as CandlestickSeriesOptions);
        newData = currentData;
        break;
      case 'line':
        newSeries = chart.addLineSeries({
          color: '#2962FF',
          lineWidth: 2,
        } as LineSeriesOptions);
        newData = convertCandlestickToLine(currentData);
        break;
      case 'bar':
        newSeries = chart.addBarSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
        } as BarSeriesOptions);
        newData = convertCandlestickToBar(currentData);
        break;
      case 'area':
        newSeries = chart.addAreaSeries({
          lineColor: '#2962FF',
          topColor: '#2962FF50',
          bottomColor: '#2962FF10',
        } as AreaSeriesOptions);
        newData = convertCandlestickToLine(currentData);
        break;
    }

    newSeries.setData(newData);
    seriesRef.current.set('main', newSeries);
  };

  const handleAddIndicator = (indicator: string) => {
    if (!chartRef.current) return;

    const chart = chartRef.current;
    const mainSeries = seriesRef.current.get('main');
    if (!mainSeries) return;

    const currentData = mainSeries.data() as CandlestickData<Time>[];
    
    let indicatorSeries;
    switch (indicator) {
      case 'ma':
        indicatorSeries = chart.addLineSeries({
          color: '#2962FF',
          lineWidth: 1,
          priceLineVisible: false,
        });
        indicatorSeries.setData(calculateMA(currentData, 20));
        seriesRef.current.set('ma', indicatorSeries);
        break;
      case 'rsi':
        indicatorSeries = chart.addLineSeries({
          color: '#B71C1C',
          lineWidth: 1,
          priceScaleId: 'right',
          priceFormat: {
            type: 'price',
            precision: 2,
            minMove: 0.01,
          },
        });
        indicatorSeries.setData(calculateRSI(currentData));
        seriesRef.current.set('rsi', indicatorSeries);
        break;
    }

    setActiveIndicators(prev => [...prev, indicator]);
  };

  const handleRemoveIndicator = (indicator: string) => {
    if (!chartRef.current) return;

    const chart = chartRef.current;
    const series = seriesRef.current.get(indicator);
    if (series) {
      chart.removeSeries(series);
      seriesRef.current.delete(indicator);
    }
    
    setActiveIndicators(prev => prev.filter(i => i !== indicator));
  };

  const handleTimeframeChange = (timeframe: string) => {
    console.log('Changing timeframe to:', timeframe);
  };

  const handleFullscreenToggle = () => {
    if (!chartContainerRef.current) return;

    if (!document.fullscreenElement) {
      chartContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <ChartToolbar
        onChartTypeChange={handleChartTypeChange}
        onAddIndicator={handleAddIndicator}
        onRemoveIndicator={handleRemoveIndicator}
        onTimeframeChange={handleTimeframeChange}
        onFullscreenToggle={handleFullscreenToggle}
        activeIndicators={activeIndicators}
      />
      <Box 
        ref={chartContainerRef}
        sx={{ 
          flex: 1,
          width: '100%',
          '&:-webkit-full-screen': {
            width: '100vw',
            height: '100vh',
          },
        }}
      />
    </Box>
  );
});

export default CustomTradingChart;
