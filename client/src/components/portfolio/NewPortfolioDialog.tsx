import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Slider,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';

interface NewPortfolioDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (portfolio: NewPortfolio) => void;
}

export interface NewPortfolio {
  name: string;
  initialBalance: number;
  currency: string;
  riskLevel: string;
  stopLoss: number;
  takeProfit: number;
  description?: string;
}

const NewPortfolioDialog: React.FC<NewPortfolioDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [portfolio, setPortfolio] = useState<NewPortfolio>({
    name: '',
    initialBalance: 10000,
    currency: 'USD',
    riskLevel: 'Medium',
    stopLoss: 2,
    takeProfit: 3,
    description: '',
  });

  const handleTextChange = (field: keyof NewPortfolio) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'initialBalance' 
      ? Number(event.target.value)
      : event.target.value;
    setPortfolio({
      ...portfolio,
      [field]: value,
    });
  };

  const handleSelectChange = (field: keyof NewPortfolio) => (
    event: SelectChangeEvent
  ) => {
    setPortfolio({
      ...portfolio,
      [field]: event.target.value,
    });
  };

  const handleSliderChange = (field: keyof NewPortfolio) => (
    _event: Event,
    newValue: number | number[]
  ) => {
    setPortfolio({
      ...portfolio,
      [field]: newValue,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(portfolio);
    onClose();
  };

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CHF'];
  const riskLevels = ['Low', 'Medium', 'High'];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Portfolio</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Portfolio Name"
                value={portfolio.name}
                onChange={handleTextChange('name')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                type="number"
                label="Initial Balance"
                value={portfolio.initialBalance}
                onChange={handleTextChange('initialBalance')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={portfolio.currency}
                  onChange={handleSelectChange('currency')}
                  label="Currency"
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Risk Level</InputLabel>
                <Select
                  value={portfolio.riskLevel}
                  onChange={handleSelectChange('riskLevel')}
                  label="Risk Level"
                >
                  {riskLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Stop Loss (%)</Typography>
              <Slider
                value={portfolio.stopLoss}
                onChange={handleSliderChange('stopLoss')}
                valueLabelDisplay="auto"
                step={0.5}
                marks
                min={0.5}
                max={5}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography gutterBottom>Take Profit (%)</Typography>
              <Slider
                value={portfolio.takeProfit}
                onChange={handleSliderChange('takeProfit')}
                valueLabelDisplay="auto"
                step={0.5}
                marks
                min={1}
                max={10}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={portfolio.description}
                onChange={handleTextChange('description')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Create Portfolio
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default NewPortfolioDialog;
