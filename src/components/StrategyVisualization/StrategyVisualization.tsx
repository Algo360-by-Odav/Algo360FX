import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineStyle,
  CrosshairMode,
} from 'lightweight-charts';
import { Strategy, Candle, Trade } from '../../types/trading';
import './StrategyVisualization.css';

interface StrategyVisualizationProps {
  strategy: Strategy;
  historicalData: Candle[];
  trades: Trade[];
  indicators: IndicatorData[];
  patterns: PatternData[];
}

interface IndicatorData {
  name: string;
  data: { time: number; value: number }[];
  color: string;
  lineStyle?: LineStyle;
  overlay?: boolean;
}

interface PatternData {
  type: string;
  startTime: number;
  endTime: number;
  points: { time: number; price: number }[];
}

const StrategyVisualization: React.FC<StrategyVisualizationProps> = observer(({
  strategy,
  historicalData,
  trades,
  indicators,
  patterns,
}) => {
  const theme = useTheme();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [candlestickSeries, setCandlestickSeries] = useState<ISeriesApi<"Candlestick"> | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1h');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chartInstance = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 600,
      layout: {
        background: { color: theme.palette.background.paper },
        textColor: theme.palette.text.primary,
      },
      grid: {
        vertLines: { color: theme.palette.divider },
        horzLines: { color: theme.palette.divider },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: theme.palette.divider,
      },
      timeScale: {
        borderColor: theme.palette.divider,
        timeVisible: true,
        secondsVisible: false,
      },
      watermark: {
        color: 'rgba(255, 255, 255, 0.1)',
        visible: true,
        text: 'ALGO360',
        fontSize: 18,
        horzAlign: 'right',
        vertAlign: 'bottom',
      },
    });

    const handleResize = () => {
      if (chartContainerRef.current) {
        chartInstance.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    const series = chartInstance.addCandlestickSeries({
      upColor: theme.palette.success.main,
      downColor: theme.palette.error.main,
      borderVisible: false,
      wickUpColor: theme.palette.success.main,
      wickDownColor: theme.palette.error.main,
    });

    setChart(chartInstance);
    setCandlestickSeries(series);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.remove();
    };
  }, [theme]);

  useEffect(() => {
    if (!candlestickSeries || !historicalData.length) return;

    const formattedData = historicalData.map(candle => ({
      time: candle.timestamp.getTime() / 1000,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    }));

    candlestickSeries.setData(formattedData);
  }, [candlestickSeries, historicalData]);

  useEffect(() => {
    if (!chart || !candlestickSeries) return;

    // Clear existing markers
    candlestickSeries.setMarkers([]);

    // Add trade markers
    const markers = trades.map(trade => ({
      time: trade.openTime.getTime() / 1000,
      position: trade.side === 'BUY' ? 'belowBar' : 'aboveBar',
      color: trade.profit >= 0 ? theme.palette.success.main : theme.palette.error.main,
      shape: trade.side === 'BUY' ? 'arrowUp' : 'arrowDown',
      text: `${trade.side} ${trade.profit >= 0 ? '+' : ''}${trade.profit.toFixed(2)}`,
    }));

    candlestickSeries.setMarkers(markers);
  }, [chart, candlestickSeries, trades, theme]);

  useEffect(() => {
    if (!chart || !selectedIndicators.length) return;

    // Remove existing indicators
    chart.subscribers().forEach(series => {
      if (series !== candlestickSeries) {
        chart.removeSeries(series);
      }
    });

    // Add selected indicators
    selectedIndicators.forEach(indicatorName => {
      const indicator = indicators.find(i => i.name === indicatorName);
      if (!indicator) return;

      if (indicator.overlay) {
        const series = chart.addLineSeries({
          color: indicator.color,
          lineStyle: indicator.lineStyle || LineStyle.Solid,
          lineWidth: 1,
        });
        series.setData(indicator.data);
      } else {
        // Create a new pane for non-overlay indicators
        const pane = chart.addLineSeries({
          color: indicator.color,
          lineStyle: indicator.lineStyle || LineStyle.Solid,
          lineWidth: 1,
          priceScaleId: `right-${indicatorName}`,
          pane: 1,
        });
        pane.setData(indicator.data);
      }
    });
  }, [chart, candlestickSeries, selectedIndicators, indicators]);

  useEffect(() => {
    if (!chart || !patterns.length) return;

    patterns.forEach(pattern => {
      // Draw pattern lines
      const lines = chart.addLineSeries({
        color: theme.palette.info.main,
        lineStyle: LineStyle.Dashed,
        lineWidth: 1,
      });

      lines.setData(pattern.points.map(point => ({
        time: point.time,
        value: point.price,
      })));

      // Add pattern label
      const labelSeries = chart.addLineSeries({
        color: 'transparent',
      });

      labelSeries.setMarkers([{
        time: pattern.startTime,
        position: 'aboveBar',
        color: theme.palette.info.main,
        shape: 'text',
        text: pattern.type,
      }]);
    });
  }, [chart, patterns, theme]);

  return (
    <Box className="strategy-visualization">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">{strategy.name} Visualization</Typography>
                <Box display="flex" gap={2}>
                  <FormControl size="small">
                    <InputLabel>Timeframe</InputLabel>
                    <Select
                      value={selectedTimeframe}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      label="Timeframe"
                    >
                      <MenuItem value="1m">1 Minute</MenuItem>
                      <MenuItem value="5m">5 Minutes</MenuItem>
                      <MenuItem value="15m">15 Minutes</MenuItem>
                      <MenuItem value="1h">1 Hour</MenuItem>
                      <MenuItem value="4h">4 Hours</MenuItem>
                      <MenuItem value="1d">1 Day</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small">
                    <InputLabel>Indicators</InputLabel>
                    <Select
                      multiple
                      value={selectedIndicators}
                      onChange={(e) => setSelectedIndicators(typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
                      label="Indicators"
                    >
                      {indicators.map(indicator => (
                        <MenuItem key={indicator.name} value={indicator.name}>
                          {indicator.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
              <div ref={chartContainerRef} className="chart-container" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

export default StrategyVisualization;
