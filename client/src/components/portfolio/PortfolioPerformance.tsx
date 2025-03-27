import React from 'react';
import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { createChart, ColorType, IChartApi } from 'lightweight-charts';
import { useEffect, useRef } from 'react';

interface PerformanceData {
  time: string;
  value: number;
}

const generateSampleData = (): PerformanceData[] => {
  const data: PerformanceData[] = [];
  const startDate = new Date('2025-01-01');
  let value = 100000;

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    // Generate some random price movement
    const change = (Math.random() - 0.45) * 2000;
    value += change;

    data.push({
      time: date.toISOString().split('T')[0],
      value: value,
    });
  }

  return data;
};

const PortfolioPerformance: React.FC = observer(() => {
  const theme = useTheme();
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { color: theme.palette.background.paper },
          textColor: theme.palette.text.primary,
        },
        grid: {
          vertLines: { color: theme.palette.divider },
          horzLines: { color: theme.palette.divider },
        },
        rightPriceScale: {
          borderColor: theme.palette.divider,
        },
        timeScale: {
          borderColor: theme.palette.divider,
          timeVisible: true,
          secondsVisible: false,
        },
      });

      const areaSeries = chart.addAreaSeries({
        lineColor: theme.palette.primary.main,
        topColor: theme.palette.primary.main,
        bottomColor: theme.palette.background.paper,
        lineWidth: 2,
      });

      const performanceData = generateSampleData();
      areaSeries.setData(performanceData);

      chartRef.current = chart;

      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
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
  }, [theme]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Portfolio Performance
        </Typography>
        <Box ref={chartContainerRef} />
      </CardContent>
    </Card>
  );
});

export default PortfolioPerformance;
