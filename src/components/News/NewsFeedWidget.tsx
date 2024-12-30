import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Chip,
  IconButton,
  Button,
  Divider,
  TextField,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Article,
  Bookmark,
  BookmarkBorder,
  FilterList,
  Search,
  TrendingUp,
  Share,
  OpenInNew,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceIcon?: string;
  url: string;
  datetime: Date;
  category: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'low' | 'medium' | 'high';
  symbols: string[];
  bookmarked: boolean;
}

const NewsFeedWidget: React.FC = observer(() => {
  const theme = useTheme();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSentiments, setSelectedSentiments] = useState<string[]>([]);

  useEffect(() => {
    // Simulated news data
    const sampleNews: NewsItem[] = [
      {
        id: '1',
        title: 'Fed Signals Potential Rate Hikes in Response to Inflation Concerns',
        summary: 'Federal Reserve officials indicated they may need to raise interest rates further to combat persistent inflation pressures...',
        source: 'Reuters',
        sourceIcon: '🌐',
        url: 'https://example.com/news/1',
        datetime: new Date(),
        category: 'Central Banks',
        sentiment: 'negative',
        impact: 'high',
        symbols: ['USD', 'EUR/USD', 'GBP/USD'],
        bookmarked: false,
      },
      {
        id: '2',
        title: "ECB's Lagarde: Eurozone Economy Shows Signs of Stabilization",
        summary: 'European Central Bank President Christine Lagarde noted emerging signs of economic stabilization in the eurozone...',
        source: 'Bloomberg',
        sourceIcon: '📊',
        url: 'https://example.com/news/2',
        datetime: new Date(),
        category: 'Economy',
        sentiment: 'positive',
        impact: 'medium',
        symbols: ['EUR', 'EUR/USD', 'EUR/GBP'],
        bookmarked: true,
      },
      {
        id: '3',
        title: 'Bank of Japan Maintains Ultra-Low Interest Rates',
        summary: 'The Bank of Japan kept its ultra-low interest rates unchanged and maintained its dovish policy stance...',
        source: 'Financial Times',
        sourceIcon: '📰',
        url: 'https://example.com/news/3',
        datetime: new Date(),
        category: 'Central Banks',
        sentiment: 'neutral',
        impact: 'medium',
        symbols: ['JPY', 'USD/JPY', 'EUR/JPY'],
        bookmarked: false,
      },
    ];

    setNews(sampleNews);
  }, []);

  const handleBookmark = (id: string) => {
    setNews(news.map(item => 
      item.id === id ? { ...item, bookmarked: !item.bookmarked } : item
    ));
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return theme.palette.success.main;
      case 'negative':
        return theme.palette.error.main;
      default:
        return theme.palette.info.main;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      default:
        return theme.palette.success.main;
    }
  };

  const filteredNews = news.filter((item) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(item.category);
    const matchesSentiment =
      selectedSentiments.length === 0 ||
      selectedSentiments.includes(item.sentiment);
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSentiment && matchesSearch;
  });

  return (
    <Card sx={{ height: '100%' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" component="h2">
          Market News
        </Typography>
        <IconButton onClick={(e) => setFilterAnchor(e.currentTarget)}>
          <FilterList />
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
          sx={{ mb: 2 }}
        />

        <List>
          {filteredNews.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ mt: 1 }}>
                  <Avatar sx={{ bgcolor: 'background.paper' }}>
                    {item.sourceIcon}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ flex: 1, mr: 1 }}>
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleBookmark(item.id)}
                        >
                          {item.bookmarked ? <Bookmark /> : <BookmarkBorder />}
                        </IconButton>
                        <IconButton size="small" component="a" href={item.url} target="_blank">
                          <OpenInNew />
                        </IconButton>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        {item.summary}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          size="small"
                          label={item.source}
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          label={item.category}
                          variant="outlined"
                          color="primary"
                        />
                        <Chip
                          size="small"
                          label={item.sentiment}
                          sx={{
                            color: getSentimentColor(item.sentiment),
                            borderColor: getSentimentColor(item.sentiment),
                          }}
                          variant="outlined"
                        />
                        <Chip
                          size="small"
                          label={`Impact: ${item.impact}`}
                          sx={{
                            color: getImpactColor(item.impact),
                            borderColor: getImpactColor(item.impact),
                          }}
                          variant="outlined"
                        />
                      </Box>
                    </>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
      </Box>

      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={() => setFilterAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Categories
          </Typography>
        </MenuItem>
        {['Central Banks', 'Economy', 'Markets'].map((category) => (
          <MenuItem
            key={category}
            onClick={() => {
              setSelectedCategories((prev) =>
                prev.includes(category)
                  ? prev.filter((c) => c !== category)
                  : [...prev, category]
              );
            }}
          >
            <ListItemIcon>
              {selectedCategories.includes(category) ? (
                <ArrowUpward fontSize="small" />
              ) : (
                <ArrowDownward fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText primary={category} />
          </MenuItem>
        ))}
      </Menu>
    </Card>
  );
});

export default NewsFeedWidget;
