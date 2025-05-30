import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Timeline as TimelineIcon,
  Notifications as NotificationsIcon,
  Share as ShareIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useStores } from '../../stores/StoreProvider';

interface SignalProvider {
  id: string;
  name: string;
  description: string;
  rating: number;
  subscribers: number;
  performance: {
    winRate: number;
    totalSignals: number;
    avgPips: number;
    monthlyReturn: number;
    maxDrawdown: number;
  };
  pricing: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  status: 'active' | 'inactive';
}

interface Signal {
  id: string;
  providerId: string;
  symbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  timestamp: string;
  status: 'open' | 'closed' | 'cancelled';
  result?: {
    pips: number;
    profit: number;
  };
}

const SignalProviderSystem: React.FC = () => {
  const { signalStore } = useStores();
  const [providers, setProviders] = useState<SignalProvider[]>([
    {
      id: '1',
      name: 'FX Master Signals',
      description: 'Professional forex signals with high accuracy and risk management',
      rating: 4.5,
      subscribers: 1250,
      performance: {
        winRate: 68.5,
        totalSignals: 856,
        avgPips: 35.8,
        monthlyReturn: 12.5,
        maxDrawdown: 15.2,
      },
      pricing: {
        monthly: 49.99,
        quarterly: 129.99,
        yearly: 449.99,
      },
      status: 'active',
    },
    {
      id: '2',
      name: 'Trend Warrior',
      description: 'Trend following signals for major currency pairs',
      rating: 4.2,
      subscribers: 850,
      performance: {
        winRate: 62.8,
        totalSignals: 654,
        avgPips: 28.5,
        monthlyReturn: 9.8,
        maxDrawdown: 18.5,
      },
      pricing: {
        monthly: 39.99,
        quarterly: 99.99,
        yearly: 349.99,
      },
      status: 'active',
    },
  ]);
  const [selectedProvider, setSelectedProvider] = useState<SignalProvider | null>(null);
  const [openProviderDialog, setOpenProviderDialog] = useState(false);
  const [openSignalsDialog, setOpenSignalsDialog] = useState(false);
  const [signals] = useState<Signal[]>([
    {
      id: '1',
      providerId: '1',
      symbol: 'EURUSD',
      type: 'buy',
      entryPrice: 1.2150,
      stopLoss: 1.2100,
      takeProfit: 1.2250,
      timestamp: '2025-01-26T08:30:00Z',
      status: 'open',
    },
    {
      id: '2',
      providerId: '1',
      symbol: 'GBPUSD',
      type: 'sell',
      entryPrice: 1.3850,
      stopLoss: 1.3900,
      takeProfit: 1.3750,
      timestamp: '2025-01-26T07:15:00Z',
      status: 'closed',
      result: {
        pips: 45,
        profit: 450,
      },
    },
  ]);

  const handleAddProvider = () => {
    setSelectedProvider(null);
    setOpenProviderDialog(true);
  };

  const handleEditProvider = (provider: SignalProvider) => {
    setSelectedProvider(provider);
    setOpenProviderDialog(true);
  };

  const handleViewSignals = (provider: SignalProvider) => {
    setSelectedProvider(provider);
    setOpenSignalsDialog(true);
  };

  const handleSubscribe = (provider: SignalProvider) => {
    // Subscribe to provider logic
  };

  const handleSaveProvider = () => {
    // Save provider logic
    setOpenProviderDialog(false);
  };

  const renderPerformanceMetrics = (provider: SignalProvider) => (
    <Grid container spacing={2}>
      <Grid item xs={6} sm={4} md={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Win Rate
        </Typography>
        <Typography variant="h6" color={provider.performance.winRate >= 60 ? 'success.main' : 'warning.main'}>
          {provider.performance.winRate}%
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Total Signals
        </Typography>
        <Typography variant="h6">
          {provider.performance.totalSignals}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Avg. Pips
        </Typography>
        <Typography variant="h6">
          {provider.performance.avgPips}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Monthly Return
        </Typography>
        <Typography variant="h6" color="success.main">
          {provider.performance.monthlyReturn}%
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Max Drawdown
        </Typography>
        <Typography variant="h6" color={provider.performance.maxDrawdown <= 20 ? 'success.main' : 'error.main'}>
          {provider.performance.maxDrawdown}%
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Subscribers
        </Typography>
        <Typography variant="h6">
          {provider.subscribers}
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Signal Provider System</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddProvider}
          >
            Become a Provider
          </Button>
        </Box>

        {providers.map((provider) => (
          <Card key={provider.id} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6">
                      {provider.name}
                    </Typography>
                    <Rating
                      value={provider.rating}
                      precision={0.5}
                      readOnly
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {provider.description}
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title="View Signals">
                    <IconButton onClick={() => handleViewSignals(provider)}>
                      <TimelineIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Share">
                    <IconButton>
                      <ShareIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Settings">
                    <IconButton onClick={() => handleEditProvider(provider)}>
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {renderPerformanceMetrics(provider)}

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Subscription Plans
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Chip
                      label={`Monthly: $${provider.pricing.monthly}`}
                      variant="outlined"
                      onClick={() => handleSubscribe(provider)}
                    />
                    <Chip
                      label={`Quarterly: $${provider.pricing.quarterly}`}
                      variant="outlined"
                      onClick={() => handleSubscribe(provider)}
                    />
                    <Chip
                      label={`Yearly: $${provider.pricing.yearly}`}
                      variant="outlined"
                      onClick={() => handleSubscribe(provider)}
                    />
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<NotificationsIcon />}
                  onClick={() => handleSubscribe(provider)}
                >
                  Subscribe
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Paper>

      <Dialog open={openProviderDialog} onClose={() => setOpenProviderDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedProvider ? 'Edit Provider Profile' : 'Create Provider Profile'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Provider Name"
                defaultValue={selectedProvider?.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                defaultValue={selectedProvider?.description}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Monthly Price"
                type="number"
                defaultValue={selectedProvider?.pricing.monthly}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Quarterly Price"
                type="number"
                defaultValue={selectedProvider?.pricing.quarterly}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Yearly Price"
                type="number"
                defaultValue={selectedProvider?.pricing.yearly}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProviderDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveProvider} variant="contained">
            {selectedProvider ? 'Save Changes' : 'Create Profile'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSignalsDialog} onClose={() => setOpenSignalsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Signal History - {selectedProvider?.name}
        </DialogTitle>
        <DialogContent>
          <List>
            {signals
              .filter((signal) => signal.providerId === selectedProvider?.id)
              .map((signal) => (
                <React.Fragment key={signal.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="subtitle1">
                            {signal.symbol} - {signal.type.toUpperCase()}
                          </Typography>
                          <Chip
                            label={signal.status}
                            color={signal.status === 'open' ? 'primary' : 'default'}
                            size="small"
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2">
                            Entry: {signal.entryPrice} | SL: {signal.stopLoss} | TP: {signal.takeProfit}
                          </Typography>
                          {signal.result && (
                            <Typography
                              variant="body2"
                              color={signal.result.pips >= 0 ? 'success.main' : 'error.main'}
                            >
                              Result: {signal.result.pips} pips (${signal.result.profit})
                            </Typography>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {new Date(signal.timestamp).toLocaleString()}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSignalsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignalProviderSystem;

