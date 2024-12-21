import React from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  useTheme,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  TrendingDown,
  SwapHoriz,
  Info,
  Refresh,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStoreContext } from '../../stores/RootStoreContext';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';

const AccountSummaryWidget: React.FC = observer(() => {
  const theme = useTheme();
  const { tradingStore } = useRootStoreContext();

  const handleRefresh = () => {
    tradingStore.refreshAccountData();
  };

  const getMarginLevelColor = (level: number) => {
    if (level >= 200) return theme.palette.success.main;
    if (level >= 150) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  if (!tradingStore.accountInfo) {
    return (
      <Card>
        <Box p={2}>
          <Typography variant="h6">Account Summary</Typography>
          <Typography color="textSecondary">Loading account data...</Typography>
        </Box>
      </Card>
    );
  }

  const {
    balance,
    equity,
    margin,
    freeMargin,
    marginLevel,
  } = tradingStore.accountInfo;

  const pl = equity - balance;
  const plPercent = (pl / balance) * 100;
  const marginUsagePercent = (margin / equity) * 100;

  return (
    <Card>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" display="flex" alignItems="center">
            <AccountBalance sx={{ mr: 1 }} />
            Account Summary
          </Typography>
          <Tooltip title="Refresh account data">
            <IconButton onClick={handleRefresh} size="small">
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <Typography color="textSecondary" gutterBottom>
                Balance
              </Typography>
              <Typography variant="h5">
                {formatCurrency(balance)}
              </Typography>
            </Box>
            <Box mb={2}>
              <Typography color="textSecondary" gutterBottom>
                Equity
              </Typography>
              <Typography variant="h5">
                {formatCurrency(equity)}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <Typography color="textSecondary" gutterBottom>
                Profit/Loss
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography 
                  variant="h5" 
                  color={pl >= 0 ? 'success.main' : 'error.main'}
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {pl >= 0 ? <TrendingUp sx={{ mr: 1 }} /> : <TrendingDown sx={{ mr: 1 }} />}
                  {formatCurrency(Math.abs(pl))}
                </Typography>
                <Typography 
                  variant="body2" 
                  color={pl >= 0 ? 'success.main' : 'error.main'}
                  sx={{ ml: 1 }}
                >
                  ({formatPercentage(plPercent)})
                </Typography>
              </Box>
            </Box>
            <Box mb={2}>
              <Typography color="textSecondary" gutterBottom>
                Open Positions
              </Typography>
              <Typography variant="h5">
                {tradingStore.positions.length}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography color="textSecondary">
                  Used Margin
                </Typography>
                <Typography variant="body2">
                  {formatCurrency(margin)}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={marginUsagePercent} 
                sx={{ 
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: theme.palette.grey[800],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getMarginLevelColor(marginLevel),
                  }
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Box display="flex" alignItems="center">
                  <Typography color="textSecondary">
                    Margin Level
                  </Typography>
                  <Tooltip title="Margin level = (Equity / Used Margin) × 100">
                    <Info sx={{ ml: 0.5, fontSize: 16, color: 'text.secondary' }} />
                  </Tooltip>
                </Box>
                <Chip 
                  label={`${formatNumber(marginLevel, 2)}%`}
                  size="small"
                  sx={{ 
                    backgroundColor: getMarginLevelColor(marginLevel),
                    color: '#fff'
                  }}
                />
              </Box>
              <Typography variant="body2" color="textSecondary">
                Free Margin: {formatCurrency(freeMargin)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
});

export default AccountSummaryWidget;
