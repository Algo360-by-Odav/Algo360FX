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
  Typography,
  Slider,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/RootStoreContext';
import DataTable, { Column } from '../tables/DataTable';
import { Portfolio } from '../../stores/InvestmentStore';

const PortfolioManagement: React.FC = observer(() => {
  const { investmentStore } = useRootStore();
  const [openDialog, setOpenDialog] = useState(false);
  const [newPortfolio, setNewPortfolio] = useState({
    name: '',
    allocation: 0,
    initialValue: '',
    risk: 'Medium' as 'Low' | 'Medium' | 'High',
    strategy: 'Forex' as 'Forex' | 'Algo' | 'Signal' | 'Managed',
  });

  const columns: Column<Portfolio>[] = [
    { id: 'name', label: 'Portfolio Name', minWidth: 170 },
    {
      id: 'allocation',
      label: 'Allocation (%)',
      minWidth: 100,
      align: 'right',
      format: (value: number) => `${value}%`,
    },
    {
      id: 'currentValue',
      label: 'Current Value',
      minWidth: 120,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
    },
    {
      id: 'return',
      label: 'Return',
      minWidth: 100,
      align: 'right',
      format: (value: number) => (
        <Box
          component="span"
          sx={{
            color: value >= 0 ? 'success.main' : 'error.main',
          }}
        >
          {value >= 0 ? '+' : ''}
          {value.toFixed(2)}%
        </Box>
      ),
    },
    {
      id: 'risk',
      label: 'Risk Level',
      minWidth: 100,
      format: (value: string) => (
        <Box
          component="span"
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 1,
            backgroundColor:
              value === 'Low'
                ? 'success.light'
                : value === 'Medium'
                ? 'warning.light'
                : 'error.light',
            color:
              value === 'Low'
                ? 'success.dark'
                : value === 'Medium'
                ? 'warning.dark'
                : 'error.dark',
          }}
        >
          {value}
        </Box>
      ),
    },
    { id: 'strategy', label: 'Strategy', minWidth: 100 },
  ];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewPortfolio({
      name: '',
      allocation: 0,
      initialValue: '',
      risk: 'Medium',
      strategy: 'Forex',
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
    setNewPortfolio((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleAllocationChange = (event: Event, newValue: number | number[]) => {
    setNewPortfolio((prev) => ({
      ...prev,
      allocation: newValue as number,
    }));
  };

  const handleSubmit = () => {
    investmentStore.addPortfolio({
      name: newPortfolio.name,
      allocation: newPortfolio.allocation,
      initialValue: parseFloat(newPortfolio.initialValue),
      currentValue: parseFloat(newPortfolio.initialValue), // Initially same as initial value
      risk: newPortfolio.risk,
      strategy: newPortfolio.strategy,
    });
    handleCloseDialog();
  };

  const totalAllocation = investmentStore.portfolios.reduce(
    (sum, portfolio) => sum + portfolio.allocation,
    0
  );

  const remainingAllocation = 100 - totalAllocation;

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Remaining Allocation: {remainingAllocation}%
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          disabled={remainingAllocation <= 0}
        >
          New Portfolio
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={investmentStore.portfolios}
        onEdit={(portfolio) => {
          // Implement edit functionality
          console.log('Edit portfolio:', portfolio);
        }}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Portfolio</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Portfolio Name"
                fullWidth
                value={newPortfolio.name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>
                Allocation: {newPortfolio.allocation}%
              </Typography>
              <Slider
                value={newPortfolio.allocation}
                onChange={handleAllocationChange}
                max={remainingAllocation}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="initialValue"
                label="Initial Investment"
                type="number"
                fullWidth
                value={newPortfolio.initialValue}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="risk"
                label="Risk Level"
                select
                fullWidth
                value={newPortfolio.risk}
                onChange={handleInputChange}
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="strategy"
                label="Strategy"
                select
                fullWidth
                value={newPortfolio.strategy}
                onChange={handleInputChange}
              >
                <MenuItem value="Forex">Forex Trading</MenuItem>
                <MenuItem value="Algo">Algo Trading</MenuItem>
                <MenuItem value="Signal">Signal Following</MenuItem>
                <MenuItem value="Managed">Managed Account</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !newPortfolio.name ||
              !newPortfolio.initialValue ||
              newPortfolio.allocation <= 0
            }
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default PortfolioManagement;

