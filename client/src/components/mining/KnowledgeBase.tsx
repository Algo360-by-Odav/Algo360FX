import React, { useState } from 'react';
import withMiningObserver from './withMiningObserver';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link,
  Alert
} from '@mui/material';
import {
  Search,
  School,
  MenuBook,
  Lightbulb,
  Assignment,
  VideoLibrary,
  Bookmark,
  BookmarkBorder,
  ThumbUp,
  ExpandMore,
  ArrowForward,
  History,
  Star,
  StarBorder,
  Share,
  InsertDriveFile
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`kb-tabpanel-${index}`}
      aria-labelledby={`kb-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `kb-tab-${index}`,
    'aria-controls': `kb-tabpanel-${index}`,
  };
}

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  datePublished: string;
  author: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  bookmarked: boolean;
  liked: boolean;
  tags: string[];
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  datePublished: string;
  channel: string;
  bookmarked: boolean;
}

interface Props {
  store: any;
}

const KnowledgeBase: React.FC<Props> = ({ store }) => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedArticle, setExpandedArticle] = useState<string | false>(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedArticle(isExpanded ? panel : false);
  };

  const toggleBookmark = (id: string, type: 'article' | 'video') => {
    // In a real app, this would update state in the store
    console.log(`Toggle bookmark for ${type} ${id}`);
    
    // Check if articles exist before accessing
    if (store?.knowledgeBase?.articles) {
      setNotification({
        open: true,
        message: `Article ${id} has been ${store.knowledgeBase.articles.find((a: Article) => a.id === id)?.bookmarked ? 'removed from' : 'added to'} your bookmarks`,
        severity: 'success'
      });
    } else {
      setNotification({
        open: true,
        message: `Bookmark status updated`,
        severity: 'success'
      });
    }
  };

  const toggleLike = (id: string) => {
    // In a real app, this would update state in the store
    console.log(`Toggle like for article ${id}`);
    
    // Check if articles exist before accessing
    if (store?.knowledgeBase?.articles) {
      setNotification({
        open: true,
        message: `You ${store.knowledgeBase.articles.find((a: Article) => a.id === id)?.liked ? 'unliked' : 'liked'} this article`,
        severity: 'success'
      });
    } else {
      setNotification({
        open: true,
        message: `Article like status updated`,
        severity: 'success'
      });
    }
  };

  const filteredArticles = store?.knowledgeBase?.articles ? store.knowledgeBase.articles.filter(
    (article: Article) => 
      searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  const filteredVideos = store?.knowledgeBase?.videos ? store.knowledgeBase.videos.filter(
    (video: Video) => 
      searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  // Initialize default values if store or knowledgeBase is not available
  const knowledgeBase = store?.knowledgeBase || { 
    articles: [], 
    videos: [],
    categories: []
  };

  // Handle the case where store or knowledgeBase is not available
  if (!store || !store.knowledgeBase) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6">Loading Knowledge Base...</Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Mining Knowledge Base
        </Typography>
        <TextField
          placeholder="Search resources..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ width: { xs: '100%', sm: '50%', md: '30%' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {searchQuery && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Showing results for "<strong>{searchQuery}</strong>"
        </Alert>
      )}

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="knowledge base tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Articles" icon={<MenuBook />} {...a11yProps(0)} />
          <Tab label="Video Tutorials" icon={<VideoLibrary />} {...a11yProps(1)} />
          <Tab label="Bookmarked" icon={<Bookmark />} {...a11yProps(2)} />
          <Tab label="My Contributions" icon={<Assignment />} {...a11yProps(3)} />
        </Tabs>

        {/* Articles Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article: Article) => (
                  <Accordion 
                    key={article.id}
                    expanded={expandedArticle === article.id}
                    onChange={handleAccordionChange(article.id)}
                    sx={{ mb: 2 }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls={`panel-${article.id}-content`}
                      id={`panel-${article.id}-header`}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography variant="h6">{article.title}</Typography>
                          <Box>
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(article.id, 'article');
                              }}
                            >
                              {article.bookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(article.id);
                              }}
                            >
                              {article.liked ? <ThumbUp color="primary" /> : <ThumbUp />}
                            </IconButton>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', mt: 1 }}>
                          <Chip 
                            label={article.category} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                            sx={{ mr: 1 }}
                          />
                          <Chip 
                            label={article.difficulty} 
                            size="small"
                            color={
                              article.difficulty === 'beginner' ? 'success' :
                              article.difficulty === 'intermediate' ? 'info' : 'warning'
                            }
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                            {article.datePublished} • by {article.author}
                          </Typography>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography paragraph>
                        {article.content}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        {article.tags.map((tag, index) => (
                          <Chip key={index} label={tag} size="small" />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button size="small" endIcon={<ArrowForward />}>
                          Read Full Article
                        </Button>
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography>No articles found matching your search criteria.</Typography>
                </Paper>
              )}
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ mb: 3 }}>
                <CardHeader title="Popular Topics" />
                <Divider />
                <CardContent>
                  <List dense>
                    <ListItem button>
                      <ListItemIcon>
                        <School fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Mining Optimization" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <School fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Pool Selection Guide" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <School fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Hardware Maintenance" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <School fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Profitability Analysis" />
                    </ListItem>
                    <ListItem button>
                      <ListItemIcon>
                        <School fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary="Security Best Practices" />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
              <Card>
                <CardHeader title="Recommended For You" />
                <Divider />
                <CardContent>
                  <List dense>
                    <ListItem button>
                      <ListItemText 
                        primary="Advanced Mining Techniques" 
                        secondary="Based on your equipment"
                      />
                    </ListItem>
                    <ListItem button>
                      <ListItemText 
                        primary="Energy Efficiency Guide" 
                        secondary="Reduce your operational costs"
                      />
                    </ListItem>
                    <ListItem button>
                      <ListItemText 
                        primary="Tax Planning for Miners" 
                        secondary="Essential knowledge"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Video Tutorials Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {filteredVideos.length > 0 ? (
              filteredVideos.map((video: Video) => (
                <Grid item xs={12} sm={6} md={4} key={video.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box 
                      sx={{ 
                        position: 'relative', 
                        paddingTop: '56.25%', // 16:9 aspect ratio
                        backgroundColor: 'black'
                      }}
                    >
                      <Box
                        component="img"
                        src={video.thumbnail || 'https://via.placeholder.com/480x270?text=Mining+Tutorial'}
                        alt={video.title}
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <Chip
                        label={video.duration}
                        size="small"
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white'
                        }}
                      />
                      <IconButton
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(255,255,255,0.3)',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.5)'
                          }
                        }}
                        onClick={() => toggleBookmark(video.id, 'video')}
                      >
                        {video.bookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
                      </IconButton>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
                        {video.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {video.channel}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {video.views.toLocaleString()} views • {video.datePublished}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography>No videos found matching your search criteria.</Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </TabPanel>

        {/* Bookmarked Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Bookmarked Articles
              </Typography>
              {store?.knowledgeBase?.articles?.filter((a: Article) => a.bookmarked)?.length > 0 ? (
                store.knowledgeBase.articles
                  .filter((a: Article) => a.bookmarked)
                  .map((article: Article) => (
                    <Paper key={article.id} sx={{ p: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {article.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {article.datePublished} • {article.author}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {article.tags.slice(0, 3).map((tag, index) => (
                              <Chip key={index} label={tag} size="small" />
                            ))}
                          </Box>
                        </Box>
                        <IconButton 
                          size="small" 
                          onClick={() => toggleBookmark(article.id, 'article')}
                        >
                          <Bookmark color="primary" />
                        </IconButton>
                      </Box>
                    </Paper>
                  ))
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography>No bookmarked articles yet.</Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<MenuBook />} 
                    sx={{ mt: 2 }}
                    onClick={() => setTabValue(0)}
                  >
                    Browse Articles
                  </Button>
                </Paper>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Bookmarked Videos
              </Typography>
              {store?.knowledgeBase?.videos?.filter((v: Video) => v.bookmarked)?.length > 0 ? (
                store.knowledgeBase.videos
                  .filter((v: Video) => v.bookmarked)
                  .map((video: Video) => (
                    <Paper key={video.id} sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}>
                      <Box 
                        component="img"
                        src={video.thumbnail || 'https://via.placeholder.com/120x68?text=Mining+Video'}
                        alt={video.title}
                        sx={{ width: 120, height: 68, objectFit: 'cover' }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {video.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {video.channel}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {video.duration} • {video.views.toLocaleString()} views
                        </Typography>
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={() => toggleBookmark(video.id, 'video')}
                      >
                        <Bookmark color="primary" />
                      </IconButton>
                    </Paper>
                  ))
              ) : (
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography>No bookmarked videos yet.</Typography>
                  <Button 
                    variant="outlined" 
                    startIcon={<VideoLibrary />} 
                    sx={{ mt: 2 }}
                    onClick={() => setTabValue(1)}
                  >
                    Browse Videos
                  </Button>
                </Paper>
              )}
            </Grid>
          </Grid>
        </TabPanel>

        {/* My Contributions Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ mb: 3 }}>
            <Button variant="contained" startIcon={<InsertDriveFile />}>
              Create New Article
            </Button>
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Your Contributions
          </Typography>
          
          {store.knowledgeBase.myContributions.length > 0 ? (
            store.knowledgeBase.myContributions.map((contribution: any, index: number) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {contribution.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {contribution.datePublished} • {contribution.status}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={`${contribution.views} views`} 
                        size="small" 
                        variant="outlined" 
                        icon={<History fontSize="small" />} 
                      />
                      <Chip 
                        label={`${contribution.likes} likes`} 
                        size="small" 
                        variant="outlined" 
                        icon={<ThumbUp fontSize="small" />} 
                      />
                      <Chip 
                        label={`${contribution.bookmarks} bookmarks`} 
                        size="small" 
                        variant="outlined" 
                        icon={<Bookmark fontSize="small" />} 
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Button size="small" startIcon={<Edit />} sx={{ mr: 1 }}>
                      Edit
                    </Button>
                    <Button size="small" startIcon={<Share />}>
                      Share
                    </Button>
                  </Box>
                </Box>
              </Paper>
            ))
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography>You haven't created any content yet.</Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ mt: 1 }}>
                Share your mining knowledge and experience with the community!
              </Typography>
              <Button variant="contained" startIcon={<Lightbulb />}>
                Start Contributing
              </Button>
            </Paper>
          )}
        </TabPanel>
      </Paper>

      {/* Notification */}
      <Alert
        severity={notification.severity as any}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
          display: notification.open ? 'flex' : 'none',
          boxShadow: 3
        }}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        {notification.message}
      </Alert>
    </Box>
  );
};

export default withMiningObserver(KnowledgeBase);
