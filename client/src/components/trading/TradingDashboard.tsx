import React, { useState, useEffect } from 'react';
import { Grid, Box, Paper, Typography, Divider } from '@mui/material';
import { TradingWidget } from './TradingWidget';
import { PriceChart } from './PriceChart';
import { OrderBook } from './OrderBook';
import { marketService } from '../../services/marketService';

interface TradingDashboardProps {
  symbol: string;
  onSymbolChange?: (symbol: string) => void;
}

export const TradingDashboard: React.FC<TradingDashboardProps> = ({
  symbol,
  onSymbolChange,
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [currentPrice, setCurrentPrice] = useState({ ask: 0, bid: 0 });
  const [timeframe, setTimeframe] = useState('5m');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial chart data
  useEffect(() => {
    const loadChartData = async () => {
      try {
        setLoading(true);
        const data = await marketService.getMarketData([symbol]);
        if (data && data[0]) {
          setCurrentPrice({
            ask: data[0].price + 0.00020, // Simulated spread
            bid: data[0].price - 0.00020,
          });
        }
        // TODO: Replace with actual historical data API call
        const historicalData = generateMockHistoricalData();
        setChartData(historicalData);
      } catch (err) {
        setError('Failed to load market data');
        console.error('Error loading market data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();
    const interval = setInterval(loadChartData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, [symbol, timeframe]);

  const handlePlaceOrder = async (order: any) => {
    try {
      // TODO: Implement actual order placement
      console.log('Placing order:', order);
      // await marketService.placeOrder(order);
    } catch (err) {
      console.error('Error placing order:', err);
      throw err;
    }
  };

  // Mock data generator for development
  const generateMockHistoricalData = () => {
    const data = [];
    const numberOfPoints = 100;
    let basePrice = 1.2000;
    let time = new Date();
    time.setHours(time.getHours() - numberOfPoints);

    for (let i = 0; i < numberOfPoints; i++) {
      const volatility = 0.0002;
      const open = basePrice + (Math.random() - 0.5) * volatility;
      const high = open + Math.random() * volatility;
      const low = open - Math.random() * volatility;
      const close = low + Math.random() * (high - low);
      const volume = Math.floor(Math.random() * 1000000);

      data.push({
        time: time.toISOString(),
        open,
        high,
        low,
        close,
        volume,
      });

      basePrice = close;
      time = new Date(time.getTime() + 5 * 60000); // Add 5 minutes
    }

    return data;
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Chart Section */}
        <Grid item xs={12} lg={8}>
          <PriceChart
            symbol={symbol}
            data={chartData}
            onTimeframeChange={setTimeframe}
          />
        </Grid>

        {/* Trading Widget Section */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TradingWidget
                symbol={symbol}
                ask={currentPrice.ask}
                bid={currentPrice.bid}
                onPlaceOrder={handlePlaceOrder}
              />
            </Grid>
            <Grid item xs={12}>
              <OrderBook />
            </Grid>
          </Grid>
        </Grid>

        {/* Additional Market Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Market Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Daily Range
                </Typography>
                <Typography variant="body1">
                  1.1980 - 1.2050
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  24h Volume
                </Typography>
                <Typography variant="body1">
                  $1.2B
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Market Status
                </Typography>
                <Typography variant="body1" color="success.main">
                  Open
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
