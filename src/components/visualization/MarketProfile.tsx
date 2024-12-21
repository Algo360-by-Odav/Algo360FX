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
  TextField,
  Switch,
  FormControlLabel,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';

interface PriceData {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface VolumeProfile {
  price: number;
  volume: number;
  timeSpent: number;
  valueArea: boolean;
  poc: boolean;
}

interface MarketProfileProps {
  data: PriceData[];
  height?: number;
  onProfileUpdate?: (profile: VolumeProfile[]) => void;
}

const MarketProfile: React.FC<MarketProfileProps> = ({
  data,
  height = 400,
  onProfileUpdate,
}) => {
  const theme = useTheme();
  const [settings, setSettings] = React.useState({
    priceIncrement: 0.0001, // Price level granularity
    valueAreaVolume: 0.7, // 70% of total volume
    timeframe: '1D', // Default timeframe
    displayMode: 'volume', // 'volume' or 'tpo'
    smoothing: true,
  });

  // Calculate Volume Profile
  const calculateVolumeProfile = (): VolumeProfile[] => {
    // Group data by price levels
    const priceMap = new Map<number, { volume: number; timeSpent: number }>();
    let totalVolume = 0;

    data.forEach((candle) => {
      const priceLevels = [];
      const increment = settings.priceIncrement;
      
      // Generate price levels between low and high
      for (let price = candle.low; price <= candle.high; price += increment) {
        const roundedPrice = Math.round(price / increment) * increment;
        priceLevels.push(roundedPrice);
      }

      // Distribute volume across price levels
      const volumePerLevel = candle.volume / priceLevels.length;
      priceLevels.forEach((price) => {
        const existing = priceMap.get(price) || { volume: 0, timeSpent: 0 };
        existing.volume += volumePerLevel;
        existing.timeSpent += 1;
        priceMap.set(price, existing);
        totalVolume += volumePerLevel;
      });
    });

    // Convert map to array and sort by price
    const profile = Array.from(priceMap.entries())
      .map(([price, { volume, timeSpent }]) => ({
        price,
        volume,
        timeSpent,
        valueArea: false,
        poc: false,
      }))
      .sort((a, b) => a.price - b.price);

    // Find Point of Control (POC)
    const pocIndex = profile.reduce((maxIndex, current, index) => {
      return current.volume > profile[maxIndex].volume ? index : maxIndex;
    }, 0);
    profile[pocIndex].poc = true;

    // Calculate Value Area
    const targetVolume = totalVolume * settings.valueAreaVolume;
    let currentVolume = profile[pocIndex].volume;
    let upperIndex = pocIndex;
    let lowerIndex = pocIndex;

    while (currentVolume < targetVolume && (upperIndex < profile.length - 1 || lowerIndex > 0)) {
      const upperVolume = upperIndex < profile.length - 1 ? profile[upperIndex + 1].volume : 0;
      const lowerVolume = lowerIndex > 0 ? profile[lowerIndex - 1].volume : 0;

      if (upperVolume >= lowerVolume && upperIndex < profile.length - 1) {
        upperIndex++;
        currentVolume += upperVolume;
      } else if (lowerIndex > 0) {
        lowerIndex--;
        currentVolume += lowerVolume;
      }
    }

    // Mark Value Area
    for (let i = lowerIndex; i <= upperIndex; i++) {
      profile[i].valueArea = true;
    }

    return profile;
  };

  // Apply smoothing to the profile
  const smoothProfile = (profile: VolumeProfile[]): VolumeProfile[] => {
    if (!settings.smoothing) return profile;

    const smoothedProfile = [...profile];
    const windowSize = 3;
    const halfWindow = Math.floor(windowSize / 2);

    for (let i = halfWindow; i < profile.length - halfWindow; i++) {
      const window = profile.slice(i - halfWindow, i + halfWindow + 1);
      const avgVolume = window.reduce((sum, p) => sum + p.volume, 0) / windowSize;
      smoothedProfile[i] = {
        ...smoothedProfile[i],
        volume: avgVolume,
      };
    }

    return smoothedProfile;
  };

  // Calculate TPO (Time Price Opportunity) profile
  const calculateTPOProfile = (): VolumeProfile[] => {
    const tpoMap = new Map<number, Set<string>>();
    const increment = settings.priceIncrement;

    data.forEach((candle) => {
      const timeKey = format(candle.timestamp, 'HH:mm');
      
      for (let price = candle.low; price <= candle.high; price += increment) {
        const roundedPrice = Math.round(price / increment) * increment;
        const existing = tpoMap.get(roundedPrice) || new Set();
        existing.add(timeKey);
        tpoMap.set(roundedPrice, existing);
      }
    });

    const profile = Array.from(tpoMap.entries())
      .map(([price, timeSet]) => ({
        price,
        volume: timeSet.size, // TPO count
        timeSpent: timeSet.size,
        valueArea: false,
        poc: false,
      }))
      .sort((a, b) => a.price - b.price);

    // Calculate POC and Value Area similar to volume profile
    const pocIndex = profile.reduce((maxIndex, current, index) => {
      return current.timeSpent > profile[maxIndex].timeSpent ? index : maxIndex;
    }, 0);
    profile[pocIndex].poc = true;

    return profile;
  };

  const renderProfile = () => {
    const profile = settings.displayMode === 'volume'
      ? smoothProfile(calculateVolumeProfile())
      : calculateTPOProfile();

    onProfileUpdate?.(profile);

    return (
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          layout="vertical"
          data={profile}
          margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
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
                const data = payload[0].payload as VolumeProfile;
                return (
                  <Box sx={{ bgcolor: 'background.paper', p: 1, border: 1, borderColor: 'divider' }}>
                    <Typography variant="body2">
                      Price: {data.price.toFixed(4)}
                    </Typography>
                    <Typography variant="body2">
                      {settings.displayMode === 'volume' ? 'Volume: ' : 'TPO Count: '}
                      {data.volume.toFixed(2)}
                    </Typography>
                    {data.poc && (
                      <Typography variant="body2" color="primary">
                        Point of Control
                      </Typography>
                    )}
                    {data.valueArea && (
                      <Typography variant="body2" color="secondary">
                        Value Area
                      </Typography>
                    )}
                  </Box>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar
            dataKey="volume"
            fill={theme.palette.primary.main}
            fillOpacity={0.7}
            name={settings.displayMode === 'volume' ? 'Volume' : 'TPO Count'}
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
            <Typography variant="h6">Market Profile</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small">
                <InputLabel>Display Mode</InputLabel>
                <Select
                  value={settings.displayMode}
                  label="Display Mode"
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      displayMode: e.target.value as 'volume' | 'tpo',
                    })
                  }
                >
                  <MenuItem value="volume">Volume Profile</MenuItem>
                  <MenuItem value="tpo">TPO Profile</MenuItem>
                </Select>
              </FormControl>
              
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
                  <MenuItem value="1D">Daily</MenuItem>
                  <MenuItem value="1W">Weekly</MenuItem>
                  <MenuItem value="1M">Monthly</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                label="Price Increment"
                type="number"
                value={settings.priceIncrement}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    priceIncrement: Number(e.target.value),
                  })
                }
                inputProps={{
                  step: 0.0001,
                  min: 0.0001,
                }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.smoothing}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        smoothing: e.target.checked,
                      })
                    }
                  />
                }
                label="Smoothing"
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          {renderProfile()}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MarketProfile;
