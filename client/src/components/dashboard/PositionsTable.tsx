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
  Chip,
} from '@mui/material';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import type { Position } from '../../services/marketService';

interface PositionsTableProps {
  positions: Position[];
}

export const PositionsTable: React.FC<PositionsTableProps> = ({ positions }) => {
  return (
    <TableContainer component={Paper} elevation={0}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right">Entry Price</TableCell>
            <TableCell align="right">Current Price</TableCell>
            <TableCell align="right">P&L</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positions.map((position, index) => (
            <TableRow key={index} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {position.symbol}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  size="small"
                  label={position.type}
                  color={position.type === 'LONG' ? 'success' : 'error'}
                  icon={position.type === 'LONG' ? <ArrowUpward /> : <ArrowDownward />}
                />
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">
                  {position.size.toLocaleString()}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">
                  {position.entryPrice.toFixed(4)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2">
                  {position.currentPrice.toFixed(4)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Typography
                    variant="body2"
                    color={position.pnl >= 0 ? 'success.main' : 'error.main'}
                  >
                    ${position.pnl.toFixed(2)}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={position.pnl >= 0 ? 'success.main' : 'error.main'}
                  >
                    {position.pnl >= 0 ? '+' : ''}{position.pnlPercentage.toFixed(2)}%
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
