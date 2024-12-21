import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Star as StarIcon,
  Download as DownloadIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';

interface Strategy {
  id: string;
  name: string;
  description: string;
  author: string;
  rating: number;
  reviews: number;
  downloads: number;
  price: number;
  tags: string[];
  performance: {
    winRate: number;
    profitFactor: number;
    sharpeRatio: number;
  };
}

const sampleStrategies: Strategy[] = [
  {
    id: '1',
    name: 'MA Crossover Pro',
    description: 'Advanced moving average crossover strategy with dynamic parameters and smart entry/exit rules.',
    author: 'TradingMaster',
    rating: 4.5,
    reviews: 128,
    downloads: 1250,
    price: 0,
    tags: ['Trend Following', 'Moving Average', 'Beginner Friendly'],
    performance: {
      winRate: 65.2,
      profitFactor: 1.8,
      sharpeRatio: 1.2,
    },
  },
  {
    id: '2',
    name: 'RSI Reversal Elite',
    description: 'Catch market reversals using RSI with advanced confirmation signals.',
    author: 'AlgoTrader',
    rating: 4.8,
    reviews: 256,
    downloads: 2800,
    price: 49.99,
    tags: ['Mean Reversion', 'RSI', 'Professional'],
    performance: {
      winRate: 72.5,
      profitFactor: 2.1,
      sharpeRatio: 1.5,
    },
  },
  {
    id: '3',
    name: 'Breakout Hunter',
    description: 'Identify and trade high-probability breakout patterns with volume confirmation.',
    author: 'BreakoutPro',
    rating: 4.2,
    reviews: 95,
    downloads: 850,
    price: 29.99,
    tags: ['Breakout', 'Volume Analysis', 'Intermediate'],
    performance: {
      winRate: 58.7,
      profitFactor: 1.6,
      sharpeRatio: 1.1,
    },
  },
];

const Marketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (strategyId: string) => {
    setFavorites(prev =>
      prev.includes(strategyId)
        ? prev.filter(id => id !== strategyId)
        : [...prev, strategyId]
    );
  };

  return (
    <Box sx={{
      p: 3,
      minHeight: '100vh',
      bgcolor: 'background.default',
      color: 'text.primary'
    }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Strategy Marketplace</Typography>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search strategies..."
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
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
              >
                Filter
              </Button>
              <Button
                variant="outlined"
              >
                Price: All
              </Button>
              <Button
                variant="outlined"
              >
                Rating: All
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Strategy Cards */}
      <Grid container spacing={3}>
        {sampleStrategies.map((strategy) => (
          <Grid item xs={12} md={4} key={strategy.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" component="div">
                    {strategy.name}
                  </Typography>
                  <IconButton
                    onClick={() => toggleFavorite(strategy.id)}
                    color="primary"
                  >
                    {favorites.includes(strategy.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {strategy.description}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  {strategy.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" />
                  ))}
                </Stack>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    by {strategy.author}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Rating
                      value={strategy.rating}
                      readOnly
                      precision={0.1}
                      size="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      ({strategy.reviews} reviews)
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Win Rate</Typography>
                    <Typography variant="body1">{strategy.performance.winRate}%</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Profit Factor</Typography>
                    <Typography variant="body1">{strategy.performance.profitFactor}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Sharpe Ratio</Typography>
                    <Typography variant="body1">{strategy.performance.sharpeRatio}</Typography>
                  </Grid>
                </Grid>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Typography variant="h6" color="primary">
                  {strategy.price === 0 ? 'Free' : `$${strategy.price}`}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  size="large"
                >
                  {strategy.price === 0 ? 'Download' : 'Buy Now'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Marketplace;
