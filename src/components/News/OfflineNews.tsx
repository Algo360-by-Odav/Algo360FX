import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  List,
  ListItem,
  Divider,
  Button,
  useTheme,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  WifiOff as OfflineIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { offlineStorage } from '../../services/OfflineStorage';
import { useOfflineCapability } from '../../hooks/useOfflineCapability';

export function OfflineNews() {
  const [news, setNews] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isOnline } = useOfflineCapability();
  const theme = useTheme();

  useEffect(() => {
    loadNews();
  }, [selectedCategory]);

  const loadNews = async () => {
    const savedNews = await offlineStorage.getNews(selectedCategory || undefined);
    setNews(savedNews);
  };

  const handleMarkAsRead = async (id: string) => {
    await offlineStorage.markNewsAsRead(id);
    loadNews();
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const categories = ['Market Analysis', 'Economic Calendar', 'Company News'];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Market News</Typography>
        {!isOnline && (
          <Chip
            icon={<OfflineIcon />}
            label="Offline Mode"
            color="warning"
            size="small"
          />
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <Button
          variant={selectedCategory === null ? 'contained' : 'outlined'}
          size="small"
          onClick={() => setSelectedCategory(null)}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </Box>

      <List>
        {news.map((item, index) => (
          <React.Fragment key={item.id}>
            <ListItem
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                py: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {item.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {!item.read && (
                    <CircleIcon
                      sx={{
                        fontSize: 12,
                        color: getImportanceColor(item.importance),
                      }}
                    />
                  )}
                  <Chip
                    label={item.category}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {item.content}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 1,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {new Date(item.timestamp).toLocaleString()}
                </Typography>
                {!item.read && (
                  <Button
                    size="small"
                    onClick={() => handleMarkAsRead(item.id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </Box>
            </ListItem>
            {index < news.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>

      {news.length === 0 && (
        <Card sx={{ bgcolor: 'background.default' }}>
          <CardContent>
            <Typography align="center" color="text.secondary">
              No news available{selectedCategory ? ` in ${selectedCategory}` : ''}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
