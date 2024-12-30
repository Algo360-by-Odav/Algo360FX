import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { observer } from 'mobx-react-lite';
import { createChart, ColorType } from 'lightweight-charts';

interface BacktestResult {
  netProfit: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
  profitFactor: number;
  equity: { time: string; value: number }[];
  trades: { time: string; price: number; color: string; size: number }[];
}

const BacktestingWidget: React.FC = observer(() => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [timeframe, setTimeframe] = useState('H1');
  const [symbol, setSymbol] = useState('EURUSD');
  const [initialDeposit, setInitialDeposit] = useState(10000);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<BacktestResult | null>(null);
  const chartContainerRef = React.useRef<HTMLDivElement>(null);

  const handleBacktest = async () => {
    setIsLoading(true);
    // Simulate backtesting process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Sample results with trade data
    const sampleResults: BacktestResult = {
      netProfit: 2500,
      winRate: 65.5,
      sharpeRatio: 1.8,
      maxDrawdown: 12.3,
      totalTrades: 156,
      profitFactor: 1.65,
      equity: [
        { time: '2024-01-01', value: 10000 },
        { time: '2024-01-02', value: 10250 },
        { time: '2024-01-03', value: 10800 },
        { time: '2024-01-04', value: 10600 },
        { time: '2024-01-05', value: 11200 },
        { time: '2024-01-06', value: 12500 },
      ],
      trades: [
        { time: '2024-01-01', price: 10050, color: '#26a69a', size: 1.0 },
        { time: '2024-01-02', price: 10200, color: '#26a69a', size: 0.8 },
        { time: '2024-01-03', price: 10750, color: '#ef5350', size: 1.2 },
        { time: '2024-01-04', price: 10650, color: '#26a69a', size: 0.9 },
        { time: '2024-01-05', price: 11150, color: '#26a69a', size: 1.1 },
        { time: '2024-01-06', price: 12450, color: '#ef5350', size: 1.0 },
      ],
    };
    
    setResults(sampleResults);
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (chartContainerRef.current && results?.equity) {
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

      // Add area series for equity curve
      const areaSeries = chart.addAreaSeries({
        lineColor: '#2962FF',
        topColor: '#2962FF',
        bottomColor: 'rgba(41, 98, 255, 0.28)',
      });
      areaSeries.setData(results.equity);

      // Add scatter series for trades
      const scatterSeries = chart.addLineSeries({
        lineVisible: false,
        lastValueVisible: false,
        priceLineVisible: false,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 6,
      });

      // Convert trades to scatter plot points
      const scatterData = results.trades.map(trade => ({
        time: trade.time,
        value: trade.price,
        color: trade.color,
        size: trade.size,
      }));
      scatterSeries.setData(scatterData);

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
  }, [results]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Strategy Backtesting
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Timeframe</InputLabel>
                  <Select
                    value={timeframe}
                    label="Timeframe"
                    onChange={(e) => setTimeframe(e.target.value)}
                  >
                    <MenuItem value="M1">1 Minute</MenuItem>
                    <MenuItem value="M5">5 Minutes</MenuItem>
                    <MenuItem value="M15">15 Minutes</MenuItem>
                    <MenuItem value="M30">30 Minutes</MenuItem>
                    <MenuItem value="H1">1 Hour</MenuItem>
                    <MenuItem value="H4">4 Hours</MenuItem>
                    <MenuItem value="D1">1 Day</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Symbol</InputLabel>
                  <Select
                    value={symbol}
                    label="Symbol"
                    onChange={(e) => setSymbol(e.target.value)}
                  >
                    <MenuItem value="EURUSD">EUR/USD</MenuItem>
                    <MenuItem value="GBPUSD">GBP/USD</MenuItem>
                    <MenuItem value="USDJPY">USD/JPY</MenuItem>
                    <MenuItem value="AUDUSD">AUD/USD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Initial Deposit ($)</Typography>
                <Slider
                  value={initialDeposit}
                  onChange={(_, value) => setInitialDeposit(value as number)}
                  min={1000}
                  max={100000}
                  step={1000}
                  marks={[
                    { value: 1000, label: '1K' },
                    { value: 50000, label: '50K' },
                    { value: 100000, label: '100K' },
                  ]}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleBacktest}
                  disabled={isLoading}
                >
                  {isLoading ? 'Running Backtest...' : 'Run Backtest'}
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            {results && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Backtest Results
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Net Profit
                    </Typography>
                    <Typography variant="h6" color={results.netProfit >= 0 ? 'success.main' : 'error.main'}>
                      ${results.netProfit}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Win Rate
                    </Typography>
                    <Typography variant="h6">
                      {results.winRate}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Sharpe Ratio
                    </Typography>
                    <Typography variant="h6">
                      {results.sharpeRatio}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Max Drawdown
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {results.maxDrawdown}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Total Trades
                    </Typography>
                    <Typography variant="h6">
                      {results.totalTrades}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Profit Factor
                    </Typography>
                    <Typography variant="h6">
                      {results.profitFactor}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box ref={chartContainerRef} style={{ height: '300px' }} />
                  </Grid>
                </Grid>
              </Box>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

export default BacktestingWidget;
