import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Slider,
  FormControlLabel,
  Switch,
  Button,
  Alert,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { useStores } from '../../stores/StoreProvider';
import { RiskParameters } from '../../stores/moneyManagerStore';

export const RiskParametersPanel = observer(() => {
  const stores = useStores();
  const { moneyManagerStore } = stores;
  const [parameters, setParameters] = useState<RiskParameters>({
    ...moneyManagerStore.riskParameters,
  });
  const [saved, setSaved] = useState(false);

  const handleSliderChange = (name: keyof RiskParameters) => (
    event: Event,
    newValue: number | number[]
  ) => {
    setParameters(prev => ({
      ...prev,
      [name]: newValue,
    }));
    setSaved(false);
  };

  const handleSwitchChange = (name: keyof RiskParameters) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setParameters(prev => ({
      ...prev,
      [name]: event.target.checked,
    }));
    setSaved(false);
  };

  const handleSave = () => {
    Object.assign(moneyManagerStore.riskParameters, parameters);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const renderSlider = (
    name: keyof RiskParameters,
    label: string,
    min: number,
    max: number,
    step: number,
    info?: string
  ) => {
    if (typeof parameters[name] !== 'number') return null;

    return (
      <Grid item xs={12}>
        <Box sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle1">{label}</Typography>
            {info && (
              <Tooltip title={info}>
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Slider
            value={parameters[name] as number}
            onChange={handleSliderChange(name)}
            min={min}
            max={max}
            step={step}
            marks
            valueLabelDisplay="auto"
          />
          <Typography variant="body2" color="textSecondary">
            Current: {parameters[name]}
            {name.toLowerCase().includes('ratio') ? '' : '%'}
          </Typography>
        </Box>
      </Grid>
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Risk Management Parameters
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {renderSlider(
            'maxRiskPerTrade',
            'Maximum Risk per Trade',
            0.5,
            5,
            0.5,
            'Maximum percentage of account balance to risk on a single trade'
          )}
          {renderSlider(
            'maxDailyLoss',
            'Maximum Daily Loss',
            2,
            10,
            1,
            'Maximum percentage loss allowed in a single trading day'
          )}
          {renderSlider(
            'maxDrawdown',
            'Maximum Drawdown',
            10,
            30,
            5,
            'Maximum allowed drawdown from peak equity'
          )}
          {renderSlider(
            'targetRiskRewardRatio',
            'Target Risk/Reward Ratio',
            1,
            5,
            0.5,
            'Minimum risk/reward ratio required for trades'
          )}
          {renderSlider(
            'maxMarginUtilization',
            'Maximum Margin Utilization',
            25,
            75,
            5,
            'Maximum percentage of account margin that can be used'
          )}
          {renderSlider(
            'maxPositionsPerCurrency',
            'Max Positions per Currency',
            1,
            5,
            1,
            'Maximum number of open positions allowed per currency pair'
          )}
          {renderSlider(
            'maxCorrelatedPositions',
            'Max Correlated Positions',
            1,
            5,
            1,
            'Maximum number of correlated positions allowed'
          )}

          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={parameters.stopLossRequired}
                  onChange={handleSwitchChange('stopLossRequired')}
                  color="primary"
                />
              }
              label="Require Stop Loss"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={parameters.takeProfitRequired}
                  onChange={handleSwitchChange('takeProfitRequired')}
                  color="primary"
                />
              }
              label="Require Take Profit"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSave}
            >
              Save Parameters
            </Button>
          </Grid>

          {saved && (
            <Grid item xs={12}>
              <Alert severity="success">Parameters saved successfully!</Alert>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
});

