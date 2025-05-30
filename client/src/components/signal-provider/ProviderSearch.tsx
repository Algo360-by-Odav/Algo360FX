import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import {
  Search,
  FilterList,
  CheckCircle,
  TrendingUp,
  Star,
  Info,
  Sort,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useStores } from '../../stores/StoreProvider';

export const ProviderSearch = observer(() => {
  const { signalProviderStore } = useStores();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sortBy, setSortBy] = useState('performance');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterStrategy, setFilterStrategy] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const handleOpenDialog = (provider: any) => {
    setSelectedProvider(provider);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSubscribe = (provider: any) => {
    // Implement subscription logic
    console.log('Subscribe to provider:', provider.name);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box>
      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="performance">Performance</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="subscribers">Subscribers</MenuItem>
                <MenuItem value="price">Price</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Risk Level</InputLabel>
              <Select
                value={filterRisk}
                label="Risk Level"
                onChange={(e) => setFilterRisk(e.target.value)}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="low">Low Risk</MenuItem>
                <MenuItem value="medium">Medium Risk</MenuItem>
                <MenuItem value="high">High Risk</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Strategy</InputLabel>
              <Select
                value={filterStrategy}
                label="Strategy"
                onChange={(e) => setFilterStrategy(e.target.value)}
              >
                <MenuItem value="all">All Strategies</MenuItem>
                <MenuItem value="swing">Swing Trading</MenuItem>
                <MenuItem value="scalping">Scalping</MenuItem>
                <MenuItem value="momentum">Momentum</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Price Range</InputLabel>
              <Select
                value={priceRange}
                label="Price Range"
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <MenuItem value="all">All Prices</MenuItem>
                <MenuItem value="0-100">$0 - $100</MenuItem>
                <MenuItem value="100-300">$100 - $300</MenuItem>
                <MenuItem value="300+">$300+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Provider Cards */}
      <Grid container spacing={3}>
        {signalProviderStore.getProviders().map((provider) => (
          <Grid item xs={12} md={6} key={provider.id}>
            <Card>
              <CardContent>
                {/* Provider Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}
                  >
                    {provider.name[0]}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="h6" sx={{ mr: 1 }}>
                        {provider.name}
                      </Typography>
                      {provider.verified && (
                        <CheckCircle color="primary" sx={{ fontSize: 20 }} />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating
                        value={provider.subscription.rating}
                        readOnly
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({provider.subscription.reviews} reviews)
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={formatCurrency(provider.subscription.price) + '/month'}
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                {/* Provider Stats */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                      Total Return
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      +{provider.performance.totalReturn}%
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                      Win Rate
                    </Typography>
                    <Typography variant="h6">
                      {provider.performance.winRate}%
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                      Subscribers
                    </Typography>
                    <Typography variant="h6">
                      {provider.subscription.subscribers}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="body2" color="text.secondary">
                      Risk Level
                    </Typography>
                    <Chip
                      label={provider.risk.riskLevel}
                      size="small"
                      color={
                        provider.risk.riskLevel.toLowerCase() === 'low'
                          ? 'success'
                          : provider.risk.riskLevel.toLowerCase() === 'medium'
                          ? 'warning'
                          : 'error'
                      }
                    />
                  </Grid>
                </Grid>

                {/* Strategy Info */}
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {provider.description}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Strategy: {provider.strategy.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Instruments: {provider.strategy.instruments.join(', ')}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Info />}
                  onClick={() => handleOpenDialog(provider)}
                >
                  View Details
                </Button>
                <Button
                  variant="contained"
                  startIcon={<TrendingUp />}
                  onClick={() => handleSubscribe(provider)}
                >
                  Subscribe
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Provider Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedProvider && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ flex: 1 }}>
                  {selectedProvider.name}
                </Typography>
                {selectedProvider.verified && (
                  <CheckCircle color="primary" sx={{ ml: 1 }} />
                )}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Performance Chart */}
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Performance History
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer>
                      <LineChart
                        data={[
                          { month: 'Jan', return: 5.2 },
                          { month: 'Feb', return: 3.8 },
                          { month: 'Mar', return: 7.1 },
                          { month: 'Apr', return: 4.5 },
                          { month: 'May', return: 6.3 },
                          { month: 'Jun', return: 5.9 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="return"
                          stroke="#8884d8"
                          name="Return %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>

                {/* Detailed Stats */}
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Return: {selectedProvider.performance.totalReturn}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Win Rate: {selectedProvider.performance.winRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Profit Factor: {selectedProvider.performance.profitFactor}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Max Drawdown: {selectedProvider.performance.maxDrawdown}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sharpe Ratio: {selectedProvider.performance.sharpeRatio}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Trading Style
                  </Typography>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Average Trades: {selectedProvider.performance.avgTradesPerMonth}/month
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Holding Time: {selectedProvider.performance.avgHoldingTime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Risk Level: {selectedProvider.risk.riskLevel}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Margin Required: {formatCurrency(selectedProvider.risk.marginRequired)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                variant="contained"
                onClick={() => handleSubscribe(selectedProvider)}
              >
                Subscribe
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
});

