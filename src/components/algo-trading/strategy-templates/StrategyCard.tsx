import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BarChartIcon from '@mui/icons-material/BarChart';
import {
  StrategyCategory,
  RiskLevel,
  TimeHorizon,
  ComplexityLevel,
  MarketCondition,
  StrategyMetadata,
} from '../../../types/strategy-categories';
import { TradingStrategy } from '../../../types/algo-trading';
import { formatPercentage } from '../../../utils/formatters';

interface StrategyCardProps {
  strategy: TradingStrategy;
  metadata: StrategyMetadata;
  onSelect: (strategy: TradingStrategy) => void;
  onViewBacktest: (strategy: TradingStrategy) => void;
  onClone: (strategy: TradingStrategy) => void;
  onShare: (strategy: TradingStrategy) => void;
  onToggleFavorite: (strategy: TradingStrategy) => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  metadata,
  onSelect,
  onViewBacktest,
  onClone,
  onShare,
  onToggleFavorite,
}) => {
  const getCategoryColor = (category: StrategyCategory): string => {
    const colors: Record<StrategyCategory, string> = {
      [StrategyCategory.TREND_FOLLOWING]: '#4CAF50',
      [StrategyCategory.MEAN_REVERSION]: '#2196F3',
      [StrategyCategory.BREAKOUT]: '#F44336',
      [StrategyCategory.MOMENTUM]: '#9C27B0',
      [StrategyCategory.VOLATILITY]: '#FF9800',
      [StrategyCategory.VOLUME_BASED]: '#607D8B',
      [StrategyCategory.PATTERN_RECOGNITION]: '#795548',
      [StrategyCategory.ML_BASED]: '#E91E63',
      [StrategyCategory.ARBITRAGE]: '#00BCD4',
      [StrategyCategory.GRID_TRADING]: '#3F51B5',
      [StrategyCategory.SCALPING]: '#FF5722',
      [StrategyCategory.SWING_TRADING]: '#8BC34A',
      [StrategyCategory.POSITION_TRADING]: '#673AB7',
    };
    return colors[category];
  };

  const getRiskColor = (risk: RiskLevel): string => {
    const colors: Record<RiskLevel, string> = {
      [RiskLevel.CONSERVATIVE]: '#4CAF50',
      [RiskLevel.MODERATE]: '#FFC107',
      [RiskLevel.AGGRESSIVE]: '#F44336',
    };
    return colors[risk];
  };

  const getComplexityColor = (complexity: ComplexityLevel): string => {
    const colors: Record<ComplexityLevel, string> = {
      [ComplexityLevel.BEGINNER]: '#4CAF50',
      [ComplexityLevel.INTERMEDIATE]: '#2196F3',
      [ComplexityLevel.ADVANCED]: '#FFC107',
      [ComplexityLevel.EXPERT]: '#F44336',
    };
    return colors[complexity];
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="div">
            {strategy.name}
          </Typography>
          <Rating value={metadata.rating} readOnly size="small" />
        </Box>

        {/* Categories and Tags */}
        <Box sx={{ mb: 2 }}>
          <Chip
            label={metadata.category}
            size="small"
            sx={{
              mr: 1,
              mb: 1,
              bgcolor: getCategoryColor(metadata.category),
              color: 'white',
            }}
          />
          <Chip
            label={metadata.riskLevel}
            size="small"
            sx={{
              mr: 1,
              mb: 1,
              bgcolor: getRiskColor(metadata.riskLevel),
              color: 'white',
            }}
          />
          <Chip
            label={metadata.complexityLevel}
            size="small"
            sx={{
              mr: 1,
              mb: 1,
              bgcolor: getComplexityColor(metadata.complexityLevel),
              color: 'white',
            }}
          />
          {metadata.tags.slice(0, 2).map((tag) => (
            <Tooltip key={tag.id} title={tag.description}>
              <Chip
                label={tag.name}
                size="small"
                sx={{ mr: 1, mb: 1 }}
                variant="outlined"
              />
            </Tooltip>
          ))}
          {metadata.tags.length > 2 && (
            <Tooltip
              title={metadata.tags
                .slice(2)
                .map((tag) => tag.name)
                .join(', ')}
            >
              <Chip
                label={`+${metadata.tags.length - 2}`}
                size="small"
                sx={{ mb: 1 }}
                variant="outlined"
              />
            </Tooltip>
          )}
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {strategy.description}
        </Typography>

        {/* Performance Metrics */}
        {metadata.backtestResults && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Performance Metrics
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Tooltip title="Win Rate">
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Win Rate
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={metadata.backtestResults.winRate}
                      sx={{ mb: 0.5 }}
                    />
                    <Typography variant="body2">
                      {formatPercentage(metadata.backtestResults.winRate)}
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <Tooltip title="Profit Factor">
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Profit Factor
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={
                        (metadata.backtestResults.profitFactor / 3) * 100
                      }
                      sx={{ mb: 0.5 }}
                    />
                    <Typography variant="body2">
                      {metadata.backtestResults.profitFactor.toFixed(2)}
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <Tooltip title="Sharpe Ratio">
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Sharpe Ratio
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={(metadata.backtestResults.sharpeRatio / 3) * 100}
                      sx={{ mb: 0.5 }}
                    />
                    <Typography variant="body2">
                      {metadata.backtestResults.sharpeRatio.toFixed(2)}
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>
              <Grid item xs={6}>
                <Tooltip title="Max Drawdown">
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Max Drawdown
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={metadata.backtestResults.maxDrawdown}
                      sx={{ mb: 0.5 }}
                      color="error"
                    />
                    <Typography variant="body2">
                      {formatPercentage(metadata.backtestResults.maxDrawdown)}
                    </Typography>
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Popularity */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Popularity:
          </Typography>
          <Rating
            value={metadata.popularity / 20}
            readOnly
            size="small"
            max={5}
          />
          <Typography variant="caption" color="text.secondary">
            ({metadata.reviewCount} reviews)
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Box>
          <IconButton
            size="small"
            onClick={() => onToggleFavorite(strategy)}
            color="primary"
          >
            <FavoriteIcon />
          </IconButton>
          <IconButton size="small" onClick={() => onShare(strategy)}>
            <ShareIcon />
          </IconButton>
          <IconButton size="small" onClick={() => onClone(strategy)}>
            <ContentCopyIcon />
          </IconButton>
          <IconButton size="small" onClick={() => onViewBacktest(strategy)}>
            <BarChartIcon />
          </IconButton>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={() => onSelect(strategy)}
        >
          Select Strategy
        </Button>
      </CardActions>
    </Card>
  );
};

export default StrategyCard;
