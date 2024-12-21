import React, { useState } from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Search,
  Bookmark,
  BookmarkBorder,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import NewsFeedWidget from '../components/News/NewsFeedWidget';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`news-tabpanel-${index}`}
      aria-labelledby={`news-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const News: React.FC = observer(() => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedNews, setBookmarkedNews] = useState<string[]>([]);

  const newsCategories = [
    'Market Analysis',
    'Economic News',
    'Technical Analysis',
    'Company News',
    'Cryptocurrency',
  ];

  const trendingTopics = [
    'Federal Reserve',
    'ECB Policy',
    'Oil Prices',
    'Market Volatility',
    'Economic Data',
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleBookmark = (newsId: string) => {
    if (bookmarkedNews.includes(newsId)) {
      setBookmarkedNews(bookmarkedNews.filter(id => id !== newsId));
    } else {
      setBookmarkedNews([...bookmarkedNews, newsId]);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {/* News Feed */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Latest News" />
                <Tab label="Market Analysis" />
                <Tab label="Economic Calendar" />
                <Tab label="Bookmarks" />
              </Tabs>
            </Box>
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <NewsFeedWidget />
            </Box>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Categories */}
          <Card sx={{ mb: 2 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Categories
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {newsCategories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onClick={() => {}}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Box>
            </Box>
          </Card>

          {/* Trending Topics */}
          <Card>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Trending Topics
              </Typography>
              <List dense>
                {trendingTopics.map((topic, index) => (
                  <ListItem key={topic}>
                    <ListItemText
                      primary={topic}
                      secondary={`${Math.floor(Math.random() * 100)} related articles`}
                    />
                    <ListItemSecondaryAction>
                      {index % 2 === 0 ? (
                        <TrendingUp color="success" />
                      ) : (
                        <TrendingDown color="error" />
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

export default News;
