import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ModelType, MLModel, LearningConfig } from '../../../types/ml';
import { Timeframe } from '../../../types/trading';
import { useAlgoTradingStore } from '../../../stores/AlgoTradingStore';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';

const MLStrategyBuilder: React.FC = () => {
  const algoTradingStore = useAlgoTradingStore();
  const [config, setConfig] = useState<Partial<LearningConfig>>({
    timeframe: Timeframe.H1,
    lookbackPeriod: 20,
    maxHoldingPeriod: 10,
    minProfitThreshold: 0.02,
    minPatternSignificance: 0.7,
    minExitReliability: 0.6,
    maxDrawdown: 0.1,
    riskParameters: {
      maxPositionSize: 0.02,
      stopLossRange: [0.01, 0.05],
      takeProfitRange: [0.02, 0.1],
    },
  });
  const [modelType, setModelType] = useState<ModelType>(ModelType.RANDOM_FOREST);
  const [isLearning, setIsLearning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<MLModel | null>(null);

  const handleLearn = async () => {
    try {
      setError(null);
      setIsLearning(true);
      setProgress(0);

      // Start the learning process
      const learningResult = await algoTradingStore.learnStrategy(
        config as LearningConfig,
        modelType,
        (progress) => setProgress(progress)
      );

      setModel(learningResult.model);
      setIsLearning(false);
    } catch (err) {
      setError(err.message);
      setIsLearning(false);
    }
  };

  const renderConfigurationForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Model Type</InputLabel>
          <Select
            value={modelType}
            onChange={(e) => setModelType(e.target.value as ModelType)}
          >
            <MenuItem value={ModelType.RANDOM_FOREST}>Random Forest</MenuItem>
            <MenuItem value={ModelType.GRADIENT_BOOST}>Gradient Boost</MenuItem>
            <MenuItem value={ModelType.NEURAL_NETWORK}>Neural Network</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <FormControl fullWidth>
          <InputLabel>Timeframe</InputLabel>
          <Select
            value={config.timeframe}
            onChange={(e) =>
              setConfig({ ...config, timeframe: e.target.value as Timeframe })
            }
          >
            <MenuItem value={Timeframe.M1}>1 Minute</MenuItem>
            <MenuItem value={Timeframe.M5}>5 Minutes</MenuItem>
            <MenuItem value={Timeframe.M15}>15 Minutes</MenuItem>
            <MenuItem value={Timeframe.M30}>30 Minutes</MenuItem>
            <MenuItem value={Timeframe.H1}>1 Hour</MenuItem>
            <MenuItem value={Timeframe.H4}>4 Hours</MenuItem>
            <MenuItem value={Timeframe.D1}>1 Day</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Lookback Period"
          type="number"
          value={config.lookbackPeriod}
          onChange={(e) =>
            setConfig({ ...config, lookbackPeriod: parseInt(e.target.value) })
          }
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Max Holding Period"
          type="number"
          value={config.maxHoldingPeriod}
          onChange={(e) =>
            setConfig({ ...config, maxHoldingPeriod: parseInt(e.target.value) })
          }
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Min Profit Threshold"
          type="number"
          inputProps={{ step: 0.01 }}
          value={config.minProfitThreshold}
          onChange={(e) =>
            setConfig({ ...config, minProfitThreshold: parseFloat(e.target.value) })
          }
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Pattern Significance"
          type="number"
          inputProps={{ step: 0.1, min: 0, max: 1 }}
          value={config.minPatternSignificance}
          onChange={(e) =>
            setConfig({
              ...config,
              minPatternSignificance: parseFloat(e.target.value),
            })
          }
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Exit Reliability"
          type="number"
          inputProps={{ step: 0.1, min: 0, max: 1 }}
          value={config.minExitReliability}
          onChange={(e) =>
            setConfig({
              ...config,
              minExitReliability: parseFloat(e.target.value),
            })
          }
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <TextField
          fullWidth
          label="Max Drawdown"
          type="number"
          inputProps={{ step: 0.01 }}
          value={config.maxDrawdown}
          onChange={(e) =>
            setConfig({ ...config, maxDrawdown: parseFloat(e.target.value) })
          }
        />
      </Grid>

      {/* Risk Parameters */}
      <Grid item xs={12}>
        <Typography variant="subtitle2" gutterBottom>
          Risk Parameters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Max Position Size"
              type="number"
              inputProps={{ step: 0.01 }}
              value={config.riskParameters?.maxPositionSize}
              onChange={(e) =>
                setConfig({
                  ...config,
                  riskParameters: {
                    ...config.riskParameters!,
                    maxPositionSize: parseFloat(e.target.value),
                  },
                })
              }
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Stop Loss Range"
              type="text"
              value={`${config.riskParameters?.stopLossRange?.[0]}-${config.riskParameters?.stopLossRange?.[1]}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split('-').map(Number);
                setConfig({
                  ...config,
                  riskParameters: {
                    ...config.riskParameters!,
                    stopLossRange: [min, max],
                  },
                });
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Take Profit Range"
              type="text"
              value={`${config.riskParameters?.takeProfitRange?.[0]}-${config.riskParameters?.takeProfitRange?.[1]}`}
              onChange={(e) => {
                const [min, max] = e.target.value.split('-').map(Number);
                setConfig({
                  ...config,
                  riskParameters: {
                    ...config.riskParameters!,
                    takeProfitRange: [min, max],
                  },
                });
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderResults = () => {
    if (!model) return null;

    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Model Performance
        </Typography>

        <Grid container spacing={3}>
          {/* Metrics */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Model Metrics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Accuracy
                  </Typography>
                  <Typography variant="h6">
                    {formatPercentage(model.metrics.accuracy)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Precision
                  </Typography>
                  <Typography variant="h6">
                    {formatPercentage(model.metrics.precision)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    Recall
                  </Typography>
                  <Typography variant="h6">
                    {formatPercentage(model.metrics.recall)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    F1 Score
                  </Typography>
                  <Typography variant="h6">
                    {model.metrics.f1Score.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Feature Importance */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Feature Importance
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={model.parameters.featureImportance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="importance"
                      stroke="#8884d8"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          ML Strategy Builder
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {renderConfigurationForm()}

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleLearn}
            disabled={isLearning}
            sx={{ mr: 2 }}
          >
            {isLearning ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Learning... {progress}%
              </>
            ) : (
              'Start Learning'
            )}
          </Button>
        </Box>

        {renderResults()}
      </Paper>
    </Box>
  );
};

export default MLStrategyBuilder;
