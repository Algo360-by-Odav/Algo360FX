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
  Button,
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

const dummyVideos: Video[] = [
  {
    id: '1',
    title: 'Price Action Trading Masterclass',
    description: 'Learn how to read and trade pure price action like a professional',
    thumbnail: '/assets/thumbnails/price-action.jpg',
    duration: '45:30',
    views: 15420,
    rating: 4.8,
    category: 'Technical Analysis',
    instructor: 'John Smith',
    videoUrl: 'https://example.com/videos/price-action'
  },
  {
    id: '2',
    title: 'Advanced Candlestick Patterns',
    description: 'Master the art of Japanese candlestick patterns and their applications',
    thumbnail: '/assets/thumbnails/candlesticks.jpg',
    duration: '38:15',
    views: 12350,
    rating: 4.7,
    category: 'Technical Analysis',
    instructor: 'Sarah Johnson',
    videoUrl: 'https://example.com/videos/candlesticks'
  },
  {
    id: '3',
    title: 'Risk Management Essentials',
    description: 'Learn proper risk management techniques for consistent trading',
    thumbnail: '/assets/thumbnails/risk.jpg',
    duration: '52:20',
    views: 9840,
    rating: 4.9,
    category: 'Risk Management',
    instructor: 'Michael Brown',
    videoUrl: 'https://example.com/videos/risk'
  }
];

const TradingVideos: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVideo(null);
  };

  const toggleBookmark = (videoId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setBookmarked(prev => {
      const newBookmarked = new Set(prev);
      if (newBookmarked.has(videoId)) {
        newBookmarked.delete(videoId);
      } else {
        newBookmarked.add(videoId);
      }
      return newBookmarked;
    });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {dummyVideos.map((video) => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                  '& .playIcon': {
                    opacity: 1,
                  },
                },
              }}
              onClick={() => handleVideoSelect(video)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{ bgcolor: 'grey.300' }}
                />
                <Box
                  className="playIcon"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(0, 0, 0, 0.3)',
                    opacity: 0,
                    transition: 'opacity 0.3s',
                  }}
                >
                  <PlayCircle sx={{ fontSize: 60, color: 'white' }} />
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
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
              </Box>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" gutterBottom>
                    {video.title}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => toggleBookmark(video.id, e)}
                    sx={{ ml: 1 }}
                  >
                    {bookmarked.has(video.id) ? <Bookmark /> : <BookmarkBorder />}
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {video.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Rating value={video.rating} readOnly precision={0.1} size="small" />
                  <Typography variant="body2" color="text.secondary">
                    ({video.views.toLocaleString()} views)
                  </Typography>
                </Box>
                <Chip label={video.category} size="small" color="primary" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedVideo && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {selectedVideo.title}
                <IconButton onClick={handleCloseDialog}>
                  <Close />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ position: 'relative', paddingTop: '56.25%', mb: 2 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    bgcolor: 'black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" color="white">
                    Video Player Placeholder
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" paragraph>
                {selectedVideo.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="subtitle2">
                  Instructor: {selectedVideo.instructor}
                </Typography>
                <Typography variant="subtitle2">
                  Category: {selectedVideo.category}
                </Typography>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default TradingVideos;
