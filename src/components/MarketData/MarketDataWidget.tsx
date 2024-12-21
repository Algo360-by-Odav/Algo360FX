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
  Chip,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Star,
  StarBorder,
  Timeline,
  Refresh,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  bid: number;
  ask: number;
  spread: number;
}

const MarketDataWidget: React.FC = observer(() => {
  const theme = useTheme();
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // In a real application, this would connect to your WebSocket service
    const fetchData = () => {
      // Simulated market data
      const mockData: MarketData[] = [
        {
          symbol: 'EUR/USD',
          price: 1.0925,
          change: 0.0015,
          changePercent: 0.14,
          volume: 125000,
          high: 1.0940,
          low: 1.0910,
          bid: 1.0924,
          ask: 1.0926,
          spread: 0.0002,
        },
        {
          symbol: 'GBP/USD',
          price: 1.2567,
          change: -0.0025,
          changePercent: -0.20,
          volume: 98000,
          high: 1.2590,
          low: 1.2550,
          bid: 1.2566,
          ask: 1.2568,
          spread: 0.0002,
        },
        // Add more currency pairs as needed
      ];

      setMarketData(mockData);
      setLastUpdate(new Date());
    };

    fetchData();
    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleFavorite = (symbol: string) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(symbol)) {
      newFavorites.delete(symbol);
    } else {
      newFavorites.add(symbol);
    }
    setFavorites(newFavorites);
  };

  const formatNumber = (value: number, decimals: number = 4): string => {
    return value.toFixed(decimals);
  };

  const formatVolume = (value: number): string => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toString();
  };

  return (
    <Card sx={{ height: '100%' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">Market Data</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Last update: {lastUpdate.toLocaleTimeString()}
          </Typography>
          <IconButton size="small">
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      <TableContainer sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Change</TableCell>
              <TableCell align="right">Bid</TableCell>
              <TableCell align="right">Ask</TableCell>
              <TableCell align="right">Spread</TableCell>
              <TableCell align="right">Volume</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {marketData.map((data) => (
              <TableRow
                key={data.symbol}
                sx={{
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <TableCell padding="checkbox">
                  <IconButton
                    size="small"
                    onClick={() => toggleFavorite(data.symbol)}
                  >
                    {favorites.has(data.symbol) ? (
                      <Star fontSize="small" color="primary" />
                    ) : (
                      <StarBorder fontSize="small" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {data.symbol}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatNumber(data.price)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 0.5,
                    }}
                  >
                    {data.change >= 0 ? (
                      <TrendingUp
                        fontSize="small"
                        sx={{ color: theme.palette.success.main }}
                      />
                    ) : (
                      <TrendingDown
                        fontSize="small"
                        sx={{ color: theme.palette.error.main }}
                      />
                    )}
                    <Chip
                      label={`${
                        data.change >= 0 ? '+' : ''
                      }${data.changePercent.toFixed(2)}%`}
                      size="small"
                      color={data.change >= 0 ? 'success' : 'error'}
                      sx={{ minWidth: 80 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatNumber(data.bid)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatNumber(data.ask)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatNumber(data.spread)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2">
                    {formatVolume(data.volume)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Open Chart">
                    <IconButton size="small">
                      <Timeline fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
});

export default MarketDataWidget;
