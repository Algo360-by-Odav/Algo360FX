// chartSettingsJs.js - JavaScript version without JSX
// This avoids the Vite React plugin preamble detection error

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

// Default chart settings
const defaultSettings = {
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

const ChartSettingsDialog = ({
  open,
  onClose,
}) => {
  const [settings, setSettings] = useState(defaultSettings);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStyleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      chartStyle: {
        ...prev.chartStyle,
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    // In a real app, this would save the settings to a store or API
    // For this demo, we'll just close the dialog
    onClose();
  };

  // Create the theme selection section
  const createThemeSection = () => {
    return React.createElement(FormControl, { component: "fieldset" },
      React.createElement(FormLabel, { component: "legend" }, "Theme"),
      React.createElement(RadioGroup, {
        row: true,
        value: settings.theme,
        onChange: (e) => handleChange('theme', e.target.value)
      },
        React.createElement(FormControlLabel, {
          value: "dark",
          control: React.createElement(Radio),
          label: "Dark"
        }),
        React.createElement(FormControlLabel, {
          value: "light",
          control: React.createElement(Radio),
          label: "Light"
        })
      )
    );
  };

  // Create the chart type selection section
  const createChartTypeSection = () => {
    return React.createElement(FormControl, { fullWidth: true },
      React.createElement(InputLabel, { id: "chart-type-label" }, "Chart Type"),
      React.createElement(Select, {
        labelId: "chart-type-label",
        value: settings.chartType,
        label: "Chart Type",
        onChange: (e) => handleChange('chartType', e.target.value)
      },
        React.createElement(MenuItem, { value: "candlestick" }, "Candlestick"),
        React.createElement(MenuItem, { value: "line" }, "Line"),
        React.createElement(MenuItem, { value: "bar" }, "Bar"),
        React.createElement(MenuItem, { value: "area" }, "Area")
      )
    );
  };

  // Create the timeframe selection section
  const createTimeframeSection = () => {
    return React.createElement(FormControl, { fullWidth: true },
      React.createElement(InputLabel, { id: "timeframe-label" }, "Timeframe"),
      React.createElement(Select, {
        labelId: "timeframe-label",
        value: settings.timeframe,
        label: "Timeframe",
        onChange: (e) => handleChange('timeframe', e.target.value)
      },
        React.createElement(MenuItem, { value: "1m" }, "1 Minute"),
        React.createElement(MenuItem, { value: "5m" }, "5 Minutes"),
        React.createElement(MenuItem, { value: "15m" }, "15 Minutes"),
        React.createElement(MenuItem, { value: "30m" }, "30 Minutes"),
        React.createElement(MenuItem, { value: "1h" }, "1 Hour"),
        React.createElement(MenuItem, { value: "4h" }, "4 Hours"),
        React.createElement(MenuItem, { value: "1d" }, "1 Day"),
        React.createElement(MenuItem, { value: "1w" }, "1 Week"),
        React.createElement(MenuItem, { value: "1M" }, "1 Month")
      )
    );
  };

  // Create the display options section
  const createDisplayOptionsSection = () => {
    return React.createElement(Box, null,
      React.createElement(Typography, { variant: "subtitle1", gutterBottom: true }, "Display Options"),
      
      React.createElement(FormControlLabel, {
        control: React.createElement(Switch, {
          checked: settings.gridLines,
          onChange: (e) => handleChange('gridLines', e.target.checked)
        }),
        label: "Show Grid Lines"
      }),
      
      React.createElement(FormControlLabel, {
        control: React.createElement(Switch, {
          checked: settings.watermark,
          onChange: (e) => handleChange('watermark', e.target.checked)
        }),
        label: "Show Watermark"
      }),
      
      React.createElement(FormControlLabel, {
        control: React.createElement(Switch, {
          checked: settings.volumeVisible,
          onChange: (e) => handleChange('volumeVisible', e.target.checked)
        }),
        label: "Show Volume"
      }),
      
      React.createElement(FormControlLabel, {
        control: React.createElement(Switch, {
          checked: settings.priceLineVisible,
          onChange: (e) => handleChange('priceLineVisible', e.target.checked)
        }),
        label: "Show Price Line"
      })
    );
  };

  // Create the crosshair section
  const createCrosshairSection = () => {
    return React.createElement(FormControl, { component: "fieldset" },
      React.createElement(FormLabel, { component: "legend" }, "Crosshair Type"),
      React.createElement(RadioGroup, {
        row: true,
        value: settings.crosshair,
        onChange: (e) => handleChange('crosshair', e.target.value)
      },
        React.createElement(FormControlLabel, {
          value: "normal",
          control: React.createElement(Radio),
          label: "Normal"
        }),
        React.createElement(FormControlLabel, {
          value: "magnet",
          control: React.createElement(Radio),
          label: "Magnet"
        })
      )
    );
  };

  // Create the style section
  const createStyleSection = () => {
    return React.createElement(Box, null,
      React.createElement(Typography, { variant: "subtitle1", gutterBottom: true }, "Chart Style"),
      
      React.createElement(Box, { sx: { mb: 2 } },
        React.createElement(Typography, { variant: "body2", gutterBottom: true }, "Up Color"),
        React.createElement("input", {
          type: "color",
          value: settings.chartStyle.upColor,
          onChange: (e) => handleStyleChange('upColor', e.target.value),
          style: { width: '100%' }
        })
      ),
      
      React.createElement(Box, { sx: { mb: 2 } },
        React.createElement(Typography, { variant: "body2", gutterBottom: true }, "Down Color"),
        React.createElement("input", {
          type: "color",
          value: settings.chartStyle.downColor,
          onChange: (e) => handleStyleChange('downColor', e.target.value),
          style: { width: '100%' }
        })
      ),
      
      React.createElement(Box, { sx: { mb: 2 } },
        React.createElement(Typography, { variant: "body2", gutterBottom: true }, "Line Width"),
        React.createElement(Slider, {
          value: settings.chartStyle.lineWidth,
          min: 1,
          max: 5,
          step: 1,
          marks: true,
          valueLabelDisplay: "auto",
          onChange: (_, value) => handleStyleChange('lineWidth', value)
        })
      )
    );
  };

  // Main dialog render
  return React.createElement(Dialog, {
    open: open,
    onClose: onClose,
    maxWidth: "sm",
    fullWidth: true
  },
    React.createElement(DialogTitle, null, "Chart Settings"),
    React.createElement(DialogContent, null,
      React.createElement(Stack, { spacing: 3, sx: { mt: 2 } },
        createThemeSection(),
        React.createElement(Divider),
        createChartTypeSection(),
        React.createElement(Divider),
        createTimeframeSection(),
        React.createElement(Divider),
        createDisplayOptionsSection(),
        React.createElement(Divider),
        createCrosshairSection(),
        React.createElement(Divider),
        createStyleSection()
      )
    ),
    React.createElement(DialogActions, null,
      React.createElement(Button, { onClick: onClose }, "Cancel"),
      React.createElement(Button, { onClick: handleSave, variant: "contained" }, "Save")
    )
  );
};

export default ChartSettingsDialog;
