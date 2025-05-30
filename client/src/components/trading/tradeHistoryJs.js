// tradeHistoryJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

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

const TradeHistory = ({
  symbol,
  trades = [],
  onRefresh,
  advanced = false,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState('time');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortTrades = (a, b) => {
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

  // Render sort label helper
  const renderSortLabel = (field, label) => {
    return React.createElement(TableSortLabel, {
      active: sortField === field,
      direction: sortField === field ? sortOrder : 'asc',
      onClick: () => handleSort(field)
    }, label);
  };

  // If no trades, show empty state
  if (!trades.length) {
    return React.createElement(Box, { sx: { p: 2, textAlign: 'center' } }, [
      React.createElement(Typography, { 
        variant: "body1", 
        color: "text.secondary",
        key: "no-trades-text"
      }, "No trade history available"),
      
      onRefresh && React.createElement(IconButton, { 
        onClick: onRefresh, 
        sx: { mt: 1 },
        key: "refresh-button"
      }, React.createElement(RefreshIcon))
    ].filter(Boolean)); // Filter to remove null/undefined elements
  }

  // Create the header section
  const createHeader = () => {
    return React.createElement(Box, { 
      sx: { p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
    }, [
      React.createElement(Typography, { 
        variant: "h6",
        key: "title"
      }, "Trade History"),
      
      React.createElement(Box, { key: "actions" }, [
        advanced && React.createElement(Tooltip, { 
          title: "Filter",
          key: "filter-tooltip"
        }, 
          React.createElement(IconButton, { size: "small" },
            React.createElement(FilterListIcon)
          )
        ),
        
        onRefresh && React.createElement(Tooltip, { 
          title: "Refresh",
          key: "refresh-tooltip"
        }, 
          React.createElement(IconButton, { 
            size: "small", 
            onClick: onRefresh 
          },
            React.createElement(RefreshIcon)
          )
        )
      ].filter(Boolean)) // Filter to remove null/undefined elements
    ]);
  };

  // Create the table headers
  const createTableHeaders = () => {
    return React.createElement(TableHead, null,
      React.createElement(TableRow, null, [
        React.createElement(TableCell, { key: "time-header" }, 
          renderSortLabel('time', 'Time')
        ),
        React.createElement(TableCell, { key: "side-header" }, "Side"),
        React.createElement(TableCell, { key: "price-header" }, 
          renderSortLabel('price', 'Price')
        ),
        React.createElement(TableCell, { key: "size-header" }, 
          renderSortLabel('size', 'Size')
        ),
        advanced && React.createElement(TableCell, { key: "value-header" }, "Value"),
        advanced && React.createElement(TableCell, { key: "maker-header" }, "Maker")
      ].filter(Boolean)) // Filter to remove null/undefined elements
    );
  };

  // Create the table rows for trades
  const createTradeRows = () => {
    return paginatedTrades.map((trade) => 
      React.createElement(TableRow, {
        key: trade.id,
        sx: {
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }
      }, [
        // Time cell
        React.createElement(TableCell, { key: "time" },
          new Date(trade.time).toLocaleTimeString()
        ),
        
        // Side cell (buy/sell)
        React.createElement(TableCell, { key: "side" },
          React.createElement(Chip, {
            label: trade.side,
            size: "small",
            color: trade.side === 'buy' ? 'success' : 'error',
            sx: { width: 60 }
          })
        ),
        
        // Price cell
        React.createElement(TableCell, { key: "price" },
          trade.price.toFixed(5)
        ),
        
        // Size cell
        React.createElement(TableCell, { key: "size" },
          trade.size.toFixed(2)
        ),
        
        // Advanced fields (optional)
        advanced && React.createElement(TableCell, { key: "value" },
          (trade.price * trade.size).toFixed(2)
        ),
        
        advanced && React.createElement(TableCell, { key: "maker" },
          React.createElement(Chip, {
            label: trade.maker ? 'Y' : 'N',
            size: "small",
            variant: "outlined",
            sx: { width: 40 }
          })
        )
      ].filter(Boolean)) // Filter to remove null/undefined elements
    );
  };

  // Main render
  return React.createElement(Paper, { sx: { width: '100%', overflow: 'hidden' } }, [
    // Header
    createHeader(),
    
    // Table container
    React.createElement(TableContainer, { sx: { maxHeight: 440 } },
      React.createElement(Table, { stickyHeader: true, size: "small" }, [
        createTableHeaders(),
        React.createElement(TableBody, null, createTradeRows())
      ])
    ),
    
    // Pagination
    React.createElement(TablePagination, {
      rowsPerPageOptions: [10, 25, 50],
      component: "div",
      count: trades.length,
      rowsPerPage: rowsPerPage,
      page: page,
      onPageChange: handleChangePage,
      onRowsPerPageChange: handleChangeRowsPerPage
    })
  ]);
};

export default TradeHistory;
