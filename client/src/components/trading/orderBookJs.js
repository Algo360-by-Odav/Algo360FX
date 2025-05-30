// orderBookJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

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

const OrderBook = observer(({ symbol }) => {
  const { tradingStore } = useStores();
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    // Simulated order book data - replace with real data
    const generateOrderBook = () => {
      // Create mock price data if tradingStore.prices is undefined
      const mockPrices = {
        'EURUSD': { bid: 1.1050, ask: 1.1052 },
        'GBPUSD': { bid: 1.2750, ask: 1.2753 },
        'USDJPY': { bid: 107.50, ask: 107.53 },
        'AUDUSD': { bid: 0.7150, ask: 0.7153 },
        'USDCAD': { bid: 1.3450, ask: 1.3453 },
        'NZDUSD': { bid: 0.6550, ask: 0.6553 },
        'USDCHF': { bid: 0.9850, ask: 0.9853 }
      };
      
      // Use mock prices if tradingStore.prices is undefined
      const prices = tradingStore.prices || mockPrices;
      const currentSymbol = symbol || 'EURUSD'; // Default to EURUSD if symbol is undefined
      
      const midPrice = prices[currentSymbol]?.bid || 1.0000;
      const spread = midPrice * 0.0002; // 0.02% spread

      const generateEntries = (basePrice, isBid) => {
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

  // Create the header section
  const createHeaderSection = () => {
    return React.createElement(Box, { sx: { px: 2, py: 1 } },
      React.createElement(Typography, { 
        variant: "subtitle2", 
        sx: { fontWeight: 600 } 
      }, "Order Book")
    );
  };

  // Create the table headers
  const createTableHeaders = () => {
    return React.createElement(TableHead, null,
      React.createElement(TableRow, null,
        React.createElement(TableCell, { align: "right" }, "Price"),
        React.createElement(TableCell, { align: "right" }, "Size"),
        React.createElement(TableCell, { align: "right" }, "Total")
      )
    );
  };

  // Create ask rows (sell orders)
  const createAskRows = () => {
    return asks.map((ask, index) => 
      React.createElement(TableRow, {
        key: `ask-${index}`,
        sx: { position: 'relative' }
      },
        // Price cell
        React.createElement(TableCell, {
          align: "right",
          sx: { 
            color: 'error.main',
            fontFamily: 'monospace',
            position: 'relative',
            zIndex: 1,
          }
        }, ask.price.toFixed(5)),
        
        // Size cell
        React.createElement(TableCell, {
          align: "right",
          sx: {
            fontFamily: 'monospace',
            position: 'relative',
            zIndex: 1,
          }
        }, Math.floor(ask.size).toLocaleString()),
        
        // Total cell with background
        React.createElement(TableCell, {
          align: "right",
          sx: {
            fontFamily: 'monospace',
            position: 'relative',
            zIndex: 1,
          }
        }, [
          Math.floor(ask.total).toLocaleString(),
          React.createElement(Box, {
            key: "background",
            sx: {
              position: 'absolute',
              right: 0,
              top: 0,
              height: '100%',
              width: `${ask.percentage}%`,
              bgcolor: 'error.main',
              opacity: 0.1,
              zIndex: 0,
            }
          })
        ])
      )
    );
  };

  // Create spread row
  const createSpreadRow = () => {
    return React.createElement(TableRow, null,
      React.createElement(TableCell, {
        colSpan: 3,
        align: "center",
        sx: { 
          py: 0.5,
          color: 'text.secondary',
          borderBottom: 'none',
          fontSize: '0.75rem',
        }
      }, `Spread: ${((asks[0]?.price || 0) - (bids[0]?.price || 0)).toFixed(5)}`)
    );
  };

  // Create bid rows (buy orders)
  const createBidRows = () => {
    return bids.map((bid, index) => 
      React.createElement(TableRow, {
        key: `bid-${index}`,
        sx: { position: 'relative' }
      },
        // Price cell
        React.createElement(TableCell, {
          align: "right",
          sx: { 
            color: 'success.main',
            fontFamily: 'monospace',
            position: 'relative',
            zIndex: 1,
          }
        }, bid.price.toFixed(5)),
        
        // Size cell
        React.createElement(TableCell, {
          align: "right",
          sx: {
            fontFamily: 'monospace',
            position: 'relative',
            zIndex: 1,
          }
        }, Math.floor(bid.size).toLocaleString()),
        
        // Total cell with background
        React.createElement(TableCell, {
          align: "right",
          sx: {
            fontFamily: 'monospace',
            position: 'relative',
            zIndex: 1,
          }
        }, [
          Math.floor(bid.total).toLocaleString(),
          React.createElement(Box, {
            key: "background",
            sx: {
              position: 'absolute',
              right: 0,
              top: 0,
              height: '100%',
              width: `${bid.percentage}%`,
              bgcolor: 'success.main',
              opacity: 0.1,
              zIndex: 0,
            }
          })
        ])
      )
    );
  };

  // Main render
  return React.createElement(Box, { 
    sx: { 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column' 
    }
  }, [
    // Header
    createHeaderSection(),
    
    // Table container
    React.createElement(TableContainer, { 
      sx: { flex: 1, overflow: 'auto' } 
    },
      React.createElement(Table, { 
        size: "small", 
        stickyHeader: true 
      }, [
        // Table headers
        createTableHeaders(),
        
        // Table body
        React.createElement(TableBody, null, [
          // Asks (sell orders)
          ...createAskRows(),
          
          // Spread
          createSpreadRow(),
          
          // Bids (buy orders)
          ...createBidRows()
        ])
      ])
    )
  ]);
});

export default OrderBook;
