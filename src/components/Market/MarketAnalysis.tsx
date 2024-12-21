import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as ShowChartIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStoreContext } from '../../stores/RootStoreContext';
import PerformanceChart from '../charts/PerformanceChart';

interface MarketIndicator {
  name: string;
  value: number;
  signal: 'BUY' | 'SELL' | 'NEUTRAL';
  strength: number;
}

interface TechnicalLevel {
  type: 'Support' | 'Resistance';
  price: number;
  strength: 'Strong' | 'Moderate' | 'Weak';
}

const MarketAnalysis: React.FC = observer(() => {
  const { marketStore } = useRootStoreContext();
  const [selectedPair, setSelectedPair] = useState('EUR/USD');
  const [timeframe, setTimeframe] = useState('H1');
  const [activeTab, setActiveTab] = useState(0);

  const [indicators] = useState<MarketIndicator[]>([
    { name: 'RSI', value: 65.5, signal: 'SELL', strength: 70 },
    { name: 'MACD', value: 0.0023, signal: 'BUY', strength: 80 },
    { name: 'Moving Average', value: 1.1234, signal: 'BUY', strength: 90 },
    { name: 'Bollinger Bands', value: 1.1256, signal: 'NEUTRAL', strength: 50 },
  ]);

  const [levels] = useState<TechnicalLevel[]>([
    { type: 'Resistance', price: 1.1300, strength: 'Strong' },
    { type: 'Resistance', price: 1.1250, strength: 'Moderate' },
    { type: 'Support', price: 1.1200, strength: 'Strong' },
    { type: 'Support', price: 1.1150, strength: 'Weak' },
  ]);

  const getSignalColor = (signal: MarketIndicator['signal']) => {
    switch (signal) {
      case 'BUY':
        return 'success';
      case 'SELL':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getLevelColor = (strength: TechnicalLevel['strength']) => {
    switch (strength) {
      case 'Strong':
        return 'error';
      case 'Moderate':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Market Selection Controls */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Currency Pair</InputLabel>
              <Select
                value={selectedPair}
                label="Currency Pair"
                onChange={(e) => setSelectedPair(e.target.value)}
              >
                <MenuItem value="EUR/USD">EUR/USD</MenuItem>
                <MenuItem value="GBP/USD">GBP/USD</MenuItem>
                <MenuItem value="USD/JPY">USD/JPY</MenuItem>
                <MenuItem value="AUD/USD">AUD/USD</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={timeframe}
                label="Timeframe"
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <MenuItem value="M5">5 Minutes</MenuItem>
                <MenuItem value="M15">15 Minutes</MenuItem>
                <MenuItem value="H1">1 Hour</MenuItem>
                <MenuItem value="H4">4 Hours</MenuItem>
                <MenuItem value="D1">Daily</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Chart Area */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ mb: 2 }}
            >
              <Tab label="Price Action" />
              <Tab label="Technical Analysis" />
              <Tab label="Volume Profile" />
            </Tabs>

            <Box sx={{ height: 400 }}>
              <PerformanceChart
                data={{
                  labels: ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00'],
                  datasets: [
                    {
                      label: selectedPair,
                      data: [1.1234, 1.1245, 1.1256, 1.1243, 1.1267, 1.1278],
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    title: {
                      text: `${selectedPair} - ${timeframe}`,
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Technical Indicators */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Technical Indicators
            </Typography>
            <Grid container spacing={2}>
              {indicators.map((indicator) => (
                <Grid item xs={12} sm={6} key={indicator.name}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        {indicator.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">
                          {indicator.value}
                        </Typography>
                        <Chip
                          label={indicator.signal}
                          size="small"
                          color={getSignalColor(indicator.signal)}
                          icon={
                            indicator.signal === 'BUY' ? (
                              <TrendingUpIcon />
                            ) : indicator.signal === 'SELL' ? (
                              <TrendingDownIcon />
                            ) : (
                              <ShowChartIcon />
                            )
                          }
                        />
                      </Box>
                      <Box
                        sx={{
                          width: '100%',
                          height: 4,
                          bgcolor: 'grey.200',
                          mt: 1,
                          borderRadius: 2,
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            width: `${indicator.strength}%`,
                            height: '100%',
                            bgcolor: getSignalColor(indicator.signal) + '.main',
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Support/Resistance Levels */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Key Levels
            </Typography>
            <Grid container spacing={2}>
              {levels.map((level, index) => (
                <Grid item xs={12} key={index}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TimelineIcon
                            color={level.type === 'Resistance' ? 'error' : 'success'}
                          />
                          <Typography>
                            {level.type}: {level.price}
                          </Typography>
                        </Box>
                        <Chip
                          label={level.strength}
                          size="small"
                          color={getLevelColor(level.strength)}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Market Summary */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Market Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Overall Trend
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrendingUpIcon color="success" />
                      <Typography variant="h6" color="success.main">
                        Bullish
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Signal Strength
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      Strong Buy
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Volatility
                    </Typography>
                    <Typography variant="h6" color="warning.main">
                      Moderate
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default MarketAnalysis;
