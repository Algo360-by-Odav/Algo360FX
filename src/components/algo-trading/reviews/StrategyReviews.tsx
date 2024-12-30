import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Rating,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Grid,
  LinearProgress,
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  Flag,
  Share,
  Sort,
  FilterList,
  Edit,
  Delete,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { StrategyReview, ReviewMetrics } from '../../../types/reviews';
import { TradingStrategy } from '../../../types/algo-trading';
import { useAuth } from '../../../hooks/useAuth';

interface StrategyReviewsProps {
  strategy: TradingStrategy;
  reviews: StrategyReview[];
  metrics: ReviewMetrics;
  onAddReview: (review: Partial<StrategyReview>) => Promise<void>;
  onUpdateReview: (reviewId: string, review: Partial<StrategyReview>) => Promise<void>;
  onDeleteReview: (reviewId: string) => Promise<void>;
  onReportReview: (reviewId: string, reason: string) => Promise<void>;
  onVoteReview: (reviewId: string, vote: 'up' | 'down') => Promise<void>;
}

const StrategyReviews: React.FC<StrategyReviewsProps> = ({
  strategy,
  reviews,
  metrics,
  onAddReview,
  onUpdateReview,
  onDeleteReview,
  onReportReview,
  onVoteReview,
}) => {
  const { user } = useAuth();
  const [showAddReview, setShowAddReview] = useState(false);
  const [editingReview, setEditingReview] = useState<StrategyReview | null>(null);
  const [reportingReview, setReportingReview] = useState<StrategyReview | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    content: '',
    pros: [''],
    cons: [''],
    experienceLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    tradingPeriod: '1-3 months',
    profitability: 'profitable',
  });

  const handleAddReview = async () => {
    try {
      await onAddReview({
        ...newReview,
        strategyId: strategy.id,
        userId: user!.id,
        createdAt: new Date(),
      });
      setShowAddReview(false);
      setNewReview({
        rating: 0,
        title: '',
        content: '',
        pros: [''],
        cons: [''],
        experienceLevel: 'beginner',
        tradingPeriod: '1-3 months',
        profitability: 'profitable',
      });
    } catch (error) {
      console.error('Failed to add review:', error);
    }
  };

  const handleUpdateReview = async (reviewId: string) => {
    if (!editingReview) return;
    try {
      await onUpdateReview(reviewId, editingReview);
      setEditingReview(null);
    } catch (error) {
      console.error('Failed to update review:', error);
    }
  };

  const renderRatingDistribution = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Rating Distribution
      </Typography>
      {[5, 4, 3, 2, 1].map((rating) => (
        <Box
          key={rating}
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Typography sx={{ mr: 1, minWidth: 20 }}>{rating}</Typography>
          <Rating value={rating} readOnly size="small" sx={{ mr: 1 }} />
          <LinearProgress
            variant="determinate"
            value={(metrics.ratingDistribution[rating] / metrics.totalReviews) * 100}
            sx={{ flexGrow: 1, mr: 1 }}
          />
          <Typography sx={{ minWidth: 40 }}>
            {metrics.ratingDistribution[rating]}
          </Typography>
        </Box>
      ))}
    </Box>
  );

  const renderReviewStats = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="primary">
            {metrics.averageRating.toFixed(1)}
          </Typography>
          <Rating value={metrics.averageRating} precision={0.1} readOnly />
          <Typography variant="body2" color="text.secondary">
            {metrics.totalReviews} reviews
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="success.main">
            {(metrics.recommendationRate * 100).toFixed(0)}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Would recommend
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="primary">
            {metrics.profitableRate.toFixed(1)}x
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Average profit factor
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );

  const renderReviewCard = (review: StrategyReview) => (
    <Paper sx={{ p: 2, mb: 2 }} key={review.id}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={review.user.avatar} alt={review.user.name} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1">{review.user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Rating value={review.rating} readOnly />
          <Typography variant="body2" color="text.secondary">
            {review.tradingPeriod} • {review.experienceLevel}
          </Typography>
        </Box>
      </Box>

      <Typography variant="h6" gutterBottom>
        {review.title}
      </Typography>
      <Typography variant="body1" paragraph>
        {review.content}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Pros
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {review.pros.map((pro, index) => (
            <Chip key={index} label={pro} color="success" variant="outlined" />
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Cons
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {review.cons.map((con, index) => (
            <Chip key={index} label={con} color="error" variant="outlined" />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Tooltip title="Helpful">
            <IconButton
              onClick={() => onVoteReview(review.id, 'up')}
              color={review.userVote === 'up' ? 'primary' : 'default'}
            >
              <ThumbUp />
            </IconButton>
          </Tooltip>
          <Typography variant="body2" component="span" sx={{ mx: 1 }}>
            {review.upvotes}
          </Typography>
          <Tooltip title="Not Helpful">
            <IconButton
              onClick={() => onVoteReview(review.id, 'down')}
              color={review.userVote === 'down' ? 'error' : 'default'}
            >
              <ThumbDown />
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          {user?.id === review.userId && (
            <>
              <IconButton onClick={() => setEditingReview(review)}>
                <Edit />
              </IconButton>
              <IconButton onClick={() => onDeleteReview(review.id)} color="error">
                <Delete />
              </IconButton>
            </>
          )}
          <IconButton onClick={() => setReportingReview(review)}>
            <Flag />
          </IconButton>
          <IconButton>
            <Share />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );

  const renderAddReviewDialog = () => (
    <Dialog
      open={showAddReview}
      onClose={() => setShowAddReview(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Write a Review</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>Overall Rating</Typography>
            <Rating
              value={newReview.rating}
              onChange={(event, value) =>
                setNewReview({ ...newReview, rating: value || 0 })
              }
              size="large"
            />
          </Box>

          <TextField
            fullWidth
            label="Review Title"
            value={newReview.title}
            onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Review Content"
            value={newReview.content}
            onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
            sx={{ mb: 2 }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Experience Level"
                value={newReview.experienceLevel}
                onChange={(e) =>
                  setNewReview({
                    ...newReview,
                    experienceLevel: e.target.value as any,
                  })
                }
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Trading Period"
                value={newReview.tradingPeriod}
                onChange={(e) =>
                  setNewReview({ ...newReview, tradingPeriod: e.target.value })
                }
              >
                <MenuItem value="< 1 month">Less than 1 month</MenuItem>
                <MenuItem value="1-3 months">1-3 months</MenuItem>
                <MenuItem value="3-6 months">3-6 months</MenuItem>
                <MenuItem value="6-12 months">6-12 months</MenuItem>
                <MenuItem value="> 12 months">More than 12 months</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowAddReview(false)}>Cancel</Button>
        <Button onClick={handleAddReview} variant="contained" color="primary">
          Submit Review
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Strategy Reviews
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowAddReview(true)}
          sx={{ mb: 2 }}
        >
          Write a Review
        </Button>
      </Box>

      {/* Statistics */}
      {renderReviewStats()}
      {renderRatingDistribution()}

      {/* Filters and Sort */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            startIcon={<FilterList />}
            variant="outlined"
            onClick={() => setFilterRating(null)}
          >
            All Ratings
          </Button>
          <Rating
            value={filterRating}
            onChange={(event, value) => setFilterRating(value)}
          />
        </Box>
        <Button
          startIcon={<Sort />}
          variant="outlined"
          onClick={() =>
            setSortBy((current) => {
              switch (current) {
                case 'recent':
                  return 'helpful';
                case 'helpful':
                  return 'rating';
                default:
                  return 'recent';
              }
            })
          }
        >
          Sort by: {sortBy}
        </Button>
      </Box>

      {/* Reviews List */}
      <Box>
        {reviews
          .filter((review) =>
            filterRating ? review.rating === filterRating : true
          )
          .sort((a, b) => {
            switch (sortBy) {
              case 'helpful':
                return b.upvotes - a.upvotes;
              case 'rating':
                return b.rating - a.rating;
              default:
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
          })
          .map(renderReviewCard)}
      </Box>

      {/* Dialogs */}
      {renderAddReviewDialog()}

      <Dialog
        open={!!editingReview}
        onClose={() => setEditingReview(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          {/* Similar form as Add Review */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingReview(null)}>Cancel</Button>
          <Button
            onClick={() => editingReview && handleUpdateReview(editingReview.id)}
            variant="contained"
            color="primary"
          >
            Update Review
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!reportingReview}
        onClose={() => setReportingReview(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Report Review</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for reporting"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportingReview(null)}>Cancel</Button>
          <Button
            onClick={() =>
              reportingReview && onReportReview(reportingReview.id, 'reason')
            }
            variant="contained"
            color="error"
          >
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StrategyReviews;
