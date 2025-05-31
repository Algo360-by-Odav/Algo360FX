// strategiesPageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  IconButton,
  Tooltip,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  LinearProgress,
  Alert,
  Autocomplete
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  TrendingUp as ProfitIcon,
  TrendingDown as LossIcon,
  Timeline as BacktestIcon,
  Assessment as PerformanceIcon,
  Settings as SettingsIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { strategyService } from '../services/strategyService';
import { Line } from 'react-chartjs-2';

// Default form data
const defaultStrategyFormData = {
  name: '',
  description: '',
  type: 'TREND_FOLLOWING',
  symbols: [],
  parameters: {
    timeframe: '1h',
    riskPerTrade: 1,
    maxDrawdown: 10,
    takeProfitPips: 50,
    stopLossPips: 30,
    trailingStop: false,
    indicators: []
  }
};

// Main component
const StrategiesPage = () => {
  const theme = useTheme();
  const { showNotification } = useApp();
  const [loading, setLoading] = useState(true);
  const [strategies, setStrategies] = useState([]);
  const [summary, setSummary] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formData, setFormData] = useState(defaultStrategyFormData);
  const [tabValue, setTabValue] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    performance: 'all',
    symbol: 'all'
  });

  const [availableSymbols] = useState(['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'NZDUSD', 'USDCHF']);
  const [strategyTypes] = useState(['TREND_FOLLOWING', 'MEAN_REVERSION', 'BREAKOUT', 'SCALPING', 'GRID', 'MARTINGALE']);
  const [timeframes] = useState(['1m', '5m', '15m', '30m', '1h', '4h', '1d', '1w']);
  const [availableIndicators] = useState([
    { name: 'Moving Average', parameters: { period: 20, type: 'simple' } },
    { name: 'RSI', parameters: { period: 14, overbought: 70, oversold: 30 } },
    { name: 'MACD', parameters: { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 } },
    { name: 'Bollinger Bands', parameters: { period: 20, deviations: 2 } }
  ]);

  // Load strategies data on component mount
  useEffect(() => {
    fetchStrategiesData();
  }, []);
  
  // Load performance metrics when tab changes to performance metrics
  useEffect(() => {
    if (tabValue === 1 && !performanceMetrics) {
      // Simulate loading performance metrics
      setLoading(true);
      setTimeout(() => {
        setPerformanceMetrics({
          winRate: 62.5,
          profitFactor: 1.85,
          sharpeRatio: 1.2,
          maxDrawdown: 12.3,
          totalTrades: 248,
          averageWinSize: 125.75,
          averageLossSize: 68.42,
          consecutiveWins: 8,
          consecutiveLosses: 3
        });
        setLoading(false);
      }, 1000);
    }
  }, [tabValue, performanceMetrics]);

  // Fetch strategies data
  const fetchStrategiesData = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      // const strategies = await strategyService.getStrategies();
      
      // For demo purposes, we'll use mock data
      setTimeout(() => {
        const mockStrategies = [
          {
            id: '1',
            name: 'MA Crossover Strategy',
            description: 'Simple moving average crossover strategy',
            type: 'TREND_FOLLOWING',
            symbols: ['EURUSD', 'GBPUSD'],
            status: 'active',
            performance: {
              pnl: 1250.75,
              winRate: 65.2,
              trades: 125
            },
            parameters: {
              timeframe: '1h',
              riskPerTrade: 1,
              maxDrawdown: 10,
              takeProfitPips: 50,
              stopLossPips: 30,
              trailingStop: true
            },
            createdAt: '2025-01-15T10:30:00Z',
            updatedAt: '2025-05-20T14:22:00Z'
          },
          {
            id: '2',
            name: 'RSI Reversal',
            description: 'RSI-based mean reversion strategy',
            type: 'MEAN_REVERSION',
            symbols: ['USDJPY', 'AUDUSD'],
            status: 'inactive',
            performance: {
              pnl: -320.50,
              winRate: 48.5,
              trades: 72
            },
            parameters: {
              timeframe: '15m',
              riskPerTrade: 0.5,
              maxDrawdown: 15,
              takeProfitPips: 30,
              stopLossPips: 25,
              trailingStop: false
            },
            createdAt: '2025-02-10T09:15:00Z',
            updatedAt: '2025-05-18T11:45:00Z'
          },
          {
            id: '3',
            name: 'Breakout Trader',
            description: 'Volatility breakout strategy',
            type: 'BREAKOUT',
            symbols: ['EURUSD', 'GBPUSD', 'USDJPY'],
            status: 'active',
            performance: {
              pnl: 875.25,
              winRate: 52.8,
              trades: 98
            },
            parameters: {
              timeframe: '4h',
              riskPerTrade: 1.5,
              maxDrawdown: 12,
              takeProfitPips: 80,
              stopLossPips: 40,
              trailingStop: true
            },
            createdAt: '2025-03-05T14:20:00Z',
            updatedAt: '2025-05-19T16:30:00Z'
          }
        ];
        
        setStrategies(mockStrategies);
        
        // Set summary data
        setSummary({
          totalStrategies: mockStrategies.length,
          activeStrategies: mockStrategies.filter(s => s.status === 'active').length,
          totalPnl: mockStrategies.reduce((sum, s) => sum + s.performance.pnl, 0),
          averageWinRate: parseFloat((mockStrategies.reduce((sum, s) => sum + s.performance.winRate, 0) / mockStrategies.length).toFixed(1)),
          bestPerforming: 'MA Crossover Strategy',
          worstPerforming: 'RSI Reversal',
          dailyPnL: 125.50,
          monthlyPnL: 1805.50
        });
        
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error fetching strategies:', err);
      showNotification('Failed to fetch strategies', 'error');
    }
  };

  // Format helpers
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  // Filter strategies
  const getFilteredStrategies = () => {
    return strategies.filter(strategy => {
      if (filters.status !== 'all' && strategy.status !== filters.status) return false;
      if (filters.type !== 'all' && strategy.type !== filters.type) return false;
      if (filters.performance !== 'all') {
        const isProfitable = strategy.performance.pnl > 0;
        if (filters.performance === 'profitable' && !isProfitable) return false;
        if (filters.performance === 'losing' && isProfitable) return false;
      }
      if (filters.symbol !== 'all' && !strategy.symbols.includes(filters.symbol)) return false;
      return true;
    });
  };

  // Handle form submission (create/update strategy)
  const handleSubmitStrategy = () => {
    if (!formData.name) {
      showNotification('Strategy name is required', 'error');
      return;
    }
    
    setLoading(true);
    
    // Create a copy of the current strategies
    const updatedStrategies = [...strategies];
    
    if (selectedStrategy) {
      // Update existing strategy
      const index = updatedStrategies.findIndex(s => s.id === selectedStrategy.id);
      if (index !== -1) {
        updatedStrategies[index] = {
          ...selectedStrategy,
          ...formData,
          updatedAt: new Date().toISOString()
        };
      }
    } else {
      // Create new strategy
      const newStrategy = {
        id: Date.now().toString(),
        ...formData,
        status: 'inactive',
        performance: {
          pnl: 0,
          winRate: 0,
          trades: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updatedStrategies.push(newStrategy);
    }
    
    // Update state
    setTimeout(() => {
      setStrategies(updatedStrategies);
      setSummary(prev => ({
        ...prev,
        totalStrategies: updatedStrategies.length,
        activeStrategies: updatedStrategies.filter(s => s.status === 'active').length
      }));
      setFormDialogOpen(false);
      setSelectedStrategy(null);
      setFormData(defaultStrategyFormData);
      setLoading(false);
      
      showNotification(
        selectedStrategy ? 'Strategy updated successfully' : 'Strategy created successfully',
        'success'
      );
    }, 500);
  };
  
  // Handle strategy deletion
  const handleDeleteStrategy = (strategyId) => {
    if (window.confirm('Are you sure you want to delete this strategy?')) {
      setLoading(true);
      
      // In a real app, this would be an API call
      // await strategyService.deleteStrategy(strategyId);
      
      setTimeout(() => {
        const updatedStrategies = strategies.filter(s => s.id !== strategyId);
        setStrategies(updatedStrategies);
        setSummary(prev => ({
          ...prev,
          totalStrategies: updatedStrategies.length,
          activeStrategies: updatedStrategies.filter(s => s.status === 'active').length
        }));
        setLoading(false);
        showNotification('Strategy deleted successfully', 'success');
      }, 500);
    }
  };
  
  // Handle toggling strategy status (active/inactive)
  const handleToggleStrategy = (strategy) => {
    setLoading(true);
    
    // In a real app, this would be an API call
    // await strategyService.updateStrategy(strategy.id, { status: strategy.status === 'active' ? 'inactive' : 'active' });
    
    setTimeout(() => {
      const updatedStrategies = strategies.map(s => {
        if (s.id === strategy.id) {
          return {
            ...s,
            status: s.status === 'active' ? 'inactive' : 'active',
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      });
      
      setStrategies(updatedStrategies);
      setSummary(prev => ({
        ...prev,
        activeStrategies: updatedStrategies.filter(s => s.status === 'active').length
      }));
      setLoading(false);
      showNotification(
        `Strategy ${strategy.status === 'active' ? 'stopped' : 'started'} successfully`,
        'success'
      );
    }, 500);
  };
  
  // Handle backtesting a strategy
  const handleBacktest = (strategyId) => {
    setLoading(true);
    
    // In a real app, this would be an API call to run a backtest
    // const backtestResults = await strategyService.backtest(strategyId);
    
    setTimeout(() => {
      setLoading(false);
      showNotification('Backtest completed successfully', 'success');
      
      // In a real app, you would display the backtest results
      // For now, we'll just switch to the performance tab
      setTabValue(1);
    }, 1500);
  };
  
  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Handle form input changes
  const handleFormChange = (field, value) => {
    setFormData(prev => {
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value
          }
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  };
  
  // Handle edit strategy
  const handleEditStrategy = (strategy) => {
    setSelectedStrategy(strategy);
    setFormData({
      name: strategy.name,
      description: strategy.description,
      type: strategy.type,
      symbols: strategy.symbols,
      parameters: { ...strategy.parameters }
    });
    setFormDialogOpen(true);
  };
  
  // Render summary cards
  const renderSummaryCards = () => {
    if (!summary) return null;
    
    return React.createElement(Grid, { container: true, spacing: 3 },
      React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 3 },
        React.createElement(Card, null,
          React.createElement(CardContent, null,
            React.createElement(Typography, { color: 'textSecondary', gutterBottom: true }, "Total Strategies"),
            React.createElement(Typography, { variant: 'h4' }, summary.totalStrategies),
            React.createElement(Typography, { color: 'textSecondary', sx: { mt: 1 } }, 
              summary.activeStrategies + " active"
            )
          )
        )
      ),
      React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 3 },
        React.createElement(Card, null,
          React.createElement(CardContent, null,
            React.createElement(Typography, { color: 'textSecondary', gutterBottom: true }, "Total P&L"),
            React.createElement(Typography, { variant: 'h4', color: summary.totalPnl >= 0 ? 'success.main' : 'error.main' }, 
              formatCurrency(summary.totalPnl)
            ),
            React.createElement(Typography, { color: 'textSecondary', sx: { mt: 1 } }, 
              "Avg Win Rate: " + formatPercentage(summary.averageWinRate)
            )
          )
        )
      ),
      React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 3 },
        React.createElement(Card, null,
          React.createElement(CardContent, null,
            React.createElement(Typography, { color: 'textSecondary', gutterBottom: true }, "Daily P&L"),
            React.createElement(Typography, { variant: 'h4', color: summary.dailyPnL >= 0 ? 'success.main' : 'error.main' }, 
              formatCurrency(summary.dailyPnL)
            ),
            React.createElement(Typography, { color: 'textSecondary', sx: { mt: 1 } }, 
              "Best: " + summary.bestPerforming
            )
          )
        )
      ),
      React.createElement(Grid, { item: true, xs: 12, sm: 6, md: 3 },
        React.createElement(Card, null,
          React.createElement(CardContent, null,
            React.createElement(Typography, { color: 'textSecondary', gutterBottom: true }, "Monthly P&L"),
            React.createElement(Typography, { variant: 'h4', color: summary.monthlyPnL >= 0 ? 'success.main' : 'error.main' }, 
              formatCurrency(summary.monthlyPnL)
            ),
            React.createElement(Typography, { color: 'textSecondary', sx: { mt: 1 } }, 
              "Worst: " + summary.worstPerforming
            )
          )
        )
      )
    );
  };
  
  // Render strategies table
  const renderStrategiesTable = () => {
    const filteredStrategies = getFilteredStrategies();
    const paginatedStrategies = filteredStrategies.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    
    return React.createElement(React.Fragment, null,
      React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', mb: 2 } },
        React.createElement(Button, 
          { 
            variant: 'contained', 
            startIcon: React.createElement(AddIcon), 
            onClick: () => {
              setSelectedStrategy(null);
              setFormData(defaultStrategyFormData);
              setFormDialogOpen(true);
            }
          }, 
          "Create Strategy"
        ),
        React.createElement(Box, null,
          React.createElement(Button, 
            { 
              variant: 'outlined', 
              startIcon: React.createElement(FilterIcon), 
              onClick: () => setFilterDialogOpen(true),
              sx: { mr: 1 }
            }, 
            "Filter"
          ),
          React.createElement(Button, 
            { 
              variant: 'outlined', 
              startIcon: React.createElement(RefreshIcon), 
              onClick: fetchStrategiesData 
            }, 
            "Refresh"
          )
        )
      ),
      React.createElement(TableContainer, { component: Paper },
        React.createElement(Table, null,
          React.createElement(TableHead, null,
            React.createElement(TableRow, null,
              React.createElement(TableCell, null, "Name"),
              React.createElement(TableCell, null, "Type"),
              React.createElement(TableCell, null, "Symbols"),
              React.createElement(TableCell, null, "Status"),
              React.createElement(TableCell, null, "P&L"),
              React.createElement(TableCell, null, "Win Rate"),
              React.createElement(TableCell, null, "Trades"),
              React.createElement(TableCell, null, "Last Updated"),
              React.createElement(TableCell, { align: 'right' }, "Actions")
            )
          ),
          React.createElement(TableBody, null,
            paginatedStrategies.length === 0 ?
              React.createElement(TableRow, null,
                React.createElement(TableCell, { colSpan: 9, align: 'center' }, "No strategies found")
              ) :
              paginatedStrategies.map(strategy => {
                return React.createElement(TableRow, { key: strategy.id },
                  React.createElement(TableCell, null, strategy.name),
                  React.createElement(TableCell, null, 
                    React.createElement(Chip, { label: strategy.type, size: 'small' })
                  ),
                  React.createElement(TableCell, null, 
                    strategy.symbols.map(symbol => 
                      React.createElement(Chip, { key: symbol, label: symbol, size: 'small', sx: { mr: 0.5 } })
                    )
                  ),
                  React.createElement(TableCell, null, 
                    React.createElement(Chip, { 
                      label: strategy.status, 
                      color: strategy.status === 'active' ? 'success' : 'default',
                      size: 'small'
                    })
                  ),
                  React.createElement(TableCell, { 
                    sx: { color: strategy.performance.pnl >= 0 ? 'success.main' : 'error.main' } 
                  }, 
                    formatCurrency(strategy.performance.pnl)
                  ),
                  React.createElement(TableCell, null, formatPercentage(strategy.performance.winRate)),
                  React.createElement(TableCell, null, strategy.performance.trades),
                  React.createElement(TableCell, null, new Date(strategy.updatedAt).toLocaleString()),
                  React.createElement(TableCell, { align: 'right' },
                    React.createElement(Tooltip, { title: strategy.status === 'active' ? 'Stop' : 'Start' },
                      React.createElement(IconButton, { 
                        onClick: () => handleToggleStrategy(strategy),
                        color: strategy.status === 'active' ? 'error' : 'success',
                        size: 'small'
                      }, 
                        strategy.status === 'active' ? 
                          React.createElement(StopIcon) : 
                          React.createElement(StartIcon)
                      )
                    ),
                    React.createElement(Tooltip, { title: 'Backtest' },
                      React.createElement(IconButton, { 
                        onClick: () => handleBacktest(strategy.id),
                        color: 'primary',
                        size: 'small'
                      }, 
                        React.createElement(BacktestIcon)
                      )
                    ),
                    React.createElement(Tooltip, { title: 'Edit' },
                      React.createElement(IconButton, { 
                        onClick: () => handleEditStrategy(strategy),
                        size: 'small'
                      }, 
                        React.createElement(EditIcon)
                      )
                    ),
                    React.createElement(Tooltip, { title: 'Delete' },
                      React.createElement(IconButton, { 
                        onClick: () => handleDeleteStrategy(strategy.id),
                        color: 'error',
                        size: 'small'
                      }, 
                        React.createElement(DeleteIcon)
                      )
                    )
                  )
                );
              })
          )
        ),
        React.createElement(TablePagination, {
          rowsPerPageOptions: [5, 10, 25],
          component: 'div',
          count: filteredStrategies.length,
          rowsPerPage: rowsPerPage,
          page: page,
          onPageChange: handleChangePage,
          onRowsPerPageChange: handleChangeRowsPerPage
        })
      )
    );
  };
  
  // Render performance metrics
  const renderPerformanceMetrics = () => {
    if (!performanceMetrics) {
      return React.createElement(Box, { sx: { display: 'flex', justifyContent: 'center', p: 3 } },
        React.createElement(CircularProgress)
      );
    }
    
    return React.createElement(Grid, { container: true, spacing: 3 },
      React.createElement(Grid, { item: true, xs: 12, md: 6 },
        React.createElement(Card, null,
          React.createElement(CardContent, null,
            React.createElement(Typography, { variant: 'h6', gutterBottom: true }, "Key Metrics"),
            React.createElement(Grid, { container: true, spacing: 2 },
              React.createElement(Grid, { item: true, xs: 6 },
                React.createElement(Typography, { color: 'textSecondary' }, "Win Rate"),
                React.createElement(Typography, { variant: 'h6' }, formatPercentage(performanceMetrics.winRate))
              ),
              React.createElement(Grid, { item: true, xs: 6 },
                React.createElement(Typography, { color: 'textSecondary' }, "Profit Factor"),
                React.createElement(Typography, { variant: 'h6' }, performanceMetrics.profitFactor.toFixed(2))
              ),
              React.createElement(Grid, { item: true, xs: 6 },
                React.createElement(Typography, { color: 'textSecondary' }, "Sharpe Ratio"),
                React.createElement(Typography, { variant: 'h6' }, performanceMetrics.sharpeRatio.toFixed(2))
              ),
              React.createElement(Grid, { item: true, xs: 6 },
                React.createElement(Typography, { color: 'textSecondary' }, "Max Drawdown"),
                React.createElement(Typography, { variant: 'h6', color: 'error.main' }, 
                  formatPercentage(performanceMetrics.maxDrawdown)
                )
              ),
              React.createElement(Grid, { item: true, xs: 6 },
                React.createElement(Typography, { color: 'textSecondary' }, "Total Trades"),
                React.createElement(Typography, { variant: 'h6' }, performanceMetrics.totalTrades)
              ),
              React.createElement(Grid, { item: true, xs: 6 },
                React.createElement(Typography, { color: 'textSecondary' }, "Avg Win Size"),
                React.createElement(Typography, { variant: 'h6', color: 'success.main' }, 
                  formatCurrency(performanceMetrics.averageWinSize)
                )
              ),
              React.createElement(Grid, { item: true, xs: 6 },
                React.createElement(Typography, { color: 'textSecondary' }, "Avg Loss Size"),
                React.createElement(Typography, { variant: 'h6', color: 'error.main' }, 
                  formatCurrency(performanceMetrics.averageLossSize)
                )
              ),
              React.createElement(Grid, { item: true, xs: 6 },
                React.createElement(Typography, { color: 'textSecondary' }, "Consecutive Wins/Losses"),
                React.createElement(Typography, { variant: 'h6' }, 
                  performanceMetrics.consecutiveWins + " / " + performanceMetrics.consecutiveLosses
                )
              )
            )
          )
        )
      ),
      React.createElement(Grid, { item: true, xs: 12, md: 6 },
        React.createElement(Card, null,
          React.createElement(CardContent, null,
            React.createElement(Typography, { variant: 'h6', gutterBottom: true }, "Equity Curve"),
            React.createElement(Box, { sx: { height: 300 } },
              // Mock chart - in a real app, you would use actual data
              React.createElement('div', { style: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                React.createElement(Typography, { color: 'textSecondary' }, "Equity curve chart would be displayed here")
              )
            )
          )
        )
      )
    );
  };
  
  // Render strategy form dialog
  const renderStrategyFormDialog = () => {
    return React.createElement(Dialog, { 
      open: formDialogOpen, 
      onClose: () => setFormDialogOpen(false),
      maxWidth: 'md',
      fullWidth: true
    },
      React.createElement(DialogTitle, null, 
        selectedStrategy ? "Edit Strategy: " + selectedStrategy.name : "Create New Strategy"
      ),
      React.createElement(DialogContent, null,
        React.createElement(Grid, { container: true, spacing: 2, sx: { mt: 1 } },
          React.createElement(Grid, { item: true, xs: 12, sm: 6 },
            React.createElement(TextField, {
              label: "Strategy Name",
              fullWidth: true,
              value: formData.name,
              onChange: (e) => handleFormChange('name', e.target.value),
              required: true
            })
          ),
          React.createElement(Grid, { item: true, xs: 12, sm: 6 },
            React.createElement(FormControl, { fullWidth: true },
              React.createElement(InputLabel, null, "Strategy Type"),
              React.createElement(Select, {
                value: formData.type,
                label: "Strategy Type",
                onChange: (e) => handleFormChange('type', e.target.value)
              },
                strategyTypes.map(type => 
                  React.createElement(MenuItem, { key: type, value: type }, type)
                )
              )
            )
          ),
          React.createElement(Grid, { item: true, xs: 12 },
            React.createElement(TextField, {
              label: "Description",
              fullWidth: true,
              multiline: true,
              rows: 2,
              value: formData.description,
              onChange: (e) => handleFormChange('description', e.target.value)
            })
          ),
          React.createElement(Grid, { item: true, xs: 12 },
            React.createElement(Autocomplete, {
              multiple: true,
              options: availableSymbols,
              value: formData.symbols,
              onChange: (e, newValue) => handleFormChange('symbols', newValue),
              renderInput: (params) => 
                React.createElement(TextField, {
                  ...params,
                  label: "Symbols",
                  placeholder: "Add symbols"
                })
            })
          ),
          React.createElement(Grid, { item: true, xs: 12 },
            React.createElement(Typography, { variant: 'h6', gutterBottom: true, sx: { mt: 2 } }, "Parameters")
          ),
          React.createElement(Grid, { item: true, xs: 12, sm: 6 },
            React.createElement(FormControl, { fullWidth: true },
              React.createElement(InputLabel, null, "Timeframe"),
              React.createElement(Select, {
                value: formData.parameters.timeframe,
                label: "Timeframe",
                onChange: (e) => handleFormChange('parameters.timeframe', e.target.value)
              },
                timeframes.map(tf => 
                  React.createElement(MenuItem, { key: tf, value: tf }, tf)
                )
              )
            )
          ),
          React.createElement(Grid, { item: true, xs: 12, sm: 6 },
            React.createElement(TextField, {
              label: "Risk Per Trade (%)",
              type: "number",
              fullWidth: true,
              value: formData.parameters.riskPerTrade,
              onChange: (e) => handleFormChange('parameters.riskPerTrade', parseFloat(e.target.value) || 0),
              InputProps: { inputProps: { min: 0, max: 10, step: 0.1 } }
            })
          ),
          React.createElement(Grid, { item: true, xs: 12, sm: 6 },
            React.createElement(TextField, {
              label: "Max Drawdown (%)",
              type: "number",
              fullWidth: true,
              value: formData.parameters.maxDrawdown,
              onChange: (e) => handleFormChange('parameters.maxDrawdown', parseFloat(e.target.value) || 0),
              InputProps: { inputProps: { min: 0, max: 100, step: 1 } }
            })
          ),
          React.createElement(Grid, { item: true, xs: 12, sm: 6 },
            React.createElement(TextField, {
              label: "Take Profit (pips)",
              type: "number",
              fullWidth: true,
              value: formData.parameters.takeProfitPips,
              onChange: (e) => handleFormChange('parameters.takeProfitPips', parseInt(e.target.value) || 0),
              InputProps: { inputProps: { min: 0, step: 1 } }
            })
          ),
          React.createElement(Grid, { item: true, xs: 12, sm: 6 },
            React.createElement(TextField, {
              label: "Stop Loss (pips)",
              type: "number",
              fullWidth: true,
              value: formData.parameters.stopLossPips,
              onChange: (e) => handleFormChange('parameters.stopLossPips', parseInt(e.target.value) || 0),
              InputProps: { inputProps: { min: 0, step: 1 } }
            })
          )
        )
      ),
      React.createElement(DialogActions, null,
        React.createElement(Button, { onClick: () => setFormDialogOpen(false) }, "Cancel"),
        React.createElement(Button, { onClick: handleSubmitStrategy, variant: 'contained' }, "Save")
      )
    );
  };
  
  // Render filter dialog
  const renderFilterDialog = () => {
    return React.createElement(Dialog, { 
      open: filterDialogOpen, 
      onClose: () => setFilterDialogOpen(false),
      maxWidth: 'xs',
      fullWidth: true
    },
      React.createElement(DialogTitle, null, "Filter Strategies"),
      React.createElement(DialogContent, null,
        React.createElement(Grid, { container: true, spacing: 2, sx: { mt: 1 } },
          React.createElement(Grid, { item: true, xs: 12 },
            React.createElement(FormControl, { fullWidth: true },
              React.createElement(InputLabel, null, "Status"),
              React.createElement(Select, {
                value: filters.status,
                label: "Status",
                onChange: (e) => setFilters(prev => ({ ...prev, status: e.target.value }))
              },
                React.createElement(MenuItem, { value: 'all' }, "All"),
                React.createElement(MenuItem, { value: 'active' }, "Active"),
                React.createElement(MenuItem, { value: 'inactive' }, "Inactive")
              )
            )
          ),
          React.createElement(Grid, { item: true, xs: 12 },
            React.createElement(FormControl, { fullWidth: true },
              React.createElement(InputLabel, null, "Type"),
              React.createElement(Select, {
                value: filters.type,
                label: "Type",
                onChange: (e) => setFilters(prev => ({ ...prev, type: e.target.value }))
              },
                React.createElement(MenuItem, { value: 'all' }, "All"),
                strategyTypes.map(type => 
                  React.createElement(MenuItem, { key: type, value: type }, type)
                )
              )
            )
          ),
          React.createElement(Grid, { item: true, xs: 12 },
            React.createElement(FormControl, { fullWidth: true },
              React.createElement(InputLabel, null, "Performance"),
              React.createElement(Select, {
                value: filters.performance,
                label: "Performance",
                onChange: (e) => setFilters(prev => ({ ...prev, performance: e.target.value }))
              },
                React.createElement(MenuItem, { value: 'all' }, "All"),
                React.createElement(MenuItem, { value: 'profitable' }, "Profitable"),
                React.createElement(MenuItem, { value: 'losing' }, "Losing")
              )
            )
          ),
          React.createElement(Grid, { item: true, xs: 12 },
            React.createElement(FormControl, { fullWidth: true },
              React.createElement(InputLabel, null, "Symbol"),
              React.createElement(Select, {
                value: filters.symbol,
                label: "Symbol",
                onChange: (e) => setFilters(prev => ({ ...prev, symbol: e.target.value }))
              },
                React.createElement(MenuItem, { value: 'all' }, "All"),
                availableSymbols.map(symbol => 
                  React.createElement(MenuItem, { key: symbol, value: symbol }, symbol)
                )
              )
            )
          )
        )
      ),
      React.createElement(DialogActions, null,
        React.createElement(Button, { onClick: () => setFilterDialogOpen(false) }, "Cancel"),
        React.createElement(Button, { 
          onClick: () => {
            setFilterDialogOpen(false);
            setPage(0);
          }, 
          variant: 'contained' 
        }, "Apply")
      )
    );
  };
  
  // Main render
  return React.createElement(Container, { maxWidth: 'xl' },
    React.createElement(Box, { sx: { mt: 2, mb: 2 } }),
    
    loading && React.createElement(LinearProgress, { sx: { mb: 3 } }),
    
    renderSummaryCards(),
    
    React.createElement(Box, { sx: { mt: 4, mb: 2 } },
      React.createElement(Tabs, { 
        value: tabValue, 
        onChange: (e, newValue) => setTabValue(newValue),
        indicatorColor: 'primary',
        textColor: 'primary'
      },
        React.createElement(Tab, { label: "Strategies" }),
        React.createElement(Tab, { label: "Performance Metrics" })
      )
    ),
    
    tabValue === 0 ? renderStrategiesTable() : renderPerformanceMetrics(),
    
    renderStrategyFormDialog(),
    renderFilterDialog()
  );
};

export default StrategiesPage;
