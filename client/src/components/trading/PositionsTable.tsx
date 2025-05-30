import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { PositionsTableProps, Position } from './types';

interface Position {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  size: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
  margin: number;
  swap: number;
  commission: number;
  openTime: string;
}

interface PositionsTableProps {
  positions: Position[];
  onClosePosition: (positionId: string) => void;
  onModifyPosition: (position: Position) => void;
  onRefresh?: () => void;
  advanced?: boolean;
}

const PositionsTable: React.FC<PositionsTableProps> = ({
  positions,
  onClosePosition,
  onModifyPosition,
  onRefresh,
  advanced = false,
}) => {
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  const handleOpenEdit = (position: Position) => {
    setEditingPosition(position);
    setStopLoss(position.stopLoss?.toString() || '');
    setTakeProfit(position.takeProfit?.toString() || '');
  };

  const handleCloseEdit = () => {
    setEditingPosition(null);
    setStopLoss('');
    setTakeProfit('');
  };

  const handleSaveEdit = () => {
    if (editingPosition && onModifyPosition) {
      onModifyPosition({
        ...editingPosition,
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        takeProfit: takeProfit ? parseFloat(takeProfit) : null,
      });
      handleCloseEdit();
    }
  };

  const calculatePnL = (position: Position) => {
    const multiplier = position.side === 'buy' ? 1 : -1;
    const priceDiff = (position.currentPrice - position.entryPrice) * multiplier;
    return priceDiff * position.size;
  };

  const calculatePnLPercentage = (position: Position) => {
    const pnl = calculatePnL(position);
    const initialValue = position.entryPrice * position.size;
    return (pnl / initialValue) * 100;
  };

  if (!positions.length) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          No open positions
        </Typography>
        {onRefresh && (
          <IconButton onClick={onRefresh}>
            <RefreshIcon />
          </IconButton>
        )}
      </Paper>
    );
  }

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Open Positions</Typography>
        {onRefresh && (
          <Tooltip title="Refresh">
            <IconButton onClick={onRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
      
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell>Side</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Entry Price</TableCell>
              <TableCell align="right">Current Price</TableCell>
              {advanced && (
                <>
                  <TableCell align="right">Stop Loss</TableCell>
                  <TableCell align="right">Take Profit</TableCell>
                  <TableCell align="right">Margin</TableCell>
                  <TableCell align="right">Swap</TableCell>
                </>
              )}
              <TableCell align="right">P&L</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {positions.map((position) => {
              const pnl = calculatePnL(position);
              const pnlPercentage = calculatePnLPercentage(position);
              
              return (
                <TableRow
                  key={position.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  <TableCell>{position.symbol}</TableCell>
                  <TableCell>
                    <Chip
                      icon={position.side === 'buy' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                      label={position.side.toUpperCase()}
                      size="small"
                      color={position.side === 'buy' ? 'success' : 'error'}
                      sx={{ width: 80 }}
                    />
                  </TableCell>
                  <TableCell align="right">{position.size.toFixed(2)}</TableCell>
                  <TableCell align="right">{position.entryPrice.toFixed(5)}</TableCell>
                  <TableCell align="right">{position.currentPrice.toFixed(5)}</TableCell>
                  {advanced && (
                    <>
                      <TableCell align="right">
                        {position.stopLoss ? position.stopLoss.toFixed(5) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {position.takeProfit ? position.takeProfit.toFixed(5) : '-'}
                      </TableCell>
                      <TableCell align="right">{position.margin.toFixed(2)}</TableCell>
                      <TableCell align="right">{position.swap.toFixed(2)}</TableCell>
                    </>
                  )}
                  <TableCell
                    align="right"
                    sx={{
                      color: pnl >= 0 ? 'success.main' : 'error.main',
                      fontWeight: 'bold',
                    }}
                  >
                    {pnl.toFixed(2)} ({pnlPercentage.toFixed(2)}%)
                  </TableCell>
                  <TableCell align="center">
                    {onModifyPosition && (
                      <Tooltip title="Edit position">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEdit(position)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Close position">
                      <IconButton
                        size="small"
                        onClick={() => onClosePosition(position.id)}
                      >
                        <CloseIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editingPosition} onClose={handleCloseEdit}>
        <DialogTitle>
          Edit Position - {editingPosition?.symbol}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Stop Loss"
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                inputProps: {
                  step: '0.00001',
                },
              }}
            />
            <TextField
              fullWidth
              label="Take Profit"
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              InputProps={{
                inputProps: {
                  step: '0.00001',
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PositionsTable;
