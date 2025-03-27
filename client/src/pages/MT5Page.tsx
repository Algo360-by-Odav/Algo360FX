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
import { useStores } from '../stores/StoreProvider';
import { MT5Position } from '@/stores/mt5Store';
import MT5Chart from '@/components/mt5/MT5Chart';

interface OrderFormData {
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  price: number;
  stopLoss: number | null;
  takeProfit: number | null;
  comment: string;
}

const defaultOrderFormData: OrderFormData = {
  symbol: 'EURUSD',
  type: 'buy',
  volume: 0.1,
  price: 0,
  stopLoss: null,
  takeProfit: null,
  comment: '',
};

const MT5Page: React.FC = () => {
  const { mt5Store } = useStores();
  const [accountId, setAccountId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [orderFormOpen, setOrderFormOpen] = useState(false);
  const [orderFormData, setOrderFormData] = useState<OrderFormData>(defaultOrderFormData);
  const [selectedPosition, setSelectedPosition] = useState<MT5Position | null>(null);
  const [modifyPositionOpen, setModifyPositionOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [symbolSelectOpen, setSymbolSelectOpen] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('EURUSD');
  const [selectedChartAccount, setSelectedChartAccount] = useState<number | null>(null);

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
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (login: number) => {
    try {
      setLoading(true);
      setError(null);
      await mt5Store.disconnect(login);
    } catch (err) {
      setError((err as Error).message);
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
      setError((err as Error).message);
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
      setError((err as Error).message);
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
      setError((err as Error).message);
    }
  };

  const handleClosePosition = async (position: MT5Position) => {
    try {
      setError(null);
      const success = await mt5Store.closePosition(position.symbol);
      if (success) {
        handleRefresh();
      } else {
        setError('Failed to close position');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleCancelOrder = async (ticket: number) => {
    try {
      setError(null);
      const success = await mt5Store.cancelOrder(ticket);
      if (success) {
        handleRefresh();
      } else {
        setError('Failed to cancel order');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleChartOpen = (accountNumber: number) => {
    setSelectedChartAccount(accountNumber);
    setChartOpen(true);
  };

  const handleChartClose = () => {
    setChartOpen(false);
    setSelectedChartAccount(null);
  };

  if (!mt5Store.isConnected) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Connect to MT5
          </Typography>
          <Box component="form" sx={{ '& > *': { mb: 2 } }}>
            <TextField
              fullWidth
              label="Account ID"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleConnect}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Connect'}
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">MT5 Account Information</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<ChartIcon />}
            onClick={() => setChartOpen(true)}
            sx={{ mr: 2 }}
          >
            View Chart
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setOrderFormData(defaultOrderFormData);
              setOrderFormOpen(true);
            }}
            sx={{ mr: 2 }}
          >
            New Order
          </Button>
          <IconButton onClick={handleRefresh} disabled={loading} sx={{ mr: 1 }}>
            <RefreshIcon />
          </IconButton>
          <Button variant="outlined" color="error" onClick={handleDisconnect} disabled={loading}>
            Disconnect
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading && !mt5Store.accountInfo ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Account Overview
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ '& > *': { mb: 2 } }}>
                <Typography>
                  <strong>Balance:</strong> ${mt5Store.accountInfo?.balance.toFixed(2)}
                </Typography>
                <Typography>
                  <strong>Equity:</strong> ${mt5Store.accountInfo?.equity.toFixed(2)}
                </Typography>
                <Typography>
                  <strong>Margin:</strong> ${mt5Store.accountInfo?.margin.toFixed(2)}
                </Typography>
                <Typography>
                  <strong>Free Margin:</strong> ${mt5Store.accountInfo?.freeMargin.toFixed(2)}
                </Typography>
                <Typography>
                  <strong>Margin Level:</strong> {mt5Store.accountInfo?.marginLevel.toFixed(2)}%
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Open Positions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Symbol</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Volume</TableCell>
                      <TableCell align="right">Open Price</TableCell>
                      <TableCell align="right">Current Price</TableCell>
                      <TableCell align="right">Stop Loss</TableCell>
                      <TableCell align="right">Take Profit</TableCell>
                      <TableCell align="right">Profit</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mt5Store.accountInfo?.positions.map((position) => (
                      <TableRow key={position.symbol}>
                        <TableCell>{position.symbol}</TableCell>
                        <TableCell>
                          <Chip
                            label={position.type}
                            color={position.type === 'buy' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">{position.volume}</TableCell>
                        <TableCell align="right">{position.openPrice}</TableCell>
                        <TableCell align="right">{position.currentPrice}</TableCell>
                        <TableCell align="right">{position.stopLoss || '-'}</TableCell>
                        <TableCell align="right">{position.takeProfit || '-'}</TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: position.profit >= 0 ? 'success.main' : 'error.main',
                          }}
                        >
                          ${position.profit}
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleChartOpen(position.accountNumber)}
                              startIcon={<ChartIcon />}
                              color="primary"
                              sx={{
                                minWidth: '120px',
                                borderRadius: 2,
                                textTransform: 'none',
                                '&:hover': {
                                  background: (theme) => theme.palette.primary.dark,
                                }
                              }}
                            >
                              View Chart
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleClosePosition(position)}
                              startIcon={<CloseIcon />}
                              color="error"
                            >
                              Close Position
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => {
                                setSelectedPosition(position);
                                setOrderFormData({
                                  ...defaultOrderFormData,
                                  symbol: position.symbol,
                                  stopLoss: position.stopLoss,
                                  takeProfit: position.takeProfit,
                                });
                                setModifyPositionOpen(true);
                              }}
                              startIcon={<EditIcon />}
                            >
                              Modify
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Pending Orders
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ticket</TableCell>
                      <TableCell>Symbol</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Volume</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">Stop Loss</TableCell>
                      <TableCell align="right">Take Profit</TableCell>
                      <TableCell>Comment</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mt5Store.accountInfo?.orders.map((order) => (
                      <TableRow key={order.ticket}>
                        <TableCell>{order.ticket}</TableCell>
                        <TableCell>{order.symbol}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.type}
                            color={order.type === 'buy' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">{order.volume}</TableCell>
                        <TableCell align="right">{order.openPrice}</TableCell>
                        <TableCell align="right">{order.stopLoss || '-'}</TableCell>
                        <TableCell align="right">{order.takeProfit || '-'}</TableCell>
                        <TableCell>{order.comment}</TableCell>
                        <TableCell align="right">
                          <Tooltip title="Cancel">
                            <IconButton
                              size="small"
                              onClick={() => handleCancelOrder(order.ticket)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* New Order Dialog */}
      <Dialog open={orderFormOpen} onClose={() => setOrderFormOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Order</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Symbol"
              value={orderFormData.symbol}
              onChange={(e) => setOrderFormData({ ...orderFormData, symbol: e.target.value })}
            />
            <TextField
              label="Type"
              select
              value={orderFormData.type}
              onChange={(e) => setOrderFormData({ ...orderFormData, type: e.target.value as 'buy' | 'sell' })}
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </TextField>
            <TextField
              label="Volume"
              type="number"
              value={orderFormData.volume}
              onChange={(e) => setOrderFormData({ ...orderFormData, volume: parseFloat(e.target.value) })}
            />
            <TextField
              label="Price"
              type="number"
              value={orderFormData.price}
              onChange={(e) => setOrderFormData({ ...orderFormData, price: parseFloat(e.target.value) })}
            />
            <TextField
              label="Stop Loss"
              type="number"
              value={orderFormData.stopLoss || ''}
              onChange={(e) => setOrderFormData({ ...orderFormData, stopLoss: e.target.value ? parseFloat(e.target.value) : null })}
            />
            <TextField
              label="Take Profit"
              type="number"
              value={orderFormData.takeProfit || ''}
              onChange={(e) => setOrderFormData({ ...orderFormData, takeProfit: e.target.value ? parseFloat(e.target.value) : null })}
            />
            <TextField
              label="Comment"
              value={orderFormData.comment}
              onChange={(e) => setOrderFormData({ ...orderFormData, comment: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderFormOpen(false)}>Cancel</Button>
          <Button onClick={handlePlaceOrder} variant="contained">
            Place Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modify Position Dialog */}
      <Dialog open={modifyPositionOpen} onClose={() => setModifyPositionOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modify Position</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Stop Loss"
              type="number"
              value={orderFormData.stopLoss || ''}
              onChange={(e) => setOrderFormData({ ...orderFormData, stopLoss: e.target.value ? parseFloat(e.target.value) : null })}
            />
            <TextField
              label="Take Profit"
              type="number"
              value={orderFormData.takeProfit || ''}
              onChange={(e) => setOrderFormData({ ...orderFormData, takeProfit: e.target.value ? parseFloat(e.target.value) : null })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModifyPositionOpen(false)}>Cancel</Button>
          <Button onClick={handleModifyPosition} variant="contained">
            Modify Position
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chart Dialog */}
      <Dialog
        open={!!selectedChartAccount}
        onClose={handleChartClose}
        maxWidth="lg"
        fullWidth
        aria-labelledby="chart-dialog-title"
        disableEnforceFocus={false}
        disableAutoFocus={false}
        keepMounted={false}
        disablePortal={false}
        disableScrollLock={false}
      >
        <DialogContent sx={{ p: 0, height: '80vh' }}>
          {selectedChartAccount && (
            <MT5Chart
              symbol={selectedSymbol || 'EURUSD'}
              accountNumber={selectedChartAccount}
              onClose={handleChartClose}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Symbol Selection Dialog */}
      <Dialog open={symbolSelectOpen} onClose={() => setSymbolSelectOpen(false)}>
        <DialogTitle>Select Symbol</DialogTitle>
        <DialogContent>
          <List>
            {['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCHF', 'USDCAD', 'NZDUSD'].map((symbol) => (
              <ListItem
                key={symbol}
                button
                onClick={() => {
                  setSelectedSymbol(symbol);
                  setSymbolSelectOpen(false);
                  setChartOpen(true);
                }}
              >
                <ListItemText primary={symbol} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MT5Page;

