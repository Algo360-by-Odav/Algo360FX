import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStoreContext } from '../../stores/RootStoreContext';
import DataTable, { Column } from '../tables/DataTable';
import { Signal } from '../../stores/SignalProviderStore';

const SignalManagement: React.FC = observer(() => {
  const { signalStore } = useRootStoreContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [newSignal, setNewSignal] = useState({
    pair: '',
    type: 'BUY',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
  });

  const columns: Column<Signal>[] = [
    { id: 'pair', label: 'Currency Pair', minWidth: 100 },
    { id: 'type', label: 'Type', minWidth: 70 },
    {
      id: 'entryPrice',
      label: 'Entry Price',
      minWidth: 100,
      align: 'right',
      format: (value: number) => value.toFixed(4),
    },
    {
      id: 'stopLoss',
      label: 'Stop Loss',
      minWidth: 100,
      align: 'right',
      format: (value: number) => value.toFixed(4),
    },
    {
      id: 'takeProfit',
      label: 'Take Profit',
      minWidth: 100,
      align: 'right',
      format: (value: number) => value.toFixed(4),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      format: (value: string) => (
        <Box
          component="span"
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 1,
            backgroundColor:
              value === 'ACTIVE'
                ? 'success.light'
                : value === 'CLOSED'
                ? 'error.light'
                : 'warning.light',
            color:
              value === 'ACTIVE'
                ? 'success.dark'
                : value === 'CLOSED'
                ? 'error.dark'
                : 'warning.dark',
          }}
        >
          {value}
        </Box>
      ),
    },
    {
      id: 'profit',
      label: 'Profit/Loss',
      minWidth: 100,
      align: 'right',
      format: (value: number) =>
        value ? (
          <Box
            component="span"
            sx={{
              color: value >= 0 ? 'success.main' : 'error.main',
            }}
          >
            {value >= 0 ? '+' : ''}
            {value.toFixed(2)}
          </Box>
        ) : (
          '-'
        ),
    },
  ];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewSignal({
      pair: '',
      type: 'BUY',
      entryPrice: '',
      stopLoss: '',
      takeProfit: '',
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewSignal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    signalStore.addSignal({
      pair: newSignal.pair,
      type: newSignal.type as 'BUY' | 'SELL',
      entryPrice: parseFloat(newSignal.entryPrice),
      stopLoss: parseFloat(newSignal.stopLoss),
      takeProfit: parseFloat(newSignal.takeProfit),
    });
    handleCloseDialog();
  };

  const handleCloseSignal = (signal: Signal) => {
    const profit = Math.random() * 200 - 100; // Mock profit calculation
    const pips = Math.random() * 100 - 50; // Mock pips calculation
    signalStore.closeSignal(signal.id, profit, pips);
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          New Signal
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={signalStore.signals}
        onDelete={(signal) => signal.status === 'ACTIVE' && handleCloseSignal(signal)}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Signal</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="pair"
                label="Currency Pair"
                fullWidth
                value={newSignal.pair}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="type"
                label="Type"
                select
                fullWidth
                value={newSignal.type}
                onChange={handleInputChange}
              >
                <MenuItem value="BUY">BUY</MenuItem>
                <MenuItem value="SELL">SELL</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="entryPrice"
                label="Entry Price"
                type="number"
                fullWidth
                value={newSignal.entryPrice}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="stopLoss"
                label="Stop Loss"
                type="number"
                fullWidth
                value={newSignal.stopLoss}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="takeProfit"
                label="Take Profit"
                type="number"
                fullWidth
                value={newSignal.takeProfit}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !newSignal.pair ||
              !newSignal.entryPrice ||
              !newSignal.stopLoss ||
              !newSignal.takeProfit
            }
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default SignalManagement;
