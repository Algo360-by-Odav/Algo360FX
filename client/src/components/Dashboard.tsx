import React from 'react';
import { Box, Grid, Paper, Typography, CircularProgress, Chip, List, ListItem, ListItemText, Divider } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import TradingWidget from './trading/TradingWidget';
import { useWebSocket } from '../hooks/useWebSocket';

const MarketCard = ({ symbol, price, change, volume, high, low }: { 
  symbol: string; 
  price: string; 
  change: string; 
  volume: string;
  high: string;
  low: string;
}) => {
  const isPositive = parseFloat(change) >= 0;
  
  return (
    <Paper 
      sx={{ 
        p: 2, 
        bgcolor: '#1a1a1a',
        borderRadius: 1,
        border: '1px solid rgba(255,255,255,0.1)',
        height: '100%'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{symbol}</Typography>
        {isPositive ? (
          <TrendingUpIcon sx={{ color: '#26a69a' }} />
        ) : (
          <TrendingDownIcon sx={{ color: '#ef5350' }} />
        )}
      </Box>
      <Typography variant="h5" sx={{ mb: 1 }}>{price}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: isPositive ? '#26a69a' : '#ef5350',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {change}%
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Vol: {volume}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>H: {high}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>L: {low}</Typography>
      </Box>
    </Paper>
  );
};

const PortfolioSummary = () => (
  <Paper sx={{ p: 2, bgcolor: '#1a1a1a', borderRadius: 1, height: '100%' }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Portfolio Overview</Typography>
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="subtitle2" color="text.secondary">Balance</Typography>
        <Typography variant="h6">$10,234.56</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" color="text.secondary">P/L (24h)</Typography>
        <Typography variant="h6" color="#26a69a">+$234.56</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" color="text.secondary">Open Positions</Typography>
        <Typography variant="h6">3</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="subtitle2" color="text.secondary">Margin Used</Typography>
        <Typography variant="h6">25%</Typography>
      </Grid>
    </Grid>
  </Paper>
);

const MarketNews = () => (
  <Paper sx={{ p: 2, bgcolor: '#1a1a1a', borderRadius: 1, height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <NewspaperIcon sx={{ mr: 1 }} />
      <Typography variant="h6">Market News</Typography>
    </Box>
    <List>
      <ListItem>
        <ListItemText 
          primary="Fed Signals Potential Rate Cut" 
          secondary="2 hours ago"
          primaryTypographyProps={{ variant: 'subtitle2' }}
          secondaryTypographyProps={{ variant: 'caption' }}
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="ECB Monthly Report Released" 
          secondary="4 hours ago"
          primaryTypographyProps={{ variant: 'subtitle2' }}
          secondaryTypographyProps={{ variant: 'caption' }}
        />
      </ListItem>
      <ListItem>
        <ListItemText 
          primary="Bank of Japan Policy Update" 
          secondary="6 hours ago"
          primaryTypographyProps={{ variant: 'subtitle2' }}
          secondaryTypographyProps={{ variant: 'caption' }}
        />
      </ListItem>
    </List>
  </Paper>
);

const MarketSentiment = () => (
  <Paper sx={{ p: 2, bgcolor: '#1a1a1a', borderRadius: 1, height: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <AccountBalanceIcon sx={{ mr: 1 }} />
      <Typography variant="h6">Market Sentiment</Typography>
    </Box>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>EUR/USD</Typography>
          <Chip 
            label="Bullish" 
            size="small" 
            sx={{ bgcolor: '#26a69a', color: 'white' }} 
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>GBP/USD</Typography>
          <Chip 
            label="Bearish" 
            size="small" 
            sx={{ bgcolor: '#ef5350', color: 'white' }} 
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ mr: 1 }}>USD/JPY</Typography>
          <Chip 
            label="Neutral" 
            size="small" 
            sx={{ bgcolor: '#9e9e9e', color: 'white' }} 
          />
        </Box>
      </Grid>
    </Grid>
  </Paper>
);

const Dashboard: React.FC = () => {
  const { lastMessage, subscribeToSymbol, isConnected } = useWebSocket();
  const [marketData, setMarketData] = React.useState({
    'EUR/USD': { price: '1.0921', change: '+0.15', volume: '127.5K', high: '1.0935', low: '1.0898' },
    'GBP/USD': { price: '1.2734', change: '-0.08', volume: '98.2K', high: '1.2756', low: '1.2712' },
    'USD/JPY': { price: '148.1200', change: '+0.22', volume: '156.3K', high: '148.35', low: '147.85' },
    'USD/CHF': { price: '0.8654', change: '-0.12', volume: '76.8K', high: '0.8672', low: '0.8642' }
  });

  React.useEffect(() => {
    if (isConnected) {
      Object.keys(marketData).forEach(symbol => {
        subscribeToSymbol(symbol);
      });
    }
  }, [isConnected, subscribeToSymbol]);

  React.useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        if (data.type === 'marketData' && data.symbol) {
          setMarketData(prevData => ({
            ...prevData,
            [data.symbol]: {
              price: data.price.toFixed(4),
              change: data.change.toFixed(2),
              volume: `${(data.volume / 1000).toFixed(1)}K`,
              high: data.high.toFixed(4),
              low: data.low.toFixed(4)
            }
          }));
        }
      } catch (e) {
        console.error('Failed to parse websocket message:', e);
      }
    }
  }, [lastMessage]);

  return (
    <Box sx={{ p: 3, bgcolor: '#121212', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: 'text.primary' }}>Trading Dashboard</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isConnected ? (
            <Chip 
              label="Connected" 
              size="small" 
              sx={{ bgcolor: '#26a69a', color: 'white', mr: 2 }} 
            />
          ) : (
            <Chip 
              label="Disconnected" 
              size="small" 
              sx={{ bgcolor: '#ef5350', color: 'white', mr: 2 }} 
            />
          )}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Last update: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {Object.entries(marketData).map(([symbol, data]) => (
              <Grid item xs={12} sm={6} key={symbol}>
                <MarketCard
                  symbol={symbol}
                  price={data.price}
                  change={data.change}
                  volume={data.volume}
                  high={data.high}
                  low={data.low}
                />
              </Grid>
            ))}
          </Grid>
          <Paper sx={{ p: 2, bgcolor: '#1a1a1a', borderRadius: 1 }}>
            <TradingWidget symbol="EUR/USD" />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <PortfolioSummary />
            </Grid>
            <Grid item xs={12}>
              <MarketSentiment />
            </Grid>
            <Grid item xs={12}>
              <MarketNews />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
