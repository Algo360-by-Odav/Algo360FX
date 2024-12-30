import React from 'react';
import { observer } from 'mobx-react-lite';
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
  Typography,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useStore } from '../../hooks/useStore';
import { Trade } from '../../types/trading';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import TradeDetailsDialog from './TradeDetailsDialog';

interface FilterState {
  symbol: string;
  side: string;
  status: string;
  dateRange: string;
}

const TradeHistory: React.FC = observer(() => {
  const theme = useTheme();
  const { analyticsStore } = useStore();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTrade, setSelectedTrade] = React.useState<Trade | null>(null);
  const [filters, setFilters] = React.useState<FilterState>({
    symbol: '',
    side: '',
    status: '',
    dateRange: '1M',
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (
    field: keyof FilterState,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setPage(0);
  };

  const handleTradeClick = (trade: Trade) => {
    setSelectedTrade(trade);
  };

  const filteredTrades = React.useMemo(() => {
    return analyticsStore.trades.filter((trade) => {
      // Search query
      if (
        searchQuery &&
        !trade.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Filters
      if (filters.symbol && trade.symbol !== filters.symbol) return false;
      if (filters.side && trade.side !== filters.side) return false;
      if (filters.status && trade.status !== filters.status) return false;

      // Date range
      const tradeDate = new Date(trade.exitTime || trade.entryTime);
      const now = new Date();
      switch (filters.dateRange) {
        case '1D':
          return tradeDate >= new Date(now.setDate(now.getDate() - 1));
        case '1W':
          return tradeDate >= new Date(now.setDate(now.getDate() - 7));
        case '1M':
          return tradeDate >= new Date(now.setMonth(now.getMonth() - 1));
        case '3M':
          return tradeDate >= new Date(now.setMonth(now.getMonth() - 3));
        case 'ALL':
          return true;
        default:
          return true;
      }
    });
  }, [analyticsStore.trades, searchQuery, filters]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Trade History
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search trades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Symbol</InputLabel>
            <Select
              value={filters.symbol}
              label="Symbol"
              onChange={(e) => handleFilterChange('symbol', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="EUR/USD">EUR/USD</MenuItem>
              <MenuItem value="GBP/USD">GBP/USD</MenuItem>
              <MenuItem value="USD/JPY">USD/JPY</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Side</InputLabel>
            <Select
              value={filters.side}
              label="Side"
              onChange={(e) => handleFilterChange('side', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="buy">Buy</MenuItem>
              <MenuItem value="sell">Sell</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={filters.dateRange}
              label="Date Range"
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
            >
              <MenuItem value="1D">Last 24 Hours</MenuItem>
              <MenuItem value="1W">Last Week</MenuItem>
              <MenuItem value="1M">Last Month</MenuItem>
              <MenuItem value="3M">Last 3 Months</MenuItem>
              <MenuItem value="ALL">All Time</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Trades Table */}
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date/Time</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Side</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Entry Price</TableCell>
              <TableCell align="right">Exit Price</TableCell>
              <TableCell align="right">P&L</TableCell>
              <TableCell align="right">ROI</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTrades
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((trade) => (
                <TableRow
                  key={trade.id}
                  hover
                  onClick={() => handleTradeClick(trade)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{formatDateTime(trade.entryTime)}</TableCell>
                  <TableCell>{trade.symbol}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color:
                          trade.side === 'buy'
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                      }}
                    >
                      {trade.side === 'buy' ? (
                        <TrendingUpIcon fontSize="small" />
                      ) : (
                        <TrendingDownIcon fontSize="small" />
                      )}
                      <Typography sx={{ ml: 1 }}>
                        {trade.side.toUpperCase()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">{trade.size}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(trade.entryPrice)}
                  </TableCell>
                  <TableCell align="right">
                    {trade.exitPrice
                      ? formatCurrency(trade.exitPrice)
                      : '-'}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color:
                        trade.pnl >= 0
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                    }}
                  >
                    {formatCurrency(trade.pnl)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color:
                        trade.roi >= 0
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                    }}
                  >
                    {(trade.roi * 100).toFixed(2)}%
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={trade.status}
                      size="small"
                      color={trade.status === 'open' ? 'primary' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredTrades.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Trade Details Dialog */}
      {selectedTrade && (
        <TradeDetailsDialog
          trade={selectedTrade}
          open={Boolean(selectedTrade)}
          onClose={() => setSelectedTrade(null)}
        />
      )}
    </Box>
  );
});

export default TradeHistory;
