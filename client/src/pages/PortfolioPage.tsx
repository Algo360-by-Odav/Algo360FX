import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Refresh as RefreshIcon,
  AccountBalance as AccountIcon,
  ShowChart as ChartIcon,
  AttachMoney as MoneyIcon,
  Timeline as TimelineIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import PortfolioAnalytics from '@/components/portfolio/PortfolioAnalytics';

// Mock data
const mockPortfolioData = {
  summary: {
    totalValue: 125750.25,
    totalPnl: 12575.50,
    totalPnlPercentage: 11.12,
    cashBalance: 25750.25,
    investedAmount: 100000,
    numberOfAssets: 8,
  },
  assets: [
    {
      symbol: 'EURUSD',
      allocation: 25.5,
      currentPrice: 1.0925,
      averagePrice: 1.0850,
      quantity: 100000,
      pnl: 750.00,
      pnlPercentage: 6.89,
    },
    {
      symbol: 'GBPUSD',
      allocation: 20.3,
      currentPrice: 1.2725,
      averagePrice: 1.2650,
      quantity: 75000,
      pnl: 562.50,
      pnlPercentage: 5.93,
    },
    {
      symbol: 'USDJPY',
      allocation: 18.7,
      currentPrice: 148.35,
      averagePrice: 147.85,
      quantity: 50000,
      pnl: -250.00,
      pnlPercentage: -3.33,
    },
    {
      symbol: 'AUDUSD',
      allocation: 15.2,
      currentPrice: 0.6585,
      averagePrice: 0.6525,
      quantity: 60000,
      pnl: 360.00,
      pnlPercentage: 4.80,
    },
  ],
  chartData: [
    { date: '2024-01-01', value: 100000 },
    { date: '2024-01-08', value: 102500 },
    { date: '2024-01-15', value: 108750 },
    { date: '2024-01-22', value: 115000 },
    { date: '2024-01-29', value: 125750 },
  ],
  dailyReturns: [
    { range: '-2% to -1%', frequency: 5 },
    { range: '-1% to 0%', frequency: 15 },
    { range: '0% to 1%', frequency: 20 },
    { range: '1% to 2%', frequency: 8 },
    { range: '2% to 3%', frequency: 2 },
  ],
  riskMetrics: {
    sharpeRatio: 1.85,
    volatility: 12.5,
    beta: 0.92,
    alpha: 3.2,
    maxDrawdown: -15.3,
    informationRatio: 0.75,
    sortinoRatio: 2.1,
    trackingError: 4.2,
  },
  correlations: [
    { asset1: 'EURUSD', asset2: 'GBPUSD', correlation: 0.85 },
    { asset1: 'EURUSD', asset2: 'USDJPY', correlation: -0.32 },
    { asset1: 'GBPUSD', asset2: 'USDJPY', correlation: -0.28 },
    { asset1: 'AUDUSD', asset2: 'EURUSD', correlation: 0.65 },
  ],
  performance: {
    daily: 1.25,
    weekly: 3.75,
    monthly: 11.12,
    quarterly: 15.8,
    ytd: 25.75,
    yearly: 32.5,
  }
};

const PortfolioPage = observer(() => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Portfolio Overview
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AnalyticsIcon />}
            onClick={() => setAnalyticsOpen(true)}
            sx={{ mr: 2 }}
          >
            Analytics
          </Button>
          <IconButton onClick={handleRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Value</Typography>
              </Box>
              <Typography variant="h4" component="div" gutterBottom>
                {formatCurrency(mockPortfolioData.summary.totalValue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cash: {formatCurrency(mockPortfolioData.summary.cashBalance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total P&L</Typography>
              </Box>
              <Typography
                variant="h4"
                component="div"
                gutterBottom
                color={mockPortfolioData.summary.totalPnl >= 0 ? 'success.main' : 'error.main'}
              >
                {formatCurrency(mockPortfolioData.summary.totalPnl)}
              </Typography>
              <Typography
                variant="body2"
                color={mockPortfolioData.summary.totalPnlPercentage >= 0 ? 'success.main' : 'error.main'}
              >
                {formatPercentage(mockPortfolioData.summary.totalPnlPercentage)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Invested Amount</Typography>
              </Box>
              <Typography variant="h4" component="div" gutterBottom>
                {formatCurrency(mockPortfolioData.summary.investedAmount)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {mockPortfolioData.summary.numberOfAssets} Assets
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1 }} />
                <Typography variant="h6">Performance</Typography>
              </Box>
              <Typography variant="h4" component="div" gutterBottom color="success.main">
                {formatPercentage(25.75)} {/* YTD Return */}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Year to Date
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Portfolio Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Portfolio Value</Typography>
              <Box sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockPortfolioData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <ChartTooltip
                      formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Assets Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Assets</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Symbol</TableCell>
                      <TableCell align="right">Allocation</TableCell>
                      <TableCell align="right">Current Price</TableCell>
                      <TableCell align="right">Average Price</TableCell>
                      <TableCell align="right">Quantity</TableCell>
                      <TableCell align="right">P&L</TableCell>
                      <TableCell align="right">P&L %</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockPortfolioData.assets.map((asset) => (
                      <TableRow key={asset.symbol}>
                        <TableCell component="th" scope="row">
                          {asset.symbol}
                        </TableCell>
                        <TableCell align="right">{formatPercentage(asset.allocation)}</TableCell>
                        <TableCell align="right">{asset.currentPrice.toFixed(4)}</TableCell>
                        <TableCell align="right">{asset.averagePrice.toFixed(4)}</TableCell>
                        <TableCell align="right">{asset.quantity.toLocaleString()}</TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: asset.pnl >= 0 ? 'success.main' : 'error.main',
                          }}
                        >
                          {formatCurrency(asset.pnl)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: asset.pnlPercentage >= 0 ? 'success.main' : 'error.main',
                          }}
                        >
                          {formatPercentage(asset.pnlPercentage)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={mockPortfolioData.assets.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setPage(0);
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <PortfolioAnalytics
        open={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
        portfolioData={mockPortfolioData}
      />
    </Container>
  );
});

export default PortfolioPage;
