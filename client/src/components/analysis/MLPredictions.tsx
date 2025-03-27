import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
  IconButton,
  Chip,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';
import { formatNumber, formatPercent } from '@/utils/formatters';

interface PredictionModel {
  name: string;
  description: string;
  confidence: number;
  prediction: {
    direction: 'up' | 'down' | 'sideways';
    priceTarget: number;
    timeframe: string;
    probability: number;
  };
  performance: {
    accuracy: number;
    successRate: number;
    totalPredictions: number;
  };
}

const MLPredictions: React.FC = observer(() => {
  const { analysisStore } = useStores();
  const theme = useTheme();

  const models: PredictionModel[] = [
    {
      name: 'Deep Learning Model',
      description: 'LSTM-based deep learning model for price prediction',
      confidence: 0.85,
      prediction: {
        direction: 'up',
        priceTarget: 1.2150,
        timeframe: '4h',
        probability: 0.85,
      },
      performance: {
        accuracy: 0.82,
        successRate: 0.78,
        totalPredictions: 1250,
      },
    },
    {
      name: 'Pattern Recognition',
      description: 'CNN-based pattern recognition model',
      confidence: 0.78,
      prediction: {
        direction: 'down',
        priceTarget: 1.2080,
        timeframe: '1h',
        probability: 0.78,
      },
      performance: {
        accuracy: 0.75,
        successRate: 0.72,
        totalPredictions: 980,
      },
    },
    {
      name: 'Sentiment Analysis',
      description: 'NLP-based market sentiment analysis',
      confidence: 0.92,
      prediction: {
        direction: 'up',
        priceTarget: 1.2200,
        timeframe: '1d',
        probability: 0.92,
      },
      performance: {
        accuracy: 0.88,
        successRate: 0.85,
        totalPredictions: 750,
      },
    },
  ];

  const renderPredictionCard = (model: PredictionModel) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {model.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {model.description}
            </Typography>
          </Box>
          <Tooltip title="Model Information">
            <IconButton size="small">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="subtitle2">Prediction:</Typography>
            <Chip
              icon={model.prediction.direction === 'up' ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${model.prediction.direction.toUpperCase()} to ${formatNumber(model.prediction.priceTarget)}`}
              color={model.prediction.direction === 'up' ? 'success' : 'error'}
              size="small"
            />
            <Chip
              label={model.prediction.timeframe}
              variant="outlined"
              size="small"
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Confidence:
            </Typography>
            <Box sx={{ flexGrow: 1, ml: 1 }}>
              <LinearProgress
                variant="determinate"
                value={model.confidence * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.palette.grey[200],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: model.confidence >= 0.8
                      ? theme.palette.success.main
                      : model.confidence >= 0.6
                      ? theme.palette.warning.main
                      : theme.palette.error.main,
                  },
                }}
              />
            </Box>
            <Typography variant="body2">
              {formatPercent(model.confidence)}
            </Typography>
          </Box>
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Model Performance
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">
              Accuracy
            </Typography>
            <Typography variant="body1">
              {formatPercent(model.performance.accuracy)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">
              Success Rate
            </Typography>
            <Typography variant="body1">
              {formatPercent(model.performance.successRate)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="caption" color="text.secondary">
              Total Predictions
            </Typography>
            <Typography variant="body1">
              {model.performance.totalPredictions}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6">ML-Based Predictions</Typography>
          <Typography variant="body2" color="text.secondary">
            Advanced machine learning models for market prediction
          </Typography>
        </Box>
        <Tooltip title="Refresh Predictions">
          <IconButton>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {models.map((model, index) => (
          <Grid item xs={12} md={4} key={index}>
            {renderPredictionCard(model)}
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Note: ML predictions are based on historical data analysis and should be used in conjunction with other technical and fundamental analysis tools. Past performance does not guarantee future results.
        </Typography>
      </Box>
    </Paper>
  );
});

export default MLPredictions;

