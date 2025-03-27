import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';
import { formatNumber, formatPercent } from '@/utils/formatters';

interface Pattern {
  id: string;
  name: string;
  type: 'bullish' | 'bearish' | 'continuation';
  timeframe: string;
  confidence: number;
  description: string;
  priceTarget: number;
  stopLoss: number;
  reliability: number;
  occurrence: {
    start: number;
    end: number;
  };
  historicalSuccess: number;
}

const PatternRecognition: React.FC = observer(() => {
  const { analysisStore } = useStores();
  const theme = useTheme();

  const patterns: Pattern[] = [
    {
      id: '1',
      name: 'Double Bottom',
      type: 'bullish',
      timeframe: '4h',
      confidence: 0.85,
      description: 'A bullish reversal pattern that forms after a downtrend',
      priceTarget: 1.2250,
      stopLoss: 1.2150,
      reliability: 0.82,
      occurrence: {
        start: 1.2180,
        end: 1.2200,
      },
      historicalSuccess: 0.78,
    },
    {
      id: '2',
      name: 'Head and Shoulders',
      type: 'bearish',
      timeframe: '1d',
      confidence: 0.92,
      description: 'A bearish reversal pattern indicating a trend change',
      priceTarget: 1.2050,
      stopLoss: 1.2150,
      reliability: 0.88,
      occurrence: {
        start: 1.2100,
        end: 1.2200,
      },
      historicalSuccess: 0.85,
    },
    {
      id: '3',
      name: 'Bull Flag',
      type: 'continuation',
      timeframe: '1h',
      confidence: 0.78,
      description: 'A bullish continuation pattern in an uptrend',
      priceTarget: 1.2300,
      stopLoss: 1.2200,
      reliability: 0.75,
      occurrence: {
        start: 1.2220,
        end: 1.2250,
      },
      historicalSuccess: 0.72,
    },
  ];

  const getPatternColor = (type: Pattern['type']) => {
    switch (type) {
      case 'bullish':
        return theme.palette.success.main;
      case 'bearish':
        return theme.palette.error.main;
      case 'continuation':
        return theme.palette.info.main;
      default:
        return theme.palette.text.primary;
    }
  };

  const renderPatternCard = (pattern: Pattern) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {pattern.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip
                label={pattern.type}
                size="small"
                sx={{ bgcolor: getPatternColor(pattern.type), color: 'white' }}
              />
              <Chip
                label={pattern.timeframe}
                size="small"
                variant="outlined"
              />
              <Chip
                icon={<StarIcon sx={{ fontSize: 16 }} />}
                label={`${formatPercent(pattern.confidence)} confidence`}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>
          <Tooltip title="Pattern Information">
            <IconButton size="small">
              <InfoIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {pattern.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Price Target
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: pattern.type === 'bearish' ? 'error.main' : 'success.main' }}
            >
              {formatNumber(pattern.priceTarget)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Stop Loss
            </Typography>
            <Typography variant="body1" color="error.main">
              {formatNumber(pattern.stopLoss)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Pattern Range
            </Typography>
            <Typography variant="body1">
              {formatNumber(pattern.occurrence.start)} - {formatNumber(pattern.occurrence.end)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="body2" color="text.secondary">
              Historical Success
            </Typography>
            <Typography variant="body1">
              {formatPercent(pattern.historicalSuccess)}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TimelineIcon sx={{ fontSize: 16 }} />
            Reliability Score: {formatPercent(pattern.reliability)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6">Pattern Recognition</Typography>
          <Typography variant="body2" color="text.secondary">
            Advanced chart pattern detection and analysis
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {patterns.map((pattern) => (
          <Grid item xs={12} md={4} key={pattern.id}>
            {renderPatternCard(pattern)}
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Pattern recognition is based on historical price action analysis. Always validate patterns with other technical indicators and fundamental analysis before making trading decisions.
        </Typography>
      </Box>
    </Paper>
  );
});

export default PatternRecognition;

