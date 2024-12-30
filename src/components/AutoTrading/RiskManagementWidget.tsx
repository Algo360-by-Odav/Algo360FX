import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Slider,
  Box,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface RiskSettings {
  maxPositionSize: number;
  maxDailyLoss: number;
  maxDrawdown: number;
  riskPerTrade: number;
  correlationLimit: number;
  maxOpenPositions: number;
  useHedging: boolean;
  useDynamicPositioning: boolean;
}

interface RiskMetrics {
  currentRisk: number;
  dailyPnL: number;
  currentDrawdown: number;
  openPositions: number;
  marginUsage: number;
  riskScore: number;
}

const RiskManagementWidget: React.FC = observer(() => {
  const [settings, setSettings] = useState<RiskSettings>({
    maxPositionSize: 1.0,
    maxDailyLoss: 500,
    maxDrawdown: 20,
    riskPerTrade: 2,
    correlationLimit: 0.7,
    maxOpenPositions: 5,
    useHedging: true,
    useDynamicPositioning: true,
  });

  const [metrics, setMetrics] = useState<RiskMetrics>({
    currentRisk: 15.5,
    dailyPnL: -120,
    currentDrawdown: 8.5,
    openPositions: 3,
    marginUsage: 45,
    riskScore: 72,
  });

  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [positionSize, setPositionSize] = useState({
    accountBalance: 10000,
    riskAmount: 100,
    stopLoss: 50,
  });

  const handleSettingChange = (setting: keyof RiskSettings, value: any) => {
    setSettings({ ...settings, [setting]: value });
  };

  const calculatePositionSize = () => {
    const pipValue = 0.0001; // Example pip value for EURUSD
    const lotSize = (positionSize.riskAmount / (positionSize.stopLoss * pipValue)) / 100000;
    return lotSize.toFixed(2);
  };

  const getRiskLevel = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'error';
    if (percentage >= 50) return 'warning';
    return 'success';
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Risk Management</Typography>
          <Button
            variant="outlined"
            startIcon={<AssessmentIcon />}
            onClick={() => setCalculatorOpen(true)}
          >
            Position Calculator
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Current Risk Metrics */}
          <Grid item xs={12}>
            <Alert
              severity={metrics.riskScore > 80 ? 'error' : metrics.riskScore > 60 ? 'warning' : 'success'}
              icon={<SecurityIcon />}
            >
              Overall Risk Score: {metrics.riskScore}/100
            </Alert>
          </Grid>

          {/* Risk Metrics Display */}
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell align="right">Current</TableCell>
                    <TableCell align="right">Limit</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Daily P&L</TableCell>
                    <TableCell align="right">${metrics.dailyPnL}</TableCell>
                    <TableCell align="right">${-settings.maxDailyLoss}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${(metrics.dailyPnL / -settings.maxDailyLoss * 100).toFixed(1)}%`}
                        color={getRiskLevel(Math.abs(metrics.dailyPnL), settings.maxDailyLoss)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Drawdown</TableCell>
                    <TableCell align="right">{metrics.currentDrawdown}%</TableCell>
                    <TableCell align="right">{settings.maxDrawdown}%</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${(metrics.currentDrawdown / settings.maxDrawdown * 100).toFixed(1)}%`}
                        color={getRiskLevel(metrics.currentDrawdown, settings.maxDrawdown)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Open Positions</TableCell>
                    <TableCell align="right">{metrics.openPositions}</TableCell>
                    <TableCell align="right">{settings.maxOpenPositions}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${(metrics.openPositions / settings.maxOpenPositions * 100).toFixed(1)}%`}
                        color={getRiskLevel(metrics.openPositions, settings.maxOpenPositions)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Margin Usage</TableCell>
                    <TableCell align="right">{metrics.marginUsage}%</TableCell>
                    <TableCell align="right">80%</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={`${(metrics.marginUsage / 80 * 100).toFixed(1)}%`}
                        color={getRiskLevel(metrics.marginUsage, 80)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Risk Settings */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Position Limits
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography gutterBottom>Maximum Position Size (lots)</Typography>
                <Slider
                  value={settings.maxPositionSize}
                  onChange={(_, value) => handleSettingChange('maxPositionSize', value)}
                  min={0.1}
                  max={5}
                  step={0.1}
                  marks={[
                    { value: 0.1, label: '0.1' },
                    { value: 2.5, label: '2.5' },
                    { value: 5, label: '5.0' },
                  ]}
                  valueLabelDisplay="auto"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography gutterBottom>Risk Per Trade (%)</Typography>
                <Slider
                  value={settings.riskPerTrade}
                  onChange={(_, value) => handleSettingChange('riskPerTrade', value)}
                  min={0.5}
                  max={5}
                  step={0.5}
                  marks={[
                    { value: 0.5, label: '0.5%' },
                    { value: 2.5, label: '2.5%' },
                    { value: 5, label: '5%' },
                  ]}
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Advanced Settings */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Advanced Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.useHedging}
                      onChange={(e) => handleSettingChange('useHedging', e.target.checked)}
                    />
                  }
                  label="Enable Hedging"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.useDynamicPositioning}
                      onChange={(e) => handleSettingChange('useDynamicPositioning', e.target.checked)}
                    />
                  }
                  label="Dynamic Position Sizing"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Position Size Calculator Dialog */}
        <Dialog open={calculatorOpen} onClose={() => setCalculatorOpen(false)}>
          <DialogTitle>Position Size Calculator</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Account Balance"
                  type="number"
                  value={positionSize.accountBalance}
                  onChange={(e) => setPositionSize({
                    ...positionSize,
                    accountBalance: parseFloat(e.target.value)
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Risk Amount ($)"
                  type="number"
                  value={positionSize.riskAmount}
                  onChange={(e) => setPositionSize({
                    ...positionSize,
                    riskAmount: parseFloat(e.target.value)
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Stop Loss (pips)"
                  type="number"
                  value={positionSize.stopLoss}
                  onChange={(e) => setPositionSize({
                    ...positionSize,
                    stopLoss: parseFloat(e.target.value)
                  })}
                />
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info">
                  Recommended Position Size: {calculatePositionSize()} lots
                </Alert>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCalculatorOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
});

export default RiskManagementWidget;
