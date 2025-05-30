import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Divider,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Tab,
  Tabs,
  Dialog,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import {
  Search,
  PlayArrow,
  School,
  MenuBook,
  VideoLibrary,
  Article,
  Bookmark,
  BookmarkBorder,
  Share,
  ThumbUp,
  FilterList,
  Sort,
  ExpandMore,
  ExpandLess,
  AccessTime,
  Visibility,
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
      id={`education-tabpanel-${index}`}
      aria-labelledby={`education-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock educational content
const mockEducationalContent = [
  {
    id: 1,
    title: 'Understanding Support and Resistance',
    type: 'article',
    author: 'John Trader',
    authorAvatar: 'J',
    provider: 'Alpha Signals',
    providerAvatar: 'A',
    date: '2025-04-15T10:30:00Z',
    duration: '15 min read',
    level: 'Beginner',
    description: 'Learn how to identify and use support and resistance levels in your trading strategy.',
    image: 'https://via.placeholder.com/300x180?text=Support+and+Resistance',
    tags: ['Technical Analysis', 'Chart Patterns'],
    views: 1250,
    likes: 87,
    bookmarked: false,
    featured: true,
  },
  {
    id: 2,
    title: 'Advanced Price Action Trading',
    type: 'video',
    author: 'Sarah Wilson',
    authorAvatar: 'S',
    provider: 'FX Masters',
    providerAvatar: 'F',
    date: '2025-04-10T14:45:00Z',
    duration: '45 min',
    level: 'Advanced',
    description: 'Master the art of price action trading with this comprehensive video tutorial.',
    image: 'https://via.placeholder.com/300x180?text=Price+Action',
    tags: ['Price Action', 'Trading Psychology'],
    views: 980,
    likes: 65,
    bookmarked: true,
    featured: false,
  },
  {
    id: 3,
    title: 'Risk Management Essentials',
    type: 'course',
    author: 'Michael Brown',
    authorAvatar: 'M',
    provider: 'Trend Traders',
    providerAvatar: 'T',
    date: '2025-04-05T09:15:00Z',
    duration: '3 hours total',
    level: 'Intermediate',
    description: 'A comprehensive course on risk management strategies for forex traders.',
    image: 'https://via.placeholder.com/300x180?text=Risk+Management',
    tags: ['Risk Management', 'Money Management'],
    views: 750,
    likes: 92,
    bookmarked: false,
    featured: true,
  },
  {
    id: 4,
    title: 'Fibonacci Retracement Strategies',
    type: 'webinar',
    author: 'Emma Johnson',
    authorAvatar: 'E',
    provider: 'Alpha Signals',
    providerAvatar: 'A',
    date: '2025-04-01T16:20:00Z',
    duration: '1 hour',
    level: 'Intermediate',
    description: 'Learn how to effectively use Fibonacci retracement levels in your trading.',
    image: 'https://via.placeholder.com/300x180?text=Fibonacci',
    tags: ['Technical Analysis', 'Fibonacci'],
    views: 620,
    likes: 45,
    bookmarked: false,
    featured: false,
  },
  {
    id: 5,
    title: 'Trading Psychology: Overcoming Fear and Greed',
    type: 'article',
    author: 'David Lee',
    authorAvatar: 'D',
    provider: 'Swing Signals',
    providerAvatar: 'S',
    date: '2025-03-28T11:05:00Z',
    duration: '20 min read',
    level: 'All Levels',
    description: 'Understand the psychological aspects of trading and how to maintain emotional discipline.',
    image: 'https://via.placeholder.com/300x180?text=Trading+Psychology',
    tags: ['Trading Psychology', 'Mindset'],
    views: 890,
    likes: 76,
    bookmarked: false,
    featured: false,
  },
  {
    id: 6,
    title: 'Introduction to Forex Trading',
    type: 'course',
    author: 'John Trader',
    authorAvatar: 'J',
    provider: 'Alpha Signals',
    providerAvatar: 'A',
    date: '2025-03-20T13:30:00Z',
    duration: '4 hours total',
    level: 'Beginner',
    description: 'A complete beginner\'s guide to forex trading fundamentals.',
    image: 'https://via.placeholder.com/300x180?text=Forex+Basics',
    tags: ['Forex Basics', 'Getting Started'],
    views: 1560,
    likes: 124,
    bookmarked: false,
    featured: true,
  },
];

export const EducationalContent = observer(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { signalProviderStore } = useStores();
  
  // State for tabs and content
  const [tabValue, setTabValue] = useState(0);
  const [content, setContent] = useState(mockEducationalContent);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContent, setSelectedContent] = useState<any | null>(null);
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [filterLevel, setFilterLevel] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle content selection
  const handleSelectContent = (contentId: number) => {
    setSelectedContent(content.find(item => item.id === contentId) || null);
    setContentDialogOpen(true);
  };
  
  // Handle close content dialog
  const handleCloseContentDialog = () => {
    setContentDialogOpen(false);
  };
  
  // Handle toggle bookmark
  const handleToggleBookmark = (contentId: number) => {
    setContent(
      content.map(item => 
        item.id === contentId
          ? { ...item, bookmarked: !item.bookmarked }
          : item
      )
    );
  };
  
  // Handle toggle filters
  const handleToggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };
  
  // Filter content based on search query, tab, and filters
  const filteredContent = content.filter(item => {
    // Apply search filter
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply tab filter
    const matchesTab = 
      (tabValue === 0) || // All
      (tabValue === 1 && item.featured) || // Featured
      (tabValue === 2 && item.type === 'article') || // Articles
      (tabValue === 3 && item.type === 'video') || // Videos
      (tabValue === 4 && item.type === 'course') || // Courses
      (tabValue === 5 && item.type === 'webinar') || // Webinars
      (tabValue === 6 && item.bookmarked); // Bookmarked
    
    // Apply level filter
    const matchesLevel = filterLevel === 'all' || item.level === filterLevel;
    
    // Apply type filter
    const matchesType = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesTab && matchesLevel && matchesType;
  });
  
  // Sort filtered content
  filteredContent.sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'popularity':
        return b.views - a.views;
      case 'likes':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });
  
  // Get content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'article':
        return <Article />;
      case 'video':
        return <VideoLibrary />;
      case 'course':
        return <School />;
      case 'webinar':
        return <VideoLibrary />;
      default:
        return <Article />;
    }
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <School sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h5" component="h1" gutterBottom>
                  Educational Resources
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Learn trading strategies, technical analysis, and risk management from our signal providers.
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                placeholder="Search resources..."
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
                variant="outlined"
                startIcon={filtersOpen ? <ExpandLess /> : <ExpandMore />}
                onClick={handleToggleFilters}
              >
                Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {/* Filters */}
      {filtersOpen && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterList sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Level:</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Chip
                  label="All Levels"
                  onClick={() => setFilterLevel('all')}
                  color={filterLevel === 'all' ? 'primary' : 'default'}
                  variant={filterLevel === 'all' ? 'filled' : 'outlined'}
                />
                <Chip
                  label="Beginner"
                  onClick={() => setFilterLevel('Beginner')}
                  color={filterLevel === 'Beginner' ? 'primary' : 'default'}
                  variant={filterLevel === 'Beginner' ? 'filled' : 'outlined'}
                />
                <Chip
                  label="Intermediate"
                  onClick={() => setFilterLevel('Intermediate')}
                  color={filterLevel === 'Intermediate' ? 'primary' : 'default'}
                  variant={filterLevel === 'Intermediate' ? 'filled' : 'outlined'}
                />
                <Chip
                  label="Advanced"
                  onClick={() => setFilterLevel('Advanced')}
                  color={filterLevel === 'Advanced' ? 'primary' : 'default'}
                  variant={filterLevel === 'Advanced' ? 'filled' : 'outlined'}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FilterList sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Type:</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Chip
                  label="All Types"
                  onClick={() => setFilterType('all')}
                  color={filterType === 'all' ? 'primary' : 'default'}
                  variant={filterType === 'all' ? 'filled' : 'outlined'}
                />
                <Chip
                  label="Articles"
                  onClick={() => setFilterType('article')}
                  color={filterType === 'article' ? 'primary' : 'default'}
                  variant={filterType === 'article' ? 'filled' : 'outlined'}
                />
                <Chip
                  label="Videos"
                  onClick={() => setFilterType('video')}
                  color={filterType === 'video' ? 'primary' : 'default'}
                  variant={filterType === 'video' ? 'filled' : 'outlined'}
                />
                <Chip
                  label="Courses"
                  onClick={() => setFilterType('course')}
                  color={filterType === 'course' ? 'primary' : 'default'}
                  variant={filterType === 'course' ? 'filled' : 'outlined'}
                />
                <Chip
                  label="Webinars"
                  onClick={() => setFilterType('webinar')}
                  color={filterType === 'webinar' ? 'primary' : 'default'}
                  variant={filterType === 'webinar' ? 'filled' : 'outlined'}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Sort sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Sort By:</Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                <Chip
                  label="Newest"
                  onClick={() => setSortBy('date')}
                  color={sortBy === 'date' ? 'primary' : 'default'}
                  variant={sortBy === 'date' ? 'filled' : 'outlined'}
                />
                <Chip
                  label="Most Popular"
                  onClick={() => setSortBy('popularity')}
                  color={sortBy === 'popularity' ? 'primary' : 'default'}
                  variant={sortBy === 'popularity' ? 'filled' : 'outlined'}
                />
                <Chip
                  label="Most Liked"
                  onClick={() => setSortBy('likes')}
                  color={sortBy === 'likes' ? 'primary' : 'default'}
                  variant={sortBy === 'likes' ? 'filled' : 'outlined'}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="education tabs" variant="scrollable" scrollButtons="auto">
          <Tab label="All" />
          <Tab label="Featured" />
          <Tab label="Articles" />
          <Tab label="Videos" />
          <Tab label="Courses" />
          <Tab label="Webinars" />
          <Tab label="Bookmarked" />
        </Tabs>
      </Box>
      
      {/* Content Grid */}
      <TabPanel value={tabValue} index={tabValue}>
        {filteredContent.length > 0 ? (
          <Grid container spacing={3}>
            {filteredContent.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={item.image}
                    alt={item.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Chip
                        icon={getContentTypeIcon(item.type)}
                        label={item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        size="small"
                        color="primary"
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleToggleBookmark(item.id)}
                      >
                        {item.bookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
                      </IconButton>
                    </Box>
                    
                    <Typography variant="h6" component="div" gutterBottom sx={{ mt: 1 }}>
                      {item.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{ width: 24, height: 24, mr: 1 }}
                      >
                        {item.providerAvatar}
                      </Avatar>
                      <Typography variant="caption">
                        {item.provider}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime fontSize="small" sx={{ mr: 0.5, fontSize: 14 }} />
                        {item.duration}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <Visibility fontSize="small" sx={{ mr: 0.5, fontSize: 14 }} />
                        {item.views}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {item.tags.map((tag: string) => (
                        <Chip key={tag} label={tag} size="small" />
                      ))}
                    </Box>
                    
                    <Chip
                      label={item.level}
                      size="small"
                      color={
                        item.level === 'Beginner'
                          ? 'success'
                          : item.level === 'Intermediate'
                          ? 'primary'
                          : 'secondary'
                      }
                      sx={{ mb: 2 }}
                    />
                  </CardContent>
                  
                  <Divider />
                  
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ThumbUp fontSize="small" color="primary" />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {item.likes}
                      </Typography>
                    </Box>
                    
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={item.type === 'video' || item.type === 'webinar' ? <PlayArrow /> : <MenuBook />}
                      onClick={() => handleSelectContent(item.id)}
                    >
                      {item.type === 'video' || item.type === 'webinar' ? 'Watch' : item.type === 'course' ? 'Enroll' : 'Read'}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No educational content found matching your criteria.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setSearchQuery('');
                setFilterLevel('all');
                setFilterType('all');
                setTabValue(0);
              }}
              sx={{ mt: 2 }}
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </TabPanel>
      
      {/* Content Dialog */}
      {selectedContent && (
        <Dialog open={contentDialogOpen} onClose={handleCloseContentDialog} maxWidth="md" fullWidth>
          <DialogContent sx={{ p: 0 }}>
            {selectedContent.type === 'video' || selectedContent.type === 'webinar' ? (
              <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: 'black' }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={selectedContent.image}
                    alt={selectedContent.title}
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                      width: 64,
                      height: 64,
                    }}
                  >
                    <PlayArrow sx={{ fontSize: 32 }} />
                  </IconButton>
                </Box>
              </Box>
            ) : (
              <Box sx={{ height: 200, overflow: 'hidden' }}>
                <img
                  src={selectedContent.image}
                  alt={selectedContent.title}
                  style={{ width: '100%', objectFit: 'cover' }}
                />
              </Box>
            )}
            
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {selectedContent.title}
                </Typography>
                <Box>
                  <IconButton onClick={() => handleToggleBookmark(selectedContent.id)}>
                    {selectedContent.bookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
                  </IconButton>
                  <IconButton>
                    <Share />
                  </IconButton>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip
                  icon={getContentTypeIcon(selectedContent.type)}
                  label={selectedContent.type.charAt(0).toUpperCase() + selectedContent.type.slice(1)}
                  size="small"
                  color="primary"
                />
                <Chip
                  label={selectedContent.level}
                  size="small"
                  color={
                    selectedContent.level === 'Beginner'
                      ? 'success'
                      : selectedContent.level === 'Intermediate'
                      ? 'primary'
                      : 'secondary'
                  }
                />
                {selectedContent.tags.map(tag => (
                  <Chip key={tag} label={tag} size="small" />
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ mr: 1 }}>{selectedContent.authorAvatar}</Avatar>
                <Box>
                  <Typography variant="subtitle2">
                    {selectedContent.author}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedContent.provider} • {format(new Date(selectedContent.date), 'MMM d, yyyy')}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" paragraph>
                {selectedContent.description}
              </Typography>
              
              <Typography variant="body1" paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.
              </Typography>
              
              <Typography variant="body1" paragraph>
                Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc eu ullamcorper orci. Quisque eget odio ac lectus vestibulum faucibus eget in metus. In pellentesque faucibus vestibulum. Nulla at nulla justo, eget luctus tortor.
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button
                    startIcon={<ThumbUp />}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Like ({selectedContent.likes})
                  </Button>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                    <Visibility sx={{ mr: 0.5, fontSize: 16 }} />
                    {selectedContent.views} views
                  </Typography>
                </Box>
                
                {selectedContent.type === 'course' && (
                  <Button variant="contained" color="primary">
                    Enroll in Course
                  </Button>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseContentDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
});

export default EducationalContent;
