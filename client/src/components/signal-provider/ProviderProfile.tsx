import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Avatar,
  Chip,
  Button,
  Divider,
  Rating,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Paper,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Verified,
  AccessTime,
  TrendingUp,
  People,
  Star,
  StarBorder,
  ThumbUp,
  ThumbDown,
  Flag,
  MoreVert,
  Send,
} from '@mui/icons-material';
import { useStores } from '../../stores/storeProviderJs';
import { format } from 'date-fns';

// Interface for tab panel props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab Panel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`provider-tabpanel-${index}`}
      aria-labelledby={`provider-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

// Generate mock reviews for providers
const generateMockReviews = (providerId: number) => {
  const baseReviews = [
    {
      id: 1,
      userId: 'user123',
      userName: 'John Smith',
      rating: 5,
      comment: "Excellent signals with detailed analysis. The risk management is top-notch and I've been consistently profitable following their trades.",
      date: '2025-05-01T10:30:00Z',
      likes: 24,
      dislikes: 2,
      userAvatar: 'J'
    },
    {
      id: 2,
      userId: 'user456',
      userName: 'Emma Johnson',
      rating: 4,
      comment: 'Very good signals overall. I appreciate the transparency in reporting both winning and losing trades. Communication could be better at times.',
      date: '2025-04-28T14:15:00Z',
      likes: 15,
      dislikes: 1,
      userAvatar: 'E'
    },
    {
      id: 3,
      userId: 'user789',
      userName: 'Michael Brown',
      rating: 5,
      comment: "I've been using this service for 3 months and have seen consistent returns. The educational content is also very valuable.",
      date: '2025-04-22T09:45:00Z',
      likes: 18,
      dislikes: 0,
      userAvatar: 'M'
    }
  ];
  
  // Add provider-specific reviews
  if (providerId === 1) {
    baseReviews.push({
      id: 4,
      userId: 'user321',
      userName: 'Sarah Wilson',
      rating: 5,
      comment: 'Alpha Signals has transformed my trading. Their analysis is spot on and the risk management is excellent. Highly recommended!',
      date: '2025-05-10T16:20:00Z',
      likes: 32,
      dislikes: 1,
      userAvatar: 'S'
    });
  } else if (providerId === 2) {
    baseReviews.push({
      id: 4,
      userId: 'user654',
      userName: 'David Lee',
      rating: 4,
      comment: 'FX Master provides solid signals with good win rates. I especially like their conservative approach to risk management.',
      date: '2025-05-08T11:05:00Z',
      likes: 19,
      dislikes: 3,
      userAvatar: 'D'
    });
  }
  
  return baseReviews;
};

export const ProviderProfile = observer(({ providerId }: { providerId: number }) => {
  const { signalProviderStore } = useStores();
  const provider = signalProviderStore.getProviderById(providerId);
  
  // State for tabs
  const [tabValue, setTabValue] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState<number | null>(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  
  // Mock reviews
  const reviews = generateMockReviews(providerId);
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle review dialog open
  const handleReviewDialogOpen = () => {
    setReviewDialogOpen(true);
  };
  
  // Handle review dialog close
  const handleReviewDialogClose = () => {
    setReviewDialogOpen(false);
  };
  
  // Handle submit review
  const handleSubmitReview = () => {
    // In a real app, this would submit the review to the backend
    console.log('Submitting review:', {
      providerId,
      rating: newReviewRating,
      comment: newReviewComment
    });
    
    // Close dialog and reset form
    setReviewDialogOpen(false);
    setNewReviewRating(5);
    setNewReviewComment('');
  };
  
  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  if (!provider) {
    return <Typography>Provider not found</Typography>;
  }
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Provider Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.main',
                    mr: 2,
                    fontSize: 24,
                  }}
                >
                  {provider.name.charAt(0)}
                </Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h5" component="h1">
                      {provider.name}
                    </Typography>
                    {provider.verified && (
                      <Chip
                        icon={<Verified />}
                        label="Verified"
                        size="small"
                        color="primary"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Active since: {provider.activeSince}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" paragraph>
                {provider.description}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {provider.strategy.instruments.map(instrument => (
                  <Chip key={instrument} label={instrument} size="small" />
                ))}
                {provider.strategy.timeframes.map(timeframe => (
                  <Chip key={timeframe} label={timeframe} size="small" />
                ))}
                <Chip label={provider.strategy.type} size="small" color="primary" />
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Subscription Details
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Monthly Price
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    ${provider.subscription.price}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Subscribers
                  </Typography>
                  <Typography variant="body1">
                    {provider.subscription.subscribers}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Rating
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={provider.subscription.rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({provider.subscription.reviews})
                    </Typography>
                  </Box>
                </Box>
                <Button variant="contained" color="primary" fullWidth>
                  Subscribe Now
                </Button>
                <Button variant="outlined" sx={{ mt: 1 }} fullWidth>
                  Free 7-Day Trial
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {/* Provider Tabs */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="provider tabs">
            <Tab label="Trading Philosophy" />
            <Tab label="Performance" />
            <Tab label="Reviews" />
          </Tabs>
        </Box>
        
        {/* Trading Philosophy Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>
                Trading Approach
              </Typography>
              <Typography paragraph>
                {provider.name} specializes in {provider.strategy.type} strategies across {provider.strategy.instruments.join(', ')} pairs. 
                Our approach combines technical analysis with fundamental insights to identify high-probability trading opportunities.
              </Typography>
              <Typography paragraph>
                We focus on maintaining a positive risk-to-reward ratio, typically targeting at least 1:{provider.risk.riskLevel === 'Low' ? '2' : provider.risk.riskLevel === 'Medium' ? '1.5' : '1.2'} on all trades. 
                Position sizing is conservative, with no single trade risking more than {provider.risk.riskLevel === 'Low' ? '1' : provider.risk.riskLevel === 'Medium' ? '2' : '3'}% of the account.
              </Typography>
              <Typography paragraph>
                Our signals include detailed entry points, stop-loss levels, and multiple take-profit targets, allowing traders to manage their positions according to their own risk tolerance.
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="h6" gutterBottom>
                Market Analysis Methodology
              </Typography>
              <Typography paragraph>
                Our analysis incorporates multiple timeframes, starting with higher timeframes to identify the overall trend and key support/resistance levels, then drilling down to lower timeframes for precise entry points.
              </Typography>
              <Typography paragraph>
                Key technical indicators we use include:
              </Typography>
              <ul>
                <li>
                  <Typography>Price action patterns and candlestick formations</Typography>
                </li>
                <li>
                  <Typography>Support and resistance levels, including dynamic levels</Typography>
                </li>
                <li>
                  <Typography>Trend indicators (Moving Averages, MACD)</Typography>
                </li>
                <li>
                  <Typography>Momentum oscillators (RSI, Stochastic)</Typography>
                </li>
                <li>
                  <Typography>Volume analysis</Typography>
                </li>
              </ul>
              <Typography paragraph>
                We also incorporate fundamental analysis, particularly for major economic releases and central bank decisions that can impact currency movements.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Risk Management
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Risk Level
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'grey.200',
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          height: '100%',
                          width: provider.risk.riskLevel === 'Low' ? '33%' : provider.risk.riskLevel === 'Medium' ? '66%' : '100%',
                          borderRadius: 4,
                          bgcolor: provider.risk.riskLevel === 'Low' ? 'success.main' : provider.risk.riskLevel === 'Medium' ? 'warning.main' : 'error.main',
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {provider.risk.riskLevel}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Max Drawdown
                  </Typography>
                  <Typography variant="body1">
                    {provider.risk.drawdown}%
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Win Rate
                  </Typography>
                  <Typography variant="body1">
                    {provider.performance.winRate}%
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Profit Factor
                  </Typography>
                  <Typography variant="body1">
                    {provider.performance.profitFactor}
                  </Typography>
                </Box>
              </Paper>
              
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Trading Hours
                </Typography>
                <Typography variant="body2" paragraph>
                  Our team is active during the following market sessions:
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    London Session
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    08:00 - 16:00 GMT
                  </Typography>
                </Box>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight="bold">
                    New York Session
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    13:00 - 21:00 GMT
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Asian Session
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    00:00 - 08:00 GMT (Limited Coverage)
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Performance Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Total Return</Typography>
                      <Typography variant="h6">{provider.performance.totalReturn}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Monthly Return</Typography>
                      <Typography variant="h6">{provider.performance.monthlyReturn}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Win Rate</Typography>
                      <Typography variant="h6">{provider.performance.winRate}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Profit Factor</Typography>
                      <Typography variant="h6">{provider.performance.profitFactor}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Total Signals</Typography>
                      <Typography variant="h6">{provider.performance.totalSignals}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Monthly Avg</Typography>
                      <Typography variant="h6">{provider.performance.avgTradesPerMonth} trades</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Monthly Performance (Last 6 Months)
                  </Typography>
                  <Box sx={{ height: 200, mt: 2 }}>
                    {/* Placeholder for chart - would use Recharts in a real implementation */}
                    <Box sx={{ 
                      height: '100%', 
                      bgcolor: 'action.hover', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      borderRadius: 1
                    }}>
                      <Typography color="text.secondary">
                        Performance Chart
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Button variant="outlined" fullWidth>
                View Detailed Performance Analytics
              </Button>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Reviews Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h6">
                Customer Reviews
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating value={averageRating} precision={0.1} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {averageRating.toFixed(1)} out of 5 ({reviews.length} reviews)
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReviewDialogOpen}
            >
              Write a Review
            </Button>
          </Box>
          
          <List>
            {reviews.map(review => (
              <React.Fragment key={review.id}>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton edge="end" aria-label="more">
                      <MoreVert />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>{review.userAvatar}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1">
                          {review.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(review.date), 'MMM d, yyyy')}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Rating value={review.rating} size="small" readOnly sx={{ mb: 1 }} />
                        <Typography variant="body2" color="text.primary" paragraph>
                          {review.comment}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Button
                            size="small"
                            startIcon={<ThumbUp fontSize="small" />}
                            sx={{ mr: 1 }}
                          >
                            {review.likes}
                          </Button>
                          <Button
                            size="small"
                            startIcon={<ThumbDown fontSize="small" />}
                            sx={{ mr: 1 }}
                          >
                            {review.dislikes}
                          </Button>
                          <Button
                            size="small"
                            startIcon={<Flag fontSize="small" />}
                          >
                            Report
                          </Button>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </TabPanel>
      </Box>
      
      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={handleReviewDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Rate this provider
            </Typography>
            <Rating
              value={newReviewRating}
              onChange={(event, newValue) => {
                setNewReviewRating(newValue);
              }}
              size="large"
            />
            
            <TextField
              label="Your Review"
              multiline
              rows={4}
              value={newReviewComment}
              onChange={(e) => setNewReviewComment(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="Share your experience with this signal provider..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReviewDialogClose}>Cancel</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            color="primary"
            disabled={!newReviewRating || !newReviewComment}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default ProviderProfile;
