import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Chip,
  IconButton,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import {
  StrategyCategory,
  RiskLevel,
  TimeHorizon,
  ComplexityLevel,
  MarketCondition,
  StrategyFilter,
  StrategyTag,
} from '../../../types/strategy-categories';

interface StrategyFiltersProps {
  onFilterChange: (filters: StrategyFilter) => void;
  availableTags: StrategyTag[];
}

const StrategyFilters: React.FC<StrategyFiltersProps> = ({
  onFilterChange,
  availableTags,
}) => {
  const [filters, setFilters] = useState<StrategyFilter>({
    categories: [],
    riskLevels: [],
    timeHorizons: [],
    complexityLevels: [],
    marketConditions: [],
    tags: [],
    minWinRate: 0,
    minProfitFactor: 0,
    minSharpeRatio: 0,
    maxDrawdown: 100,
    minRating: 0,
    searchText: '',
    sortBy: 'popularity',
    sortOrder: 'desc',
  });

  const handleFilterChange = (newFilters: Partial<StrategyFilter>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search strategies..."
          value={filters.searchText}
          onChange={(e) => handleFilterChange({ searchText: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Categories */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Categories</InputLabel>
            <Select
              multiple
              value={filters.categories || []}
              onChange={(e) =>
                handleFilterChange({
                  categories: e.target.value as StrategyCategory[],
                })
              }
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {Object.values(StrategyCategory).map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Risk Levels */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Risk Level</InputLabel>
            <Select
              multiple
              value={filters.riskLevels || []}
              onChange={(e) =>
                handleFilterChange({ riskLevels: e.target.value as RiskLevel[] })
              }
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {Object.values(RiskLevel).map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Time Horizons */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Time Horizon</InputLabel>
            <Select
              multiple
              value={filters.timeHorizons || []}
              onChange={(e) =>
                handleFilterChange({
                  timeHorizons: e.target.value as TimeHorizon[],
                })
              }
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {Object.values(TimeHorizon).map((horizon) => (
                <MenuItem key={horizon} value={horizon}>
                  {horizon}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Complexity Levels */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Complexity Level</InputLabel>
            <Select
              multiple
              value={filters.complexityLevels || []}
              onChange={(e) =>
                handleFilterChange({
                  complexityLevels: e.target.value as ComplexityLevel[],
                })
              }
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {Object.values(ComplexityLevel).map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Market Conditions */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Market Condition</InputLabel>
            <Select
              multiple
              value={filters.marketConditions || []}
              onChange={(e) =>
                handleFilterChange({
                  marketConditions: e.target.value as MarketCondition[],
                })
              }
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {Object.values(MarketCondition).map((condition) => (
                <MenuItem key={condition} value={condition}>
                  {condition}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Tags */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            options={availableTags}
            getOptionLabel={(option) => option.name}
            value={availableTags.filter((tag) =>
              filters.tags?.includes(tag.id)
            )}
            onChange={(_, newValue) =>
              handleFilterChange({
                tags: newValue.map((tag) => tag.id),
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Strategy Tags" />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.name}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
          />
        </Grid>

        {/* Performance Filters */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" gutterBottom>
            Performance Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography gutterBottom>Min Win Rate (%)</Typography>
              <Slider
                value={filters.minWinRate}
                onChange={(_, value) =>
                  handleFilterChange({ minWinRate: value as number })
                }
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography gutterBottom>Min Profit Factor</Typography>
              <Slider
                value={filters.minProfitFactor}
                onChange={(_, value) =>
                  handleFilterChange({ minProfitFactor: value as number })
                }
                min={0}
                max={5}
                step={0.1}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography gutterBottom>Min Sharpe Ratio</Typography>
              <Slider
                value={filters.minSharpeRatio}
                onChange={(_, value) =>
                  handleFilterChange({ minSharpeRatio: value as number })
                }
                min={0}
                max={5}
                step={0.1}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography gutterBottom>Max Drawdown (%)</Typography>
              <Slider
                value={filters.maxDrawdown}
                onChange={(_, value) =>
                  handleFilterChange({ maxDrawdown: value as number })
                }
                min={0}
                max={100}
                valueLabelDisplay="auto"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Sort Options */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                onChange={(e) =>
                  handleFilterChange({
                    sortBy: e.target.value as StrategyFilter['sortBy'],
                  })
                }
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="popularity">Popularity</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="winRate">Win Rate</MenuItem>
                <MenuItem value="profitFactor">Profit Factor</MenuItem>
                <MenuItem value="sharpeRatio">Sharpe Ratio</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Order</InputLabel>
              <Select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange({
                    sortOrder: e.target.value as 'asc' | 'desc',
                  })
                }
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StrategyFilters;
