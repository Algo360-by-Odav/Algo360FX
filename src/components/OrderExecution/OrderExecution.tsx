import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from '@mui/material';
import {
  Add,
  Remove,
  Calculate,
  Timeline,
  Info,
  ExpandMore,
  History,
  TrendingUp,
} from '@mui/icons-material';
import { marketDataService, MarketData } from '../../services/marketData/MarketDataService';
import './OrderExecution.css';

interface OrderType {
  type: string;
  description: string;
  fields: OrderField[];
}

interface OrderField {
  name: string;
  label: string;
  type: 'number' | 'select' | 'text';
  options?: string[];
  required: boolean;
}

const OrderExecution: React.FC = () => {
  const [symbol, setSymbol] = useState('EUR/USD');
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [showCalculator, setShowCalculator] = useState(false);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [trailingStop, setTrailingStop] = useState(false);
  const [trailingStopDistance, setTrailingStopDistance] = useState('');
  const [timeInForce, setTimeInForce] = useState('GTC');
  const [showRiskCalculator, setShowRiskCalculator] = useState(false);

  const orderTypes: OrderType[] = [
    {
      type: 'market',
      description: 'Execute immediately at market price',
      fields: [
        { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      ],
    },
    {
      type: 'limit',
      description: 'Execute when price reaches target level',
      fields: [
        { name: 'quantity', label: 'Quantity', type: 'number', required: true },
        { name: 'price', label: 'Limit Price', type: 'number', required: true },
      ],
    },
    {
      type: 'stop',
      description: 'Execute when price crosses stop level',
      fields: [
        { name: 'quantity', label: 'Quantity', type: 'number', required: true },
        { name: 'price', label: 'Stop Price', type: 'number', required: true },
      ],
    },
    {
      type: 'oco',
      description: 'One-Cancels-Other order pair',
      fields: [
        { name: 'quantity', label: 'Quantity', type: 'number', required: true },
        { name: 'limitPrice', label: 'Limit Price', type: 'number', required: true },
        { name: 'stopPrice', label: 'Stop Price', type: 'number', required: true },
      ],
    },
    {
      type: 'trailing_stop',
      description: 'Stop order that follows price movement',
      fields: [
        { name: 'quantity', label: 'Quantity', type: 'number', required: true },
        { name: 'distance', label: 'Trail Distance', type: 'number', required: true },
      ],
    },
  ];

  useEffect(() => {
    const subscription = marketDataService
      .subscribeToPrice(symbol)
      .subscribe((data) => {
        setMarketData(data);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [symbol]);

  const calculatePositionSize = () => {
    // Implementation for position size calculator
  };

  const handleSubmitOrder = () => {
    // Implementation for order submission
  };

  const renderOrderFields = () => {
    const selectedType = orderTypes.find((type) => type.type === orderType);
    if (!selectedType) return null;

    return selectedType.fields.map((field) => (
      <TextField
        key={field.name}
        label={field.label}
        type={field.type}
        required={field.required}
        fullWidth
        margin="normal"
        value={getFieldValue(field.name)}
        onChange={(e) => handleFieldChange(field.name, e.target.value)}
      />
    ));
  };

  const getFieldValue = (fieldName: string) => {
    switch (fieldName) {
      case 'quantity':
        return quantity;
      case 'price':
        return price;
      case 'limitPrice':
      case 'stopPrice':
        return price;
      case 'distance':
        return trailingStopDistance;
      default:
        return '';
    }
  };

  const handleFieldChange = (fieldName: string, value: string) => {
    switch (fieldName) {
      case 'quantity':
        setQuantity(value);
        break;
      case 'price':
        setPrice(value);
        break;
      case 'limitPrice':
      case 'stopPrice':
        setPrice(value);
        break;
      case 'distance':
        setTrailingStopDistance(value);
        break;
    }
  };

  return (
    <div className="order-execution">
      <Paper className="order-form">
        <Typography variant="h6" gutterBottom>
          New Order
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Symbol</InputLabel>
          <Select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
            <MenuItem value="EUR/USD">EUR/USD</MenuItem>
            <MenuItem value="GBP/USD">GBP/USD</MenuItem>
            <MenuItem value="USD/JPY">USD/JPY</MenuItem>
          </Select>
        </FormControl>

        {marketData && (
          <Box className="market-data">
            <Typography variant="body2">
              Bid: {marketData.bid} | Ask: {marketData.ask}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Spread: {(marketData.ask - marketData.bid).toFixed(5)}
            </Typography>
          </Box>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel>Order Type</InputLabel>
          <Select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            {orderTypes.map((type) => (
              <MenuItem key={type.type} value={type.type}>
                {type.type.toUpperCase()}
                <Typography variant="caption" color="text.secondary">
                  {type.description}
                </Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box className="side-buttons">
          <Button
            variant={side === 'buy' ? 'contained' : 'outlined'}
            color="success"
            onClick={() => setSide('buy')}
            fullWidth
          >
            Buy
          </Button>
          <Button
            variant={side === 'sell' ? 'contained' : 'outlined'}
            color="error"
            onClick={() => setSide('sell')}
            fullWidth
          >
            Sell
          </Button>
        </Box>

        {renderOrderFields()}

        <Accordion expanded={showAdvanced}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Typography>Advanced Options</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth margin="normal">
              <InputLabel>Time in Force</InputLabel>
              <Select
                value={timeInForce}
                onChange={(e) => setTimeInForce(e.target.value)}
              >
                <MenuItem value="GTC">Good Till Cancelled</MenuItem>
                <MenuItem value="IOC">Immediate or Cancel</MenuItem>
                <MenuItem value="FOK">Fill or Kill</MenuItem>
                <MenuItem value="GTD">Good Till Date</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={trailingStop}
                  onChange={(e) => setTrailingStop(e.target.checked)}
                />
              }
              label="Trailing Stop"
            />

            {trailingStop && (
              <TextField
                label="Trailing Stop Distance"
                type="number"
                value={trailingStopDistance}
                onChange={(e) => setTrailingStopDistance(e.target.value)}
                fullWidth
                margin="normal"
              />
            )}
          </AccordionDetails>
        </Accordion>

        <Box className="order-actions">
          <Button
            variant="outlined"
            startIcon={<Calculate />}
            onClick={() => setShowRiskCalculator(true)}
          >
            Position Calculator
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitOrder}
            disabled={!quantity}
          >
            Place Order
          </Button>
        </Box>
      </Paper>

      <Dialog
        open={showRiskCalculator}
        onClose={() => setShowRiskCalculator(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Position Size Calculator</DialogTitle>
        <DialogContent>
          <TextField
            label="Account Balance"
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Risk Percentage"
            type="number"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Stop Loss (pips)"
            type="number"
            fullWidth
            margin="normal"
          />
          <Box className="calculator-result">
            <Typography variant="subtitle1">
              Recommended Position Size: 100,000
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Maximum Loss: $100
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRiskCalculator(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              setShowRiskCalculator(false);
              // Apply calculated position size
            }}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderExecution;
