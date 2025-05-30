// advancedTradingPageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
// observer is imported below
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
  Tab,
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
// observer is imported below
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

// Main component
const AdvancedTradingPage = observer(() => {
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
        React.createElement(Grid, { container: true, spacing: { xs: 2, sm: 3 }, key: 'algo-grid' }, [
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

  // Create backtest dialog
  const createBacktestDialog = () => {
    return React.createElement(Dialog, {
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

  // Create backtest result dialog
  const createBacktestResultDialog = () => {
    if (!selectedBacktestResult) return null;
    
    return React.createElement(Dialog, {
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

  // Create optimization dialog
  const createOptimizationDialog = () => {
    return React.createElement(Dialog, {
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
          'Define parameter ranges to find the optimal settings for your algorithm.'
        ),
        
        React.createElement(Grid, { key: 'optimization-form-grid', container: true, spacing: 3 }, [
          // Stop Loss parameter
          React.createElement(Grid, { key: 'stop-loss-param', item: true, xs: 12 }, [
            React.createElement(Typography, { key: 'stop-loss-title', variant: 'subtitle2', gutterBottom: true }, 'Stop Loss'),
            React.createElement(Grid, { key: 'stop-loss-fields', container: true, spacing: 2 }, [
              // Start
              React.createElement(Grid, { key: 'stop-loss-start', item: true, xs: 4 }, [
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
              
              // End
              React.createElement(Grid, { key: 'stop-loss-end', item: true, xs: 4 }, [
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
              
              // Step
              React.createElement(Grid, { key: 'stop-loss-step', item: true, xs: 4 }, [
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
              ])
            ])
          ]),
          
          // Take Profit parameter
          React.createElement(Grid, { key: 'take-profit-param', item: true, xs: 12 }, [
            React.createElement(Typography, { key: 'take-profit-title', variant: 'subtitle2', gutterBottom: true }, 'Take Profit'),
            React.createElement(Grid, { key: 'take-profit-fields', container: true, spacing: 2 }, [
              // Start
              React.createElement(Grid, { key: 'take-profit-start', item: true, xs: 4 }, [
                React.createElement(TextField, {
                  key: 'take-profit-start-input',
                  label: 'Start',
                  type: 'number',
                  value: optimizationParams.takeProfit.start,
                  onChange: (e) => handleOptimizationParamsChange('takeProfit', 'start', Number(e.target.value)),
                  fullWidth: true,
                  variant: 'outlined',
                  inputProps: { step: 0.1, min: 0.1 }
                })
              ]),
              
              // End
              React.createElement(Grid, { key: 'take-profit-end', item: true, xs: 4 }, [
                React.createElement(TextField, {
                  key: 'take-profit-end-input',
                  label: 'End',
                  type: 'number',
                  value: optimizationParams.takeProfit.end,
                  onChange: (e) => handleOptimizationParamsChange('takeProfit', 'end', Number(e.target.value)),
                  fullWidth: true,
                  variant: 'outlined',
                  inputProps: { step: 0.1, min: 0.1 }
                })
              ]),
              
              // Step
              React.createElement(Grid, { key: 'take-profit-step', item: true, xs: 4 }, [
                React.createElement(TextField, {
                  key: 'take-profit-step-input',
                  label: 'Step',
                  type: 'number',
                  value: optimizationParams.takeProfit.step,
                  onChange: (e) => handleOptimizationParamsChange('takeProfit', 'step', Number(e.target.value)),
                  fullWidth: true,
                  variant: 'outlined',
                  inputProps: { step: 0.1, min: 0.1 }
                })
              ])
            ])
          ]),
          
          // Fast MA parameter
          React.createElement(Grid, { key: 'fast-ma-param', item: true, xs: 12 }, [
            React.createElement(Typography, { key: 'fast-ma-title', variant: 'subtitle2', gutterBottom: true }, 'Fast MA Period'),
            React.createElement(Grid, { key: 'fast-ma-fields', container: true, spacing: 2 }, [
              // Start
              React.createElement(Grid, { key: 'fast-ma-start', item: true, xs: 4 }, [
                React.createElement(TextField, {
                  key: 'fast-ma-start-input',
                  label: 'Start',
                  type: 'number',
                  value: optimizationParams.fastMA.start,
                  onChange: (e) => handleOptimizationParamsChange('fastMA', 'start', Number(e.target.value)),
                  fullWidth: true,
                  variant: 'outlined',
                  inputProps: { step: 1, min: 1 }
                })
              ]),
              
              // End
              React.createElement(Grid, { key: 'fast-ma-end', item: true, xs: 4 }, [
                React.createElement(TextField, {
                  key: 'fast-ma-end-input',
                  label: 'End',
                  type: 'number',
                  value: optimizationParams.fastMA.end,
                  onChange: (e) => handleOptimizationParamsChange('fastMA', 'end', Number(e.target.value)),
                  fullWidth: true,
                  variant: 'outlined',
                  inputProps: { step: 1, min: 1 }
                })
              ]),
              
              // Step
              React.createElement(Grid, { key: 'fast-ma-step', item: true, xs: 4 }, [
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
              ])
            ])
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
        // Best Parameters
        React.createElement(Box, { key: 'optimization-best-params', sx: { mb: 3 } }, [
          React.createElement(Typography, { key: 'optimization-best-params-title', variant: 'h6', gutterBottom: true }, 
            'Best Parameters'
          ),
          React.createElement(Grid, { key: 'optimization-best-params-grid', container: true, spacing: 2 }, [
            // Stop Loss
            React.createElement(Grid, { key: 'optimization-stop-loss', item: true, xs: 6, sm: 3 }, [
              React.createElement(Typography, { key: 'optimization-stop-loss-label', variant: 'caption', color: 'text.secondary' }, 
                'Stop Loss'
              ),
              React.createElement(Typography, { key: 'optimization-stop-loss-value', variant: 'body2' }, 
                selectedOptimizationResult.bestParams.stopLoss.toFixed(2)
              )
            ]),
            
            // Take Profit
            React.createElement(Grid, { key: 'optimization-take-profit', item: true, xs: 6, sm: 3 }, [
              React.createElement(Typography, { key: 'optimization-take-profit-label', variant: 'caption', color: 'text.secondary' }, 
                'Take Profit'
              ),
              React.createElement(Typography, { key: 'optimization-take-profit-value', variant: 'body2' }, 
                selectedOptimizationResult.bestParams.takeProfit.toFixed(2)
              )
            ]),
            
            // Fast MA
            React.createElement(Grid, { key: 'optimization-fast-ma', item: true, xs: 6, sm: 3 }, [
              React.createElement(Typography, { key: 'optimization-fast-ma-label', variant: 'caption', color: 'text.secondary' }, 
                'Fast MA Period'
              ),
              React.createElement(Typography, { key: 'optimization-fast-ma-value', variant: 'body2' }, 
                selectedOptimizationResult.bestParams.fastMA
              )
            ]),
            
            // Slow MA
            React.createElement(Grid, { key: 'optimization-slow-ma', item: true, xs: 6, sm: 3 }, [
              React.createElement(Typography, { key: 'optimization-slow-ma-label', variant: 'caption', color: 'text.secondary' }, 
                'Slow MA Period'
              ),
              React.createElement(Typography, { key: 'optimization-slow-ma-value', variant: 'body2' }, 
                selectedOptimizationResult.bestParams.slowMA
              )
            ])
          ])
        ]),
        
        // Performance
        React.createElement(Box, { key: 'optimization-performance', sx: { mb: 3 } }, [
          React.createElement(Typography, { key: 'optimization-performance-title', variant: 'h6', gutterBottom: true }, 
            'Performance with Optimized Parameters'
          ),
          React.createElement(Grid, { key: 'optimization-performance-grid', container: true, spacing: 2 }, [
            // Total Return
            React.createElement(Grid, { key: 'optimization-total-return', item: true, xs: 6, sm: 4, md: 2 }, [
              React.createElement(Typography, { key: 'optimization-total-return-label', variant: 'caption', color: 'text.secondary' }, 
                'Total Return'
              ),
              React.createElement(Typography, { 
                key: 'optimization-total-return-value', 
                variant: 'body2',
                color: selectedOptimizationResult.performance.totalReturn >= 0 ? 'success.main' : 'error.main'
              }, 
                `${selectedOptimizationResult.performance.totalReturn.toFixed(2)}%`
              )
            ]),
            
            // Sharpe Ratio
            React.createElement(Grid, { key: 'optimization-sharpe', item: true, xs: 6, sm: 4, md: 2 }, [
              React.createElement(Typography, { key: 'optimization-sharpe-label', variant: 'caption', color: 'text.secondary' }, 
                'Sharpe Ratio'
              ),
              React.createElement(Typography, { key: 'optimization-sharpe-value', variant: 'body2' }, 
                selectedOptimizationResult.performance.sharpeRatio.toFixed(2)
              )
            ]),
            
            // Win Rate
            React.createElement(Grid, { key: 'optimization-winrate', item: true, xs: 6, sm: 4, md: 2 }, [
              React.createElement(Typography, { key: 'optimization-winrate-label', variant: 'caption', color: 'text.secondary' }, 
                'Win Rate'
              ),
              React.createElement(Typography, { key: 'optimization-winrate-value', variant: 'body2' }, 
                `${selectedOptimizationResult.performance.winRate.toFixed(2)}%`
              )
            ])
          ])
        ]),
        
        // Iterations
        React.createElement(Box, { key: 'optimization-iterations', sx: { mb: 3 } }, [
          React.createElement(Typography, { key: 'optimization-iterations-title', variant: 'h6', gutterBottom: true }, 
            'Optimization Details'
          ),
          React.createElement(Grid, { key: 'optimization-iterations-grid', container: true, spacing: 2 }, [
            // Total Iterations
            React.createElement(Grid, { key: 'optimization-total-iterations', item: true, xs: 6, sm: 4 }, [
              React.createElement(Typography, { key: 'optimization-total-iterations-label', variant: 'caption', color: 'text.secondary' }, 
                'Total Iterations'
              ),
              React.createElement(Typography, { key: 'optimization-total-iterations-value', variant: 'body2' }, 
                selectedOptimizationResult.totalIterations
              )
            ]),
            
            // Duration
            React.createElement(Grid, { key: 'optimization-duration', item: true, xs: 6, sm: 4 }, [
              React.createElement(Typography, { key: 'optimization-duration-label', variant: 'caption', color: 'text.secondary' }, 
                'Duration'
              ),
              React.createElement(Typography, { key: 'optimization-duration-value', variant: 'body2' }, 
                `${selectedOptimizationResult.duration} seconds`
              )
            ])
          ])
        ])
      ]),
      
      // Dialog actions
      React.createElement(DialogActions, { key: 'optimization-result-dialog-actions' }, [
        React.createElement(Button, {
          key: 'close-optimization-result-button',
          onClick: () => setIsOptimizationResultDialogOpen(false)
        }, 'Close'),
        React.createElement(Button, {
          key: 'apply-optimized-params-button',
          onClick: () => {
            // Apply optimized parameters to the algorithm
            if (selectedAlgorithm && selectedOptimizationResult) {
              const updatedAlgorithm = {
                ...selectedAlgorithm,
                parameters: {
                  ...selectedAlgorithm.parameters,
                  stopLoss: selectedOptimizationResult.bestParams.stopLoss,
                  takeProfit: selectedOptimizationResult.bestParams.takeProfit,
                  fastMA: selectedOptimizationResult.bestParams.fastMA,
                  slowMA: selectedOptimizationResult.bestParams.slowMA
                }
              };
              advancedTradingStore.updateAlgorithm(selectedAlgorithm.id, updatedAlgorithm);
              setIsOptimizationResultDialogOpen(false);
            }
          },
          variant: 'contained',
          color: 'primary'
        }, 'Apply Optimized Parameters')
      ])
    ]);
  };

  // Create delete confirmation dialog
  const createDeleteDialog = () => {
    return React.createElement(Dialog, {
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

  // Render list of trading algorithms
  const renderAlgorithmList = () => {
    return React.createElement(Box, { key: 'algorithm-list' }, [
      // Add button
      React.createElement(Box, {
        key: 'add-algo-box',
        sx: { mb: { xs: 2, sm: 3 }, display: 'flex', justifyContent: 'flex-end' }
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
          },
          sx: { ml: 2 }
        }, 'Add Algorithm')
      ]),
      
      // Algorithm cards
      React.createElement(Grid, { key: 'algorithm-grid', container: true, spacing: 3 },
        advancedTradingStore.algorithms.map(algorithm => (
          React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 4, key: algorithm.id }, [
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
                
                // Action buttons
                React.createElement(Box, {
                  key: `actions-${algorithm.id}`,
                  sx: { 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: { xs: 1, sm: 0.5 },
                    justifyContent: 'space-between',
                    mt: { xs: 1, sm: 0 }
                  }
                }, [
                  // Start/Stop button
                  React.createElement(Button, {
                    key: `toggle-${algorithm.id}`,
                    variant: 'contained',
                    color: algorithm.status === 'active' ? 'error' : 'success',
                    size: 'small',
                    sx: { width: { xs: '100%', sm: 'auto' } },
                    startIcon: React.createElement(algorithm.status === 'active' ? StopIcon : StartIcon),
                    onClick: () => handleStartStop(algorithm.id)
                  }, algorithm.status === 'active' ? 'Stop' : 'Start'),
                  
                  // Edit button
                  React.createElement(Button, {
                    key: `edit-${algorithm.id}`,
                    variant: 'outlined',
                    color: 'primary',
                    size: 'small',
                    sx: { width: { xs: '100%', sm: 'auto' } },
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
                    sx: { width: { xs: '100%', sm: 'auto' } },
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
                    sx: { width: { xs: '100%', sm: 'auto' } },
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
  },

  // Main render
  return React.createElement(Container, {
    maxWidth: 'xl',
    sx: { py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2, md: 3 } }
  }, [
    // Tabs
    React.createElement(Paper, {
      key: 'tabs-paper',
      sx: { mb: { xs: 2, sm: 3 } }
    }, [
      React.createElement(Tabs, {
        key: 'tabs',
        value: selectedTab,
        onChange: handleTabChange,
        indicatorColor: 'primary',
        textColor: 'primary',
        variant: window.innerWidth < 600 ? 'fullWidth' : 'standard',
        sx: { minHeight: { xs: '40px', sm: '48px' } }
      }, [
        React.createElement(Tab, { key: 'algorithms-tab', label: 'Algorithms', sx: { minHeight: { xs: '40px', sm: '48px' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } } }),
        React.createElement(Tab, { key: 'market-tab', label: 'Market Data', sx: { minHeight: { xs: '40px', sm: '48px' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } } }),
        React.createElement(Tab, { key: 'performance-tab', label: 'Performance', sx: { minHeight: { xs: '40px', sm: '48px' }, fontSize: { xs: '0.8rem', sm: '0.875rem' } } })
      ])
    ]),
    
    // Tab content
    selectedTab === 0 ? renderAlgorithmList() : 
    selectedTab === 1 ? React.createElement(Typography, { key: 'market-data-placeholder' }, 'Market Data (Coming Soon)') :
    React.createElement(Typography, { key: 'performance-placeholder' }, 'Performance Analytics (Coming Soon)'),
    
    // Dialogs
    createAlgorithmDialog(),
    createDeleteDialog(),
    createBacktestDialog(),
    createBacktestResultDialog(),
    createOptimizationDialog(),
    createOptimizationResultDialog()
  ]);
});

export default AdvancedTradingPage;
