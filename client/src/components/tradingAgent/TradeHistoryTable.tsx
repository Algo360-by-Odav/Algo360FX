import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  ArrowUpward as BuyIcon,
  ArrowDownward as SellIcon
} from '@mui/icons-material';

interface Trade {
  id: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  openTime: string;
  closeTime: string | null;
  openPrice: number;
  closePrice: number;
  profit: number;
  status: 'open' | 'closed';
  lots: number;
  sl: number;
  tp: number;
}

interface TradeHistoryTableProps {
  trades: Trade[];
}

const TradeHistoryTable: React.FC<TradeHistoryTableProps> = ({ trades }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format timestamp
  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return '--';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Format price with proper decimal places
  const formatPrice = (symbol: string, price: number) => {
    const decimals = symbol.includes('JPY') ? 3 : 5;
    return price.toFixed(decimals);
  };

  // Format profit
  const formatProfit = (profit: number) => {
    return profit >= 0 
      ? <Typography color="success.main">+${profit.toFixed(2)}</Typography>
      : <Typography color="error.main">-${Math.abs(profit).toFixed(2)}</Typography>;
  };

  return (
    <Box>
      <Box display="flex" justifyContent="flex-end" mb={1}>
        <Tooltip title="Refresh trades">
          <IconButton size="small">
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      
      <TableContainer component={Paper} elevation={0} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Open Time</TableCell>
              <TableCell>Open Price</TableCell>
              <TableCell>Close Price</TableCell>
              <TableCell>Lots</TableCell>
              <TableCell>SL/TP</TableCell>
              <TableCell>Profit</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trades
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((trade) => (
                <TableRow key={trade.id} hover>
                  <TableCell>{trade.id}</TableCell>
                  <TableCell>{trade.symbol}</TableCell>
                  <TableCell>
                    {trade.type === 'BUY' ? (
                      <Chip 
                        icon={<BuyIcon fontSize="small" />} 
                        label="BUY" 
                        size="small" 
                        color="success" 
                        variant="outlined"
                      />
                    ) : (
                      <Chip 
                        icon={<SellIcon fontSize="small" />} 
                        label="SELL" 
                        size="small" 
                        color="error" 
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                  <TableCell>{formatTime(trade.openTime)}</TableCell>
                  <TableCell>{formatPrice(trade.symbol, trade.openPrice)}</TableCell>
                  <TableCell>{formatPrice(trade.symbol, trade.closePrice)}</TableCell>
                  <TableCell>{trade.lots.toFixed(2)}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="caption" color="error" component="div">
                        SL: {formatPrice(trade.symbol, trade.sl)}
                      </Typography>
                      <Typography variant="caption" color="success" component="div">
                        TP: {formatPrice(trade.symbol, trade.tp)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{formatProfit(trade.profit)}</TableCell>
                  <TableCell>
                    {trade.status === 'open' ? (
                      <Chip label="OPEN" size="small" color="primary" />
                    ) : (
                      <Chip label="CLOSED" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            {trades.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography variant="body2" color="text.secondary" py={2}>
                    No trades recorded yet
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={trades.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default TradeHistoryTable;
