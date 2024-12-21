import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Rating,
  Chip,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import './Marketplace.css';

interface TradingBot {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  author: string;
  tags: string[];
  performance: {
    monthlyReturn: number;
    winRate: number;
  };
}

const mockBots: TradingBot[] = [
  {
    id: '1',
    name: 'Trend Follower Pro',
    description: 'Advanced trend following strategy with multiple timeframe analysis',
    price: 299,
    rating: 4.5,
    reviews: 128,
    author: 'TradingMaster',
    tags: ['Trend Following', 'Multi-timeframe', 'Forex'],
    performance: {
      monthlyReturn: 8.5,
      winRate: 65,
    },
  },
  // Add more mock bots here
];

const Marketplace: React.FC = () => {
  const [sortBy, setSortBy] = useState('popular');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="marketplace">
      <Box className="marketplace-header">
        <Typography variant="h4" component="h1">
          Trading Bot Marketplace
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Discover and purchase automated trading strategies
        </Typography>
      </Box>

      <Box className="marketplace-filters">
        <TextField
          className="search-field"
          placeholder="Search trading bots..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" className="sort-select">
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="popular">Most Popular</MenuItem>
            <MenuItem value="rating">Highest Rated</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
            <MenuItem value="performance">Best Performance</MenuItem>
          </Select>
        </FormControl>

        <IconButton>
          <FilterIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3} className="bot-grid">
        {mockBots.map((bot) => (
          <Grid item xs={12} sm={6} md={4} key={bot.id}>
            <Card className="bot-card">
              <CardContent>
                <Typography variant="h6" component="h2">
                  {bot.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  className="bot-description"
                >
                  {bot.description}
                </Typography>
                <Box className="bot-tags">
                  {bot.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      className="bot-tag"
                    />
                  ))}
                </Box>
                <Box className="bot-stats">
                  <Box className="stat-item">
                    <Typography variant="subtitle2" color="text.secondary">
                      Monthly Return
                    </Typography>
                    <Typography
                      variant="h6"
                      color={bot.performance.monthlyReturn > 0 ? 'success.main' : 'error.main'}
                    >
                      {bot.performance.monthlyReturn}%
                    </Typography>
                  </Box>
                  <Box className="stat-item">
                    <Typography variant="subtitle2" color="text.secondary">
                      Win Rate
                    </Typography>
                    <Typography variant="h6">
                      {bot.performance.winRate}%
                    </Typography>
                  </Box>
                </Box>
                <Box className="bot-rating">
                  <Rating
                    value={bot.rating}
                    readOnly
                    precision={0.5}
                    icon={<StarIcon fontSize="small" />}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ({bot.reviews} reviews)
                  </Typography>
                </Box>
              </CardContent>
              <CardActions className="bot-actions">
                <Typography variant="h6" color="primary">
                  ${bot.price}
                </Typography>
                <Button variant="contained" color="primary">
                  Purchase
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Marketplace;
