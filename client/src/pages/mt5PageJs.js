// mt5PageJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Stack,
  MenuItem,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShowChart as ChartIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useStores } from '../stores/storeProviderJs';
import MT5Chart from '../components/mt5/MT5Chart';

const defaultOrderFormData = {
  symbol: 'EURUSD',
  type: 'buy',
  volume: 0.1,
  price: 0,
  stopLoss: null,
  takeProfit: null,
  comment: '',
};

const MT5Page = () => {
  const { mt5Store } = useStores();
  const [accountId, setAccountId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [orderFormData, setOrderFormData] = useState(defaultOrderFormData);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [modifyPositionOpen, setModifyPositionOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [symbolSelectOpen, setSymbolSelectOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [selectedChartAccount, setSelectedChartAccount] = useState(null);

  useEffect(() => {
    const autoConnect = async () => {
      if (accountId && password && !mt5Store.isConnected) {
        await handleConnect();
      }
    };

    autoConnect();
  }, []);

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      const success = await mt5Store.connect(accountId, password);
      if (!success) {
        setError('Failed to connect to MT5');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (login) => {
    try {
      setLoading(true);
      setError(null);
      await mt5Store.disconnect(login);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      await mt5Store.getAccountInfo();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setError(null);
      const success = await mt5Store.placeOrder({
        symbol: orderFormData.symbol,
        type: orderFormData.type,
        volume: orderFormData.volume,
        openPrice: orderFormData.price,
        stopLoss: orderFormData.stopLoss,
        takeProfit: orderFormData.takeProfit,
        comment: orderFormData.comment,
      });
      
      if (success) {
        setOrderFormOpen(false);
        handleRefresh();
      } else {
        setError('Failed to place order');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleModifyPosition = async () => {
    if (!selectedPosition) return;

    try {
      setError(null);
      const success = await mt5Store.modifyPosition(
        selectedPosition.symbol,
        orderFormData.stopLoss,
        orderFormData.takeProfit
      );
      
      if (success) {
        setModifyPositionOpen(false);
        handleRefresh();
      } else {
        setError('Failed to modify position');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClosePosition = async (position) => {
    try {
      setError(null);
      const success = await mt5Store.closePosition(position.ticket);
      
      if (success) {
        handleRefresh();
      } else {
        setError('Failed to close position');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelOrder = async (ticket) => {
    try {
      setError(null);
      const success = await mt5Store.cancelOrder(ticket);
      
      if (success) {
        handleRefresh();
      } else {
        setError('Failed to cancel order');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChartOpen = (accountNumber) => {
    setSelectedChartAccount(accountNumber);
    setSymbolSelectOpen(true);
  };

  const handleChartClose = () => {
    setSelectedChartAccount(null);
    setChartOpen(false);
  };

  // Create the connection form
  const createConnectionForm = () => {
    return React.createElement(Paper, {
      sx: { p: 3, mb: 3 }
    }, [
      React.createElement(Typography, {
        key: "connection-title",
        variant: "h6",
        gutterBottom: true
      }, "MT5 Connection"),
      
      React.createElement(Box, {
        key: "connection-form",
        component: "form",
        sx: { display: 'flex', flexDirection: 'column', gap: 2 }
      }, [
        React.createElement(TextField, {
          key: "account-id",
          label: "Account ID",
          value: accountId,
          onChange: (e) => setAccountId(e.target.value),
          disabled: mt5Store.isConnected
        }),
        
        React.createElement(TextField, {
          key: "password",
          label: "Password",
          type: "password",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          disabled: mt5Store.isConnected
        }),
        
        error && React.createElement(Alert, {
          key: "error-alert",
          severity: "error",
          sx: { mt: 2 }
        }, error),
        
        React.createElement(Box, {
          key: "connection-buttons",
          sx: { display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }
        }, [
          mt5Store.isConnected ? (
            React.createElement(Button, {
              key: "disconnect-button",
              variant: "outlined",
              color: "error",
              onClick: () => handleDisconnect(mt5Store.account?.login),
              disabled: loading,
              startIcon: React.createElement(LogoutIcon)
            }, "Disconnect")
          ) : (
            React.createElement(Button, {
              key: "connect-button",
              variant: "contained",
              onClick: handleConnect,
              disabled: loading || !accountId || !password
            }, loading ? 
              React.createElement(CircularProgress, { size: 24 }) : 
              "Connect to MT5"
            )
          ),
          
          mt5Store.isConnected && React.createElement(Button, {
            key: "refresh-button",
            variant: "outlined",
            onClick: handleRefresh,
            disabled: loading,
            startIcon: React.createElement(RefreshIcon)
          }, "Refresh")
        ])
      ])
    ]);
  };

  // Create the account info section
  const createAccountInfo = () => {
    if (!mt5Store.isConnected || !mt5Store.account) return null;
    
    return React.createElement(Paper, {
      sx: { p: 3, mb: 3 }
    }, [
      React.createElement(Typography, {
        key: "account-title",
        variant: "h6",
        gutterBottom: true
      }, "Account Information"),
      
      React.createElement(Grid, {
        key: "account-grid",
        container: true,
        spacing: 2
      }, [
        // Login
        React.createElement(Grid, {
          key: "login-grid",
          item: true,
          xs: 12,
          sm: 6,
          md: 4
        }, [
          React.createElement(Typography, {
            key: "login-label",
            variant: "body2",
            color: "text.secondary"
          }, "Login"),
          React.createElement(Typography, {
            key: "login-value",
            variant: "body1"
          }, mt5Store.account.login)
        ]),
        
        // Name
        React.createElement(Grid, {
          key: "name-grid",
          item: true,
          xs: 12,
          sm: 6,
          md: 4
        }, [
          React.createElement(Typography, {
            key: "name-label",
            variant: "body2",
            color: "text.secondary"
          }, "Name"),
          React.createElement(Typography, {
            key: "name-value",
            variant: "body1"
          }, mt5Store.account.name)
        ]),
        
        // Server
        React.createElement(Grid, {
          key: "server-grid",
          item: true,
          xs: 12,
          sm: 6,
          md: 4
        }, [
          React.createElement(Typography, {
            key: "server-label",
            variant: "body2",
            color: "text.secondary"
          }, "Server"),
          React.createElement(Typography, {
            key: "server-value",
            variant: "body1"
          }, mt5Store.account.server)
        ]),
        
        // Balance
        React.createElement(Grid, {
          key: "balance-grid",
          item: true,
          xs: 12,
          sm: 6,
          md: 4
        }, [
          React.createElement(Typography, {
            key: "balance-label",
            variant: "body2",
            color: "text.secondary"
          }, "Balance"),
          React.createElement(Typography, {
            key: "balance-value",
            variant: "body1"
          }, `$${mt5Store.account.balance.toFixed(2)}`)
        ]),
        
        // Equity
        React.createElement(Grid, {
          key: "equity-grid",
          item: true,
          xs: 12,
          sm: 6,
          md: 4
        }, [
          React.createElement(Typography, {
            key: "equity-label",
            variant: "body2",
            color: "text.secondary"
          }, "Equity"),
          React.createElement(Typography, {
            key: "equity-value",
            variant: "body1"
          }, `$${mt5Store.account.equity.toFixed(2)}`)
        ]),
        
        // Margin
        React.createElement(Grid, {
          key: "margin-grid",
          item: true,
          xs: 12,
          sm: 6,
          md: 4
        }, [
          React.createElement(Typography, {
            key: "margin-label",
            variant: "body2",
            color: "text.secondary"
          }, "Margin"),
          React.createElement(Typography, {
            key: "margin-value",
            variant: "body1"
          }, `$${mt5Store.account.margin.toFixed(2)}`)
        ]),
        
        // Free Margin
        React.createElement(Grid, {
          key: "free-margin-grid",
          item: true,
          xs: 12,
          sm: 6,
          md: 4
        }, [
          React.createElement(Typography, {
            key: "free-margin-label",
            variant: "body2",
            color: "text.secondary"
          }, "Free Margin"),
          React.createElement(Typography, {
            key: "free-margin-value",
            variant: "body1"
          }, `$${mt5Store.account.freeMargin.toFixed(2)}`)
        ]),
        
        // Margin Level
        React.createElement(Grid, {
          key: "margin-level-grid",
          item: true,
          xs: 12,
          sm: 6,
          md: 4
        }, [
          React.createElement(Typography, {
            key: "margin-level-label",
            variant: "body2",
            color: "text.secondary"
          }, "Margin Level"),
          React.createElement(Typography, {
            key: "margin-level-value",
            variant: "body1"
          }, `${mt5Store.account.marginLevel.toFixed(2)}%`)
        ]),
        
        // Leverage
        React.createElement(Grid, {
          key: "leverage-grid",
          item: true,
          xs: 12,
          sm: 6,
          md: 4
        }, [
          React.createElement(Typography, {
            key: "leverage-label",
            variant: "body2",
            color: "text.secondary"
          }, "Leverage"),
          React.createElement(Typography, {
            key: "leverage-value",
            variant: "body1"
          }, `1:${mt5Store.account.leverage}`)
        ])
      ]),
      
      // Chart button
      React.createElement(Box, {
        key: "chart-button-box",
        sx: { display: 'flex', justifyContent: 'flex-end', mt: 2 }
      }, 
        React.createElement(Button, {
          variant: "outlined",
          startIcon: React.createElement(ChartIcon),
          onClick: () => handleChartOpen(mt5Store.account.login)
        }, "Open Chart")
      )
    ]);
  };

  // Create the positions table
  const createPositionsTable = () => {
    if (!mt5Store.isConnected || !mt5Store.positions || mt5Store.positions.length === 0) return null;
    
    return React.createElement(Paper, {
      sx: { p: 3, mb: 3 }
    }, [
      React.createElement(Typography, {
        key: "positions-title",
        variant: "h6",
        gutterBottom: true
      }, "Open Positions"),
      
      React.createElement(TableContainer, {
        key: "positions-table-container"
      }, 
        React.createElement(Table, {
          size: "small"
        }, [
          React.createElement(TableHead, {
            key: "positions-table-head"
          }, 
            React.createElement(TableRow, null, [
              React.createElement(TableCell, { key: "ticket" }, "Ticket"),
              React.createElement(TableCell, { key: "symbol" }, "Symbol"),
              React.createElement(TableCell, { key: "type" }, "Type"),
              React.createElement(TableCell, { key: "volume" }, "Volume"),
              React.createElement(TableCell, { key: "open-price" }, "Open Price"),
              React.createElement(TableCell, { key: "current-price" }, "Current Price"),
              React.createElement(TableCell, { key: "sl" }, "SL"),
              React.createElement(TableCell, { key: "tp" }, "TP"),
              React.createElement(TableCell, { key: "profit" }, "Profit"),
              React.createElement(TableCell, { key: "actions" }, "Actions")
            ])
          ),
          
          React.createElement(TableBody, {
            key: "positions-table-body"
          }, 
            mt5Store.positions.map(position => 
              React.createElement(TableRow, {
                key: position.ticket
              }, [
                React.createElement(TableCell, { key: `ticket-${position.ticket}` }, position.ticket),
                React.createElement(TableCell, { key: `symbol-${position.ticket}` }, position.symbol),
                React.createElement(TableCell, { key: `type-${position.ticket}` }, 
                  React.createElement(Chip, {
                    label: position.type,
                    color: position.type === 'buy' ? 'success' : 'error',
                    size: "small"
                  })
                ),
                React.createElement(TableCell, { key: `volume-${position.ticket}` }, position.volume.toFixed(2)),
                React.createElement(TableCell, { key: `open-price-${position.ticket}` }, position.openPrice.toFixed(5)),
                React.createElement(TableCell, { key: `current-price-${position.ticket}` }, position.currentPrice.toFixed(5)),
                React.createElement(TableCell, { key: `sl-${position.ticket}` }, position.stopLoss ? position.stopLoss.toFixed(5) : '-'),
                React.createElement(TableCell, { key: `tp-${position.ticket}` }, position.takeProfit ? position.takeProfit.toFixed(5) : '-'),
                React.createElement(TableCell, { key: `profit-${position.ticket}` }, 
                  React.createElement(Typography, {
                    color: position.profit >= 0 ? 'success.main' : 'error.main'
                  }, `$${position.profit.toFixed(2)}`)
                ),
                React.createElement(TableCell, { key: `actions-${position.ticket}` }, 
                  React.createElement(Stack, {
                    direction: "row",
                    spacing: 1
                  }, [
                    React.createElement(Tooltip, {
                      key: `edit-tooltip-${position.ticket}`,
                      title: "Modify Position"
                    }, 
                      React.createElement(IconButton, {
                        size: "small",
                        onClick: () => {
                          setSelectedPosition(position);
                          setOrderFormData({
                            ...orderFormData,
                            stopLoss: position.stopLoss,
                            takeProfit: position.takeProfit
                          });
                          setModifyPositionOpen(true);
                        }
                      }, 
                        React.createElement(EditIcon, { fontSize: "small" })
                      )
                    ),
                    
                    React.createElement(Tooltip, {
                      key: `close-tooltip-${position.ticket}`,
                      title: "Close Position"
                    }, 
                      React.createElement(IconButton, {
                        size: "small",
                        onClick: () => handleClosePosition(position)
                      }, 
                        React.createElement(CloseIcon, { fontSize: "small" })
                      )
                    )
                  ])
                )
              ])
            )
          )
        ])
      )
    ]);
  };

  // Create the orders table
  const createOrdersTable = () => {
    if (!mt5Store.isConnected || !mt5Store.orders || mt5Store.orders.length === 0) return null;
    
    return React.createElement(Paper, {
      sx: { p: 3, mb: 3 }
    }, [
      React.createElement(Typography, {
        key: "orders-title",
        variant: "h6",
        gutterBottom: true
      }, "Pending Orders"),
      
      React.createElement(TableContainer, {
        key: "orders-table-container"
      }, 
        React.createElement(Table, {
          size: "small"
        }, [
          React.createElement(TableHead, {
            key: "orders-table-head"
          }, 
            React.createElement(TableRow, null, [
              React.createElement(TableCell, { key: "ticket" }, "Ticket"),
              React.createElement(TableCell, { key: "symbol" }, "Symbol"),
              React.createElement(TableCell, { key: "type" }, "Type"),
              React.createElement(TableCell, { key: "volume" }, "Volume"),
              React.createElement(TableCell, { key: "price" }, "Price"),
              React.createElement(TableCell, { key: "sl" }, "SL"),
              React.createElement(TableCell, { key: "tp" }, "TP"),
              React.createElement(TableCell, { key: "actions" }, "Actions")
            ])
          ),
          
          React.createElement(TableBody, {
            key: "orders-table-body"
          }, 
            mt5Store.orders.map(order => 
              React.createElement(TableRow, {
                key: order.ticket
              }, [
                React.createElement(TableCell, { key: `ticket-${order.ticket}` }, order.ticket),
                React.createElement(TableCell, { key: `symbol-${order.ticket}` }, order.symbol),
                React.createElement(TableCell, { key: `type-${order.ticket}` }, 
                  React.createElement(Chip, {
                    label: order.type,
                    color: order.type.includes('buy') ? 'success' : 'error',
                    size: "small"
                  })
                ),
                React.createElement(TableCell, { key: `volume-${order.ticket}` }, order.volume.toFixed(2)),
                React.createElement(TableCell, { key: `price-${order.ticket}` }, order.price.toFixed(5)),
                React.createElement(TableCell, { key: `sl-${order.ticket}` }, order.stopLoss ? order.stopLoss.toFixed(5) : '-'),
                React.createElement(TableCell, { key: `tp-${order.ticket}` }, order.takeProfit ? order.takeProfit.toFixed(5) : '-'),
                React.createElement(TableCell, { key: `actions-${order.ticket}` }, 
                  React.createElement(Tooltip, {
                    title: "Cancel Order"
                  }, 
                    React.createElement(IconButton, {
                      size: "small",
                      onClick: () => handleCancelOrder(order.ticket)
                    }, 
                      React.createElement(DeleteIcon, { fontSize: "small" })
                    )
                  )
                )
              ])
            )
          )
        ])
      )
    ]);
  };

  // Create the new order button
  const createNewOrderButton = () => {
    if (!mt5Store.isConnected) return null;
    
    return React.createElement(Box, {
      sx: { display: 'flex', justifyContent: 'flex-end', mb: 3 }
    }, 
      React.createElement(Button, {
        variant: "contained",
        startIcon: React.createElement(AddIcon),
        onClick: () => {
          setOrderFormData(defaultOrderFormData);
          setOrderFormOpen(true);
        }
      }, "New Order")
    );
  };

  // Create the order form dialog
  const createOrderFormDialog = () => {
    return React.createElement(Dialog, {
      open: orderFormOpen,
      onClose: () => setOrderFormOpen(false),
      maxWidth: "sm",
      fullWidth: true
    }, [
      React.createElement(DialogTitle, {
        key: "order-form-title"
      }, "Place New Order"),
      
      React.createElement(DialogContent, {
        key: "order-form-content"
      }, 
        React.createElement(Box, {
          sx: { pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }
        }, [
          React.createElement(TextField, {
            key: "symbol-field",
            label: "Symbol",
            value: orderFormData.symbol,
            onChange: (e) => setOrderFormData({ ...orderFormData, symbol: e.target.value })
          }),
          
          React.createElement(TextField, {
            key: "type-field",
            label: "Type",
            select: true,
            value: orderFormData.type,
            onChange: (e) => setOrderFormData({ ...orderFormData, type: e.target.value })
          }, [
            React.createElement(MenuItem, { key: "buy", value: "buy" }, "Buy"),
            React.createElement(MenuItem, { key: "sell", value: "sell" }, "Sell")
          ]),
          
          React.createElement(TextField, {
            key: "volume-field",
            label: "Volume",
            type: "number",
            value: orderFormData.volume,
            onChange: (e) => setOrderFormData({ ...orderFormData, volume: parseFloat(e.target.value) })
          }),
          
          React.createElement(TextField, {
            key: "price-field",
            label: "Price",
            type: "number",
            value: orderFormData.price,
            onChange: (e) => setOrderFormData({ ...orderFormData, price: parseFloat(e.target.value) })
          }),
          
          React.createElement(TextField, {
            key: "sl-field",
            label: "Stop Loss",
            type: "number",
            value: orderFormData.stopLoss || '',
            onChange: (e) => setOrderFormData({ ...orderFormData, stopLoss: e.target.value ? parseFloat(e.target.value) : null })
          }),
          
          React.createElement(TextField, {
            key: "tp-field",
            label: "Take Profit",
            type: "number",
            value: orderFormData.takeProfit || '',
            onChange: (e) => setOrderFormData({ ...orderFormData, takeProfit: e.target.value ? parseFloat(e.target.value) : null })
          }),
          
          React.createElement(TextField, {
            key: "comment-field",
            label: "Comment",
            value: orderFormData.comment,
            onChange: (e) => setOrderFormData({ ...orderFormData, comment: e.target.value })
          })
        ])
      ),
      
      React.createElement(DialogActions, {
        key: "order-form-actions"
      }, [
        React.createElement(Button, {
          key: "cancel-button",
          onClick: () => setOrderFormOpen(false)
        }, "Cancel"),
        
        React.createElement(Button, {
          key: "place-order-button",
          onClick: handlePlaceOrder,
          variant: "contained"
        }, "Place Order")
      ])
    ]);
  };

  // Create the modify position dialog
  const createModifyPositionDialog = () => {
    return React.createElement(Dialog, {
      open: modifyPositionOpen,
      onClose: () => setModifyPositionOpen(false),
      maxWidth: "sm",
      fullWidth: true
    }, [
      React.createElement(DialogTitle, {
        key: "modify-position-title"
      }, "Modify Position"),
      
      React.createElement(DialogContent, {
        key: "modify-position-content"
      }, 
        React.createElement(Box, {
          sx: { pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }
        }, [
          React.createElement(TextField, {
            key: "sl-field",
            label: "Stop Loss",
            type: "number",
            value: orderFormData.stopLoss || '',
            onChange: (e) => setOrderFormData({ ...orderFormData, stopLoss: e.target.value ? parseFloat(e.target.value) : null })
          }),
          
          React.createElement(TextField, {
            key: "tp-field",
            label: "Take Profit",
            type: "number",
            value: orderFormData.takeProfit || '',
            onChange: (e) => setOrderFormData({ ...orderFormData, takeProfit: e.target.value ? parseFloat(e.target.value) : null })
          })
        ])
      ),
      
      React.createElement(DialogActions, {
        key: "modify-position-actions"
      }, [
        React.createElement(Button, {
          key: "cancel-button",
          onClick: () => setModifyPositionOpen(false)
        }, "Cancel"),
        
        React.createElement(Button, {
          key: "modify-button",
          onClick: handleModifyPosition,
          variant: "contained"
        }, "Modify Position")
      ])
    ]);
  };

  // Create the chart dialog
  const createChartDialog = () => {
    return React.createElement(Dialog, {
      open: !!selectedChartAccount,
      onClose: handleChartClose,
      maxWidth: "lg",
      fullWidth: true,
      "aria-labelledby": "chart-dialog-title",
      disableEnforceFocus: false,
      disableAutoFocus: false,
      keepMounted: false,
      disablePortal: false,
      disableScrollLock: false
    }, 
      React.createElement(DialogContent, {
        sx: { p: 0, height: '80vh' }
      }, 
        selectedChartAccount && React.createElement(MT5Chart, {
          symbol: selectedSymbol || 'EURUSD',
          accountNumber: selectedChartAccount,
          onClose: handleChartClose
        })
      )
    );
  };

  // Create the symbol selection dialog
  const createSymbolSelectionDialog = () => {
    return React.createElement(Dialog, {
      open: symbolSelectOpen,
      onClose: () => setSymbolSelectOpen(false)
    }, [
      React.createElement(DialogTitle, {
        key: "symbol-select-title"
      }, "Select Symbol"),
      
      React.createElement(DialogContent, {
        key: "symbol-select-content"
      }, 
        React.createElement(List, null, 
          ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCHF', 'USDCAD', 'NZDUSD'].map((symbol) => 
            React.createElement(ListItem, {
              key: symbol,
              button: true,
              onClick: () => {
                setSelectedSymbol(symbol);
                setSymbolSelectOpen(false);
                setChartOpen(true);
              }
            }, 
              React.createElement(ListItemText, {
                primary: symbol
              })
            )
          )
        )
      )
    ]);
  };

  // Main render
  return React.createElement(Box, {
    sx: { p: 3 }
  }, [
    React.createElement('div', { key: 'connection-form' }, createConnectionForm()),
    React.createElement('div', { key: 'account-info' }, createAccountInfo()),
    React.createElement('div', { key: 'new-order-button' }, createNewOrderButton()),
    React.createElement('div', { key: 'positions-table' }, createPositionsTable()),
    React.createElement('div', { key: 'orders-table' }, createOrdersTable()),
    React.createElement('div', { key: 'order-form-dialog' }, createOrderFormDialog()),
    React.createElement('div', { key: 'modify-position-dialog' }, createModifyPositionDialog()),
    React.createElement('div', { key: 'chart-dialog' }, createChartDialog()),
    React.createElement('div', { key: 'symbol-selection-dialog' }, createSymbolSelectionDialog())
  ]);
};

export default MT5Page;
