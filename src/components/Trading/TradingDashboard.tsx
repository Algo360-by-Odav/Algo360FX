import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTradingStore } from '@/hooks/useTradingStore';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import TradingViewChart from '@components/Trading/TradingViewChart';
import { formatCurrency, formatNumber, formatPrice } from '@/utils/formatters';
import WebSocketService from '@/services/websocketService';
import SymbolSelector from '@components/Trading/SymbolSelector';
import OrderEntry from '@components/Trading/OrderEntry';

const TradingDashboard = observer(() => {
  const tradingStore = useTradingStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');

  useEffect(() => {
    // Initialize trading store if not already initialized
    if (!tradingStore.isInitialized) {
      tradingStore.initializeDefaultState();
    }

    const ws = WebSocketService;
    ws.emit('subscribe_market_data', selectedSymbol);
    ws.emit('get_positions');
    ws.emit('get_account_info');

    return () => {
      ws.emit('unsubscribe_market_data', selectedSymbol);
    };
  }, [selectedSymbol, tradingStore]);

  const handleSymbolChange = (symbol: string) => {
    setSelectedSymbol(symbol);
  };

  // Get market data safely
  const marketData = tradingStore.marketData?.get(selectedSymbol);
  const bid = marketData?.bid || 0;
  const ask = marketData?.ask || 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        {/* Symbol Selector */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <SymbolSelector
              selectedSymbol={selectedSymbol}
              onSymbolChange={handleSymbolChange}
            />
          </Paper>
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '500px' }}>
            <TradingViewChart symbol={selectedSymbol} />
          </Paper>
        </Grid>

        {/* Order Entry */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '500px' }}>
            <OrderEntry symbol={selectedSymbol} bid={bid} ask={ask} />
          </Paper>
        </Grid>

        {/* Positions and Orders */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Open Positions
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Entry Price</TableCell>
                    <TableCell>Current Price</TableCell>
                    <TableCell>P/L</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.from(tradingStore.positions.values()).map((position) => (
                    <TableRow key={position.id}>
                      <TableCell>{position.symbol}</TableCell>
                      <TableCell>{position.type}</TableCell>
                      <TableCell>{formatNumber(position.volume)}</TableCell>
                      <TableCell>{formatPrice(position.openPrice)}</TableCell>
                      <TableCell>{formatPrice(position.currentPrice)}</TableCell>
                      <TableCell>{formatCurrency(position.profit)}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => tradingStore.closePosition(position.id)}
                        >
                          Close
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default TradingDashboard;
