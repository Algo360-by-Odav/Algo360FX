import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Refresh,
  MoreVert,
  ArrowUpward,
  ArrowDownward,
  Timeline,
  ShowChart,
  Assessment,
  Article,
  Notifications,
} from '@mui/icons-material';
import { AdvancedChart } from '../AdvancedChart/AdvancedChart';
import './MarketAnalysis.css';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  high: number;
  low: number;
}

interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  impact: 'high' | 'medium' | 'low';
}

const MarketAnalysis: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [timeframe, setTimeframe] = useState('1D');
  const [selectedMarket, setSelectedMarket] = useState('forex');

  const marketData: MarketData[] = [
    {
      symbol: 'EUR/USD',
      price: 1.2150,
      change: 0.25,
      volume: 125000,
      high: 1.2180,
      low: 1.2120,
    },
    {
      symbol: 'GBP/USD',
      price: 1.3850,
      change: -0.15,
      volume: 98000,
      high: 1.3880,
      low: 1.3820,
    },
  ];

  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Fed Minutes Show Increasing Concern Over Inflation',
      source: 'Reuters',
      time: '2h ago',
      impact: 'high',
    },
    {
      id: '2',
      title: 'ECB Maintains Current Policy Stance',
      source: 'Bloomberg',
      time: '4h ago',
      impact: 'medium',
    },
  ];

  const renderMarketOverview = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper className="chart-container">
          <Box className="chart-header">
            <Typography variant="h6">EUR/USD</Typography>
            <Box className="chart-controls">
              <Button
                size="small"
                variant={timeframe === '1D' ? 'contained' : 'outlined'}
                onClick={() => setTimeframe('1D')}
              >
                1D
              </Button>
              <Button
                size="small"
                variant={timeframe === '4H' ? 'contained' : 'outlined'}
                onClick={() => setTimeframe('4H')}
              >
                4H
              </Button>
              <Button
                size="small"
                variant={timeframe === '1H' ? 'contained' : 'outlined'}
                onClick={() => setTimeframe('1H')}
              >
                1H
              </Button>
            </Box>
          </Box>
          <AdvancedChart />
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Market Movers</Typography>
                <List>
                  {marketData.map((item) => (
                    <ListItem key={item.symbol}>
                      <ListItemText
                        primary={item.symbol}
                        secondary={`Volume: ${item.volume.toLocaleString()}`}
                      />
                      <Box className="price-info">
                        <Typography variant="subtitle1">
                          {item.price}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={item.change > 0 ? 'success.main' : 'error.main'}
                          className="change"
                        >
                          {item.change > 0 ? '+' : ''}
                          {item.change}%
                        </Typography>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Market News</Typography>
                <List>
                  {newsItems.map((item) => (
                    <ListItem key={item.id}>
                      <ListItemText
                        primary={item.title}
                        secondary={`${item.source} • ${item.time}`}
                      />
                      <Chip
                        label={item.impact}
                        size="small"
                        className={`impact-${item.impact}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );

  const renderTechnicalAnalysis = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Technical Indicators</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Indicator</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Signal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>RSI (14)</TableCell>
                    <TableCell>65.5</TableCell>
                    <TableCell>
                      <Chip label="Neutral" size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>MACD</TableCell>
                    <TableCell>0.0025</TableCell>
                    <TableCell>
                      <Chip
                        label="Buy"
                        size="small"
                        className="signal-buy"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Support & Resistance</Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <ArrowUpward color="error" />
                </ListItemIcon>
                <ListItemText
                  primary="Resistance 3"
                  secondary="1.2200"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ArrowUpward color="error" />
                </ListItemIcon>
                <ListItemText
                  primary="Resistance 2"
                  secondary="1.2180"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ArrowDownward color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Support 1"
                  secondary="1.2120"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ArrowDownward color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Support 2"
                  secondary="1.2100"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderMarketSentiment = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Sentiment Analysis</Typography>
            <Box className="sentiment-meter">
              {/* Add sentiment visualization */}
            </Box>
            <List>
              <ListItem>
                <ListItemText
                  primary="Retail Sentiment"
                  secondary="65% Bullish | 35% Bearish"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Institutional Sentiment"
                  secondary="45% Bullish | 55% Bearish"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Position Distribution</Typography>
            <Box className="position-chart">
              {/* Add position distribution chart */}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <div className="market-analysis">
      <Box className="header">
        <Typography variant="h5">Market Analysis</Typography>
        <Box className="header-actions">
          <FormControl size="small">
            <InputLabel>Market</InputLabel>
            <Select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              label="Market"
            >
              <MenuItem value="forex">Forex</MenuItem>
              <MenuItem value="crypto">Crypto</MenuItem>
              <MenuItem value="stocks">Stocks</MenuItem>
            </Select>
          </FormControl>
          <IconButton onClick={() => {}}>
            <Refresh />
          </IconButton>
          <IconButton onClick={() => {}}>
            <Notifications />
          </IconButton>
        </Box>
      </Box>

      <Tabs
        value={selectedTab}
        onChange={(e, v) => setSelectedTab(v)}
        className="tabs"
      >
        <Tab icon={<ShowChart />} label="Overview" />
        <Tab icon={<Assessment />} label="Technical Analysis" />
        <Tab icon={<Timeline />} label="Sentiment" />
      </Tabs>

      <Box className="content">
        {selectedTab === 0 && renderMarketOverview()}
        {selectedTab === 1 && renderTechnicalAnalysis()}
        {selectedTab === 2 && renderMarketSentiment()}
      </Box>
    </div>
  );
};

export default MarketAnalysis;
