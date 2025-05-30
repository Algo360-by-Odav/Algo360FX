import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  FilterList,
  Sort,
  Verified,
  TrendingUp,
  ArrowUpward,
  ArrowDownward,
  Star,
  StarBorder,
  CompareArrows,
  Visibility,
  Info,
} from '@mui/icons-material';
import { useStores } from '../../stores/storeProviderJs';
import ProviderProfile from './ProviderProfile';

export const ProvidersDirectory = observer(() => {
  const { signalProviderStore } = useStores();
  const providers = signalProviderStore.getProviders();
  
  // Generate more mock providers for demonstration
  const allProviders = [...providers];
  for (let i = 3; i <= 12; i++) {
    allProviders.push({
      id: i,
      name: `Provider ${i}`,
      verified: i % 3 === 0,
      description: `Signal provider specializing in ${i % 2 === 0 ? 'swing' : 'day'} trading with a focus on ${i % 3 === 0 ? 'major pairs' : i % 3 === 1 ? 'cross pairs' : 'exotics'}.`,
      risk: {
        riskLevel: i % 3 === 0 ? 'Low' : i % 3 === 1 ? 'Medium' : 'High',
        drawdown: 5 + (i * 1.5),
        winRate: 50 + (i * 2),
      },
      performance: {
        totalReturn: 20 + (i * 5),
        monthlyReturn: 2 + (i * 0.5),
        winRate: 50 + (i * 2),
        profitFactor: 1 + (i * 0.2),
        totalSignals: 100 + (i * 20),
        avgTradesPerMonth: 10 + (i * 2),
      },
      subscription: {
        subscribers: 100 + (i * 100),
        rating: 3 + (Math.random() * 2),
        reviews: 10 + (i * 15),
        price: 50 + (i * 10),
      },
      strategy: {
        type: i % 3 === 0 ? 'Trend Following' : i % 3 === 1 ? 'Mean Reversion' : 'Breakout',
        instruments: ['EUR/USD', 'GBP/USD', 'USD/JPY'].slice(0, 1 + (i % 3)),
        timeframes: ['H1', 'H4', 'Daily'].slice(0, 1 + (i % 3)),
      },
      activeSince: `2023-${(i % 12) + 1}-${(i % 28) + 1}`,
    });
  }
  
  // State for filters and pagination
  const [filteredProviders, setFilteredProviders] = useState(allProviders);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskLevel, setRiskLevel] = useState('all');
  const [minWinRate, setMinWinRate] = useState(0);
  const [sortBy, setSortBy] = useState('subscribers');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  
  // Apply filters
  useEffect(() => {
    let result = [...allProviders];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(provider => 
        provider.name.toLowerCase().includes(query) ||
        provider.description.toLowerCase().includes(query) ||
        provider.strategy.type.toLowerCase().includes(query)
      );
    }
    
    // Apply risk level filter
    if (riskLevel !== 'all') {
      result = result.filter(provider => provider.risk.riskLevel === riskLevel);
    }
    
    // Apply win rate filter
    if (minWinRate > 0) {
      result = result.filter(provider => provider.performance.winRate >= minWinRate);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'subscribers':
          return b.subscription.subscribers - a.subscription.subscribers;
        case 'rating':
          return b.subscription.rating - a.subscription.rating;
        case 'winRate':
          return b.performance.winRate - a.performance.winRate;
        case 'return':
          return b.performance.totalReturn - a.performance.totalReturn;
        case 'price-low':
          return a.subscription.price - b.subscription.price;
        case 'price-high':
          return b.subscription.price - a.subscription.price;
        default:
          return 0;
      }
    });
    
    setFilteredProviders(result);
  }, [searchQuery, riskLevel, minWinRate, sortBy, allProviders]);
  
  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Open provider profile
  const handleOpenProfile = (providerId: number) => {
    setSelectedProvider(providerId);
    setProfileOpen(true);
  };
  
  // Close provider profile
  const handleCloseProfile = () => {
    setProfileOpen(false);
  };
  
  // Toggle provider selection for comparison
  const handleToggleComparison = (providerId: number) => {
    if (selectedForComparison.includes(providerId)) {
      setSelectedForComparison(selectedForComparison.filter(id => id !== providerId));
    } else {
      if (selectedForComparison.length < 3) {
        setSelectedForComparison([...selectedForComparison, providerId]);
      }
    }
  };
  
  // Toggle compare mode
  const handleToggleCompareMode = () => {
    setCompareMode(!compareMode);
    if (!compareMode) {
      setSelectedForComparison([]);
    }
  };
  
  // Start comparison
  const handleStartComparison = () => {
    if (selectedForComparison.length >= 2) {
      // In a real app, this would navigate to a comparison page
      console.log('Comparing providers:', selectedForComparison);
    }
  };
  
  // Calculate pagination
  const paginatedProviders = filteredProviders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
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
              size="small"
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Risk Level</InputLabel>
              <Select
                value={riskLevel}
                label="Risk Level"
                onChange={(e) => setRiskLevel(e.target.value as string)}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Min Win Rate</InputLabel>
              <Select
                value={minWinRate}
                label="Min Win Rate"
                onChange={(e) => setMinWinRate(e.target.value as number)}
              >
                <MenuItem value={0}>Any</MenuItem>
                <MenuItem value={50}>50%+</MenuItem>
                <MenuItem value={60}>60%+</MenuItem>
                <MenuItem value={70}>70%+</MenuItem>
                <MenuItem value={80}>80%+</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value as string)}
                startAdornment={
                  <InputAdornment position="start">
                    <Sort fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="subscribers">Most Popular</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
                <MenuItem value="winRate">Best Win Rate</MenuItem>
                <MenuItem value="return">Highest Return</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('grid')}
                size="small"
                sx={{ flex: 1 }}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('table')}
                size="small"
                sx={{ flex: 1 }}
              >
                Table
              </Button>
            </Box>
          </Grid>
        </Grid>
        
        {/* Compare Mode Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              {filteredProviders.length} providers found
            </Typography>
          </Box>
          
          <Box>
            <Button
              variant={compareMode ? 'contained' : 'outlined'}
              color="primary"
              startIcon={<CompareArrows />}
              onClick={handleToggleCompareMode}
              size="small"
              sx={{ mr: 1 }}
            >
              {compareMode ? 'Cancel Comparison' : 'Compare Providers'}
            </Button>
            
            {compareMode && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleStartComparison}
                disabled={selectedForComparison.length < 2}
                size="small"
              >
                Compare Selected ({selectedForComparison.length})
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
      
      {/* Grid View */}
      {viewMode === 'grid' && (
        <Grid container spacing={3}>
          {paginatedProviders.map((provider) => (
            <Grid item xs={12} sm={6} md={4} key={provider.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          width: 48,
                          height: 48,
                          mr: 1,
                        }}
                      >
                        {provider.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="h6" component="div">
                            {provider.name}
                          </Typography>
                          {provider.verified && (
                            <Verified color="primary" sx={{ ml: 0.5 }} fontSize="small" />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Active since {provider.activeSince}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {compareMode && (
                      <Chip
                        label={selectedForComparison.includes(provider.id) ? 'Selected' : 'Select'}
                        color={selectedForComparison.includes(provider.id) ? 'primary' : 'default'}
                        onClick={() => handleToggleComparison(provider.id)}
                        size="small"
                      />
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {provider.description}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Win Rate</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        {provider.performance.winRate}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Total Return</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                        {provider.performance.totalReturn}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Risk Level</Typography>
                      <Typography variant="body1">
                        <Chip
                          label={provider.risk.riskLevel}
                          size="small"
                          color={
                            provider.risk.riskLevel === 'Low'
                              ? 'success'
                              : provider.risk.riskLevel === 'Medium'
                              ? 'warning'
                              : 'error'
                          }
                        />
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Subscribers</Typography>
                      <Typography variant="body1">
                        {provider.subscription.subscribers.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={provider.subscription.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {provider.subscription.rating.toFixed(1)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                      ({provider.subscription.reviews} reviews)
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {provider.strategy.instruments.map(instrument => (
                      <Chip key={instrument} label={instrument} size="small" />
                    ))}
                    <Chip label={provider.strategy.type} size="small" color="primary" />
                  </Box>
                </CardContent>
                
                <Divider />
                
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary">
                    ${provider.subscription.price}/mo
                  </Typography>
                  <Box>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenProfile(provider.id)}
                      sx={{ mr: 1 }}
                    >
                      Details
                    </Button>
                    <Button variant="contained" size="small">
                      Subscribe
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Table View */}
      {viewMode === 'table' && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Provider</TableCell>
                <TableCell align="center">Win Rate</TableCell>
                <TableCell align="center">Return</TableCell>
                <TableCell align="center">Risk Level</TableCell>
                <TableCell align="center">Rating</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProviders.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          bgcolor: 'primary.main',
                          width: 32,
                          height: 32,
                          mr: 1,
                        }}
                      >
                        {provider.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body1">
                            {provider.name}
                          </Typography>
                          {provider.verified && (
                            <Verified color="primary" sx={{ ml: 0.5 }} fontSize="small" />
                          )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          {provider.strategy.type}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {provider.performance.winRate}%
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                      {provider.performance.totalReturn}%
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={provider.risk.riskLevel}
                      size="small"
                      color={
                        provider.risk.riskLevel === 'Low'
                          ? 'success'
                          : provider.risk.riskLevel === 'Medium'
                          ? 'warning'
                          : 'error'
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Rating value={provider.subscription.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="caption" sx={{ ml: 1 }}>
                        ({provider.subscription.reviews})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                      ${provider.subscription.price}/mo
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <IconButton size="small" onClick={() => handleOpenProfile(provider.id)}>
                        <Visibility fontSize="small" />
                      </IconButton>
                      {compareMode && (
                        <IconButton
                          size="small"
                          color={selectedForComparison.includes(provider.id) ? 'primary' : 'default'}
                          onClick={() => handleToggleComparison(provider.id)}
                        >
                          <CompareArrows fontSize="small" />
                        </IconButton>
                      )}
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        Subscribe
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredProviders.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{ mt: 2 }}
      />
      
      {/* Provider Profile Dialog */}
      {selectedProvider !== null && (
        <Dialog open={profileOpen} onClose={handleCloseProfile} maxWidth="lg" fullWidth>
          <DialogContent sx={{ p: 0 }}>
            <ProviderProfile providerId={selectedProvider} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseProfile}>Close</Button>
            <Button variant="contained" color="primary">
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
});

export default ProvidersDirectory;
