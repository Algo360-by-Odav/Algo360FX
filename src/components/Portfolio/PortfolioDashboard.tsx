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
  AccountBalance,
  Assessment,
  ShowChart,
} from '@mui/icons-material';

const PortfolioDashboard = observer(() => {
  const rootStore = useRootStore();
  const { portfolioStore } = rootStore;

  const portfolioSummary = {
    totalEquity: 1000000,
    dailyPnL: 2500,
    openPositions: 5,
    marginUsed: 25000,
    marginAvailable: 975000,
    marginLevel: 97.5,
  };

  const positions = [
    { symbol: 'EUR/USD', size: 100000, entryPrice: 1.0915, currentPrice: 1.0921, pnl: 60, margin: 10000 },
    { symbol: 'GBP/USD', size: -50000, entryPrice: 1.2650, currentPrice: 1.2645, pnl: 25, margin: 5000 },
    { symbol: 'USD/JPY', size: 75000, entryPrice: 142.30, currentPrice: 142.35, pnl: 45, margin: 7500 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Portfolio Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Portfolio Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Equity
              </Typography>
              <Typography variant="h4">
                ${portfolioSummary.totalEquity.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main', mt: 1 }}>
                <TrendingUp />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  +2.5% from yesterday
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Daily P&L
              </Typography>
              <Typography variant="h4" color={portfolioSummary.dailyPnL >= 0 ? 'success.main' : 'error.main'}>
                ${portfolioSummary.dailyPnL.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <ShowChart />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {portfolioSummary.openPositions} Open Positions
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Margin Level
              </Typography>
              <Typography variant="h4">
                {portfolioSummary.marginLevel}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={portfolioSummary.marginLevel} 
                sx={{ mt: 2 }}
                color={portfolioSummary.marginLevel > 50 ? 'success' : 'warning'}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Margin Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Margin Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography color="textSecondary" gutterBottom>
                      Margin Used
                    </Typography>
                    <Typography variant="h6">
                      ${portfolioSummary.marginUsed.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography color="textSecondary" gutterBottom>
                      Margin Available
                    </Typography>
                    <Typography variant="h6">
                      ${portfolioSummary.marginAvailable.toLocaleString()}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Open Positions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Open Positions
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Symbol</TableCell>
                      <TableCell align="right">Size</TableCell>
                      <TableCell align="right">Entry Price</TableCell>
                      <TableCell align="right">Current Price</TableCell>
                      <TableCell align="right">P&L</TableCell>
                      <TableCell align="right">Margin</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {positions.map((position) => (
                      <TableRow key={position.symbol}>
                        <TableCell>{position.symbol}</TableCell>
                        <TableCell 
                          align="right"
                          sx={{ color: position.size >= 0 ? 'success.main' : 'error.main' }}
                        >
                          {position.size.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">{position.entryPrice.toFixed(4)}</TableCell>
                        <TableCell align="right">{position.currentPrice.toFixed(4)}</TableCell>
                        <TableCell 
                          align="right"
                          sx={{ color: position.pnl >= 0 ? 'success.main' : 'error.main' }}
                        >
                          ${position.pnl}
                        </TableCell>
                        <TableCell align="right">${position.margin.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Equity Curve */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Equity Curve
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  Equity curve chart will be implemented here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

export default PortfolioDashboard;
