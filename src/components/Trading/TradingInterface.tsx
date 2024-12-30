import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTradingStore } from '../../stores/TradingStore';
import { OrderSide, OrderType } from '../../services/trading';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`trading-tabpanel-${index}`}
      aria-labelledby={`trading-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const TradingInterface: React.FC = observer(() => {
  const tradingStore = useTradingStore();
  const [activeTab, setActiveTab] = useState(0);
  const [symbol, setSymbol] = useState('');
  const [side, setSide] = useState<OrderSide>(OrderSide.BUY);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');

  useEffect(() => {
    tradingStore.loadOpenOrders();
    tradingStore.loadPositions();
  }, [tradingStore]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!symbol || !quantity) return;

    try {
      switch (activeTab) {
        case 0: // Market
          await tradingStore.placeMarketOrder(
            symbol,
            side,
            parseFloat(quantity)
          );
          break;
        case 1: // Limit
          if (!price) return;
          await tradingStore.placeLimitOrder(
            symbol,
            side,
            parseFloat(quantity),
            parseFloat(price)
          );
          break;
        case 2: // Stop
          if (!stopPrice) return;
          await tradingStore.placeStopOrder(
            symbol,
            side,
            parseFloat(quantity),
            parseFloat(stopPrice)
          );
          break;
        case 3: // Stop Limit
          if (!price || !stopPrice) return;
          await tradingStore.placeStopLimitOrder(
            symbol,
            side,
            parseFloat(quantity),
            parseFloat(price),
            parseFloat(stopPrice)
          );
          break;
      }

      // Clear form
      setQuantity('');
      setPrice('');
      setStopPrice('');
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Order Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#1F2937' }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
              Place Order
            </Typography>

            {tradingStore.error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {tradingStore.error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{
                  mb: 3,
                  '& .MuiTab-root': { color: 'rgba(255, 255, 255, 0.7)' },
                  '& .Mui-selected': { color: '#2196f3' },
                }}
              >
                <Tab label="Market" />
                <Tab label="Limit" />
                <Tab label="Stop" />
                <Tab label="Stop Limit" />
              </Tabs>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                    required
                    sx={{ mb: 2 }}
                    InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                    InputProps={{ sx: { color: 'white' } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Side
                    </InputLabel>
                    <Select
                      value={side}
                      onChange={(e) => setSide(e.target.value as OrderSide)}
                      label="Side"
                      sx={{ color: 'white' }}
                    >
                      <MenuItem value={OrderSide.BUY}>Buy</MenuItem>
                      <MenuItem value={OrderSide.SELL}>Sell</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    sx={{ mb: 2 }}
                    InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                    InputProps={{ sx: { color: 'white' } }}
                  />
                </Grid>

                {(activeTab === 1 || activeTab === 3) && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      sx={{ mb: 2 }}
                      InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                      InputProps={{ sx: { color: 'white' } }}
                    />
                  </Grid>
                )}

                {(activeTab === 2 || activeTab === 3) && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Stop Price"
                      type="number"
                      value={stopPrice}
                      onChange={(e) => setStopPrice(e.target.value)}
                      required
                      sx={{ mb: 2 }}
                      InputLabelProps={{ sx: { color: 'rgba(255, 255, 255, 0.7)' } }}
                      InputProps={{ sx: { color: 'white' } }}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={tradingStore.loading}
                    sx={{
                      mt: 2,
                      backgroundColor: side === OrderSide.BUY ? '#4CAF50' : '#f44336',
                      '&:hover': {
                        backgroundColor:
                          side === OrderSide.BUY ? '#388E3C' : '#d32f2f',
                      },
                    }}
                  >
                    {tradingStore.loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      `Place ${side} Order`
                    )}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Open Orders */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, backgroundColor: '#1F2937' }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
              Open Orders
            </Typography>
            {tradingStore.orders.map((order) => (
              <Paper
                key={order.id}
                sx={{
                  p: 2,
                  mb: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={8}>
                    <Typography sx={{ color: 'white' }}>
                      {order.symbol} - {order.type}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          order.side === OrderSide.BUY
                            ? '#4CAF50'
                            : '#f44336',
                      }}
                    >
                      {order.side} {order.quantity} @ {order.price || 'MARKET'}
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: 'right' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => tradingStore.cancelOrder(order.id)}
                    >
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            {tradingStore.orders.length === 0 && (
              <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                No open orders
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Positions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, backgroundColor: '#1F2937' }}>
            <Typography variant="h6" sx={{ mb: 3, color: 'white' }}>
              Positions
            </Typography>
            <Grid container spacing={2}>
              {tradingStore.positions.map((position) => (
                <Grid item xs={12} md={6} lg={4} key={position.symbol}>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={8}>
                        <Typography sx={{ color: 'white' }}>
                          {position.symbol}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              position.unrealizedPnL >= 0
                                ? '#4CAF50'
                                : '#f44336',
                          }}
                        >
                          P&L: ${position.unrealizedPnL.toFixed(2)}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {position.quantity} @ {position.averagePrice}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'right' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => tradingStore.closePosition(position.symbol)}
                        >
                          Close
                        </Button>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
              {tradingStore.positions.length === 0 && (
                <Grid item xs={12}>
                  <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                    No open positions
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default TradingInterface;
