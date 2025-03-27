import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  Button,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useStores } from '../../stores/StoreProvider';

export const PositionSizeCalculator = observer(() => {
  const stores = useStores();
  const { moneyManagerStore } = stores;
  const [formData, setFormData] = useState({
    symbol: '',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
  });
  const [calculation, setCalculation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSymbolChange = (e: any) => {
    setFormData(prev => ({ ...prev, symbol: e.target.value }));
  };

  const handleCalculate = () => {
    try {
      const entry = parseFloat(formData.entryPrice);
      const sl = parseFloat(formData.stopLoss);
      const tp = parseFloat(formData.takeProfit);

      if (!formData.symbol || isNaN(entry) || isNaN(sl) || isNaN(tp)) {
        setError('Please fill in all fields with valid numbers');
        return;
      }

      const result = moneyManagerStore.calculatePositionSize(
        formData.symbol,
        entry,
        sl,
        tp
      );

      setCalculation(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate position size');
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Position Size Calculator
      </Typography>
      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Symbol</InputLabel>
                  <Select
                    value={formData.symbol}
                    label="Symbol"
                    onChange={handleSymbolChange}
                  >
                    <MenuItem value="EURUSD">EUR/USD</MenuItem>
                    <MenuItem value="GBPUSD">GBP/USD</MenuItem>
                    <MenuItem value="USDJPY">USD/JPY</MenuItem>
                    <MenuItem value="AUDUSD">AUD/USD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Entry Price"
                  name="entryPrice"
                  value={formData.entryPrice}
                  onChange={handleInputChange}
                  type="number"
                  inputProps={{ step: "0.00001" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Stop Loss"
                  name="stopLoss"
                  value={formData.stopLoss}
                  onChange={handleInputChange}
                  type="number"
                  inputProps={{ step: "0.00001" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Take Profit"
                  name="takeProfit"
                  value={formData.takeProfit}
                  onChange={handleInputChange}
                  type="number"
                  inputProps={{ step: "0.00001" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleCalculate}
                >
                  Calculate
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Results
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {calculation && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">
                    Recommended Position Size
                  </Typography>
                  <Typography variant="h5">
                    {calculation.recommendedPositionSize.toLocaleString()} units
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Recommended Lot Size</Typography>
                  <Typography>
                    {calculation.recommendedLotSize.toFixed(2)} lots
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Maximum Lot Size</Typography>
                  <Typography>{calculation.maxLotSize.toFixed(2)} lots</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Margin Required</Typography>
                  <Typography>
                    ${calculation.marginRequired.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2">Potential Loss</Typography>
                  <Typography color="error">
                    ${calculation.potentialLoss.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Risk/Reward Ratio</Typography>
                  <Typography>
                    1:{calculation.riskRewardRatio.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

