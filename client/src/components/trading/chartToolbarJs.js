// chartToolbarJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  ButtonGroup,
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  ShowChart as LineChartIcon,
  CandlestickChart as CandlestickChartIcon,
  TrendingUp as AreaChartIcon,
  AddCircleOutline as AddIndicatorIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Timeline as TimelineIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import ChartSettingsDialog from './ChartSettings';

// Constants
const INDICATORS = [
  { id: 'ma', name: 'Moving Average', category: 'trend' },
  { id: 'ema', name: 'Exponential MA', category: 'trend' },
  { id: 'bb', name: 'Bollinger Bands', category: 'volatility' },
  { id: 'rsi', name: 'RSI', category: 'momentum' },
  { id: 'macd', name: 'MACD', category: 'momentum' },
  { id: 'stoch', name: 'Stochastic', category: 'momentum' },
  { id: 'atr', name: 'ATR', category: 'volatility' },
  { id: 'adx', name: 'ADX', category: 'trend' },
  { id: 'cci', name: 'CCI', category: 'momentum' },
  { id: 'obv', name: 'OBV', category: 'volume' },
  { id: 'mfi', name: 'MFI', category: 'volume' },
  { id: 'ichimoku', name: 'Ichimoku Cloud', category: 'trend' },
  { id: 'pivot', name: 'Pivot Points', category: 'support_resistance' },
  { id: 'fib', name: 'Fibonacci', category: 'support_resistance' },
];

const TIMEFRAMES = [
  { id: '1m', name: '1m' },
  { id: '5m', name: '5m' },
  { id: '15m', name: '15m' },
  { id: '30m', name: '30m' },
  { id: '1h', name: '1h' },
  { id: '4h', name: '4h' },
  { id: '1d', name: '1D' },
  { id: '1w', name: '1W' },
  { id: '1M', name: '1M' },
];

const ChartToolbar = ({
  onChartTypeChange,
  onAddIndicator,
  onRemoveIndicator,
  onTimeframeChange,
  onFullscreenToggle,
  activeIndicators = [], // Default to empty array if not provided
}) => {
  const [indicatorAnchorEl, setIndicatorAnchorEl] = useState(null);
  const [timeframeAnchorEl, setTimeframeAnchorEl] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleIndicatorClick = (event) => {
    setIndicatorAnchorEl(event.currentTarget);
  };

  const handleIndicatorClose = () => {
    setIndicatorAnchorEl(null);
  };

  const handleTimeframeClick = (event) => {
    setTimeframeAnchorEl(event.currentTarget);
  };

  const handleTimeframeClose = () => {
    setTimeframeAnchorEl(null);
  };

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    onFullscreenToggle();
  };

  // Create the chart type buttons
  const createChartTypeButtons = () => {
    return React.createElement(ButtonGroup, { size: "small", variant: "outlined" },
      // Candlestick button
      React.createElement(Tooltip, { title: "Candlestick" },
        React.createElement(IconButton, { onClick: () => onChartTypeChange('candlestick') },
          React.createElement(CandlestickChartIcon)
        )
      ),
      // Line button
      React.createElement(Tooltip, { title: "Line" },
        React.createElement(IconButton, { onClick: () => onChartTypeChange('line') },
          React.createElement(LineChartIcon)
        )
      ),
      // Bar button
      React.createElement(Tooltip, { title: "Bar" },
        React.createElement(IconButton, { onClick: () => onChartTypeChange('bar') },
          React.createElement(BarChartIcon)
        )
      ),
      // Area button
      React.createElement(Tooltip, { title: "Area" },
        React.createElement(IconButton, { onClick: () => onChartTypeChange('area') },
          React.createElement(AreaChartIcon)
        )
      )
    );
  };

  // Create the timeframe menu
  const createTimeframeMenu = () => {
    return [
      React.createElement(Tooltip, { title: "Timeframe", key: "timeframe-button" },
        React.createElement(IconButton, { onClick: handleTimeframeClick },
          React.createElement(TimelineIcon)
        )
      ),
      React.createElement(Menu, {
        key: "timeframe-menu",
        anchorEl: timeframeAnchorEl,
        open: Boolean(timeframeAnchorEl),
        onClose: handleTimeframeClose
      },
        TIMEFRAMES.map((timeframe) => 
          React.createElement(MenuItem, {
            key: timeframe.id,
            onClick: () => {
              onTimeframeChange(timeframe.id);
              handleTimeframeClose();
            }
          }, timeframe.name)
        )
      )
    ];
  };

  // Create the indicators menu
  const createIndicatorsMenu = () => {
    return [
      React.createElement(Tooltip, { title: "Add Indicator", key: "indicator-button" },
        React.createElement(IconButton, { onClick: handleIndicatorClick },
          React.createElement(AddIndicatorIcon)
        )
      ),
      React.createElement(Menu, {
        key: "indicator-menu",
        anchorEl: indicatorAnchorEl,
        open: Boolean(indicatorAnchorEl),
        onClose: handleIndicatorClose
      },
        INDICATORS.map((indicator) => 
          React.createElement(MenuItem, {
            key: indicator.id,
            onClick: () => {
              onAddIndicator(indicator.id);
              handleIndicatorClose();
            },
            disabled: activeIndicators.includes(indicator.id)
          },
            React.createElement(ListItemText, {
              primary: indicator.name,
              secondary: indicator.category
            }),
            activeIndicators.includes(indicator.id) ? 
              React.createElement(ListItemIcon, { sx: { minWidth: 'auto', ml: 1 } },
                React.createElement(IconButton, {
                  size: "small",
                  onClick: (e) => {
                    e.stopPropagation();
                    onRemoveIndicator(indicator.id);
                  }
                },
                  React.createElement(DeleteIcon, { fontSize: "small" })
                )
              ) : null
          )
        )
      )
    ];
  };

  // Create settings button and dialog
  const createSettingsElements = () => {
    return [
      React.createElement(Tooltip, { title: "Settings", key: "settings-button" },
        React.createElement(IconButton, { onClick: handleSettingsOpen },
          React.createElement(SettingsIcon)
        )
      ),
      React.createElement(ChartSettingsDialog, {
        key: "settings-dialog",
        open: settingsOpen,
        onClose: handleSettingsClose
      })
    ];
  };

  // Create fullscreen toggle button
  const createFullscreenButton = () => {
    return React.createElement(Tooltip, { title: isFullscreen ? "Exit Fullscreen" : "Fullscreen" },
      React.createElement(IconButton, { onClick: handleFullscreenToggle },
        isFullscreen ? 
          React.createElement(FullscreenExitIcon) : 
          React.createElement(FullscreenIcon)
      )
    );
  };

  // Main render
  return React.createElement(Box, {
    sx: { 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      p: 1, 
      borderBottom: 1, 
      borderColor: 'divider',
      bgcolor: 'background.paper',
    }
  },
    // Chart type buttons
    createChartTypeButtons(),
    
    // Divider
    React.createElement(Divider, { orientation: "vertical", flexItem: true }),
    
    // Timeframe menu
    ...createTimeframeMenu(),
    
    // Indicators menu
    ...createIndicatorsMenu(),
    
    // Settings button and dialog
    ...createSettingsElements(),
    
    // Spacer
    React.createElement(Box, { sx: { flexGrow: 1 } }),
    
    // Fullscreen toggle
    createFullscreenButton()
  );
};

export default ChartToolbar;
