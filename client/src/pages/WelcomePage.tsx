import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      title: 'Advanced Trading Tools',
      description: 'Access professional-grade trading tools and analytics for better decision making.',
    },
    {
      title: 'Real-Time Market Data',
      description: 'Stay informed with live market data and instant price updates.',
    },
    {
      title: 'Portfolio Management',
      description: 'Track and manage your investments with our comprehensive portfolio tools.',
    },
    {
      title: 'Risk Management',
      description: 'Protect your investments with advanced risk management features.',
    },
    {
      title: 'Technical Analysis',
      description: 'Analyze market trends with our powerful technical analysis tools.',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant={isSmallScreen ? 'h4' : 'h2'}
            component="h1"
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Welcome to Algo360FX
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Professional Trading Platform for Modern Traders
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
                elevation={2}
              >
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'background.paper', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            Ready to Start Trading?
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            Join thousands of traders who trust Algo360FX for their trading needs.
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default WelcomePage;