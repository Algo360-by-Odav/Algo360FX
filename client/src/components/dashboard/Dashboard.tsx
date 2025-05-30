import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import TradingChart from '../trading/TradingChart';
import OrderBook from '../trading/OrderBook';
import { useStores } from '../../stores/StoreProvider';

const Dashboard: React.FC = observer(() => {
  const { tradingStore } = useStores();

  if (!tradingStore) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ py: 2 }}>
      {/* Account Summary */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">Balance</Typography>
            <Typography variant="h6">$150,000.00</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">Equity</Typography>
            <Typography variant="h6">$150,000.00</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Profit/Loss</Typography>
                <Typography variant="h6" color="success.main">+$50.00 (0.03%)</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Open Positions</Typography>
                <Typography variant="h6" align="right">0</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Chart Section */}
      <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default', minHeight: '500px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">
            {tradingStore.selectedSymbol} Chart
          </Typography>
        </Box>
        <Box sx={{ height: '400px', width: '100%', position: 'relative' }}>
          <TradingChart />
        </Box>
      </Paper>

      {/* Market Info and Order Book */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="h6" gutterBottom>Market Info</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell align="right">Last</TableCell>
                    <TableCell align="right">Change</TableCell>
                    <TableCell align="right">High</TableCell>
                    <TableCell align="right">Low</TableCell>
                    <TableCell align="right">Volume</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{tradingStore.selectedSymbol}</TableCell>
                    <TableCell align="right">1.09215</TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>+0.00123 (0.11%)</TableCell>
                    <TableCell align="right">1.09324</TableCell>
                    <TableCell align="right">1.09102</TableCell>
                    <TableCell align="right">12,345</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: 'background.default', height: '100%' }}>
            <Typography variant="h6" gutterBottom>Order Book</Typography>
            <OrderBook symbol={tradingStore.selectedSymbol} />
          </Paper>
        </Grid>
      </Grid>

      {/* Open Positions */}
      <Paper sx={{ p: 2, mt: 2, bgcolor: 'background.default' }}>
        <Typography variant="h6" gutterBottom>Open Positions</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Symbol</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Size</TableCell>
                <TableCell align="right">Entry Price</TableCell>
                <TableCell align="right">Current Price</TableCell>
                <TableCell align="right">P/L</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tradingStore.positions.map((position) => (
                <TableRow key={`${position.symbol}-${position.side}`}>
                  <TableCell>{position.symbol}</TableCell>
                  <TableCell>{position.side}</TableCell>
                  <TableCell align="right">{position.quantity}</TableCell>
                  <TableCell align="right">{position.entryPrice.toFixed(5)}</TableCell>
                  <TableCell align="right">{position.currentPrice.toFixed(5)}</TableCell>
                  <TableCell align="right" sx={{ 
                    color: position.pnl >= 0 ? 'success.main' : 'error.main' 
                  }}>
                    {position.pnl.toFixed(2)} ({position.pnlPercentage.toFixed(2)}%)
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => tradingStore.closePosition(position.symbol)}
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
    </Container>
  );
});

export default Dashboard;

