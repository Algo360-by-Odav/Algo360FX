import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { Addchart as AddChartIcon, ZoomIn, ZoomOut, PanTool } from '@mui/icons-material';
import { createChart, IChartApi, DeepPartial, ChartOptions } from 'lightweight-charts';
import { useRootStore } from '@/stores/RootStore';
import { MarketData } from '@/types/market';

interface AdvancedChartProps {
  symbol: string;
  interval: string;
  height?: number;
  width?: number;
  onTimeRangeChange?: (from: number, to: number) => void;
}

const AdvancedChart: React.FC<AdvancedChartProps> = observer(({
  symbol,
  interval,
  height = 400,
  width = 800,
  onTimeRangeChange
}) => {
  const theme = useTheme();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const { marketStore } = useRootStore();

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartOptions: DeepPartial<ChartOptions> = {
      layout: {
        background: {
          color: theme.palette.background.paper
        },
        textColor: theme.palette.text.primary,
      },
      grid: {
        vertLines: {
          color: theme.palette.divider,
        },
        horzLines: {
          color: theme.palette.divider,
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: theme.palette.primary.main,
          style: 2,
        },
        horzLine: {
          width: 1,
          color: theme.palette.primary.main,
          style: 2,
        },
      },
      timeScale: {
        borderColor: theme.palette.divider,
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: theme.palette.divider,
      },
    };

    const newChart = createChart(chartContainerRef.current, {
      width,
      height,
      ...chartOptions,
    });

    setChart(newChart);

    return () => {
      if (newChart) {
        newChart.remove();
      }
    };
  }, [theme, width, height]);

  useEffect(() => {
    if (!chart) return;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [chart]);

  useEffect(() => {
    if (!chart || !symbol || !interval) return;

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: theme.palette.success.main,
      downColor: theme.palette.error.main,
      borderVisible: false,
      wickUpColor: theme.palette.success.main,
      wickDownColor: theme.palette.error.main,
    });

    const volumeSeries = chart.addHistogramSeries({
      color: theme.palette.primary.main,
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // Subscribe to market data
    const handleMarketData = (data: MarketData) => {
      candlestickSeries.update({
        time: data.timestamp.getTime() / 1000,
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
      });

      volumeSeries.update({
        time: data.timestamp.getTime() / 1000,
        value: data.volume,
        color: data.close >= data.open ? theme.palette.success.main : theme.palette.error.main,
      });
    };

    marketStore.subscribeToMarketData(symbol, handleMarketData);

    // Load historical data
    const loadHistoricalData = async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);

      const historicalData = await marketStore.getHistoricalData(symbol, interval, startDate, endDate);
      if (historicalData) {
        const candleData = historicalData.map((d: MarketData) => ({
          time: d.timestamp.getTime() / 1000,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
        }));

        const volumeData = historicalData.map((d: MarketData) => ({
          time: d.timestamp.getTime() / 1000,
          value: d.volume,
          color: d.close >= d.open ? theme.palette.success.main : theme.palette.error.main,
        }));

        candlestickSeries.setData(candleData);
        volumeSeries.setData(volumeData);
      }
    };

    loadHistoricalData();

    return () => {
      marketStore.unsubscribeFromMarketData(symbol);
      chart.removeSeries(candlestickSeries);
      chart.removeSeries(volumeSeries);
    };
  }, [chart, symbol, interval, theme, marketStore]);

  const handleZoomIn = () => {
    if (chart) {
      const timeScale = chart.timeScale();
      timeScale.zoom(0.5);
    }
  };

  const handleZoomOut = () => {
    if (chart) {
      const timeScale = chart.timeScale();
      timeScale.zoom(-0.5);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <Box ref={chartContainerRef} />
      <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
        <IconButton onClick={handleZoomIn} aria-label="Zoom in" className="chart-control">
          <ZoomIn />
        </IconButton>
        <IconButton onClick={handleZoomOut} aria-label="Zoom out" className="chart-control">
          <ZoomOut />
        </IconButton>
        <IconButton aria-label="Pan" className="chart-control">
          <PanTool />
        </IconButton>
        <IconButton aria-label="Add indicator" className="chart-control">
          <AddChartIcon />
        </IconButton>
      </Box>
    </Box>
  );
});

export default AdvancedChart;
