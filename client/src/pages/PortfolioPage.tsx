import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button
} from '@mui/material';
import { useApp } from '@/context/AppContext';
import { privateApi } from '@/config/api';

interface Asset {
  symbol: string;
  allocation: number;
  currentPrice: number;
  averagePrice: number;
  quantity: number;
  pnl: number;
  pnlPercentage: number;
}

interface PortfolioSummary {
  totalValue: number;
  totalPnl: number;
  totalPnlPercentage: number;
  cashBalance: number;
  investedAmount: number;
  numberOfAssets: number;
}

const PortfolioPage: React.FC = () => {
  const { showNotification } = useApp();
  const [loading, setLoading] = React.useState(true);
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [summary, setSummary] = React.useState<PortfolioSummary | null>(null);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const fetchPortfolioData = async () => {
    try {
      setLoading(true);
      const [assetsResponse, summaryResponse] = await Promise.all([
        privateApi.get('/portfolio/assets'),
        privateApi.get('/portfolio/summary')
      ]);

      setAssets(assetsResponse.data);
      setSummary(summaryResponse.data);
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || 'Failed to fetch portfolio data',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPortfolioData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(0);
  };

  if (loading && !summary) {
    return (
      <Grid container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Grid item>
          <Typography variant="h4" component="div">
            Loading...
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Portfolio Overview
        </Typography>
      </Box>

      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    Total Value
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                  {formatCurrency(summary.totalValue)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Cash: {formatCurrency(summary.cashBalance)}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    Total P&L
                  </Typography>
                </Box>
                <Typography 
                  variant="h4" 
                  component="div" 
                  sx={{ 
                    mb: 1,
                    color: summary.totalPnl >= 0 
                      ? 'green' 
                      : 'red'
                  }}
                >
                  {formatCurrency(summary.totalPnl)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {formatPercentage(summary.totalPnlPercentage)}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper>
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    Invested Amount
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                  {formatCurrency(summary.investedAmount)}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {summary.numberOfAssets} Assets
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h6" component="div">
                Assets
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <Grid container>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1" component="div">
                    Symbol
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1" component="div">
                    Allocation
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1" component="div">
                    Current Price
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1" component="div">
                    Average Price
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1" component="div">
                    Quantity
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1" component="div">
                    P&L
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="body1" component="div">
                    P&L %
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            {assets
              .slice(currentPage * itemsPerPage, currentPage * itemsPerPage + itemsPerPage)
              .map((asset) => (
                <Grid container key={asset.symbol}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" component="div">
                      {asset.symbol}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" component="div">
                      {formatPercentage(asset.allocation)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" component="div">
                      {formatCurrency(asset.currentPrice)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" component="div">
                      {formatCurrency(asset.averagePrice)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="body1" component="div">
                      {asset.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography 
                      variant="body1" 
                      component="div"
                      sx={{ 
                        color: asset.pnl >= 0 
                          ? 'green' 
                          : 'red' 
                      }}
                    >
                      {formatCurrency(asset.pnl)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography 
                      variant="body1" 
                      component="div"
                      sx={{ 
                        color: asset.pnlPercentage >= 0 
                          ? 'green' 
                          : 'red' 
                      }}
                    >
                      {formatPercentage(asset.pnlPercentage)}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
          </Grid>
        </Box>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2">
              Rows per page:
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                style={{ marginLeft: '8px' }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                disabled={currentPage === 0}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                Page {currentPage + 1} of {Math.ceil(assets.length / itemsPerPage)}
              </Typography>
              <Button
                disabled={currentPage >= Math.ceil(assets.length / itemsPerPage) - 1}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PortfolioPage;
