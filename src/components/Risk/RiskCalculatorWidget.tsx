import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Slider,
  Button,
  IconButton,
  Tooltip,
  Grid,
  useTheme,
  InputAdornment,
} from '@mui/material';
import {
  Calculate,
  Warning,
  Info,
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import NumberTicker from '@components/Common/NumberTicker';

interface RiskCalculation {
  positionSize: number;
  pipValue: number;
  potentialLoss: number;
  potentialProfit: number;
  marginRequired: number;
  riskRewardRatio: number;
  marginLevel: number;
}

const RiskCalculatorWidget: React.FC = observer(() => {
  const theme = useTheme();
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [riskPercentage, setRiskPercentage] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(1.1000);
  const [stopLoss, setStopLoss] = useState<number>(1.0950);
  const [takeProfit, setTakeProfit] = useState<number>(1.1100);
  const [leverage, setLeverage] = useState<number>(20);
  const [calculation, setCalculation] = useState<RiskCalculation | null>(null);

  useEffect(() => {
    calculateRisk();
  }, [accountBalance, riskPercentage, entryPrice, stopLoss, takeProfit, leverage]);

  const calculateRisk = () => {
    const riskAmount = accountBalance * (riskPercentage / 100);
    const pipSize = 0.0001;
    const pipsToSL = Math.abs(entryPrice - stopLoss) / pipSize;
    const pipsToTP = Math.abs(takeProfit - entryPrice) / pipSize;
    
    const pipValue = riskAmount / pipsToSL;
    const positionSize = (pipValue * 10000) / (entryPrice * pipSize);
    const potentialLoss = riskAmount;
    const potentialProfit = (pipValue * pipsToTP);
    const marginRequired = (positionSize * entryPrice) / leverage;
    const riskRewardRatio = potentialProfit / potentialLoss;
    const marginLevel = (accountBalance / marginRequired) * 100;

    setCalculation({
      positionSize,
      pipValue,
      potentialLoss,
      potentialProfit,
      marginRequired,
      riskRewardRatio,
      marginLevel,
    });
  };

  const getRiskLevel = () => {
    if (!calculation) return 'low';
    if (riskPercentage > 3) return 'high';
    if (calculation.marginLevel < 150) return 'high';
    if (calculation.riskRewardRatio < 1) return 'high';
    if (riskPercentage > 2) return 'medium';
    if (calculation.marginLevel < 200) return 'medium';
    return 'low';
  };

  const riskLevel = getRiskLevel();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ 
            background: 'linear-gradient(45deg, #fff, rgba(255,255,255,0.8))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 600,
          }}>
            Risk Calculator
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {riskLevel !== 'low' && (
              <Tooltip title={`Risk Level: ${riskLevel.toUpperCase()}`}>
                <Warning 
                  sx={{ 
                    color: riskLevel === 'high' 
                      ? theme.palette.error.main 
                      : theme.palette.warning.main 
                  }} 
                />
              </Tooltip>
            )}
            <IconButton size="small" onClick={calculateRisk}>
              <Calculate fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flex: 1, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Account Balance"
              type="number"
              value={accountBalance}
              onChange={(e) => setAccountBalance(Number(e.target.value))}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" gutterBottom>
                Risk Percentage: {riskPercentage}%
              </Typography>
              <Slider
                value={riskPercentage}
                onChange={(_, value) => setRiskPercentage(value as number)}
                min={0.1}
                max={5}
                step={0.1}
                valueLabelDisplay="auto"
                sx={{
                  '& .MuiSlider-thumb': {
                    backgroundColor: riskLevel === 'high' 
                      ? theme.palette.error.main 
                      : riskLevel === 'medium'
                      ? theme.palette.warning.main
                      : theme.palette.primary.main,
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: riskLevel === 'high'
                      ? theme.palette.error.main
                      : riskLevel === 'medium'
                      ? theme.palette.warning.main
                      : theme.palette.primary.main,
                  },
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Entry"
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(Number(e.target.value))}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Stop"
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  fullWidth
                  error={stopLoss >= entryPrice}
                  size="small"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Take"
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(Number(e.target.value))}
                  fullWidth
                  error={takeProfit <= entryPrice}
                  size="small"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {calculation && (
          <Box sx={{ 
            p: 2, 
            borderRadius: 1,
            background: theme.palette.glass.background,
          }}>
            <Typography variant="subtitle2" gutterBottom>
              Calculation Results
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Position Size
                </Typography>
                <NumberTicker
                  value={calculation.positionSize}
                  precision={0}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Pip Value
                </Typography>
                <NumberTicker
                  value={calculation.pipValue}
                  prefix="$"
                  precision={2}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Potential Loss
                </Typography>
                <NumberTicker
                  value={calculation.potentialLoss}
                  prefix="$"
                  precision={2}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Potential Profit
                </Typography>
                <NumberTicker
                  value={calculation.potentialProfit}
                  prefix="$"
                  precision={2}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Risk/Reward Ratio
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: calculation.riskRewardRatio >= 2 
                      ? theme.palette.trading.profit
                      : theme.palette.trading.loss,
                  }}
                >
                  1:{calculation.riskRewardRatio.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary">
                  Margin Level
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    color: calculation.marginLevel < 150
                      ? theme.palette.trading.loss
                      : calculation.marginLevel < 200
                      ? theme.palette.warning.main
                      : theme.palette.trading.profit,
                  }}
                >
                  {calculation.marginLevel.toFixed(1)}%
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Card>
  );
});

export default RiskCalculatorWidget;
