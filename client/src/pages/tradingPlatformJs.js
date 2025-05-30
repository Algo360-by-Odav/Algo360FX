// tradingPlatformJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Toolbar,
  AppBar,
  Button,
  Menu,
  MenuItem,
  Stack,
  Container,
  Grid,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  ViewComfy as ViewComfyIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreProvider';
import CustomTradingChart from '../components/trading/CustomTradingChart';
import MarketWatch from '../components/trading/MarketWatch';
import OrderBook from '../components/trading/OrderBook';
import TradeHistory from '../components/trading/TradeHistory';
import OneClickTrading from '../components/trading/OneClickTrading';
import { priceService } from '../services/priceService';
import TopBar from '../components/layout/TopBar';
import StandaloneTopBarWrapper from '../components/layout/StandaloneTopBarWrapper';
import { useLocation } from 'react-router-dom';

// Create a mock trading store for development
const mockTradingStore = {
  prices: {
    'EURUSD': { ask: 1.0514, bid: 1.0512 },
    'GBPUSD': { ask: 1.2498, bid: 1.2496 },
    'USDJPY': { ask: 154.32, bid: 154.30 },
    'AUDUSD': { ask: 0.6301, bid: 0.6299 }
  },
  updatePrice: (symbol, update) => {
    mockTradingStore.prices[symbol] = update;
  }
};

const TradingPlatform = observer(() => {
  const location = useLocation();
  // Check if we're on the standalone route or within the dashboard layout
  const isStandalone = location.pathname === '/trading-platform';
  // In development mode, use mock data
  const { tradingStore } = { tradingStore: mockTradingStore };
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [anchorEl, setAnchorEl] = useState(null);
  const currentPrice = tradingStore.prices[selectedSymbol] || { ask: 0, bid: 0 };

  useEffect(() => {
    const handlePriceUpdate = (update) => {
      tradingStore.updatePrice(selectedSymbol, update);
    };

    const unsubscribe = priceService.subscribe(selectedSymbol, handlePriceUpdate);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedSymbol, tradingStore]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSymbolChange = (symbol) => {
    setSelectedSymbol(symbol);
    handleMenuClose();
  };

  // Create custom action buttons for the trading platform topbar
  const tradingActionButtons = [
    React.createElement(
      Button, 
      {
        key: 'new-order',
        variant: 'contained',
        size: 'small',
        startIcon: React.createElement(AddIcon),
        color: 'primary'
      },
      'New Order'
    ),
    React.createElement(
      Button, 
      {
        key: 'refresh-data',
        variant: 'outlined',
        size: 'small',
        startIcon: React.createElement(RefreshIcon),
        color: 'primary'
      },
      'Refresh'
    ),
    React.createElement(
      Button, 
      {
        key: 'download-data',
        variant: 'outlined',
        size: 'small',
        startIcon: React.createElement(DownloadIcon),
        color: 'primary'
      },
      'Export'
    )
  ];

  // Create the main content of the trading platform
  const createTradingContent = () => {
    return React.createElement(Box, { sx: { height: '100%', display: 'flex', flexDirection: 'column' } },
      // Trading platform toolbar
      React.createElement(AppBar, {
        position: "static",
        color: "default",
        elevation: 0,
        sx: { borderBottom: 1, borderColor: 'divider' }
      },
        React.createElement(Toolbar, null,
          // Symbol selector
          React.createElement(Button, {
            onClick: handleMenuOpen,
            sx: { mr: 2 }
          }, selectedSymbol),
          
          React.createElement(Menu, {
            anchorEl: anchorEl,
            open: Boolean(anchorEl),
            onClose: handleMenuClose
          },
            Object.keys(tradingStore.prices).map(symbol => 
              React.createElement(MenuItem, {
                key: symbol,
                onClick: () => handleSymbolChange(symbol)
              }, symbol)
            )
          ),
          
          // Current price display
          React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', mr: 3 } },
            React.createElement(Typography, { variant: "body1", sx: { mr: 1 } }, "Bid:"),
            React.createElement(Typography, { variant: "body1", color: "error.main", fontWeight: "bold" },
              currentPrice.bid.toFixed(5)
            )
          ),
          
          React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', mr: 'auto' } },
            React.createElement(Typography, { variant: "body1", sx: { mr: 1 } }, "Ask:"),
            React.createElement(Typography, { variant: "body1", color: "success.main", fontWeight: "bold" },
              currentPrice.ask.toFixed(5)
            )
          ),
          
          // Search field
          React.createElement(TextField, {
            placeholder: "Search symbols...",
            size: "small",
            sx: { mr: 2 },
            InputProps: {
              startAdornment: React.createElement(InputAdornment, { position: "start" },
                React.createElement(SearchIcon, { fontSize: "small" })
              )
            }
          }),
          
          // Action buttons
          React.createElement(IconButton, { size: "large" },
            React.createElement(ViewComfyIcon)
          ),
          React.createElement(IconButton, { size: "large" },
            React.createElement(SettingsIcon)
          ),
          React.createElement(IconButton, { size: "large" },
            React.createElement(FullscreenIcon)
          )
        )
      ),
      
      // Main trading platform content
      React.createElement(Box, { sx: { flexGrow: 1, overflow: 'hidden', p: 2 } },
        React.createElement(Grid, { container: true, spacing: 2, sx: { height: '100%' } },
          // Left sidebar - Market watch
          React.createElement(Grid, { item: true, xs: 12, md: 2, sx: { height: '100%' } },
            React.createElement(Paper, { sx: { height: '100%', overflow: 'auto' } },
              React.createElement(MarketWatch, {
                selectedSymbol: selectedSymbol,
                onSymbolSelect: setSelectedSymbol
              })
            )
          ),
          
          // Main chart area
          React.createElement(Grid, { item: true, xs: 12, md: 7, sx: { height: '100%' } },
            React.createElement(Stack, { spacing: 2, sx: { height: '100%' } },
              // Chart
              React.createElement(Paper, { sx: { flexGrow: 1 } },
                React.createElement(CustomTradingChart, { symbol: selectedSymbol })
              ),
              
              // Order entry
              React.createElement(Paper, { sx: { height: '30%' } },
                React.createElement(OneClickTrading, {
                  symbol: selectedSymbol,
                  currentPrice: currentPrice
                })
              )
            )
          ),
          
          // Right sidebar - Orders and history
          React.createElement(Grid, { item: true, xs: 12, md: 3, sx: { height: '100%' } },
            React.createElement(Stack, { spacing: 2, sx: { height: '100%' } },
              // Order book
              React.createElement(Paper, { sx: { flexGrow: 1, overflow: 'auto' } },
                React.createElement(OrderBook, { symbol: selectedSymbol })
              ),
              
              // Trade history
              React.createElement(Paper, { sx: { flexGrow: 1, overflow: 'auto' } },
                React.createElement(TradeHistory)
              )
            )
          )
        )
      )
    );
  };

  // Create the trading platform layout
  return isStandalone
    ? React.createElement(Box, { sx: { height: '100vh', display: 'flex', flexDirection: 'column' } },
        // Top navigation bar with enhanced features for standalone mode
        React.createElement(TopBar, {
          pageTitle: 'Trading Platform',
          pageIcon: React.createElement(TrendingUpIcon),
          actions: tradingActionButtons,
          onMenuClick: () => {}, // Empty function since we don't need menu toggle in standalone mode
        }),
        createTradingContent()
      )
    : React.createElement(Box, { sx: { height: '100vh', display: 'flex', flexDirection: 'column' } },
        // Top navigation bar with enhanced features
        React.createElement(TopBar, {
          pageTitle: 'Trading Platform',
          pageIcon: React.createElement(TrendingUpIcon),
          actions: tradingActionButtons,
          onMenuClick: () => {}
        }),
    
    // Trading platform toolbar
    React.createElement(AppBar, {
      position: "static",
      color: "default",
      elevation: 0,
      sx: { borderBottom: 1, borderColor: 'divider' }
    },
      React.createElement(Toolbar, null,
        // Symbol selector
        React.createElement(Button, {
          onClick: handleMenuOpen,
          sx: { mr: 2 }
        }, selectedSymbol),
        
        React.createElement(Menu, {
          anchorEl: anchorEl,
          open: Boolean(anchorEl),
          onClose: handleMenuClose
        },
          Object.keys(tradingStore.prices).map(symbol => 
            React.createElement(MenuItem, {
              key: symbol,
              onClick: () => handleSymbolChange(symbol)
            }, symbol)
          )
        ),
        
        // Current price display
        React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', mr: 3 } },
          React.createElement(Typography, { variant: "body1", sx: { mr: 1 } }, "Bid:"),
          React.createElement(Typography, { variant: "body1", color: "error.main", fontWeight: "bold" },
            currentPrice.bid.toFixed(5)
          )
        ),
        
        React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', mr: 'auto' } },
          React.createElement(Typography, { variant: "body1", sx: { mr: 1 } }, "Ask:"),
          React.createElement(Typography, { variant: "body1", color: "success.main", fontWeight: "bold" },
            currentPrice.ask.toFixed(5)
          )
        ),
        
        // Search field
        React.createElement(TextField, {
          placeholder: "Search symbols...",
          size: "small",
          sx: { mr: 2 },
          InputProps: {
            startAdornment: React.createElement(InputAdornment, { position: "start" },
              React.createElement(SearchIcon, { fontSize: "small" })
            )
          }
        }),
        
        // Action buttons
        React.createElement(IconButton, { size: "large" },
          React.createElement(ViewComfyIcon)
        ),
        React.createElement(IconButton, { size: "large" },
          React.createElement(SettingsIcon)
        ),
        React.createElement(IconButton, { size: "large" },
          React.createElement(FullscreenIcon)
        )
      )
    ),
    
    // Main trading platform content
    React.createElement(Box, { sx: { flexGrow: 1, overflow: 'hidden', p: 2 } },
      React.createElement(Grid, { container: true, spacing: 2, sx: { height: '100%' } },
        // Left sidebar - Market watch
        React.createElement(Grid, { item: true, xs: 12, md: 2, sx: { height: '100%' } },
          React.createElement(Paper, { sx: { height: '100%', overflow: 'auto' } },
            React.createElement(MarketWatch, {
              selectedSymbol: selectedSymbol,
              onSymbolSelect: setSelectedSymbol
            })
          )
        ),
        
        // Main chart area
        React.createElement(Grid, { item: true, xs: 12, md: 7, sx: { height: '100%' } },
          React.createElement(Stack, { spacing: 2, sx: { height: '100%' } },
            // Chart
            React.createElement(Paper, { sx: { flexGrow: 1 } },
              React.createElement(CustomTradingChart, { symbol: selectedSymbol })
            ),
            
            // Order entry
            React.createElement(Paper, { sx: { height: '30%' } },
              React.createElement(OneClickTrading, {
                symbol: selectedSymbol,
                currentPrice: currentPrice
              })
            )
          )
        ),
        
        // Right sidebar - Orders and history
        React.createElement(Grid, { item: true, xs: 12, md: 3, sx: { height: '100%' } },
          React.createElement(Stack, { spacing: 2, sx: { height: '100%' } },
            // Order book
            React.createElement(Paper, { sx: { flexGrow: 1, overflow: 'auto' } },
              React.createElement(OrderBook, { symbol: selectedSymbol })
            ),
            
            // Trade history
            React.createElement(Paper, { sx: { flexGrow: 1, overflow: 'auto' } },
              React.createElement(TradeHistory)
            )
          )
        )
      )
    )
  );
});

export default TradingPlatform;
