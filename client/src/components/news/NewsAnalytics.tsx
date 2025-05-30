import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  TimeScale,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';
import { format, subDays } from 'date-fns';
import 'chartjs-adapter-date-fns';
import {
  calculateCorrelation,
  extractCommonWords,
  getGeographicDistribution,
  aggregateNewsByDateRange,
} from '../../utils/newsAnalytics';
import { NewsItem } from '../../stores/newsStore';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  TimeScale,
  LineElement,
  PointElement
);

const currencies = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF', 'AUD/USD', 'USD/CAD'];
const dateRanges = [7, 14, 30, 90];

interface NewsAnalyticsProps {
  news: NewsItem[];
}

const NewsAnalytics: React.FC<NewsAnalyticsProps> = observer(({ news }) => {
  const theme = useTheme();
  const { priceStore } = useStores();

  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [selectedRange, setSelectedRange] = useState(30);
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(new Date());

  // Generate mock price data when currency or range changes
  useEffect(() => {
    if (priceStore) {
      priceStore.generateMockPrices(selectedCurrency, selectedRange);
    }
  }, [selectedCurrency, selectedRange, priceStore]);

  // Calculate correlation
  const correlation = useMemo(() => {
    if (!priceStore?.prices || !news) return 0;
    return calculateCorrelation(news, priceStore.prices, selectedCurrency, selectedRange);
  }, [news, priceStore?.prices, selectedCurrency, selectedRange]);

  // Get geographic distribution
  const geoData = useMemo(() => {
    if (!news) return {};
    return getGeographicDistribution(news);
  }, [news]);

  // Get sentiment trends
  const sentimentTrends = useMemo(() => {
    if (!news) return { sentimentTrend: [] };
    return aggregateNewsByDateRange(news, startDate, endDate);
  }, [news, startDate, endDate]);

  // Extract common words for word cloud
  const commonWords = useMemo(() => {
    if (!news) return [];
    return extractCommonWords(news);
  }, [news]);

  if (!news || news.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <Typography variant="h6" color="text.secondary">
          No news data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Controls */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            fullWidth
            label="Currency Pair"
            value={selectedCurrency}
            onChange={(e) => setSelectedCurrency(e.target.value)}
          >
            {currencies.map((currency) => (
              <MenuItem key={currency} value={currency}>
                {currency}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            select
            fullWidth
            label="Date Range"
            value={selectedRange}
            onChange={(e) => setSelectedRange(Number(e.target.value))}
          >
            {dateRanges.map((days) => (
              <MenuItem key={days} value={days}>
                Last {days} days
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(date) => date && setStartDate(date)}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(date) => date && setEndDate(date)}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>

      {/* Analytics Cards */}
      <Grid container spacing={3}>
        {/* Correlation Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h6">Price-Sentiment Correlation</Typography>
                <Tooltip title="Shows the correlation between news sentiment and price movements">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="h4" color={correlation > 0 ? 'success.main' : 'error.main'}>
                {(correlation * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {correlation > 0 ? 'Positive' : 'Negative'} correlation with {selectedCurrency}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Geographic Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h6">Geographic Distribution</Typography>
                <Tooltip title="Distribution of news sources by region">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box height={200}>
                <Pie
                  data={{
                    labels: Object.keys(geoData),
                    datasets: [
                      {
                        data: Object.values(geoData),
                        backgroundColor: [
                          theme.palette.primary.main,
                          theme.palette.secondary.main,
                          theme.palette.error.main,
                          theme.palette.warning.main,
                          theme.palette.info.main,
                          theme.palette.success.main,
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sentiment Trends */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h6">Sentiment Trends</Typography>
                <Tooltip title="Daily sentiment distribution over time">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box height={300}>
                <Line
                  data={{
                    labels: sentimentTrends.sentimentTrend.map(d => format(new Date(d.date), 'MMM d')),
                    datasets: [
                      {
                        label: 'Positive',
                        data: sentimentTrends.sentimentTrend.map(d => d.positive),
                        borderColor: theme.palette.success.main,
                        backgroundColor: theme.palette.success.main,
                        fill: false,
                      },
                      {
                        label: 'Negative',
                        data: sentimentTrends.sentimentTrend.map(d => d.negative),
                        borderColor: theme.palette.error.main,
                        backgroundColor: theme.palette.error.main,
                        fill: false,
                      },
                      {
                        label: 'Neutral',
                        data: sentimentTrends.sentimentTrend.map(d => d.neutral),
                        borderColor: theme.palette.grey[500],
                        backgroundColor: theme.palette.grey[500],
                        fill: false,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        type: 'category',
                        display: true,
                      },
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Common Words */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h6">Common Themes</Typography>
                <Tooltip title="Most frequently occurring words in news articles">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {commonWords.map((word) => (
                  <Chip
                    key={word.text}
                    label={word.text}
                    size="small"
                    sx={{
                      fontSize: 12 + (word.value * 4),
                      bgcolor: theme.palette.primary.main,
                      color: 'white',
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
});

export default NewsAnalytics;

