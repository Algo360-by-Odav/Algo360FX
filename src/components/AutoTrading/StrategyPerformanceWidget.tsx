import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { createChart, ColorType } from 'lightweight-charts';

const StrategyPerformanceWidget: React.FC = observer(() => {
  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  const [selectedTimeframe, setSelectedTimeframe] = React.useState('1D');
  const [selectedStrategy, setSelectedStrategy] = React.useState('all');

  React.useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#999',
        },
        grid: {
          vertLines: { color: '#2B2B43' },
          horzLines: { color: '#2B2B43' },
        },
        width: chartContainerRef.current.clientWidth,
        height: 300,
        watermark: {
          color: 'rgba(255, 255, 255, 0.1)',
          visible: true,
          text: 'ALGO360',
          fontSize: 18,
          horzAlign: 'right',
          vertAlign: 'bottom',
        },
      });

      const areaSeries = chart.addAreaSeries({
        lineColor: '#2962FF',
        topColor: '#2962FF',
        bottomColor: 'rgba(41, 98, 255, 0.28)',
      });

      // Sample data - replace with actual strategy performance data
      const data = [
        { time: '2024-01-01', value: 0 },
        { time: '2024-01-02', value: 120 },
        { time: '2024-01-03', value: 200 },
        { time: '2024-01-04', value: 150 },
        { time: '2024-01-05', value: 300 },
      ];

      areaSeries.setData(data);

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
  }, [selectedTimeframe, selectedStrategy]);

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Strategy Performance</Typography>
          <Box display="flex" gap={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Strategy</InputLabel>
              <Select
                value={selectedStrategy}
                label="Strategy"
                onChange={(e) => setSelectedStrategy(e.target.value)}
              >
                <MenuItem value="all">All Strategies</MenuItem>
                <MenuItem value="trend-rider">Trend Rider Pro</MenuItem>
                <MenuItem value="scalping">Scalping Master</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={selectedTimeframe}
                label="Timeframe"
                onChange={(e) => setSelectedTimeframe(e.target.value)}
              >
                <MenuItem value="1D">1 Day</MenuItem>
                <MenuItem value="1W">1 Week</MenuItem>
                <MenuItem value="1M">1 Month</MenuItem>
                <MenuItem value="3M">3 Months</MenuItem>
                <MenuItem value="1Y">1 Year</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <div ref={chartContainerRef} />

        <Grid container spacing={2} mt={2}>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2}>
              <Typography variant="h6" color="success.main">
                +$1,245.50
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Total Profit
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2}>
              <Typography variant="h6">
                68%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Win Rate
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2}>
              <Typography variant="h6">
                1.85
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Profit Factor
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center" p={2}>
              <Typography variant="h6" color="error.main">
                -12.5%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Max Drawdown
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

export default StrategyPerformanceWidget;
