import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useStore } from '@/context/StoreContext';

interface OrderBookEntry {
  price: number;
  volume: number;
}

const OrderBook: React.FC = () => {
  const { tradingStore } = useStore();
  const { orderBook } = tradingStore;

  const renderAsks = () => {
    return orderBook.asks.map((ask: OrderBookEntry) => (
      <TableRow key={ask.price}>
        <TableCell align="right" sx={{ color: 'error.main' }}>
          {ask.price.toFixed(5)}
        </TableCell>
        <TableCell align="right">{ask.volume.toFixed(2)}</TableCell>
      </TableRow>
    ));
  };

  const renderBids = () => {
    return orderBook.bids.map((bid: OrderBookEntry) => (
      <TableRow key={bid.price}>
        <TableCell align="right" sx={{ color: 'success.main' }}>
          {bid.price.toFixed(5)}
        </TableCell>
        <TableCell align="right">{bid.volume.toFixed(2)}</TableCell>
      </TableRow>
    ));
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Order Book
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Volume</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {renderAsks()}
            {renderBids()}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default OrderBook;
