import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import ThemeCard from '../../components/theme/ThemeCard';
import GradientText from '../../components/theme/GradientText';
import { useAuth } from '../../hooks/useAuth';

const WelcomeCard: React.FC = () => {
  const { user } = useAuth();

  return (
    <ThemeCard
      bgImage="/assets/images/welcome-bg.jpg"
      sx={{ height: '100%', minHeight: 240 }}
    >
      <Box sx={{ maxWidth: 480 }}>
        <GradientText variant="h3" component="div" gradient="primary" sx={{ mb: 2 }}>
          Welcome back,
          <br /> {user?.firstName || 'Trader'}!
        </GradientText>

        <Typography
          variant="body1"
          component="div"
          sx={{ color: 'common.white', opacity: 0.8, mb: 3 }}
        >
          Ready to make some profitable trades today? Your portfolio is showing positive trends.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<TrendingUp />}
          sx={{
            bgcolor: 'common.white',
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'grey.100',
            },
          }}
        >
          Go to Trading
        </Button>
      </Box>
    </ThemeCard>
  );
};

export default WelcomeCard;
