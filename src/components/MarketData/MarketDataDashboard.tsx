import React from 'react';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/RootStoreContext';
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
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';

const MarketDataDashboard = observer(() => {
  const rootStore = useRootStore();
  const { marketStore } = rootStore;

  const mockMarketData = [
    { symbol: 'EUR/USD', bid: 1.0921, ask: 1.0923, change: 0.05, volume: 125000 },
    { symbol: 'GBP/USD', bid: 1.2645, ask: 1.2647, change: -0.12, volume: 98000 },
    { symbol: 'USD/JPY', bid: 142.35, ask: 142.37, change: 0.25, volume: 156000 },
    { symbol: 'AUD/USD', bid: 0.6721, ask: 0.6723, change: -0.08, volume: 78000 },
    { symbol: 'USD/CAD', bid: 1.3245, ask: 1.3247, change: 0.15, volume: 89000 },
  ];

  const marketIndices = [
    { name: 'US Dollar Index', value: 102.45, change: 0.15 },
    { name: 'VIX', value: 15.5, change: -0.8 },
    { name: 'Gold', value: 1975.30, change: 5.20 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Market Data
      </Typography>

      <Grid container spacing={3}>
        {/* Market Indices */}
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {marketIndices.map((index) => (
              <Grid item xs={12} md={4} key={index.name}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      {index.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h4">
                        {index.value.toFixed(2)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: index.change >= 0 ? 'success.main' : 'error.main' }}>
                        {index.change >= 0 ? <TrendingUp /> : <TrendingDown />}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {index.change >= 0 ? '+' : ''}{index.change}%
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Market Data Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Currency Pairs
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Symbol</TableCell>
                      <TableCell align="right">Bid</TableCell>
                      <TableCell align="right">Ask</TableCell>
                      <TableCell align="right">Spread</TableCell>
                      <TableCell align="right">Change %</TableCell>
                      <TableCell align="right">Volume</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockMarketData.map((pair) => (
                      <TableRow key={pair.symbol}>
                        <TableCell>{pair.symbol}</TableCell>
                        <TableCell align="right">{pair.bid.toFixed(4)}</TableCell>
                        <TableCell align="right">{pair.ask.toFixed(4)}</TableCell>
                        <TableCell align="right">{((pair.ask - pair.bid) * 10000).toFixed(1)}</TableCell>
                        <TableCell 
                          align="right"
                          sx={{ 
                            color: pair.change >= 0 ? 'success.main' : 'error.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
                          }}
                        >
                          {pair.change >= 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                          {pair.change >= 0 ? '+' : ''}{pair.change}%
                        </TableCell>
                        <TableCell align="right">{pair.volume.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Market Depth */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Market Depth - EUR/USD
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  Market depth chart will be implemented here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Price Chart */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Price Chart - EUR/USD
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  Price chart will be implemented here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

export default MarketDataDashboard;
