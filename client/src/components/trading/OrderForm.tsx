import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { OrderType } from '../../services/priceService';

interface OrderFormProps {
  symbol: string;
  currentPrice: number;
  onSubmit: (order: Partial<OrderType>) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ symbol, currentPrice, onSubmit }) => {
  const theme = useTheme();
  const [orderType, setOrderType] = useState<OrderType['type']>('MARKET');
  const [side, setSide] = useState<OrderType['side']>('BUY');
  const [quantity, setQuantity] = useState('0.01');
  const [price, setPrice] = useState(currentPrice.toFixed(5));
  const [stopPrice, setStopPrice] = useState('');
  const [timeInForce, setTimeInForce] = useState<OrderType['timeInForce']>('GTC');

  const handleSubmit = () => {
    const order: Partial<OrderType> = {
      type: orderType,
      side,
      symbol,
      quantity: parseFloat(quantity),
      timeInForce,
    };

    if (orderType !== 'MARKET') {
      order.price = parseFloat(price);
    }

    if (orderType === 'STOP' || orderType === 'STOP_LIMIT') {
      order.stopPrice = parseFloat(stopPrice);
    }

    onSubmit(order);
  };

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Order Type</InputLabel>
        <Select
          value={orderType}
          label="Order Type"
          onChange={(e) => setOrderType(e.target.value as OrderType['type'])}
          sx={{ bgcolor: '#141C2B' }}
        >
          <MenuItem value="MARKET">Market</MenuItem>
          <MenuItem value="LIMIT">Limit</MenuItem>
          <MenuItem value="STOP">Stop</MenuItem>
          <MenuItem value="STOP_LIMIT">Stop Limit</MenuItem>
        </Select>
      </FormControl>

      <Stack direction="row" spacing={1}>
        <Button
          fullWidth
          variant={side === 'BUY' ? 'contained' : 'outlined'}
          color="success"
          onClick={() => setSide('BUY')}
        >
          Buy
        </Button>
        <Button
          fullWidth
          variant={side === 'SELL' ? 'contained' : 'outlined'}
          color="error"
          onClick={() => setSide('SELL')}
        >
          Sell
        </Button>
      </Stack>

      <TextField
        fullWidth
        size="small"
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#141C2B' } }}
      />

      {orderType !== 'MARKET' && (
        <TextField
          fullWidth
          size="small"
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#141C2B' } }}
        />
      )}

      {(orderType === 'STOP' || orderType === 'STOP_LIMIT') && (
        <TextField
          fullWidth
          size="small"
          label="Stop Price"
          type="number"
          value={stopPrice}
          onChange={(e) => setStopPrice(e.target.value)}
          sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#141C2B' } }}
        />
      )}

      <FormControl fullWidth size="small">
        <InputLabel>Time In Force</InputLabel>
        <Select
          value={timeInForce}
          label="Time In Force"
          onChange={(e) => setTimeInForce(e.target.value as OrderType['timeInForce'])}
          sx={{ bgcolor: '#141C2B' }}
        >
          <MenuItem value="GTC">Good Till Cancel</MenuItem>
          <MenuItem value="IOC">Immediate or Cancel</MenuItem>
          <MenuItem value="FOK">Fill or Kill</MenuItem>
        </Select>
      </FormControl>

      <Button
        fullWidth
        variant="contained"
        color={side === 'BUY' ? 'success' : 'error'}
        onClick={handleSubmit}
        sx={{ height: 48 }}
      >
        {side === 'BUY' ? 'Buy' : 'Sell'} {symbol}
      </Button>
    </Stack>
  );
};

export default OrderForm;
