import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from '@mui/material';

interface TradeHistoryProps {
  trades: {
    id: string;
    symbol: string;
    type: 'buy' | 'sell';
    volume: number;
    openPrice: number;
    closePrice: number;
    profit: number;
    openTime: string;
    closeTime: string;
  }[];
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  if (!trades.length) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>No trade history available</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Volume</TableCell>
            <TableCell>Open Price</TableCell>
            <TableCell>Close Price</TableCell>
            <TableCell>Profit</TableCell>
            <TableCell>Open Time</TableCell>
            <TableCell>Close Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id}>
              <TableCell>{trade.symbol}</TableCell>
              <TableCell>{trade.type}</TableCell>
              <TableCell>{trade.volume}</TableCell>
              <TableCell>${trade.openPrice.toFixed(5)}</TableCell>
              <TableCell>${trade.closePrice.toFixed(5)}</TableCell>
              <TableCell
                sx={{
                  color: trade.profit >= 0 ? 'success.main' : 'error.main'
                }}
              >
                ${trade.profit.toFixed(2)}
              </TableCell>
              <TableCell>
                {new Date(trade.openTime).toLocaleString()}
              </TableCell>
              <TableCell>
                {new Date(trade.closeTime).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TradeHistory;
