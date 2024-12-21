import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Slider,
  InputAdornment,
  Tooltip,
  Alert,
  useTheme,
} from '@mui/material';
import { useStore } from '../../hooks/useStore';
import { MarketData } from '../../types/trading';

interface OrderEntryProps {
  symbol: string;
  currentPrice?: MarketData;
}

const OrderEntry: React.FC<OrderEntryProps> = observer(({ symbol, currentPrice }) => {
  const theme = useTheme();
  const { tradingStore, riskManagementStore } = useStore();

  const [orderType, setOrderType] = React.useState<'market' | 'limit'>('market');
  const [side, setSide] = React.useState<'buy' | 'sell'>('buy');
  const [size, setSize] = React.useState<number>(0.01);
  const [price, setPrice] = React.useState<number | ''>('');
  const [stopLoss, setStopLoss] = React.useState<number | ''>('');
  const [takeProfit, setTakeProfit] = React.useState<number | ''>('');
  const [riskAmount, setRiskAmount] = React.useState<number>(100);

  // Calculate position sizing based on risk
  React.useEffect(() => {
    if (currentPrice && stopLoss !== '') {
      const positionSize = riskManagementStore.calculatePositionSize(
        tradingStore.balance,
        currentPrice.ask,
        Number(stopLoss),
        symbol
      );
      setSize(positionSize.positionSize);
    }
  }, [stopLoss, currentPrice, symbol, riskManagementStore, tradingStore.balance]);

  const handleOrderTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newOrderType: 'market' | 'limit'
  ) => {
    if (newOrderType !== null) {
      setOrderType(newOrderType);
    }
  };

  const handleSideChange = (
    event: React.MouseEvent<HTMLElement>,
    newSide: 'buy' | 'sell'
  ) => {
    if (newSide !== null) {
      setSide(newSide);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentPrice) return;

    const orderPrice = orderType === 'market' ? 
      (side === 'buy' ? currentPrice.ask : currentPrice.bid) : 
      Number(price);

    try {
      const order = {
        symbol,
        side,
        type: orderType,
        size,
        price: orderPrice,
        stopLoss: Number(stopLoss),
        takeProfit: Number(takeProfit),
      };

      // Validate trade
      const validation = riskManagementStore.validateTrade({
        ...order,
        entryPrice: orderPrice,
        entryTime: new Date().toISOString(),
      });

      if (!validation.valid) {
        throw new Error(validation.reason);
      }

      await tradingStore.placeOrder(order);
      
      // Reset form
      setPrice('');
      setStopLoss('');
      setTakeProfit('');
      
    } catch (error) {
      console.error('Order placement failed:', error);
    }
  };

  const calculateRiskReward = () => {
    if (!stopLoss || !takeProfit || !currentPrice) return null;
    
    const entry = orderType === 'market' ? 
      (side === 'buy' ? currentPrice.ask : currentPrice.bid) : 
      Number(price);
    
    const risk = Math.abs(entry - Number(stopLoss));
    const reward = Math.abs(entry - Number(takeProfit));
    
    return reward / risk;
  };

  const riskRewardRatio = calculateRiskReward();

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        New Order: {symbol}
      </Typography>

      {currentPrice && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Bid: {currentPrice.bid.toFixed(5)} | Ask: {currentPrice.ask.toFixed(5)}
          </Typography>
        </Box>
      )}

      {/* Order Type Selection */}
      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={orderType}
          exclusive
          onChange={handleOrderTypeChange}
          fullWidth
        >
          <ToggleButton value="market">Market</ToggleButton>
          <ToggleButton value="limit">Limit</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Side Selection */}
      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup value={side} exclusive onChange={handleSideChange} fullWidth>
          <ToggleButton
            value="buy"
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.success.main,
                color: theme.palette.success.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.success.dark,
                },
              },
            }}
          >
            Buy
          </ToggleButton>
          <ToggleButton
            value="sell"
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.error.main,
                color: theme.palette.error.contrastText,
                '&:hover': {
                  backgroundColor: theme.palette.error.dark,
                },
              },
            }}
          >
            Sell
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Risk Amount Slider */}
      <Box sx={{ mb: 2 }}>
        <Typography gutterBottom>Risk Amount ($)</Typography>
        <Slider
          value={riskAmount}
          onChange={(_, value) => setRiskAmount(value as number)}
          min={10}
          max={1000}
          step={10}
          marks={[
            { value: 10, label: '$10' },
            { value: 1000, label: '$1000' },
          ]}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `$${value}`}
        />
      </Box>

      {/* Size Input */}
      <TextField
        fullWidth
        label="Size"
        type="number"
        value={size}
        onChange={(e) => setSize(Number(e.target.value))}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: <InputAdornment position="start">Lots</InputAdornment>,
        }}
      />

      {/* Price Input (for Limit Orders) */}
      {orderType === 'limit' && (
        <TextField
          fullWidth
          label="Limit Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          sx={{ mb: 2 }}
        />
      )}

      {/* Stop Loss Input */}
      <TextField
        fullWidth
        label="Stop Loss"
        type="number"
        value={stopLoss}
        onChange={(e) => setStopLoss(Number(e.target.value))}
        sx={{ mb: 2 }}
        required
      />

      {/* Take Profit Input */}
      <TextField
        fullWidth
        label="Take Profit"
        type="number"
        value={takeProfit}
        onChange={(e) => setTakeProfit(Number(e.target.value))}
        sx={{ mb: 2 }}
        required
      />

      {/* Risk/Reward Display */}
      {riskRewardRatio && (
        <Alert
          severity={riskRewardRatio >= 2 ? 'success' : 'warning'}
          sx={{ mb: 2 }}
        >
          Risk/Reward Ratio: {riskRewardRatio.toFixed(2)}
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        color={side === 'buy' ? 'success' : 'error'}
        disabled={!currentPrice}
      >
        Place {orderType.toUpperCase()} {side.toUpperCase()} Order
      </Button>
    </Box>
  );
});

export default OrderEntry;
