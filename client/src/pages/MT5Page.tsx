import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Grid
} from '@mui/material';
import { useStore } from '@/context/StoreContext';

interface MT5AccountInfo {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
}

const MT5Page: React.FC = () => {
  const { mt5Store } = useStore();
  const [accountId, setAccountId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [accountInfo, setAccountInfo] = useState<MT5AccountInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const connectToMT5 = async () => {
      try {
        setError(null);
        const success = await mt5Store.connect(accountId, password);
        setIsConnected(success);
        if (success) {
          await refreshAccountInfo();
        }
      } catch (err) {
        setError((err as Error).message);
        setIsConnected(false);
      }
    };

    if (accountId && password) {
      connectToMT5();
    }
  }, [accountId, password, mt5Store]);

  const refreshAccountInfo = async () => {
    try {
      const info = await mt5Store.getAccountInfo();
      setAccountInfo(info);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleConnect = () => {
    if (!accountId || !password) {
      setError('Please enter both account ID and password');
      return;
    }
    setAccountId(accountId);
    setPassword(password);
  };

  const handleDisconnect = async () => {
    try {
      await mt5Store.disconnect();
      setIsConnected(false);
      setAccountInfo(null);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (!isConnected) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Connect to MT5
          </Typography>
          <Box component="form" sx={{ '& > *': { mb: 2 } }}>
            <TextField
              fullWidth
              label="Account ID"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleConnect}
            >
              Connect
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">MT5 Account Information</Typography>
        <Button variant="outlined" color="error" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!accountInfo ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Account Overview
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ '& > *': { mb: 2 } }}>
                <Typography>
                  <strong>Balance:</strong> ${accountInfo.balance.toFixed(2)}
                </Typography>
                <Typography>
                  <strong>Equity:</strong> ${accountInfo.equity.toFixed(2)}
                </Typography>
                <Typography>
                  <strong>Margin:</strong> ${accountInfo.margin.toFixed(2)}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Margin Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ '& > *': { mb: 2 } }}>
                <Typography>
                  <strong>Free Margin:</strong> ${accountInfo.freeMargin.toFixed(2)}
                </Typography>
                <Typography>
                  <strong>Margin Level:</strong> {accountInfo.marginLevel.toFixed(2)}%
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default MT5Page;
