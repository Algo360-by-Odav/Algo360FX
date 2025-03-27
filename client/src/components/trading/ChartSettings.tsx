import React, { useState } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Slider,
  Switch,
  Stack,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';

export interface ChartSettings {
  theme: 'dark' | 'light';
  gridLines: boolean;
  watermark: boolean;
  crosshair: 'normal' | 'magnet';
  volumeVisible: boolean;
  priceLineVisible: boolean;
  chartType: 'candlestick' | 'line' | 'bar' | 'area';
  timeframe: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M';
  chartStyle: {
    upColor: string;
    downColor: string;
    borderColor: string;
    backgroundColor: string;
    lineWidth: number;
  };
}

interface ChartSettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const defaultSettings: ChartSettings = {
  theme: 'dark',
  gridLines: true,
  watermark: false,
  crosshair: 'normal',
  volumeVisible: true,
  priceLineVisible: true,
  chartType: 'candlestick',
  timeframe: '1m',
  chartStyle: {
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderColor: '#378658',
    backgroundColor: '#131722',
    lineWidth: 2,
  },
};

const ChartSettingsDialog: React.FC<ChartSettingsDialogProps> = ({
  open,
  onClose,
}) => {
  const [settings, setSettings] = useState<ChartSettings>(defaultSettings);

  const handleChange = (field: keyof ChartSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStyleChange = (field: keyof ChartSettings['chartStyle'], value: any) => {
    setSettings(prev => ({
      ...prev,
      chartStyle: {
        ...prev.chartStyle,
        [field]: value,
      },
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Chart Settings</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Theme</FormLabel>
            <RadioGroup
              row
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
            >
              <FormControlLabel value="light" control={<Radio />} label="Light" />
              <FormControlLabel value="dark" control={<Radio />} label="Dark" />
            </RadioGroup>
          </FormControl>

          <Divider />

          <FormControl component="fieldset">
            <FormLabel component="legend">Chart Type</FormLabel>
            <RadioGroup
              row
              value={settings.chartType}
              onChange={(e) => handleChange('chartType', e.target.value)}
            >
              <FormControlLabel value="candlestick" control={<Radio />} label="Candlestick" />
              <FormControlLabel value="line" control={<Radio />} label="Line" />
              <FormControlLabel value="bar" control={<Radio />} label="Bar" />
              <FormControlLabel value="area" control={<Radio />} label="Area" />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={settings.timeframe}
              label="Timeframe"
              onChange={(e) => handleChange('timeframe', e.target.value)}
            >
              <MenuItem value="1m">1 Minute</MenuItem>
              <MenuItem value="5m">5 Minutes</MenuItem>
              <MenuItem value="15m">15 Minutes</MenuItem>
              <MenuItem value="30m">30 Minutes</MenuItem>
              <MenuItem value="1h">1 Hour</MenuItem>
              <MenuItem value="4h">4 Hours</MenuItem>
              <MenuItem value="1d">1 Day</MenuItem>
              <MenuItem value="1w">1 Week</MenuItem>
              <MenuItem value="1M">1 Month</MenuItem>
            </Select>
          </FormControl>

          <Divider />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Display Options
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.gridLines}
                    onChange={(e) => handleChange('gridLines', e.target.checked)}
                  />
                }
                label="Grid Lines"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.volumeVisible}
                    onChange={(e) => handleChange('volumeVisible', e.target.checked)}
                  />
                }
                label="Volume"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.priceLineVisible}
                    onChange={(e) => handleChange('priceLineVisible', e.target.checked)}
                  />
                }
                label="Price Line"
              />
            </Stack>
          </Box>

          <Divider />

          <FormControl component="fieldset">
            <FormLabel component="legend">Crosshair Mode</FormLabel>
            <RadioGroup
              row
              value={settings.crosshair}
              onChange={(e) => handleChange('crosshair', e.target.value)}
            >
              <FormControlLabel value="normal" control={<Radio />} label="Normal" />
              <FormControlLabel value="magnet" control={<Radio />} label="Magnet" />
            </RadioGroup>
          </FormControl>

          <Divider />

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Style
            </Typography>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Line Width</FormLabel>
                <Slider
                  value={settings.chartStyle.lineWidth}
                  min={1}
                  max={4}
                  step={1}
                  marks
                  onChange={(_, value) => handleStyleChange('lineWidth', value)}
                />
              </FormControl>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onClose} variant="contained" color="primary">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChartSettingsDialog;
