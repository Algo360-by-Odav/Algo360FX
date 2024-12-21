import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Grid,
  Paper,
  Box,
  useTheme,
  Divider,
} from '@mui/material';
import { useStore } from '../../hooks/useStore';
import OrderEntry from './OrderEntry';
import MarketDepth from './MarketDepth';
import TradingChart from './TradingChart';
import PositionManager from './PositionManager';

const TradingView: React.FC = observer(() => {
  const { marketStore, tradeStore } = useStore();
  const theme = useTheme();
  const [selectedSymbol, setSelectedSymbol] = React.useState('EUR/USD');

  const handleSymbolChange = (symbol: string) => {
    setSelectedSymbol(symbol);
    marketStore.subscribeToPrice(symbol, (price) => {
      // Update local price state if needed
    });
  };

  React.useEffect(() => {
    // Initial subscription
    marketStore.subscribeToPrice(selectedSymbol, (price) => {
      // Update local price state if needed
    });

    return () => {
      // Cleanup subscription
      marketStore.unsubscribeFromPrice(selectedSymbol, () => {});
    };
  }, [selectedSymbol, marketStore]);

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'hidden' }}>
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* Left Panel - Chart */}
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          <Paper
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <TradingChart
              symbol={selectedSymbol}
              onSymbolChange={handleSymbolChange}
            />
          </Paper>
        </Grid>

        {/* Right Panel - Trading Controls */}
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {/* Order Entry */}
            <Paper sx={{ p: 2 }}>
              <OrderEntry
                symbol={selectedSymbol}
                currentPrice={marketStore.getPrice(selectedSymbol)}
              />
            </Paper>

            {/* Market Depth */}
            <Paper sx={{ p: 2, flexGrow: 0 }}>
              <MarketDepth
                symbol={selectedSymbol}
                orderBook={marketStore.getOrderBook(selectedSymbol)}
              />
            </Paper>

            {/* Position Manager */}
            <Paper sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
              <PositionManager
                positions={tradeStore.positions.filter(
                  (p) => p.symbol === selectedSymbol
                )}
              />
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});

export default TradingView;
