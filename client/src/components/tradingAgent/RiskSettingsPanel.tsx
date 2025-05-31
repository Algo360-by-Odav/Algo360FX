import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Button,
  Divider,
  FormControlLabel,
  Switch,
  Tooltip,
  IconButton
} from '@mui/material';
import { Info as InfoIcon, Save as SaveIcon } from '@mui/icons-material';

interface RiskSettings {
  riskPercentage: number;
  useFixedLotSize: boolean;
  lotSize: number;
  stopLossPoints: number;
  takeProfitPoints: number;
  maxDailyLoss: number;
  maxOpenTrades: number;
  tradingHours: string;
}

const RiskSettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<RiskSettings>({
    riskPercentage: 1,
    useFixedLotSize: false,
    lotSize: 0.01,
    stopLossPoints: 50,
    takeProfitPoints: 100,
    maxDailyLoss: 5,
    maxOpenTrades: 3,
    tradingHours: 'all'
  });

  const handleSliderChange = (name: keyof RiskSettings) => (_: Event, value: number | number[]) => {
    setSettings({
      ...settings,
      [name]: value as number
    });
  };

  const handleInputChange = (name: keyof RiskSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' 
      ? event.target.checked 
      : event.target.name === 'lotSize' 
        ? parseFloat(event.target.value) 
        : parseInt(event.target.value, 10);
        
    setSettings({
      ...settings,
      [name]: value
    });
  };

  const handleSelectChange = (event: any) => {
    setSettings({
      ...settings,
      tradingHours: event.target.value
    });
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      useFixedLotSize: event.target.checked
    });
  };

  const handleSave = () => {
    // This would send the risk settings to the backend
    console.log('Saving risk settings:', settings);
    // Show success message
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {/* Risk Percentage vs Fixed Lot Size */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FormControlLabel
              control={
                <Switch
                  checked={settings.useFixedLotSize}
                  onChange={handleSwitchChange}
                  name="useFixedLotSize"
                  color="primary"
                />
              }
              label="Use Fixed Lot Size"
            />
            <Tooltip title="Toggle between risk-based position sizing and fixed lot size">
              <IconButton size="small">
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>

        {/* Risk Percentage or Lot Size based on toggle */}
        {settings.useFixedLotSize ? (
          <Grid item xs={12}>
            <TextField
              label="Lot Size"
              type="number"
              value={settings.lotSize}
              onChange={handleInputChange('lotSize')}
              InputProps={{
                inputProps: { min: 0.01, max: 10, step: 0.01 }
              }}
              fullWidth
              size="small"
            />
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography variant="body2" gutterBottom>
              Risk per Trade: {settings.riskPercentage}%
            </Typography>
            <Slider
              value={settings.riskPercentage}
              onChange={handleSliderChange('riskPercentage')}
              aria-labelledby="risk-percentage-slider"
              valueLabelDisplay="auto"
              step={0.1}
              marks
              min={0.1}
              max={5}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Stop Loss & Take Profit */}
        <Grid item xs={6}>
          <TextField
            label="Stop Loss (points)"
            type="number"
            value={settings.stopLossPoints}
            onChange={handleInputChange('stopLossPoints')}
            InputProps={{
              inputProps: { min: 10, max: 500 }
            }}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Take Profit (points)"
            type="number"
            value={settings.takeProfitPoints}
            onChange={handleInputChange('takeProfitPoints')}
            InputProps={{
              inputProps: { min: 10, max: 1000 }
            }}
            fullWidth
            size="small"
          />
        </Grid>

        {/* Max Daily Loss & Max Open Trades */}
        <Grid item xs={6}>
          <TextField
            label="Max Daily Loss (%)"
            type="number"
            value={settings.maxDailyLoss}
            onChange={handleInputChange('maxDailyLoss')}
            InputProps={{
              inputProps: { min: 1, max: 20 }
            }}
            fullWidth
            size="small"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Max Open Trades"
            type="number"
            value={settings.maxOpenTrades}
            onChange={handleInputChange('maxOpenTrades')}
            InputProps={{
              inputProps: { min: 1, max: 10 }
            }}
            fullWidth
            size="small"
          />
        </Grid>

        {/* Trading Hours */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel id="trading-hours-label">Trading Hours</InputLabel>
            <Select
              labelId="trading-hours-label"
              value={settings.tradingHours}
              label="Trading Hours"
              onChange={handleSelectChange}
            >
              <MenuItem value="all">All Hours</MenuItem>
              <MenuItem value="london">London Session</MenuItem>
              <MenuItem value="newyork">New York Session</MenuItem>
              <MenuItem value="asia">Asia Session</MenuItem>
              <MenuItem value="custom">Custom Hours</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            fullWidth
          >
            Save Settings
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RiskSettingsPanel;
