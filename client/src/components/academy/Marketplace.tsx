import React, { useState, useEffect } from 'react';
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
  Chip,
  Button,
  Tab,
  Tabs,
  Pagination,
  Card,
  CardContent,
  CircularProgress,
  Badge,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Drawer,
} from '@mui/material';
import {
  Search,
  FilterList,
  Sort,
  GridView,
  ViewList,
  BookmarkBorder,
  Bookmark,
  Close,
  TrendingUp,
  NewReleases,
  Star,
  LocalOffer,
  Psychology as PsychologyIcon,
  BarChart as StrategyIcon,
} from '@mui/icons-material';
import { useStores } from '../../stores/StoreProvider';
import { EbookCard } from './EbookCard';

export const Marketplace = observer(() => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { ebookStore } = useStores();
  
  // UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortOption, setSortOption] = useState('popular');
  const [currentTab, setCurrentTab] = useState(0);
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  
  // Filter options
  const categories = ['Technical Analysis', 'Fundamentals', 'Psychology', 'Strategy', 'Risk Management', 'Algorithmic Trading', 'Market Analysis'];
  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const formats = ['PDF', 'EPUB', 'MOBI', 'Video Course', 'Interactive'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'];
  
  // Pagination
  const itemsPerPage = 9;
  const filteredBooks = ebookStore.filteredEbooks || [];
  const pageCount = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedEbooks = filteredBooks.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1);
  }, [ebookStore.searchQuery, ebookStore.filters]);
  
  // Handlers
  const handlePurchase = (id: string) => {
    ebookStore.purchaseEbook(id);
  };
  
  const handleSortChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortOption(event.target.value);
    // Apply sorting logic in the store
    ebookStore.setSortOption(event.target.value);
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
    // Set appropriate filter based on tab
    switch (newValue) {
      case 0: // All
        ebookStore.setFilter('category', '');
        break;
      case 1: // Technical Analysis
        ebookStore.setFilter('category', 'Technical Analysis');
        break;
      case 2: // Fundamentals
        ebookStore.setFilter('category', 'Fundamentals');
        break;
      case 3: // Psychology
        ebookStore.setFilter('category', 'Psychology');
        break;
      case 4: // Strategy
        ebookStore.setFilter('category', 'Strategy');
        break;
      case 5: // Risk Management
        ebookStore.setFilter('category', 'Risk Management');
        break;
    }
  };
  
  const handleWishlist = (id: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(itemId => itemId !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };
  
  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  // Render filter panel (used in both desktop and mobile)
  const renderFilterPanel = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        {isMobile && (
          <IconButton onClick={toggleMobileFilters}>
            <Close />
          </IconButton>
        )}
      </Box>
      
      <Box sx={{ mb: 3 }}>
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

      <Typography variant="subtitle2" gutterBottom>Category</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        <Chip 
          label="All"
          onClick={() => ebookStore.setFilter('category', '')}
          color={ebookStore.filters.category === '' ? 'primary' : 'default'}
          variant={ebookStore.filters.category === '' ? 'filled' : 'outlined'}
        />
        {categories.map((category) => (
          <Chip
            key={category}
            label={category}
            onClick={() => ebookStore.setFilter('category', category)}
            color={ebookStore.filters.category === category ? 'primary' : 'default'}
            variant={ebookStore.filters.category === category ? 'filled' : 'outlined'}
          />
        ))}
      </Box>

      <Typography variant="subtitle2" gutterBottom>Level</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        <Chip 
          label="All Levels"
          onClick={() => ebookStore.setFilter('level', '')}
          color={ebookStore.filters.level === '' ? 'primary' : 'default'}
          variant={ebookStore.filters.level === '' ? 'filled' : 'outlined'}
        />
        {levels.map((level) => (
          <Chip
            key={level}
            label={level}
            onClick={() => ebookStore.setFilter('level', level)}
            color={ebookStore.filters.level === level ? 'primary' : 'default'}
            variant={ebookStore.filters.level === level ? 'filled' : 'outlined'}
          />
        ))}
      </Box>
      
      <Typography variant="subtitle2" gutterBottom>Format</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        <Chip 
          label="All Formats"
          onClick={() => ebookStore.setFilter('format', '')}
          color={ebookStore.filters.format === '' ? 'primary' : 'default'}
          variant={ebookStore.filters.format === '' ? 'filled' : 'outlined'}
        />
        {formats.map((format) => (
          <Chip
            key={format}
            label={format}
            onClick={() => ebookStore.setFilter('format', format)}
            color={ebookStore.filters.format === format ? 'primary' : 'default'}
            variant={ebookStore.filters.format === format ? 'filled' : 'outlined'}
          />
        ))}
      </Box>

      <Typography variant="subtitle2" gutterBottom>Price Range</Typography>
      <Box sx={{ px: 2, mb: 3 }}>
        <Slider
          value={ebookStore.filters.priceRange}
          onChange={(_, value) => ebookStore.setFilter('priceRange', value)}
          valueLabelDisplay="auto"
          min={0}
          max={100}
          marks={[
            { value: 0, label: '$0' },
            { value: 50, label: '$50' },
            { value: 100, label: '$100' },
          ]}
        />
      </Box>

      <Typography variant="subtitle2" gutterBottom>Minimum Rating</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Rating
          value={ebookStore.filters.rating}
          onChange={(_, value) => ebookStore.setFilter('rating', value || 0)}
          precision={0.5}
          size="large"
        />
        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
          {ebookStore.filters.rating > 0 ? `${ebookStore.filters.rating}+` : 'Any rating'}
        </Typography>
      </Box>
      
      <Typography variant="subtitle2" gutterBottom>Language</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        <Chip 
          label="All Languages"
          onClick={() => ebookStore.setFilter('language', '')}
          color={ebookStore.filters.language === '' ? 'primary' : 'default'}
          variant={ebookStore.filters.language === '' ? 'filled' : 'outlined'}
        />
        {languages.map((language) => (
          <Chip
            key={language}
            label={language}
            onClick={() => ebookStore.setFilter('language', language)}
            color={ebookStore.filters.language === language ? 'primary' : 'default'}
            variant={ebookStore.filters.language === language ? 'filled' : 'outlined'}
          />
        ))}
      </Box>
      
      <Button 
        variant="outlined" 
        color="primary" 
        fullWidth
        onClick={() => {
          ebookStore.resetFilters();
          setCurrentTab(0);
        }}
      >
        Reset Filters
      </Button>
    </Box>
  );

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Mobile filter drawer */}
      <Drawer
        anchor="left"
        open={mobileFiltersOpen}
        onClose={toggleMobileFilters}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 280 }}>
          {renderFilterPanel()}
        </Box>
      </Drawer>
      
      {/* Main content */}
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        <Grid container spacing={3}>
          {/* Desktop filters sidebar */}
          <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Paper elevation={2} sx={{ borderRadius: 2 }}>
              {renderFilterPanel()}
            </Paper>
          </Grid>

          {/* Ebook content area */}
          <Grid item xs={12} md={9}>
            {/* Mobile filter button and sort controls */}
            <Box sx={{ mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<FilterList />}
                      onClick={toggleMobileFilters}
                      sx={{ display: { xs: 'flex', md: 'none' } }}
                    >
                      Filters
                    </Button>
                    
                    <Badge 
                      badgeContent={
                        Object.values(ebookStore.filters).filter(v => 
                          v !== '' && 
                          v !== 0 && 
                          (Array.isArray(v) ? v[0] !== 0 : true)
                        ).length
                      } 
                      color="primary"
                    >
                      <FilterList />
                    </Badge>
                    
                    <Typography variant="body2" color="text.secondary">
                      {filteredBooks.length} results
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', justifyContent: { xs: 'flex-start', sm: 'flex-end' }, gap: 1 }}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Sort By</InputLabel>
                      <Select
                        value={sortOption}
                        onChange={handleSortChange as any}
                        label="Sort By"
                        startAdornment={<Sort sx={{ mr: 1 }} />}
                      >
                        <MenuItem value="popular">Most Popular</MenuItem>
                        <MenuItem value="newest">Newest First</MenuItem>
                        <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                        <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                        <MenuItem value="rating">Highest Rated</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <Box sx={{ display: 'flex', border: `1px solid ${theme.palette.divider}`, borderRadius: 1 }}>
                      <Tooltip title="Grid View">
                        <IconButton 
                          color={viewMode === 'grid' ? 'primary' : 'default'}
                          onClick={() => setViewMode('grid')}
                        >
                          <GridView />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="List View">
                        <IconButton 
                          color={viewMode === 'list' ? 'primary' : 'default'}
                          onClick={() => setViewMode('list')}
                        >
                          <ViewList />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            {/* Category tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs 
                value={currentTab} 
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                <Tab label="All" icon={<Star />} iconPosition="start" />
                <Tab label="Technical Analysis" icon={<TrendingUp />} iconPosition="start" />
                <Tab label="Fundamentals" icon={<NewReleases />} iconPosition="start" />
                <Tab label="Psychology" icon={<PsychologyIcon />} iconPosition="start" />
                <Tab label="Strategy" icon={<StrategyIcon />} iconPosition="start" />
                <Tab label="Risk Management" icon={<LocalOffer />} iconPosition="start" />
              </Tabs>
            </Box>
            
            {/* Ebooks grid/list */}
            {filteredBooks.length === 0 ? (
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>No results found</Typography>
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search or filter criteria
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }}
                  onClick={() => {
                    ebookStore.resetFilters();
                    setCurrentTab(0);
                  }}
                >
                  Reset Filters
                </Button>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {paginatedEbooks.map((ebook) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={viewMode === 'grid' ? 6 : 12} 
                    md={viewMode === 'grid' ? 4 : 12} 
                    key={ebook.id}
                  >
                    <EbookCard 
                      ebook={ebook} 
                      onPurchase={handlePurchase} 
                      viewMode={viewMode}
                      isWishlisted={wishlist.includes(ebook.id)}
                      onWishlistToggle={() => handleWishlist(ebook.id)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
            
            {/* Pagination */}
            {pageCount > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={pageCount} 
                  page={page} 
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
});
