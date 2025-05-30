// tradingWidgetJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
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

const TradingWidget = ({
  symbol,
  currentPrice,
  onPlaceOrder,
  advanced = false,
}) => {
  const { lastMessage, subscribeToSymbol } = useWebSocket();
  const [orderType, setOrderType] = useState('market');
  const [side, setSide] = useState('buy');
  const [quantity, setQuantity] = useState('0.01');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [timeInForce, setTimeInForce] = useState('GTC');
  const [error, setError] = useState(null);
  const [ask, setAsk] = useState(null);
  const [bid, setBid] = useState(null);
  const [signals, setSignals] = useState([
    'Double Bottom (60% confidence)',
    'Potential reversal pattern',
    'Indicating a bullish trend'
  ]);
  const [chartData, setChartData] = useState([]);

  // Subscribe to symbol data when component mounts
  useEffect(() => {
    subscribeToSymbol(symbol);
  }, [symbol, subscribeToSymbol]);

  // Handle incoming WebSocket messages
  useEffect(() => {
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
      const order = {
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

  const renderPriceDisplay = () => {
    return React.createElement(Box, { 
      sx: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }
    }, [
      // Ask Box
      React.createElement(Box, {
        key: "ask-box",
        sx: { 
          p: 3, 
          bgcolor: '#1b5e20',
          borderRadius: 1,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#2e7d32'
          }
        }
      }, [
        React.createElement(Typography, {
          key: "ask-label",
          variant: "caption",
          sx: { color: 'rgba(255,255,255,0.7)' }
        }, "Ask"),
        React.createElement(Typography, {
          key: "ask-value",
          variant: "h6",
          sx: { color: '#fff', mt: 0.5 }
        }, ask ? ask.toFixed(5) : "Loading...")
      ]),
      
      // Bid Box
      React.createElement(Box, {
        key: "bid-box",
        sx: { 
          p: 3, 
          bgcolor: '#c62828',
          borderRadius: 1,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#d32f2f'
          }
        }
      }, [
        React.createElement(Typography, {
          key: "bid-label",
          variant: "caption",
          sx: { color: 'rgba(255,255,255,0.7)' }
        }, "Bid"),
        React.createElement(Typography, {
          key: "bid-value",
          variant: "h6",
          sx: { color: '#fff', mt: 0.5 }
        }, bid ? bid.toFixed(5) : "Loading...")
      ])
    ]);
  };

  const renderOrderForm = () => {
    const formElements = [];
    
    // Order Type FormControl
    formElements.push(
      React.createElement(FormControl, {
        key: "order-type-control",
        fullWidth: true,
        variant: "filled",
        sx: { mb: 2 }
      }, [
        React.createElement(InputLabel, { key: "order-type-label" }, "Order Type"),
        React.createElement(Select, {
          key: "order-type-select",
          value: orderType,
          onChange: (e) => setOrderType(e.target.value)
        }, [
          React.createElement(MenuItem, { key: "market", value: "market" }, "Market"),
          React.createElement(MenuItem, { key: "limit", value: "limit" }, "Limit"),
          React.createElement(MenuItem, { key: "stop", value: "stop" }, "Stop"),
          React.createElement(MenuItem, { key: "stop-limit", value: "stop_limit" }, "Stop Limit")
        ])
      ])
    );
    
    // Side FormControl
    formElements.push(
      React.createElement(FormControl, {
        key: "side-control",
        fullWidth: true,
        variant: "filled",
        sx: { mb: 2 }
      }, [
        React.createElement(InputLabel, { key: "side-label" }, "Side"),
        React.createElement(Select, {
          key: "side-select",
          value: side,
          onChange: (e) => setSide(e.target.value)
        }, [
          React.createElement(MenuItem, { key: "buy", value: "buy" }, "Buy"),
          React.createElement(MenuItem, { key: "sell", value: "sell" }, "Sell")
        ])
      ])
    );
    
    // Quantity TextField
    formElements.push(
      React.createElement(TextField, {
        key: "quantity-field",
        fullWidth: true,
        label: "Quantity",
        value: quantity,
        onChange: (e) => setQuantity(e.target.value),
        type: "number",
        inputProps: { step: 0.01, min: 0.01 },
        variant: "filled",
        sx: { mb: 2 }
      })
    );
    
    // Limit Price TextField (conditional)
    if (orderType === 'limit' || orderType === 'stop_limit') {
      formElements.push(
        React.createElement(TextField, {
          key: "limit-price-field",
          fullWidth: true,
          label: "Limit Price",
          value: price,
          onChange: (e) => setPrice(e.target.value),
          type: "number",
          inputProps: { step: 0.00001 },
          variant: "filled",
          sx: { mb: 2 }
        })
      );
    }
    
    // Stop Price TextField (conditional)
    if (orderType === 'stop' || orderType === 'stop_limit') {
      formElements.push(
        React.createElement(TextField, {
          key: "stop-price-field",
          fullWidth: true,
          label: "Stop Price",
          value: stopPrice,
          onChange: (e) => setStopPrice(e.target.value),
          type: "number",
          inputProps: { step: 0.00001 },
          variant: "filled",
          sx: { mb: 2 }
        })
      );
    }
    
    // Time In Force FormControl (conditional)
    if (advanced) {
      formElements.push(
        React.createElement(FormControl, {
          key: "time-in-force-control",
          fullWidth: true,
          variant: "filled",
          sx: { mb: 2 }
        }, [
          React.createElement(InputLabel, { key: "time-in-force-label" }, "Time In Force"),
          React.createElement(Select, {
            key: "time-in-force-select",
            value: timeInForce,
            onChange: (e) => setTimeInForce(e.target.value)
          }, [
            React.createElement(MenuItem, { key: "gtc", value: "GTC" }, "Good Till Cancelled"),
            React.createElement(MenuItem, { key: "ioc", value: "IOC" }, "Immediate or Cancel"),
            React.createElement(MenuItem, { key: "fok", value: "FOK" }, "Fill or Kill")
          ])
        ])
      );
    }
    
    // Error Alert (conditional)
    if (error) {
      formElements.push(
        React.createElement(Alert, {
          key: "error-alert",
          severity: "error",
          sx: { mb: 2 },
          onClose: () => setError(null)
        }, error)
      );
    }
    
    // Action Buttons
    formElements.push(
      React.createElement(Box, {
        key: "action-buttons",
        sx: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }
      }, [
        // Buy Button
        React.createElement(Button, {
          key: "buy-button",
          fullWidth: true,
          variant: "contained",
          color: "success",
          onClick: () => {
            setSide('buy');
            handlePlaceOrder();
          },
          startIcon: React.createElement(TrendingUpIcon)
        }, `Buy ${symbol}`),
        
        // Sell Button
        React.createElement(Button, {
          key: "sell-button",
          fullWidth: true,
          variant: "contained",
          color: "error",
          onClick: () => {
            setSide('sell');
            handlePlaceOrder();
          },
          startIcon: React.createElement(TrendingDownIcon)
        }, `Sell ${symbol}`)
      ])
    );
    
    return formElements;
  };

  // Create chart controls
  const createChartControls = () => {
    return React.createElement(Box, { 
      sx: { 
        position: 'absolute',
        top: 8,
        left: 8,
        zIndex: 2,
        display: 'flex',
        gap: 1
      }
    }, 
      React.createElement(ButtonGroup, {
        size: "small",
        variant: "outlined",
        sx: { bgcolor: 'rgba(26,26,26,0.9)' }
      }, [
        React.createElement(Button, { key: "1m" }, "1M"),
        React.createElement(Button, { key: "5m" }, "5M"),
        React.createElement(Button, { key: "15m" }, "15M"),
        React.createElement(Button, { key: "1h" }, "1H"),
        React.createElement(Button, { key: "4h" }, "4H"),
        React.createElement(Button, { key: "1d" }, "1D")
      ])
    );
  };

  // Main render
  return React.createElement(Box, { 
    sx: { height: '100%', display: 'flex', flexDirection: 'column' }
  }, [
    // Chart Section
    React.createElement(Box, {
      key: "chart-section",
      sx: { flex: 1, minHeight: 0, mb: 2 }
    }, 
      React.createElement(Box, {
        sx: { 
          height: '400px', 
          bgcolor: '#1a1a1a',
          borderRadius: 1,
          p: 1,
          position: 'relative'
        }
      }, [
        createChartControls()
        // PriceChart would go here
      ])
    ),
    
    // Trading Section
    React.createElement(Box, {
      key: "trading-section",
      sx: { mt: 2 }
    }, 
      React.createElement(Box, {
        sx: { bgcolor: '#1a1a1a', borderRadius: 1, p: 2 }
      }, [
        // Header
        React.createElement(Box, {
          key: "header",
          sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }
        }, [
          React.createElement(Typography, {
            key: "title",
            variant: "subtitle1"
          }, `${symbol} Trading`),
          
          advanced && React.createElement(Tooltip, {
            key: "info-tooltip",
            title: "Trading Information"
          }, 
            React.createElement(IconButton, {
              size: "small"
            }, 
              React.createElement(InfoIcon)
            )
          )
        ]),
        
        // Price Display
        renderPriceDisplay(),
        
        // Order Form
        ...renderOrderForm()
      ])
    )
  ]);
};

export default TradingWidget;
