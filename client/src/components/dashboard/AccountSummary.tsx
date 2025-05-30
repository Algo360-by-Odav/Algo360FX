import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  ShowChart,
  Assessment,
} from '@mui/icons-material';

interface AccountSummaryProps {
  data: {
    balance: number;
    equity: number;
    openPnL: number;
    usedMargin: number;
    freeMargin: number;
    marginLevel: number;
    dailyPnL: number;
    weeklyPnL: number;
  };
}

export const AccountSummary: React.FC<AccountSummaryProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const cards = [
    {
      title: 'Account Balance',
      value: formatCurrency(data.balance),
      secondary: `Equity: ${formatCurrency(data.equity)}`,
      icon: AccountBalance,
      color: 'primary.main',
    },
    {
      title: 'Open P&L',
      value: formatCurrency(data.openPnL),
      secondary: `Daily P&L: ${formatCurrency(data.dailyPnL)}`,
      icon: TrendingUp,
      color: data.openPnL >= 0 ? 'success.main' : 'error.main',
    },
    {
      title: 'Margin Level',
      value: `${data.marginLevel}%`,
      secondary: `Used: ${formatCurrency(data.usedMargin)}`,
      icon: ShowChart,
      color: data.marginLevel > 100 ? 'success.main' : 'warning.main',
    },
    {
      title: 'Weekly P&L',
      value: formatCurrency(data.weeklyPnL),
      secondary: `Free Margin: ${formatCurrency(data.freeMargin)}`,
      icon: Assessment,
      color: data.weeklyPnL >= 0 ? 'success.main' : 'error.main',
    },
  ];

  return (
    <Grid container spacing={3}>
      {cards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <card.icon sx={{ color: card.color, mr: 1 }} />
                <Typography variant="h6" component="div">
                  {card.title}
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ color: card.color }}>
                {card.value}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {card.secondary}
                </Typography>
                {card.title === 'Margin Level' && (
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(data.marginLevel, 100)}
                    color={data.marginLevel > 100 ? 'success' : 'warning'}
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
