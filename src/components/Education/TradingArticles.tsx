// src/components/Education/TradingArticles.tsx
import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  AccessTime,
  Bookmark,
  BookmarkBorder,
  Close,
  ArrowForward,
} from '@mui/icons-material';

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    title: string;
  };
  date: string;
  tags: string[];
}

const tradingArticles: Article[] = [
  {
    id: '1',
    title: 'Understanding Market Cycles and Trends',
    summary: 'Learn how to identify and trade different market cycles effectively',
    content: `Market cycles are predictable patterns that occur in financial markets...`,
    image: 'https://example.com/market-cycles.jpg',
    readTime: '8 min read',
    category: 'Market Analysis',
    author: {
      name: 'Jennifer Lee',
      avatar: 'https://example.com/avatars/jennifer.jpg',
      title: 'Senior Market Analyst'
    },
    date: '2024-12-15',
    tags: ['Market Cycles', 'Technical Analysis', 'Trading Strategy']
  },
  {
    id: '2',
    title: 'The Complete Guide to Risk Management',
    summary: 'Essential risk management strategies for successful trading',
    content: `Risk management is the cornerstone of successful trading...`,
    image: 'https://example.com/risk-management.jpg',
    readTime: '12 min read',
    category: 'Risk Management',
    author: {
      name: 'Mark Thompson',
      avatar: 'https://example.com/avatars/mark.jpg',
      title: 'Risk Management Expert'
    },
    date: '2024-12-18',
    tags: ['Risk Management', 'Position Sizing', 'Trading Psychology']
  },
  {
    id: '3',
    title: 'Advanced Price Action Trading Patterns',
    summary: 'Master the most effective price action patterns for day trading',
    content: `Price action trading is one of the most powerful approaches...`,
    image: 'https://example.com/price-action.jpg',
    readTime: '15 min read',
    category: 'Technical Analysis',
    author: {
      name: 'Alex Chen',
      avatar: 'https://example.com/avatars/alex.jpg',
      title: 'Professional Day Trader'
    },
    date: '2024-12-20',
    tags: ['Price Action', 'Chart Patterns', 'Day Trading']
  },
  {
    id: '4',
    title: 'Institutional Trading Strategies Revealed',
    summary: 'Learn how institutional traders approach the market',
    content: `Understanding how institutional traders operate is crucial...`,
    image: 'https://example.com/institutional-trading.jpg',
    readTime: '10 min read',
    category: 'Professional Trading',
    author: {
      name: 'Sarah Williams',
      avatar: 'https://example.com/avatars/sarah.jpg',
      title: 'Former Institutional Trader'
    },
    date: '2024-12-21',
    tags: ['Institutional Trading', 'Market Analysis', 'Professional Trading']
  }
];

const TradingArticles: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (articleId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(articleId)) {
      newFavorites.delete(articleId);
    } else {
      newFavorites.add(articleId);
    }
    setFavorites(newFavorites);
  };

  return (
    <>
      <Grid container spacing={3}>
        {tradingArticles.map((article) => (
          <Grid item xs={12} md={6} key={article.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={article.image}
                  alt={article.title}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                  }}
                  onClick={() => toggleFavorite(article.id)}
                >
                  {favorites.has(article.id) ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2 }}>
                  <Chip label={article.category} size="small" color="primary" />
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption" color="text.secondary">
                      {article.readTime}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="h6" gutterBottom>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {article.summary}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar src={article.author.avatar} sx={{ width: 32, height: 32, mr: 1 }} />
                  <Box>
                    <Typography variant="subtitle2">{article.author.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {article.author.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {article.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  onClick={() => setSelectedArticle(article)}
                  fullWidth
                >
                  Read Article
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedArticle && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {selectedArticle.title}
              <IconButton onClick={() => setSelectedArticle(null)}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={selectedArticle.image}
                  alt={selectedArticle.title}
                  sx={{ borderRadius: 1 }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar src={selectedArticle.author.avatar} sx={{ width: 48, height: 48, mr: 2 }} />
                <Box>
                  <Typography variant="h6">{selectedArticle.author.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedArticle.author.title} • {selectedArticle.date}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" paragraph>
                {selectedArticle.content}
              </Typography>
              <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedArticle.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" />
                ))}
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default TradingArticles;
