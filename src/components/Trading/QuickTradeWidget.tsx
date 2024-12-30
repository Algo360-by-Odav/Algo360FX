import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  InputAdornment,
  useTheme,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Info as InfoIcon,
  SwapHoriz as SwapIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import axios from 'axios';

interface MarketData {
  symbol: string;
  ask: number;
  bid: number;
  spread: number;
  time: string;
}

interface TradeParams {
  symbol: string;
  type: 'market' | 'limit' | 'stop';
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  stopLoss?: number;
  takeProfit?: number;
  leverage: number;
}

const QuickTradeWidget: React.FC = observer(() => {
  const theme = useTheme();
  const [tradeParams, setTradeParams] = useState<TradeParams>({
    symbol: 'EURUSD',
    type: 'market',
    side: 'buy',
    amount: 0.1,
    leverage: 1,
  });
  const [advanced, setAdvanced] = useState(false);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD'];
  const orderTypes = ['market', 'limit', 'stop'];

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get(`http://localhost:3004/api/market/${tradeParams.symbol}`);
        setMarketData(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch market data');
        console.error('Error fetching market data:', err);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 1000); // Update every second

    return () => clearInterval(interval);
  }, [tradeParams.symbol]);

  const handleParamChange = (
    param: keyof TradeParams,
    value: string | number
  ) => {
    setTradeParams((prev) => ({
      ...prev,
      [param]: value,
    }));
  };

  const handleAmountStep = (step: number) => {
    setTradeParams((prev) => ({
      ...prev,
      amount: Math.max(0.01, prev.amount + step),
    }));
  };

  const handleLeverageStep = (step: number) => {
    setTradeParams((prev) => ({
      ...prev,
      leverage: Math.max(1, Math.min(100, prev.leverage + step)),
    }));
  };

  const calculateMargin = () => {
    if (!marketData) return 0;
    const price = tradeParams.side === 'buy' ? marketData.ask : marketData.bid;
    return (tradeParams.amount * price * 100000) / tradeParams.leverage;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Quick Trade
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Symbol</InputLabel>
              <Select
                value={tradeParams.symbol}
                onChange={(e) =>
                  handleParamChange('symbol', e.target.value as string)
                }
                label="Symbol"
              >
                {symbols.map((symbol) => (
                  <MenuItem key={symbol} value={symbol}>
                    {symbol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {marketData && (
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                bgcolor: theme.palette.background.paper,
                p: 1,
                borderRadius: 1,
                border: `1px solid ${theme.palette.divider}`
              }}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Ask
                  </Typography>
                  <Typography variant="body1" color="success.main">
                    {marketData.ask.toFixed(5)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Bid
                  </Typography>
                  <Typography variant="body1" color="error.main">
                    {marketData.bid.toFixed(5)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Spread
                  </Typography>
                  <Typography variant="body1">
                    {marketData.spread.toFixed(5)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                '& .MuiButton-root': { flex: 1 },
              }}
            >
              <Button
                variant={tradeParams.side === 'buy' ? 'contained' : 'outlined'}
                color="success"
                onClick={() => handleParamChange('side', 'buy')}
              >
                Buy
              </Button>
              <Button
                variant={tradeParams.side === 'sell' ? 'contained' : 'outlined'}
                color="error"
                onClick={() => handleParamChange('side', 'sell')}
              >
                Sell
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Order Type</InputLabel>
              <Select
                value={tradeParams.type}
                onChange={(e) =>
                  handleParamChange('type', e.target.value as string)
                }
                label="Order Type"
              >
                {orderTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleAmountStep(-0.01)}
                disabled={tradeParams.amount <= 0.01}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                fullWidth
                size="small"
                label="Amount (lots)"
                type="number"
                value={tradeParams.amount}
                onChange={(e) =>
                  handleParamChange('amount', parseFloat(e.target.value))
                }
                inputProps={{ step: 0.01, min: 0.01 }}
              />
              <IconButton
                size="small"
                onClick={() => handleAmountStep(0.01)}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleLeverageStep(-1)}
                disabled={tradeParams.leverage <= 1}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                fullWidth
                size="small"
                label="Leverage"
                type="number"
                value={tradeParams.leverage}
                onChange={(e) =>
                  handleParamChange('leverage', parseInt(e.target.value))
                }
                inputProps={{ min: 1, max: 100 }}
              />
              <IconButton
                size="small"
                onClick={() => handleLeverageStep(1)}
                disabled={tradeParams.leverage >= 100}
              >
                <AddIcon />
              </IconButton>
            </Box>
          </Grid>

          {marketData && (
            <Grid item xs={12}>
              <Typography variant="body2" color="textSecondary">
                Required Margin: ${calculateMargin().toFixed(2)}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={advanced}
                  onChange={(e) => setAdvanced(e.target.checked)}
                />
              }
              label="Advanced Settings"
            />
          </Grid>

          {advanced && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Stop Loss"
                  type="number"
                  value={tradeParams.stopLoss || ''}
                  onChange={(e) =>
                    handleParamChange('stopLoss', parseFloat(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Tooltip title="Price at which to close position if loss exceeds this level">
                          <InfoIcon fontSize="small" />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="Take Profit"
                  type="number"
                  value={tradeParams.takeProfit || ''}
                  onChange={(e) =>
                    handleParamChange('takeProfit', parseFloat(e.target.value))
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Tooltip title="Price at which to close position if profit reaches this level">
                          <InfoIcon fontSize="small" />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color={tradeParams.side === 'buy' ? 'success' : 'error'}
              disabled={!marketData}
            >
              {tradeParams.side === 'buy' ? 'Buy' : 'Sell'} {tradeParams.symbol}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
});

export default QuickTradeWidget;
