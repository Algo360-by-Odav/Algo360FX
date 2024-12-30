import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondary,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Favorite,
  Share,
  MoreVert,
  TrendingUp,
  Person,
  Star,
  Message,
  Notifications,
  FilterList,
  Search,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TradingStrategy } from '../../../types/algo-trading';
import { SocialUser, StrategyPost, Comment } from '../../../types/social';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';

interface SocialTradingHubProps {
  currentUser: SocialUser;
  strategies: TradingStrategy[];
  onFollow: (userId: string) => Promise<void>;
  onLike: (postId: string) => Promise<void>;
  onComment: (postId: string, content: string) => Promise<void>;
  onShare: (strategyId: string) => Promise<void>;
  onSubscribe: (strategyId: string) => Promise<void>;
}

const SocialTradingHub: React.FC<SocialTradingHubProps> = ({
  currentUser,
  strategies,
  onFollow,
  onLike,
  onComment,
  onShare,
  onSubscribe,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState<StrategyPost[]>([]);
  const [topTraders, setTopTraders] = useState<SocialUser[]>([]);
  const [trendingStrategies, setTrendingStrategies] = useState<TradingStrategy[]>([]);
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState<StrategyPost | null>(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      // Load posts, top traders, and trending strategies
      // This would be replaced with actual API calls
      setPosts(await fetchPosts());
      setTopTraders(await fetchTopTraders());
      setTrendingStrategies(await fetchTrendingStrategies());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      await onFollow(userId);
      // Update UI accordingly
    } catch (err) {
      setError('Failed to follow user');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await onLike(postId);
      // Update posts state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1, isLiked: true }
          : post
      ));
    } catch (err) {
      setError('Failed to like post');
    }
  };

  const handleComment = async () => {
    if (!selectedPost || !commentText.trim()) return;
    try {
      await onComment(selectedPost.id, commentText);
      // Update posts state
      setPosts(posts.map(post =>
        post.id === selectedPost.id
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now().toString(),
                  userId: currentUser.id,
                  content: commentText,
                  timestamp: new Date(),
                },
              ],
            }
          : post
      ));
      setCommentText('');
      setShowCommentDialog(false);
    } catch (err) {
      setError('Failed to add comment');
    }
  };

  const renderStrategyCard = (strategy: TradingStrategy) => (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar src={strategy.user.avatar}>
            {strategy.user.name.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton>
            <MoreVert />
          </IconButton>
        }
        title={strategy.name}
        subheader={`by ${strategy.user.name}`}
      />
      <CardContent>
        <Box sx={{ height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={strategy.performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Line
                type="monotone"
                dataKey="equity"
                stroke="#2196f3"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">
              Win Rate
            </Typography>
            <Typography variant="h6">
              {formatPercentage(strategy.metrics.winRate)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">
              Profit Factor
            </Typography>
            <Typography variant="h6">
              {strategy.metrics.profitFactor.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="body2" color="text.secondary">
              Sharpe Ratio
            </Typography>
            <Typography variant="h6">
              {strategy.metrics.sharpeRatio.toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<Star />}
          onClick={() => onSubscribe(strategy.id)}
        >
          Subscribe
        </Button>
        <Button
          size="small"
          startIcon={<Share />}
          onClick={() => onShare(strategy.id)}
        >
          Share
        </Button>
        <Rating value={strategy.rating} readOnly size="small" sx={{ ml: 'auto' }} />
      </CardActions>
    </Card>
  );

  const renderPost = (post: StrategyPost) => (
    <Card sx={{ mb: 2 }} key={post.id}>
      <CardHeader
        avatar={
          <Avatar src={post.user.avatar}>
            {post.user.name.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton>
            <MoreVert />
          </IconButton>
        }
        title={post.user.name}
        subheader={new Date(post.timestamp).toLocaleDateString()}
      />
      <CardContent>
        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>
        {post.strategy && renderStrategyCard(post.strategy)}
        <Box sx={{ mt: 2 }}>
          {post.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
      </CardContent>
      <CardActions>
        <IconButton
          color={post.isLiked ? 'primary' : 'default'}
          onClick={() => handleLike(post.id)}
        >
          <Favorite />
        </IconButton>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {post.likes}
        </Typography>
        <IconButton
          onClick={() => {
            setSelectedPost(post);
            setShowCommentDialog(true);
          }}
        >
          <Message />
        </IconButton>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {post.comments.length}
        </Typography>
        <IconButton onClick={() => onShare(post.id)}>
          <Share />
        </IconButton>
      </CardActions>
    </Card>
  );

  const renderTopTraders = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Top Traders
      </Typography>
      <List>
        {topTraders.map((trader) => (
          <ListItem
            key={trader.id}
            secondaryAction={
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleFollow(trader.id)}
                disabled={trader.isFollowing}
              >
                {trader.isFollowing ? 'Following' : 'Follow'}
              </Button>
            }
          >
            <ListItemAvatar>
              <Avatar src={trader.avatar}>{trader.name.charAt(0)}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body1">{trader.name}</Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary">
                  Win Rate: {formatPercentage(trader.winRate)}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  const renderTrendingStrategies = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Trending Strategies
      </Typography>
      <List>
        {trendingStrategies.map((strategy) => (
          <ListItem
            key={strategy.id}
            secondaryAction={
              <Button
                variant="outlined"
                size="small"
                onClick={() => onSubscribe(strategy.id)}
              >
                Subscribe
              </Button>
            }
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <TrendingUp />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography variant="body1">{strategy.name}</Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary">
                  Profit Factor: {strategy.metrics.profitFactor.toFixed(2)}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Social Trading Hub</Typography>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab label="Feed" />
          <Tab label="Trending" />
          <Tab label="Following" />
          <Tab label="My Posts" />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            posts.map(renderPost)
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          {renderTopTraders()}
          {renderTrendingStrategies()}
        </Grid>
      </Grid>

      {/* Comment Dialog */}
      <Dialog
        open={showCommentDialog}
        onClose={() => setShowCommentDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Comment</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCommentDialog(false)}>Cancel</Button>
          <Button onClick={handleComment} variant="contained" color="primary">
            Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SocialTradingHub;
