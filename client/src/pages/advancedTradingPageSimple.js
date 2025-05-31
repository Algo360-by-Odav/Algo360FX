// advancedTradingPageSimple.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Timeline as BacktestIcon,
  Tune as OptimizeIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/storeProviderJs';

// Constants
const algorithmTypes = [
  { value: 'trend', label: 'Trend Following' },
  { value: 'mean-reversion', label: 'Mean Reversion' },
  { value: 'arbitrage', label: 'Arbitrage' },
  { value: 'ml-based', label: 'Machine Learning' }
];

const timeframes = [
  '1m', '5m', '15m', '30m', '1h', '4h', '1D', '1W'
];

// Advanced Trading Page component
const AdvancedTradingPage = observer(function AdvancedTradingPage() {
  const theme = useTheme();
  const { advancedTradingStore } = useStores();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBacktestDialogOpen, setIsBacktestDialogOpen] = useState(false);
  const [backtestParams, setBacktestParams] = useState({
    startDate: '2024-01-01',
    endDate: '2024-04-01',
    symbol: 'EURUSD',
    timeframe: '1h',
    initialCapital: 10000
  });
  const [selectedBacktestResult, setSelectedBacktestResult] = useState(null);
  const [isBacktestResultDialogOpen, setIsBacktestResultDialogOpen] = useState(false);
  
  // Optimization state
  const [isOptimizationDialogOpen, setIsOptimizationDialogOpen] = useState(false);
  const [optimizationParams, setOptimizationParams] = useState({
    stopLoss: { start: 1.0, end: 5.0, step: 0.5 },
    takeProfit: { start: 2.0, end: 10.0, step: 1.0 },
    fastMA: { start: 5, end: 30, step: 5 },
    slowMA: { start: 20, end: 100, step: 10 }
  });
  const [selectedOptimizationResult, setSelectedOptimizationResult] = useState(null);
  const [isOptimizationResultDialogOpen, setIsOptimizationResultDialogOpen] = useState(false);
  const [newAlgorithm, setNewAlgorithm] = useState({
    name: '',
    description: '',
    type: 'trend',
    settings: {
      timeframe: '1h',
      position: {
        size: 0.1,
        maxLeverage: 2
      },
      stopLoss: 2,
      takeProfit: 4,
      indicators: []
    }
  });

  // Load data when component mounts
  useEffect(() => {
    // This is handled by the store initialization
    console.log('Advanced Trading Page initialized');
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  // Handle start/stop
  const handleStartStop = (algorithmId) => {
    advancedTradingStore.toggleAlgorithmStatus(algorithmId);
  };

  // Reset form
  const resetForm = () => {
    setNewAlgorithm({
      name: '',
      description: '',
      type: 'trend',
      settings: {
        timeframe: '1h',
        position: {
          size: 0.1,
          maxLeverage: 2
        },
        stopLoss: 2,
        takeProfit: 4,
        indicators: []
      }
    });
    setSelectedAlgorithm(null);
  };

  // Handle form change
  const handleFormChange = (field, value) => {
    setNewAlgorithm({
      ...newAlgorithm,
      [field]: value
    });
  };

  // Handle settings change
  const handleSettingsChange = (field, value) => {
    setNewAlgorithm({
      ...newAlgorithm,
      settings: {
        ...newAlgorithm.settings,
        [field]: value
      }
    });
  };

  // Handle position settings change
  const handlePositionSettingsChange = (field, value) => {
    setNewAlgorithm({
      ...newAlgorithm,
      settings: {
        ...newAlgorithm.settings,
        position: {
          ...newAlgorithm.settings.position,
          [field]: value
        }
      }
    });
  };

  // Handle save
  const handleSave = () => {
    if (selectedAlgorithm) {
      // Update existing algorithm
      advancedTradingStore.updateAlgorithm(selectedAlgorithm.id, newAlgorithm);
    } else {
      // Add new algorithm
      advancedTradingStore.addAlgorithm(newAlgorithm);
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  // Handle delete
  const handleDelete = () => {
    if (selectedAlgorithm) {
      advancedTradingStore.deleteAlgorithm(selectedAlgorithm.id);
      setIsDeleteDialogOpen(false);
      setSelectedAlgorithm(null);
    }
  };

  // Create algorithm dialog
  const createAlgorithmDialog = () => {
    return React.createElement(Dialog, {
      key: 'algorithm-dialog',
      open: isDialogOpen,
      onClose: () => setIsDialogOpen(false),
      maxWidth: 'md',
      fullWidth: true
    }, [
      // Dialog title
      React.createElement(DialogTitle, { key: 'dialog-title' }, 
        selectedAlgorithm ? 'Edit Algorithm' : 'Add New Algorithm'
      ),
      
      // Dialog content
      React.createElement(DialogContent, { key: 'dialog-content' }, [
        React.createElement(Grid, { key: 'form-grid', container: true, spacing: 3 }, [
          // Name field
          React.createElement(Grid, { key: 'name-field', item: true, xs: 12 }, [
            React.createElement(TextField, {
              key: 'name-input',
              label: 'Algorithm Name',
              value: newAlgorithm.name,
              onChange: (e) => handleFormChange('name', e.target.value),
              fullWidth: true,
              required: true,
              variant: 'outlined'
            })
          ]),
          
          // Description field
          React.createElement(Grid, { key: 'description-field', item: true, xs: 12 }, [
            React.createElement(TextField, {
              key: 'description-input',
              label: 'Description',
              value: newAlgorithm.description,
              onChange: (e) => handleFormChange('description', e.target.value),
              fullWidth: true,
              multiline: true,
              rows: 2,
              variant: 'outlined'
            })
          ]),
          
          // Type field
          React.createElement(Grid, { key: 'type-field', item: true, xs: 12, sm: 6 }, [
            React.createElement(FormControl, { key: 'type-control', fullWidth: true, variant: 'outlined' }, [
              React.createElement(InputLabel, { key: 'type-label' }, 'Algorithm Type'),
              React.createElement(Select, {
                key: 'type-select',
                value: newAlgorithm.type,
                onChange: (e) => handleFormChange('type', e.target.value),
                label: 'Algorithm Type'
              }, 
                algorithmTypes.map(type => 
                  React.createElement(MenuItem, { key: `type-${type.value}`, value: type.value }, type.label)
                )
              )
            ])
          ]),
          
          // Timeframe field
          React.createElement(Grid, { key: 'timeframe-field', item: true, xs: 12, sm: 6 }, [
            React.createElement(FormControl, { key: 'timeframe-control', fullWidth: true, variant: 'outlined' }, [
              React.createElement(InputLabel, { key: 'timeframe-label' }, 'Timeframe'),
              React.createElement(Select, {
                key: 'timeframe-select',
                value: newAlgorithm.settings.timeframe,
                onChange: (e) => handleSettingsChange('timeframe', e.target.value),
                label: 'Timeframe'
              }, 
                timeframes.map(tf => 
                  React.createElement(MenuItem, { key: `timeframe-${tf}`, value: tf }, tf)
                )
              )
            ])
          ]),
          
          // Position size field
          React.createElement(Grid, { key: 'position-size-field', item: true, xs: 12, sm: 6 }, [
            React.createElement(TextField, {
              key: 'position-size-input',
              label: 'Position Size',
              type: 'number',
              value: newAlgorithm.settings.position.size,
              onChange: (e) => handlePositionSettingsChange('size', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 0.01, min: 0.01 }
            })
          ]),
          
          // Max leverage field
          React.createElement(Grid, { key: 'max-leverage-field', item: true, xs: 12, sm: 6 }, [
            React.createElement(TextField, {
              key: 'max-leverage-input',
              label: 'Max Leverage',
              type: 'number',
              value: newAlgorithm.settings.position.maxLeverage,
              onChange: (e) => handlePositionSettingsChange('maxLeverage', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 1, min: 1 }
            })
          ]),
          
          // Stop loss field
          React.createElement(Grid, { key: 'stop-loss-field', item: true, xs: 12, sm: 6 }, [
            React.createElement(TextField, {
              key: 'stop-loss-input',
              label: 'Stop Loss (%)',
              type: 'number',
              value: newAlgorithm.settings.stopLoss,
              onChange: (e) => handleSettingsChange('stopLoss', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 0.1, min: 0.1 }
            })
          ]),
          
          // Take profit field
          React.createElement(Grid, { key: 'take-profit-field', item: true, xs: 12, sm: 6 }, [
            React.createElement(TextField, {
              key: 'take-profit-input',
              label: 'Take Profit (%)',
              type: 'number',
              value: newAlgorithm.settings.takeProfit,
              onChange: (e) => handleSettingsChange('takeProfit', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 0.1, min: 0.1 }
            })
          ])
        ])
      ]),
      
      // Dialog actions
      React.createElement(DialogActions, { key: 'dialog-actions' }, [
        React.createElement(Button, {
          key: 'cancel-button',
          onClick: () => setIsDialogOpen(false)
        }, 'Cancel'),
        React.createElement(Button, {
          key: 'save-button',
          onClick: handleSave,
          variant: 'contained',
          color: 'primary'
        }, 'Save')
      ])
    ]);
  };

  // Handle backtest params change
  const handleBacktestParamsChange = (field, value) => {
    setBacktestParams({
      ...backtestParams,
      [field]: value
    });
  };

  // Handle run backtest
  const handleRunBacktest = () => {
    if (selectedAlgorithm) {
      advancedTradingStore.runBacktest(selectedAlgorithm.id, backtestParams);
      setIsBacktestDialogOpen(false);
      
      // Show results dialog after a delay to simulate processing
      setTimeout(() => {
        const results = advancedTradingStore.getBacktestResults(selectedAlgorithm.id);
        if (results && results.length > 0) {
          setSelectedBacktestResult(results[0]);
          setIsBacktestResultDialogOpen(true);
        }
      }, 2500);
    }
  };

  // Create backtest dialog
  const createBacktestDialog = () => {
    return React.createElement(Dialog, {
      key: 'backtest-dialog',
      open: isBacktestDialogOpen,
      onClose: () => setIsBacktestDialogOpen(false),
      maxWidth: 'md',
      fullWidth: true
    }, [
      // Dialog title
      React.createElement(DialogTitle, { key: 'backtest-dialog-title' }, 
        `Backtest ${selectedAlgorithm ? selectedAlgorithm.name : 'Algorithm'}`
      ),
      
      // Dialog content
      React.createElement(DialogContent, { key: 'backtest-dialog-content' }, [
        React.createElement(Grid, { key: 'backtest-form-grid', container: true, spacing: 3 }, [
          // Start date field
          React.createElement(Grid, { key: 'start-date-field', item: true, xs: 12, sm: 6 }, [
            React.createElement(TextField, {
              key: 'start-date-input',
              label: 'Start Date',
              type: 'date',
              value: backtestParams.startDate,
              onChange: (e) => handleBacktestParamsChange('startDate', e.target.value),
              fullWidth: true,
              variant: 'outlined',
              InputLabelProps: { shrink: true }
            })
          ]),
          
          // End date field
          React.createElement(Grid, { key: 'end-date-field', item: true, xs: 12, sm: 6 }, [
            React.createElement(TextField, {
              key: 'end-date-input',
              label: 'End Date',
              type: 'date',
              value: backtestParams.endDate,
              onChange: (e) => handleBacktestParamsChange('endDate', e.target.value),
              fullWidth: true,
              variant: 'outlined',
              InputLabelProps: { shrink: true }
            })
          ]),
          
          // Symbol field
          React.createElement(Grid, { key: 'symbol-field', item: true, xs: 12, sm: 6 }, [
            React.createElement(FormControl, { key: 'symbol-control', fullWidth: true, variant: 'outlined' }, [
              React.createElement(InputLabel, { key: 'symbol-label' }, 'Symbol'),
              React.createElement(Select, {
                key: 'symbol-select',
                value: backtestParams.symbol,
                onChange: (e) => handleBacktestParamsChange('symbol', e.target.value),
                label: 'Symbol'
              }, [
                React.createElement(MenuItem, { key: 'symbol-eurusd', value: 'EURUSD' }, 'EUR/USD'),
                React.createElement(MenuItem, { key: 'symbol-gbpusd', value: 'GBPUSD' }, 'GBP/USD'),
                React.createElement(MenuItem, { key: 'symbol-usdjpy', value: 'USDJPY' }, 'USD/JPY'),
                React.createElement(MenuItem, { key: 'symbol-audusd', value: 'AUDUSD' }, 'AUD/USD')
              ])
            ])
          ]),
          
          // Timeframe field
          React.createElement(Grid, { key: 'backtest-timeframe-field', item: true, xs: 12, sm: 6 }, [
            React.createElement(FormControl, { key: 'backtest-timeframe-control', fullWidth: true, variant: 'outlined' }, [
              React.createElement(InputLabel, { key: 'backtest-timeframe-label' }, 'Timeframe'),
              React.createElement(Select, {
                key: 'backtest-timeframe-select',
                value: backtestParams.timeframe,
                onChange: (e) => handleBacktestParamsChange('timeframe', e.target.value),
                label: 'Timeframe'
              }, 
                timeframes.map(tf => 
                  React.createElement(MenuItem, { key: `backtest-timeframe-${tf}`, value: tf }, tf)
                )
              )
            ])
          ]),
          
          // Initial capital field
          React.createElement(Grid, { key: 'initial-capital-field', item: true, xs: 12 }, [
            React.createElement(TextField, {
              key: 'initial-capital-input',
              label: 'Initial Capital',
              type: 'number',
              value: backtestParams.initialCapital,
              onChange: (e) => handleBacktestParamsChange('initialCapital', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 1000, min: 1000 }
            })
          ])
        ])
      ]),
      
      // Dialog actions
      React.createElement(DialogActions, { key: 'backtest-dialog-actions' }, [
        React.createElement(Button, {
          key: 'cancel-backtest-button',
          onClick: () => setIsBacktestDialogOpen(false)
        }, 'Cancel'),
        React.createElement(Button, {
          key: 'run-backtest-button',
          onClick: handleRunBacktest,
          variant: 'contained',
          color: 'primary'
        }, 'Run Backtest')
      ])
    ]);
  };

  // Handle optimization params change
  const handleOptimizationParamsChange = (param, field, value) => {
    setOptimizationParams({
      ...optimizationParams,
      [param]: {
        ...optimizationParams[param],
        [field]: value
      }
    });
  };

  // Handle run optimization
  const handleRunOptimization = () => {
    if (selectedAlgorithm) {
      advancedTradingStore.runOptimization(selectedAlgorithm.id, optimizationParams);
      setIsOptimizationDialogOpen(false);
      
      // Show results dialog after a delay to simulate processing
      setTimeout(() => {
        const results = advancedTradingStore.getOptimizationResults(selectedAlgorithm.id);
        if (results && results.length > 0) {
          setSelectedOptimizationResult(results[0]);
          setIsOptimizationResultDialogOpen(true);
        }
      }, 3500);
    }
  };

  // Create optimization dialog
  const createOptimizationDialog = () => {
    return React.createElement(Dialog, {
      key: 'optimization-dialog',
      open: isOptimizationDialogOpen,
      onClose: () => setIsOptimizationDialogOpen(false),
      maxWidth: 'md',
      fullWidth: true
    }, [
      // Dialog title
      React.createElement(DialogTitle, { key: 'optimization-dialog-title' }, 
        `Optimize ${selectedAlgorithm ? selectedAlgorithm.name : 'Algorithm'}`
      ),
      
      // Dialog content
      React.createElement(DialogContent, { key: 'optimization-dialog-content' }, [
        React.createElement(Typography, { 
          key: 'optimization-description', 
          variant: 'body2', 
          color: 'text.secondary',
          sx: { mb: 3 }
        }, 
          'Specify parameter ranges to find the optimal settings for your algorithm. The system will test various combinations to maximize performance.'
        ),
        React.createElement(Grid, { key: 'optimization-form-grid', container: true, spacing: 3 }, [
          // Stop Loss parameter
          React.createElement(Grid, { key: 'stop-loss-param', item: true, xs: 12 }, [
            React.createElement(Typography, { 
              key: 'stop-loss-param-title', 
              variant: 'subtitle2', 
              gutterBottom: true 
            }, 'Stop Loss (%)')
          ]),
          
          // Stop Loss - Start
          React.createElement(Grid, { key: 'stop-loss-start', item: true, xs: 12, sm: 4 }, [
            React.createElement(TextField, {
              key: 'stop-loss-start-input',
              label: 'Start',
              type: 'number',
              value: optimizationParams.stopLoss.start,
              onChange: (e) => handleOptimizationParamsChange('stopLoss', 'start', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 0.1, min: 0.1 }
            })
          ]),
          
          // Stop Loss - End
          React.createElement(Grid, { key: 'stop-loss-end', item: true, xs: 12, sm: 4 }, [
            React.createElement(TextField, {
              key: 'stop-loss-end-input',
              label: 'End',
              type: 'number',
              value: optimizationParams.stopLoss.end,
              onChange: (e) => handleOptimizationParamsChange('stopLoss', 'end', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 0.1, min: 0.1 }
            })
          ]),
          
          // Stop Loss - Step
          React.createElement(Grid, { key: 'stop-loss-step', item: true, xs: 12, sm: 4 }, [
            React.createElement(TextField, {
              key: 'stop-loss-step-input',
              label: 'Step',
              type: 'number',
              value: optimizationParams.stopLoss.step,
              onChange: (e) => handleOptimizationParamsChange('stopLoss', 'step', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 0.1, min: 0.1 }
            })
          ]),
          
          // Take Profit parameter
          React.createElement(Grid, { key: 'take-profit-param', item: true, xs: 12 }, [
            React.createElement(Typography, { 
              key: 'take-profit-param-title', 
              variant: 'subtitle2', 
              gutterBottom: true 
            }, 'Take Profit (%)')
          ]),
          
          // Take Profit - Start
          React.createElement(Grid, { key: 'take-profit-start', item: true, xs: 12, sm: 4 }, [
            React.createElement(TextField, {
              key: 'take-profit-start-input',
              label: 'Start',
              type: 'number',
              value: optimizationParams.takeProfit.start,
              onChange: (e) => handleOptimizationParamsChange('takeProfit', 'start', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 0.5, min: 0.5 }
            })
          ]),
          
          // Take Profit - End
          React.createElement(Grid, { key: 'take-profit-end', item: true, xs: 12, sm: 4 }, [
            React.createElement(TextField, {
              key: 'take-profit-end-input',
              label: 'End',
              type: 'number',
              value: optimizationParams.takeProfit.end,
              onChange: (e) => handleOptimizationParamsChange('takeProfit', 'end', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 0.5, min: 0.5 }
            })
          ]),
          
          // Take Profit - Step
          React.createElement(Grid, { key: 'take-profit-step', item: true, xs: 12, sm: 4 }, [
            React.createElement(TextField, {
              key: 'take-profit-step-input',
              label: 'Step',
              type: 'number',
              value: optimizationParams.takeProfit.step,
              onChange: (e) => handleOptimizationParamsChange('takeProfit', 'step', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 0.5, min: 0.1 }
            })
          ]),
          
          // Fast MA parameter (for trend algorithms)
          React.createElement(Grid, { key: 'fast-ma-param', item: true, xs: 12 }, [
            React.createElement(Typography, { 
              key: 'fast-ma-param-title', 
              variant: 'subtitle2', 
              gutterBottom: true 
            }, 'Fast Moving Average Period')
          ]),
          
          // Fast MA - Start
          React.createElement(Grid, { key: 'fast-ma-start', item: true, xs: 12, sm: 4 }, [
            React.createElement(TextField, {
              key: 'fast-ma-start-input',
              label: 'Start',
              type: 'number',
              value: optimizationParams.fastMA.start,
              onChange: (e) => handleOptimizationParamsChange('fastMA', 'start', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 1, min: 2 }
            })
          ]),
          
          // Fast MA - End
          React.createElement(Grid, { key: 'fast-ma-end', item: true, xs: 12, sm: 4 }, [
            React.createElement(TextField, {
              key: 'fast-ma-end-input',
              label: 'End',
              type: 'number',
              value: optimizationParams.fastMA.end,
              onChange: (e) => handleOptimizationParamsChange('fastMA', 'end', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 1, min: 5 }
            })
          ]),
          
          // Fast MA - Step
          React.createElement(Grid, { key: 'fast-ma-step', item: true, xs: 12, sm: 4 }, [
            React.createElement(TextField, {
              key: 'fast-ma-step-input',
              label: 'Step',
              type: 'number',
              value: optimizationParams.fastMA.step,
              onChange: (e) => handleOptimizationParamsChange('fastMA', 'step', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 1, min: 1 }
            })
          ]),
          
          // Slow MA parameter (for trend algorithms)
          React.createElement(Grid, { key: 'slow-ma-param', item: true, xs: 12 }, [
            React.createElement(Typography, { 
              key: 'slow-ma-param-title', 
              variant: 'subtitle2', 
              gutterBottom: true 
            }, 'Slow Moving Average Period')
          ]),
          
          // Slow MA - Start
          React.createElement(Grid, { key: 'slow-ma-start', item: true, xs: 12, sm: 4 }, [
            React.createElement(TextField, {
              key: 'slow-ma-start-input',
              label: 'Start',
              type: 'number',
              value: optimizationParams.slowMA.start,
              onChange: (e) => handleOptimizationParamsChange('slowMA', 'start', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 5, min: 10 }
            })
          ]),
          
          // Slow MA - End
          React.createElement(Grid, { key: 'slow-ma-end', item: true, xs: 12, sm: 4 }, [
            React.createElement(TextField, {
              key: 'slow-ma-end-input',
              label: 'End',
              type: 'number',
              value: optimizationParams.slowMA.end,
              onChange: (e) => handleOptimizationParamsChange('slowMA', 'end', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 5, min: 20 }
            })
          ]),
          
          // Slow MA - Step
          React.createElement(Grid, { key: 'slow-ma-step', item: true, xs: 12, sm: 4 }, [
            React.createElement(TextField, {
              key: 'slow-ma-step-input',
              label: 'Step',
              type: 'number',
              value: optimizationParams.slowMA.step,
              onChange: (e) => handleOptimizationParamsChange('slowMA', 'step', Number(e.target.value)),
              fullWidth: true,
              variant: 'outlined',
              inputProps: { step: 5, min: 5 }
            })
          ])
        ])
      ]),
      
      // Dialog actions
      React.createElement(DialogActions, { key: 'optimization-dialog-actions' }, [
        React.createElement(Button, {
          key: 'cancel-optimization-button',
          onClick: () => setIsOptimizationDialogOpen(false)
        }, 'Cancel'),
        React.createElement(Button, {
          key: 'run-optimization-button',
          onClick: handleRunOptimization,
          variant: 'contained',
          color: 'primary'
        }, 'Run Optimization')
      ])
    ]);
  };

  // Create optimization result dialog
  const createOptimizationResultDialog = () => {
    if (!selectedOptimizationResult) return null;
    
    return React.createElement(Dialog, {
      key: 'optimization-result-dialog',
      open: isOptimizationResultDialogOpen,
      onClose: () => setIsOptimizationResultDialogOpen(false),
      maxWidth: 'lg',
      fullWidth: true
    }, [
      // Dialog title
      React.createElement(DialogTitle, { key: 'optimization-result-dialog-title' }, 
        'Optimization Results'
      ),
      
      // Dialog content
      React.createElement(DialogContent, { key: 'optimization-result-dialog-content' }, [
        // Best parameters
        React.createElement(Box, { key: 'optimization-best-params', sx: { mb: 3 } }, [
          React.createElement(Typography, { key: 'optimization-best-params-title', variant: 'h6', gutterBottom: true }, 
            'Optimal Parameters'
          ),
          React.createElement(Grid, { key: 'optimization-best-params-grid', container: true, spacing: 2 }, 
            Object.keys(selectedOptimizationResult.bestCombination).map(param => {
              if (param !== 'return' && param !== 'sharpe') {
                return React.createElement(Grid, { key: `best-${param}`, item: true, xs: 6, sm: 3 }, [
                  React.createElement(Typography, { key: `best-${param}-label`, variant: 'caption', color: 'text.secondary' }, 
                    param === 'stopLoss' ? 'Stop Loss' : 
                    param === 'takeProfit' ? 'Take Profit' : 
                    param === 'fastMA' ? 'Fast MA Period' : 
                    param === 'slowMA' ? 'Slow MA Period' : param
                  ),
                  React.createElement(Typography, { key: `best-${param}-value`, variant: 'body2' }, 
                    selectedOptimizationResult.bestCombination[param].toFixed(
                      param === 'stopLoss' || param === 'takeProfit' ? 1 : 0
                    ) + (param === 'stopLoss' || param === 'takeProfit' ? '%' : '')
                  )
                ]);
              }
              return null;
            })
          )
        ]),
        
        // Performance
        React.createElement(Box, { key: 'optimization-performance', sx: { mb: 3 } }, [
          React.createElement(Typography, { key: 'optimization-performance-title', variant: 'h6', gutterBottom: true }, 
            'Expected Performance'
          ),
          React.createElement(Grid, { key: 'optimization-performance-grid', container: true, spacing: 2 }, [
            // Return
            React.createElement(Grid, { key: 'optimization-return', item: true, xs: 6, sm: 3 }, [
              React.createElement(Typography, { key: 'optimization-return-label', variant: 'caption', color: 'text.secondary' }, 
                'Return'
              ),
              React.createElement(Typography, { 
                key: 'optimization-return-value', 
                variant: 'body2',
                color: 'success.main'
              }, 
                `${selectedOptimizationResult.bestPerformance.return.toFixed(2)}%`
              )
            ]),
            
            // Sharpe Ratio
            React.createElement(Grid, { key: 'optimization-sharpe', item: true, xs: 6, sm: 3 }, [
              React.createElement(Typography, { key: 'optimization-sharpe-label', variant: 'caption', color: 'text.secondary' }, 
                'Sharpe Ratio'
              ),
              React.createElement(Typography, { key: 'optimization-sharpe-value', variant: 'body2' }, 
                selectedOptimizationResult.bestPerformance.sharpe.toFixed(2)
              )
            ]),
            
            // Max Drawdown
            React.createElement(Grid, { key: 'optimization-drawdown', item: true, xs: 6, sm: 3 }, [
              React.createElement(Typography, { key: 'optimization-drawdown-label', variant: 'caption', color: 'text.secondary' }, 
                'Max Drawdown'
              ),
              React.createElement(Typography, { key: 'optimization-drawdown-value', variant: 'body2', color: 'error.main' }, 
                `${selectedOptimizationResult.bestPerformance.drawdown.toFixed(2)}%`
              )
            ]),
            
            // Win Rate
            React.createElement(Grid, { key: 'optimization-winrate', item: true, xs: 6, sm: 3 }, [
              React.createElement(Typography, { key: 'optimization-winrate-label', variant: 'caption', color: 'text.secondary' }, 
                'Win Rate'
              ),
              React.createElement(Typography, { key: 'optimization-winrate-value', variant: 'body2' }, 
                `${selectedOptimizationResult.bestPerformance.winRate.toFixed(2)}%`
              )
            ])
          ])
        ]),
        
        // Results table
        React.createElement(Box, { key: 'optimization-results-table', sx: { mb: 3 } }, [
          React.createElement(Typography, { key: 'optimization-results-table-title', variant: 'h6', gutterBottom: true }, 
            'Top Parameter Combinations'
          ),
          React.createElement(Paper, { key: 'optimization-results-table-paper', sx: { width: '100%', overflow: 'hidden' } }, [
            React.createElement(Box, { key: 'optimization-results-table-box', sx: { width: '100%', overflow: 'auto' } }, [
              // Table headers
              React.createElement(Box, { 
                key: 'optimization-results-table-header', 
                sx: { 
                  display: 'flex',
                  bgcolor: 'background.paper',
                  borderBottom: 1,
                  borderColor: 'divider',
                  p: 1
                } 
              }, [
                // Parameter headers
                ...Object.keys(selectedOptimizationResult.bestCombination)
                  .filter(param => param !== 'return' && param !== 'sharpe')
                  .map(param => 
                    React.createElement(Box, { 
                      key: `header-${param}`, 
                      sx: { flex: 1, fontWeight: 'bold', px: 1 } 
                    }, 
                      param === 'stopLoss' ? 'Stop Loss' : 
                      param === 'takeProfit' ? 'Take Profit' : 
                      param === 'fastMA' ? 'Fast MA' : 
                      param === 'slowMA' ? 'Slow MA' : param
                    )
                  ),
                
                // Performance headers
                React.createElement(Box, { key: 'header-return', sx: { flex: 1, fontWeight: 'bold', px: 1 } }, 'Return'),
                React.createElement(Box, { key: 'header-sharpe', sx: { flex: 1, fontWeight: 'bold', px: 1 } }, 'Sharpe')
              ]),
              
              // Table rows
              ...selectedOptimizationResult.results.map((result, index) => 
                React.createElement(Box, { 
                  key: `row-${index}`, 
                  sx: { 
                    display: 'flex',
                    bgcolor: index === 0 ? 'action.selected' : 'background.paper',
                    borderBottom: 1,
                    borderColor: 'divider',
                    p: 1
                  } 
                }, [
                  // Parameter values
                  ...Object.keys(result)
                    .filter(param => param !== 'return' && param !== 'sharpe')
                    .map(param => 
                      React.createElement(Box, { key: `cell-${index}-${param}`, sx: { flex: 1, px: 1 } }, 
                        result[param].toFixed(param === 'stopLoss' || param === 'takeProfit' ? 1 : 0)
                      )
                    ),
                  
                  // Performance values
                  React.createElement(Box, { 
                    key: `cell-${index}-return`, 
                    sx: { 
                      flex: 1, 
                      px: 1,
                      color: result.return >= 0 ? 'success.main' : 'error.main'
                    } 
                  }, 
                    `${result.return.toFixed(2)}%`
                  ),
                  React.createElement(Box, { key: `cell-${index}-sharpe`, sx: { flex: 1, px: 1 } }, 
                    result.sharpe.toFixed(2)
                  )
                ])
              )
            ])
          ])
        ])
      ]),
      
      // Dialog actions
      React.createElement(DialogActions, { key: 'optimization-result-dialog-actions' }, [
        React.createElement(Button, {
          key: 'apply-optimization-button',
          onClick: () => {
            // Apply the optimized parameters
            const algorithm = advancedTradingStore.getAlgorithm(selectedAlgorithm.id);
            if (algorithm) {
              const updatedSettings = { ...algorithm.settings };
              Object.keys(selectedOptimizationResult.bestCombination).forEach(param => {
                if (param !== 'return' && param !== 'sharpe') {
                  if (param === 'stopLoss' || param === 'takeProfit') {
                    updatedSettings[param] = selectedOptimizationResult.bestCombination[param];
                  }
                }
              });
              
              advancedTradingStore.updateAlgorithm(selectedAlgorithm.id, { settings: updatedSettings });
            }
            setIsOptimizationResultDialogOpen(false);
          },
          variant: 'contained',
          color: 'success'
        }, 'Apply Parameters'),
        React.createElement(Button, {
          key: 'close-optimization-result-button',
          onClick: () => setIsOptimizationResultDialogOpen(false),
          variant: 'outlined'
        }, 'Close')
      ])
    ]);
  };

  // Create backtest result dialog
  const createBacktestResultDialog = () => {
    if (!selectedBacktestResult) return null;
    
    return React.createElement(Dialog, {
      key: 'backtest-result-dialog',
      open: isBacktestResultDialogOpen,
      onClose: () => setIsBacktestResultDialogOpen(false),
      maxWidth: 'lg',
      fullWidth: true
    }, [
      // Dialog title
      React.createElement(DialogTitle, { key: 'backtest-result-dialog-title' }, 
        'Backtest Results'
      ),
      
      // Dialog content
      React.createElement(DialogContent, { key: 'backtest-result-dialog-content' }, [
        // Summary
        React.createElement(Box, { key: 'backtest-summary', sx: { mb: 3 } }, [
          React.createElement(Typography, { key: 'backtest-summary-title', variant: 'h6', gutterBottom: true }, 
            'Summary'
          ),
          React.createElement(Grid, { key: 'backtest-summary-grid', container: true, spacing: 2 }, [
            // Period
            React.createElement(Grid, { key: 'backtest-period', item: true, xs: 12, sm: 6, md: 3 }, [
              React.createElement(Typography, { key: 'backtest-period-label', variant: 'caption', color: 'text.secondary' }, 
                'Period'
              ),
              React.createElement(Typography, { key: 'backtest-period-value', variant: 'body2' }, 
                `${selectedBacktestResult.startDate} to ${selectedBacktestResult.endDate}`
              )
            ]),
            
            // Symbol
            React.createElement(Grid, { key: 'backtest-symbol', item: true, xs: 12, sm: 6, md: 3 }, [
              React.createElement(Typography, { key: 'backtest-symbol-label', variant: 'caption', color: 'text.secondary' }, 
                'Symbol'
              ),
              React.createElement(Typography, { key: 'backtest-symbol-value', variant: 'body2' }, 
                selectedBacktestResult.symbol
              )
            ]),
            
            // Timeframe
            React.createElement(Grid, { key: 'backtest-timeframe', item: true, xs: 12, sm: 6, md: 3 }, [
              React.createElement(Typography, { key: 'backtest-timeframe-label', variant: 'caption', color: 'text.secondary' }, 
                'Timeframe'
              ),
              React.createElement(Typography, { key: 'backtest-timeframe-value', variant: 'body2' }, 
                selectedBacktestResult.timeframe
              )
            ]),
            
            // Initial Capital
            React.createElement(Grid, { key: 'backtest-initial-capital', item: true, xs: 12, sm: 6, md: 3 }, [
              React.createElement(Typography, { key: 'backtest-initial-capital-label', variant: 'caption', color: 'text.secondary' }, 
                'Initial Capital'
              ),
              React.createElement(Typography, { key: 'backtest-initial-capital-value', variant: 'body2' }, 
                `$${selectedBacktestResult.initialCapital.toLocaleString()}`
              )
            ])
          ])
        ]),
        
        // Performance
        React.createElement(Box, { key: 'backtest-performance', sx: { mb: 3 } }, [
          React.createElement(Typography, { key: 'backtest-performance-title', variant: 'h6', gutterBottom: true }, 
            'Performance'
          ),
          React.createElement(Grid, { key: 'backtest-performance-grid', container: true, spacing: 2 }, [
            // Total Return
            React.createElement(Grid, { key: 'backtest-total-return', item: true, xs: 6, sm: 4, md: 2 }, [
              React.createElement(Typography, { key: 'backtest-total-return-label', variant: 'caption', color: 'text.secondary' }, 
                'Total Return'
              ),
              React.createElement(Typography, { 
                key: 'backtest-total-return-value', 
                variant: 'body2',
                color: selectedBacktestResult.totalReturn >= 0 ? 'success.main' : 'error.main'
              }, 
                `${selectedBacktestResult.totalReturn.toFixed(2)}%`
              )
            ]),
            
            // Annualized Return
            React.createElement(Grid, { key: 'backtest-annual-return', item: true, xs: 6, sm: 4, md: 2 }, [
              React.createElement(Typography, { key: 'backtest-annual-return-label', variant: 'caption', color: 'text.secondary' }, 
                'Annual Return'
              ),
              React.createElement(Typography, { 
                key: 'backtest-annual-return-value', 
                variant: 'body2',
                color: selectedBacktestResult.annualizedReturn >= 0 ? 'success.main' : 'error.main'
              }, 
                `${selectedBacktestResult.annualizedReturn.toFixed(2)}%`
              )
            ]),
            
            // Sharpe Ratio
            React.createElement(Grid, { key: 'backtest-sharpe', item: true, xs: 6, sm: 4, md: 2 }, [
              React.createElement(Typography, { key: 'backtest-sharpe-label', variant: 'caption', color: 'text.secondary' }, 
                'Sharpe Ratio'
              ),
              React.createElement(Typography, { key: 'backtest-sharpe-value', variant: 'body2' }, 
                selectedBacktestResult.sharpeRatio.toFixed(2)
              )
            ]),
            
            // Max Drawdown
            React.createElement(Grid, { key: 'backtest-drawdown', item: true, xs: 6, sm: 4, md: 2 }, [
              React.createElement(Typography, { key: 'backtest-drawdown-label', variant: 'caption', color: 'text.secondary' }, 
                'Max Drawdown'
              ),
              React.createElement(Typography, { key: 'backtest-drawdown-value', variant: 'body2', color: 'error.main' }, 
                `${selectedBacktestResult.maxDrawdown.toFixed(2)}%`
              )
            ]),
            
            // Win Rate
            React.createElement(Grid, { key: 'backtest-winrate', item: true, xs: 6, sm: 4, md: 2 }, [
              React.createElement(Typography, { key: 'backtest-winrate-label', variant: 'caption', color: 'text.secondary' }, 
                'Win Rate'
              ),
              React.createElement(Typography, { key: 'backtest-winrate-value', variant: 'body2' }, 
                `${selectedBacktestResult.winRate.toFixed(2)}%`
              )
            ]),
            
            // Profit Factor
            React.createElement(Grid, { key: 'backtest-profit-factor', item: true, xs: 6, sm: 4, md: 2 }, [
              React.createElement(Typography, { key: 'backtest-profit-factor-label', variant: 'caption', color: 'text.secondary' }, 
                'Profit Factor'
              ),
              React.createElement(Typography, { key: 'backtest-profit-factor-value', variant: 'body2' }, 
                selectedBacktestResult.profitFactor.toFixed(2)
              )
            ])
          ])
        ]),
        
        // Trade Statistics
        React.createElement(Box, { key: 'backtest-trade-stats', sx: { mb: 3 } }, [
          React.createElement(Typography, { key: 'backtest-trade-stats-title', variant: 'h6', gutterBottom: true }, 
            'Trade Statistics'
          ),
          React.createElement(Grid, { key: 'backtest-trade-stats-grid', container: true, spacing: 2 }, [
            // Total Trades
            React.createElement(Grid, { key: 'backtest-total-trades', item: true, xs: 6, sm: 4, md: 2 }, [
              React.createElement(Typography, { key: 'backtest-total-trades-label', variant: 'caption', color: 'text.secondary' }, 
                'Total Trades'
              ),
              React.createElement(Typography, { key: 'backtest-total-trades-value', variant: 'body2' }, 
                selectedBacktestResult.totalTrades
              )
            ]),
            
            // Winning Trades
            React.createElement(Grid, { key: 'backtest-winning-trades', item: true, xs: 6, sm: 4, md: 2 }, [
              React.createElement(Typography, { key: 'backtest-winning-trades-label', variant: 'caption', color: 'text.secondary' }, 
                'Winning Trades'
              ),
              React.createElement(Typography, { key: 'backtest-winning-trades-value', variant: 'body2', color: 'success.main' }, 
                selectedBacktestResult.winningTrades
              )
            ]),
            
            // Losing Trades
            React.createElement(Grid, { key: 'backtest-losing-trades', item: true, xs: 6, sm: 4, md: 2 }, [
              React.createElement(Typography, { key: 'backtest-losing-trades-label', variant: 'caption', color: 'text.secondary' }, 
                'Losing Trades'
              ),
              React.createElement(Typography, { key: 'backtest-losing-trades-value', variant: 'body2', color: 'error.main' }, 
                selectedBacktestResult.losingTrades
              )
            ])
          ])
        ])
      ]),
      
      // Dialog actions
      React.createElement(DialogActions, { key: 'backtest-result-dialog-actions' }, [
        React.createElement(Button, {
          key: 'close-backtest-result-button',
          onClick: () => setIsBacktestResultDialogOpen(false),
          variant: 'contained',
          color: 'primary'
        }, 'Close')
      ])
    ]);
  };

  // Create delete confirmation dialog
  const createDeleteDialog = () => {
    return React.createElement(Dialog, {
      key: 'delete-dialog',
      open: isDeleteDialogOpen,
      onClose: () => setIsDeleteDialogOpen(false),
      maxWidth: 'sm',
      fullWidth: true
    }, [
      // Dialog title
      React.createElement(DialogTitle, { key: 'delete-dialog-title' }, 'Delete Algorithm'),
      
      // Dialog content
      React.createElement(DialogContent, { key: 'delete-dialog-content' }, [
        React.createElement(Typography, { key: 'delete-dialog-text' }, 
          `Are you sure you want to delete "${selectedAlgorithm ? selectedAlgorithm.name : ''}"? This action cannot be undone.`
        )
      ]),
      
      // Dialog actions
      React.createElement(DialogActions, { key: 'delete-dialog-actions' }, [
        React.createElement(Button, {
          key: 'cancel-delete-button',
          onClick: () => setIsDeleteDialogOpen(false)
        }, 'Cancel'),
        React.createElement(Button, {
          key: 'confirm-delete-button',
          onClick: handleDelete,
          variant: 'contained',
          color: 'error'
        }, 'Delete')
      ])
    ]);
  };

  // Render Market Data tab
  const renderMarketDataTab = () => {
    return React.createElement(Box, { key: 'market-data-content' }, [
      // Title
      React.createElement(Typography, { 
        key: 'market-data-title', 
        variant: 'h5', 
        gutterBottom: true,
        sx: { mb: 3 }
      }, 'Market Data Analysis'),
      
      // Market data cards
      React.createElement(Grid, { key: 'market-data-grid', container: true, spacing: 3 }, [
        // Forex Pairs card
        React.createElement(Grid, { key: 'forex-pairs-grid', item: true, xs: 12, md: 6 }, [
          React.createElement(Card, { key: 'forex-pairs-card' }, [
            React.createElement(CardContent, { key: 'forex-pairs-content' }, [
              React.createElement(Typography, { key: 'forex-pairs-title', variant: 'h6', gutterBottom: true }, 'Forex Pairs'),
              React.createElement(Table, { key: 'forex-pairs-table', size: 'small' }, [
                React.createElement(TableHead, { key: 'forex-pairs-table-head' }, [
                  React.createElement(TableRow, { key: 'forex-pairs-table-head-row' }, [
                    React.createElement(TableCell, { key: 'forex-pairs-symbol-header' }, 'Symbol'),
                    React.createElement(TableCell, { key: 'forex-pairs-bid-header', align: 'right' }, 'Bid'),
                    React.createElement(TableCell, { key: 'forex-pairs-ask-header', align: 'right' }, 'Ask'),
                    React.createElement(TableCell, { key: 'forex-pairs-change-header', align: 'right' }, 'Change %')
                  ])
                ]),
                React.createElement(TableBody, { key: 'forex-pairs-table-body' }, [
                  // EURUSD
                  React.createElement(TableRow, { key: 'forex-pair-eurusd' }, [
                    React.createElement(TableCell, { key: 'forex-pair-eurusd-symbol' }, 'EUR/USD'),
                    React.createElement(TableCell, { key: 'forex-pair-eurusd-bid', align: 'right' }, '1.0921'),
                    React.createElement(TableCell, { key: 'forex-pair-eurusd-ask', align: 'right' }, '1.0923'),
                    React.createElement(TableCell, { 
                      key: 'forex-pair-eurusd-change', 
                      align: 'right',
                      sx: { color: 'success.main' }
                    }, '+0.15%')
                  ]),
                  // GBPUSD
                  React.createElement(TableRow, { key: 'forex-pair-gbpusd' }, [
                    React.createElement(TableCell, { key: 'forex-pair-gbpusd-symbol' }, 'GBP/USD'),
                    React.createElement(TableCell, { key: 'forex-pair-gbpusd-bid', align: 'right' }, '1.2654'),
                    React.createElement(TableCell, { key: 'forex-pair-gbpusd-ask', align: 'right' }, '1.2657'),
                    React.createElement(TableCell, { 
                      key: 'forex-pair-gbpusd-change', 
                      align: 'right',
                      sx: { color: 'error.main' }
                    }, '-0.22%')
                  ]),
                  // USDJPY
                  React.createElement(TableRow, { key: 'forex-pair-usdjpy' }, [
                    React.createElement(TableCell, { key: 'forex-pair-usdjpy-symbol' }, 'USD/JPY'),
                    React.createElement(TableCell, { key: 'forex-pair-usdjpy-bid', align: 'right' }, '153.42'),
                    React.createElement(TableCell, { key: 'forex-pair-usdjpy-ask', align: 'right' }, '153.45'),
                    React.createElement(TableCell, { 
                      key: 'forex-pair-usdjpy-change', 
                      align: 'right',
                      sx: { color: 'success.main' }
                    }, '+0.31%')
                  ])
                ])
              ])
            ])
          ])
        ]),
        
        // Economic Calendar card
        React.createElement(Grid, { key: 'economic-calendar-grid', item: true, xs: 12, md: 6 }, [
          React.createElement(Card, { key: 'economic-calendar-card' }, [
            React.createElement(CardContent, { key: 'economic-calendar-content' }, [
              React.createElement(Typography, { key: 'economic-calendar-title', variant: 'h6', gutterBottom: true }, 'Economic Calendar'),
              React.createElement(Table, { key: 'economic-calendar-table', size: 'small' }, [
                React.createElement(TableHead, { key: 'economic-calendar-table-head' }, [
                  React.createElement(TableRow, { key: 'economic-calendar-table-head-row' }, [
                    React.createElement(TableCell, { key: 'economic-calendar-time-header' }, 'Time'),
                    React.createElement(TableCell, { key: 'economic-calendar-country-header' }, 'Country'),
                    React.createElement(TableCell, { key: 'economic-calendar-event-header' }, 'Event'),
                    React.createElement(TableCell, { key: 'economic-calendar-impact-header', align: 'right' }, 'Impact')
                  ])
                ]),
                React.createElement(TableBody, { key: 'economic-calendar-table-body' }, [
                  // Event 1
                  React.createElement(TableRow, { key: 'economic-event-1' }, [
                    React.createElement(TableCell, { key: 'economic-event-1-time' }, '08:30'),
                    React.createElement(TableCell, { key: 'economic-event-1-country' }, 'USD'),
                    React.createElement(TableCell, { key: 'economic-event-1-event' }, 'Non-Farm Payrolls'),
                    React.createElement(TableCell, { key: 'economic-event-1-impact', align: 'right' }, [
                      React.createElement(Chip, { 
                        key: 'economic-event-1-impact-chip',
                        label: 'High',
                        size: 'small',
                        color: 'error'
                      })
                    ])
                  ]),
                  // Event 2
                  React.createElement(TableRow, { key: 'economic-event-2' }, [
                    React.createElement(TableCell, { key: 'economic-event-2-time' }, '10:00'),
                    React.createElement(TableCell, { key: 'economic-event-2-country' }, 'EUR'),
                    React.createElement(TableCell, { key: 'economic-event-2-event' }, 'ECB Interest Rate Decision'),
                    React.createElement(TableCell, { key: 'economic-event-2-impact', align: 'right' }, [
                      React.createElement(Chip, { 
                        key: 'economic-event-2-impact-chip',
                        label: 'High',
                        size: 'small',
                        color: 'error'
                      })
                    ])
                  ]),
                  // Event 3
                  React.createElement(TableRow, { key: 'economic-event-3' }, [
                    React.createElement(TableCell, { key: 'economic-event-3-time' }, '14:30'),
                    React.createElement(TableCell, { key: 'economic-event-3-country' }, 'GBP'),
                    React.createElement(TableCell, { key: 'economic-event-3-event' }, 'Manufacturing PMI'),
                    React.createElement(TableCell, { key: 'economic-event-3-impact', align: 'right' }, [
                      React.createElement(Chip, { 
                        key: 'economic-event-3-impact-chip',
                        label: 'Medium',
                        size: 'small',
                        color: 'warning'
                      })
                    ])
                  ])
                ])
              ])
            ])
          ])
        ])
      ])
    ]);
  };
  
  // Render Performance tab
  const renderPerformanceTab = () => {
    return React.createElement(Box, { key: 'performance-content' }, [
      // Title
      React.createElement(Typography, { 
        key: 'performance-title', 
        variant: 'h5', 
        gutterBottom: true,
        sx: { mb: 3 }
      }, 'Performance Analytics'),
      
      // Performance cards
      React.createElement(Grid, { key: 'performance-grid', container: true, spacing: 3 }, [
        // Performance Summary card
        React.createElement(Grid, { key: 'performance-summary-grid', item: true, xs: 12, md: 6 }, [
          React.createElement(Card, { key: 'performance-summary-card' }, [
            React.createElement(CardContent, { key: 'performance-summary-content' }, [
              React.createElement(Typography, { key: 'performance-summary-title', variant: 'h6', gutterBottom: true }, 'Performance Summary'),
              React.createElement(Grid, { key: 'performance-metrics-grid', container: true, spacing: 2 }, [
                // Total Return
                React.createElement(Grid, { key: 'total-return-grid', item: true, xs: 6, sm: 3 }, [
                  React.createElement(Typography, { key: 'total-return-label', variant: 'caption', color: 'text.secondary' }, 
                    'Total Return'
                  ),
                  React.createElement(Typography, { 
                    key: 'total-return-value', 
                    variant: 'h6',
                    color: 'success.main'
                  }, 
                    '+18.42%'
                  )
                ]),
                
                // Win Rate
                React.createElement(Grid, { key: 'win-rate-grid', item: true, xs: 6, sm: 3 }, [
                  React.createElement(Typography, { key: 'win-rate-label', variant: 'caption', color: 'text.secondary' }, 
                    'Win Rate'
                  ),
                  React.createElement(Typography, { 
                    key: 'win-rate-value', 
                    variant: 'h6'
                  }, 
                    '68.5%'
                  )
                ]),
                
                // Sharpe Ratio
                React.createElement(Grid, { key: 'sharpe-ratio-grid', item: true, xs: 6, sm: 3 }, [
                  React.createElement(Typography, { key: 'sharpe-ratio-label', variant: 'caption', color: 'text.secondary' }, 
                    'Sharpe Ratio'
                  ),
                  React.createElement(Typography, { 
                    key: 'sharpe-ratio-value', 
                    variant: 'h6'
                  }, 
                    '1.82'
                  )
                ]),
                
                // Max Drawdown
                React.createElement(Grid, { key: 'max-drawdown-grid', item: true, xs: 6, sm: 3 }, [
                  React.createElement(Typography, { key: 'max-drawdown-label', variant: 'caption', color: 'text.secondary' }, 
                    'Max Drawdown'
                  ),
                  React.createElement(Typography, { 
                    key: 'max-drawdown-value', 
                    variant: 'h6',
                    color: 'error.main'
                  }, 
                    '-8.74%'
                  )
                ])
              ])
            ])
          ])
        ]),
        
        // Recent Trades card
        React.createElement(Grid, { key: 'recent-trades-grid', item: true, xs: 12, md: 6 }, [
          React.createElement(Card, { key: 'recent-trades-card' }, [
            React.createElement(CardContent, { key: 'recent-trades-content' }, [
              React.createElement(Typography, { key: 'recent-trades-title', variant: 'h6', gutterBottom: true }, 'Recent Trades'),
              React.createElement(Table, { key: 'recent-trades-table', size: 'small' }, [
                React.createElement(TableHead, { key: 'recent-trades-table-head' }, [
                  React.createElement(TableRow, { key: 'recent-trades-table-head-row' }, [
                    React.createElement(TableCell, { key: 'recent-trades-date-header' }, 'Date'),
                    React.createElement(TableCell, { key: 'recent-trades-symbol-header' }, 'Symbol'),
                    React.createElement(TableCell, { key: 'recent-trades-type-header' }, 'Type'),
                    React.createElement(TableCell, { key: 'recent-trades-result-header', align: 'right' }, 'Result')
                  ])
                ]),
                React.createElement(TableBody, { key: 'recent-trades-table-body' }, [
                  // Trade 1
                  React.createElement(TableRow, { key: 'recent-trade-1' }, [
                    React.createElement(TableCell, { key: 'recent-trade-1-date' }, '2024-05-22'),
                    React.createElement(TableCell, { key: 'recent-trade-1-symbol' }, 'EUR/USD'),
                    React.createElement(TableCell, { key: 'recent-trade-1-type' }, 'BUY'),
                    React.createElement(TableCell, { 
                      key: 'recent-trade-1-result', 
                      align: 'right',
                      sx: { color: 'success.main' }
                    }, '+1.24%')
                  ]),
                  // Trade 2
                  React.createElement(TableRow, { key: 'recent-trade-2' }, [
                    React.createElement(TableCell, { key: 'recent-trade-2-date' }, '2024-05-21'),
                    React.createElement(TableCell, { key: 'recent-trade-2-symbol' }, 'GBP/USD'),
                    React.createElement(TableCell, { key: 'recent-trade-2-type' }, 'SELL'),
                    React.createElement(TableCell, { 
                      key: 'recent-trade-2-result', 
                      align: 'right',
                      sx: { color: 'error.main' }
                    }, '-0.87%')
                  ]),
                  // Trade 3
                  React.createElement(TableRow, { key: 'recent-trade-3' }, [
                    React.createElement(TableCell, { key: 'recent-trade-3-date' }, '2024-05-20'),
                    React.createElement(TableCell, { key: 'recent-trade-3-symbol' }, 'USD/JPY'),
                    React.createElement(TableCell, { key: 'recent-trade-3-type' }, 'BUY'),
                    React.createElement(TableCell, { 
                      key: 'recent-trade-3-result', 
                      align: 'right',
                      sx: { color: 'success.main' }
                    }, '+2.15%')
                  ])
                ])
              ])
            ])
          ])
        ])
      ])
    ]);
  };
  
  // Render algorithm list
  const renderAlgorithmList = () => {
    return React.createElement(Box, { key: 'algorithm-list' }, [
      // Header with add button
      React.createElement(Box, {
        key: 'algorithm-header',
        sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }
      }, [
        React.createElement(Typography, {
          key: 'algorithm-title',
          variant: 'h5'
        }, 'Trading Algorithms'),
        React.createElement(Button, {
          key: 'add-algorithm-button',
          variant: 'contained',
          color: 'primary',
          startIcon: React.createElement(AddIcon),
          onClick: () => {
            resetForm();
            setIsDialogOpen(true);
          }
        }, 'Add Algorithm')
      ]),
      
      // Algorithm cards
      React.createElement(Grid, { key: 'algorithm-grid', container: true, spacing: 3 },
        advancedTradingStore.algorithms.map(algorithm => 
          React.createElement(Grid, { key: algorithm.id, item: true, xs: 12, sm: 6, md: 4 }, [
            React.createElement(Card, { key: `card-${algorithm.id}` }, [
              React.createElement(CardContent, { key: `content-${algorithm.id}` }, [
                // Header with status chip
                React.createElement(Box, {
                  key: `header-${algorithm.id}`,
                  sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }
                }, [
                  React.createElement(Typography, {
                    key: `name-${algorithm.id}`,
                    variant: 'h6'
                  }, algorithm.name),
                  React.createElement(Chip, {
                    key: `status-${algorithm.id}`,
                    label: algorithm.status,
                    size: 'small',
                    color: getStatusColor(algorithm.status)
                  })
                ]),
                
                // Description
                React.createElement(Typography, {
                  key: `desc-${algorithm.id}`,
                  variant: 'body2',
                  color: 'text.secondary',
                  sx: { mb: 2 }
                }, algorithm.description),
                
                // Type and timeframe
                React.createElement(Box, {
                  key: `meta-${algorithm.id}`,
                  sx: { display: 'flex', justifyContent: 'space-between', mb: 2 }
                }, [
                  React.createElement(Chip, {
                    key: `type-${algorithm.id}`,
                    label: algorithmTypes.find(t => t.value === algorithm.type)?.label || algorithm.type,
                    size: 'small',
                    variant: 'outlined'
                  }),
                  React.createElement(Chip, {
                    key: `timeframe-${algorithm.id}`,
                    label: algorithm.settings.timeframe,
                    size: 'small',
                    variant: 'outlined'
                  })
                ]),
                
                // Performance metrics
                React.createElement(Grid, {
                  key: `metrics-${algorithm.id}`,
                  container: true,
                  spacing: 1,
                  sx: { mb: 2 }
                }, [
                  // Total Returns
                  React.createElement(Grid, { key: `returns-${algorithm.id}`, item: true, xs: 6 }, [
                    React.createElement(Typography, {
                      key: `returns-label-${algorithm.id}`,
                      variant: 'caption',
                      color: 'text.secondary',
                      display: 'block'
                    }, 'Returns'),
                    React.createElement(Typography, {
                      key: `returns-value-${algorithm.id}`,
                      variant: 'body2',
                      color: algorithm.performance.totalReturns >= 0 ? 'success.main' : 'error.main'
                    }, `${algorithm.performance.totalReturns.toFixed(2)}%`)
                  ]),
                  
                  // Sharpe Ratio
                  React.createElement(Grid, { key: `sharpe-${algorithm.id}`, item: true, xs: 6 }, [
                    React.createElement(Typography, {
                      key: `sharpe-label-${algorithm.id}`,
                      variant: 'caption',
                      color: 'text.secondary',
                      display: 'block'
                    }, 'Sharpe'),
                    React.createElement(Typography, {
                      key: `sharpe-value-${algorithm.id}`,
                      variant: 'body2'
                    }, algorithm.performance.sharpeRatio.toFixed(2))
                  ]),
                  
                  // Max Drawdown
                  React.createElement(Grid, { key: `drawdown-${algorithm.id}`, item: true, xs: 6 }, [
                    React.createElement(Typography, {
                      key: `drawdown-label-${algorithm.id}`,
                      variant: 'caption',
                      color: 'text.secondary',
                      display: 'block'
                    }, 'Drawdown'),
                    React.createElement(Typography, {
                      key: `drawdown-value-${algorithm.id}`,
                      variant: 'body2',
                      color: 'error.main'
                    }, `${algorithm.performance.maxDrawdown.toFixed(2)}%`)
                  ]),
                  
                  // Win Rate
                  React.createElement(Grid, { key: `winrate-${algorithm.id}`, item: true, xs: 6 }, [
                    React.createElement(Typography, {
                      key: `winrate-label-${algorithm.id}`,
                      variant: 'caption',
                      color: 'text.secondary',
                      display: 'block'
                    }, 'Win Rate'),
                    React.createElement(Typography, {
                      key: `winrate-value-${algorithm.id}`,
                      variant: 'body2'
                    }, `${algorithm.performance.winRate.toFixed(2)}%`)
                  ])
                ]),
                
                // Action buttons
                React.createElement(Box, {
                  key: `actions-${algorithm.id}`,
                  sx: { display: 'flex', justifyContent: 'space-between' }
                }, [
                  // Start/Stop button
                  React.createElement(Button, {
                    key: `toggle-${algorithm.id}`,
                    variant: 'contained',
                    color: algorithm.status === 'active' ? 'error' : 'success',
                    size: 'small',
                    startIcon: React.createElement(algorithm.status === 'active' ? StopIcon : StartIcon),
                    onClick: () => handleStartStop(algorithm.id)
                  }, algorithm.status === 'active' ? 'Stop' : 'Start'),
                  
                  // Edit button
                  React.createElement(Button, {
                    key: `edit-${algorithm.id}`,
                    variant: 'outlined',
                    color: 'primary',
                    size: 'small',
                    startIcon: React.createElement(EditIcon),
                    onClick: () => {
                      setSelectedAlgorithm(algorithm);
                      setNewAlgorithm(algorithm);
                      setIsDialogOpen(true);
                    }
                  }, 'Edit'),
                  
                  // Backtest button
                  React.createElement(Button, {
                    key: `backtest-${algorithm.id}`,
                    variant: 'outlined',
                    color: 'secondary',
                    size: 'small',
                    startIcon: React.createElement(BacktestIcon),
                    onClick: () => {
                      setSelectedAlgorithm(algorithm);
                      setIsBacktestDialogOpen(true);
                    }
                  }, 'Backtest'),
                  
                  // Optimize button
                  React.createElement(Button, {
                    key: `optimize-${algorithm.id}`,
                    variant: 'outlined',
                    color: 'info',
                    size: 'small',
                    startIcon: React.createElement(OptimizeIcon),
                    onClick: () => {
                      setSelectedAlgorithm(algorithm);
                      setIsOptimizationDialogOpen(true);
                    }
                  }, 'Optimize'),
                  
                  // Delete button
                  React.createElement(IconButton, {
                    key: `delete-${algorithm.id}`,
                    color: 'error',
                    size: 'small',
                    onClick: () => {
                      setSelectedAlgorithm(algorithm);
                      setIsDeleteDialogOpen(true);
                    }
                  }, React.createElement(DeleteIcon))
                ])
              ])
            ])
          ])
        )
      )
    ]);
  };

  // Main render
  return React.createElement(
    'div',
    { 
      style: {
        height: 'calc(100vh - 72px)',
        overflow: 'hidden',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }
    },
    React.createElement(
      Container, 
      {
        maxWidth: 'xl',
        sx: { 
          py: 2,
          px: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }
      },
      [
    // Tabs
    React.createElement(Paper, {
      key: 'tabs-paper',
      sx: { mb: 2, boxShadow: 'none', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }
    }, [
      React.createElement(Tabs, {
        key: 'tabs',
        value: selectedTab,
        onChange: handleTabChange,
        indicatorColor: 'primary',
        textColor: 'primary'
      }, [
        React.createElement(Tab, { key: 'algorithms-tab', label: 'Algorithms' }),
        React.createElement(Tab, { key: 'market-tab', label: 'Market Data' }),
        React.createElement(Tab, { key: 'performance-tab', label: 'Performance' })
      ])
    ]),
    
        // Tab content
        React.createElement(Box, {
          key: 'tab-content',
          sx: { 
            flex: 1,
            overflow: 'auto',
            height: 'calc(100% - 48px)' // Account for tab height
          }
        }, [
          selectedTab === 0 ? renderAlgorithmList() : 
          selectedTab === 1 ? renderMarketDataTab() :
          renderPerformanceTab()
        ]),
        
        // Dialogs
        React.createElement('div', { key: 'dialogs' }, [
          createAlgorithmDialog(),
          createDeleteDialog(),
          createBacktestDialog(),
          createBacktestResultDialog(),
          createOptimizationDialog(),
          createOptimizationResultDialog()
        ])
      ]
    )
  );
});

export default AdvancedTradingPage;
