import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  Warning,
  Refresh,
  Settings,
  Download,
  Share,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import { MLInsights } from '../../../services/ml/MLInsights';
import { TimeFrame, MarketRegime } from '../../../types/market';
import { PredictionResult, ModelMetrics } from '../../../types/ml';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';

interface MLDashboardProps {
  mlInsights: MLInsights;
  symbols: string[];
  onModelUpdate: () => void;
}

const MLDashboard: React.FC<MLDashboardProps> = ({
  mlInsights,
  symbols,
  onModelUpdate,
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState(symbols[0]);
  const [timeframe, setTimeframe] = useState<TimeFrame>('1H');
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [regime, setRegime] = useState<MarketRegime | null>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    updateInsights();
  }, [selectedSymbol, timeframe]);

  const updateInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      // Train/update model if needed
      const metrics = await mlInsights.trainPricePredictionModel(
        selectedSymbol,
        timeframe
      );
      setModelMetrics(metrics);

      // Get predictions
      const prediction = await mlInsights.predictNextPriceMovement(
        selectedSymbol,
        timeframe
      );
      setPredictions((prev) => [...prev, prediction].slice(-100));

      // Get market regime
      const currentRegime = await mlInsights.detectMarketRegime(
        selectedSymbol,
        timeframe
      );
      setRegime(currentRegime);

      // Get anomalies
      const detectedAnomalies = await mlInsights.detectAnomalies(
        selectedSymbol,
        timeframe
      );
      setAnomalies(detectedAnomalies);

      onModelUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update insights');
    } finally {
      setLoading(false);
    }
  };

  const renderPredictionChart = () => (
    <Box sx={{ height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={predictions}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="prediction"
            stroke="#2196f3"
            name="Predicted"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#4caf50"
            name="Actual"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderConfidenceChart = () => (
    <Box sx={{ height: 200 }}>
      <ResponsiveContainer>
        <AreaChart data={predictions}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis domain={[0, 1]} />
          <RechartsTooltip />
          <Area
            type="monotone"
            dataKey="confidence"
            stroke="#ff9800"
            fill="#ff9800"
            fillOpacity={0.3}
            name="Prediction Confidence"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderAnomalyChart = () => (
    <Box sx={{ height: 300 }}>
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <RechartsTooltip />
          <Legend />
          <Scatter
            name="Anomalies"
            data={anomalies}
            fill="#f44336"
            shape="circle"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderModelMetrics = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Training Loss
          </Typography>
          <Typography variant="h6">
            {modelMetrics ? modelMetrics.trainLoss.toFixed(4) : '-'}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Validation Loss
          </Typography>
          <Typography variant="h6">
            {modelMetrics ? modelMetrics.validationLoss.toFixed(4) : '-'}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            Accuracy
          </Typography>
          <Typography variant="h6">
            {modelMetrics?.accuracy
              ? formatPercentage(modelMetrics.accuracy)
              : '-'}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary">
            R² Score
          </Typography>
          <Typography variant="h6">
            {modelMetrics?.r2Score ? modelMetrics.r2Score.toFixed(4) : '-'}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderRegimeAnalysis = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Market Regime Analysis
      </Typography>
      {regime && (
        <Box>
          <Box sx={{ mb: 2 }}>
            <Chip
              label={regime.regime}
              color={
                regime.regime === 'trending'
                  ? 'success'
                  : regime.regime === 'volatile'
                  ? 'error'
                  : 'warning'
              }
              sx={{ mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary" component="span">
              Confidence: {formatPercentage(regime.confidence)}
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Volatility
              </Typography>
              <Typography>
                {formatPercentage(regime.metrics.volatility)}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Persistence
              </Typography>
              <Typography>
                {formatPercentage(regime.metrics.persistence)}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Strength
              </Typography>
              <Typography>{formatPercentage(regime.metrics.strength)}</Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Paper>
  );

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5">ML Insights Dashboard</Typography>
        <Box>
          <IconButton onClick={() => updateInsights()}>
            <Refresh />
          </IconButton>
          <IconButton>
            <Download />
          </IconButton>
          <IconButton>
            <Share />
          </IconButton>
        </Box>
      </Box>

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Symbol</InputLabel>
              <Select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
              >
                {symbols.map((symbol) => (
                  <MenuItem key={symbol} value={symbol}>
                    {symbol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as TimeFrame)}
              >
                <MenuItem value="1m">1 Minute</MenuItem>
                <MenuItem value="5m">5 Minutes</MenuItem>
                <MenuItem value="15m">15 Minutes</MenuItem>
                <MenuItem value="1H">1 Hour</MenuItem>
                <MenuItem value="4H">4 Hours</MenuItem>
                <MenuItem value="1D">1 Day</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => updateInsights()}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <Refresh />}
            >
              Update Insights
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Status */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Content */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Price Predictions
            </Typography>
            {renderPredictionChart()}
            {renderConfidenceChart()}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Anomaly Detection
            </Typography>
            {renderAnomalyChart()}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          {renderRegimeAnalysis()}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Model Performance Metrics
          </Typography>
          {renderModelMetrics()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default MLDashboard;
