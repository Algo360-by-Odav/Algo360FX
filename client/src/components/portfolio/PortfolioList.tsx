import { useEffect, useState } from 'react';
import { portfolioService, Portfolio } from '../../services/portfolioService.js';
import { Box, Button, Card, CardContent, Typography, Grid, CircularProgress, Alert } from '@mui/material';

export const PortfolioList: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPortfolios = async () => {
    try {
      const data = await portfolioService.getPortfolios();
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
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h1">
          Your Portfolios
        </Typography>
        <Button variant="contained" color="primary" href="/portfolios/new">
          Create Portfolio
        </Button>
      </Box>

      <Grid container spacing={2}>
        {portfolios.map((portfolio) => (
          <Grid item xs={12} sm={6} md={4} key={portfolio.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {portfolio.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {portfolio.description}
                </Typography>
                <Typography variant="body2">
                  Balance: {portfolio.balance} {portfolio.currency}
                </Typography>
                <Box mt={2}>
                  <Button
                    variant="outlined"
                    color="primary"
                    href={`/portfolios/${portfolio.id}`}
                    size="small"
                  >
                    View Details
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
