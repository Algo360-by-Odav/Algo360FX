import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';

interface NewsSearchProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

const NewsSearch: React.FC<NewsSearchProps> = observer(({ onSearch, loading = false }) => {
  const { newsStore } = useStores();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    'Market Analysis',
    'Economic Indicators',
    'Company News',
    'Currency News',
    'Commodity News',
    'Global Markets',
  ];

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    onSearch('');
  };

  useEffect(() => {
    if (selectedCategories.length > 0) {
      const categoryQuery = selectedCategories.join(' OR ');
      onSearch(`${searchQuery} (${categoryQuery})`);
    }
  }, [selectedCategories]);

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={clearSearch}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            onClick={() => setShowFilters(!showFilters)}
            color={showFilters ? 'primary' : 'default'}
          >
            <FilterIcon />
          </IconButton>
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Search'}
          </Button>
        </Box>

        {showFilters && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => handleCategoryToggle(category)}
                  color={selectedCategories.includes(category) ? 'primary' : 'default'}
                  variant={selectedCategories.includes(category) ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
});

export default NewsSearch;
