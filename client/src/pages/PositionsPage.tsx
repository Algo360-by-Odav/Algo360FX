import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { useStore } from '@/context/StoreContext';
import PositionsTable from '@/components/trading/PositionsTable';

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

interface EditDialogProps {
  open: boolean;
  position: Position | null;
  onClose: () => void;
  onSave: (positionId: string, takeProfit: number | null, stopLoss: number | null) => void;
}

const EditDialog: React.FC<EditDialogProps> = ({ open, position, onClose, onSave }) => {
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');

  useEffect(() => {
    if (position) {
      setTakeProfit(position.takeProfit?.toString() || '');
      setStopLoss(position.stopLoss?.toString() || '');
    }
  }, [position]);

  const handleSave = () => {
    if (!position) return;
    onSave(
      position.id,
      takeProfit ? parseFloat(takeProfit) : null,
      stopLoss ? parseFloat(stopLoss) : null
    );
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Position</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            label="Take Profit"
            type="number"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Stop Loss"
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            fullWidth
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PositionsPage: React.FC = () => {
  const { tradingStore } = useStore();
  const [positions, setPositions] = useState<Position[]>([]);
  const [editPosition, setEditPosition] = useState<Position | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const positions = await tradingStore.getPositions();
        setPositions(positions);
      } catch (error) {
        console.error('Failed to fetch positions:', error);
      }
    };

    fetchPositions();
  }, [tradingStore]);

  const handleClosePosition = async (positionId: string) => {
    try {
      await tradingStore.closePosition(positionId);
      setPositions(positions.filter(p => p.id !== positionId));
    } catch (error) {
      console.error('Failed to close position:', error);
    }
  };

  const handleEditPosition = (position: Position) => {
    setEditPosition(position);
  };

  const handleSavePosition = async (
    positionId: string,
    takeProfit: number | null,
    stopLoss: number | null
  ) => {
    try {
      await tradingStore.modifyPosition(positionId, takeProfit || 0, stopLoss || 0);
      setPositions(positions.map(p =>
        p.id === positionId
          ? { ...p, takeProfit, stopLoss }
          : p
      ));
    } catch (error) {
      console.error('Failed to modify position:', error);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ pt: 4, pb: 2 }}>
        <Typography variant="h4" gutterBottom>
          Open Positions
        </Typography>
      </Box>
      <PositionsTable
        positions={positions}
        onClosePosition={handleClosePosition}
        onEditPosition={handleEditPosition}
      />
      <EditDialog
        open={!!editPosition}
        position={editPosition}
        onClose={() => setEditPosition(null)}
        onSave={handleSavePosition}
      />
    </Container>
  );
};

export default PositionsPage;
