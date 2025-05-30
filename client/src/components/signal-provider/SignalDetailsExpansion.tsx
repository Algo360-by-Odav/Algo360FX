import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Divider,
  Chip,
  IconButton,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  TrendingUp,
  TrendingDown,
  ShowChart,
  Timeline,
  ArrowUpward,
  ArrowDownward,
  Info,
  Share,
  Bookmark,
  BookmarkBorder,
  Comment,
} from '@mui/icons-material';
import { useStores } from '../../stores/storeProviderJs';

// Mock chart image URLs (in a real app, these would be generated dynamically)
const mockChartImages = {
  'EUR/USD': 'https://www.tradingview.com/x/ABCDEFGH/',
  'GBP/USD': 'https://www.tradingview.com/x/IJKLMNOP/',
  'USD/JPY': 'https://www.tradingview.com/x/QRSTUVWX/',
};

// Mock technical analysis for signals
const mockTechnicalAnalysis = {
  'EUR/USD': {
    trend: 'Bullish',
    keyLevels: [
      { type: 'Resistance', price: 1.0980, strength: 'Strong' },
      { type: 'Resistance', price: 1.1020, strength: 'Major' },
      { type: 'Support', price: 1.0880, strength: 'Strong' },
      { type: 'Support', price: 1.0840, strength: 'Major' },
    ],
    indicators: [
      { name: 'RSI (14)', value: '58', interpretation: 'Neutral with bullish bias' },
      { name: 'MACD', value: 'Positive', interpretation: 'Bullish momentum' },
      { name: 'Moving Averages', value: 'Above 50 & 200 EMA', interpretation: 'Bullish trend' },
    ],
    patterns: [
      { name: 'Double Bottom', timeframe: 'H4', significance: 'High' },
      { name: 'Golden Cross', timeframe: 'Daily', significance: 'Medium' },
    ],
    fundamentals: 'EUR strengthening due to hawkish ECB stance. USD under pressure from dovish Fed comments.',
  },
  'GBP/USD': {
    trend: 'Bearish',
    keyLevels: [
      { type: 'Resistance', price: 1.2695, strength: 'Strong' },
      { type: 'Resistance', price: 1.2730, strength: 'Major' },
      { type: 'Support', price: 1.2590, strength: 'Strong' },
      { type: 'Support', price: 1.2550, strength: 'Major' },
    ],
    indicators: [
      { name: 'RSI (14)', value: '42', interpretation: 'Neutral with bearish bias' },
      { name: 'MACD', value: 'Negative', interpretation: 'Bearish momentum' },
      { name: 'Moving Averages', value: 'Below 50 EMA', interpretation: 'Short-term bearish' },
    ],
    patterns: [
      { name: 'Head and Shoulders', timeframe: 'H4', significance: 'High' },
      { name: 'Death Cross', timeframe: 'H1', significance: 'Medium' },
    ],
    fundamentals: 'GBP weakening due to poor economic data. USD gaining on safe-haven flows.',
  },
  'USD/JPY': {
    trend: 'Bullish',
    keyLevels: [
      { type: 'Resistance', price: 153.90, strength: 'Strong' },
      { type: 'Resistance', price: 154.20, strength: 'Major' },
      { type: 'Support', price: 153.10, strength: 'Strong' },
      { type: 'Support', price: 152.80, strength: 'Major' },
    ],
    indicators: [
      { name: 'RSI (14)', value: '62', interpretation: 'Bullish but approaching overbought' },
      { name: 'MACD', value: 'Positive', interpretation: 'Strong bullish momentum' },
      { name: 'Moving Averages', value: 'Above all major MAs', interpretation: 'Strong uptrend' },
    ],
    patterns: [
      { name: 'Bull Flag', timeframe: 'H4', significance: 'High' },
      { name: 'Ascending Triangle', timeframe: 'Daily', significance: 'High' },
    ],
    fundamentals: 'Widening interest rate differential between US and Japan supporting USD/JPY upside.',
  },
};

// Mock alternative entry/exit points
const mockAlternativePoints = {
  'EUR/USD': {
    entries: [
      { price: 1.0905, condition: 'On pullback to 38.2% Fibonacci retracement', timeframe: 'H1' },
      { price: 1.0890, condition: 'On retest of broken resistance', timeframe: 'H4' },
    ],
    exits: [
      { price: 1.0950, condition: 'At 61.8% Fibonacci extension', timeframe: 'H4' },
      { price: 1.1050, condition: 'At previous swing high', timeframe: 'Daily' },
    ],
    stopLoss: [
      { price: 1.0870, condition: 'Below recent swing low', timeframe: 'H4' },
      { price: 1.0850, condition: 'Below key support zone', timeframe: 'Daily' },
    ],
  },
  'GBP/USD': {
    entries: [
      { price: 1.2670, condition: 'On retest of broken support as resistance', timeframe: 'H1' },
      { price: 1.2685, condition: 'On bearish reversal pattern completion', timeframe: 'H4' },
    ],
    exits: [
      { price: 1.2600, condition: 'At 50% Fibonacci retracement', timeframe: 'H4' },
      { price: 1.2540, condition: 'At previous swing low', timeframe: 'Daily' },
    ],
    stopLoss: [
      { price: 1.2710, condition: 'Above recent swing high', timeframe: 'H4' },
      { price: 1.2730, condition: 'Above key resistance zone', timeframe: 'Daily' },
    ],
  },
  'USD/JPY': {
    entries: [
      { price: 153.25, condition: 'On pullback to 20 EMA', timeframe: 'H1' },
      { price: 153.15, condition: 'On retest of breakout level', timeframe: 'H4' },
    ],
    exits: [
      { price: 154.00, condition: 'At psychological level', timeframe: 'H4' },
      { price: 154.50, condition: 'At 127% Fibonacci extension', timeframe: 'Daily' },
    ],
    stopLoss: [
      { price: 152.90, condition: 'Below recent swing low', timeframe: 'H4' },
      { price: 152.70, condition: 'Below key support zone', timeframe: 'Daily' },
    ],
  },
};

// Interface for signal details props
interface SignalDetailsProps {
  signal: any;
}

export const SignalDetailsExpansion = observer(({ signal }: SignalDetailsProps) => {
  const { signalProviderStore } = useStores();
  const provider = signalProviderStore.getProviderById(signal.providerId);
  
  // State for expanded sections
  const [expanded, setExpanded] = useState(false);
  const [chartDialogOpen, setChartDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [savedToWatchlist, setSavedToWatchlist] = useState(false);
  
  // Technical analysis for this signal
  const technicalAnalysis = mockTechnicalAnalysis[signal.pair] || mockTechnicalAnalysis['EUR/USD'];
  
  // Alternative entry/exit points
  const alternativePoints = mockAlternativePoints[signal.pair] || mockAlternativePoints['EUR/USD'];
  
  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };
  
  // Open chart dialog
  const handleOpenChartDialog = () => {
    setChartDialogOpen(true);
  };
  
  // Close chart dialog
  const handleCloseChartDialog = () => {
    setChartDialogOpen(false);
  };
  
  // Open comment dialog
  const handleOpenCommentDialog = () => {
    setCommentDialogOpen(true);
  };
  
  // Close comment dialog
  const handleCloseCommentDialog = () => {
    setCommentDialogOpen(false);
  };
  
  // Submit comment
  const handleSubmitComment = () => {
    console.log('Submitting comment:', commentText);
    setCommentDialogOpen(false);
    setCommentText('');
  };
  
  // Toggle watchlist
  const toggleWatchlist = () => {
    setSavedToWatchlist(!savedToWatchlist);
  };
  
  // Format price with appropriate decimal places
  const formatPrice = (price: number) => {
    return signal.pair.includes('JPY') ? price.toFixed(2) : price.toFixed(4);
  };
  
  // Calculate profit/loss percentage
  const calculatePLPercentage = () => {
    const riskAmount = 100; // Assuming $100 risk per trade
    return ((signal.profit / riskAmount) * 100).toFixed(2);
  };
  
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        {/* Signal Header */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h6" component="div" sx={{ mr: 1 }}>
                {signal.pair}
              </Typography>
              <Chip
                label={signal.type}
                color={signal.type === 'BUY' ? 'success' : 'error'}
                size="small"
                icon={signal.type === 'BUY' ? <ArrowUpward /> : <ArrowDownward />}
              />
              <Chip
                label={`${signal.confidence}% Confidence`}
                color={signal.confidence > 70 ? 'success' : signal.confidence > 50 ? 'warning' : 'error'}
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              From: {provider?.name} • {new Date(signal.openTime).toLocaleString()}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, alignItems: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<ShowChart />}
                onClick={handleOpenChartDialog}
                sx={{ mr: 1 }}
              >
                View Chart
              </Button>
              <IconButton onClick={toggleWatchlist} color={savedToWatchlist ? 'primary' : 'default'}>
                {savedToWatchlist ? <Bookmark /> : <BookmarkBorder />}
              </IconButton>
              <IconButton onClick={handleOpenCommentDialog}>
                <Comment />
              </IconButton>
              <IconButton>
                <Share />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        
        {/* Signal Details */}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" color="text.secondary">Entry Price</Typography>
            <Typography variant="body1">{formatPrice(signal.entryPrice)}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" color="text.secondary">Stop Loss</Typography>
            <Typography variant="body1">{formatPrice(signal.stopLoss)}</Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" color="text.secondary">Take Profit</Typography>
            <Typography variant="body1">
              {signal.takeProfit.map((tp: number) => formatPrice(tp)).join(' / ')}
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="body2" color="text.secondary">Risk/Reward</Typography>
            <Typography variant="body1">1:{signal.riskReward}</Typography>
          </Grid>
        </Grid>
        
        {/* Current Performance */}
        <Paper sx={{ p: 1.5, mt: 2, bgcolor: 'action.hover' }}>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">Pips</Typography>
              <Typography 
                variant="body1" 
                color={signal.pips > 0 ? 'success.main' : signal.pips < 0 ? 'error.main' : 'text.primary'}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {signal.pips > 0 && '+'}{signal.pips}
                {signal.pips > 0 ? <TrendingUp fontSize="small" sx={{ ml: 0.5 }} /> : 
                 signal.pips < 0 ? <TrendingDown fontSize="small" sx={{ ml: 0.5 }} /> : null}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">Profit/Loss</Typography>
              <Typography 
                variant="body1" 
                color={signal.profit > 0 ? 'success.main' : signal.profit < 0 ? 'error.main' : 'text.primary'}
              >
                {signal.profit > 0 && '+'}${signal.profit}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">Return</Typography>
              <Typography 
                variant="body1" 
                color={signal.profit > 0 ? 'success.main' : signal.profit < 0 ? 'error.main' : 'text.primary'}
              >
                {signal.profit > 0 && '+'}{calculatePLPercentage()}%
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Expand/Collapse Button */}
        <Button
          fullWidth
          onClick={toggleExpanded}
          endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
          sx={{ mt: 2 }}
        >
          {expanded ? 'Hide Details' : 'Show Analysis & Alternative Entries'}
        </Button>
        
        {/* Expanded Content */}
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <Divider sx={{ mb: 2 }} />
            
            {/* Technical Analysis */}
            <Typography variant="subtitle1" gutterBottom>
              Technical Analysis
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Trend Analysis
                </Typography>
                <Typography variant="body1" paragraph>
                  The overall trend for {signal.pair} is <strong>{technicalAnalysis.trend}</strong>. 
                  {signal.type === 'BUY' 
                    ? ' Price action shows bullish momentum with higher highs and higher lows forming on the chart.'
                    : ' Price action shows bearish momentum with lower highs and lower lows forming on the chart.'}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Key Indicators
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Indicator</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Interpretation</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {technicalAnalysis.indicators.map((indicator, index) => (
                        <TableRow key={index}>
                          <TableCell>{indicator.name}</TableCell>
                          <TableCell>{indicator.value}</TableCell>
                          <TableCell>{indicator.interpretation}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Chart Patterns
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Pattern</TableCell>
                        <TableCell>Timeframe</TableCell>
                        <TableCell>Significance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {technicalAnalysis.patterns.map((pattern, index) => (
                        <TableRow key={index}>
                          <TableCell>{pattern.name}</TableCell>
                          <TableCell>{pattern.timeframe}</TableCell>
                          <TableCell>{pattern.significance}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Support & Resistance Levels
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Type</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Strength</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {technicalAnalysis.keyLevels.map((level, index) => (
                        <TableRow key={index}>
                          <TableCell>{level.type}</TableCell>
                          <TableCell>{formatPrice(level.price)}</TableCell>
                          <TableCell>{level.strength}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Fundamental Analysis
                </Typography>
                <Paper variant="outlined" sx={{ p: 1.5, mb: 2 }}>
                  <Typography variant="body2">
                    {technicalAnalysis.fundamentals}
                  </Typography>
                </Paper>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Trade Rationale
                </Typography>
                <Paper variant="outlined" sx={{ p: 1.5 }}>
                  <Typography variant="body2">
                    {signal.type === 'BUY' 
                      ? `This BUY signal is based on the ${technicalAnalysis.trend.toLowerCase()} trend confirmation with strong support at ${formatPrice(signal.stopLoss)}. The ${technicalAnalysis.patterns[0].name} pattern on the ${technicalAnalysis.patterns[0].timeframe} timeframe provides additional confirmation. Multiple take profit levels allow for partial profit taking while letting winners run.`
                      : `This SELL signal is based on the ${technicalAnalysis.trend.toLowerCase()} trend confirmation with strong resistance at ${formatPrice(signal.stopLoss)}. The ${technicalAnalysis.patterns[0].name} pattern on the ${technicalAnalysis.patterns[0].timeframe} timeframe provides additional confirmation. Multiple take profit levels allow for partial profit taking while letting winners run.`}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Alternative Entry/Exit Points */}
            <Typography variant="subtitle1" gutterBottom>
              Alternative Entry/Exit Points
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Alternative Entries
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Price</TableCell>
                        <TableCell>Condition</TableCell>
                        <TableCell>TF</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {alternativePoints.entries.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{formatPrice(entry.price)}</TableCell>
                          <TableCell>{entry.condition}</TableCell>
                          <TableCell>{entry.timeframe}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Alternative Take Profits
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Price</TableCell>
                        <TableCell>Condition</TableCell>
                        <TableCell>TF</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {alternativePoints.exits.map((exit, index) => (
                        <TableRow key={index}>
                          <TableCell>{formatPrice(exit.price)}</TableCell>
                          <TableCell>{exit.condition}</TableCell>
                          <TableCell>{exit.timeframe}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Alternative Stop Losses
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Price</TableCell>
                        <TableCell>Condition</TableCell>
                        <TableCell>TF</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {alternativePoints.stopLoss.map((sl, index) => (
                        <TableRow key={index}>
                          <TableCell>{formatPrice(sl.price)}</TableCell>
                          <TableCell>{sl.condition}</TableCell>
                          <TableCell>{sl.timeframe}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ShowChart />}
                onClick={handleOpenChartDialog}
              >
                View Full Chart Analysis
              </Button>
            </Box>
          </Box>
        </Collapse>
      </CardContent>
      
      {/* Chart Dialog */}
      <Dialog open={chartDialogOpen} onClose={handleCloseChartDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {signal.pair} {signal.type} Signal Chart
            </Typography>
            <Box>
              <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
                <InputLabel>Timeframe</InputLabel>
                <Select
                  value="H4"
                  label="Timeframe"
                >
                  <MenuItem value="M15">M15</MenuItem>
                  <MenuItem value="H1">H1</MenuItem>
                  <MenuItem value="H4">H4</MenuItem>
                  <MenuItem value="D1">D1</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Timeline />}
              >
                Indicators
              </Button>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {/* Placeholder for chart - in a real app, this would be a TradingView chart or similar */}
          <Box
            sx={{
              width: '100%',
              height: 500,
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Typography color="text.secondary">
              Interactive Chart Would Appear Here
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Signal Details
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Signal Type</strong></TableCell>
                      <TableCell>{signal.type}</TableCell>
                      <TableCell><strong>Entry Price</strong></TableCell>
                      <TableCell>{formatPrice(signal.entryPrice)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Stop Loss</strong></TableCell>
                      <TableCell>{formatPrice(signal.stopLoss)}</TableCell>
                      <TableCell><strong>Take Profit</strong></TableCell>
                      <TableCell>{signal.takeProfit.map((tp: number) => formatPrice(tp)).join(' / ')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Risk/Reward</strong></TableCell>
                      <TableCell>1:{signal.riskReward}</TableCell>
                      <TableCell><strong>Confidence</strong></TableCell>
                      <TableCell>{signal.confidence}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Current Performance
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Current Price</strong></TableCell>
                      <TableCell>{formatPrice(signal.type === 'BUY' ? signal.entryPrice + (signal.pips * 0.0001) : signal.entryPrice - (signal.pips * 0.0001))}</TableCell>
                      <TableCell><strong>Open Time</strong></TableCell>
                      <TableCell>{new Date(signal.openTime).toLocaleString()}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Pips</strong></TableCell>
                      <TableCell color={signal.pips > 0 ? 'success.main' : signal.pips < 0 ? 'error.main' : 'text.primary'}>
                        {signal.pips > 0 && '+'}{signal.pips}
                      </TableCell>
                      <TableCell><strong>Profit/Loss</strong></TableCell>
                      <TableCell color={signal.profit > 0 ? 'success.main' : signal.profit < 0 ? 'error.main' : 'text.primary'}>
                        {signal.profit > 0 && '+'}${signal.profit}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell>{signal.status}</TableCell>
                      <TableCell><strong>Return</strong></TableCell>
                      <TableCell color={signal.profit > 0 ? 'success.main' : signal.profit < 0 ? 'error.main' : 'text.primary'}>
                        {signal.profit > 0 && '+'}{calculatePLPercentage()}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChartDialog}>Close</Button>
          <Button variant="contained" color="primary" startIcon={<Share />}>
            Share Analysis
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onClose={handleCloseCommentDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your comment"
            fullWidth
            multiline
            rows={4}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts on this signal..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCommentDialog}>Cancel</Button>
          <Button onClick={handleSubmitComment} variant="contained" color="primary" disabled={!commentText.trim()}>
            Post Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
});

export default SignalDetailsExpansion;
