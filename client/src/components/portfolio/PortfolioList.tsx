import { useEffect, useState } from 'react';
import { portfolioService, Portfolio } from '../../services/portfolioService';
import { Box, Button, Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material';

export const PortfolioList = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPortfolios = async () => {
    try {
      const data = await portfolioService.listPortfolios();
      setPortfolios(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch portfolios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolios();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Your Portfolios</Typography>
        <Button variant="contained" color="primary">
          Create New Portfolio
        </Button>
      </Box>

      <Grid container spacing={3}>
        {portfolios.map((portfolio) => (
          <Grid item xs={12} sm={6} md={4} key={portfolio.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {portfolio.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {portfolio.description}
                </Typography>
                <Typography variant="h6">
                  Balance: {portfolio.balance} {portfolio.currency}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Created: {new Date(portfolio.createdAt).toLocaleDateString()}
                </Typography>
                <Box mt={2}>
                  <Button size="small" color="primary">
                    View Details
                  </Button>
                  <Button size="small" color="error">
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
