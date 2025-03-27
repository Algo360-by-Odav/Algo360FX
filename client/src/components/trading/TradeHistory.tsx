import React, { useState } from 'react';
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
  IconButton,
  Tooltip,
  TablePagination,
  TableSortLabel,
  Chip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { TradeHistoryProps } from './types';

type SortField = 'time' | 'price' | 'size';
type SortOrder = 'asc' | 'desc';

const TradeHistory: React.FC<TradeHistoryProps> = ({
  symbol,
  trades,
  onRefresh,
  advanced = false,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortTrades = (a: typeof trades[0], b: typeof trades[0]) => {
    const factor = sortOrder === 'asc' ? 1 : -1;
    switch (sortField) {
      case 'time':
        return (new Date(a.time).getTime() - new Date(b.time).getTime()) * factor;
      case 'price':
        return (a.price - b.price) * factor;
      case 'size':
        return (a.size - b.size) * factor;
      default:
        return 0;
    }
  };

  const sortedTrades = [...trades].sort(sortTrades);
  const paginatedTrades = sortedTrades.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (!trades.length) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No trade history available
        </Typography>
        {onRefresh && (
          <IconButton onClick={onRefresh} sx={{ mt: 1 }}>
            <RefreshIcon />
          </IconButton>
        )}
      </Box>
    );
  }

  const renderSortLabel = (field: SortField, label: string) => (
    <TableSortLabel
      active={sortField === field}
      direction={sortField === field ? sortOrder : 'asc'}
      onClick={() => handleSort(field)}
    >
      {label}
    </TableSortLabel>
  );

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Trade History</Typography>
        <Box>
          {advanced && (
            <Tooltip title="Filter">
              <IconButton size="small">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
          {onRefresh && (
            <Tooltip title="Refresh">
              <IconButton size="small" onClick={onRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>{renderSortLabel('time', 'Time')}</TableCell>
              <TableCell>Side</TableCell>
              <TableCell>{renderSortLabel('price', 'Price')}</TableCell>
              <TableCell>{renderSortLabel('size', 'Size')}</TableCell>
              {advanced && (
                <>
                  <TableCell>Value</TableCell>
                  <TableCell>Maker</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTrades.map((trade) => (
              <TableRow
                key={trade.id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <TableCell>
                  {new Date(trade.time).toLocaleTimeString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={trade.side}
                    size="small"
                    color={trade.side === 'buy' ? 'success' : 'error'}
                    sx={{ width: 60 }}
                  />
                </TableCell>
                <TableCell>{trade.price.toFixed(5)}</TableCell>
                <TableCell>{trade.size.toFixed(2)}</TableCell>
                {advanced && (
                  <>
                    <TableCell>
                      {(trade.price * trade.size).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={trade.maker ? 'Y' : 'N'}
                        size="small"
                        variant="outlined"
                        sx={{ width: 40 }}
                      />
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={trades.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TradeHistory;
