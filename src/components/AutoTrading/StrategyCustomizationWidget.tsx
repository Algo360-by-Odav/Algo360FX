import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { TimePicker } from '@mui/x-date-pickers';

interface StrategyParameters {
  lotSize: number;
  stopLoss: number;
  takeProfit: number;
  maxSpread: number;
  maxSlippage: number;
  tradingHoursStart: Date | null;
  tradingHoursEnd: Date | null;
  maxDailyLoss: number;
  maxDrawdown: number;
  allowedSymbols: string[];
  useTrailingStop: boolean;
  martingaleMultiplier: number;
}

const StrategyCustomizationWidget: React.FC = observer(() => {
  const [parameters, setParameters] = useState<StrategyParameters>({
    lotSize: 0.1,
    stopLoss: 50,
    takeProfit: 100,
    maxSpread: 3,
    maxSlippage: 2,
    tradingHoursStart: null,
    tradingHoursEnd: null,
    maxDailyLoss: 500,
    maxDrawdown: 20,
    allowedSymbols: ['EURUSD', 'GBPUSD'],
    useTrailingStop: false,
    martingaleMultiplier: 2,
  });

  const [optimizationDialogOpen, setOptimizationDialogOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleParameterChange = (param: keyof StrategyParameters, value: any) => {
    setParameters({ ...parameters, [param]: value });
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsOptimizing(false);
    setOptimizationDialogOpen(false);
  };

  const handleSave = () => {
    // Implement save logic here
    console.log('Saving parameters:', parameters);
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Strategy Customization</Typography>
          <Box>
            <Button
              startIcon={<TimelineIcon />}
              onClick={() => setOptimizationDialogOpen(true)}
              sx={{ mr: 1 }}
            >
              Optimize
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Position Sizing */}
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Position Sizing</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography gutterBottom>Lot Size</Typography>
                    <Slider
                      value={parameters.lotSize}
                      onChange={(_, value) => handleParameterChange('lotSize', value)}
                      min={0.01}
                      max={1}
                      step={0.01}
                      marks={[
                        { value: 0.01, label: '0.01' },
                        { value: 0.5, label: '0.5' },
                        { value: 1, label: '1.0' },
                      ]}
                      valueLabelDisplay="auto"
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Martingale Multiplier"
                      type="number"
                      value={parameters.martingaleMultiplier}
                      onChange={(e) => handleParameterChange('martingaleMultiplier', parseFloat(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={parameters.useTrailingStop}
                          onChange={(e) => handleParameterChange('useTrailingStop', e.target.checked)}
                        />
                      }
                      label="Use Trailing Stop"
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Risk Management */}
          <Grid item xs={12}>
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Risk Management</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Stop Loss (pips)"
                      type="number"
                      value={parameters.stopLoss}
                      onChange={(e) => handleParameterChange('stopLoss', parseInt(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Take Profit (pips)"
                      type="number"
                      value={parameters.takeProfit}
                      onChange={(e) => handleParameterChange('takeProfit', parseInt(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Max Daily Loss ($)"
                      type="number"
                      value={parameters.maxDailyLoss}
                      onChange={(e) => handleParameterChange('maxDailyLoss', parseInt(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Max Drawdown (%)"
                      type="number"
                      value={parameters.maxDrawdown}
                      onChange={(e) => handleParameterChange('maxDrawdown', parseInt(e.target.value))}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Trading Schedule */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Trading Schedule</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TimePicker
                      label="Trading Start Time"
                      value={parameters.tradingHoursStart}
                      onChange={(newValue) => handleParameterChange('tradingHoursStart', newValue)}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TimePicker
                      label="Trading End Time"
                      value={parameters.tradingHoursEnd}
                      onChange={(newValue) => handleParameterChange('tradingHoursEnd', newValue)}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>

          {/* Execution Settings */}
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1">Execution Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Max Spread (pips)"
                      type="number"
                      value={parameters.maxSpread}
                      onChange={(e) => handleParameterChange('maxSpread', parseInt(e.target.value))}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Max Slippage (pips)"
                      type="number"
                      value={parameters.maxSlippage}
                      onChange={(e) => handleParameterChange('maxSlippage', parseInt(e.target.value))}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        {/* Optimization Dialog */}
        <Dialog
          open={optimizationDialogOpen}
          onClose={() => setOptimizationDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Strategy Optimization</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="body1" paragraph>
                  The optimization process will test different parameter combinations to find the optimal settings for your strategy.
                  This may take several minutes to complete.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Optimization Method</InputLabel>
                  <Select
                    value="genetic"
                    label="Optimization Method"
                  >
                    <MenuItem value="genetic">Genetic Algorithm</MenuItem>
                    <MenuItem value="grid">Grid Search</MenuItem>
                    <MenuItem value="monte">Monte Carlo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOptimizationDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleOptimize}
              disabled={isOptimizing}
            >
              {isOptimizing ? 'Optimizing...' : 'Start Optimization'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
});

export default StrategyCustomizationWidget;
