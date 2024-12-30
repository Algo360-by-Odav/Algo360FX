import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../hooks/useRootStore';

const QuickTradeWidget: React.FC = observer(() => {
  const { tradeStore, marketStore, settingsStore } = useRootStore();
  const [volume, setVolume] = useState(0.01); // Default to minimum lot size
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [limitPrice, setLimitPrice] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const selectedSymbol = marketStore.selectedSymbol || 'EURUSD'; // Default to EURUSD if no symbol selected
  
  useEffect(() => {
    const initializeMarketData = async () => {
      try {
        setLoading(true);
        setError(null);
        await marketStore.fetchMarketData(selectedSymbol);
      } catch (err) {
        setError('Failed to load market data. Please try again.');
        console.error('Error fetching market data:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeMarketData();
  }, [selectedSymbol, marketStore]);

  const marketData = marketStore.priceMap?.get(selectedSymbol);

  const handleVolumeChange = (increment: boolean) => {
    const step = 0.01;
    const newVolume = increment ? volume + step : volume - step;
    if (newVolume >= 0.01) {
      setVolume(Number(newVolume.toFixed(2)));
    }
  };

  const handleBuy = () => {
    if (!marketData) return;
    
    const trade = {
      symbol: selectedSymbol,
      type: 'BUY',
      orderType,
      openPrice: orderType === 'MARKET' ? marketData.ask : limitPrice,
      volume,
      stopLoss: null,
      takeProfit: null,
      openTime: new Date(),
    };

    tradeStore.placeTrade(trade);
  };

  const handleSell = () => {
    if (!marketData) return;
    
    const trade = {
      symbol: selectedSymbol,
      type: 'SELL',
      orderType,
      openPrice: orderType === 'MARKET' ? marketData.bid : limitPrice,
      volume,
      stopLoss: null,
      takeProfit: null,
      openTime: new Date(),
    };

    tradeStore.placeTrade(trade);
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }

  if (!marketData) {
    return (
      <Card>
        <CardContent>
          <Alert severity="warning">No market data available for {selectedSymbol}</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h2">
            Quick Trade
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {selectedSymbol}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Order Type</InputLabel>
              <Select
                value={orderType}
                label="Order Type"
                onChange={(e) => setOrderType(e.target.value as 'MARKET' | 'LIMIT')}
              >
                <MenuItem value="MARKET">Market</MenuItem>
                <MenuItem value="LIMIT">Limit</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {orderType === 'LIMIT' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Limit Price"
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(Number(e.target.value))}
              />
            </Grid>
          )}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Volume:</Typography>
              <IconButton size="small" onClick={() => handleVolumeChange(false)}>
                <RemoveIcon />
              </IconButton>
              <Typography>{volume.toFixed(2)}</Typography>
              <IconButton size="small" onClick={() => handleVolumeChange(true)}>
                <AddIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleBuy}
              disabled={!marketData}
            >
              Buy @ {orderType === 'MARKET' ? marketData.ask?.toFixed(5) : limitPrice}
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={handleSell}
              disabled={!marketData}
            >
              Sell @ {orderType === 'MARKET' ? marketData.bid?.toFixed(5) : limitPrice}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});

export default QuickTradeWidget;
