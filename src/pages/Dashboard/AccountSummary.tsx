import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { formatCurrency } from '../../utils/formatters';

interface AccountSummaryProps {
  balance?: number;
  equity?: number;
  margin?: number;
  freeMargin?: number;
  marginLevel?: number;
  openPositions?: number;
  pendingOrders?: number;
}

const AccountSummary: React.FC<AccountSummaryProps> = observer(({
  balance = 50000.00,
  equity = 51250.00,
  margin = 5000.00,
  freeMargin = 46250.00,
  marginLevel = 1025.00,
  openPositions = 2,
  pendingOrders = 1,
}) => {
  const profitPercentage = ((equity - balance) / balance) * 100;
  const isProfit = profitPercentage >= 0;

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="div">
          Account Summary
        </Typography>
        <IconButton size="small" aria-label="refresh">
          <RefreshIcon />
        </IconButton>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="div" gutterBottom>
          {formatCurrency(balance)}
        </Typography>
        <Box component="div">
          <Chip
            label={`${isProfit ? '+' : ''}${profitPercentage.toFixed(2)}%`}
            color={isProfit ? 'success' : 'error'}
            size="small"
            sx={{ borderRadius: 1 }}
          />
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Equity
          </Typography>
          <Typography variant="body1">
            {formatCurrency(equity)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Margin
          </Typography>
          <Typography variant="body1">
            {formatCurrency(margin)}
          </Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Free Margin
          </Typography>
          <Typography variant="body1">
            {formatCurrency(freeMargin)}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Margin Level
          </Typography>
          <Typography variant="body1">
            {marginLevel.toFixed(2)}%
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Open Positions
          </Typography>
          <Typography variant="h6" component="div">
            {openPositions}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Pending Orders
          </Typography>
          <Typography variant="h6" component="div">
            {pendingOrders}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
});

export default AccountSummary;
