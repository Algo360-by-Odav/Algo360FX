import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Refresh,
  ArrowUpward,
  ArrowDownward,
  ShowChart,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
  percentage: number;
}

interface OrderBookProps {
  symbol?: string;
  precision?: number;
  levels?: number;
}

const OrderBookWidget: React.FC<OrderBookProps> = observer(({
  symbol = 'BTC/USD',
  precision = 5,
  levels = 15,
}) => {
  const theme = useTheme();
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [spread, setSpread] = useState<number>(0);
  const [spreadPercentage, setSpreadPercentage] = useState<number>(0);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());

  useEffect(() => {
    // Simulated order book data - replace with real WebSocket connection
    const generateOrderBook = () => {
      const basePrice = 1.1000;
      const newAsks: OrderBookEntry[] = [];
      const newBids: OrderBookEntry[] = [];
      let askTotal = 0;
      let bidTotal = 0;

      for (let i = 0; i < levels; i++) {
        const askPrice = basePrice + i * 0.0001;
        const bidPrice = basePrice - i * 0.0001;
        const askSize = Math.random() * 1000000;
        const bidSize = Math.random() * 1000000;

        askTotal += askSize;
        bidTotal += bidSize;

        newAsks.push({
          price: askPrice,
          size: askSize,
          total: askTotal,
          percentage: 0,
        });

        newBids.push({
          price: bidPrice,
          size: bidSize,
          total: bidTotal,
          percentage: 0,
        });
      }

      // Calculate percentages
      const maxTotal = Math.max(askTotal, bidTotal);
      newAsks.forEach((ask) => {
        ask.percentage = (ask.total / maxTotal) * 100;
      });
      newBids.forEach((bid) => {
        bid.percentage = (bid.total / maxTotal) * 100;
      });

      setAsks(newAsks);
      setBids(newBids);
      setSpread(newAsks[0].price - newBids[0].price);
      setSpreadPercentage((spread / newAsks[0].price) * 100);
      setLastUpdateTime(new Date());
    };

    generateOrderBook();
    const interval = setInterval(generateOrderBook, 1000);

    return () => clearInterval(interval);
  }, [symbol, levels, spread]);

  const formatNumber = (value: number, decimals: number = precision): string => {
    return value.toFixed(decimals);
  };

  const formatSize = (value: number): string => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
    return value.toString();
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ 
            background: 'linear-gradient(45deg, #fff, rgba(255,255,255,0.8))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
          }}>
            Order Book
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={`Spread: ${formatNumber(spread)} (${spreadPercentage.toFixed(3)}%)`}
              size="small"
              sx={{
                background: theme.palette.glass.background,
                borderRadius: '16px',
                '& .MuiChip-label': {
                  color: theme.palette.text.secondary,
                },
              }}
            />
            <Tooltip title="Refresh Order Book">
              <IconButton size="small" onClick={() => setLastUpdateTime(new Date())}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {symbol}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Last updated: {lastUpdateTime.toLocaleTimeString()}
          </Typography>
        </Box>
      </Box>

      <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {asks.slice().reverse().map((ask, index) => (
              <TableRow key={`ask-${index}`} sx={{ position: 'relative' }}>
                <TableCell align="right" sx={{ color: theme.palette.text.secondary }}>
                  {formatSize(ask.total)}
                </TableCell>
                <TableCell align="right" sx={{ color: theme.palette.text.secondary }}>
                  {formatSize(ask.size)}
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    color: theme.palette.trading.sell,
                    fontWeight: 500,
                    fontFamily: 'monospace',
                  }}
                >
                  {formatNumber(ask.price)}
                </TableCell>
                <Box
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: `${ask.percentage}%`,
                    background: `${theme.palette.trading.sell}20`,
                    zIndex: 0,
                  }}
                />
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} sx={{ 
                textAlign: 'center', 
                py: 1,
                background: theme.palette.glass.background,
              }}>
                <Typography variant="body2" sx={{ 
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                }}>
                  Spread: {formatNumber(spread)} ({spreadPercentage.toFixed(3)}%)
                </Typography>
              </TableCell>
            </TableRow>
            {bids.map((bid, index) => (
              <TableRow key={`bid-${index}`} sx={{ position: 'relative' }}>
                <TableCell align="right" sx={{ color: theme.palette.text.secondary }}>
                  {formatSize(bid.total)}
                </TableCell>
                <TableCell align="right" sx={{ color: theme.palette.text.secondary }}>
                  {formatSize(bid.size)}
                </TableCell>
                <TableCell 
                  align="right" 
                  sx={{ 
                    color: theme.palette.trading.buy,
                    fontWeight: 500,
                    fontFamily: 'monospace',
                  }}
                >
                  {formatNumber(bid.price)}
                </TableCell>
                <Box
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: `${bid.percentage}%`,
                    background: `${theme.palette.trading.buy}20`,
                    zIndex: 0,
                  }}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
});

export default OrderBookWidget;
