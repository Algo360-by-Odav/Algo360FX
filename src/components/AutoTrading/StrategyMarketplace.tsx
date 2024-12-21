import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Box,
  Rating,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ShoppingCart as ShoppingCartIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Code as CodeIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStoreContext } from '../../stores/RootStoreContext';

interface Strategy {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: Review[];
  author: string;
  mql5Link: string;
  performance: {
    profitFactor: number;
    sharpeRatio: number;
    maxDrawdown: number;
    totalTrades: number;
    winRate: number;
    monthlyReturn: number;
  };
  tags: string[];
  verified?: boolean;
}

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

const sampleStrategies: Strategy[] = [
  {
    id: '1',
    name: 'MultiSignal Trend EA',
    description: 'A powerful multi-signal trend following EA that combines multiple technical indicators for precise entry and exit points. Features dynamic position sizing, advanced risk management, and multi-currency support. Proven track record with consistent profits and low drawdown.',
    price: 299,
    rating: 4.8,
    author: 'FVMY',
    mql5Link: 'https://www.mql5.com/en/market/product/119452',
    verified: true,
    performance: {
      profitFactor: 2.15,
      sharpeRatio: 1.85,
      maxDrawdown: 12.5,
      totalTrades: 1856,
      winRate: 68.5,
      monthlyReturn: 8.2,
    },
    tags: ['Trend Following', 'Multi-Currency', 'Low Drawdown', 'Multi-Signal', 'Verified'],
    reviews: [
      {
        id: '1',
        author: 'TradePro365',
        rating: 5,
        comment: 'Exceptional EA! Been using it for 3 months and the results are consistently profitable. The multi-signal approach really helps in filtering out false signals.',
        date: '2024-12-01',
        verified: true,
      },
      {
        id: '2',
        author: 'ForexMaster',
        rating: 5,
        comment: 'Best trend EA I\'ve used so far. The risk management is top-notch and the drawdown is very reasonable. Support from the developer is excellent.',
        date: '2024-11-28',
        verified: true,
      },
      {
        id: '3',
        author: 'AlgoTrader',
        rating: 4.5,
        comment: 'Very impressed with the performance. The EA handles different market conditions well and the multi-currency support is a great feature.',
        date: '2024-11-15',
        verified: true,
      },
    ],
  },
  {
    id: '2',
    name: 'Trend Rider Pro',
    description: 'Advanced trend-following strategy with dynamic position sizing and risk management.',
    price: 299,
    rating: 4.5,
    author: 'TradingMaster',
    mql5Link: 'https://www.mql5.com/en/market/product/12345',
    performance: {
      profitFactor: 1.85,
      sharpeRatio: 1.6,
      maxDrawdown: 15.2,
      totalTrades: 1245,
      winRate: 62.0,
      monthlyReturn: 6.5,
    },
    tags: ['Trend Following', 'Multi-Currency', 'Low Drawdown'],
    reviews: [],
  },
];

const StrategyMarketplace: React.FC = observer(() => {
  const { algoTradingStore } = useRootStoreContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleStrategyClick = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setDialogOpen(true);
  };

  const handlePurchase = (strategy: Strategy) => {
    algoTradingStore.startStrategy({
      symbol: 'EURUSD', 
      entryConditions: [], 
      exitConditions: [],
      riskManagement: {
        maxPositionSize: 1.0,
        stopLoss: 50,
        takeProfit: 100
      }
    });
  };

  const filteredStrategies = sampleStrategies.filter(strategy =>
    strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    strategy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    strategy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card sx={{ maxWidth: '100%', overflow: 'hidden' }}>
      <CardContent>
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between" 
          alignItems={{ xs: 'stretch', sm: 'center' }}
          gap={2}
          mb={3}
        >
          <Typography variant="h5" gutterBottom sx={{ mb: { xs: 1, sm: 0 } }}>
            Strategy Marketplace
          </Typography>
          <Box 
            display="flex" 
            gap={2}
            width={{ xs: '100%', sm: 'auto' }}
          >
            <TextField
              size="small"
              placeholder="Search strategies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              sx={{ maxWidth: { xs: '100%', sm: 200 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton>
              <FilterIcon />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2}>
          {filteredStrategies.map((strategy) => (
            <Grid item xs={12} sm={6} md={6} key={strategy.id}>
              <Card variant="outlined" sx={{ height: '100%', cursor: 'pointer' }}
                onClick={() => handleStrategyClick(strategy)}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" 
                    flexDirection={{ xs: 'column', sm: 'row' }} 
                    gap={{ xs: 1, sm: 0 }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                        {strategy.name}
                      </Typography>
                      {strategy.verified && (
                        <VerifiedIcon color="primary" sx={{ fontSize: { xs: 16, sm: 20 } }} />
                      )}
                    </Box>
                    <Typography variant="h6" color="primary">
                      ${strategy.price}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    by {strategy.author}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Rating value={strategy.rating} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="textSecondary">
                      ({strategy.reviews.length} reviews)
                    </Typography>
                  </Box>

                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    paragraph
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {strategy.description}
                  </Typography>

                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    {strategy.tags.map((tag) => (
                      <Chip 
                        key={tag} 
                        label={tag} 
                        size="small"
                        color={tag === 'Verified' ? 'primary' : 'default'}
                        sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                      />
                    ))}
                  </Box>

                  <Grid container spacing={1}>
                    <Grid item xs={6} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Profit Factor: {strategy.performance.profitFactor}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Win Rate: {strategy.performance.winRate}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Max Drawdown: {strategy.performance.maxDrawdown}%
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Monthly Return: {strategy.performance.monthlyReturn}%
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)} 
          maxWidth="md" 
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              margin: { xs: '16px', sm: '32px' },
              width: { xs: 'calc(100% - 32px)', sm: '600px' },
              maxHeight: { xs: 'calc(100% - 32px)', sm: '90vh' }
            }
          }}
        >
          {selectedStrategy && (
            <>
              <DialogTitle>
                <Box 
                  display="flex" 
                  flexDirection={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between" 
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  gap={{ xs: 1, sm: 0 }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                      {selectedStrategy.name}
                    </Typography>
                    {selectedStrategy.verified && (
                      <VerifiedIcon color="primary" sx={{ fontSize: { xs: 16, sm: 20 } }} />
                    )}
                  </Box>
                  <Typography variant="h6" color="primary">
                    ${selectedStrategy.price}
                  </Typography>
                </Box>
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="body1" paragraph>
                      {selectedStrategy.description}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Performance Metrics
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Box textAlign="center" p={2} bgcolor="background.paper" borderRadius={1}>
                          <TrendingUpIcon color="primary" />
                          <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                            {selectedStrategy.performance.profitFactor}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Profit Factor
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box textAlign="center" p={2} bgcolor="background.paper" borderRadius={1}>
                          <StarIcon color="primary" />
                          <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                            {selectedStrategy.performance.winRate}%
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Win Rate
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box textAlign="center" p={2} bgcolor="background.paper" borderRadius={1}>
                          <TrendingUpIcon color="error" />
                          <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                            {selectedStrategy.performance.maxDrawdown}%
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Max Drawdown
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box textAlign="center" p={2} bgcolor="background.paper" borderRadius={1}>
                          <CodeIcon color="primary" />
                          <Typography variant="h6" sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                            {selectedStrategy.performance.totalTrades}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Total Trades
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Reviews
                    </Typography>
                    {selectedStrategy.reviews.map((review) => (
                      <Box 
                        key={review.id} 
                        mb={2} 
                        p={2} 
                        bgcolor="background.paper" 
                        borderRadius={1}
                      >
                        <Box 
                          display="flex" 
                          flexDirection={{ xs: 'column', sm: 'row' }}
                          justifyContent="space-between" 
                          alignItems={{ xs: 'flex-start', sm: 'center' }}
                          gap={{ xs: 1, sm: 0 }}
                          mb={1}
                        >
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ width: 32, height: 32 }}>{review.author[0]}</Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {review.author}
                                {review.verified && (
                                  <VerifiedIcon color="primary" sx={{ fontSize: 16, ml: 1 }} />
                                )}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {review.date}
                              </Typography>
                            </Box>
                          </Box>
                          <Rating value={review.rating} size="small" readOnly />
                        </Box>
                        <Typography variant="body2">
                          {review.comment}
                        </Typography>
                      </Box>
                    ))}
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button 
                  onClick={() => setDialogOpen(false)}
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth={true}
                  sx={{ 
                    m: { xs: 2, sm: 0 },
                    width: { xs: 'calc(100% - 32px)', sm: 'auto' }
                  }}
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => handlePurchase(selectedStrategy)}
                >
                  Purchase on MQL5
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </CardContent>
    </Card>
  );
});

export default StrategyMarketplace;
