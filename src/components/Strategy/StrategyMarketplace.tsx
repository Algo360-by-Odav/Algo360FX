import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tooltip,
  Rating,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Search,
  FilterList,
  Star,
  TrendingUp,
  ShowChart,
  AttachMoney,
  Person,
  Verified,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  Info,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface Strategy {
  id: string;
  name: string;
  description: string;
  author: string;
  rating: number;
  reviews: number;
  price: number;
  returns: number;
  drawdown: number;
  trades: number;
  verified: boolean;
  tags: string[];
}

const StrategyMarketplace: React.FC = observer(() => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const strategies: Strategy[] = [
    {
      id: '1',
      name: 'MultiSignal Trend EA',
      description: 'Advanced trend following strategy using multiple timeframe analysis and machine learning signals.',
      author: 'TradingMaster',
      rating: 4.8,
      reviews: 156,
      price: 299,
      returns: 45.2,
      drawdown: 12.5,
      trades: 1250,
      verified: true,
      tags: ['Trend Following', 'Machine Learning', 'Multi-Timeframe'],
    },
    {
      id: '2',
      name: 'Smart Grid Pro',
      description: 'Intelligent grid trading system with dynamic position sizing and risk management.',
      author: 'AlgoTrader',
      rating: 4.6,
      reviews: 98,
      price: 199,
      returns: 32.8,
      drawdown: 15.3,
      trades: 3420,
      verified: true,
      tags: ['Grid Trading', 'Scalping', 'Risk Management'],
    },
    {
      id: '3',
      name: 'Breakout Master',
      description: 'Captures high-probability breakout opportunities using volatility and volume analysis.',
      author: 'BreakoutPro',
      rating: 4.5,
      reviews: 75,
      price: 149,
      returns: 28.5,
      drawdown: 18.2,
      trades: 856,
      verified: false,
      tags: ['Breakout', 'Volatility', 'Volume Analysis'],
    },
  ];

  const handleStrategySelect = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setDialogOpen(true);
  };

  const formatPercent = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <Box>
      {/* Search and Filter Bar */}
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search strategies..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" gap={1}>
              <Button startIcon={<FilterList />} variant="outlined">
                Filter
              </Button>
              <Button variant="outlined">Price</Button>
              <Button variant="outlined">Returns</Button>
              <Button variant="outlined">Rating</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Strategy Cards */}
      <Grid container spacing={3}>
        {strategies.map((strategy) => (
          <Grid item xs={12} md={4} key={strategy.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" component="div">
                    {strategy.name}
                  </Typography>
                  {strategy.verified && (
                    <Tooltip title="Verified Strategy">
                      <Verified color="primary" />
                    </Tooltip>
                  )}
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                    <Person />
                  </Avatar>
                  <Typography variant="body2" color="textSecondary">
                    {strategy.author}
                  </Typography>
                </Box>

                <Typography variant="body2" color="textSecondary" mb={2}>
                  {strategy.description}
                </Typography>

                <Box display="flex" gap={1} mb={2}>
                  {strategy.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Returns
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {formatPercent(strategy.returns)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Drawdown
                    </Typography>
                    <Typography variant="h6" color="error.main">
                      {formatPercent(strategy.drawdown)}
                    </Typography>
                  </Grid>
                </Grid>

                <Box display="flex" alignItems="center" mt={2}>
                  <Rating value={strategy.rating} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" color="textSecondary" ml={1}>
                    ({strategy.reviews} reviews)
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleStrategySelect(strategy)}
                >
                  ${strategy.price} - View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Strategy Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedStrategy && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                {selectedStrategy.name}
                {selectedStrategy.verified && <Verified color="primary" />}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    Strategy Overview
                  </Typography>
                  <Typography paragraph>{selectedStrategy.description}</Typography>

                  <Typography variant="h6" gutterBottom>
                    Performance Metrics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        Total Returns
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        {formatPercent(selectedStrategy.returns)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        Max Drawdown
                      </Typography>
                      <Typography variant="h6" color="error.main">
                        {formatPercent(selectedStrategy.drawdown)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        Total Trades
                      </Typography>
                      <Typography variant="h6">
                        {selectedStrategy.trades}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        Win Rate
                      </Typography>
                      <Typography variant="h6">
                        65.8%
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Pricing
                      </Typography>
                      <Typography variant="h4" color="primary" gutterBottom>
                        ${selectedStrategy.price}
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Full Strategy Code"
                            secondary="Immediate access to source code"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Documentation"
                            secondary="Setup guide and parameters"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Support"
                            secondary="60 days email support"
                          />
                        </ListItem>
                      </List>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                      >
                        Purchase Strategy
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
});

export default StrategyMarketplace;
