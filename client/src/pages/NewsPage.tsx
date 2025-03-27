import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  useTheme,
  Button,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { format } from 'date-fns';
import { useStores } from '../stores/StoreProvider';
import NewsSearch from '../components/news/NewsSearch';
import NewsNotifications from '../components/news/NewsNotifications';
import NewsAnalytics from '../components/news/NewsAnalytics';

const NewsPage: React.FC = observer(() => {
  const theme = useTheme();
  const { newsStore } = useStores();

  useEffect(() => {
    if (newsStore) {
      newsStore.fetchNews(1);
    }
  }, [newsStore]);

  if (!newsStore) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const [selectedTab, setSelectedTab] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterSelect = (filter: string) => {
    newsStore.toggleFilter(filter);
  };

  const handleBookmark = (newsId: string) => {
    newsStore.toggleBookmark(newsId);
  };

  const handleLoadMore = () => {
    newsStore.fetchNews(newsStore.currentPage + 1);
  };

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral') => {
    switch (sentiment) {
      case 'positive':
        return theme.palette.success.main;
      case 'negative':
        return theme.palette.error.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getDisplayedNews = () => {
    switch (selectedTab) {
      case 1:
        return newsStore.getHighImpactNews();
      case 2:
        return newsStore.getBookmarkedNews();
      default:
        return newsStore.getFilteredNews();
    }
  };

  if (newsStore.loading && newsStore.currentPage === 1) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (newsStore.error) {
    return (
      <Box p={3}>
        <Typography color="error" variant="h6" align="center">
          {newsStore.error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Market News
        </Typography>
        <Box display="flex" alignItems="center">
          <NewsSearch />
          <IconButton onClick={() => newsStore.fetchNews(1)} sx={{ ml: 1 }}>
            <RefreshIcon />
          </IconButton>
          <IconButton onClick={handleFilterClick}>
            <FilterIcon />
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        {['USD', 'EUR', 'GBP', 'JPY', 'Central Banks', 'Interest Rates', 'Inflation'].map((filter) => (
          <MenuItem
            key={filter}
            onClick={() => handleFilterSelect(filter)}
            selected={newsStore.selectedFilters.includes(filter)}
          >
            {filter}
          </MenuItem>
        ))}
      </Menu>

      <Box mb={3}>
        <NewsAnalytics news={newsStore.news} />
      </Box>

      <Box mb={3}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label="All News" />
          <Tab label="High Impact" />
          <Tab label="Bookmarked" />
        </Tabs>
      </Box>

      {getDisplayedNews().length === 0 ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <Typography variant="h6" color="textSecondary">
            No news items found
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {getDisplayedNews().map(item => (
              <Grid item xs={12} key={item.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Typography variant="h6" gutterBottom>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          {format(new Date(item.publishedAt), 'MMM d, yyyy HH:mm')} • {item.source}
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {item.description}
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Chip
                            label={item.sentiment}
                            size="small"
                            sx={{ bgcolor: getSentimentColor(item.sentiment), color: 'white' }}
                          />
                          <Chip
                            label={`${item.impact} impact`}
                            size="small"
                            sx={{ bgcolor: getImpactColor(item.impact), color: 'white' }}
                          />
                          {item.categories.map(category => (
                            <Chip key={category} label={category} size="small" variant="outlined" />
                          ))}
                          {item.currencies.map(currency => (
                            <Chip key={currency} label={currency} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                      <Box ml={2} display="flex" flexDirection="column" alignItems="flex-end">
                        <IconButton onClick={() => handleBookmark(item.id)}>
                          {newsStore.bookmarkedNews.has(item.id) ? (
                            <BookmarkIcon color="primary" />
                          ) : (
                            <BookmarkBorderIcon />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {newsStore.hasMorePages && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                disabled={newsStore.loading}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Load More
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
});

export default NewsPage;

