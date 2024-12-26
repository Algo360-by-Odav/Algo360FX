import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '@/hooks/useRootStore';

interface Signal {
  id: string;
  name: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  status: 'ACTIVE' | 'CLOSED' | 'PENDING';
  createdAt: string;
}

const SignalManagement: React.FC = observer(() => {
  const { signalStore } = useRootStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  // Mock data - replace with actual data from store
  const signals: Signal[] = [
    {
      id: '1',
      name: 'EUR/USD Long',
      type: 'BUY',
      symbol: 'EUR/USD',
      entryPrice: 1.0850,
      stopLoss: 1.0800,
      takeProfit: 1.0950,
      status: 'ACTIVE',
      createdAt: '2024-12-22T04:39:22',
    },
    {
      id: '2',
      name: 'GBP/USD Short',
      type: 'SELL',
      symbol: 'GBP/USD',
      entryPrice: 1.2650,
      stopLoss: 1.2700,
      takeProfit: 1.2550,
      status: 'PENDING',
      createdAt: '2024-12-22T04:39:22',
    },
  ];

  const handleAddSignal = () => {
    setSelectedSignal(null);
    setOpenDialog(true);
  };

  const handleEditSignal = (signal: Signal) => {
    setSelectedSignal(signal);
    setOpenDialog(true);
  };

  const handleDeleteSignal = (signalId: string) => {
    // Implement delete logic
    console.log('Deleting signal:', signalId);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSignal(null);
  };

  const handleSaveSignal = () => {
    // Implement save logic
    handleCloseDialog();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Active Signals</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddSignal}
        >
          New Signal
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Symbol</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Entry Price</TableCell>
              <TableCell>Stop Loss</TableCell>
              <TableCell>Take Profit</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {signals.map((signal) => (
              <TableRow key={signal.id}>
                <TableCell>{signal.name}</TableCell>
                <TableCell>{signal.symbol}</TableCell>
                <TableCell>
                  <Chip
                    label={signal.type}
                    color={signal.type === 'BUY' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{signal.entryPrice}</TableCell>
                <TableCell>{signal.stopLoss}</TableCell>
                <TableCell>{signal.takeProfit}</TableCell>
                <TableCell>
                  <Chip
                    label={signal.status}
                    color={
                      signal.status === 'ACTIVE'
                        ? 'success'
                        : signal.status === 'PENDING'
                        ? 'warning'
                        : 'default'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(signal.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleEditSignal(signal)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteSignal(signal.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedSignal ? 'Edit Signal' : 'Create New Signal'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                defaultValue={selectedSignal?.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Symbol"
                defaultValue={selectedSignal?.symbol}
                select
              >
                <MenuItem value="EUR/USD">EUR/USD</MenuItem>
                <MenuItem value="GBP/USD">GBP/USD</MenuItem>
                <MenuItem value="USD/JPY">USD/JPY</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Type"
                defaultValue={selectedSignal?.type}
                select
              >
                <MenuItem value="BUY">BUY</MenuItem>
                <MenuItem value="SELL">SELL</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Entry Price"
                type="number"
                defaultValue={selectedSignal?.entryPrice}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Stop Loss"
                type="number"
                defaultValue={selectedSignal?.stopLoss}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Take Profit"
                type="number"
                defaultValue={selectedSignal?.takeProfit}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveSignal} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default SignalManagement;


