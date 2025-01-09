import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon } from '@mui/icons-material';

interface Position {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
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
  onEditPosition: (position: Position) => void;
}

const PositionsTable: React.FC<PositionsTableProps> = ({
  positions,
  onClosePosition,
  onEditPosition,
}) => {
  if (!positions.length) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={10} align="center">
                No open positions
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right">Entry Price</TableCell>
            <TableCell align="right">Current Price</TableCell>
            <TableCell align="right">Stop Loss</TableCell>
            <TableCell align="right">Take Profit</TableCell>
            <TableCell align="right">Margin</TableCell>
            <TableCell align="right">Swap</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {positions.map((position) => (
            <TableRow key={position.id}>
              <TableCell>{position.symbol}</TableCell>
              <TableCell>{position.type}</TableCell>
              <TableCell align="right">{position.size}</TableCell>
              <TableCell align="right">${position.entryPrice.toFixed(5)}</TableCell>
              <TableCell align="right">${position.currentPrice.toFixed(5)}</TableCell>
              <TableCell align="right">
                ${position.stopLoss ? position.stopLoss.toFixed(5) : '-'}
              </TableCell>
              <TableCell align="right">
                ${position.takeProfit ? position.takeProfit.toFixed(5) : '-'}
              </TableCell>
              <TableCell align="right">${position.margin.toFixed(2)}</TableCell>
              <TableCell align="right">${position.swap.toFixed(2)}</TableCell>
              <TableCell align="center">
                <IconButton
                  size="small"
                  onClick={() => onEditPosition(position)}
                  title="Edit position"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onClosePosition(position.id)}
                  title="Close position"
                >
                  <CloseIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PositionsTable;
