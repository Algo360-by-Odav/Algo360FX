import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';

interface MT5State {
  connected: boolean;
  accountInfo: any;
  error: string | null;
  loading: boolean;
}

const MT5Page: React.FC = () => {
  const [accountId, setAccountId] = useState('');
  const [state, setState] = useState<MT5State>({
    connected: false,
    accountInfo: null,
    error: null,
    loading: false,
  });
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [ws]);

  const connectToMT5 = () => {
    if (!accountId) {
      setState(prev => ({ ...prev, error: 'Please enter an account ID' }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));
    const socket = new WebSocket('ws://localhost:6778');

    socket.onopen = () => {
      console.log('Connected to MT5 bridge');
      socket.send(JSON.stringify({
        action: 'connect',
        accountId: accountId
      }));
    };

    socket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.error) {
        setState(prev => ({
          ...prev,
          error: response.error,
          loading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          connected: true,
          error: null,
          loading: false
        }));
        // Get account info after successful connection
        socket.send(JSON.stringify({
          action: 'getAccountInfo',
          accountId: accountId
        }));
      }
    };

    socket.onerror = (error) => {
      setState(prev => ({
        ...prev,
        error: 'Failed to connect to MT5',
        loading: false
      }));
    };

    setWs(socket);
  };

  const disconnectFromMT5 = () => {
    if (ws) {
      ws.close();
      setWs(null);
      setState({
        connected: false,
        accountInfo: null,
        error: null,
        loading: false
      });
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          MT5 Integration
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="MT5 Account ID"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                disabled={state.connected}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              {!state.connected ? (
                <Button
                  variant="contained"
                  onClick={connectToMT5}
                  disabled={state.loading}
                  startIcon={state.loading ? <CircularProgress size={20} /> : null}
                >
                  Connect to MT5
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={disconnectFromMT5}
                >
                  Disconnect
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>

        {state.error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {state.error}
          </Alert>
        )}

        {state.connected && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Account Information
            </Typography>
            {state.accountInfo ? (
              <Box>
                <Typography>Balance: {state.accountInfo.balance}</Typography>
                <Typography>Equity: {state.accountInfo.equity}</Typography>
                <Typography>Margin: {state.accountInfo.margin}</Typography>
                <Typography>Free Margin: {state.accountInfo.freeMargin}</Typography>
                <Typography>Leverage: {state.accountInfo.leverage}</Typography>
              </Box>
            ) : (
              <CircularProgress />
            )}
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default MT5Page;
