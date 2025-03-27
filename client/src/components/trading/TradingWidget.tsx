import React, { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Tooltip,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useWebSocket } from '../../hooks/useWebSocket';
import { TradingWidgetProps, Order } from './types';

const TradingWidget: React.FC<TradingWidgetProps> = ({
  symbol,
  currentPrice,
  onPlaceOrder,
  advanced = false,
}) => {
  const { lastMessage, subscribeToSymbol } = useWebSocket();
  const [orderType, setOrderType] = useState<Order['type']>('market');
  const [side, setSide] = useState<Order['side']>('buy');
  const [quantity, setQuantity] = useState('0.01');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [timeInForce, setTimeInForce] = useState<Order['timeInForce']>('GTC');
  const [error, setError] = useState<string | null>(null);
  const [ask, setAsk] = useState<number | null>(null);
  const [bid, setBid] = useState<number | null>(null);
  const [signals, setSignals] = useState<string[]>([
    'Double Bottom (60% confidence)',
    'Potential reversal pattern',
    'Indicating a bullish trend'
  ]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Subscribe to symbol data when component mounts
  React.useEffect(() => {
    subscribeToSymbol(symbol);
  }, [symbol, subscribeToSymbol]);

  // Handle incoming WebSocket messages
  React.useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        if (data.type === 'marketData' && data.symbol === symbol) {
          setAsk(data.ask);
          setBid(data.bid);
          // Update chart data if available
          if (data.ohlcv) {
            setChartData(prevData => [...prevData, data.ohlcv]);
          }
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    }
  }, [lastMessage, symbol]);

  const handlePlaceOrder = async () => {
    try {
      setError(null);
      const order: Order = {
        symbol,
        type: orderType,
        side,
        quantity: parseFloat(quantity),
        timeInForce,
      };

      if (orderType === 'limit' || orderType === 'stop_limit') {
        if (!price) throw new Error('Price is required for limit orders');
        order.price = parseFloat(price);
      }

      if (orderType === 'stop' || orderType === 'stop_limit') {
        if (!stopPrice) throw new Error('Stop price is required for stop orders');
        order.stopPrice = parseFloat(stopPrice);
      }

      await onPlaceOrder(order);
      
      // Reset form after successful order
      if (orderType !== 'market') {
        setPrice('');
        setStopPrice('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order');
    }
  };

  const renderPriceDisplay = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
      <Box sx={{ 
        p: 3, 
        bgcolor: '#1b5e20',
        borderRadius: 1,
        textAlign: 'center',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: '#2e7d32'
        }
      }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Ask</Typography>
        <Typography variant="h6" sx={{ color: '#fff', mt: 0.5 }}>
          {ask?.toFixed(5)}
        </Typography>
      </Box>
      <Box sx={{ 
        p: 3, 
        bgcolor: '#c62828',
        borderRadius: 1,
        textAlign: 'center',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: '#d32f2f'
        }
      }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Bid</Typography>
        <Typography variant="h6" sx={{ color: '#fff', mt: 0.5 }}>
          {bid?.toFixed(5)}
        </Typography>
      </Box>
    </Box>
  );

  const renderOrderForm = () => (
    <>
      <FormControl 
        fullWidth 
        variant="filled"
        sx={{ 
          mb: 2,
          '& .MuiFilledInput-root': {
            bgcolor: '#252525',
            '&:hover': {
              bgcolor: '#303030'
            },
            '&.Mui-focused': {
              bgcolor: '#303030'
            }
          }
        }}
      >
        <InputLabel>Order Type</InputLabel>
        <Select
          value={orderType}
          onChange={(e) => setOrderType(e.target.value as Order['type'])}
        >
          <MenuItem value="market">Market</MenuItem>
          <MenuItem value="limit">Limit</MenuItem>
          <MenuItem value="stop">Stop</MenuItem>
          <MenuItem value="stop_limit">Stop Limit</MenuItem>
        </Select>
      </FormControl>

      <FormControl 
        fullWidth 
        variant="filled"
        sx={{ mb: 2 }}
      >
        <InputLabel>Side</InputLabel>
        <Select
          value={side}
          onChange={(e) => setSide(e.target.value as Order['side'])}
        >
          <MenuItem value="buy">Buy</MenuItem>
          <MenuItem value="sell">Sell</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        type="number"
        inputProps={{ step: 0.01, min: 0.01 }}
        variant="filled"
        sx={{ mb: 2 }}
      />

      {(orderType === 'limit' || orderType === 'stop_limit') && (
        <TextField
          fullWidth
          label="Limit Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          inputProps={{ step: 0.00001 }}
          variant="filled"
          sx={{ mb: 2 }}
        />
      )}

      {(orderType === 'stop' || orderType === 'stop_limit') && (
        <TextField
          fullWidth
          label="Stop Price"
          value={stopPrice}
          onChange={(e) => setStopPrice(e.target.value)}
          type="number"
          inputProps={{ step: 0.00001 }}
          variant="filled"
          sx={{ mb: 2 }}
        />
      )}

      {advanced && (
        <FormControl 
          fullWidth 
          variant="filled"
          sx={{ mb: 2 }}
        >
          <InputLabel>Time In Force</InputLabel>
          <Select
            value={timeInForce}
            onChange={(e) => setTimeInForce(e.target.value as Order['timeInForce'])}
          >
            <MenuItem value="GTC">Good Till Cancelled</MenuItem>
            <MenuItem value="IOC">Immediate or Cancel</MenuItem>
            <MenuItem value="FOK">Fill or Kill</MenuItem>
          </Select>
        </FormControl>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={() => {
            setSide('buy');
            handlePlaceOrder();
          }}
          startIcon={<TrendingUpIcon />}
        >
          Buy {symbol}
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={() => {
            setSide('sell');
            handlePlaceOrder();
          }}
          startIcon={<TrendingDownIcon />}
        >
          Sell {symbol}
        </Button>
      </Box>
    </>
  );

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, minHeight: 0, mb: 2 }}>
        <Box sx={{ 
          height: '400px', 
          bgcolor: '#1a1a1a',
          borderRadius: 1,
          p: 1,
          position: 'relative'
        }}>
          {/* Chart Controls */}
          <Box sx={{ 
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 2,
            display: 'flex',
            gap: 1
          }}>
            <ButtonGroup size="small" variant="outlined" sx={{ bgcolor: 'rgba(26,26,26,0.9)' }}>
              <Button>1M</Button>
              <Button>5M</Button>
              <Button>15M</Button>
              <Button>1H</Button>
              <Button>4H</Button>
              <Button>1D</Button>
            </ButtonGroup>
          </Box>
          {/* <PriceChart data={chartData} /> */}
        </Box>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        <Box sx={{ bgcolor: '#1a1a1a', borderRadius: 1, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">
              {symbol} Trading
            </Typography>
            {advanced && (
              <Tooltip title="Trading Information">
                <IconButton size="small">
                  <InfoIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          
          {renderPriceDisplay()}
          {renderOrderForm()}
        </Box>
      </Box>
    </Box>
  );
};

export default TradingWidget;
