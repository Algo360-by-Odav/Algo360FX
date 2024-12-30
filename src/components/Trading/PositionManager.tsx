import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
} from '@mui/material';
import {
  Close as CloseIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { useStore } from '../../hooks/useStore';
import { Position } from '../../types/trading';

interface PositionManagerProps {
  positions: Position[];
}

interface ModifyPositionDialogProps {
  open: boolean;
  position: Position | null;
  onClose: () => void;
  onConfirm: (stopLoss: number, takeProfit: number) => void;
}

const ModifyPositionDialog: React.FC<ModifyPositionDialogProps> = ({
  open,
  position,
  onClose,
  onConfirm,
}) => {
  const [stopLoss, setStopLoss] = React.useState('');
  const [takeProfit, setTakeProfit] = React.useState('');

  React.useEffect(() => {
    if (position) {
      setStopLoss(position.stopLoss?.toString() || '');
      setTakeProfit(position.takeProfit?.toString() || '');
    }
  }, [position]);

  const handleConfirm = () => {
    onConfirm(Number(stopLoss), Number(takeProfit));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modify Position</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Stop Loss"
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Take Profit"
            type="number"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PositionManager: React.FC<PositionManagerProps> = observer(({ positions }) => {
  const theme = useTheme();
  const { tradeStore } = useStore();
  const [selectedPosition, setSelectedPosition] = React.useState<Position | null>(
    null
  );
  const [modifyDialogOpen, setModifyDialogOpen] = React.useState(false);

  const handleClosePosition = (positionId: string) => {
    tradeStore.closePosition(positionId);
  };

  const handleModifyPosition = (position: Position) => {
    setSelectedPosition(position);
    setModifyDialogOpen(true);
  };

  const handleModifyConfirm = (stopLoss: number, takeProfit: number) => {
    if (selectedPosition) {
      tradeStore.modifyPosition(selectedPosition.id, {
        stopLoss,
        takeProfit,
      });
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatPercentage = (value: number) =>
    `${(value * 100).toFixed(2)}%`;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Active Positions
      </Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Side</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Entry</TableCell>
              <TableCell align="right">Current</TableCell>
              <TableCell align="right">P&L</TableCell>
              <TableCell align="right">ROI</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {positions.map((position) => {
              const pnl = position.unrealizedPnL;
              const roi = pnl / position.notionalValue;

              return (
                <TableRow key={position.id}>
                  <TableCell>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color:
                          position.side === 'buy'
                            ? theme.palette.success.main
                            : theme.palette.error.main,
                      }}
                    >
                      {position.side === 'buy' ? (
                        <TrendingUpIcon fontSize="small" />
                      ) : (
                        <TrendingDownIcon fontSize="small" />
                      )}
                      <Typography sx={{ ml: 1 }}>
                        {position.side.toUpperCase()}
                      </Typography>
                    </Box>
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
                        pnl >= 0
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                    }}
                  >
                    {formatCurrency(pnl)}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color:
                        roi >= 0
                          ? theme.palette.success.main
                          : theme.palette.error.main,
                    }}
                  >
                    {formatPercentage(roi)}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Tooltip title="Modify Position">
                        <IconButton
                          size="small"
                          onClick={() => handleModifyPosition(position)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Close Position">
                        <IconButton
                          size="small"
                          onClick={() => handleClosePosition(position.id)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            {positions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No active positions
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ModifyPositionDialog
        open={modifyDialogOpen}
        position={selectedPosition}
        onClose={() => setModifyDialogOpen(false)}
        onConfirm={handleModifyConfirm}
      />
    </Box>
  );
});

export default PositionManager;
