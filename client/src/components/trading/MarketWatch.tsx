import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import MarketCategorySelector from './MarketCategorySelector';

interface MarketData {
  symbol: string;
  name: string;
  category: string;
  subCategory: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  isFavorite?: boolean;
}

// Sample market data for different categories
const SAMPLE_MARKET_DATA: MarketData[] = [
  // Forex
  { symbol: 'EUR/USD', name: 'Euro/US Dollar', category: 'forex', subCategory: 'Major', price: 1.2345, change: 0.0023, changePercent: 0.19, volume: 1234567 },
  { symbol: 'GBP/USD', name: 'British Pound/US Dollar', category: 'forex', subCategory: 'Major', price: 1.5678, change: -0.0045, changePercent: -0.29, volume: 987654 },
  
  // Crypto
  { symbol: 'BTC/USD', name: 'Bitcoin/US Dollar', category: 'crypto', subCategory: 'Bitcoin', price: 48234.56, change: 1234.56, changePercent: 2.63, volume: 5678901 },
  { symbol: 'ETH/USD', name: 'Ethereum/US Dollar', category: 'crypto', subCategory: 'Ethereum', price: 2345.67, change: -45.67, changePercent: -1.91, volume: 3456789 },
  
  // Shares
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'shares', subCategory: 'US', price: 178.90, change: 2.34, changePercent: 1.32, volume: 23456789 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'shares', subCategory: 'US', price: 345.67, change: 5.67, changePercent: 1.67, volume: 12345678 },
  
  // Commodities
  { symbol: 'WHEAT', name: 'Wheat Futures', category: 'commodities', subCategory: 'Agriculture', price: 678.90, change: -12.34, changePercent: -1.78, volume: 456789 },
  { symbol: 'COPPER', name: 'Copper Futures', category: 'commodities', subCategory: 'Industrial', price: 4.567, change: 0.123, changePercent: 2.77, volume: 345678 },
  
  // Metals
  { symbol: 'XAUUSD', name: 'Gold Spot', category: 'metals', subCategory: 'Gold', price: 1987.65, change: 23.45, changePercent: 1.19, volume: 567890 },
  { symbol: 'XAGUSD', name: 'Silver Spot', category: 'metals', subCategory: 'Silver', price: 24.567, change: -0.345, changePercent: -1.39, volume: 234567 },
  
  // Energies
  { symbol: 'CL', name: 'Crude Oil WTI', category: 'energies', subCategory: 'Oil', price: 75.43, change: 1.23, changePercent: 1.66, volume: 789012 },
  { symbol: 'NG', name: 'Natural Gas', category: 'energies', subCategory: 'Natural Gas', price: 2.345, change: -0.067, changePercent: -2.78, volume: 456789 },
  
  // Indices
  { symbol: 'US500', name: 'S&P 500', category: 'indices', subCategory: 'US', price: 4567.89, change: 34.56, changePercent: 0.76, volume: 890123 },
  { symbol: 'GER40', name: 'DAX 40', category: 'indices', subCategory: 'EU', price: 16789.0, change: -123.45, changePercent: -0.73, volume: 678901 },
];

const MarketWatch: React.FC<{ onSymbolSelect: (symbol: string) => void }> = observer(({ onSymbolSelect }) => {
  const { tradingStore } = useStores();
  const [selectedCategory, setSelectedCategory] = useState('forex');
  const [selectedSubCategory, setSelectedSubCategory] = useState('Major');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const handleCategoryChange = (category: string, subCategory: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory(subCategory);
  };

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  const filteredMarketData = SAMPLE_MARKET_DATA
    .filter(data => {
      if (searchQuery) {
        return (
          data.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          data.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      return (
        data.category === selectedCategory &&
        data.subCategory === selectedSubCategory
      );
    })
    .map(data => ({
      ...data,
      isFavorite: favorites.includes(data.symbol),
    }));

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
        <Stack spacing={1}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Market Watch
          </Typography>
          
          <TextField
            size="small"
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.03)',
              },
            }}
          />

          <MarketCategorySelector
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            onCategoryChange={handleCategoryChange}
          />
        </Stack>
      </Box>

      {/* Market Data Table */}
      <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Chg%</TableCell>
              <TableCell align="right">Volume</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMarketData.map((row) => (
              <TableRow
                key={row.symbol}
                hover
                onClick={() => onSymbolSelect(row.symbol)}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.03)',
                  },
                }}
              >
                <TableCell padding="checkbox">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(row.symbol);
                    }}
                  >
                    {row.isFavorite ? (
                      <StarIcon fontSize="small" sx={{ color: 'primary.main' }} />
                    ) : (
                      <StarBorderIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell 
                  component="th" 
                  scope="row"
                  sx={{ 
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Stack spacing={0}>
                    <Typography variant="body2">{row.symbol}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {row.name}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ 
                    fontFamily: 'monospace',
                    fontWeight: 500,
                  }}
                >
                  {row.price.toFixed(
                    row.category === 'crypto' ? 2 : 
                    row.category === 'forex' ? 5 : 2
                  )}
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ 
                    color: row.changePercent >= 0 ? 'success.main' : 'error.main',
                    fontWeight: 500,
                  }}
                >
                  {row.changePercent >= 0 ? '+' : ''}{row.changePercent.toFixed(2)}%
                </TableCell>
                <TableCell 
                  align="right"
                  sx={{ 
                    color: 'text.secondary',
                    fontFamily: 'monospace',
                  }}
                >
                  {row.volume.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
});

export default MarketWatch;
