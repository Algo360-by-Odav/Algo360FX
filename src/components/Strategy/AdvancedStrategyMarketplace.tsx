import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Rating,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  ShoppingCart,
  Favorite,
  Share,
  ShowChart,
  AttachMoney,
  Timeline,
  Person,
  Star,
  Download,
  Add,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Strategy {
  id: string;
  name: string;
  description: string;
  author: {
    id: string;
    name: string;
    reputation: number;
    totalSales: number;
  };
  price: number;
  rating: number;
  reviews: number;
  performance: {
    totalReturn: number;
    monthlyReturn: number;
    drawdown: number;
    sharpeRatio: number;
    winRate: number;
  };
  backtest: {
    date: string;
    equity: number;
  }[];
  tags: string[];
  verified: boolean;
  subscribers: number;
  revenueShare: number;
  lastUpdated: Date;
}

const AdvancedStrategyMarketplace: React.FC = observer(() => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    setLoading(true);
    try {
      // Mock strategy data
      const mockStrategies: Strategy[] = [
        {
          id: '1',
          name: 'MultiSignal Trend EA',
          description: 'Advanced trend-following strategy using multiple timeframe analysis and machine learning for signal confirmation.',
          author: {
            id: 'auth1',
            name: 'TradingPro',
            reputation: 4.8,
            totalSales: 1250,
          },
          price: 299,
          rating: 4.7,
          reviews: 156,
          performance: {
            totalReturn: 85.4,
            monthlyReturn: 7.2,
            drawdown: 12.5,
            sharpeRatio: 2.1,
            winRate: 68.5,
          },
          backtest: Array(12).fill(0).map((_, i) => ({
            date: `2023-${i + 1}`,
            equity: 10000 * (1 + Math.random() * 0.1) ** i,
          })),
          tags: ['Trend Following', 'Machine Learning', 'Multi-Timeframe'],
          verified: true,
          subscribers: 450,
          revenueShare: 70,
          lastUpdated: new Date(),
        },
        // Add more mock strategies here
      ];
      setStrategies(mockStrategies);
    } catch (error) {
      console.error('Error fetching strategies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStrategySelect = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setDialogOpen(true);
  };

  const handlePurchase = async (strategy: Strategy) => {
    try {
      // Implement purchase logic
      console.log('Purchasing strategy:', strategy.id);
    } catch (error) {
      console.error('Error purchasing strategy:', error);
    }
  };

  const renderPerformanceMetrics = (performance: Strategy['performance']) => (
    <Grid container spacing={2}>
      <Grid item xs={6} md={4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Total Return
          </Typography>
          <Typography variant="h6" color="success.main">
            {performance.totalReturn}%
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} md={4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Monthly Return
          </Typography>
          <Typography variant="h6" color="success.main">
            {performance.monthlyReturn}%
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} md={4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Max Drawdown
          </Typography>
          <Typography variant="h6" color="error.main">
            {performance.drawdown}%
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} md={4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Sharpe Ratio
          </Typography>
          <Typography variant="h6">
            {performance.sharpeRatio}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={6} md={4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Win Rate
          </Typography>
          <Typography variant="h6">
            {performance.winRate}%
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Strategy Marketplace</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          color="primary"
        >
          Submit Strategy
        </Button>
      </Box>

      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search strategies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Sort by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rating">Rating</option>
              <option value="price">Price</option>
              <option value="performance">Performance</option>
              <option value="subscribers">Subscribers</option>
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {strategies.map((strategy) => (
            <Grid item xs={12} md={6} lg={4} key={strategy.id}>
              <Card>
                <CardMedia
                  component="div"
                  sx={{
                    height: 140,
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ShowChart sx={{ fontSize: 60, color: 'white' }} />
                </CardMedia>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{strategy.name}</Typography>
                    {strategy.verified && (
                      <Chip
                        label="Verified"
                        color="success"
                        size="small"
                      />
                    )}
                  </Box>
                  <Typography color="textSecondary" paragraph>
                    {strategy.description}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Avatar sx={{ width: 24, height: 24 }}>
                      <Person />
                    </Avatar>
                    <Typography variant="body2">
                      {strategy.author.name}
                    </Typography>
                    <Rating
                      value={strategy.author.reputation}
                      size="small"
                      readOnly
                    />
                  </Box>
                  <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                    {strategy.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" color="primary">
                      ${strategy.price}
                    </Typography>
                    <Box>
                      <IconButton>
                        <Favorite />
                      </IconButton>
                      <IconButton>
                        <Share />
                      </IconButton>
                      <Button
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        onClick={() => handleStrategySelect(strategy)}
                      >
                        Details
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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
                <Typography variant="h6">{selectedStrategy.name}</Typography>
                <Typography variant="h6" color="primary">
                  ${selectedStrategy.price}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
              >
                <Tab label="Overview" />
                <Tab label="Performance" />
                <Tab label="Reviews" />
                <Tab label="Author" />
              </Tabs>

              {tabValue === 0 && (
                <Box>
                  <Typography paragraph>
                    {selectedStrategy.description}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    Key Features
                  </Typography>
                  <Box mb={3}>
                    {renderPerformanceMetrics(selectedStrategy.performance)}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    Revenue Sharing
                  </Typography>
                  <Typography paragraph>
                    Earn {selectedStrategy.revenueShare}% of revenue when other traders purchase your strategy.
                  </Typography>
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Backtest Results
                  </Typography>
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedStrategy.backtest}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="equity"
                          stroke="#1976d2"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Box>
              )}

              {tabValue === 2 && (
                <Box>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography variant="h3">
                      {selectedStrategy.rating}
                    </Typography>
                    <Box>
                      <Rating
                        value={selectedStrategy.rating}
                        precision={0.1}
                        readOnly
                      />
                      <Typography color="textSecondary">
                        {selectedStrategy.reviews} reviews
                      </Typography>
                    </Box>
                  </Box>
                  {/* Add review list here */}
                </Box>
              )}

              {tabValue === 3 && (
                <Box>
                  <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Avatar sx={{ width: 64, height: 64 }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {selectedStrategy.author.name}
                      </Typography>
                      <Rating
                        value={selectedStrategy.author.reputation}
                        readOnly
                      />
                      <Typography color="textSecondary">
                        {selectedStrategy.author.totalSales} total sales
                      </Typography>
                    </Box>
                  </Box>
                  {/* Add author's other strategies here */}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<ShoppingCart />}
                onClick={() => handlePurchase(selectedStrategy)}
              >
                Purchase Strategy
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
});

export default AdvancedStrategyMarketplace;
