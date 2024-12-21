import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Paper,
} from '@mui/material';
import { OrderBook } from '../../types/trading';

interface MarketDepthProps {
  symbol: string;
  orderBook?: OrderBook;
}

const MarketDepth: React.FC<MarketDepthProps> = ({ symbol, orderBook }) => {
  const theme = useTheme();

  const maxVolume = React.useMemo(() => {
    if (!orderBook) return 0;
    return Math.max(
      ...orderBook.bids.map((bid) => bid.volume),
      ...orderBook.asks.map((ask) => ask.volume)
    );
  }, [orderBook]);

  const formatPrice = (price: number) => price.toFixed(5);
  const formatVolume = (volume: number) =>
    new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(volume);

  const VolumeBar: React.FC<{ volume: number; side: 'bid' | 'ask' }> = ({
    volume,
    side,
  }) => {
    const percentage = (volume / maxVolume) * 100;
    return (
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          [side === 'bid' ? 'left' : 'right']: 0,
          width: `${percentage}%`,
          backgroundColor:
            side === 'bid'
              ? `${theme.palette.success.main}20`
              : `${theme.palette.error.main}20`,
          zIndex: 0,
        }}
      />
    );
  };

  if (!orderBook) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          Loading order book...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Market Depth: {symbol}
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell align="right">Bid Size</TableCell>
              <TableCell align="right">Bid</TableCell>
              <TableCell align="right">Ask</TableCell>
              <TableCell align="right">Ask Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: Math.max(orderBook.bids.length, orderBook.asks.length) }).map(
              (_, index) => {
                const bid = orderBook.bids[index];
                const ask = orderBook.asks[index];

                return (
                  <TableRow key={index}>
                    <TableCell
                      align="right"
                      sx={{ position: 'relative', color: theme.palette.success.main }}
                    >
                      {bid && (
                        <>
                          <VolumeBar volume={bid.volume} side="bid" />
                          <Box sx={{ position: 'relative', zIndex: 1 }}>
                            {formatVolume(bid.volume)}
                          </Box>
                        </>
                      )}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: theme.palette.success.main }}
                    >
                      {bid && formatPrice(bid.price)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ color: theme.palette.error.main }}
                    >
                      {ask && formatPrice(ask.price)}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ position: 'relative', color: theme.palette.error.main }}
                    >
                      {ask && (
                        <>
                          <VolumeBar volume={ask.volume} side="ask" />
                          <Box sx={{ position: 'relative', zIndex: 1 }}>
                            {formatVolume(ask.volume)}
                          </Box>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              }
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MarketDepth;
