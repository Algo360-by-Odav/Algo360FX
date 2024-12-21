// src/components/Education/TradingVideos.tsx
import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Rating,
} from '@mui/material';
import {
  PlayCircle,
  AccessTime,
  Bookmark,
  BookmarkBorder,
  Close,
} from '@mui/icons-material';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  rating: number;
  category: string;
  instructor: string;
  videoUrl: string;
}

const tradingVideos: Video[] = [
  {
    id: '1',
    title: 'Price Action Trading Masterclass',
    description: 'Learn how to read and trade pure price action like a professional',
    thumbnail: 'https://example.com/price-action.jpg',
    duration: '45:30',
    views: 15420,
    rating: 4.8,
    category: 'Technical Analysis',
    instructor: 'John Smith',
    videoUrl: 'https://example.com/videos/price-action'
  },
  {
    id: '2',
    title: 'Understanding Market Structure',
    description: 'Deep dive into market structure and order flow analysis',
    thumbnail: 'https://example.com/market-structure.jpg',
    duration: '38:15',
    views: 12350,
    rating: 4.7,
    category: 'Market Analysis',
    instructor: 'Sarah Johnson',
    videoUrl: 'https://example.com/videos/market-structure'
  },
  {
    id: '3',
    title: 'Trading Psychology: Master Your Emotions',
    description: 'Learn to control emotions and develop a winning trading mindset',
    thumbnail: 'https://example.com/trading-psychology.jpg',
    duration: '52:20',
    views: 18900,
    rating: 4.9,
    category: 'Psychology',
    instructor: 'Dr. Michael Brown',
    videoUrl: 'https://example.com/videos/trading-psychology'
  },
  {
    id: '4',
    title: 'Advanced Fibonacci Trading Strategies',
    description: 'Master Fibonacci retracements and extensions for precise entries and exits',
    thumbnail: 'https://example.com/fibonacci.jpg',
    duration: '41:45',
    views: 10780,
    rating: 4.6,
    category: 'Technical Analysis',
    instructor: 'Emma Davis',
    videoUrl: 'https://example.com/videos/fibonacci'
  },
  {
    id: '5',
    title: 'Risk Management Essentials',
    description: 'Learn proper position sizing and risk management techniques',
    thumbnail: 'https://example.com/risk-management.jpg',
    duration: '35:50',
    views: 14200,
    rating: 4.8,
    category: 'Risk Management',
    instructor: 'Robert Wilson',
    videoUrl: 'https://example.com/videos/risk-management'
  },
  {
    id: '6',
    title: 'Supply and Demand Trading',
    description: 'Identify and trade key supply and demand zones',
    thumbnail: 'https://example.com/supply-demand.jpg',
    duration: '49:15',
    views: 11600,
    rating: 4.7,
    category: 'Market Analysis',
    instructor: 'David Chen',
    videoUrl: 'https://example.com/videos/supply-demand'
  }
];

const TradingVideos: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const toggleFavorite = (videoId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(videoId)) {
      newFavorites.delete(videoId);
    } else {
      newFavorites.add(videoId);
    }
    setFavorites(newFavorites);
  };

  return (
    <>
      <Grid container spacing={3}>
        {tradingVideos.map((video) => (
          <Grid item xs={12} md={4} key={video.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => setSelectedVideo(video)}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    px: 1,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="caption">{video.duration}</Typography>
                </Box>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.6)',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                  }}
                  onClick={() => toggleFavorite(video.id)}
                >
                  {favorites.has(video.id) ? <Bookmark /> : <BookmarkBorder />}
                </IconButton>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {video.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {video.description}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label={video.category} size="small" />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Rating value={video.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {video.rating}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {video.instructor} • {video.views.toLocaleString()} views
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedVideo && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {selectedVideo.title}
              <IconButton onClick={() => setSelectedVideo(null)}>
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <Box
                  component="iframe"
                  src={selectedVideo.videoUrl}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                />
              </Box>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {selectedVideo.description}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Instructor: {selectedVideo.instructor}</Typography>
                <Typography variant="subtitle2">Category: {selectedVideo.category}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Rating value={selectedVideo.rating} precision={0.1} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {selectedVideo.rating} • {selectedVideo.views.toLocaleString()} views
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  );
};

export default TradingVideos;
