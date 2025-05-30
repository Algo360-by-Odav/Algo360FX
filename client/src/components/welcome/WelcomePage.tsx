import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  IconButton,
  Stack,
  Paper,
} from '@mui/material';
import {
  Timeline,
  ShowChart,
  Assessment,
  Speed,
  Security,
  Insights,
  LightMode,
  DarkMode,
} from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../theme/ThemeContext';

const features = [
  {
    title: 'Advanced Trading Algorithms',
    description: 'Access sophisticated trading algorithms powered by cutting-edge AI and machine learning',
    icon: <ShowChart fontSize="large" color="primary" />,
  },
  {
    title: 'Real-time Market Analysis',
    description: 'Get instant insights with real-time market data and advanced technical analysis',
    icon: <Assessment fontSize="large" color="primary" />,
  },
  {
    title: 'High-Frequency Trading',
    description: 'Execute trades at ultra-low latency with our advanced HFT infrastructure',
    icon: <Speed fontSize="large" color="primary" />,
  },
  {
    title: 'Risk Management',
    description: 'Protect your investments with our comprehensive risk management tools',
    icon: <Security fontSize="large" color="primary" />,
  },
  {
    title: 'Market Intelligence',
    description: 'Stay ahead with AI-powered market intelligence and predictive analytics',
    icon: <Insights fontSize="large" color="primary" />,
  },
  {
    title: 'Performance Tracking',
    description: 'Monitor your trading performance with detailed analytics and reporting',
    icon: <Timeline fontSize="large" color="primary" />,
  },
];

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useCustomTheme();

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.background.default} 100%)`,
    }}>
      {/* Theme Toggle */}
      <Box sx={{ position: 'fixed', top: 20, right: 20 }}>
        <IconButton onClick={toggleTheme} color="primary">
          {isDarkMode ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg">
        <Box
          sx={{
            pt: { xs: 8, md: 12 },
            pb: { xs: 6, md: 8 },
            textAlign: 'center',
          }}
        >
          <Typography
            component="h1"
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: 800,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #90caf9 30%, #ce93d8 90%)'
                : 'linear-gradient(45deg, #1976d2 30%, #9c27b0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
            }}
          >
            Welcome to Algo360FX
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}
          >
            Experience the next generation of algorithmic trading with our professional-grade platform.
            Harness the power of AI and advanced analytics to transform your trading strategy.
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 8 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Box>

        {/* Features Section */}
        <Paper
          elevation={0}
          sx={{
            py: 8,
            px: 3,
            borderRadius: 4,
            backgroundColor: theme.palette.mode === 'dark' 
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(255, 255, 255, 0.8)',
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            align="center"
            gutterBottom
            sx={{ 
              mb: 6,
              fontWeight: 700,
              color: theme.palette.text.primary,
            }}
          >
            Features
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    backgroundColor: 'transparent',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default WelcomePage;
