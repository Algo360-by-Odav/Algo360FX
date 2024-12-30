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
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ShowChart as ShowChartIcon,
  Timeline as TimelineIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface CandlePattern {
  id: string;
  type: string;
  startIndex: number;
  endIndex: number;
  probability: number;
  description: string;
  significance: 'high' | 'medium' | 'low';
  trend: 'bullish' | 'bearish' | 'neutral';
}

interface PricePattern {
  id: string;
  type: string;
  points: { x: number; y: number }[];
  probability: number;
  description: string;
  trend: 'bullish' | 'bearish' | 'neutral';
}

interface TechnicalPattern {
  id: string;
  type: string;
  indicator: string;
  signal: 'buy' | 'sell' | 'neutral';
  probability: number;
  description: string;
}

interface PatternRecognitionProps {
  data: any[];
  onPatternSelect?: (pattern: any) => void;
}

const PatternRecognition: React.FC<PatternRecognitionProps> = ({
  data,
  onPatternSelect,
}) => {
  const [selectedPatterns, setSelectedPatterns] = React.useState<string[]>([]);
  const [patternTypes, setPatternTypes] = React.useState({
    candle: true,
    price: true,
    technical: true,
  });

  // Pattern Recognition Functions
  const recognizeCandlePatterns = (): CandlePattern[] => {
    const patterns: CandlePattern[] = [];

    // Helper function to check if a candle is bullish
    const isBullish = (candle: any) => candle.close > candle.open;

    // Helper function to check if a candle has long upper shadow
    const hasLongUpperShadow = (candle: any) => {
      const bodyLength = Math.abs(candle.close - candle.open);
      const upperShadow = candle.high - Math.max(candle.open, candle.close);
      return upperShadow > bodyLength * 1.5;
    };

    // Helper function to check if a candle has long lower shadow
    const hasLongLowerShadow = (candle: any) => {
      const bodyLength = Math.abs(candle.close - candle.open);
      const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
      return lowerShadow > bodyLength * 1.5;
    };

    // Detect Doji
    for (let i = 0; i < data.length; i++) {
      const candle = data[i];
      const bodyLength = Math.abs(candle.close - candle.open);
      const totalLength = candle.high - candle.low;

      if (bodyLength / totalLength < 0.1) {
        patterns.push({
          id: `doji_${i}`,
          type: 'Doji',
          startIndex: i,
          endIndex: i,
          probability: 0.8,
          description: 'Doji pattern indicates market indecision',
          significance: 'medium',
          trend: 'neutral',
        });
      }
    }

    // Detect Hammer
    for (let i = 0; i < data.length; i++) {
      const candle = data[i];
      if (hasLongLowerShadow(candle) && !hasLongUpperShadow(candle)) {
        patterns.push({
          id: `hammer_${i}`,
          type: 'Hammer',
          startIndex: i,
          endIndex: i,
          probability: 0.75,
          description: 'Hammer pattern indicates potential reversal from downtrend',
          significance: 'high',
          trend: 'bullish',
        });
      }
    }

    // Detect Engulfing Patterns
    for (let i = 1; i < data.length; i++) {
      const current = data[i];
      const previous = data[i - 1];

      // Bullish Engulfing
      if (
        !isBullish(previous) &&
        isBullish(current) &&
        current.open < previous.close &&
        current.close > previous.open
      ) {
        patterns.push({
          id: `bullish_engulfing_${i}`,
          type: 'Bullish Engulfing',
          startIndex: i - 1,
          endIndex: i,
          probability: 0.85,
          description: 'Bullish engulfing pattern indicates potential reversal',
          significance: 'high',
          trend: 'bullish',
        });
      }

      // Bearish Engulfing
      if (
        isBullish(previous) &&
        !isBullish(current) &&
        current.open > previous.close &&
        current.close < previous.open
      ) {
        patterns.push({
          id: `bearish_engulfing_${i}`,
          type: 'Bearish Engulfing',
          startIndex: i - 1,
          endIndex: i,
          probability: 0.85,
          description: 'Bearish engulfing pattern indicates potential reversal',
          significance: 'high',
          trend: 'bearish',
        });
      }
    }

    return patterns;
  };

  const recognizePricePatterns = (): PricePattern[] => {
    const patterns: PricePattern[] = [];

    // Helper function to find local maxima
    const findLocalMaxima = (window: number = 5) => {
      const maxima = [];
      for (let i = window; i < data.length - window; i++) {
        const current = data[i].high;
        const leftWindow = data.slice(i - window, i).map(d => d.high);
        const rightWindow = data.slice(i + 1, i + window + 1).map(d => d.high);
        if (
          current > Math.max(...leftWindow) &&
          current > Math.max(...rightWindow)
        ) {
          maxima.push({ index: i, value: current });
        }
      }
      return maxima;
    };

    // Helper function to find local minima
    const findLocalMinima = (window: number = 5) => {
      const minima = [];
      for (let i = window; i < data.length - window; i++) {
        const current = data[i].low;
        const leftWindow = data.slice(i - window, i).map(d => d.low);
        const rightWindow = data.slice(i + 1, i + window + 1).map(d => d.low);
        if (
          current < Math.min(...leftWindow) &&
          current < Math.min(...rightWindow)
        ) {
          minima.push({ index: i, value: current });
        }
      }
      return minima;
    };

    // Detect Double Top
    const maxima = findLocalMaxima();
    for (let i = 0; i < maxima.length - 1; i++) {
      const first = maxima[i];
      const second = maxima[i + 1];
      const priceDiff = Math.abs(first.value - second.value);
      const indexDiff = second.index - first.index;

      if (priceDiff / first.value < 0.02 && indexDiff > 10) {
        patterns.push({
          id: `double_top_${i}`,
          type: 'Double Top',
          points: [
            { x: first.index, y: first.value },
            { x: second.index, y: second.value },
          ],
          probability: 0.8,
          description: 'Double top pattern indicates potential reversal from uptrend',
          trend: 'bearish',
        });
      }
    }

    // Detect Double Bottom
    const minima = findLocalMinima();
    for (let i = 0; i < minima.length - 1; i++) {
      const first = minima[i];
      const second = minima[i + 1];
      const priceDiff = Math.abs(first.value - second.value);
      const indexDiff = second.index - first.index;

      if (priceDiff / first.value < 0.02 && indexDiff > 10) {
        patterns.push({
          id: `double_bottom_${i}`,
          type: 'Double Bottom',
          points: [
            { x: first.index, y: first.value },
            { x: second.index, y: second.value },
          ],
          probability: 0.8,
          description: 'Double bottom pattern indicates potential reversal from downtrend',
          trend: 'bullish',
        });
      }
    }

    return patterns;
  };

  const recognizeTechnicalPatterns = (): TechnicalPattern[] => {
    const patterns: TechnicalPattern[] = [];

    // Helper function to calculate RSI
    const calculateRSI = (period: number = 14) => {
      const changes = data.slice(1).map((d, i) => d.close - data[i].close);
      const gains = changes.map(c => Math.max(c, 0));
      const losses = changes.map(c => Math.abs(Math.min(c, 0)));

      const avgGain = gains.slice(0, period).reduce((a, b) => a + b) / period;
      const avgLoss = losses.slice(0, period).reduce((a, b) => a + b) / period;
      
      const rsi = [100 - (100 / (1 + avgGain / avgLoss))];

      for (let i = period; i < changes.length; i++) {
        const gain = gains[i];
        const loss = losses[i];
        const newAvgGain = (avgGain * (period - 1) + gain) / period;
        const newAvgLoss = (avgLoss * (period - 1) + loss) / period;
        rsi.push(100 - (100 / (1 + newAvgGain / newAvgLoss)));
      }

      return rsi;
    };

    // Detect RSI Divergence
    const rsi = calculateRSI();
    const priceHighs = data.map(d => d.high);
    const priceLows = data.map(d => d.low);

    for (let i = 30; i < data.length - 1; i++) {
      // Bearish RSI Divergence
      if (
        priceHighs[i] > priceHighs[i - 1] &&
        rsi[i] < rsi[i - 1]
      ) {
        patterns.push({
          id: `bearish_divergence_${i}`,
          type: 'Bearish RSI Divergence',
          indicator: 'RSI',
          signal: 'sell',
          probability: 0.75,
          description: 'Price making higher highs while RSI makes lower highs',
        });
      }

      // Bullish RSI Divergence
      if (
        priceLows[i] < priceLows[i - 1] &&
        rsi[i] > rsi[i - 1]
      ) {
        patterns.push({
          id: `bullish_divergence_${i}`,
          type: 'Bullish RSI Divergence',
          indicator: 'RSI',
          signal: 'buy',
          probability: 0.75,
          description: 'Price making lower lows while RSI makes higher lows',
        });
      }
    }

    return patterns;
  };

  const allPatterns = React.useMemo(() => {
    const patterns = {
      candle: patternTypes.candle ? recognizeCandlePatterns() : [],
      price: patternTypes.price ? recognizePricePatterns() : [],
      technical: patternTypes.technical ? recognizeTechnicalPatterns() : [],
    };
    return patterns;
  }, [data, patternTypes]);

  const renderPatternList = (
    patterns: (CandlePattern | PricePattern | TechnicalPattern)[],
    type: string
  ) => {
    return (
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          {type} Patterns
        </Typography>
        <Grid container spacing={1}>
          {patterns.map((pattern) => (
            <Grid item key={pattern.id}>
              <Tooltip title={pattern.description}>
                <Chip
                  icon={
                    'trend' in pattern ? (
                      pattern.trend === 'bullish' ? (
                        <TrendingUpIcon />
                      ) : (
                        <TrendingDownIcon />
                      )
                    ) : (
                      <ShowChartIcon />
                    )
                  }
                  label={pattern.type}
                  onClick={() => onPatternSelect?.(pattern)}
                  color={
                    'trend' in pattern
                      ? pattern.trend === 'bullish'
                        ? 'success'
                        : pattern.trend === 'bearish'
                        ? 'error'
                        : 'default'
                      : 'primary'
                  }
                  variant={selectedPatterns.includes(pattern.id) ? 'filled' : 'outlined'}
                />
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Pattern Recognition</Typography>
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={patternTypes.candle}
                    onChange={(e) =>
                      setPatternTypes({ ...patternTypes, candle: e.target.checked })
                    }
                  />
                }
                label="Candle"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={patternTypes.price}
                    onChange={(e) =>
                      setPatternTypes({ ...patternTypes, price: e.target.checked })
                    }
                  />
                }
                label="Price"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={patternTypes.technical}
                    onChange={(e) =>
                      setPatternTypes({ ...patternTypes, technical: e.target.checked })
                    }
                  />
                }
                label="Technical"
              />
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          {patternTypes.candle && renderPatternList(allPatterns.candle, 'Candlestick')}
          {patternTypes.price && renderPatternList(allPatterns.price, 'Price')}
          {patternTypes.technical && renderPatternList(allPatterns.technical, 'Technical')}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PatternRecognition;
