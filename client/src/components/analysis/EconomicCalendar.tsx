import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';
import { formatNumber } from '@/utils/formatters';

interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  actual?: string;
  forecast?: string;
  previous?: string;
  currency: string;
  marketEffect: {
    direction: 'up' | 'down' | 'neutral';
    strength: number;
  };
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  relatedCurrencies: string[];
  summary: string;
}

const EconomicCalendar: React.FC = observer(() => {
  const { analysisStore } = useStores();
  const theme = useTheme();
  const [timeFilter, setTimeFilter] = useState('today');
  const [impactFilter, setImpactFilter] = useState('all');

  const economicEvents: EconomicEvent[] = [
    {
      id: '1',
      time: '2025-01-26T10:30:00Z',
      country: 'USD',
      event: 'Non-Farm Payrolls',
      impact: 'high',
      actual: '200K',
      forecast: '180K',
      previous: '175K',
      currency: 'USD',
      marketEffect: {
        direction: 'up',
        strength: 0.8,
      },
    },
    {
      id: '2',
      time: '2025-01-26T12:00:00Z',
      country: 'EUR',
      event: 'ECB Interest Rate Decision',
      impact: 'high',
      actual: '4.50%',
      forecast: '4.50%',
      previous: '4.25%',
      currency: 'EUR',
      marketEffect: {
        direction: 'neutral',
        strength: 0.5,
      },
    },
    {
      id: '3',
      time: '2025-01-26T14:30:00Z',
      country: 'GBP',
      event: 'GDP Growth Rate QoQ',
      impact: 'high',
      actual: '0.4%',
      forecast: '0.3%',
      previous: '0.2%',
      currency: 'GBP',
      marketEffect: {
        direction: 'up',
        strength: 0.6,
      },
    },
  ];

  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Fed Signals Potential Rate Cuts in 2025',
      source: 'Reuters',
      time: '2025-01-26T08:15:00Z',
      sentiment: 'positive',
      impact: 'high',
      relatedCurrencies: ['USD', 'EUR', 'JPY'],
      summary: 'Federal Reserve officials indicated they may start cutting interest rates in 2025 as inflation shows signs of cooling.',
    },
    {
      id: '2',
      title: 'ECB Maintains Hawkish Stance on Inflation',
      source: 'Bloomberg',
      time: '2025-01-26T09:30:00Z',
      sentiment: 'negative',
      impact: 'high',
      relatedCurrencies: ['EUR', 'GBP'],
      summary: 'European Central Bank maintains its hawkish stance on inflation, suggesting rates will remain higher for longer.',
    },
  ];

  const getImpactColor = (impact: 'high' | 'medium' | 'low') => {
    switch (impact) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.success.main;
      default:
        return theme.palette.text.primary;
    }
  };

  const getSentimentIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return <TrendingUpIcon sx={{ color: theme.palette.success.main }} />;
      case 'down':
        return <TrendingDownIcon sx={{ color: theme.palette.error.main }} />;
      case 'neutral':
        return <TrendingFlatIcon sx={{ color: theme.palette.grey[500] }} />;
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6">Economic Calendar & News</Typography>
          <Typography variant="body2" color="text.secondary">
            Market-moving events and news analysis
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time</InputLabel>
            <Select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              label="Time"
            >
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="tomorrow">Tomorrow</MenuItem>
              <MenuItem value="week">This Week</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Impact</InputLabel>
            <Select
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value)}
              label="Impact"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="high">High Impact</MenuItem>
              <MenuItem value="medium">Medium Impact</MenuItem>
              <MenuItem value="low">Low Impact</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh">
            <IconButton>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Economic Events
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Currency</TableCell>
                  <TableCell>Event</TableCell>
                  <TableCell>Impact</TableCell>
                  <TableCell>Actual</TableCell>
                  <TableCell>Forecast</TableCell>
                  <TableCell>Previous</TableCell>
                  <TableCell>Market Effect</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {economicEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      {new Date(event.time).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={event.currency}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{event.event}</TableCell>
                    <TableCell>
                      <Chip
                        label={event.impact}
                        size="small"
                        sx={{
                          bgcolor: getImpactColor(event.impact),
                          color: 'white',
                        }}
                      />
                    </TableCell>
                    <TableCell>{event.actual}</TableCell>
                    <TableCell>{event.forecast}</TableCell>
                    <TableCell>{event.previous}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getSentimentIcon(event.marketEffect.direction)}
                        <Typography variant="body2">
                          {formatNumber(event.marketEffect.strength * 100)}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Market News Analysis
          </Typography>
          <Grid container spacing={2}>
            {newsItems.map((news) => (
              <Grid item xs={12} md={6} key={news.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="subtitle1">
                        {news.title}
                      </Typography>
                      <Chip
                        label={news.sentiment}
                        size="small"
                        sx={{
                          bgcolor: news.sentiment === 'positive'
                            ? theme.palette.success.main
                            : news.sentiment === 'negative'
                            ? theme.palette.error.main
                            : theme.palette.grey[500],
                          color: 'white',
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {news.summary}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {news.relatedCurrencies.map((currency) => (
                          <Chip
                            key={currency}
                            label={currency}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {news.source} • {new Date(news.time).toLocaleTimeString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
});

export default EconomicCalendar;
