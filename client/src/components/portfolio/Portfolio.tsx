import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as ProfitIcon,
  AccountBalance as BalanceIcon,
  SwapHoriz as TradesIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';

const Portfolio: React.FC = observer(() => {
  const { portfolioStore } = useStores();

  const portfolioStats = [
    { 
      title: 'Total Balance', 
      value: '$0', 
      icon: <BalanceIcon />, 
      change: '0%'
    },
    { 
      title: 'Total Profit/Loss', 
      value: '$0', 
      icon: <ProfitIcon />, 
      change: '0%'
    },
    { 
      title: 'Open Trades', 
      value: '0', 
      icon: <TradesIcon />, 
      change: null 
    },
    { 
      title: 'Win Rate', 
      value: '0%', 
      icon: <ProfitIcon />, 
      change: null 
    },
  ];

  if (portfolioStore.loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Portfolio Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => {}}
        >
          New Portfolio
        </Button>
      </Box>

      {/* Portfolio Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {portfolioStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <IconButton color="primary" sx={{ mr: 1 }}>
                    {stat.icon}
                  </IconButton>
                  <Typography variant="h6" component="div">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h4" component="div" gutterBottom>
                  {stat.value}
                </Typography>
                {stat.change && (
                  <Typography 
                    variant="body2" 
                    color={stat.change.startsWith('+') ? 'success.main' : 'error.main'}
                  >
                    {stat.change}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
});

export default Portfolio;
