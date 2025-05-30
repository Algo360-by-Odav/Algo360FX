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
  Box,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import type { MarketData } from '../../services/marketService';

interface MarketOverviewProps {
  markets: MarketData[];
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({ markets }) => {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">24h Change</TableCell>
            <TableCell align="right">Volume</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {markets.map((market) => (
            <TableRow key={market.symbol} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {market.symbol}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">
                  {typeof market.price === 'number' 
                    ? market.price.toFixed(4)
                    : market.price}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'flex-end',
                  color: market.change >= 0 ? 'success.main' : 'error.main' 
                }}>
                  {market.change >= 0 
                    ? <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                    : <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />}
                  <Typography variant="body2">
                    {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)}%
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="text.secondary">
                  {market.volume.toLocaleString()}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
