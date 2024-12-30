import React from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  LinearProgress,
  alpha,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  AccountBalance,
  SwapHoriz,
  Analytics,
} from '@mui/icons-material';
import ResponsiveStack from '../../components/theme/ResponsiveStack';

const stats = [
  {
    title: 'Total Balance',
    value: '$12,845.00',
    icon: AccountBalance,
    color: 'primary',
    change: '+2.5%',
    progress: 85,
  },
  {
    title: 'Daily Profit',
    value: '$1,245.00',
    icon: TrendingUp,
    color: 'success',
    change: '+15.2%',
    progress: 75,
  },
  {
    title: 'Active Trades',
    value: '8',
    icon: SwapHoriz,
    color: 'warning',
    change: '+3',
    progress: 60,
  },
  {
    title: 'Win Rate',
    value: '68%',
    icon: Analytics,
    color: 'info',
    change: '+5.2%',
    progress: 68,
  },
] as const;

const StatsCards: React.FC = () => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      {stats.map((stat) => {
        const Icon = stat.icon;
        const color = theme.palette[stat.color].main;

        return (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1.5,
                    bgcolor: alpha(color, 0.12),
                    color: color,
                  }}
                >
                  <Icon />
                </Box>

                <Box sx={{ ml: 2 }}>
                  <Typography variant="subtitle2" component="div" sx={{ color: 'text.secondary' }}>
                    {stat.title}
                  </Typography>
                  <ResponsiveStack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    sx={{ mt: 0.5 }}
                  >
                    <Typography variant="h4" component="div">{stat.value}</Typography>
                    <Typography
                      variant="subtitle2"
                      component="div"
                      sx={{
                        color:
                          stat.change.startsWith('+')
                            ? 'success.main'
                            : 'error.main',
                      }}
                    >
                      {stat.change}
                    </Typography>
                  </ResponsiveStack>
                </Box>
              </Box>

              <LinearProgress
                variant="determinate"
                value={stat.progress}
                sx={{
                  bgcolor: alpha(color, 0.12),
                  '& .MuiLinearProgress-bar': {
                    bgcolor: color,
                  },
                }}
              />
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatsCards;
