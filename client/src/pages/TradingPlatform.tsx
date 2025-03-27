import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Toolbar,
  AppBar,
  Button,
  Menu,
  MenuItem,
  Stack,
  Container,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  ViewComfy as ViewComfyIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreProvider';
import CustomTradingChart from '../components/trading/CustomTradingChart';
import MarketWatch from '../components/trading/MarketWatch';
import OrderBook from '../components/trading/OrderBook';
import TradeHistory from '../components/trading/TradeHistory';
import OneClickTrading from '../components/trading/OneClickTrading';
import { priceService, PriceUpdate } from '../services/priceService';
import TopBar from '../components/layout/TopBar';

const TradingPlatform: React.FC = observer(() => {
  const { tradingStore } = useStores();
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const currentPrice = tradingStore.prices[selectedSymbol] || { ask: 0, bid: 0 };

  useEffect(() => {
    const handlePriceUpdate = (update: PriceUpdate) => {
      tradingStore.updatePrice(selectedSymbol, update);
    };

    const unsubscribe = priceService.subscribe(selectedSymbol, handlePriceUpdate);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [selectedSymbol, tradingStore]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container maxWidth={false}>
      <Grid container spacing={2}>
        <TopBar />
        
        <Grid item xs={12}>
          <Box sx={{ 
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '250px 1fr 300px',
            gap: 1,
            p: 1,
            overflow: 'hidden',
          }}>
            {/* Market Watch */}
            <Paper sx={{ 
              bgcolor: '#1e222d',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <MarketWatch onSymbolSelect={setSelectedSymbol} />
            </Paper>

            {/* Chart Area */}
            <Paper sx={{ 
              bgcolor: '#1e222d',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              {/* Chart Header */}
              <Box sx={{ 
                p: 1, 
                borderBottom: 1, 
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'center',
              }}>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                  {selectedSymbol}
                </Typography>
                <Box sx={{ flex: 1 }} />
                <IconButton size="small" onClick={handleMenuClick}>
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>Indicators</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Chart Settings</MenuItem>
                  <MenuItem onClick={handleMenuClose}>Full Screen</MenuItem>
                </Menu>
              </Box>

              {/* Chart */}
              <Box sx={{ flex: 1, minHeight: 0 }}>
                <CustomTradingChart symbol={selectedSymbol} />
              </Box>
            </Paper>

            {/* Trading Panel */}
            <Paper sx={{ 
              bgcolor: '#1e222d',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}>
              {/* One-Click Trading Panel */}
              <OneClickTrading
                symbol={selectedSymbol}
                ask={currentPrice.ask}
                bid={currentPrice.bid}
              />

              {/* Order Book */}
              <Box sx={{ flex: 1, overflow: 'auto', borderBottom: 1, borderColor: 'divider' }}>
                <OrderBook symbol={selectedSymbol} />
              </Box>

              {/* Trade History */}
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <TradeHistory 
                  symbol={selectedSymbol}
                  trades={tradingStore.tradeHistory.filter(t => t.symbol === selectedSymbol)}
                  limit={50}
                  advanced={false}
                />
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
});

export default TradingPlatform;
