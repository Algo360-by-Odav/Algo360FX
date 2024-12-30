import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  LinearProgress,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Sentiment,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Article,
  Twitter,
  Reddit,
  Public,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { AreaClosed, Line, Bar } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { scaleTime, scaleLinear } from '@visx/scale';

interface SentimentData {
  overall: number;
  sources: {
    news: number;
    social: number;
    technical: number;
    fundamental: number;
  };
  trends: {
    timestamp: Date;
    value: number;
  }[];
  news: {
    title: string;
    source: string;
    sentiment: number;
    impact: number;
    timestamp: Date;
  }[];
  socialMentions: {
    platform: string;
    count: number;
    sentiment: number;
  }[];
  keyTopics: {
    topic: string;
    sentiment: number;
    volume: number;
  }[];
}

const MarketSentiment: React.FC = observer(() => {
  const [symbol, setSymbol] = useState('EURUSD');
  const [timeframe, setTimeframe] = useState('1D');
  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSentimentData();
  }, [symbol, timeframe]);

  const fetchSentimentData = async () => {
    setLoading(true);
    try {
      // Implement sentiment data fetching
      const data = await analyzeSentiment();
      setSentimentData(data);
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeSentiment = async (): Promise<SentimentData> => {
    // Mock sentiment data
    return {
      overall: 0.65,
      sources: {
        news: 0.72,
        social: 0.58,
        technical: 0.62,
        fundamental: 0.68,
      },
      trends: Array(24).fill(0).map((_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 3600000),
        value: 0.5 + Math.random() * 0.4 - 0.2,
      })),
      news: [
        {
          title: 'Fed signals potential rate cuts in 2024',
          source: 'Reuters',
          sentiment: 0.85,
          impact: 0.9,
          timestamp: new Date(),
        },
        {
          title: 'ECB maintains hawkish stance on inflation',
          source: 'Bloomberg',
          sentiment: -0.3,
          impact: 0.7,
          timestamp: new Date(),
        },
      ],
      socialMentions: [
        {
          platform: 'Twitter',
          count: 1250,
          sentiment: 0.62,
        },
        {
          platform: 'Reddit',
          count: 850,
          sentiment: 0.58,
        },
      ],
      keyTopics: [
        {
          topic: 'Interest Rates',
          sentiment: 0.75,
          volume: 2500,
        },
        {
          topic: 'Inflation',
          sentiment: -0.2,
          volume: 1800,
        },
        {
          topic: 'Economic Growth',
          sentiment: 0.45,
          volume: 1200,
        },
      ],
    };
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.6) return 'success.main';
    if (sentiment <= 0.4) return 'error.main';
    return 'warning.main';
  };

  const SentimentGauge: React.FC<{ value: number }> = ({ value }) => (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        value={value * 100}
        size={120}
        thickness={8}
        sx={{ color: getSentimentColor(value) }}
      />
      <Box
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
        top={0}
        left={0}
        bottom={0}
        right={0}
      >
        <Typography variant="h4" component="div" color={getSentimentColor(value)}>
          {(value * 100).toFixed(0)}%
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Market Sentiment Analysis
      </Typography>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Symbol</InputLabel>
            <Select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            >
              <MenuItem value="EURUSD">EUR/USD</MenuItem>
              <MenuItem value="GBPUSD">GBP/USD</MenuItem>
              <MenuItem value="USDJPY">USD/JPY</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <MenuItem value="1H">1 Hour</MenuItem>
              <MenuItem value="4H">4 Hours</MenuItem>
              <MenuItem value="1D">1 Day</MenuItem>
              <MenuItem value="1W">1 Week</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : sentimentData ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Overall Sentiment
              </Typography>
              <SentimentGauge value={sentimentData.overall} />
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary">
                  Based on analysis of news, social media, and market data
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Sentiment by Source
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(sentimentData.sources).map(([source, value]) => (
                  <Grid item xs={6} key={source}>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {source.charAt(0).toUpperCase() + source.slice(1)}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={value * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'background.paper',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getSentimentColor(value),
                        },
                      }}
                    />
                    <Typography variant="body2" align="right">
                      {(value * 100).toFixed(0)}%
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Latest News Impact
              </Typography>
              <List>
                {sentimentData.news.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        <Article />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        secondary={
                          <>
                            {item.source} • {item.timestamp.toLocaleTimeString()}
                            <Box mt={1}>
                              <Chip
                                size="small"
                                label={`Impact: ${(item.impact * 100).toFixed(0)}%`}
                                color={item.impact > 0.6 ? 'error' : 'warning'}
                              />
                              <Chip
                                size="small"
                                label={`Sentiment: ${
                                  item.sentiment > 0 ? 'Positive' : 'Negative'
                                }`}
                                color={item.sentiment > 0 ? 'success' : 'error'}
                                sx={{ ml: 1 }}
                              />
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                    {index < sentimentData.news.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Social Media Sentiment
              </Typography>
              <List>
                {sentimentData.socialMentions.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemIcon>
                        {item.platform === 'Twitter' ? <Twitter /> : <Reddit />}
                      </ListItemIcon>
                      <ListItemText
                        primary={`${item.platform} Mentions: ${item.count}`}
                        secondary={
                          <Box mt={1}>
                            <LinearProgress
                              variant="determinate"
                              value={item.sentiment * 100}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: getSentimentColor(item.sentiment),
                                },
                              }}
                            />
                            <Typography variant="body2" align="right">
                              Sentiment: {(item.sentiment * 100).toFixed(0)}%
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < sentimentData.socialMentions.length - 1 && (
                      <Divider />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Key Topics
              </Typography>
              <Grid container spacing={2}>
                {sentimentData.keyTopics.map((topic) => (
                  <Grid item xs={12} md={4} key={topic.topic}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {topic.topic}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          {topic.sentiment > 0 ? (
                            <TrendingUp color="success" />
                          ) : (
                            <TrendingDown color="error" />
                          )}
                          <Typography
                            color={
                              topic.sentiment > 0
                                ? 'success.main'
                                : 'error.main'
                            }
                          >
                            {Math.abs(topic.sentiment * 100).toFixed(0)}%
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          Volume: {topic.volume} mentions
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Typography color="textSecondary" align="center">
          No sentiment data available
        </Typography>
      )}
    </Box>
  );
});

export default MarketSentiment;
