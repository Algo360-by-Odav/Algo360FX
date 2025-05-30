// hftPageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  Timeline as PerformanceIcon,
  Speed as LatencyIcon,
  Memory as ResourceIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  ExpandMore as ExpandMoreIcon,
  History as HistoryIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useStores } from '../stores/storeProviderJs';
import { format } from 'date-fns';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

const HFTPage = observer(() => {
  const { hftStore } = useStores();
  const theme = useTheme();
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [strategyConfig, setStrategyConfig] = useState({});
  const [editedConfig, setEditedConfig] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addStrategyOpen, setAddStrategyOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [logEntries, setLogEntries] = useState([]);
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    type: 'market_making',
    config: {
      symbol: 'EURUSD',
      timeframe: '1s',
      maxPositions: 5,
      positionSizing: 'fixed',
      riskPerTrade: 0.5,
      orderTypes: ['LIMIT'],
      targetProfit: 0.05,
      stopLoss: 0.1,
    }
  });

  // Fetch initial data
  useEffect(() => {
    // This would normally fetch data from the backend
    // But we're using mock data from the store
    console.log('HFT Page initialized');
  }, []);

  const handleStartStrategy = (strategyId) => {
    hftStore.startStrategy(strategyId);
  };

  const handleStopStrategy = (strategyId) => {
    hftStore.stopStrategy(strategyId);
  };

  const handleOpenSettings = (strategy) => {
    setSelectedStrategy(strategy);
    setStrategyConfig(strategy.config);
    setEditedConfig(strategy.config ? {...strategy.config} : {});
    setSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
    setSelectedStrategy(null);
    setEditedConfig(null);
  };

  const handleSaveSettings = () => {
    if (selectedStrategy && editedConfig) {
      hftStore.updateStrategyConfig(selectedStrategy.id, editedConfig);
      handleCloseSettings();
    }
  };

  const handleOpenAddStrategy = () => {
    setAddStrategyOpen(true);
  };
  
  const handleOpenLogs = () => {
    // Generate mock log entries
    const mockLogs = generateMockLogs();
    setLogEntries(mockLogs);
    setLogsOpen(true);
  };
  
  const handleCloseLogs = () => {
    setLogsOpen(false);
  };
  
  const generateMockLogs = () => {
    const logTypes = ['info', 'warning', 'error', 'success'];
    const strategies = hftStore.strategies;
    const events = [
      'Strategy started',
      'Strategy stopped',
      'Order placed',
      'Order filled',
      'Order cancelled',
      'Position opened',
      'Position closed',
      'Connection established',
      'Connection lost',
      'Market data received',
      'Latency spike detected',
      'System resource warning',
      'Configuration updated',
      'Backtest completed',
      'Performance analysis updated'
    ];
    
    // Generate 50 random log entries
    const now = new Date();
    const logs = [];
    
    for (let i = 0; i < 50; i++) {
      const timestamp = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
      const strategy = strategies.length > 0 ? 
        strategies[Math.floor(Math.random() * strategies.length)] : 
        { name: 'System' };
      const type = logTypes[Math.floor(Math.random() * logTypes.length)];
      const event = events[Math.floor(Math.random() * events.length)];
      const details = type === 'error' ? 
        `Failed to ${event.toLowerCase()} due to network issue` : 
        `Successfully ${event.toLowerCase()} at ${timestamp.toISOString()}`;
      
      logs.push({
        id: `log-${i}`,
        timestamp,
        strategy: strategy.name,
        type,
        event,
        details
      });
    }
    
    // Sort logs by timestamp (newest first)
    return logs.sort((a, b) => b.timestamp - a.timestamp);
  };

  const handleCloseAddStrategy = () => {
    setAddStrategyOpen(false);
    setNewStrategy({
      name: '',
      type: 'market_making',
      config: {
        symbol: 'EURUSD',
        timeframe: '1s',
        maxPositions: 5,
        positionSizing: 'fixed',
        riskPerTrade: 0.5,
        orderTypes: ['LIMIT'],
        targetProfit: 0.05,
        stopLoss: 0.1,
      }
    });
  };

  const handleAddStrategy = () => {
    if (!newStrategy.name) {
      setError('Strategy name is required');
      return;
    }

    try {
      setLoading(true);

      // Create a new strategy ID
      const strategyId = `strat-${Date.now()}`;

      // Create the new strategy object
      const strategy = {
        id: strategyId,
        name: newStrategy.name,
        description: newStrategy.description || `${newStrategy.type} strategy`,
        type: newStrategy.type,
        status: 'inactive',
        trades: 0,
        winRate: 0,
        pnl: 0,
        latency: 0.5 + Math.random() * 0.5,
        cpuUsage: 5 + Math.random() * 10,
        memoryUsage: 200 + Math.random() * 100,
        config: newStrategy.config
      };

      // Add the strategy to the store
      hftStore.strategies.push(strategy);

      // Update total strategies count
      hftStore.systemMetrics.totalStrategies += 1;

      // Close the dialog
      handleCloseAddStrategy();
      setError(null);
    } catch (err) {
      setError('Failed to add strategy: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'error':
        return 'error';
      case 'warming_up':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return React.createElement(SuccessIcon);
      case 'error':
        return React.createElement(WarningIcon);
      case 'warming_up':
        return React.createElement(CircularProgress, { size: 20 });
      default:
        return null;
    }
  };

  // Create system metrics section
  const createSystemMetrics = () => {
    return React.createElement(Grid, {
      key: "metrics-grid-container",
      container: true,
      spacing: 3,
      sx: { mb: 4 }
    }, [
      // Average Latency
      React.createElement(Grid, {
        key: "latency-grid",
        item: true,
        xs: 12,
        md: 3
      }, 
        React.createElement(Paper, {
          sx: { p: 2 }
        }, [
          React.createElement(Typography, {
            key: "latency-label",
            variant: "subtitle2",
            color: "textSecondary"
          }, "Average Latency"),
          React.createElement(Typography, {
            key: "latency-value",
            variant: "h4"
          }, `${hftStore.systemMetrics.averageLatency.toFixed(3)} ms`)
        ])
      ),
      
      // Active Strategies
      React.createElement(Grid, {
        key: "active-strategies-grid",
        item: true,
        xs: 12,
        md: 3
      }, 
        React.createElement(Paper, {
          sx: { p: 2 }
        }, [
          React.createElement(Typography, {
            key: "active-strategies-label",
            variant: "subtitle2",
            color: "textSecondary"
          }, "Active Strategies"),
          React.createElement(Typography, {
            key: "active-strategies-value",
            variant: "h4"
          }, `${hftStore.systemMetrics.activeStrategies} / ${hftStore.systemMetrics.totalStrategies}`)
        ])
      ),
      
      // CPU Usage
      React.createElement(Grid, {
        key: "cpu-grid",
        item: true,
        xs: 12,
        md: 3
      }, 
        React.createElement(Paper, {
          sx: { p: 2 }
        }, [
          React.createElement(Typography, {
            key: "cpu-label",
            variant: "subtitle2",
            color: "textSecondary"
          }, "CPU Usage"),
          React.createElement(Typography, {
            key: "cpu-value",
            variant: "h4"
          }, `${hftStore.systemMetrics.cpuUsage.toFixed(1)}%`)
        ])
      ),
      
      // Memory Usage
      React.createElement(Grid, {
        key: "memory-grid",
        item: true,
        xs: 12,
        md: 3
      }, 
        React.createElement(Paper, {
          sx: { p: 2 }
        }, [
          React.createElement(Typography, {
            key: "memory-label",
            variant: "subtitle2",
            color: "textSecondary"
          }, "Memory Usage"),
          React.createElement(Typography, {
            key: "memory-value",
            variant: "h4"
          }, `${hftStore.systemMetrics.memoryUsage.toFixed(1)}%`)
        ])
      )
    ]);
  };

  // Create performance chart
  const createPerformanceChart = () => {
    // Create default data if performance history is empty
    if (!hftStore.performanceHistory || hftStore.performanceHistory.length === 0) {
      // Generate mock data for demonstration
      const mockData = [];
      const now = new Date();
      for (let i = 0; i < 24; i++) {
        const time = new Date(now);
        time.setHours(time.getHours() - (24 - i));
        mockData.push({
          timestamp: time.toISOString(),
          pnl: Math.random() * 1000 - 500,
          trades: Math.floor(Math.random() * 50),
          winRate: 40 + Math.random() * 30
        });
      }
      hftStore.performanceHistory = mockData;
    }
    
    const chartData = {
      labels: hftStore.performanceHistory.map(d => format(new Date(d.timestamp), 'HH:mm')),
      datasets: [
        {
          label: 'P&L',
          data: hftStore.performanceHistory.map(d => d.pnl),
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: true,
          tension: 0.4,
        }
      ]
    };
    
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        y: {
          ticks: {
            callback: (value) => `$${value.toFixed(2)}`,
          },
        },
      },
      maintainAspectRatio: false,
    };
    
    return React.createElement(Grid, {
      container: true,
      spacing: 3,
      sx: { mb: 4 }
    }, 
      React.createElement(Grid, {
        item: true,
        xs: 12
      }, 
        React.createElement(Paper, {
          sx: { p: 2 }
        }, [
          React.createElement(Typography, {
            key: "chart-title",
            variant: "h6",
            gutterBottom: true
          }, "Performance"),
          React.createElement(Box, {
            key: "chart-container",
            sx: { height: 300 }
          }, 
            React.createElement(Line, {
              data: chartData,
              options: chartOptions
            })
          )
        ])
      )
    );
  };

  // Create strategies table
  const createStrategiesTable = () => {
    return React.createElement(Grid, {
      container: true,
      spacing: 3
    }, 
      React.createElement(Grid, {
        item: true,
        xs: 12
      }, 
        React.createElement(Paper, null, [
          React.createElement(TableContainer, {
            key: "table-container"
          }, 
            React.createElement(Table, null, [
              // Table Header
              React.createElement(TableHead, {
                key: "table-head"
              }, 
                React.createElement(TableRow, null, [
                  React.createElement(TableCell, { key: "name-header" }, "Strategy"),
                  React.createElement(TableCell, { key: "status-header" }, "Status"),
                  React.createElement(TableCell, { key: "symbols-header" }, "Symbols"),
                  React.createElement(TableCell, { key: "trades-header" }, "Trades"),
                  React.createElement(TableCell, { key: "win-rate-header" }, "Win Rate"),
                  React.createElement(TableCell, { key: "pnl-header" }, "P&L"),
                  React.createElement(TableCell, { key: "actions-header" }, "Actions")
                ])
              ),
              
              // Table Body
              React.createElement(TableBody, {
                key: "table-body"
              }, 
                hftStore.strategies.map(strategy => 
                  React.createElement(TableRow, {
                    key: strategy.id
                  }, [
                    // Strategy Name
                    React.createElement(TableCell, {
                      key: `name-${strategy.id}`
                    }, 
                      React.createElement(Typography, {
                        variant: "body2",
                        fontWeight: "medium"
                      }, strategy.name)
                    ),
                    
                    // Status
                    React.createElement(TableCell, {
                      key: `status-${strategy.id}`
                    }, 
                      React.createElement(Chip, {
                        icon: getStatusIcon(strategy.status),
                        label: strategy.status,
                        color: getStatusColor(strategy.status),
                        size: "small"
                      })
                    ),
                    
                    // Symbols
                    React.createElement(TableCell, {
                      key: `symbols-${strategy.id}`
                    }, 
                      strategy.config && strategy.config.symbol ? 
                        (typeof strategy.config.symbol === 'string' ? 
                          strategy.config.symbol : 
                          (Array.isArray(strategy.config.symbol) ? 
                            strategy.config.symbol.join(", ") : 
                            'N/A')
                        ) : 
                        'N/A'
                    ),
                    
                    // Trades
                    React.createElement(TableCell, {
                      key: `trades-${strategy.id}`
                    }, 
                      strategy.trades || 0
                    ),
                    
                    // Win Rate
                    React.createElement(TableCell, {
                      key: `win-rate-${strategy.id}`
                    }, 
                      `${strategy.winRate ? strategy.winRate.toFixed(1) : '0.0'}%`
                    ),
                    
                    // P&L
                    React.createElement(TableCell, {
                      key: `pnl-${strategy.id}`
                    }, 
                      React.createElement(Typography, {
                        color: (strategy.pnl || 0) >= 0 ? 'success.main' : 'error.main'
                      }, `$${(strategy.pnl || 0).toFixed(2)}`)
                    ),
                    
                    // Actions
                    React.createElement(TableCell, {
                      key: `actions-${strategy.id}`
                    }, 
                      React.createElement(Box, {
                        sx: { display: 'flex', gap: 1 }
                      }, [
                        // Start/Stop Button
                        strategy.status === 'inactive' ? 
                          React.createElement(Tooltip, {
                            key: `start-tooltip-${strategy.id}`,
                            title: "Start Strategy"
                          }, 
                            React.createElement(IconButton, {
                              color: "primary",
                              onClick: () => handleStartStrategy(strategy.id)
                            }, 
                              React.createElement(StartIcon)
                            )
                          ) : 
                          React.createElement(Tooltip, {
                            key: `stop-tooltip-${strategy.id}`,
                            title: "Stop Strategy"
                          }, 
                            React.createElement(IconButton, {
                              color: "error",
                              onClick: () => handleStopStrategy(strategy.id)
                            }, 
                              React.createElement(StopIcon)
                            )
                          ),
                        
                        // Settings Button
                        React.createElement(Tooltip, {
                          key: `settings-tooltip-${strategy.id}`,
                          title: "Settings"
                        }, 
                          React.createElement(IconButton, {
                            onClick: () => handleOpenSettings(strategy)
                          }, 
                            React.createElement(SettingsIcon)
                          )
                        )
                      ])
                    )
                  ])
                )
              )
            ])
          )
        ])
      )
    );
  };

  // Create settings dialog
  const createSettingsDialog = () => {
    // Return empty fragment if no edited config
    if (!selectedStrategy) return React.createElement(React.Fragment);
    
    return React.createElement(Dialog, {
      open: settingsOpen,
      onClose: handleCloseSettings,
      maxWidth: "md",
      fullWidth: true
    }, [
      // Dialog Title
      React.createElement(DialogTitle, {
        key: "dialog-title"
      }, "Strategy Settings"),
      
      // Dialog Content
      React.createElement(DialogContent, {
        key: "dialog-content"
      }, 
        React.createElement(Box, {
          sx: { mt: 2 }
        }, [
          // General Settings Accordion
          React.createElement(Accordion, {
            key: "general-accordion",
            defaultExpanded: true
          }, [
            React.createElement(AccordionSummary, {
              key: "general-summary",
              expandIcon: React.createElement(ExpandMoreIcon)
            }, 
              React.createElement(Typography, {
                variant: "subtitle1"
              }, "General Settings")
            ),
            
            React.createElement(AccordionDetails, {
              key: "general-details"
            }, 
              React.createElement(Grid, {
                container: true,
                spacing: 2
              }, [
                // Time Frame
                React.createElement(Grid, {
                  key: "timeframe-grid",
                  item: true,
                  xs: 12,
                  sm: 6
                }, 
                  React.createElement(FormControl, {
                    fullWidth: true
                  }, [
                    React.createElement(InputLabel, {
                      key: "timeframe-label"
                    }, "Time Frame"),
                    
                    React.createElement(Select, {
                      key: "timeframe-select",
                      value: editedConfig.timeFrame,
                      label: "Time Frame",
                      onChange: (e) => setEditedConfig({
                        ...editedConfig,
                        timeFrame: e.target.value
                      })
                    }, [
                      React.createElement(MenuItem, { key: "m1", value: "M1" }, "1 Minute"),
                      React.createElement(MenuItem, { key: "m5", value: "M5" }, "5 Minutes"),
                      React.createElement(MenuItem, { key: "m15", value: "M15" }, "15 Minutes"),
                      React.createElement(MenuItem, { key: "m30", value: "M30" }, "30 Minutes"),
                      React.createElement(MenuItem, { key: "h1", value: "H1" }, "1 Hour"),
                      React.createElement(MenuItem, { key: "h4", value: "H4" }, "4 Hours"),
                      React.createElement(MenuItem, { key: "d1", value: "D1" }, "Daily")
                    ])
                  ])
                ),
                
                // Order Size
                React.createElement(Grid, {
                  key: "order-size-grid",
                  item: true,
                  xs: 12,
                  sm: 6
                }, 
                  React.createElement(TextField, {
                    fullWidth: true,
                    label: "Order Size",
                    type: "number",
                    value: editedConfig.orderSize,
                    onChange: (e) => setEditedConfig({
                      ...editedConfig,
                      orderSize: Number(e.target.value)
                    })
                  })
                ),
                
                // Max Open Positions
                React.createElement(Grid, {
                  key: "max-positions-grid",
                  item: true,
                  xs: 12,
                  sm: 6
                }, 
                  React.createElement(TextField, {
                    fullWidth: true,
                    label: "Max Open Positions",
                    type: "number",
                    value: editedConfig.maxOpenPositions,
                    onChange: (e) => setEditedConfig({
                      ...editedConfig,
                      maxOpenPositions: Number(e.target.value)
                    })
                  })
                ),
                
                // Risk Per Trade
                React.createElement(Grid, {
                  key: "risk-grid",
                  item: true,
                  xs: 12,
                  sm: 6
                }, 
                  React.createElement(TextField, {
                    fullWidth: true,
                    label: "Risk Per Trade (%)",
                    type: "number",
                    value: editedConfig.riskPerTrade * 100,
                    onChange: (e) => setEditedConfig({
                      ...editedConfig,
                      riskPerTrade: Number(e.target.value) / 100
                    })
                  })
                )
              ])
            )
          ]),
          
          // Event Filters Accordion
          React.createElement(Accordion, {
            key: "filters-accordion"
          }, [
            React.createElement(AccordionSummary, {
              key: "filters-summary",
              expandIcon: React.createElement(ExpandMoreIcon)
            }, 
              React.createElement(Typography, {
                variant: "subtitle1"
              }, "Event Filters")
            ),
            
            React.createElement(AccordionDetails, {
              key: "filters-details"
            }, 
              React.createElement(Grid, {
                container: true,
                spacing: 2
              }, [
                // News Events
                React.createElement(Grid, {
                  key: "news-grid",
                  item: true,
                  xs: 12,
                  sm: 6
                }, 
                  React.createElement(FormControlLabel, {
                    control: React.createElement(Switch, {
                      checked: editedConfig.eventFilters.newsEvents,
                      onChange: (e) => setEditedConfig({
                        ...editedConfig,
                        eventFilters: {
                          ...editedConfig.eventFilters,
                          newsEvents: e.target.checked
                        }
                      })
                    }),
                    label: "News Events"
                  })
                ),
                
                // Economic Calendar
                React.createElement(Grid, {
                  key: "economic-grid",
                  item: true,
                  xs: 12,
                  sm: 6
                }, 
                  React.createElement(FormControlLabel, {
                    control: React.createElement(Switch, {
                      checked: editedConfig.eventFilters.economicCalendar,
                      onChange: (e) => setEditedConfig({
                        ...editedConfig,
                        eventFilters: {
                          ...editedConfig.eventFilters,
                          economicCalendar: e.target.checked
                        }
                      })
                    }),
                    label: "Economic Calendar"
                  })
                ),
                
                // Volatility Filter
                React.createElement(Grid, {
                  key: "volatility-grid",
                  item: true,
                  xs: 12,
                  sm: 6
                }, 
                  React.createElement(FormControlLabel, {
                    control: React.createElement(Switch, {
                      checked: editedConfig.eventFilters.volatilityFilter,
                      onChange: (e) => setEditedConfig({
                        ...editedConfig,
                        eventFilters: {
                          ...editedConfig.eventFilters,
                          volatilityFilter: e.target.checked
                        }
                      })
                    }),
                    label: "Volatility Filter"
                  })
                ),
                
                // Liquidity Filter
                React.createElement(Grid, {
                  key: "liquidity-grid",
                  item: true,
                  xs: 12,
                  sm: 6
                }, 
                  React.createElement(FormControlLabel, {
                    control: React.createElement(Switch, {
                      checked: editedConfig.eventFilters.liquidityFilter,
                      onChange: (e) => setEditedConfig({
                        ...editedConfig,
                        eventFilters: {
                          ...editedConfig.eventFilters,
                          liquidityFilter: e.target.checked
                        }
                      })
                    }),
                    label: "Liquidity Filter"
                  })
                )
              ])
            )
          ])
        ])
      ),
      
      // Dialog Actions
      React.createElement(DialogActions, {
        key: "dialog-actions"
      }, [
        React.createElement(Button, {
          key: "cancel-button",
          onClick: handleCloseSettings
        }, "Cancel"),
        
        React.createElement(Button, {
          key: "save-button",
          onClick: handleSaveSettings,
          variant: "contained",
          color: "primary"
        }, "Save Changes")
      ])
    ]);
  };

  // Create Add Strategy dialog
  const createAddStrategyDialog = () => {
    return React.createElement(Dialog, {
      open: addStrategyOpen,
      onClose: handleCloseAddStrategy,
      maxWidth: "md",
      fullWidth: true
    }, [
      // Dialog Title
      React.createElement(DialogTitle, {
        key: "add-dialog-title"
      }, "Add New Strategy"),
      
      // Dialog Content
      React.createElement(DialogContent, {
        key: "add-dialog-content"
      }, [
        // Error Alert
        error && React.createElement(Alert, {
          key: "add-error-alert",
          severity: "error",
          sx: { mb: 2 }
        }, error),
        
        // Strategy Name
        React.createElement(TextField, {
          key: "strategy-name-field",
          label: "Strategy Name",
          fullWidth: true,
          margin: "normal",
          value: newStrategy.name,
          onChange: (e) => setNewStrategy({...newStrategy, name: e.target.value}),
          required: true
        }),
        
        // Strategy Type
        React.createElement(FormControl, {
          key: "strategy-type-field",
          fullWidth: true,
          margin: "normal"
        }, [
          React.createElement(InputLabel, {
            key: "strategy-type-label",
            id: "strategy-type-label"
          }, "Strategy Type"),
          React.createElement(Select, {
            key: "strategy-type-select",
            labelId: "strategy-type-label",
            value: newStrategy.type,
            label: "Strategy Type",
            onChange: (e) => setNewStrategy({...newStrategy, type: e.target.value})
          }, [
            React.createElement(MenuItem, { key: "market-making", value: "market_making" }, "Market Making"),
            React.createElement(MenuItem, { key: "statistical-arbitrage", value: "statistical_arbitrage" }, "Statistical Arbitrage"),
            React.createElement(MenuItem, { key: "momentum", value: "momentum" }, "Momentum"),
            React.createElement(MenuItem, { key: "mean-reversion", value: "mean_reversion" }, "Mean Reversion"),
            React.createElement(MenuItem, { key: "adaptive", value: "adaptive" }, "Adaptive")
          ])
        ]),
        
        // Strategy Description
        React.createElement(TextField, {
          key: "strategy-description-field",
          label: "Description",
          fullWidth: true,
          margin: "normal",
          multiline: true,
          rows: 2,
          value: newStrategy.description || "",
          onChange: (e) => setNewStrategy({...newStrategy, description: e.target.value})
        }),
        
        // Basic Configuration
        React.createElement(Typography, {
          key: "basic-config-title",
          variant: "h6",
          sx: { mt: 2, mb: 1 }
        }, "Basic Configuration"),
        
        // Symbol
        React.createElement(TextField, {
          key: "symbol-field",
          label: "Symbol",
          fullWidth: true,
          margin: "normal",
          value: newStrategy.config.symbol,
          onChange: (e) => setNewStrategy({
            ...newStrategy, 
            config: {...newStrategy.config, symbol: e.target.value}
          })
        }),
        
        // Timeframe
        React.createElement(FormControl, {
          key: "timeframe-field",
          fullWidth: true,
          margin: "normal"
        }, [
          React.createElement(InputLabel, {
            key: "timeframe-label",
            id: "timeframe-label"
          }, "Timeframe"),
          React.createElement(Select, {
            key: "timeframe-select",
            labelId: "timeframe-label",
            value: newStrategy.config.timeframe,
            label: "Timeframe",
            onChange: (e) => setNewStrategy({
              ...newStrategy, 
              config: {...newStrategy.config, timeframe: e.target.value}
            })
          }, [
            React.createElement(MenuItem, { key: "1s", value: "1s" }, "1 Second"),
            React.createElement(MenuItem, { key: "5s", value: "5s" }, "5 Seconds"),
            React.createElement(MenuItem, { key: "10s", value: "10s" }, "10 Seconds"),
            React.createElement(MenuItem, { key: "30s", value: "30s" }, "30 Seconds"),
            React.createElement(MenuItem, { key: "1m", value: "1m" }, "1 Minute")
          ])
        ])
      ]),
      
      // Dialog Actions
      React.createElement(DialogActions, {
        key: "add-dialog-actions"
      }, [
        React.createElement(Button, {
          key: "add-cancel-button",
          onClick: handleCloseAddStrategy
        }, "Cancel"),
        
        React.createElement(Button, {
          key: "add-save-button",
          onClick: handleAddStrategy,
          variant: "contained",
          color: "primary",
          disabled: loading
        }, loading ? "Adding..." : "Add Strategy")
      ])
    ]);
  };

  // Create Logs dialog
  const createLogsDialog = () => {
    return React.createElement(Dialog, {
      open: logsOpen,
      onClose: handleCloseLogs,
      maxWidth: "lg",
      fullWidth: true,
      sx: { '& .MuiDialog-paper': { height: '80vh' } }
    }, [
      // Dialog Title with close button
      React.createElement(DialogTitle, {
        key: "logs-dialog-title",
        sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
      }, [
        "System Logs",
        React.createElement(IconButton, {
          key: "close-logs-button",
          edge: "end",
          color: "inherit",
          onClick: handleCloseLogs,
          'aria-label': "close"
        }, React.createElement(CloseIcon))
      ]),
      
      // Dialog Content
      React.createElement(DialogContent, {
        key: "logs-dialog-content",
        dividers: true,
        sx: { p: 0 }
      }, [
        // Logs Table
        React.createElement(TableContainer, {
          key: "logs-table-container",
          component: Paper,
          sx: { height: '100%' }
        }, [
          React.createElement(Table, {
            key: "logs-table",
            stickyHeader: true,
            size: "small"
          }, [
            // Table Header
            React.createElement(TableHead, {
              key: "logs-table-head"
            }, [
              React.createElement(TableRow, {
                key: "logs-header-row"
              }, [
                React.createElement(TableCell, { key: "timestamp-header", width: "15%" }, "Timestamp"),
                React.createElement(TableCell, { key: "strategy-header", width: "15%" }, "Strategy"),
                React.createElement(TableCell, { key: "type-header", width: "10%" }, "Type"),
                React.createElement(TableCell, { key: "event-header", width: "20%" }, "Event"),
                React.createElement(TableCell, { key: "details-header", width: "40%" }, "Details")
              ])
            ]),
            
            // Table Body
            React.createElement(TableBody, {
              key: "logs-table-body"
            }, 
              logEntries.map(log => 
                React.createElement(TableRow, {
                  key: log.id,
                  hover: true,
                  sx: {
                    backgroundColor: 
                      log.type === 'error' ? 'rgba(244, 67, 54, 0.08)' :
                      log.type === 'warning' ? 'rgba(255, 152, 0, 0.08)' :
                      log.type === 'success' ? 'rgba(76, 175, 80, 0.08)' :
                      'inherit'
                  }
                }, [
                  // Timestamp
                  React.createElement(TableCell, { key: `timestamp-${log.id}` }, 
                    log.timestamp.toLocaleString()
                  ),
                  
                  // Strategy
                  React.createElement(TableCell, { key: `strategy-${log.id}` }, log.strategy),
                  
                  // Type
                  React.createElement(TableCell, { key: `type-${log.id}` }, 
                    React.createElement(Chip, {
                      label: log.type,
                      size: "small",
                      color: 
                        log.type === 'error' ? 'error' :
                        log.type === 'warning' ? 'warning' :
                        log.type === 'success' ? 'success' :
                        'info'
                    })
                  ),
                  
                  // Event
                  React.createElement(TableCell, { key: `event-${log.id}` }, log.event),
                  
                  // Details
                  React.createElement(TableCell, { key: `details-${log.id}` }, log.details)
                ])
              )
            )
          ])
        ])
      ]),
      
      // Dialog Actions
      React.createElement(DialogActions, {
        key: "logs-dialog-actions"
      }, [
        React.createElement(Button, {
          key: "refresh-logs-button",
          startIcon: React.createElement(RefreshIcon),
          onClick: handleOpenLogs
        }, "Refresh"),
        React.createElement(Button, {
          key: "close-logs-button",
          onClick: handleCloseLogs
        }, "Close")
      ])
    ]);
  };

  // Main render
  return React.createElement(Container, {
    maxWidth: false
  }, [
    React.createElement(Box, {
      key: "main-content",
      sx: { mt: 4, mb: 4 }
    }, [
      // Header section with title and quick stats
      React.createElement(Paper, {
        key: "header-section",
        elevation: 2,
        sx: { p: 3, mb: 4, borderRadius: 2, background: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.9)' }
      }, [
        React.createElement(Grid, {
          key: "header-grid",
          container: true,
          spacing: 3,
          alignItems: "center"
        }, [
          // Title and subtitle
          React.createElement(Grid, { item: true, xs: 12, md: 6, key: "title-grid" }, [
            React.createElement(Typography, {
              key: "page-title",
              variant: "h4",
              sx: { fontWeight: 'bold', mb: 1 }
            }, "High-Frequency Trading Platform"),
            React.createElement(Typography, {
              key: "page-subtitle",
              variant: "subtitle1",
              color: "text.secondary"
            }, `${hftStore.strategies.length} strategies available | ${hftStore.systemMetrics.activeStrategies} active`)
          ]),
          
          // Quick action buttons
          React.createElement(Grid, { item: true, xs: 12, md: 6, key: "actions-grid", sx: { display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } } }, [
            React.createElement(Button, {
              key: "add-strategy-button",
              variant: "contained",
              color: "primary",
              startIcon: React.createElement(AddIcon),
              onClick: handleOpenAddStrategy,
              sx: { mr: 2 }
            }, "Add Strategy"),
            React.createElement(Button, {
              key: "view-logs-button",
              variant: "outlined",
              startIcon: React.createElement(HistoryIcon),
              onClick: handleOpenLogs
            }, "View Logs")
          ])
        ])
      ]),
      
      // System Metrics
      createSystemMetrics(),
      
      // Performance Chart
      createPerformanceChart(),
      
      // Strategies Table
      createStrategiesTable(),
      
      // Settings Dialog
      createSettingsDialog(),
      
      // Add Strategy Dialog
      createAddStrategyDialog(),
      
      // Logs Dialog
      createLogsDialog()
    ])
  ]);
});

export default HFTPage;
