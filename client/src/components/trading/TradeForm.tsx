import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useStores } from '../../stores/StoreProvider';

interface TradeFormProps {
  symbol: string;
}

interface TradeFormData {
  type: 'market' | 'limit';
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  takeProfit?: number;
  stopLoss?: number;
}

const TradeForm: React.FC<TradeFormProps> = ({ symbol }) => {
  const { tradingStore } = useStores();
  const [formData, setFormData] = useState<TradeFormData>({
    type: 'market',
    side: 'buy',
    amount: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tradingStore.submitOrder({
        symbol,
        type: formData.side === 'buy' ? 'buy' : 'sell',
        volume: formData.amount,
        price: formData.price || 0,
        takeProfit: formData.takeProfit,
        stopLoss: formData.stopLoss,
      });
    } catch (error) {
      console.error('Failed to submit order:', error);
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        New Trade
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value as 'market' | 'limit' })
            }
          >
            <MenuItem value="market">Market</MenuItem>
            <MenuItem value="limit">Limit</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Side</InputLabel>
          <Select
            value={formData.side}
            onChange={(e) =>
              setFormData({ ...formData, side: e.target.value as 'buy' | 'sell' })
            }
          >
            <MenuItem value="buy">Buy</MenuItem>
            <MenuItem value="sell">Sell</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Amount"
          type="number"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: parseFloat(e.target.value) })
          }
        />

        {formData.type === 'limit' && (
          <TextField
            fullWidth
            margin="normal"
            label="Price"
            type="number"
            value={formData.price || ''}
            onChange={(e) =>
              setFormData({ ...formData, price: parseFloat(e.target.value) })
            }
          />
        )}

        <TextField
          fullWidth
          margin="normal"
          label="Take Profit"
          type="number"
          value={formData.takeProfit || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              takeProfit: e.target.value ? parseFloat(e.target.value) : undefined,
            })
          }
        />

        <TextField
          fullWidth
          margin="normal"
          label="Stop Loss"
          type="number"
          value={formData.stopLoss || ''}
          onChange={(e) =>
            setFormData({
              ...formData,
              stopLoss: e.target.value ? parseFloat(e.target.value) : undefined,
            })
          }
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Place Order
        </Button>
      </Box>
    </Paper>
  );
};

export default TradeForm;

