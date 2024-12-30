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
  LinearProgress,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as ShowChartIcon,
  Timeline as TimelineIcon,
  Psychology as PsychologyIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

// TensorFlow.js for ML computations
import * as tf from '@tensorflow/tfjs';

interface MLPattern {
  id: string;
  type: string;
  confidence: number;
  prediction: 'bullish' | 'bearish' | 'neutral';
  startIndex: number;
  endIndex: number;
  features: number[];
  metadata: {
    supportLevel?: number;
    resistanceLevel?: number;
    targetPrice?: number;
    stopLoss?: number;
    timeframe?: string;
  };
}

interface MLPatternDetectionProps {
  data: any[];
  onPatternSelect?: (pattern: MLPattern) => void;
  onPredictionUpdate?: (predictions: any) => void;
}

const MLPatternDetection: React.FC<MLPatternDetectionProps> = ({
  data,
  onPatternSelect,
  onPredictionUpdate,
}) => {
  const [models, setModels] = React.useState({
    cnn: {
      enabled: true,
      loaded: false,
      model: null as tf.LayersModel | null,
    },
    lstm: {
      enabled: true,
      loaded: false,
      model: null as tf.LayersModel | null,
    },
    transformer: {
      enabled: true,
      loaded: false,
      model: null as tf.LayersModel | null,
    },
  });

  const [patterns, setPatterns] = React.useState<MLPattern[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Load pre-trained models
  React.useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      setError(null);

      if (models.cnn.enabled && !models.cnn.loaded) {
        const cnnModel = await tf.loadLayersModel('/models/pattern_recognition_cnn.json');
        setModels(prev => ({
          ...prev,
          cnn: { ...prev.cnn, model: cnnModel, loaded: true },
        }));
      }

      if (models.lstm.enabled && !models.lstm.loaded) {
        const lstmModel = await tf.loadLayersModel('/models/pattern_recognition_lstm.json');
        setModels(prev => ({
          ...prev,
          lstm: { ...prev.lstm, model: lstmModel, loaded: true },
        }));
      }

      if (models.transformer.enabled && !models.transformer.loaded) {
        const transformerModel = await tf.loadLayersModel('/models/pattern_recognition_transformer.json');
        setModels(prev => ({
          ...prev,
          transformer: { ...prev.transformer, model: transformerModel, loaded: true },
        }));
      }
    } catch (err) {
      setError('Failed to load ML models: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Preprocess data for ML models
  const preprocessData = (windowSize: number = 20) => {
    const features = [];
    const windows = [];

    // Calculate technical indicators
    const calculateRSI = (prices: number[], period: number = 14) => {
      const changes = prices.slice(1).map((p, i) => p - prices[i]);
      const gains = changes.map(c => Math.max(c, 0));
      const losses = changes.map(c => Math.abs(Math.min(c, 0)));

      const avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
      const avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;

      return 100 - (100 / (1 + avgGain / avgLoss));
    };

    const calculateMACD = (prices: number[], short: number = 12, long: number = 26) => {
      const emaShort = tf.movingAverage(prices, short);
      const emaLong = tf.movingAverage(prices, long);
      return emaShort.sub(emaLong);
    };

    // Prepare sliding windows
    for (let i = windowSize; i < data.length; i++) {
      const window = data.slice(i - windowSize, i);
      const prices = window.map(d => d.close);
      
      // Calculate features
      const returns = prices.slice(1).map((p, j) => (p - prices[j]) / prices[j]);
      const volatility = tf.moments(returns).variance.arraySync();
      const rsi = calculateRSI(prices);
      const macd = calculateMACD(prices).arraySync();
      
      // Volume features
      const volumes = window.map(d => d.volume);
      const volumeChange = volumes.slice(1).map((v, j) => (v - volumes[j]) / volumes[j]);
      const avgVolume = volumes.reduce((a, b) => a + b) / volumes.length;

      // Price pattern features
      const priceRange = Math.max(...prices) - Math.min(...prices);
      const pricePosition = (prices[prices.length - 1] - Math.min(...prices)) / priceRange;

      features.push([
        ...returns,
        volatility,
        rsi,
        ...macd,
        ...volumeChange,
        avgVolume,
        priceRange,
        pricePosition,
      ]);

      windows.push(window);
    }

    return { features, windows };
  };

  // Run predictions using loaded models
  const runPredictions = async () => {
    try {
      setLoading(true);
      setError(null);

      const { features, windows } = preprocessData();
      const tensorFeatures = tf.tensor2d(features);

      const predictions: MLPattern[] = [];

      // CNN Predictions
      if (models.cnn.enabled && models.cnn.model) {
        const cnnPreds = await models.cnn.model.predict(tensorFeatures);
        const cnnResults = await processPredictions(cnnPreds, windows, 'CNN');
        predictions.push(...cnnResults);
      }

      // LSTM Predictions
      if (models.lstm.enabled && models.lstm.model) {
        const lstmPreds = await models.lstm.model.predict(tensorFeatures);
        const lstmResults = await processPredictions(lstmPreds, windows, 'LSTM');
        predictions.push(...lstmResults);
      }

      // Transformer Predictions
      if (models.transformer.enabled && models.transformer.model) {
        const transformerPreds = await models.transformer.model.predict(tensorFeatures);
        const transformerResults = await processPredictions(transformerPreds, windows, 'Transformer');
        predictions.push(...transformerResults);
      }

      // Filter and sort predictions
      const filteredPredictions = predictions
        .filter(p => p.confidence > 0.7)
        .sort((a, b) => b.confidence - a.confidence);

      setPatterns(filteredPredictions);
      onPredictionUpdate?.(filteredPredictions);

    } catch (err) {
      setError('Failed to run predictions: ' + err.message);
    } finally {
      setLoading(false);
      tensorFeatures?.dispose();
    }
  };

  const processPredictions = async (
    predictions: tf.Tensor,
    windows: any[][],
    modelType: string
  ): Promise<MLPattern[]> => {
    const predArray = await predictions.array();
    return predArray.map((pred: number[], i: number) => {
      const window = windows[i];
      const confidence = Math.max(...pred);
      const predictionIndex = pred.indexOf(confidence);

      const pattern: MLPattern = {
        id: `${modelType}_${i}`,
        type: getPredictionType(predictionIndex),
        confidence,
        prediction: getPredictionTrend(predictionIndex),
        startIndex: i,
        endIndex: i + window.length - 1,
        features: [],
        metadata: calculateMetadata(window, predictionIndex),
      };

      return pattern;
    });
  };

  const getPredictionType = (index: number): string => {
    const patterns = [
      'Head and Shoulders',
      'Double Top',
      'Double Bottom',
      'Triple Top',
      'Triple Bottom',
      'Ascending Triangle',
      'Descending Triangle',
      'Symmetrical Triangle',
      'Flag',
      'Pennant',
    ];
    return patterns[index] || 'Unknown';
  };

  const getPredictionTrend = (index: number): 'bullish' | 'bearish' | 'neutral' => {
    const bullishPatterns = [2, 4, 5, 8, 9];
    const bearishPatterns = [0, 1, 3, 6];
    return bullishPatterns.includes(index)
      ? 'bullish'
      : bearishPatterns.includes(index)
      ? 'bearish'
      : 'neutral';
  };

  const calculateMetadata = (window: any[], predictionIndex: number) => {
    const prices = window.map(d => d.close);
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const last = prices[prices.length - 1];

    return {
      supportLevel: low,
      resistanceLevel: high,
      targetPrice: getPredictionTrend(predictionIndex) === 'bullish'
        ? last + (high - low)
        : last - (high - low),
      stopLoss: getPredictionTrend(predictionIndex) === 'bullish'
        ? low
        : high,
      timeframe: '1H',
    };
  };

  const renderPatternList = () => {
    return (
      <Grid container spacing={1}>
        {patterns.map((pattern) => (
          <Grid item key={pattern.id}>
            <Tooltip
              title={
                <Box>
                  <Typography variant="subtitle2">{pattern.type}</Typography>
                  <Typography variant="body2">
                    Confidence: {(pattern.confidence * 100).toFixed(2)}%
                  </Typography>
                  <Typography variant="body2">
                    Target: {pattern.metadata.targetPrice?.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    Stop Loss: {pattern.metadata.stopLoss?.toFixed(2)}
                  </Typography>
                </Box>
              }
            >
              <Chip
                icon={
                  pattern.prediction === 'bullish' ? (
                    <TrendingUpIcon />
                  ) : pattern.prediction === 'bearish' ? (
                    <TrendingDownIcon />
                  ) : (
                    <ShowChartIcon />
                  )
                }
                label={`${pattern.type} (${(pattern.confidence * 100).toFixed(0)}%)`}
                onClick={() => onPatternSelect?.(pattern)}
                color={
                  pattern.prediction === 'bullish'
                    ? 'success'
                    : pattern.prediction === 'bearish'
                    ? 'error'
                    : 'default'
                }
                variant="outlined"
              />
            </Tooltip>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">ML Pattern Detection</Typography>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={models.cnn.enabled}
                    onChange={(e) =>
                      setModels(prev => ({
                        ...prev,
                        cnn: { ...prev.cnn, enabled: e.target.checked },
                      }))
                    }
                  />
                }
                label="CNN"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={models.lstm.enabled}
                    onChange={(e) =>
                      setModels(prev => ({
                        ...prev,
                        lstm: { ...prev.lstm, enabled: e.target.checked },
                      }))
                    }
                  />
                }
                label="LSTM"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={models.transformer.enabled}
                    onChange={(e) =>
                      setModels(prev => ({
                        ...prev,
                        transformer: { ...prev.transformer, enabled: e.target.checked },
                      }))
                    }
                  />
                }
                label="Transformer"
              />
            </Box>
          </Box>
        </Grid>

        {loading && (
          <Grid item xs={12}>
            <LinearProgress />
          </Grid>
        )}

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          {renderPatternList()}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MLPatternDetection;
