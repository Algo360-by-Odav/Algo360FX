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
  Chip,
  Alert,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as ShowChartIcon,
  WaterDrop as WaterDropIcon,
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';

interface OrderBookLevel {
  price: number;
  volume: number;
  orders: number;
}

interface LiquidityMetrics {
  timestamp: Date;
  spreadBps: number;
  depth: number;
  impact: number;
  resilience: number;
  toxicity: number;
  efficiency: number;
}

interface LiquidityHotspot {
  price: number;
  volume: number;
  type: 'bid' | 'ask';
  strength: number;
  impact: number;
}

interface LiquidityAnalysisProps {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
  trades: any[];
  metrics: LiquidityMetrics[];
  onAnalysisUpdate?: (analysis: any) => void;
}

const LiquidityAnalysis: React.FC<LiquidityAnalysisProps> = ({
  bids,
  asks,
  trades,
  metrics,
  onAnalysisUpdate,
}) => {
  const theme = useTheme();
  const [settings, setSettings] = React.useState({
    depth: 10,
    smoothing: true,
    hotspots: true,
    impact: true,
    toxicity: true,
  });

  const [hotspots, setHotspots] = React.useState<LiquidityHotspot[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Analyze liquidity hotspots
  const analyzeLiquidityHotspots = () => {
    setLoading(true);

    try {
      const newHotspots: LiquidityHotspot[] = [];

      // Analyze bid side
      bids.slice(0, settings.depth).forEach((level, index) => {
        const surroundingLevels = bids.slice(
          Math.max(0, index - 2),
          Math.min(bids.length, index + 3)
        );

        const volumeStrength = level.volume / Math.max(...bids.map(b => b.volume));
        const orderStrength = level.orders / Math.max(...bids.map(b => b.orders));
        const relativeStrength = surroundingLevels.reduce(
          (strength, l) => strength + (level.volume > l.volume ? 1 : -1),
          0
        ) / surroundingLevels.length;

        if (volumeStrength > 0.7 || orderStrength > 0.7 || relativeStrength > 0.5) {
          newHotspots.push({
            price: level.price,
            volume: level.volume,
            type: 'bid',
            strength: (volumeStrength + orderStrength + Math.max(0, relativeStrength)) / 3,
            impact: calculatePriceImpact(level, 'bid'),
          });
        }
      });

      // Analyze ask side
      asks.slice(0, settings.depth).forEach((level, index) => {
        const surroundingLevels = asks.slice(
          Math.max(0, index - 2),
          Math.min(asks.length, index + 3)
        );

        const volumeStrength = level.volume / Math.max(...asks.map(a => a.volume));
        const orderStrength = level.orders / Math.max(...asks.map(a => a.orders));
        const relativeStrength = surroundingLevels.reduce(
          (strength, l) => strength + (level.volume > l.volume ? 1 : -1),
          0
        ) / surroundingLevels.length;

        if (volumeStrength > 0.7 || orderStrength > 0.7 || relativeStrength > 0.5) {
          newHotspots.push({
            price: level.price,
            volume: level.volume,
            type: 'ask',
            strength: (volumeStrength + orderStrength + Math.max(0, relativeStrength)) / 3,
            impact: calculatePriceImpact(level, 'ask'),
          });
        }
      });

      setHotspots(newHotspots);
      onAnalysisUpdate?.({ hotspots: newHotspots });

    } catch (error) {
      console.error('Liquidity analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate price impact
  const calculatePriceImpact = (level: OrderBookLevel, side: 'bid' | 'ask'): number => {
    const basePrice = side === 'bid' ? bids[0].price : asks[0].price;
    const volumeToBase = side === 'bid'
      ? bids.slice(0, bids.findIndex(b => b.price === level.price) + 1)
          .reduce((sum, b) => sum + b.volume, 0)
      : asks.slice(0, asks.findIndex(a => a.price === level.price) + 1)
          .reduce((sum, a) => sum + a.volume, 0);

    return Math.abs((level.price - basePrice) / basePrice) / volumeToBase;
  };

  // Render liquidity heatmap
  const renderLiquidityHeatmap = () => {
    const maxVolume = Math.max(
      ...bids.map(b => b.volume),
      ...asks.map(a => a.volume)
    );

    const heatmapData = [
      ...bids.slice(0, settings.depth).map(level => ({
        ...level,
        side: 'bid',
        intensity: level.volume / maxVolume,
      })),
      ...asks.slice(0, settings.depth).map(level => ({
        ...level,
        side: 'ask',
        intensity: level.volume / maxVolume,
      })),
    ];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={heatmapData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="price"
            type="number"
            domain={['auto', 'auto']}
            tickFormatter={(value) => value.toFixed(4)}
          />
          <YAxis />
          <RechartsTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <Box sx={{ bgcolor: 'background.paper', p: 1, border: 1, borderColor: 'divider' }}>
                    <Typography variant="body2">
                      Price: {data.price.toFixed(4)}
                    </Typography>
                    <Typography variant="body2">
                      Volume: {data.volume.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Orders: {data.orders}
                    </Typography>
                    <Typography variant="body2">
                      Side: {data.side.toUpperCase()}
                    </Typography>
                  </Box>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="volume"
            fill={theme.palette.primary.main}
            stroke="none"
            fillOpacity={d => d.intensity}
          />
          {settings.hotspots &&
            hotspots.map((hotspot, index) => (
              <ReferenceLine
                key={index}
                x={hotspot.price}
                stroke={
                  hotspot.type === 'bid'
                    ? theme.palette.success.main
                    : theme.palette.error.main
                }
                strokeWidth={2}
                strokeDasharray="3 3"
              />
            ))}
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // Render metrics chart
  const renderMetricsChart = () => {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={metrics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(time) => format(time, 'HH:mm:ss')}
          />
          <YAxis yAxisId="bps" orientation="left" />
          <YAxis yAxisId="ratio" orientation="right" />
          <RechartsTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as LiquidityMetrics;
                return (
                  <Box sx={{ bgcolor: 'background.paper', p: 1, border: 1, borderColor: 'divider' }}>
                    <Typography variant="body2">
                      Time: {format(data.timestamp, 'HH:mm:ss')}
                    </Typography>
                    <Typography variant="body2">
                      Spread: {data.spreadBps.toFixed(2)} bps
                    </Typography>
                    <Typography variant="body2">
                      Depth: {data.depth.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Impact: {(data.impact * 100).toFixed(2)}%
                    </Typography>
                    <Typography variant="body2">
                      Resilience: {(data.resilience * 100).toFixed(2)}%
                    </Typography>
                    {settings.toxicity && (
                      <Typography variant="body2">
                        Toxicity: {(data.toxicity * 100).toFixed(2)}%
                      </Typography>
                    )}
                    <Typography variant="body2">
                      Efficiency: {(data.efficiency * 100).toFixed(2)}%
                    </Typography>
                  </Box>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line
            yAxisId="bps"
            type="monotone"
            dataKey="spreadBps"
            stroke={theme.palette.primary.main}
            name="Spread (bps)"
          />
          <Line
            yAxisId="ratio"
            type="monotone"
            dataKey="depth"
            stroke={theme.palette.secondary.main}
            name="Market Depth"
          />
          {settings.impact && (
            <Line
              yAxisId="ratio"
              type="monotone"
              dataKey="impact"
              stroke={theme.palette.error.main}
              name="Price Impact"
            />
          )}
          <Line
            yAxisId="ratio"
            type="monotone"
            dataKey="resilience"
            stroke={theme.palette.success.main}
            name="Resilience"
          />
          {settings.toxicity && (
            <Line
              yAxisId="ratio"
              type="monotone"
              dataKey="toxicity"
              stroke={theme.palette.warning.main}
              name="Toxicity"
            />
          )}
          <Bar
            yAxisId="ratio"
            dataKey="efficiency"
            fill={theme.palette.info.main}
            fillOpacity={0.5}
            name="Efficiency"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  };

  // Update analysis when data changes
  React.useEffect(() => {
    analyzeLiquidityHotspots();
  }, [bids, asks, settings.depth]);

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Liquidity Analysis</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl size="small">
                <InputLabel>Depth</InputLabel>
                <Select
                  value={settings.depth}
                  label="Depth"
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      depth: Number(e.target.value),
                    })
                  }
                >
                  <MenuItem value={5}>5 Levels</MenuItem>
                  <MenuItem value={10}>10 Levels</MenuItem>
                  <MenuItem value={20}>20 Levels</MenuItem>
                </Select>
              </FormControl>

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

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.hotspots}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        hotspots: e.target.checked,
                      })
                    }
                  />
                }
                label="Hotspots"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.impact}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        impact: e.target.checked,
                      })
                    }
                  />
                }
                label="Impact"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.toxicity}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        toxicity: e.target.checked,
                      })
                    }
                  />
                }
                label="Toxicity"
              />
            </Box>
          </Box>
        </Grid>

        {loading && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}

        <Grid item xs={12}>
          {renderLiquidityHeatmap()}
        </Grid>

        <Grid item xs={12}>
          {renderMetricsChart()}
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={1}>
            {hotspots.map((hotspot, index) => (
              <Grid item key={index}>
                <Tooltip
                  title={
                    <Box>
                      <Typography variant="body2">
                        Volume: {hotspot.volume.toFixed(2)}
                      </Typography>
                      <Typography variant="body2">
                        Strength: {(hotspot.strength * 100).toFixed(1)}%
                      </Typography>
                      <Typography variant="body2">
                        Impact: {(hotspot.impact * 100).toFixed(2)}%
                      </Typography>
                    </Box>
                  }
                >
                  <Chip
                    icon={<WaterDropIcon />}
                    label={`${hotspot.price.toFixed(4)} (${
                      hotspot.type === 'bid' ? 'Bid' : 'Ask'
                    })`}
                    color={hotspot.type === 'bid' ? 'success' : 'error'}
                    variant="outlined"
                  />
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LiquidityAnalysis;
