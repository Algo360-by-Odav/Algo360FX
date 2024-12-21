import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStoreContext } from '../../stores/RootStoreContext';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  source: string;
  author: string;
  publishedAt: Date;
  sentiment: 'positive' | 'negative' | 'neutral';
  relatedSymbols: string[];
  impact: 'high' | 'medium' | 'low';
}

const MarketNews: React.FC = observer(() => {
  const { stockMarketStore } = useRootStoreContext();
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Mock news data
  const [news] = useState<NewsItem[]>([
    {
      id: '1',
      title: 'Tech Stocks Surge on AI Breakthrough',
      summary: 'Major tech companies see significant gains following announcement of new AI capabilities',
      content: `In a groundbreaking development, leading tech companies announced major advances in artificial intelligence technology, 
               driving substantial gains across the technology sector. Market analysts predict this could lead to increased growth 
               and market opportunities in the coming quarters.
               
               The breakthrough particularly impacts cloud computing and data processing capabilities, with potential applications 
               across various industries including healthcare, finance, and manufacturing.`,
      source: 'Market Watch',
      author: 'John Smith',
      publishedAt: new Date('2024-12-21T09:30:00'),
      sentiment: 'positive',
      relatedSymbols: ['AAPL', 'MSFT', 'GOOGL'],
      impact: 'high',
    },
    {
      id: '2',
      title: 'Federal Reserve Signals Potential Rate Changes',
      summary: 'Fed minutes suggest possible shift in monetary policy',
      content: `The Federal Reserve's latest meeting minutes indicate a potential shift in monetary policy, with officials 
               discussing the possibility of adjusting interest rates in response to economic indicators. Market participants 
               are closely monitoring these developments for implications on various sectors.`,
      source: 'Financial Times',
      author: 'Sarah Johnson',
      publishedAt: new Date('2024-12-21T10:15:00'),
      sentiment: 'neutral',
      relatedSymbols: ['JPM', 'GS', 'MS'],
      impact: 'high',
    },
    {
      id: '3',
      title: 'Supply Chain Disruptions Impact Manufacturing Sector',
      summary: 'Global supply chain issues continue to affect manufacturing output',
      content: `Ongoing supply chain disruptions are creating challenges for manufacturing companies, leading to production 
               delays and increased costs. Several major manufacturers have revised their quarterly forecasts in response to 
               these challenges.`,
      source: 'Reuters',
      author: 'Michael Chen',
      publishedAt: new Date('2024-12-21T08:45:00'),
      sentiment: 'negative',
      relatedSymbols: ['F', 'GM', 'CAT'],
      impact: 'medium',
    },
  ]);

  const getSentimentColor = (sentiment: NewsItem['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      default:
        return 'default';
    }
  };

  const getImpactColor = (impact: NewsItem['impact']) => {
    switch (impact) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  const handleNewsClick = (newsItem: NewsItem) => {
    setSelectedNews(newsItem);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Featured News */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Market Headlines
            </Typography>
            <Grid container spacing={2}>
              {news.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {item.title}
                        </Typography>
                        <Box>
                          <Chip
                            size="small"
                            label={item.sentiment}
                            color={getSentimentColor(item.sentiment)}
                            icon={item.sentiment === 'positive' ? <TrendingUpIcon /> : 
                                  item.sentiment === 'negative' ? <TrendingDownIcon /> : undefined}
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            size="small"
                            label={`Impact: ${item.impact}`}
                            color={getImpactColor(item.impact)}
                          />
                        </Box>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {item.summary}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        {item.relatedSymbols.map((symbol) => (
                          <Chip
                            key={symbol}
                            label={symbol}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                            {item.author[0]}
                          </Avatar>
                          <Typography variant="body2" color="text.secondary">
                            {item.author} • {item.source}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(item.publishedAt).toLocaleTimeString()}
                        </Typography>
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => handleNewsClick(item)}>
                        Read More
                      </Button>
                      <IconButton size="small">
                        <ShareIcon />
                      </IconButton>
                      <IconButton size="small">
                        <BookmarkBorderIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* News Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedNews && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedNews.title}</Typography>
                <Box>
                  <Chip
                    size="small"
                    label={selectedNews.sentiment}
                    color={getSentimentColor(selectedNews.sentiment)}
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    size="small"
                    label={`Impact: ${selectedNews.impact}`}
                    color={getImpactColor(selectedNews.impact)}
                  />
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedNews.content}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {selectedNews.author} • {selectedNews.source}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(selectedNews.publishedAt).toLocaleString()}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              <Button
                startIcon={<ShareIcon />}
                onClick={() => {
                  // Handle share functionality
                  console.log('Share news:', selectedNews.id);
                }}
              >
                Share
              </Button>
              <Button
                startIcon={<BookmarkIcon />}
                onClick={() => {
                  // Handle bookmark functionality
                  console.log('Bookmark news:', selectedNews.id);
                }}
              >
                Save
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
});

export default MarketNews;
