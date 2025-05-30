import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Tab,
  Tabs,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  InputAdornment,
} from '@mui/material';
import {
  Forum,
  Comment,
  ThumbUp,
  ThumbDown,
  Share,
  MoreVert,
  Search,
  Add,
  Bookmark,
  BookmarkBorder,
  TrendingUp,
  AccessTime,
  Message,
  Notifications,
  Flag,
  Send,
  AttachFile,
  Image,
  EmojiEmotions,
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
      id={`forum-tabpanel-${index}`}
      aria-labelledby={`forum-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Generate mock discussion topics
const generateMockTopics = () => {
  return [
    {
      id: 1,
      title: 'EUR/USD Analysis for May 2025',
      author: 'John Trader',
      authorAvatar: 'J',
      date: '2025-05-22T10:30:00Z',
      content: 'What are your thoughts on the EUR/USD pair for the coming month? I see potential for a bullish breakout if it can clear the 1.1050 resistance level.',
      tags: ['EUR/USD', 'Technical Analysis', 'Forecast'],
      views: 342,
      replies: 18,
      likes: 24,
      isSticky: true,
      lastReply: '2025-05-23T08:15:00Z',
    },
    {
      id: 2,
      title: 'Alpha Signals performance review',
      author: 'Emma Johnson',
      authorAvatar: 'E',
      date: '2025-05-21T14:45:00Z',
      content: 'I\'ve been following Alpha Signals for 3 months now. Here\'s my detailed review of their performance and trade accuracy...',
      tags: ['Provider Review', 'Alpha Signals'],
      views: 187,
      replies: 12,
      likes: 15,
      isSticky: false,
      lastReply: '2025-05-22T19:30:00Z',
    },
    {
      id: 3,
      title: 'Best risk management settings for copy trading?',
      author: 'Michael Brown',
      authorAvatar: 'M',
      date: '2025-05-20T09:15:00Z',
      content: 'I\'m new to copy trading and wondering what risk management settings others are using. Currently I\'m set at 2% risk per trade, but wondering if that\'s too aggressive.',
      tags: ['Copy Trading', 'Risk Management'],
      views: 256,
      replies: 24,
      likes: 31,
      isSticky: false,
      lastReply: '2025-05-23T07:45:00Z',
    },
    {
      id: 4,
      title: 'Gold trading strategy discussion',
      author: 'Sarah Wilson',
      authorAvatar: 'S',
      date: '2025-05-19T16:20:00Z',
      content: 'With the recent volatility in gold prices, I\'ve been developing a strategy based on key support/resistance levels and central bank announcements. Here\'s what I\'ve found...',
      tags: ['Gold', 'XAU/USD', 'Strategy'],
      views: 198,
      replies: 9,
      likes: 17,
      isSticky: false,
      lastReply: '2025-05-22T11:10:00Z',
    },
    {
      id: 5,
      title: 'MT5 connection issues - help needed',
      author: 'David Lee',
      authorAvatar: 'D',
      date: '2025-05-18T11:05:00Z',
      content: 'I\'m having trouble connecting my MT5 account to the copy trading system. I keep getting an "invalid credentials" error even though I\'m sure my login details are correct.',
      tags: ['Technical Support', 'MT5', 'Copy Trading'],
      views: 124,
      replies: 7,
      likes: 3,
      isSticky: false,
      lastReply: '2025-05-21T14:25:00Z',
    },
  ];
};

// Generate mock comments for a topic
const generateMockComments = (topicId: number) => {
  const baseComments = [
    {
      id: 1,
      topicId: topicId,
      author: 'Alex Trader',
      authorAvatar: 'A',
      date: '2025-05-22T11:30:00Z',
      content: 'Great analysis! I agree with your take on the resistance levels. I\'ve also noticed increased buying pressure on the 4H timeframe.',
      likes: 8,
      dislikes: 0,
    },
    {
      id: 2,
      topicId: topicId,
      author: 'Maria FX',
      authorAvatar: 'M',
      date: '2025-05-22T12:45:00Z',
      content: 'I\'m a bit more cautious on this pair. The ECB statements this week might introduce some volatility. I\'d wait for a clear break of resistance before entering.',
      likes: 5,
      dislikes: 1,
    },
    {
      id: 3,
      topicId: topicId,
      author: 'Trading Pro',
      authorAvatar: 'T',
      date: '2025-05-22T14:15:00Z',
      content: 'Has anyone checked the COT report for this week? The institutional positioning might give us additional clues about the potential direction.',
      likes: 3,
      dislikes: 0,
    },
  ];
  
  // Add some topic-specific comments
  if (topicId === 2) {
    baseComments.push({
      id: 4,
      topicId: topicId,
      author: 'Signal Follower',
      authorAvatar: 'S',
      date: '2025-05-22T16:30:00Z',
      content: 'I\'ve also been following Alpha Signals and can confirm their accuracy has been impressive. Especially their EUR/USD calls have been spot on.',
      likes: 7,
      dislikes: 0,
    });
  } else if (topicId === 3) {
    baseComments.push({
      id: 4,
      topicId: topicId,
      author: 'Risk Manager',
      authorAvatar: 'R',
      date: '2025-05-21T10:20:00Z',
      content: 'I recommend starting with 1% risk per trade until you get comfortable with how the provider operates. You can always increase it later once you've built confidence in their performance.',
      likes: 12,
      dislikes: 0,
    });
  }
  
  return baseComments;
};

export const CommunityForum = observer(() => {
  const { signalProviderStore } = useStores();
  
  // State for tabs and topics
  const [tabValue, setTabValue] = useState(0);
  const [topics, setTopics] = useState(generateMockTopics());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [newTopicDialogOpen, setNewTopicDialogOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicTags, setNewTopicTags] = useState('');
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle topic selection
  const handleSelectTopic = (topicId: number) => {
    setSelectedTopic(topicId);
    setComments(generateMockComments(topicId));
  };
  
  // Handle back to topics
  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setComments([]);
    setNewComment('');
  };
  
  // Handle post comment
  const handlePostComment = () => {
    if (!newComment.trim() || selectedTopic === null) return;
    
    const newCommentObj = {
      id: comments.length + 1,
      topicId: selectedTopic,
      author: 'You',
      authorAvatar: 'Y',
      date: new Date().toISOString(),
      content: newComment,
      likes: 0,
      dislikes: 0,
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
    
    // Update topic replies count
    setTopics(topics.map(topic => 
      topic.id === selectedTopic 
        ? { ...topic, replies: topic.replies + 1, lastReply: new Date().toISOString() }
        : topic
    ));
  };
  
  // Handle open new topic dialog
  const handleOpenNewTopicDialog = () => {
    setNewTopicDialogOpen(true);
  };
  
  // Handle close new topic dialog
  const handleCloseNewTopicDialog = () => {
    setNewTopicDialogOpen(false);
    setNewTopicTitle('');
    setNewTopicContent('');
    setNewTopicTags('');
  };
  
  // Handle create new topic
  const handleCreateNewTopic = () => {
    if (!newTopicTitle.trim() || !newTopicContent.trim()) return;
    
    const tagsArray = newTopicTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    const newTopic = {
      id: topics.length + 1,
      title: newTopicTitle,
      author: 'You',
      authorAvatar: 'Y',
      date: new Date().toISOString(),
      content: newTopicContent,
      tags: tagsArray.length > 0 ? tagsArray : ['General'],
      views: 0,
      replies: 0,
      likes: 0,
      isSticky: false,
      lastReply: new Date().toISOString(),
    };
    
    setTopics([newTopic, ...topics]);
    handleCloseNewTopicDialog();
  };
  
  // Filter topics based on search query and tab
  const filteredTopics = topics.filter(topic => {
    const matchesSearch = !searchQuery || 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (tabValue === 0) return matchesSearch; // All Topics
    if (tabValue === 1) return matchesSearch && topic.isSticky; // Announcements
    if (tabValue === 2) return matchesSearch && topic.tags.includes('Technical Analysis'); // Analysis
    if (tabValue === 3) return matchesSearch && topic.tags.includes('Provider Review'); // Reviews
    if (tabValue === 4) return matchesSearch && topic.tags.includes('Strategy'); // Strategies
    
    return matchesSearch;
  });
  
  // Sort topics by last reply (most recent first)
  filteredTopics.sort((a, b) => {
    if (a.isSticky && !b.isSticky) return -1;
    if (!a.isSticky && b.isSticky) return 1;
    return new Date(b.lastReply).getTime() - new Date(a.lastReply).getTime();
  });
  
  return (
    <Box sx={{ width: '100%' }}>
      {selectedTopic === null ? (
        <>
          {/* Forum Header */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={7}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Forum sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Box>
                    <Typography variant="h5" component="h1" gutterBottom>
                      Community Forum
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Join discussions with other traders, share insights, and learn from the community.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    fullWidth
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpenNewTopicDialog}
                  >
                    New Topic
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
          
          {/* Forum Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="forum tabs">
              <Tab label="All Topics" />
              <Tab label="Announcements" />
              <Tab label="Analysis" />
              <Tab label="Provider Reviews" />
              <Tab label="Strategies" />
            </Tabs>
          </Box>
          
          {/* Topics List */}
          <TabPanel value={tabValue} index={tabValue}>
            <List>
              {filteredTopics.length > 0 ? (
                filteredTopics.map((topic) => (
                  <React.Fragment key={topic.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        bgcolor: topic.isSticky ? 'action.selected' : 'transparent',
                        borderRadius: 1,
                      }}
                      button
                      onClick={() => handleSelectTopic(topic.id)}
                    >
                      <ListItemAvatar>
                        <Avatar>{topic.authorAvatar}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {topic.isSticky && (
                              <Chip
                                label="Sticky"
                                size="small"
                                color="primary"
                                sx={{ mr: 1 }}
                              />
                            )}
                            <Typography variant="subtitle1" component="span">
                              {topic.title}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              variant="body2"
                              color="text.primary"
                              component="span"
                              sx={{
                                display: 'inline',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {topic.content}
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {topic.tags.map((tag) => (
                                <Chip key={tag} label={tag} size="small" />
                              ))}
                            </Box>
                            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <AccessTime fontSize="small" sx={{ mr: 0.5 }} />
                                {format(new Date(topic.date), 'MMM d, yyyy')}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <Message fontSize="small" sx={{ mr: 0.5 }} />
                                {topic.replies} replies
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <ThumbUp fontSize="small" sx={{ mr: 0.5 }} />
                                {topic.likes}
                              </Typography>
                            </Box>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No topics found. Be the first to start a discussion!
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpenNewTopicDialog}
                    sx={{ mt: 2 }}
                  >
                    Create New Topic
                  </Button>
                </Box>
              )}
            </List>
          </TabPanel>
        </>
      ) : (
        // Topic Detail View
        <Box>
          {/* Topic Navigation */}
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              onClick={handleBackToTopics}
              sx={{ mb: 2 }}
            >
              Back to Topics
            </Button>
            
            {topics.find(topic => topic.id === selectedTopic) && (
              <Card>
                <CardContent>
                  <Typography variant="h5" component="h1" gutterBottom>
                    {topics.find(topic => topic.id === selectedTopic)?.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 1 }}>
                      {topics.find(topic => topic.id === selectedTopic)?.authorAvatar}
                    </Avatar>
                    <Typography variant="body2">
                      {topics.find(topic => topic.id === selectedTopic)?.author}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                      {format(new Date(topics.find(topic => topic.id === selectedTopic)?.date || ''), 'MMM d, yyyy h:mm a')}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body1" paragraph>
                    {topics.find(topic => topic.id === selectedTopic)?.content}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {topics.find(topic => topic.id === selectedTopic)?.tags.map((tag: string) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<ThumbUp />}
                  >
                    Like ({topics.find(topic => topic.id === selectedTopic)?.likes})
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Share />}
                  >
                    Share
                  </Button>
                  <Button
                    size="small"
                    startIcon={<BookmarkBorder />}
                  >
                    Save
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Flag />}
                    color="error"
                  >
                    Report
                  </Button>
                </CardActions>
              </Card>
            )}
          </Box>
          
          {/* Comments Section */}
          <Typography variant="h6" gutterBottom>
            Comments ({comments.length})
          </Typography>
          
          <List>
            {comments.map((comment) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>{comment.authorAvatar}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2">
                          {comment.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(comment.date), 'MMM d, yyyy h:mm a')}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          component="span"
                          sx={{ display: 'block', mt: 1 }}
                        >
                          {comment.content}
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                          <Button
                            size="small"
                            startIcon={<ThumbUp fontSize="small" />}
                          >
                            {comment.likes}
                          </Button>
                          <Button
                            size="small"
                            startIcon={<ThumbDown fontSize="small" />}
                          >
                            {comment.dislikes}
                          </Button>
                          <Button
                            size="small"
                          >
                            Reply
                          </Button>
                        </Box>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
          
          {/* Add Comment */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Add Your Comment
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Write your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <IconButton size="small">
                  <AttachFile />
                </IconButton>
                <IconButton size="small">
                  <Image />
                </IconButton>
                <IconButton size="small">
                  <EmojiEmotions />
                </IconButton>
              </Box>
              <Button
                variant="contained"
                endIcon={<Send />}
                onClick={handlePostComment}
                disabled={!newComment.trim()}
              >
                Post Comment
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      
      {/* New Topic Dialog */}
      <Dialog open={newTopicDialogOpen} onClose={handleCloseNewTopicDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create New Topic</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            value={newTopicTitle}
            onChange={(e) => setNewTopicTitle(e.target.value)}
            margin="normal"
            required
            placeholder="Enter a descriptive title for your topic"
          />
          <TextField
            label="Content"
            fullWidth
            multiline
            rows={6}
            value={newTopicContent}
            onChange={(e) => setNewTopicContent(e.target.value)}
            margin="normal"
            required
            placeholder="Share your thoughts, questions, or insights..."
          />
          <TextField
            label="Tags"
            fullWidth
            value={newTopicTags}
            onChange={(e) => setNewTopicTags(e.target.value)}
            margin="normal"
            placeholder="Enter tags separated by commas (e.g., EUR/USD, Technical Analysis, Strategy)"
            helperText="Tags help others find your topic more easily"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNewTopicDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateNewTopic}
            disabled={!newTopicTitle.trim() || !newTopicContent.trim()}
          >
            Create Topic
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default CommunityForum;
