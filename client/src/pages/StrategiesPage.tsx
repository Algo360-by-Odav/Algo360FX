import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import apiService from '../services/apiService';
import websocketService from '../services/websocketService';

interface Strategy {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  performance: {
    totalPnL: number;
    winRate: number;
    tradesCount: number;
  };
  parameters: Record<string, any>;
}

const StrategiesPage: React.FC = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configValues, setConfigValues] = useState<Record<string, any>>({});

  const fetchStrategies = async () => {
    try {
      const data = await apiService.get<Strategy[]>('/api/strategies');
      setStrategies(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch strategies');
    } finally {
      setLoading(false);
    }
  };

  const handleStrategyToggle = async (strategyId: string, isActive: boolean) => {
    try {
      await apiService.put(`/api/strategies/${strategyId}`, { isActive });
      // Strategy update will come through WebSocket
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update strategy');
    }
  };

  const handleConfigOpen = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setConfigValues(strategy.parameters);
    setIsConfigOpen(true);
  };

  const handleConfigSave = async () => {
    if (!selectedStrategy) return;

    try {
      await apiService.put(`/api/strategies/${selectedStrategy.id}/config`, configValues);
      setIsConfigOpen(false);
      // Strategy update will come through WebSocket
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update strategy configuration');
    }
  };

  useEffect(() => {
    fetchStrategies();

    // Subscribe to real-time strategy updates
    const unsubscribe = websocketService.subscribe<Strategy[]>('strategies-update', (data) => {
      setStrategies(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Trading Strategies
      </Typography>

      <Grid container spacing={3}>
        {strategies.map((strategy) => (
          <Grid item xs={12} md={6} key={strategy.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {strategy.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {strategy.description}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Total P&L</Typography>
                    <Typography color={strategy.performance.totalPnL >= 0 ? 'success.main' : 'error.main'}>
                      ${strategy.performance.totalPnL.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Win Rate</Typography>
                    <Typography>{(strategy.performance.winRate * 100).toFixed(1)}%</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Total Trades</Typography>
                    <Typography>{strategy.performance.tradesCount}</Typography>
                  </Grid>
                </Grid>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={strategy.isActive}
                      onChange={(e) => handleStrategyToggle(strategy.id, e.target.checked)}
                      color="primary"
                    />
                  }
                  label={strategy.isActive ? 'Active' : 'Inactive'}
                />
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleConfigOpen(strategy)}
                >
                  Configure
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={isConfigOpen} onClose={() => setIsConfigOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Configure {selectedStrategy?.name}
        </DialogTitle>
        <DialogContent>
          {Object.entries(configValues).map(([key, value]) => (
            <TextField
              key={key}
              fullWidth
              label={key}
              value={value}
              onChange={(e) => setConfigValues(prev => ({ ...prev, [key]: e.target.value }))}
              margin="normal"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsConfigOpen(false)}>Cancel</Button>
          <Button onClick={handleConfigSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StrategiesPage;
