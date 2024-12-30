import React from 'react';
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
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as ShowChartIcon,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Cell,
} from 'recharts';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';

interface Trade {
  timestamp: Date;
  price: number;
  volume: number;
  side: 'buy' | 'sell';
}

interface OrderBookLevel {
  price: number;
  volume: number;
}

interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

interface OrderFlowData {
  price: number;
  buyVolume: number;
  sellVolume: number;
  delta: number;
  imbalance: number;
  trades: number;
}

interface OrderFlowAnalysisProps {
  trades: Trade[];
  orderBook: OrderBook;
  height?: number;
  onAnalysisUpdate?: (analysis: any) => void;
}

const OrderFlowAnalysis: React.FC<OrderFlowAnalysisProps> = ({
  trades,
  orderBook,
  height = 600,
  onAnalysisUpdate,
}) => {
  const theme = useTheme();
  const [settings, setSettings] = React.useState({
    timeframe: '1m',
    volumeProfile: true,
    deltaProfile: true,
    imbalance: true,
    footprint: true,
  });

  // Calculate Order Flow Profile
  const calculateOrderFlow = (): OrderFlowData[] => {
    const priceMap = new Map<number, OrderFlowData>();
    
    // Process trades
    trades.forEach(trade => {
      const { price, volume, side } = trade;
      const existing = priceMap.get(price) || {
        price,
        buyVolume: 0,
        sellVolume: 0,
        delta: 0,
        imbalance: 0,
        trades: 0,
      };

      if (side === 'buy') {
        existing.buyVolume += volume;
      } else {
        existing.sellVolume += volume;
      }

      existing.delta = existing.buyVolume - existing.sellVolume;
      existing.trades += 1;
      priceMap.set(price, existing);
    });

    // Calculate imbalance using order book
    orderBook.bids.forEach(bid => {
      const existing = priceMap.get(bid.price) || {
        price: bid.price,
        buyVolume: 0,
        sellVolume: 0,
        delta: 0,
        imbalance: 0,
        trades: 0,
      };
      existing.imbalance += bid.volume;
      priceMap.set(bid.price, existing);
    });

    orderBook.asks.forEach(ask => {
      const existing = priceMap.get(ask.price) || {
        price: ask.price,
        buyVolume: 0,
        sellVolume: 0,
        delta: 0,
        imbalance: 0,
        trades: 0,
      };
      existing.imbalance -= ask.volume;
      priceMap.set(ask.price, existing);
    });

    // Convert map to array and sort by price
    return Array.from(priceMap.values()).sort((a, b) => b.price - a.price);
  };

  // Calculate Volume Profile
  const calculateVolumeProfile = () => {
    const profile = calculateOrderFlow();
    
    // Calculate POC (Point of Control)
    const poc = profile.reduce((max, current) => {
      const totalVolume = current.buyVolume + current.sellVolume;
      const maxVolume = max.buyVolume + max.sellVolume;
      return totalVolume > maxVolume ? current : max;
    });

    // Calculate Value Area
    const totalVolume = profile.reduce((sum, level) => 
      sum + level.buyVolume + level.sellVolume, 0);
    const valueAreaVolume = totalVolume * 0.7; // 70% of total volume
    
    let currentVolume = 0;
    const valueArea = profile.filter(level => {
      if (currentVolume < valueAreaVolume) {
        currentVolume += level.buyVolume + level.sellVolume;
        return true;
      }
      return false;
    });

    return {
      profile,
      poc,
      valueArea,
    };
  };

  // Calculate Footprint Chart Data
  const calculateFootprint = () => {
    const timeframes = new Map<string, OrderFlowData>();
    
    trades.forEach(trade => {
      const timeKey = format(trade.timestamp, 
        settings.timeframe === '1m' ? 'HH:mm' :
        settings.timeframe === '5m' ? 'HH:mm' :
        settings.timeframe === '15m' ? 'HH:mm' :
        'HH:00'
      );

      const existing = timeframes.get(timeKey) || {
        time: timeKey,
        price: trade.price,
        buyVolume: 0,
        sellVolume: 0,
        delta: 0,
        imbalance: 0,
        trades: 0,
      };

      if (trade.side === 'buy') {
        existing.buyVolume += trade.volume;
      } else {
        existing.sellVolume += trade.volume;
      }

      existing.delta = existing.buyVolume - existing.sellVolume;
      existing.trades += 1;
      timeframes.set(timeKey, existing);
    });

    return Array.from(timeframes.values());
  };

  // Render Volume Profile
  const renderVolumeProfile = () => {
    const { profile, poc, valueArea } = calculateVolumeProfile();

    return (
      <ResponsiveContainer width="30%" height={height}>
        <ComposedChart
          layout="vertical"
          data={profile}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            dataKey="price"
            type="number"
            domain={['auto', 'auto']}
            tickFormatter={(value) => value.toFixed(4)}
          />
          <RechartsTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as OrderFlowData;
                return (
                  <Box sx={{ bgcolor: 'background.paper', p: 1, border: 1, borderColor: 'divider' }}>
                    <Typography variant="body2">
                      Price: {data.price.toFixed(4)}
                    </Typography>
                    <Typography variant="body2">
                      Buy Volume: {data.buyVolume.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Sell Volume: {data.sellVolume.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Delta: {data.delta.toFixed(2)}
                    </Typography>
                  </Box>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar
            dataKey="buyVolume"
            fill={theme.palette.success.main}
            fillOpacity={0.7}
            stackId="volume"
            name="Buy Volume"
          />
          <Bar
            dataKey="sellVolume"
            fill={theme.palette.error.main}
            fillOpacity={0.7}
            stackId="volume"
            name="Sell Volume"
          />
          {/* POC Line */}
          <ReferenceLine
            y={poc.price}
            stroke={theme.palette.primary.main}
            strokeDasharray="3 3"
            label="POC"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // Render Footprint Chart
  const renderFootprint = () => {
    const footprintData = calculateFootprint();

    return (
      <ResponsiveContainer width="70%" height={height}>
        <ComposedChart
          data={footprintData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis yAxisId="price" orientation="left" />
          <YAxis yAxisId="volume" orientation="right" />
          <RechartsTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as OrderFlowData;
                return (
                  <Box sx={{ bgcolor: 'background.paper', p: 1, border: 1, borderColor: 'divider' }}>
                    <Typography variant="body2">
                      Time: {data.time}
                    </Typography>
                    <Typography variant="body2">
                      Price: {data.price.toFixed(4)}
                    </Typography>
                    <Typography variant="body2">
                      Buy Volume: {data.buyVolume.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Sell Volume: {data.sellVolume.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Delta: {data.delta.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Trades: {data.trades}
                    </Typography>
                  </Box>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar
            yAxisId="volume"
            dataKey="buyVolume"
            stackId="volume"
            fill={theme.palette.success.main}
            fillOpacity={0.7}
            name="Buy Volume"
          >
            {footprintData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.delta > 0 ? theme.palette.success.main : theme.palette.error.main}
              />
            ))}
          </Bar>
          <Bar
            yAxisId="volume"
            dataKey="sellVolume"
            stackId="volume"
            fill={theme.palette.error.main}
            fillOpacity={0.7}
            name="Sell Volume"
          />
          <Line
            yAxisId="price"
            type="monotone"
            dataKey="price"
            stroke={theme.palette.primary.main}
            dot={false}
            name="Price"
          />
          <Line
            yAxisId="volume"
            type="monotone"
            dataKey="delta"
            stroke={theme.palette.secondary.main}
            dot={false}
            name="Delta"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Order Flow Analysis</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small">
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

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.volumeProfile}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        volumeProfile: e.target.checked,
                      })
                    }
                  />
                }
                label="Volume Profile"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.deltaProfile}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        deltaProfile: e.target.checked,
                      })
                    }
                  />
                }
                label="Delta Profile"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.imbalance}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        imbalance: e.target.checked,
                      })
                    }
                  />
                }
                label="Imbalance"
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', height: height }}>
            {settings.volumeProfile && renderVolumeProfile()}
            {settings.footprint && renderFootprint()}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrderFlowAnalysis;
