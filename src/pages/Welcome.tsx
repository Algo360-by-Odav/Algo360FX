import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Typography, Box, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import SchoolIcon from '@mui/icons-material/School';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  background: 'rgba(26, 32, 44, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 32px rgba(66, 153, 225, 0.2)',
    border: '1px solid rgba(66, 153, 225, 0.3)',
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  fontSize: '3.5rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

const Welcome: React.FC = () => {
  const features = [
    {
      icon: <TrendingUpIcon fontSize="inherit" />,
      title: 'Advanced Trading Strategies',
      description: 'Build and backtest sophisticated trading strategies with our powerful platform.',
    },
    {
      icon: <SecurityIcon fontSize="inherit" />,
      title: 'Risk Management',
      description: 'Comprehensive risk analysis and management tools to protect your investments.',
    },
    {
      icon: <SpeedIcon fontSize="inherit" />,
      title: 'Real-time Analytics',
      description: 'Monitor your portfolio performance with real-time data and advanced analytics.',
    },
    {
      icon: <SchoolIcon fontSize="inherit" />,
      title: 'Educational Resources',
      description: 'Learn from our extensive library of trading resources and tutorials.',
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1f2c 0%, #2d3748 100%)',
        py: 8,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(66, 153, 225, 0.1) 0%, rgba(0, 0, 0, 0) 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #4299e1, #9f7aea)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 10px rgba(66, 153, 225, 0.3)',
              letterSpacing: '-0.02em',
            }}
          >
            Welcome to Algo360FX
          </Typography>
          <Typography
            variant="h5"
            sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 4,
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Your Advanced Algorithmic Trading Platform
          </Typography>
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 3, 
              justifyContent: 'center',
              mb: 8,
            }}
          >
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              size="large"
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #4299e1, #9f7aea)',
                boxShadow: '0 4px 20px rgba(66, 153, 225, 0.3)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(66, 153, 225, 0.4)',
                },
              }}
            >
              Get Started
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                borderRadius: '12px',
                textTransform: 'none',
                fontSize: '1.1rem',
                px: 4,
                py: 1.5,
                borderColor: 'rgba(66, 153, 225, 0.5)',
                color: 'white',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  borderColor: '#4299e1',
                  background: 'rgba(66, 153, 225, 0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Login
            </Button>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <StyledPaper elevation={4}>
                  <FeatureIcon>{feature.icon}</FeatureIcon>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </StyledPaper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Welcome;
