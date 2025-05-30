// forexPairsJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  useTheme,
} from '@mui/material';

// Sample forex pair data
const forexPairs = [
  {
    symbol: 'AUDUSD',
    flags: ['au', 'us'],
    ask: 0.63003,
    bid: 0.63000,
    spread: 3,
  },
  {
    symbol: 'EURUSD',
    flags: ['eu', 'us'],
    ask: 1.05134,
    bid: 1.05134,
    spread: 0,
  },
  {
    symbol: 'GBPUSD',
    flags: ['gb', 'us'],
    ask: 1.24976,
    bid: 1.24972,
    spread: 4,
  },
  {
    symbol: 'NZDUSD',
    flags: ['nz', 'us'],
    ask: 0.56993,
    bid: 0.56991,
    spread: 2,
  },
  {
    symbol: 'USDCAD',
    flags: ['us', 'ca'],
    ask: 1.43665,
    bid: 1.43662,
    spread: 3,
  },
];

const ForexPairs = () => {
  const theme = useTheme();

  // Create a forex pair card
  const createForexPairCard = (pair) => {
    return React.createElement(Card, {
      key: pair.symbol,
      sx: {
        minWidth: 200,
        bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'white',
        '&:hover': {
          boxShadow: 6,
        },
      }
    },
      React.createElement(CardContent, null,
        React.createElement(Stack, { spacing: 1 },
          // Header with flags and symbol
          React.createElement(Box, { sx: { display: 'flex', alignItems: 'center', gap: 1 } },
            // First flag
            React.createElement(Box, {
              component: "img",
              src: `https://flagcdn.com/w40/${pair.flags[0]}.png`,
              alt: pair.flags[0],
              sx: { width: 20, height: 20, borderRadius: '50%' }
            }),
            // Second flag
            React.createElement(Box, {
              component: "img",
              src: `https://flagcdn.com/w40/${pair.flags[1]}.png`,
              alt: pair.flags[1],
              sx: { width: 20, height: 20, borderRadius: '50%' }
            }),
            // Symbol text
            React.createElement(Typography, { variant: "subtitle1", fontWeight: "bold" },
              pair.symbol
            )
          ),
          
          // Bid price
          React.createElement(Box, null,
            React.createElement(Typography, { variant: "caption", color: "text.secondary" },
              "Bid"
            ),
            React.createElement(Typography, { variant: "h6", color: "error.main" },
              pair.bid.toFixed(5)
            )
          ),
          
          // Ask price
          React.createElement(Box, null,
            React.createElement(Typography, { variant: "caption", color: "text.secondary" },
              "Ask"
            ),
            React.createElement(Typography, { variant: "h6", color: "success.main" },
              pair.ask.toFixed(5)
            )
          ),
          
          // Spread
          React.createElement(Box, { sx: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            React.createElement(Typography, { variant: "caption", color: "text.secondary" },
              "Spread"
            ),
            React.createElement(Typography, { variant: "body2" },
              `${pair.spread} pips`
            )
          ),
          
          // Trade button
          React.createElement(Button, {
            variant: "contained",
            size: "small",
            fullWidth: true,
            sx: { mt: 1 }
          }, "Trade")
        )
      )
    );
  };

  // Main component render
  return React.createElement(Box, { sx: { width: '100%', overflowX: 'auto' } },
    React.createElement(Stack, {
      direction: "row",
      spacing: 2,
      sx: {
        pb: 2,
        px: 2,
        minWidth: 'min-content',
      }
    }, forexPairs.map(pair => createForexPairCard(pair)))
  );
};

export default ForexPairs;
