import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../stores/StoreProvider';

interface RiskSettings {
  maxPositionSize: number;
  maxDailyLoss: number;
  maxDrawdown: number;
  stopLossType: 'FIXED' | 'ATR' | 'VOLATILITY';
  stopLossValue: number;
  takeProfitType: 'FIXED' | 'RR_RATIO' | 'VOLATILITY';
  takeProfitValue: number;
  maxOpenPositions: number;
  maxDailyTrades: number;
  correlationLimit: number;
  volatilityFilter: number;
}

export const RiskManagementForm: React.FC = observer(() => {
  const store = useStores();
  const { tradingStore } = store;
  const [settings, setSettings] = useState<RiskSettings>({
    maxPositionSize: 2.0,
    maxDailyLoss: 3.0,
    maxDrawdown: 10.0,
    stopLossType: 'ATR',
    stopLossValue: 2.0,
    takeProfitType: 'RR_RATIO',
    takeProfitValue: 2.0,
    maxOpenPositions: 3,
    maxDailyTrades: 5,
    correlationLimit: 0.7,
    volatilityFilter: 1.5,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof RiskSettings) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = event.target.value;
    setSettings({
      ...settings,
      [field]: typeof value === 'string' ? parseFloat(value) : value,
    });
  };

  const handleSelectChange = (field: keyof RiskSettings) => (
    event: SelectChangeEvent<string>
  ) => {
    setSettings({
      ...settings,
      [field]: event.target.value,
    });
  };

  const handleSliderChange = (field: keyof RiskSettings) => (
    _: Event,
    newValue: number | number[]
  ) => {
    setSettings({
      ...settings,
      [field]: newValue,
    });
  };

  const handleSubmit = async () => {
    try {
      // Save settings to store
      await tradingStore.setRiskSettings(settings);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update risk settings');
    }
  };

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6">Position Sizing</Typography>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Max Position Size (%)"
            type="number"
            value={settings.maxPositionSize}
            onChange={handleChange('maxPositionSize')}
            inputProps={{ step: 0.1, min: 0.1, max: 10 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Max Daily Loss (%)"
            type="number"
            value={settings.maxDailyLoss}
            onChange={handleChange('maxDailyLoss')}
            inputProps={{ step: 0.1, min: 0.1, max: 10 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Stop Loss & Take Profit</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Stop Loss Type</InputLabel>
            <Select
              value={settings.stopLossType}
              onChange={handleSelectChange('stopLossType')}
              label="Stop Loss Type"
            >
              <MenuItem value="FIXED">Fixed</MenuItem>
              <MenuItem value="ATR">ATR</MenuItem>
              <MenuItem value="VOLATILITY">Volatility</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Stop Loss Value"
            type="number"
            value={settings.stopLossValue}
            onChange={handleChange('stopLossValue')}
            inputProps={{ step: 0.1, min: 0.1 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Take Profit Type</InputLabel>
            <Select
              value={settings.takeProfitType}
              onChange={handleSelectChange('takeProfitType')}
              label="Take Profit Type"
            >
              <MenuItem value="FIXED">Fixed</MenuItem>
              <MenuItem value="RR_RATIO">Risk/Reward Ratio</MenuItem>
              <MenuItem value="VOLATILITY">Volatility</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Take Profit Value"
            type="number"
            value={settings.takeProfitValue}
            onChange={handleChange('takeProfitValue')}
            inputProps={{ step: 0.1, min: 0.1 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Risk Limits</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Max Open Positions"
            type="number"
            value={settings.maxOpenPositions}
            onChange={handleChange('maxOpenPositions')}
            inputProps={{ step: 1, min: 1, max: 10 }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Max Daily Trades"
            type="number"
            value={settings.maxDailyTrades}
            onChange={handleChange('maxDailyTrades')}
            inputProps={{ step: 1, min: 1, max: 20 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">Advanced Filters</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Correlation Limit</Typography>
          <Slider
            value={settings.correlationLimit}
            onChange={handleSliderChange('correlationLimit')}
            min={0}
            max={1}
            step={0.1}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography gutterBottom>Volatility Filter</Typography>
          <Slider
            value={settings.volatilityFilter}
            onChange={handleSliderChange('volatilityFilter')}
            min={0}
            max={3}
            step={0.1}
            marks
            valueLabelDisplay="auto"
          />
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Save Risk Settings
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
});

export default RiskManagementForm;

