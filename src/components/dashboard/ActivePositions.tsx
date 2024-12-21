import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Position } from '../../types/trading';
import { useStore } from '../../hooks/useStore';

interface ActivePositionsProps {
  positions: Position[];
}

const ActivePositions: React.FC<ActivePositionsProps> = ({ positions }) => {
  const theme = useTheme();
  const { tradeStore } = useStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const handleClosePosition = (positionId: string) => {
    tradeStore.closePosition(positionId);
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Side</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right">Entry Price</TableCell>
            <TableCell align="right">Current Price</TableCell>
            <TableCell align="right">P&L</TableCell>
            <TableCell align="right">ROI</TableCell>
            <TableCell align="right">Duration</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positions.map((position) => {
            const pnl = position.unrealizedPnL;
            const roi = pnl / position.notionalValue;
            const duration = Math.floor(
              (Date.now() - new Date(position.entryTime).getTime()) / (1000 * 60)
            );

            return (
              <TableRow key={position.id}>
                <TableCell component="th" scope="row">
                  {position.symbol}
                </TableCell>
                <TableCell align="right">
                  <Typography
                    color={position.side === 'buy' ? 'success.main' : 'error.main'}
                  >
                    {position.side.toUpperCase()}
                  </Typography>
                </TableCell>
                <TableCell align="right">{position.size}</TableCell>
                <TableCell align="right">
                  {formatCurrency(position.entryPrice)}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(position.currentPrice)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color:
                      pnl >= 0 ? theme.palette.success.main : theme.palette.error.main,
                  }}
                >
                  {formatCurrency(pnl)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color:
                      roi >= 0 ? theme.palette.success.main : theme.palette.error.main,
                  }}
                >
                  {formatPercentage(roi)}
                </TableCell>
                <TableCell align="right">
                  {duration < 60
                    ? `${duration}m`
                    : `${Math.floor(duration / 60)}h ${duration % 60}m`}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Close Position">
                    <IconButton
                      size="small"
                      onClick={() => handleClosePosition(position.id)}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
          {positions.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} align="center">
                <Typography variant="body2" color="text.secondary">
                  No active positions
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ActivePositions;
