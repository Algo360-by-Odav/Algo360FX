import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import {
  AddChart as AddChartIcon,
  ZoomIn,
  ZoomOut,
  Fullscreen,
  FullscreenExit,
} from '@mui/icons-material';
import { createChart, IChartApi, Time, CandlestickData } from 'lightweight-charts';
import { useTheme } from '@mui/material/styles';
import { Theme } from '../../types/theme';

interface Indicator {
  id: string;
  name: string;
  type: string;
  parameters: Record<string, any>;
  visible: boolean;
}

interface DrawingTool {
  id: string;
  name: string;
  type: string;
  color: string;
}

interface CandleData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

const AdvancedChart: React.FC = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showIndicatorPanel, setShowIndicatorPanel] = useState(false);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [drawings, setDrawings] = useState<DrawingTool[]>([]);

  // Initialize chart
  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 600,
        layout: {
          background: { color: '#1E222D' },
          textColor: '#D9D9D9',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
        rightPriceScale: {
          borderColor: '#2B2B43',
        },
        timeScale: {
          borderColor: '#2B2B43',
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
      const data = generateSampleData();
      const candleData: CandleData[] = data.map(d => ({
        time: new Date(d.time).getTime() / 1000 as Time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));
      candleSeries.setData(candleData);

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
    }
  }, []);

  const generateSampleData = () => {
    const data = [];
    let time = new Date(Date.UTC(2024, 0, 1, 0, 0, 0, 0));
    let open = 100;
    let high = 0;
    let low = 0;
    let close = 0;

    for (let i = 0; i < 500; i++) {
      const random = Math.random();
      close = open + (random - 0.5) * 10;
      high = Math.max(open, close) + random * 5;
      low = Math.min(open, close) - random * 5;

      data.push({
        time: time.getTime() / 1000,
        open,
        high,
        low,
        close,
      });

      time = new Date(time.getTime() + 24 * 60 * 60 * 1000);
      open = close;
    }

    return data;
  };

  const addIndicator = (type: string) => {
    const newIndicator: Indicator = {
      id: Math.random().toString(),
      name: type,
      type,
      parameters: getDefaultParameters(type),
      visible: true,
    };
    setIndicators([...indicators, newIndicator]);
    // Implementation for adding indicator to chart
  };

  const getDefaultParameters = (type: string) => {
    switch (type) {
      case 'SMA':
        return { period: 14 };
      case 'RSI':
        return { period: 14, overbought: 70, oversold: 30 };
      default:
        return {};
    }
  };

  const toggleDrawingMode = (tool: string) => {
    // Implementation for enabling drawing mode
  };

  return (
    <div className="advanced-chart">
      <Box className="chart-header">
        <Box className="symbol-selector">
          <Typography variant="h6">EUR/USD</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            1.2150
          </Typography>
        </Box>
        <Box className="chart-controls">
          <IconButton onClick={() => setSelectedTimeframe('1D')}>
            1D
          </IconButton>
          <IconButton onClick={() => setSelectedTimeframe('4H')}>
            4H
          </IconButton>
          <IconButton onClick={() => setSelectedTimeframe('1H')}>
            1H
          </IconButton>
          <IconButton onClick={() => setShowIndicatorPanel(true)}>
            <AddChartIcon />
          </IconButton>
          <IconButton onClick={() => setIsFullscreen(!isFullscreen)}>
            {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>
        </Box>
      </Box>

      <Box
        ref={chartContainerRef}
        className={`chart-container ${isFullscreen ? 'fullscreen' : ''}`}
      />

      <IconButton
        ariaLabel="Chart Tools"
        className="chart-tools"
      >
        <AddChartIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={showIndicatorPanel}
        onClose={() => setShowIndicatorPanel(false)}
        className="indicator-panel"
      >
        <Box className="indicator-panel-content">
          <Typography variant="h6">Indicators</Typography>
          <List>
            <ListItem button onClick={() => addIndicator('SMA')}>
              <ListItemIcon>
                <AddChartIcon />
              </ListItemIcon>
              <ListItemText primary="Simple Moving Average" />
            </ListItem>
            <ListItem button onClick={() => addIndicator('RSI')}>
              <ListItemIcon>
                <AddChartIcon />
              </ListItemIcon>
              <ListItemText primary="Relative Strength Index" />
            </ListItem>
            {/* Add more indicators */}
          </List>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Active Indicators
          </Typography>
          <List>
            {indicators.map((indicator) => (
              <ListItem key={indicator.id}>
                <ListItemText
                  primary={indicator.name}
                  secondary={`Period: ${indicator.parameters.period}`}
                />
                <IconButton onClick={() => {}}>
                  <AddChartIcon />
                </IconButton>
                <IconButton onClick={() => {}}>
                  <AddChartIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
};

export default AdvancedChart;
