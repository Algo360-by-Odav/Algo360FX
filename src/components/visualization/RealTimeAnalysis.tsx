import React, { useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as ShowChartIcon,
  Speed as SpeedIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import * as tf from '@tensorflow/tfjs';
import WebSocketService from '../../services/websocketService';
import { MarketData } from '@/types/market';

interface RealTimeAnalysisProps {
  data: MarketData[];
  wsEndpoint: string;
  onUpdate?: (analysis: any) => void;
}

const RealTimeAnalysis: React.FC<RealTimeAnalysisProps> = ({
  data,
  wsEndpoint,
  onUpdate,
}) => {
  const theme = useTheme();
  const [settings, setSettings] = React.useState({
    orderFlow: true,
    momentum: true,
    volatility: true,
    liquidity: true,
    timeframe: '1m',
  });

  const [status, setStatus] = React.useState<'connected' | 'disconnected' | 'error'>('disconnected');
  const [orderFlow, setOrderFlow] = React.useState<OrderFlowData[]>([]);
  const [analysis, setAnalysis] = React.useState({
    momentum: 0,
    volatility: 0,
    liquidity: 0,
    sentiment: 'neutral',
  });

  const wsRef = useRef<typeof WebSocketService | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    if (!wsRef.current) {
      WebSocketService.connect(wsEndpoint);
      wsRef.current = WebSocketService;

      // Subscribe to market data updates
      WebSocketService.subscribe('marketData');

      // Handle market data updates
      WebSocketService.on('marketData', (message: any) => {
        handleMarketData(message);
      });
    }

    return () => {
      if (wsRef.current) {
        WebSocketService.unsubscribe('marketData');
        WebSocketService.disconnect();
        wsRef.current = null;
      }
    };
  }, [wsEndpoint]);

  // Handle incoming market data
  const handleMarketData = (message: any) => {
    switch (message.type) {
      case 'trade':
        updateOrderFlow(message);
        break;
      case 'orderbook':
        updateLiquidity(message);
        break;
      case 'ticker':
        updateMarketMetrics(message);
        break;
    }
  };

  // Order Flow Analysis
  const updateOrderFlow = (trade: any) => {
    const newOrderFlow = [...orderFlow];
    const price = trade.price;
    const volume = trade.size;
    const isBuy = trade.side === 'buy';

    const existingLevel = newOrderFlow.find(level => level.price === price);
    if (existingLevel) {
      if (isBuy) {
        existingLevel.buyVolume += volume;
      } else {
        existingLevel.sellVolume += volume;
      }
      existingLevel.delta = existingLevel.buyVolume - existingLevel.sellVolume;
    } else {
      newOrderFlow.push({
        price,
        buyVolume: isBuy ? volume : 0,
        sellVolume: isBuy ? 0 : volume,
        delta: isBuy ? volume : -volume,
        cumDelta: 0,
      });
    }

    // Calculate cumulative delta
    newOrderFlow.sort((a, b) => b.price - a.price);
    let cumDelta = 0;
    newOrderFlow.forEach(level => {
      cumDelta += level.delta;
      level.cumDelta = cumDelta;
    });

    setOrderFlow(newOrderFlow);
  };

  // Market Metrics Analysis
  const updateMarketMetrics = async (ticker: any) => {
    // Calculate momentum
    const prices = data.slice(-20).map(d => d.price);
    const momentum = calculateMomentum(prices);

    // Calculate volatility
    const returns = prices.slice(1).map((p, i) => (p - prices[i]) / prices[i]);
    const volatility = calculateVolatility(returns);

    // Calculate liquidity score
    const liquidity = calculateLiquidity(ticker.depth);

    // Update sentiment
    const sentiment = await predictSentiment(prices, momentum, volatility, liquidity);

    const newAnalysis = {
      momentum,
      volatility,
      liquidity,
      sentiment,
    };

    setAnalysis(newAnalysis);
    onUpdate?.(newAnalysis);
  };

  // Technical Calculations
  const calculateMomentum = (prices: number[]): number => {
    const roc = (prices[prices.length - 1] - prices[0]) / prices[0];
    const macd = calculateMACD(prices);
    const rsi = calculateRSI(prices);
    
    // Normalize and combine indicators
    const normalizedRoc = roc * 100;
    const normalizedMacd = macd.histogram[macd.histogram.length - 1];
    const normalizedRsi = (rsi - 50) / 50;

    return (normalizedRoc + normalizedMacd + normalizedRsi) / 3;
  };

  const calculateMACD = (prices: number[]) => {
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    const macdLine = ema12.map((v, i) => v - ema26[i]);
    const signalLine = calculateEMA(macdLine, 9);
    const histogram = macdLine.map((v, i) => v - signalLine[i]);

    return { macdLine, signalLine, histogram };
  };

  const calculateEMA = (data: number[], period: number): number[] => {
    const multiplier = 2 / (period + 1);
    const ema = [data[0]];

    for (let i = 1; i < data.length; i++) {
      ema.push(
        (data[i] - ema[i - 1]) * multiplier + ema[i - 1]
      );
    }

    return ema;
  };

  const calculateRSI = (prices: number[]): number => {
    const changes = prices.slice(1).map((p, i) => p - prices[i]);
    const gains = changes.map(c => Math.max(c, 0));
    const losses = changes.map(c => Math.abs(Math.min(c, 0)));

    const avgGain = gains.reduce((a, b) => a + b) / gains.length;
    const avgLoss = losses.reduce((a, b) => a + b) / losses.length;

    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  };

  const calculateVolatility = (returns: number[]): number => {
    const mean = returns.reduce((a, b) => a + b) / returns.length;
    const squaredDiffs = returns.map(r => Math.pow(r - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b) / squaredDiffs.length);
  };

  const calculateLiquidity = (depth: any): number => {
    const bidVolume = depth.bids.reduce((sum: number, [_, size]: number[]) => sum + size, 0);
    const askVolume = depth.asks.reduce((sum: number, [_, size]: number[]) => sum + size, 0);
    const spread = depth.asks[0][0] - depth.bids[0][0];
    
    // Normalize and combine metrics
    const volumeScore = Math.min((bidVolume + askVolume) / 1000, 1);
    const spreadScore = Math.max(1 - spread / 0.0001, 0);
    
    return (volumeScore + spreadScore) / 2;
  };

  // Sentiment Prediction
  const predictSentiment = async (
    prices: number[],
    momentum: number,
    volatility: number,
    liquidity: number
  ): Promise<'bullish' | 'bearish' | 'neutral'> => {
    try {
      // Prepare features
      const features = tf.tensor2d([[
        momentum,
        volatility,
        liquidity,
        prices[prices.length - 1] - prices[prices.length - 2], // Last price change
        orderFlow[orderFlow.length - 1]?.cumDelta || 0,
      ]]);

      // Make prediction
      const prediction = await tf.loadLayersModel('/models/sentiment_model.json')
        .then(model => model.predict(features) as tf.Tensor);
      
      const [bearish, neutral, bullish] = await prediction.data();
      
      // Cleanup
      features.dispose();
      prediction.dispose();

      // Return sentiment based on highest probability
      if (bullish > neutral && bullish > bearish) return 'bullish';
      if (bearish > neutral && bearish > bullish) return 'bearish';
      return 'neutral';
    } catch (error) {
      console.error('Sentiment prediction error:', error);
      return 'neutral';
    }
  };

  // Render Functions
  const renderOrderFlow = () => {
    return (
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={orderFlow}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="price" />
          <YAxis yAxisId="volume" />
          <YAxis yAxisId="delta" orientation="right" />
          <RechartsTooltip />
          <Legend />
          <Bar
            yAxisId="volume"
            dataKey="buyVolume"
            stackId="volume"
            fill={theme.palette.success.main}
            fillOpacity={0.7}
            name="Buy Volume"
          />
          <Bar
            yAxisId="volume"
            dataKey="sellVolume"
            stackId="volume"
            fill={theme.palette.error.main}
            fillOpacity={0.7}
            name="Sell Volume"
          />
          <Line
            yAxisId="delta"
            type="monotone"
            dataKey="cumDelta"
            stroke={theme.palette.primary.main}
            name="Cumulative Delta"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  const renderMetrics = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Momentum</Typography>
            <Typography variant="h6" color={
              analysis.momentum > 0.5 ? 'success.main' :
              analysis.momentum < -0.5 ? 'error.main' :
              'text.primary'
            }>
              {analysis.momentum.toFixed(2)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Volatility</Typography>
            <Typography variant="h6">
              {(analysis.volatility * 100).toFixed(2)}%
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Liquidity</Typography>
            <Typography variant="h6">
              {(analysis.liquidity * 100).toFixed(2)}%
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2">Sentiment</Typography>
            <Chip
              icon={
                analysis.sentiment === 'bullish' ? <TrendingUpIcon /> :
                analysis.sentiment === 'bearish' ? <TrendingDownIcon /> :
                <ShowChartIcon />
              }
              label={analysis.sentiment}
              color={
                analysis.sentiment === 'bullish' ? 'success' :
                analysis.sentiment === 'bearish' ? 'error' :
                'default'
              }
            />
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Real-Time Analysis</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<SyncIcon />}
                label={status}
                color={
                  status === 'connected' ? 'success' :
                  status === 'error' ? 'error' :
                  'default'
                }
                variant="outlined"
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Timeframe</InputLabel>
                <Select
                  value={settings.timeframe}
                  label="Timeframe"
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      timeframe: e.target.value as string,
                    })
                  }
                >
                  <MenuItem value="1m">1 Minute</MenuItem>
                  <MenuItem value="5m">5 Minutes</MenuItem>
                  <MenuItem value="15m">15 Minutes</MenuItem>
                  <MenuItem value="1h">1 Hour</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          {renderMetrics()}
        </Grid>

        {settings.orderFlow && (
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Order Flow
            </Typography>
            {renderOrderFlow()}
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default RealTimeAnalysis;
