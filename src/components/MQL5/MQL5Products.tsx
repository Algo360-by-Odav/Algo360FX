import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Rating,
  Chip,
  Link,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import TradingViewWidget from '../Trading/TradingViewWidget';
import BacktestResults from './BacktestResults';

interface MQL5Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  mql5Link: string;
  features: string[];
  performance: {
    winRate: number;
    profitFactor: number;
    monthlyReturn: number;
  };
}

const mockProducts: MQL5Product[] = [
  {
    id: '1',
    name: 'Your MQL5 Robot Name',
    description: 'Advanced Forex trading robot with sophisticated algorithms for optimal market analysis and execution.',
    price: 299,
    rating: 4.5,
    reviews: 128,
    image: '/path-to-your-product-image.jpg',
    mql5Link: 'https://www.mql5.com/en/market/product/your-product-id',
    features: [
      'Advanced market analysis',
      'Multiple timeframe support',
      'Risk management features',
      'Real-time performance tracking'
    ],
    performance: {
      winRate: 68.5,
      profitFactor: 1.85,
      monthlyReturn: 12.3
    }
  }
  // Add more products here
];

const mockBacktestResults = {
  netProfit: 15234.56,
  trades: 156,
  winRate: 0.67,
  profitFactor: 1.89,
  sharpeRatio: 1.45,
  maxDrawdown: 0.12,
  expectedPayoff: 97.65,
  equity: [
    { date: '2023-01', value: 10000, drawdown: 0 },
    { date: '2023-02', value: 11200, drawdown: 0.02 },
    // Add more data points
  ],
  monthlyPerformance: [
    { month: 'Jan 2023', return: 12 },
    { month: 'Feb 2023', return: 8 },
    // Add more months
  ],
  tradeDistribution: [
    { type: 'Long Wins', count: 45 },
    { type: 'Long Losses', count: 25 },
    { type: 'Short Wins', count: 35 },
    { type: 'Short Losses', count: 20 }
  ],
  detailedTrades: [
    {
      ticket: 1234,
      openTime: '2023-01-15 10:30',
      type: 'BUY',
      size: 0.1,
      symbol: 'EURUSD',
      openPrice: 1.2345,
      closePrice: 1.2456,
      profit: 111.00,
      pips: 111
    },
    // Add more trades
  ]
};

const MQL5Products: React.FC = observer(() => {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        MQL5 Trading Robots
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Live Performance Chart
              </Typography>
              <Box sx={{ height: 400 }}>
                <TradingViewWidget />
              </Box>
            </CardContent>
          </Card>

          {mockProducts.map((product) => (
            <Card key={product.id} sx={{ mb: 3 }}>
              <Grid container>
                <Grid item xs={12} md={4}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {product.name}
                    </Typography>
                    
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <Rating value={product.rating} precision={0.5} readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({product.reviews} reviews)
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {product.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      {product.features.map((feature, index) => (
                        <Chip
                          key={index}
                          label={feature}
                          sx={{ mr: 1, mb: 1 }}
                          variant="outlined"
                        />
                      ))}
                    </Box>

                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2">Win Rate</Typography>
                        <Typography variant="h6" color="success.main">
                          {product.performance.winRate}%
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2">Profit Factor</Typography>
                        <Typography variant="h6">
                          {product.performance.profitFactor}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2">Monthly Return</Typography>
                        <Typography variant="h6" color="success.main">
                          {product.performance.monthlyReturn}%
                        </Typography>
                      </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h5" color="primary">
                        ${product.price}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        component={Link}
                        href={product.mql5Link}
                        target="_blank"
                      >
                        Buy on MQL5
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setSelectedProduct(product.id)}
                      >
                        View Backtest Results
                      </Button>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                MT5 Connection Status
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Account: Demo-123456
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Server: Your-Broker-Server
                </Typography>
                <Typography variant="body2" color="success.main">
                  Status: Connected
                </Typography>
              </Box>
              <Button variant="outlined" fullWidth>
                Reconnect to MT5
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {selectedProduct && (
        <BacktestResults results={mockBacktestResults} />
      )}
    </Box>
  );
});

export default MQL5Products;
