import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as ProfitIcon,
  TrendingDown as LossIcon,
  WifiOff as OfflineIcon,
} from '@mui/icons-material';
import { offlineStorage } from '../../services/OfflineStorage';
import { useOfflineCapability } from '../../hooks/useOfflineCapability';

export function OfflineAccountSummary() {
  const [accountData, setAccountData] = useState<any>(null);
  const { isOnline } = useOfflineCapability();
  const theme = useTheme();

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    const summary = await offlineStorage.getAccountSummary();
    setAccountData(summary);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  if (!accountData) {
    return (
      <Card>
        <CardContent>
          <Typography align="center" color="text.secondary">
            Loading account data...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Account Summary</Typography>
        {!isOnline && (
          <Chip
            icon={<OfflineIcon />}
            label="Offline Mode"
            color="warning"
            size="small"
          />
        )}
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Balance
              </Typography>
              <Typography variant="h6">
                {formatCurrency(accountData.balance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Equity
              </Typography>
              <Typography variant="h6">
                {formatCurrency(accountData.equity)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Free Margin
              </Typography>
              <Typography variant="h6">
                {formatCurrency(accountData.freeMargin)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Margin Level
              </Typography>
              <Typography variant="h6">
                {formatPercentage(accountData.marginLevel)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Open Positions
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Volume</TableCell>
              <TableCell align="right">Open Price</TableCell>
              <TableCell align="right">Current Price</TableCell>
              <TableCell align="right">Profit/Loss</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accountData.positions.map((position: any) => (
              <TableRow key={`${position.symbol}-${position.type}`}>
                <TableCell component="th" scope="row">
                  {position.symbol}
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={position.type}
                    color={position.type === 'BUY' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">{position.volume}</TableCell>
                <TableCell align="right">
                  {formatCurrency(position.openPrice)}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(position.currentPrice)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color:
                      position.profit >= 0
                        ? theme.palette.success.main
                        : theme.palette.error.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: 0.5,
                  }}
                >
                  {position.profit >= 0 ? (
                    <ProfitIcon fontSize="small" />
                  ) : (
                    <LossIcon fontSize="small" />
                  )}
                  {formatCurrency(Math.abs(position.profit))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mt: 2, textAlign: 'right' }}
      >
        Last updated: {new Date(accountData.lastUpdate).toLocaleString()}
      </Typography>
    </Box>
  );
}
