import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, IconButton, Menu, MenuItem, Typography, Grid } from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  GridOn,
  Timeline,
  ShowChart,
  MoreVert,
  Add,
} from '@mui/icons-material';
import { createChart, IChartApi, CrosshairMode } from 'lightweight-charts';
import { observer } from 'mobx-react-lite';

interface ChartData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface IndicatorConfig {
  type: string;
  params: Record<string, number>;
}

interface AdvancedChartProps {
  symbol: string;
  interval: string;
  onSymbolChange?: (symbol: string) => void;
  onIntervalChange?: (interval: string) => void;
}

const AdvancedChart: React.FC<AdvancedChartProps> = observer(({
  symbol,
  interval,
  onSymbolChange,
  onIntervalChange,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [data, setData] = useState<ChartData[]>([]);
  const [indicators, setIndicators] = useState<IndicatorConfig[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Initialize chart
  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 600,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        rightPriceScale: {
          borderColor: '#f0f0f0',
        },
        timeScale: {
          borderColor: '#f0f0f0',
          timeVisible: true,
          secondsVisible: false,
        },
      });

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      // Add sample data
      const sampleData: ChartData[] = [
        { time: '2024-01-01', open: 1.2000, high: 1.2100, low: 1.1950, close: 1.2050 },
        { time: '2024-01-02', open: 1.2050, high: 1.2150, low: 1.2000, close: 1.2100 },
        { time: '2024-01-03', open: 1.2100, high: 1.2200, low: 1.2050, close: 1.2150 },
      ];
      
      candleSeries.setData(sampleData);
      chartRef.current = chart;

      // Handle resize
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
        chart.remove();
      };
    }
  }, []);

  // Update data when symbol or interval changes
  useEffect(() => {
    // Implement real data fetching here
    console.log(`Fetching data for ${symbol} at ${interval} interval`);
  }, [symbol, interval]);

  const handleIndicatorAdd = (type: string) => {
    setIndicators([...indicators, { type, params: {} }]);
    setAnchorEl(null);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper elevation={2}>
      <Box p={2}>
        <Grid container spacing={2} alignItems="center" mb={2}>
          <Grid item>
            <Typography variant="h6">{symbol} - {interval}</Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={() => chartRef.current?.timeScale().fitContent()}>
              <ZoomIn />
            </IconButton>
            <IconButton onClick={() => chartRef.current?.timeScale().scrollToRealTime()}>
              <Timeline />
            </IconButton>
            <IconButton onClick={handleMenuOpen}>
              <Add />
            </IconButton>
          </Grid>
        </Grid>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => handleIndicatorAdd('MA')}>Moving Average</MenuItem>
          <MenuItem onClick={() => handleIndicatorAdd('RSI')}>RSI</MenuItem>
          <MenuItem onClick={() => handleIndicatorAdd('MACD')}>MACD</MenuItem>
          <MenuItem onClick={() => handleIndicatorAdd('BB')}>Bollinger Bands</MenuItem>
        </Menu>

        <div ref={chartContainerRef} style={{ width: '100%', height: 600 }} />
      </Box>
    </Paper>
  );
});

export default AdvancedChart;
