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
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  Cell,
} from 'recharts';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import * as tf from '@tensorflow/tfjs';

interface TradeCluster {
  price: number;
  volume: number;
  trades: number;
  timeSpent: number;
  type: 'accumulation' | 'distribution' | 'neutral';
  strength: number;
  support?: number;
  resistance?: number;
}

interface MarketData {
  timestamp: Date;
  price: number;
  volume: number;
  trades: number;
}

interface ClusterAnalysisProps {
  data: MarketData[];
  realtime?: boolean;
  onClusterUpdate?: (clusters: TradeCluster[]) => void;
}

const ClusterAnalysis: React.FC<ClusterAnalysisProps> = ({
  data,
  realtime = false,
  onClusterUpdate,
}) => {
  const theme = useTheme();
  const [settings, setSettings] = React.useState({
    timeframe: '1h',
    clusterThreshold: 0.1,
    minTradeCount: 10,
    smoothing: true,
  });

  const [clusters, setClusters] = React.useState<TradeCluster[]>([]);
  const [loading, setLoading] = React.useState(false);

  // DBSCAN Clustering Algorithm
  const dbscan = (points: number[][], eps: number, minPts: number) => {
    const n = points.length;
    const visited = new Set<number>();
    const noise = new Set<number>();
    const clusters: number[][] = [];
    
    const regionQuery = (p: number[], eps: number) => {
      return points.reduce((neighbors: number[], point, idx) => {
        const distance = Math.sqrt(
          Math.pow(p[0] - point[0], 2) + Math.pow(p[1] - point[1], 2)
        );
        if (distance <= eps) neighbors.push(idx);
        return neighbors;
      }, []);
    };

    const expandCluster = (point: number[], neighbors: number[], cluster: number[]) => {
      cluster.push(points.indexOf(point));
      
      for (let i = 0; i < neighbors.length; i++) {
        const neighborIdx = neighbors[i];
        if (!visited.has(neighborIdx)) {
          visited.add(neighborIdx);
          const newNeighbors = regionQuery(points[neighborIdx], eps);
          if (newNeighbors.length >= minPts) {
            neighbors.push(...newNeighbors.filter(n => !neighbors.includes(n)));
          }
        }
        
        if (!clusters.some(c => c.includes(neighborIdx))) {
          cluster.push(neighborIdx);
        }
      }
    };

    for (let i = 0; i < n; i++) {
      if (visited.has(i)) continue;
      
      visited.add(i);
      const neighbors = regionQuery(points[i], eps);
      
      if (neighbors.length < minPts) {
        noise.add(i);
      } else {
        const cluster: number[] = [];
        expandCluster(points[i], neighbors, cluster);
        clusters.push(cluster);
      }
    }

    return { clusters, noise };
  };

  // Analyze price clusters
  const analyzeClusters = () => {
    setLoading(true);

    try {
      // Prepare data points for clustering
      const points = data.map(d => [d.price, d.volume]);
      
      // Normalize points
      const tensor = tf.tensor2d(points);
      const { mean, variance } = tf.moments(tensor);
      const normalizedPoints = points.map(p => [
        (p[0] - mean.arraySync()[0]) / Math.sqrt(variance.arraySync()[0]),
        (p[1] - mean.arraySync()[1]) / Math.sqrt(variance.arraySync()[1]),
      ]);

      // Run DBSCAN clustering
      const { clusters: clusterIndices, noise } = dbscan(
        normalizedPoints,
        settings.clusterThreshold,
        settings.minTradeCount
      );

      // Analyze each cluster
      const analyzedClusters = clusterIndices.map(cluster => {
        const clusterPoints = cluster.map(i => ({
          price: data[i].price,
          volume: data[i].volume,
          timestamp: data[i].timestamp,
          trades: data[i].trades,
        }));

        // Calculate cluster metrics
        const avgPrice = clusterPoints.reduce((sum, p) => sum + p.price, 0) / cluster.length;
        const totalVolume = clusterPoints.reduce((sum, p) => sum + p.volume, 0);
        const totalTrades = clusterPoints.reduce((sum, p) => sum + p.trades, 0);
        
        // Calculate time metrics
        const timeStart = Math.min(...clusterPoints.map(p => p.timestamp.getTime()));
        const timeEnd = Math.max(...clusterPoints.map(p => p.timestamp.getTime()));
        const timeSpent = (timeEnd - timeStart) / (1000 * 60); // minutes

        // Determine cluster type
        const volumeProfile = analyzeVolumeProfile(clusterPoints);
        const type = determineClusterType(volumeProfile, timeSpent);
        
        // Calculate support/resistance levels
        const { support, resistance } = calculateLevels(clusterPoints);

        return {
          price: avgPrice,
          volume: totalVolume,
          trades: totalTrades,
          timeSpent,
          type,
          strength: calculateStrength(volumeProfile, timeSpent, totalTrades),
          support,
          resistance,
        };
      });

      setClusters(analyzedClusters);
      onClusterUpdate?.(analyzedClusters);

    } catch (error) {
      console.error('Cluster analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Analyze volume profile of a cluster
  const analyzeVolumeProfile = (points: any[]) => {
    const buyVolume = points.reduce((sum, p) => sum + (p.volume * (p.price >= p.prevPrice ? 1 : 0)), 0);
    const sellVolume = points.reduce((sum, p) => sum + (p.volume * (p.price < p.prevPrice ? 1 : 0)), 0);
    
    return {
      buyVolume,
      sellVolume,
      ratio: buyVolume / (buyVolume + sellVolume),
    };
  };

  // Determine cluster type based on volume profile
  const determineClusterType = (
    volumeProfile: { ratio: number },
    timeSpent: number
  ): 'accumulation' | 'distribution' | 'neutral' => {
    const { ratio } = volumeProfile;
    
    if (ratio > 0.6) return 'accumulation';
    if (ratio < 0.4) return 'distribution';
    return 'neutral';
  };

  // Calculate support and resistance levels
  const calculateLevels = (points: any[]) => {
    const prices = points.map(p => p.price);
    const volumes = points.map(p => p.volume);
    
    // Volume-weighted levels
    const weightedPrices = prices.map((p, i) => p * volumes[i]);
    const totalVolume = volumes.reduce((a, b) => a + b, 0);
    const vwap = weightedPrices.reduce((a, b) => a + b, 0) / totalVolume;

    // Standard deviation for level ranges
    const deviation = Math.sqrt(
      prices.reduce((sum, p) => sum + Math.pow(p - vwap, 2), 0) / prices.length
    );

    return {
      support: vwap - deviation,
      resistance: vwap + deviation,
    };
  };

  // Calculate cluster strength
  const calculateStrength = (
    volumeProfile: { buyVolume: number; sellVolume: number },
    timeSpent: number,
    trades: number
  ): number => {
    const volumeStrength = Math.abs(volumeProfile.buyVolume - volumeProfile.sellVolume) /
      (volumeProfile.buyVolume + volumeProfile.sellVolume);
    const timeStrength = Math.min(timeSpent / 60, 1); // Normalize to 1 hour
    const tradeStrength = Math.min(trades / 100, 1); // Normalize to 100 trades

    return (volumeStrength + timeStrength + tradeStrength) / 3;
  };

  // Effect for real-time updates
  React.useEffect(() => {
    if (realtime) {
      const interval = setInterval(analyzeClusters, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [realtime, data]);

  // Initial analysis
  React.useEffect(() => {
    analyzeClusters();
  }, [data, settings]);

  // Render cluster visualization
  const renderClusters = () => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="price"
            type="number"
            name="Price"
            domain={['auto', 'auto']}
            tickFormatter={(value) => value.toFixed(4)}
          />
          <YAxis
            dataKey="volume"
            type="number"
            name="Volume"
            domain={['auto', 'auto']}
          />
          <RechartsTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const cluster = payload[0].payload as TradeCluster;
                return (
                  <Box sx={{ bgcolor: 'background.paper', p: 1, border: 1, borderColor: 'divider' }}>
                    <Typography variant="body2">
                      Price: {cluster.price.toFixed(4)}
                    </Typography>
                    <Typography variant="body2">
                      Volume: {cluster.volume.toFixed(2)}
                    </Typography>
                    <Typography variant="body2">
                      Trades: {cluster.trades}
                    </Typography>
                    <Typography variant="body2">
                      Type: {cluster.type}
                    </Typography>
                    <Typography variant="body2">
                      Strength: {(cluster.strength * 100).toFixed(1)}%
                    </Typography>
                    {cluster.support && (
                      <Typography variant="body2">
                        Support: {cluster.support.toFixed(4)}
                      </Typography>
                    )}
                    {cluster.resistance && (
                      <Typography variant="body2">
                        Resistance: {cluster.resistance.toFixed(4)}
                      </Typography>
                    )}
                  </Box>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Scatter
            name="Price Clusters"
            data={clusters}
            fill={theme.palette.primary.main}
          >
            {clusters.map((cluster, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  cluster.type === 'accumulation'
                    ? theme.palette.success.main
                    : cluster.type === 'distribution'
                    ? theme.palette.error.main
                    : theme.palette.grey[500]
                }
                fillOpacity={cluster.strength}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Cluster Analysis</Typography>
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
                  <MenuItem value="1h">1 Hour</MenuItem>
                  <MenuItem value="4h">4 Hours</MenuItem>
                  <MenuItem value="1d">1 Day</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small">
                <InputLabel>Cluster Threshold</InputLabel>
                <Select
                  value={settings.clusterThreshold}
                  label="Cluster Threshold"
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      clusterThreshold: Number(e.target.value),
                    })
                  }
                >
                  <MenuItem value={0.05}>Tight</MenuItem>
                  <MenuItem value={0.1}>Medium</MenuItem>
                  <MenuItem value={0.2}>Loose</MenuItem>
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
            </Box>
          </Box>
        </Grid>

        {loading && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}

        <Grid item xs={12}>
          {renderClusters()}
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={1}>
            {clusters.map((cluster, index) => (
              <Grid item key={index}>
                <Tooltip
                  title={
                    <Box>
                      <Typography variant="body2">
                        Volume: {cluster.volume.toFixed(2)}
                      </Typography>
                      <Typography variant="body2">
                        Trades: {cluster.trades}
                      </Typography>
                      <Typography variant="body2">
                        Strength: {(cluster.strength * 100).toFixed(1)}%
                      </Typography>
                    </Box>
                  }
                >
                  <Chip
                    icon={
                      cluster.type === 'accumulation' ? (
                        <TrendingUpIcon />
                      ) : cluster.type === 'distribution' ? (
                        <TrendingDownIcon />
                      ) : (
                        <ShowChartIcon />
                      )
                    }
                    label={`${cluster.price.toFixed(4)} (${
                      cluster.type.charAt(0).toUpperCase() + cluster.type.slice(1)
                    })`}
                    color={
                      cluster.type === 'accumulation'
                        ? 'success'
                        : cluster.type === 'distribution'
                        ? 'error'
                        : 'default'
                    }
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

export default ClusterAnalysis;
