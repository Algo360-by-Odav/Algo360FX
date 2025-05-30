// oneClickTradingJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

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

const OneClickTrading = observer(({ symbol, ask = 0, bid = 0 }) => {
  const { tradingStore } = useStores();
  const [volume, setVolume] = useState(0.01);
  const [isOneClick, setIsOneClick] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleVolumeChange = (delta) => {
    const step = tradingStore.getQuantityStep ? tradingStore.getQuantityStep(symbol) : 0.01;
    const min = tradingStore.getMinQuantity ? tradingStore.getMinQuantity(symbol) : 0.01;
    const max = tradingStore.getMaxQuantity ? tradingStore.getMaxQuantity(symbol) : 100;
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

  // Create volume control section
  const createVolumeControl = () => {
    return React.createElement(Box, { 
      sx: { 
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mb: 1,
      }
    }, [
      // Decrease volume button
      React.createElement(IconButton, {
        key: "decrease-button",
        size: "small",
        onClick: () => handleVolumeChange(-(tradingStore.getQuantityStep ? tradingStore.getQuantityStep(symbol) : 0.01))
      }, 
        React.createElement(RemoveIcon, { fontSize: "small" })
      ),
      
      // Volume input field
      React.createElement(TextField, {
        key: "volume-input",
        size: "small",
        value: volume,
        onChange: (e) => {
          const val = Number(e.target.value);
          const min = tradingStore.getMinQuantity ? tradingStore.getMinQuantity(symbol) : 0.01;
          const max = tradingStore.getMaxQuantity ? tradingStore.getMaxQuantity(symbol) : 100;
          if (!isNaN(val) && val >= min && val <= max) {
            setVolume(val);
          }
        },
        inputProps: {
          step: tradingStore.getQuantityStep ? tradingStore.getQuantityStep(symbol) : 0.01,
          min: tradingStore.getMinQuantity ? tradingStore.getMinQuantity(symbol) : 0.01,
          max: tradingStore.getMaxQuantity ? tradingStore.getMaxQuantity(symbol) : 100,
          type: 'number',
          'aria-label': 'Volume',
        },
        sx: { width: 100 }
      }),
      
      // Increase volume button
      React.createElement(IconButton, {
        key: "increase-button",
        size: "small",
        onClick: () => handleVolumeChange(tradingStore.getQuantityStep ? tradingStore.getQuantityStep(symbol) : 0.01)
      }, 
        React.createElement(AddIcon, { fontSize: "small" })
      ),
      
      // Settings button
      React.createElement(Tooltip, {
        key: "settings-tooltip",
        title: "Trading Settings"
      }, 
        React.createElement(IconButton, {
          size: "small",
          onClick: () => setShowSettings(!showSettings)
        }, 
          React.createElement(SettingsIcon, { fontSize: "small" })
        )
      )
    ]);
  };

  // Create settings panel
  const createSettingsPanel = () => {
    if (!showSettings) return null;
    
    return React.createElement(Paper, {
      variant: "outlined",
      sx: { p: 1, mb: 1 }
    }, [
      React.createElement(FormControlLabel, {
        key: "one-click-switch",
        control: React.createElement(Switch, {
          checked: isOneClick,
          onChange: (e) => setIsOneClick(e.target.checked),
          size: "small"
        }),
        label: React.createElement(Typography, { variant: "body2" }, "One-Click Trading")
      }),
      
      React.createElement(Typography, {
        key: "one-click-description",
        variant: "caption",
        color: "text.secondary",
        display: "block"
      }, isOneClick 
        ? "Orders will be placed immediately without confirmation"
        : "Orders require confirmation before placement"
      )
    ]);
  };

  // Create trading buttons
  const createTradingButtons = () => {
    return React.createElement(Box, { sx: { display: 'flex', gap: 1 } }, [
      // Buy button
      React.createElement(Button, {
        key: "buy-button",
        variant: "contained",
        color: "success",
        fullWidth: true,
        onClick: handleBuy,
        sx: {
          display: 'flex',
          flexDirection: 'column',
          py: 1,
        }
      }, [
        React.createElement(Typography, { key: "ask-label", variant: "caption", color: "inherit" }, "ASK"),
        React.createElement(Typography, { key: "ask-price", variant: "body1", fontWeight: "bold" }, 
          tradingStore.formatPrice ? tradingStore.formatPrice(ask, symbol) : ask.toFixed(5)
        ),
        React.createElement(Typography, { key: "buy-label", variant: "caption", color: "inherit" }, "BUY")
      ]),
      
      // Sell button
      React.createElement(Button, {
        key: "sell-button",
        variant: "contained",
        color: "error",
        fullWidth: true,
        onClick: handleSell,
        sx: {
          display: 'flex',
          flexDirection: 'column',
          py: 1,
        }
      }, [
        React.createElement(Typography, { key: "bid-label", variant: "caption", color: "inherit" }, "BID"),
        React.createElement(Typography, { key: "bid-price", variant: "body1", fontWeight: "bold" }, 
          tradingStore.formatPrice ? tradingStore.formatPrice(bid, symbol) : bid.toFixed(5)
        ),
        React.createElement(Typography, { key: "sell-label", variant: "caption", color: "inherit" }, "SELL")
      ])
    ]);
  };

  // Main render
  return React.createElement(Box, { sx: { p: 1 } }, [
    React.createElement('div', { key: 'volume-control-container' }, createVolumeControl()),
    React.createElement('div', { key: 'settings-panel-container' }, createSettingsPanel()),
    React.createElement('div', { key: 'trading-buttons-container' }, createTradingButtons())
  ]);
});

export default OneClickTrading;
