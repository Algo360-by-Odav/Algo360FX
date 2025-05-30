import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  LinearProgress,
  Tooltip,
  useTheme,
  Tabs,
  Tab,
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Assessment as IndicatorIcon,
} from '@mui/icons-material';
import TradingChart from '../trading/TradingChart';
import MLPredictions from './MLPredictions';
import PatternRecognition from './PatternRecognition';
import EconomicCalendar from './EconomicCalendar';
import { useStores } from '../../stores/StoreProvider';
import { formatNumber, formatPercent } from '../../utils/formatters';

const timeframes = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '30m', label: '30 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1D', label: '1 Day' },
  { value: '1W', label: '1 Week' },
];

const symbols = [
  'EURUSD',
  'GBPUSD',
  'USDJPY',
  'AUDUSD',
  'USDCAD',
  'NZDUSD',
  'USDCHF',
];

const MarketAnalysis: React.FC = observer(() => {
  const { analysisStore } = useStores();
  const theme = useTheme();

  useEffect(() => {
    analysisStore.fetchMarketData(analysisStore.selectedSymbol);
  }, []);

  const handleRefresh = () => {
    analysisStore.fetchMarketData(analysisStore.selectedSymbol);
  };

  const handleTimeframeChange = (event: any) => {
    analysisStore.setTimeframe(event.target.value);
  };

  const handleSymbolChange = (event: any) => {
    analysisStore.setSelectedSymbol(event.target.value);
  };

  const renderMarketOverview = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ mb: 1 }}>Market Overview</Typography>
          {analysisStore.marketData.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {formatNumber(analysisStore.marketData[0].price)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: analysisStore.marketData[0].change >= 0
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {analysisStore.marketData[0].change >= 0 ? <TrendingIcon fontSize="small" /> : <TrendingIcon fontSize="small" />}
                    {formatNumber(Math.abs(analysisStore.marketData[0].change))} ({formatPercent(analysisStore.marketData[0].changePercent / 100)})
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">High</Typography>
                  <Typography variant="body1">{formatNumber(analysisStore.marketData[0].high)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Low</Typography>
                  <Typography variant="body1">{formatNumber(analysisStore.marketData[0].low)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Volume</Typography>
                  <Typography variant="body1">{formatNumber(analysisStore.marketData[0].volume)}</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Symbol</InputLabel>
            <Select
              value={analysisStore.selectedSymbol}
              onChange={handleSymbolChange}
              label="Symbol"
            >
              {symbols.map(symbol => (
                <MenuItem key={symbol} value={symbol}>{symbol}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={analysisStore.timeframe}
              onChange={handleTimeframeChange}
              label="Timeframe"
            >
              {timeframes.map(tf => (
                <MenuItem key={tf.value} value={tf.value}>{tf.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton onClick={handleRefresh} disabled={analysisStore.isLoading}>
            <TrendingIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );

  const renderTechnicalIndicators = () => (
    <Paper sx={{ p: 3, mb: 3, mt: 3, position: 'relative', zIndex: 1 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Technical Indicators
      </Typography>
      <Grid container spacing={2}>
        {analysisStore.technicalIndicators.map((indicator, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <IndicatorIcon sx={{ mr: 1 }} />
                  <Typography variant="subtitle1">{indicator.name}</Typography>
                </Box>
                <Typography variant="h5" sx={{ mb: 1 }}>
                  {formatNumber(indicator.value)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip
                    label={indicator.signal}
                    color={
                      indicator.signal === 'buy'
                        ? 'success'
                        : indicator.signal === 'sell'
                        ? 'error'
                        : 'default'
                    }
                    size="small"
                  />
                  {indicator.strength && (
                    <Tooltip title="Signal Strength">
                      <Box>
                        <CircularProgress
                          variant="determinate"
                          value={indicator.strength * 100}
                          size={24}
                          thickness={4}
                          sx={{
                            color: theme.palette.primary.main,
                          }}
                        />
                      </Box>
                    </Tooltip>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  const renderMarketSentiment = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Market Sentiment
      </Typography>
      {analysisStore.marketSentiment && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>Sentiment Distribution</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                  <Typography>Bullish: {formatPercent(analysisStore.marketSentiment.bullishPercent)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
                  <Typography>Bearish: {formatPercent(analysisStore.marketSentiment.bearishPercent)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingIcon sx={{ color: theme.palette.grey[500], mr: 1 }} />
                  <Typography>Neutral: {formatPercent(analysisStore.marketSentiment.neutralPercent)}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>Market Scores</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" gutterBottom>Social Score</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={analysisStore.marketSentiment.socialScore}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" gutterBottom>News Score</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={analysisStore.marketSentiment.newsScore}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>Market Conditions</Typography>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2">Volatility Index</Typography>
                  <Typography variant="h6">{formatNumber(analysisStore.marketSentiment.volatilityIndex)}</Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2">Market Momentum</Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: analysisStore.marketSentiment.marketMomentum > 0 
                        ? theme.palette.success.main 
                        : theme.palette.error.main 
                    }}
                  >
                    {formatNumber(analysisStore.marketSentiment.marketMomentum)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2">Trend Strength</Typography>
                  <Typography variant="h6">{formatNumber(analysisStore.marketSentiment.trendStrength)}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Paper>
  );

  return (
    <Container maxWidth={false}>
      {analysisStore.error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => analysisStore.clearError()}>
          {analysisStore.error}
        </Alert>
      )}
      {analysisStore.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {renderMarketOverview()}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ height: '500px', width: '100%', position: 'relative' }}>
              <TradingChart symbol={analysisStore.selectedSymbol} />
            </Box>
          </Paper>
          <MLPredictions />
          <PatternRecognition />
          <EconomicCalendar />
          {renderMarketSentiment()}
          {renderTechnicalIndicators()}
        </>
      )}
    </Container>
  );
});

export default MarketAnalysis;
