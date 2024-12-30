import React from 'react';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/RootStoreContext';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  Button,
} from '@mui/material';
import {
  Article,
  TrendingUp,
  TrendingDown,
  Notifications,
  Star,
  Schedule,
} from '@mui/icons-material';

const NewsDashboard = observer(() => {
  const rootStore = useRootStore();

  const newsItems = [
    {
      id: 1,
      title: 'Fed Signals Potential Rate Cut in 2024',
      source: 'Reuters',
      time: '10 minutes ago',
      impact: 'High',
      currency: 'USD',
      sentiment: 'Bullish',
    },
    {
      id: 2,
      title: 'ECB Maintains Current Policy Stance',
      source: 'Bloomberg',
      time: '30 minutes ago',
      impact: 'Medium',
      currency: 'EUR',
      sentiment: 'Neutral',
    },
    {
      id: 3,
      title: 'UK GDP Shows Stronger Growth Than Expected',
      source: 'Financial Times',
      time: '1 hour ago',
      impact: 'High',
      currency: 'GBP',
      sentiment: 'Bullish',
    },
    {
      id: 4,
      title: 'Bank of Japan Discusses Yield Curve Control',
      source: 'Nikkei',
      time: '2 hours ago',
      impact: 'Medium',
      currency: 'JPY',
      sentiment: 'Bearish',
    },
  ];

  const upcomingEvents = [
    {
      time: '14:30 GMT',
      event: 'US CPI Data Release',
      impact: 'High',
      currency: 'USD',
    },
    {
      time: '15:00 GMT',
      event: 'ECB President Speech',
      impact: 'Medium',
      currency: 'EUR',
    },
    {
      time: '19:00 GMT',
      event: 'FOMC Minutes',
      impact: 'High',
      currency: 'USD',
    },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'bullish':
        return <TrendingUp color="success" />;
      case 'bearish':
        return <TrendingDown color="error" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        News & Events
      </Typography>

      <Grid container spacing={3}>
        {/* Latest News */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Latest News
              </Typography>
              <List>
                {newsItems.map((news, index) => (
                  <React.Fragment key={news.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        <Article />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ mr: 1 }}>
                              {news.title}
                            </Typography>
                            {getSentimentIcon(news.sentiment)}
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {news.source} • {news.time}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip 
                                label={news.impact} 
                                size="small" 
                                color={getImpactColor(news.impact)} 
                              />
                              <Chip 
                                label={news.currency} 
                                size="small" 
                                variant="outlined" 
                              />
                              <Chip 
                                label={news.sentiment} 
                                size="small" 
                                variant="outlined"
                                color={news.sentiment === 'Bullish' ? 'success' : news.sentiment === 'Bearish' ? 'error' : 'default'}
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < newsItems.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Events */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Upcoming Events
                </Typography>
                <Button
                  startIcon={<Notifications />}
                  size="small"
                >
                  Set Alert
                </Button>
              </Box>
              <List>
                {upcomingEvents.map((event, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <Schedule />
                      </ListItemIcon>
                      <ListItemText
                        primary={event.event}
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {event.time}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip 
                                label={event.impact} 
                                size="small" 
                                color={getImpactColor(event.impact)} 
                              />
                              <Chip 
                                label={event.currency} 
                                size="small" 
                                variant="outlined" 
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < upcomingEvents.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Market Analysis */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Market Analysis
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                  Market analysis chart and sentiment indicators will be implemented here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

export default NewsDashboard;
