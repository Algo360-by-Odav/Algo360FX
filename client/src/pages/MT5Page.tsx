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
import { useWebSocketContext } from '../contexts/WebSocketContext';

interface MT5State {
  accountInfo: any;
}

const MT5Page: React.FC = () => {
  const [accountId, setAccountId] = useState('');
  const [state, setState] = useState<MT5State>({
    accountInfo: null,
  });

  const {
    connected,
    connecting,
    error,
    send,
    disconnect,
    lastMessage,
  } = useWebSocketContext();

  useEffect(() => {
    if (lastMessage) {
      if (lastMessage.type === 'accountInfo') {
        setState(prev => ({
          ...prev,
          accountInfo: lastMessage.data,
        }));
      }
    }
  }, [lastMessage]);

  const handleConnect = () => {
    if (!accountId) {
      return;
    }

    send({
      action: 'connect',
      accountId: accountId
    });
  };

  const handleDisconnect = () => {
    disconnect();
    setState({
      accountInfo: null,
    });
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
                disabled={connected}
                error={!accountId && connected}
                helperText={!accountId && connected ? 'Account ID is required' : ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              {!connected ? (
                <Button
                  variant="contained"
                  onClick={handleConnect}
                  disabled={connecting || !accountId}
                  startIcon={connecting ? <CircularProgress size={20} /> : null}
                >
                  {connecting ? 'Connecting...' : 'Connect to MT5'}
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
              )}
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {connected && (
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
