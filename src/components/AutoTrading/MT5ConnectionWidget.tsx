import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
  Chip,
} from '@mui/material';
import {
  Link as LinkIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStoreContext } from '../../stores/RootStoreContext';

interface MT5Config {
  server: string;
  login: string;
  password: string;
}

const MT5ConnectionWidget: React.FC = observer(() => {
  const { algoTradingStore } = useRootStoreContext();
  const [isConnected, setIsConnected] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [config, setConfig] = useState<MT5Config>({
    server: '',
    login: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleConnect = () => {
    try {
      if (config.server && config.login && config.password) {
        // Here you would implement the actual MT5 connection logic
        // For now, we'll just simulate a connection
        setIsConnected(true);
        setDialogOpen(false);
        setError(null);
      } else {
        setError('Please fill in all fields');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDisconnect = () => {
    try {
      setIsConnected(false);
      setConfig({
        server: '',
        login: '',
        password: '',
      });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6">MetaTrader 5 Connection</Typography>
            <Chip
              icon={isConnected ? <CheckCircleIcon /> : <ErrorIcon />}
              label={isConnected ? 'Connected' : 'Disconnected'}
              color={isConnected ? 'success' : 'error'}
              variant="outlined"
            />
          </Box>
          <Button
            variant="contained"
            color={isConnected ? 'error' : 'primary'}
            startIcon={<LinkIcon />}
            onClick={isConnected ? handleDisconnect : () => setDialogOpen(true)}
          >
            {isConnected ? 'Disconnect' : 'Connect MT5'}
          </Button>
        </Box>

        {isConnected && (
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="textSecondary">
                  Server: {config.server}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="textSecondary">
                  Login: {config.login}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="body2" color="textSecondary">
                  Status: Active
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Connect to MetaTrader 5</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Typography variant="body2" color="textSecondary" paragraph>
              Enter your MetaTrader 5 account credentials to connect. You can find these details in
              your MT5 terminal under File {'>'} Login to Trade Account.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Server"
                  value={config.server}
                  onChange={(e) => setConfig({ ...config, server: e.target.value })}
                  placeholder="e.g., ICMarkets-Demo"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Login"
                  value={config.login}
                  onChange={(e) => setConfig({ ...config, login: e.target.value })}
                  placeholder="Your MT5 account number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  value={config.password}
                  onChange={(e) => setConfig({ ...config, password: e.target.value })}
                  placeholder="Your MT5 account password"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleConnect} color="primary">
              Connect
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
});

export default MT5ConnectionWidget;
