import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Slider,
  Rating,
  Paper,
  InputAdornment,
  Divider,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useStores } from '../../stores/StoreProvider';
import { EbookCard } from './EbookCard';

export const Marketplace = observer(() => {
  const { ebookStore } = useStores();
  const [expanded, setExpanded] = useState(false);

  const categories = ['Technical Analysis', 'Fundamentals', 'Psychology', 'Strategy', 'Risk Management'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handlePurchase = (id: string) => {
    ebookStore.purchaseEbook(id);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Filters */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Search"
                variant="outlined"
                value={ebookStore.searchQuery}
                onChange={(e) => ebookStore.setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={ebookStore.filters.category}
                  label="Category"
                  onChange={(e) => ebookStore.setFilter('category', e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mt: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Level</InputLabel>
                <Select
                  value={ebookStore.filters.level}
                  label="Level"
                  onChange={(e) => ebookStore.setFilter('level', e.target.value)}
                >
                  <MenuItem value="">All Levels</MenuItem>
                  {levels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={ebookStore.filters.priceRange}
                onChange={(_, value) => ebookStore.setFilter('priceRange', value)}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                marks={[
                  { value: 0, label: '$0' },
                  { value: 100, label: '$100' },
                ]}
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography gutterBottom>Minimum Rating</Typography>
              <Rating
                value={ebookStore.filters.rating}
                onChange={(_, value) => ebookStore.setFilter('rating', value)}
                precision={0.5}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Ebook Grid */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {ebookStore.filteredEbooks.map((ebook) => (
              <Grid item xs={12} sm={6} md={4} key={ebook.id}>
                <EbookCard ebook={ebook} onPurchase={handlePurchase} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
});

