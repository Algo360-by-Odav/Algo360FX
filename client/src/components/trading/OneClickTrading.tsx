import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';

interface OneClickTradingProps {
  symbol: string;
  ask: number;
  bid: number;
}

const OneClickTrading: React.FC<OneClickTradingProps> = observer(({ symbol, ask, bid }) => {
  const { tradingStore } = useStores();
  const [volume, setVolume] = useState(0.01);
  const [isOneClick, setIsOneClick] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleVolumeChange = (delta: number) => {
    const step = tradingStore.getQuantityStep(symbol);
    const min = tradingStore.getMinQuantity(symbol);
    const max = tradingStore.getMaxQuantity(symbol);
    const newVolume = Number((volume + delta).toFixed(2));
    if (newVolume >= min && newVolume <= max) {
      setVolume(newVolume);
    }
  };

  const handleBuy = async () => {
    if (!isOneClick && !window.confirm(`Buy ${volume} ${symbol} at ${ask}?`)) {
      return;
    }
    
    try {
      await tradingStore.placeOrder({
        symbol,
        type: 'MARKET',
        side: 'BUY',
        volume,
        price: ask,
      });
    } catch (error) {
      console.error('Buy order failed:', error);
    }
  };

  const handleSell = async () => {
    if (!isOneClick && !window.confirm(`Sell ${volume} ${symbol} at ${bid}?`)) {
      return;
    }

    try {
      await tradingStore.placeOrder({
        symbol,
        type: 'MARKET',
        side: 'SELL',
        volume,
        price: bid,
      });
    } catch (error) {
      console.error('Sell order failed:', error);
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* Volume Control */}
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 1,
      }}>
        <IconButton
          size="small"
          onClick={() => handleVolumeChange(-tradingStore.getQuantityStep(symbol))}
        >
          <RemoveIcon fontSize="small" />
        </IconButton>
        
        <TextField
          size="small"
          value={volume}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (!isNaN(val) && val >= tradingStore.getMinQuantity(symbol) && val <= tradingStore.getMaxQuantity(symbol)) {
              setVolume(val);
            }
          }}
          inputProps={{
            step: tradingStore.getQuantityStep(symbol),
            min: tradingStore.getMinQuantity(symbol),
            max: tradingStore.getMaxQuantity(symbol),
            type: 'number',
            'aria-label': 'Volume',
          }}
          sx={{ width: 100 }}
        />

        <IconButton
          size="small"
          onClick={() => handleVolumeChange(tradingStore.getQuantityStep(symbol))}
        >
          <AddIcon fontSize="small" />
        </IconButton>

        <Tooltip title="Trading Settings">
          <IconButton
            size="small"
            onClick={() => setShowSettings(!showSettings)}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Settings Panel */}
      {showSettings && (
        <Paper variant="outlined" sx={{ p: 1, mb: 1 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isOneClick}
                onChange={(e) => setIsOneClick(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography variant="body2">
                One-Click Trading
              </Typography>
            }
          />
          <Typography variant="caption" color="text.secondary" display="block">
            {isOneClick 
              ? "Orders will be placed immediately without confirmation"
              : "Orders require confirmation before placement"
            }
          </Typography>
        </Paper>
      )}

      {/* Trading Buttons */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handleBuy}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            py: 1,
          }}
        >
          <Typography variant="caption" color="inherit">ASK</Typography>
          <Typography variant="body1" fontWeight="bold">
            {tradingStore.formatPrice(ask, symbol)}
          </Typography>
          <Typography variant="caption" color="inherit">BUY</Typography>
        </Button>

        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleSell}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            py: 1,
          }}
        >
          <Typography variant="caption" color="inherit">BID</Typography>
          <Typography variant="body1" fontWeight="bold">
            {tradingStore.formatPrice(bid, symbol)}
          </Typography>
          <Typography variant="caption" color="inherit">SELL</Typography>
        </Button>
      </Box>
    </Box>
  );
});

export default OneClickTrading;
