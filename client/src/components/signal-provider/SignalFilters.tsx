import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Typography,
  IconButton,
  Collapse,
  Divider,
} from '@mui/material';
import {
  Search,
  FilterList,
  Sort,
  ExpandMore,
  ExpandLess,
  Clear,
} from '@mui/icons-material';
import { useStores } from '../../stores/storeProviderJs';

export const SignalFilters = observer(({ onFilterChange }: { onFilterChange: (filters: any) => void }) => {
  const { signalProviderStore } = useStores();
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [currencyPair, setCurrencyPair] = useState('all');
  const [timeframe, setTimeframe] = useState('all');
  const [riskLevel, setRiskLevel] = useState('all');
  const [profitability, setProfitability] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  
  // Available currency pairs
  const currencyPairs = [
    'all',
    'EUR/USD',
    'GBP/USD',
    'USD/JPY',
    'AUD/USD',
    'USD/CAD',
    'USD/CHF',
    'NZD/USD',
  ];
  
  // Available timeframes
  const timeframes = [
    'all',
    'M5',
    'M15',
    'M30',
    'H1',
    'H4',
    'D1',
    'W1',
  ];
  
  // Risk levels
  const riskLevels = [
    'all',
    'Low',
    'Medium',
    'High',
  ];
  
  // Profitability options
  const profitabilityOptions = [
    'all',
    'Profitable',
    'Break-even',
    'Loss',
  ];
  
  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'profit-high', label: 'Highest Profit' },
    { value: 'profit-low', label: 'Lowest Profit' },
    { value: 'risk-low', label: 'Lowest Risk' },
    { value: 'risk-high', label: 'Highest Risk' },
    { value: 'win-rate', label: 'Best Win Rate' },
  ];
  
  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    applyFilters(event.target.value, currencyPair, timeframe, riskLevel, profitability, sortBy);
  };
  
  // Handle currency pair change
  const handleCurrencyPairChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setCurrencyPair(value);
    applyFilters(searchQuery, value, timeframe, riskLevel, profitability, sortBy);
  };
  
  // Handle timeframe change
  const handleTimeframeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setTimeframe(value);
    applyFilters(searchQuery, currencyPair, value, riskLevel, profitability, sortBy);
  };
  
  // Handle risk level change
  const handleRiskLevelChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setRiskLevel(value);
    applyFilters(searchQuery, currencyPair, timeframe, value, profitability, sortBy);
  };
  
  // Handle profitability change
  const handleProfitabilityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setProfitability(value);
    applyFilters(searchQuery, currencyPair, timeframe, riskLevel, value, sortBy);
  };
  
  // Handle sort change
  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string;
    setSortBy(value);
    applyFilters(searchQuery, currencyPair, timeframe, riskLevel, profitability, value);
  };
  
  // Toggle advanced filters
  const toggleAdvancedFilters = () => {
    setAdvancedFiltersOpen(!advancedFiltersOpen);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setCurrencyPair('all');
    setTimeframe('all');
    setRiskLevel('all');
    setProfitability('all');
    setSortBy('newest');
    applyFilters('', 'all', 'all', 'all', 'all', 'newest');
  };
  
  // Apply filters and notify parent component
  const applyFilters = (
    search: string,
    pair: string,
    tf: string,
    risk: string,
    profit: string,
    sort: string
  ) => {
    const filters = {
      searchQuery: search,
      currencyPair: pair,
      timeframe: tf,
      riskLevel: risk,
      profitability: profit,
      sortBy: sort,
    };
    
    // Update store filters
    signalProviderStore.filters = {
      pair: pair,
      timeframe: tf,
      riskLevel: risk,
      profitability: profit,
      status: 'active',
    };
    signalProviderStore.searchQuery = search;
    signalProviderStore.sortBy = sort;
    
    // Notify parent component
    onFilterChange(filters);
  };
  
  // Count active filters (excluding sort)
  const activeFilterCount = [
    currencyPair !== 'all',
    timeframe !== 'all',
    riskLevel !== 'all',
    profitability !== 'all',
    searchQuery !== '',
  ].filter(Boolean).length;
  
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2}>
        {/* Search Bar */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search signals or providers..."
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSearchQuery('');
                      applyFilters('', currencyPair, timeframe, riskLevel, profitability, sortBy);
                    }}
                  >
                    <Clear fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        {/* Sort Dropdown */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
              startAdornment={
                <InputAdornment position="start">
                  <Sort fontSize="small" />
                </InputAdornment>
              }
            >
              {sortOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        {/* Filter Toggle Button */}
        <Grid item xs={12} md={3}>
          <Button
            fullWidth
            variant={advancedFiltersOpen ? "contained" : "outlined"}
            color="primary"
            onClick={toggleAdvancedFilters}
            startIcon={<FilterList />}
            endIcon={advancedFiltersOpen ? <ExpandLess /> : <ExpandMore />}
            sx={{ height: '100%' }}
          >
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        </Grid>
        
        {/* Advanced Filters */}
        <Grid item xs={12}>
          <Collapse in={advancedFiltersOpen}>
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Currency Pair</InputLabel>
                    <Select
                      value={currencyPair}
                      label="Currency Pair"
                      onChange={handleCurrencyPairChange}
                    >
                      {currencyPairs.map(pair => (
                        <MenuItem key={pair} value={pair}>
                          {pair === 'all' ? 'All Pairs' : pair}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Timeframe</InputLabel>
                    <Select
                      value={timeframe}
                      label="Timeframe"
                      onChange={handleTimeframeChange}
                    >
                      {timeframes.map(tf => (
                        <MenuItem key={tf} value={tf}>
                          {tf === 'all' ? 'All Timeframes' : tf}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Risk Level</InputLabel>
                    <Select
                      value={riskLevel}
                      label="Risk Level"
                      onChange={handleRiskLevelChange}
                    >
                      {riskLevels.map(risk => (
                        <MenuItem key={risk} value={risk}>
                          {risk === 'all' ? 'All Risk Levels' : risk}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Profitability</InputLabel>
                    <Select
                      value={profitability}
                      label="Profitability"
                      onChange={handleProfitabilityChange}
                    >
                      {profitabilityOptions.map(option => (
                        <MenuItem key={option} value={option}>
                          {option === 'all' ? 'All Results' : option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="text"
                  onClick={resetFilters}
                  sx={{ mr: 1 }}
                >
                  Reset Filters
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => applyFilters(searchQuery, currencyPair, timeframe, riskLevel, profitability, sortBy)}
                >
                  Apply Filters
                </Button>
              </Box>
            </Box>
          </Collapse>
        </Grid>
        
        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {searchQuery && (
                <Chip
                  label={`Search: ${searchQuery}`}
                  onDelete={() => {
                    setSearchQuery('');
                    applyFilters('', currencyPair, timeframe, riskLevel, profitability, sortBy);
                  }}
                  size="small"
                />
              )}
              
              {currencyPair !== 'all' && (
                <Chip
                  label={`Pair: ${currencyPair}`}
                  onDelete={() => {
                    setCurrencyPair('all');
                    applyFilters(searchQuery, 'all', timeframe, riskLevel, profitability, sortBy);
                  }}
                  size="small"
                />
              )}
              
              {timeframe !== 'all' && (
                <Chip
                  label={`Timeframe: ${timeframe}`}
                  onDelete={() => {
                    setTimeframe('all');
                    applyFilters(searchQuery, currencyPair, 'all', riskLevel, profitability, sortBy);
                  }}
                  size="small"
                />
              )}
              
              {riskLevel !== 'all' && (
                <Chip
                  label={`Risk: ${riskLevel}`}
                  onDelete={() => {
                    setRiskLevel('all');
                    applyFilters(searchQuery, currencyPair, timeframe, 'all', profitability, sortBy);
                  }}
                  size="small"
                />
              )}
              
              {profitability !== 'all' && (
                <Chip
                  label={`Result: ${profitability}`}
                  onDelete={() => {
                    setProfitability('all');
                    applyFilters(searchQuery, currencyPair, timeframe, riskLevel, 'all', sortBy);
                  }}
                  size="small"
                />
              )}
              
              {activeFilterCount > 1 && (
                <Chip
                  label="Clear All"
                  onDelete={resetFilters}
                  color="primary"
                  size="small"
                />
              )}
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
});

export default SignalFilters;
