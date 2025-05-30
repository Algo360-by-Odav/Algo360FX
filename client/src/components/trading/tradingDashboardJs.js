// tradingDashboardJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
import { Grid, Box, Paper, Typography, Divider } from '@mui/material';
import { TradingWidget } from './TradingWidget';
import { PriceChart } from './PriceChart';
import { OrderBook } from './OrderBook';
import { marketService } from '../../services/marketService';

const TradingDashboard = ({
  symbol,
  onSymbolChange,
}) => {
  const [chartData, setChartData] = useState([]);
  const [currentPrice, setCurrentPrice] = useState({ ask: 0, bid: 0 });
  const [timeframe, setTimeframe] = useState('5m');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handlePlaceOrder = async (order) => {
    try {
      // TODO: Implement actual order placement
      console.log('Placing order:', order);
      // await marketService.placeOrder(order);
    } catch (err) {
      console.error('Error placing order:', err);
      throw err;
    }
  };

  // Create the chart section
  const createChartSection = () => {
    return React.createElement(Grid, { item: true, xs: 12, lg: 8 },
      React.createElement(PriceChart, {
        symbol: symbol,
        data: chartData,
        onTimeframeChange: setTimeframe
      })
    );
  };

  // Create the trading widget section
  const createTradingWidgetSection = () => {
    return React.createElement(Grid, { item: true, xs: 12, lg: 4 },
      React.createElement(Grid, { container: true, spacing: 3 }, [
        // Trading widget
        React.createElement(Grid, { item: true, xs: 12, key: "trading-widget" },
          React.createElement(TradingWidget, {
            symbol: symbol,
            ask: currentPrice.ask,
            bid: currentPrice.bid,
            onPlaceOrder: handlePlaceOrder
          })
        ),
        
        // Order book
        React.createElement(Grid, { item: true, xs: 12, key: "order-book" },
          React.createElement(OrderBook)
        )
      ])
    );
  };

  // Create the market information section
  const createMarketInfoSection = () => {
    return React.createElement(Grid, { item: true, xs: 12 },
      React.createElement(Paper, { sx: { p: 2 } }, [
        // Title
        React.createElement(Typography, { 
          variant: "h6", 
          gutterBottom: true,
          key: "market-info-title"
        }, "Market Information"),
        
        // Divider
        React.createElement(Divider, { sx: { my: 2 }, key: "divider" }),
        
        // Market info grid
        React.createElement(Grid, { container: true, spacing: 3, key: "market-info-grid" }, [
          // Daily Range
          React.createElement(Grid, { item: true, xs: 12, md: 4, key: "daily-range" }, [
            React.createElement(Typography, { 
              variant: "subtitle2", 
              color: "text.secondary",
              key: "daily-range-label"
            }, "Daily Range"),
            React.createElement(Typography, { 
              variant: "body1",
              key: "daily-range-value"
            }, "1.1980 - 1.2050")
          ]),
          
          // 24h Volume
          React.createElement(Grid, { item: true, xs: 12, md: 4, key: "volume" }, [
            React.createElement(Typography, { 
              variant: "subtitle2", 
              color: "text.secondary",
              key: "volume-label"
            }, "24h Volume"),
            React.createElement(Typography, { 
              variant: "body1",
              key: "volume-value"
            }, "$1.2B")
          ]),
          
          // Market Status
          React.createElement(Grid, { item: true, xs: 12, md: 4, key: "market-status" }, [
            React.createElement(Typography, { 
              variant: "subtitle2", 
              color: "text.secondary",
              key: "status-label"
            }, "Market Status"),
            React.createElement(Typography, { 
              variant: "body1", 
              color: "success.main",
              key: "status-value"
            }, "Open")
          ])
        ])
      ])
    );
  };

  // Main render
  return React.createElement(Box, { sx: { flexGrow: 1, p: 3 } },
    React.createElement(Grid, { container: true, spacing: 3 }, [
      createChartSection(),
      createTradingWidgetSection(),
      createMarketInfoSection()
    ])
  );
};

export default TradingDashboard;
