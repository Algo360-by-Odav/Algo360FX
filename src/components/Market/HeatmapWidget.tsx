import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  useTheme,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../hooks/useRootStore';

interface HeatmapData {
  pair: string;
  change: number;
  volume: number;
  volatility: number;
}

const HeatmapWidget: React.FC = observer(() => {
  const theme = useTheme();
  const { marketStore } = useRootStore();
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([
    { pair: 'EUR/USD', change: 0.45, volume: 1250000, volatility: 0.12 },
    { pair: 'GBP/USD', change: -0.32, volume: 980000, volatility: 0.15 },
    { pair: 'USD/JPY', change: 0.28, volume: 1100000, volatility: 0.08 },
    { pair: 'USD/CHF', change: -0.18, volume: 750000, volatility: 0.10 },
    { pair: 'AUD/USD', change: 0.65, volume: 890000, volatility: 0.18 },
    { pair: 'USD/CAD', change: -0.22, volume: 820000, volatility: 0.11 },
    { pair: 'NZD/USD', change: 0.38, volume: 680000, volatility: 0.14 },
    { pair: 'EUR/GBP', change: 0.15, volume: 920000, volatility: 0.09 },
  ]);

  const getChangeColor = (change: number) => {
    const intensity = Math.min(Math.abs(change) * 2, 1);
    return change > 0
      ? `rgba(46, 213, 115, ${intensity})`
      : `rgba(255, 71, 87, ${intensity})`;
  };

  const formatVolume = (volume: number) => {
    return (volume / 1000000).toFixed(2) + 'M';
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Currency Heatmap</Typography>
      </Box>
      <Box sx={{ p: 2, flex: 1 }}>
        <Grid container spacing={1}>
          {heatmapData.map((data, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  backgroundColor: getChangeColor(data.change),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1 }}>
                  {data.pair}
                </Typography>
                <Typography variant="h6" sx={{ color: '#fff', mb: 0.5 }}>
                  {data.change > 0 ? '+' : ''}{data.change.toFixed(2)}%
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Vol: {formatVolume(data.volume)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    σ: {data.volatility.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
});

export default HeatmapWidget;
