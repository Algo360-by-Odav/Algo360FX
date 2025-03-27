import React, { useState } from 'react';
import {
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Tabs,
  Tab,
  Box,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  DeleteOutline as DeleteIcon,
  Add as AddIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useStores } from '../../stores/StoreProvider';
import { TradingIndicatorsProps, Indicator } from './types';

interface Indicator {
  id: string;
  name: string;
  type: string;
  period: number;
  parameters?: Record<string, any>;
  color?: string;
  style?: 'line' | 'histogram' | 'dots';
  overlay?: boolean;
}

interface IndicatorCategory {
  name: string;
  indicators: {
    type: string;
    name: string;
    description: string;
    defaultPeriod: number;
    parameters?: { name: string; type: 'number' | 'select'; options?: string[] }[];
  }[];
}

const INDICATOR_CATEGORIES: IndicatorCategory[] = [
  {
    name: 'Trend',
    indicators: [
      { type: 'sma', name: 'Simple Moving Average', description: 'Simple moving average indicator', defaultPeriod: 20 },
      { type: 'ema', name: 'Exponential Moving Average', description: 'Exponential moving average indicator', defaultPeriod: 20 },
      { type: 'macd', name: 'MACD', description: 'Moving Average Convergence Divergence', defaultPeriod: 26 },
      { type: 'bb', name: 'Bollinger Bands', description: 'Bollinger Bands indicator', defaultPeriod: 20 },
    ],
  },
  {
    name: 'Momentum',
    indicators: [
      { type: 'rsi', name: 'Relative Strength Index', description: 'Momentum indicator', defaultPeriod: 14 },
      { type: 'stoch', name: 'Stochastic', description: 'Stochastic oscillator', defaultPeriod: 14 },
      { type: 'cci', name: 'Commodity Channel Index', description: 'Momentum-based oscillator', defaultPeriod: 20 },
      { type: 'mfi', name: 'Money Flow Index', description: 'Volume-weighted RSI', defaultPeriod: 14 },
    ],
  },
  {
    name: 'Volume',
    indicators: [
      { type: 'volume', name: 'Volume', description: 'Trading volume indicator', defaultPeriod: 20 },
      { type: 'obv', name: 'On Balance Volume', description: 'Cumulative volume indicator', defaultPeriod: 20 },
      { type: 'adl', name: 'Accumulation/Distribution', description: 'Volume momentum indicator', defaultPeriod: 20 },
      { type: 'cmf', name: 'Chaikin Money Flow', description: 'Money flow volume indicator', defaultPeriod: 20 },
    ],
  },
  {
    name: 'Volatility',
    indicators: [
      { type: 'atr', name: 'Average True Range', description: 'Volatility indicator', defaultPeriod: 14 },
      { type: 'sd', name: 'Standard Deviation', description: 'Price volatility indicator', defaultPeriod: 20 },
      { type: 'kc', name: 'Keltner Channel', description: 'Volatility-based channels', defaultPeriod: 20 },
      { type: 'vi', name: 'Vortex Indicator', description: 'Trend strength and direction', defaultPeriod: 14 },
    ],
  },
];

const TradingIndicators: React.FC<TradingIndicatorsProps> = ({
  symbol,
  indicators,
  onAddIndicator,
  onRemoveIndicator,
  onUpdateIndicator,
  advanced = false,
}) => {
  const { tradingStore } = useStores();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedIndicator, setSelectedIndicator] = useState<any>(null);
  const [period, setPeriod] = useState(14);
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [configureIndicator, setConfigureIndicator] = useState<Indicator | null>(null);

  const handleAddIndicator = () => {
    if (selectedIndicator) {
      const newIndicator: Indicator = {
        id: `${selectedIndicator.type}-${Date.now()}`,
        type: selectedIndicator.type,
        name: selectedIndicator.name,
        period,
        parameters,
        enabled: true,
      };
      onAddIndicator(newIndicator);
      handleCloseDialog();
    }
  };

  const handleRemoveIndicator = (indicatorId: string) => {
    onRemoveIndicator(indicatorId);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedIndicator(null);
    setPeriod(14);
    setParameters({});
  };

  const handleIndicatorSelect = (indicator: any) => {
    setSelectedIndicator(indicator);
    setPeriod(indicator.defaultPeriod);
  };

  const handleConfigureIndicator = (indicator: Indicator) => {
    setConfigureIndicator(indicator);
    setPeriod(indicator.period);
    setParameters(indicator.parameters || {});
  };

  const handleUpdateIndicator = () => {
    if (configureIndicator) {
      onUpdateIndicator({
        ...configureIndicator,
        period,
        parameters,
      });
      setConfigureIndicator(null);
    }
  };

  const renderTabs = () => (
    <Tabs
      value={selectedCategory}
      onChange={(_, value) => setSelectedCategory(value)}
      variant="scrollable"
      scrollButtons="auto"
    >
      {INDICATOR_CATEGORIES.map((category, index) => (
        <Tab key={category.name} label={category.name} value={index} />
      ))}
    </Tabs>
  );

  const renderIndicatorList = () => (
    <List>
      {INDICATOR_CATEGORIES[selectedCategory].indicators.map((indicator) => (
        <ListItem
          key={indicator.type}
          button
          selected={selectedIndicator?.type === indicator.type}
          onClick={() => handleIndicatorSelect(indicator)}
        >
          <ListItemText
            primary={indicator.name}
            secondary={indicator.description}
          />
        </ListItem>
      ))}
    </List>
  );

  const renderParameters = () => {
    if (!selectedIndicator) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Period"
          type="number"
          value={period}
          onChange={(e) => setPeriod(parseInt(e.target.value))}
          sx={{ mb: 2 }}
        />
        {selectedIndicator.parameters?.map((param: any) => (
          <FormControl key={param.name} fullWidth sx={{ mb: 2 }}>
            <InputLabel>{param.name}</InputLabel>
            {param.type === 'select' ? (
              <Select
                value={parameters[param.name] || ''}
                onChange={(e) => setParameters({ ...parameters, [param.name]: e.target.value })}
              >
                {param.options?.map((option: string) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              <TextField
                type="number"
                value={parameters[param.name] || ''}
                onChange={(e) => setParameters({ ...parameters, [param.name]: e.target.value })}
              />
            )}
          </FormControl>
        ))}
      </Box>
    );
  };

  return (
    <>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Technical Indicators</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            size="small"
          >
            Add Indicator
          </Button>
        </Box>
        <List>
          {tradingStore.indicators.map((indicator) => (
            <ListItem
              key={indicator.id}
              secondaryAction={
                <Box>
                  {advanced && (
                    <Tooltip title="Configure">
                      <IconButton
                        edge="end"
                        sx={{ mr: 1 }}
                        onClick={() => handleConfigureIndicator(indicator)}
                      >
                        <SettingsIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Remove">
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveIndicator(indicator.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {indicator.name}
                    <Chip
                      label={`Period: ${indicator.period}`}
                      size="small"
                      variant="outlined"
                    />
                    {advanced && indicator.parameters && Object.keys(indicator.parameters).length > 0 && (
                      <Chip
                        label="Custom"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    )}
                  </Box>
                }
                secondary={indicator.type.toUpperCase()}
              />
            </ListItem>
          ))}
          {tradingStore.indicators.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No active indicators"
                secondary="Click 'Add Indicator' to add technical analysis indicators"
              />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Add Indicator Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add Technical Indicator</DialogTitle>
        <DialogContent>
          {renderTabs()}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              {renderIndicatorList()}
            </Grid>
            <Grid item xs={6}>
              {renderParameters()}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleAddIndicator}
            variant="contained"
            disabled={!selectedIndicator}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Configure Indicator Dialog */}
      <Dialog
        open={!!configureIndicator}
        onClose={() => setConfigureIndicator(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Configure {configureIndicator?.name}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Period"
            type="number"
            value={period}
            onChange={(e) => setPeriod(parseInt(e.target.value))}
            sx={{ mt: 2, mb: 2 }}
          />
          {configureIndicator?.parameters && Object.keys(configureIndicator.parameters).map((param) => (
            <TextField
              key={param}
              fullWidth
              label={param}
              value={parameters[param] || ''}
              onChange={(e) => setParameters({ ...parameters, [param]: e.target.value })}
              sx={{ mb: 2 }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigureIndicator(null)}>Cancel</Button>
          <Button onClick={handleUpdateIndicator} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TradingIndicators;

