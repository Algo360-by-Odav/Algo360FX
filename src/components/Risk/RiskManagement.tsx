import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Slider,
  TextField,
  Button,
  Alert,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
} from '@mui/material';
import {
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStoreContext } from '../../stores/RootStoreContext';

interface RiskParameters {
  maxDrawdown: number;
  stopLossPercent: number;
  takeProfitRatio: number;
  maxPositionSize: number;
  maxDailyLoss: number;
  useTrailingStop: boolean;
  trailingStopDistance: number;
}

const RiskManagement: React.FC = observer(() => {
  const { tradingStore } = useRootStoreContext();
  const [riskParams, setRiskParams] = useState<RiskParameters>({
    maxDrawdown: 10,
    stopLossPercent: 2,
    takeProfitRatio: 2,
    maxPositionSize: 5,
    maxDailyLoss: 3,
    useTrailingStop: false,
    trailingStopDistance: 50,
  });

  const [riskScore, setRiskScore] = useState(calculateRiskScore(riskParams));

  function calculateRiskScore(params: RiskParameters): number {
    // Risk score calculation based on parameters
    const drawdownScore = (20 - params.maxDrawdown) * 5;
    const slScore = (10 - params.stopLossPercent) * 10;
    const tpScore = params.takeProfitRatio * 10;
    const positionScore = (10 - params.maxPositionSize) * 5;
    const dailyLossScore = (10 - params.maxDailyLoss) * 5;
    const trailingStopScore = params.useTrailingStop ? 50 : 0;

    const totalScore = (
      drawdownScore +
      slScore +
      tpScore +
      positionScore +
      dailyLossScore +
      trailingStopScore
    ) / 6;

    return Math.min(Math.max(totalScore, 0), 100);
  }

  const handleParamChange = (param: keyof RiskParameters) => (
    event: Event | React.ChangeEvent<HTMLInputElement>,
    value?: number | boolean
  ) => {
    const newValue = value ?? (event.target as HTMLInputElement).value;
    const newParams = {
      ...riskParams,
      [param]: newValue,
    };
    setRiskParams(newParams);
    setRiskScore(calculateRiskScore(newParams));
  };

  const getRiskLevel = (score: number): { level: string; color: string } => {
    if (score >= 80) return { level: 'Conservative', color: 'success.main' };
    if (score >= 60) return { level: 'Moderate', color: 'info.main' };
    if (score >= 40) return { level: 'Balanced', color: 'warning.main' };
    return { level: 'Aggressive', color: 'error.main' };
  };

  const { level, color } = getRiskLevel(riskScore);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Risk Score Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center' }}>
                <SecurityIcon sx={{ fontSize: 40, color: color, mb: 1 }} />
                <Typography variant="h4" gutterBottom>
                  {Math.round(riskScore)}
                </Typography>
                <Typography variant="subtitle1" color={color}>
                  {level} Risk Profile
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Parameters */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Risk Parameters
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  Maximum Drawdown: {riskParams.maxDrawdown}%
                </Typography>
                <Slider
                  value={riskParams.maxDrawdown}
                  onChange={handleParamChange('maxDrawdown')}
                  min={1}
                  max={20}
                  valueLabelDisplay="auto"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>
                  Stop Loss: {riskParams.stopLossPercent}%
                </Typography>
                <Slider
                  value={riskParams.stopLossPercent}
                  onChange={handleParamChange('stopLossPercent')}
                  min={0.5}
                  max={10}
                  step={0.5}
                  valueLabelDisplay="auto"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>
                  Take Profit Ratio: {riskParams.takeProfitRatio}:1
                </Typography>
                <Slider
                  value={riskParams.takeProfitRatio}
                  onChange={handleParamChange('takeProfitRatio')}
                  min={1}
                  max={5}
                  step={0.5}
                  valueLabelDisplay="auto"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>
                  Maximum Position Size: {riskParams.maxPositionSize}%
                </Typography>
                <Slider
                  value={riskParams.maxPositionSize}
                  onChange={handleParamChange('maxPositionSize')}
                  min={1}
                  max={10}
                  valueLabelDisplay="auto"
                />
              </Grid>

              <Grid item xs={12}>
                <Typography gutterBottom>
                  Maximum Daily Loss: {riskParams.maxDailyLoss}%
                </Typography>
                <Slider
                  value={riskParams.maxDailyLoss}
                  onChange={handleParamChange('maxDailyLoss')}
                  min={1}
                  max={10}
                  valueLabelDisplay="auto"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={riskParams.useTrailingStop}
                      onChange={handleParamChange('useTrailingStop')}
                    />
                  }
                  label="Use Trailing Stop"
                />
                {riskParams.useTrailingStop && (
                  <Box sx={{ mt: 2 }}>
                    <Typography gutterBottom>
                      Trailing Stop Distance: {riskParams.trailingStopDistance} pips
                    </Typography>
                    <Slider
                      value={riskParams.trailingStopDistance}
                      onChange={handleParamChange('trailingStopDistance')}
                      min={10}
                      max={200}
                      step={5}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                )}
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Alert severity="info" icon={<TrendingUpIcon />}>
                These parameters will be applied to all new trading positions.
                Existing positions will not be affected.
              </Alert>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                onClick={() => {
                  // Save risk parameters to store
                  console.log('Risk parameters saved:', riskParams);
                }}
              >
                Save Risk Parameters
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Risk Warnings */}
        <Grid item xs={12}>
          <Alert
            severity="warning"
            icon={<WarningIcon />}
            sx={{ mt: 2 }}
          >
            Your current risk profile suggests a maximum position size of{' '}
            {riskParams.maxPositionSize}% of your account balance. Make sure to
            always follow proper risk management guidelines.
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
});

export default RiskManagement;
