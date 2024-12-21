import React, { useState } from 'react';
import {
  Grid,
  Box,
  Card,
  Tabs,
  Tab,
  Typography,
  TextField,
  IconButton,
  Chip,
} from '@mui/material';
import { Search, Star, StarBorder } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import ChartWidget from '../components/Chart/ChartWidget';
import OrderBookWidget from '../components/OrderBook/OrderBookWidget';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`market-tabpanel-${index}`}
      aria-labelledby={`market-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const MarketData: React.FC = observer(() => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['EUR/USD', 'GBP/USD']);

  const marketPairs = [
    { pair: 'EUR/USD', price: '1.0950', change: '+0.15%' },
    { pair: 'GBP/USD', price: '1.2500', change: '-0.10%' },
    { pair: 'USD/JPY', price: '110.50', change: '+0.25%' },
    { pair: 'AUD/USD', price: '0.7450', change: '-0.20%' },
    { pair: 'USD/CAD', price: '1.2750', change: '+0.05%' },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const toggleFavorite = (pair: string) => {
    if (favorites.includes(pair)) {
      setFavorites(favorites.filter(f => f !== pair));
    } else {
      setFavorites([...favorites, pair]);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {/* Market Overview */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="All Markets" />
                <Tab label="Favorites" />
              </Tabs>
            </Box>
            <Box sx={{ p: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search markets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ mb: 2 }}
              />
              {marketPairs.map((market) => (
                <Box
                  key={market.pair}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => toggleFavorite(market.pair)}
                    >
                      {favorites.includes(market.pair) ? (
                        <Star sx={{ color: 'warning.main' }} />
                      ) : (
                        <StarBorder />
                      )}
                    </IconButton>
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {market.pair}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1">{market.price}</Typography>
                    <Chip
                      label={market.change}
                      size="small"
                      color={market.change.startsWith('+') ? 'success' : 'error'}
                      sx={{ minWidth: 80 }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Card>
        </Grid>

        {/* Chart and Order Book */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ChartWidget />
            </Grid>
            <Grid item xs={12}>
              <OrderBookWidget />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
});

export default MarketData;
