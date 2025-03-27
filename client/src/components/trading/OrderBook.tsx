import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  LinearProgress,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
  percentage: number;
}

interface OrderBookProps {
  symbol: string;
}

const OrderBook: React.FC<OrderBookProps> = observer(({ symbol }) => {
  const { tradingStore } = useStores();
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [bids, setBids] = useState<OrderBookEntry[]>([]);

  useEffect(() => {
    // Simulated order book data - replace with real data
    const generateOrderBook = () => {
      const midPrice = tradingStore.prices[symbol]?.bid || 1.0000;
      const spread = midPrice * 0.0002; // 0.02% spread

      const generateEntries = (basePrice: number, isBid: boolean): OrderBookEntry[] => {
        return Array.from({ length: 8 }, (_, i) => {
          const offset = isBid ? -i * spread : i * spread;
          const price = basePrice + offset;
          const size = Math.random() * 1000000;
          return {
            price,
            size,
            total: 0, // Will be calculated
            percentage: 0, // Will be calculated
          };
        });
      };

      const newAsks = generateEntries(midPrice + spread/2, false);
      const newBids = generateEntries(midPrice - spread/2, true);

      // Calculate totals and percentages
      let maxTotal = 0;
      
      // Calculate totals
      newAsks.forEach((ask, i) => {
        ask.total = i === 0 ? ask.size : newAsks[i-1].total + ask.size;
        maxTotal = Math.max(maxTotal, ask.total);
      });
      
      newBids.forEach((bid, i) => {
        bid.total = i === 0 ? bid.size : newBids[i-1].total + bid.size;
        maxTotal = Math.max(maxTotal, bid.total);
      });

      // Calculate percentages
      newAsks.forEach(ask => {
        ask.percentage = (ask.total / maxTotal) * 100;
      });
      
      newBids.forEach(bid => {
        bid.percentage = (bid.total / maxTotal) * 100;
      });

      setAsks(newAsks);
      setBids(newBids.reverse()); // Reverse bids to show highest bid first
    };

    generateOrderBook();
    const interval = setInterval(generateOrderBook, 1000);

    return () => clearInterval(interval);
  }, [symbol, tradingStore.prices]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Order Book
        </Typography>
      </Box>
      
      <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Asks (Sell Orders) */}
            {asks.map((ask, index) => (
              <TableRow
                key={`ask-${index}`}
                sx={{ position: 'relative' }}
              >
                <TableCell 
                  align="right" 
                  sx={{ 
                    color: 'error.main',
                    fontFamily: 'monospace',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {ask.price.toFixed(5)}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{
                    fontFamily: 'monospace',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {Math.floor(ask.size).toLocaleString()}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{
                    fontFamily: 'monospace',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {Math.floor(ask.total).toLocaleString()}
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      height: '100%',
                      width: `${ask.percentage}%`,
                      bgcolor: 'error.main',
                      opacity: 0.1,
                      zIndex: 0,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}

            {/* Spread */}
            <TableRow>
              <TableCell 
                colSpan={3} 
                align="center"
                sx={{ 
                  py: 0.5,
                  color: 'text.secondary',
                  borderBottom: 'none',
                  fontSize: '0.75rem',
                }}
              >
                Spread: {((asks[0]?.price || 0) - (bids[0]?.price || 0)).toFixed(5)}
              </TableCell>
            </TableRow>

            {/* Bids (Buy Orders) */}
            {bids.map((bid, index) => (
              <TableRow
                key={`bid-${index}`}
                sx={{ position: 'relative' }}
              >
                <TableCell 
                  align="right"
                  sx={{ 
                    color: 'success.main',
                    fontFamily: 'monospace',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {bid.price.toFixed(5)}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{
                    fontFamily: 'monospace',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {Math.floor(bid.size).toLocaleString()}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{
                    fontFamily: 'monospace',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {Math.floor(bid.total).toLocaleString()}
                  <Box
                    sx={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      height: '100%',
                      width: `${bid.percentage}%`,
                      bgcolor: 'success.main',
                      opacity: 0.1,
                      zIndex: 0,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});

export default OrderBook;
