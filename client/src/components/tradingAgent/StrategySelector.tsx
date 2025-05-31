import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Divider,
  Slider,
  Grid,
  Button,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Save as SaveIcon
} from '@mui/icons-material';

interface StrategySettings {
  strategy: string;
  rsiPeriod: number;
  rsiOverbought: number;
  rsiOversold: number;
  acThreshold: number;
  envelopesPeriod: number;
  envelopesDeviation: number;
  psarStep: number;
  psarMax: number;
  useRsi: boolean;
  useAc: boolean;
  useEnvelopes: boolean;
  usePsar: boolean;
}

const StrategySelector: React.FC = () => {
  const [settings, setSettings] = useState<StrategySettings>({
    strategy: 'multi-indicator',
    rsiPeriod: 14,
    rsiOverbought: 70,
    rsiOversold: 30,
    acThreshold: 0.5,
    envelopesPeriod: 20,
    envelopesDeviation: 0.1,
    psarStep: 0.02,
    psarMax: 0.2,
    useRsi: true,
    useAc: true,
    useEnvelopes: true,
    usePsar: false
  });

  const handleStrategyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      strategy: (event.target as HTMLInputElement).value
    });
  };

  const handleSliderChange = (name: keyof StrategySettings) => (_: Event, value: number | number[]) => {
    setSettings({
      ...settings,
      [name]: value as number
    });
  };

  const handleToggleChange = (name: keyof StrategySettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [name]: event.target.checked
    });
  };

  const handleSave = () => {
    // This would send the strategy settings to the backend
    console.log('Saving strategy settings:', settings);
    // Show success message
  };

  return (
    <Box>
      <FormControl component="fieldset">
        <Typography variant="subtitle2" gutterBottom>
          Strategy Type
        </Typography>
        <RadioGroup
          name="strategy-type"
          value={settings.strategy}
          onChange={handleStrategyChange}
        >
          <FormControlLabel 
            value="multi-indicator" 
            control={<Radio size="small" />} 
            label="Multi-Indicator Strategy" 
          />
          <FormControlLabel 
            value="trend-following" 
            control={<Radio size="small" />} 
            label="Trend Following" 
          />
          <FormControlLabel 
            value="breakout" 
            control={<Radio size="small" />} 
            label="Breakout Strategy" 
          />
        </RadioGroup>
      </FormControl>

      <Divider sx={{ my: 2 }} />

      {settings.strategy === 'multi-indicator' && (
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Indicator Selection
          </Typography>
          
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.useRsi}
                    onChange={handleToggleChange('useRsi')}
                    size="small"
                  />
                }
                label="RSI"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.useAc}
                    onChange={handleToggleChange('useAc')}
                    size="small"
                  />
                }
                label="Accelerator (AC)"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.useEnvelopes}
                    onChange={handleToggleChange('useEnvelopes')}
                    size="small"
                  />
                }
                label="Envelopes"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.usePsar}
                    onChange={handleToggleChange('usePsar')}
                    size="small"
                  />
                }
                label="Parabolic SAR"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="rsi-settings-content"
                id="rsi-settings-header"
              >
                <Typography variant="body2">RSI Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Period: {settings.rsiPeriod}</Typography>
                    <Tooltip title="Number of periods for RSI calculation">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Slider
                    value={settings.rsiPeriod}
                    onChange={handleSliderChange('rsiPeriod')}
                    min={2}
                    max={30}
                    marks
                    step={1}
                    disabled={!settings.useRsi}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Overbought: {settings.rsiOverbought}</Typography>
                    <Tooltip title="Level to consider market overbought">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Slider
                    value={settings.rsiOverbought}
                    onChange={handleSliderChange('rsiOverbought')}
                    min={50}
                    max={90}
                    marks
                    step={1}
                    disabled={!settings.useRsi}
                  />
                </Box>
                
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Oversold: {settings.rsiOversold}</Typography>
                    <Tooltip title="Level to consider market oversold">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Slider
                    value={settings.rsiOversold}
                    onChange={handleSliderChange('rsiOversold')}
                    min={10}
                    max={50}
                    marks
                    step={1}
                    disabled={!settings.useRsi}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="ac-settings-content"
                id="ac-settings-header"
              >
                <Typography variant="body2">Accelerator (AC) Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Threshold: {settings.acThreshold}</Typography>
                    <Tooltip title="Signal threshold for AC indicator">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Slider
                    value={settings.acThreshold}
                    onChange={handleSliderChange('acThreshold')}
                    min={0.1}
                    max={2}
                    step={0.1}
                    marks
                    disabled={!settings.useAc}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="envelopes-settings-content"
                id="envelopes-settings-header"
              >
                <Typography variant="body2">Envelopes Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Period: {settings.envelopesPeriod}</Typography>
                    <Tooltip title="Number of periods for moving average">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Slider
                    value={settings.envelopesPeriod}
                    onChange={handleSliderChange('envelopesPeriod')}
                    min={5}
                    max={50}
                    step={1}
                    marks
                    disabled={!settings.useEnvelopes}
                  />
                </Box>
                
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Deviation: {settings.envelopesDeviation}</Typography>
                    <Tooltip title="Envelope deviation (%)">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Slider
                    value={settings.envelopesDeviation}
                    onChange={handleSliderChange('envelopesDeviation')}
                    min={0.05}
                    max={0.5}
                    step={0.01}
                    marks
                    disabled={!settings.useEnvelopes}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="psar-settings-content"
                id="psar-settings-header"
              >
                <Typography variant="body2">Parabolic SAR Settings</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Step: {settings.psarStep}</Typography>
                    <Tooltip title="Step value for Parabolic SAR">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Slider
                    value={settings.psarStep}
                    onChange={handleSliderChange('psarStep')}
                    min={0.01}
                    max={0.1}
                    step={0.01}
                    marks
                    disabled={!settings.usePsar}
                  />
                </Box>
                
                <Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">Maximum: {settings.psarMax}</Typography>
                    <Tooltip title="Maximum value for Parabolic SAR">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Slider
                    value={settings.psarMax}
                    onChange={handleSliderChange('psarMax')}
                    min={0.1}
                    max={0.5}
                    step={0.05}
                    marks
                    disabled={!settings.usePsar}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      )}

      <Button
        variant="contained"
        color="primary"
        startIcon={<SaveIcon />}
        onClick={handleSave}
        fullWidth
        sx={{ mt: 2 }}
      >
        Save Strategy
      </Button>
    </Box>
  );
};

export default StrategySelector;
