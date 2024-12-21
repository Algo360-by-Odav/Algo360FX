import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import { Position } from '../../types/trading';
import { useStore } from '../../hooks/useStore';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface PositionSizerProps {
  initialPosition?: Position | null;
  onSave: (position: Position) => void;
}

const PositionSizer: React.FC<PositionSizerProps> = ({
  initialPosition,
  onSave,
}) => {
  const { riskManagementStore, portfolioStore } = useStore();
  const [position, setPosition] = React.useState<Partial<Position>>(
    initialPosition || {
      symbol: '',
      quantity: 0,
      entryPrice: 0,
      stopLoss: 0,
      targetPrice: 0,
    }
  );

  // Calculate position metrics
  const calculations = React.useMemo(() => {
    if (!position.entryPrice || !position.stopLoss) return null;

    const accountSize = portfolioStore.getTotalValue();
    const riskPerTrade = riskManagementStore.getRiskPerTrade();
    const riskAmount = accountSize * (riskPerTrade / 100);

    const priceDiff = Math.abs(
      Number(position.entryPrice) - Number(position.stopLoss)
    );
    const quantity = Math.floor(riskAmount / priceDiff);

    const positionSize = quantity * Number(position.entryPrice);
    const maxLoss = quantity * priceDiff;

    let maxGain = 0;
    let riskRewardRatio = 0;
    if (position.targetPrice) {
      const gainPriceDiff = Math.abs(
        Number(position.targetPrice) - Number(position.entryPrice)
      );
      maxGain = quantity * gainPriceDiff;
      riskRewardRatio = maxGain / maxLoss;
    }

    return {
      recommendedQuantity: quantity,
      positionSize,
      maxLoss,
      maxGain,
      riskRewardRatio,
      portfolioWeight: (positionSize / accountSize) * 100,
    };
  }, [
    position.entryPrice,
    position.stopLoss,
    position.targetPrice,
    portfolioStore,
    riskManagementStore,
  ]);

  const handleChange = (field: keyof Position, value: number | string) => {
    setPosition((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (calculations) {
      const newPosition: Position = {
        id: initialPosition?.id || Date.now().toString(),
        symbol: position.symbol!,
        quantity: position.quantity || calculations.recommendedQuantity,
        entryPrice: Number(position.entryPrice),
        currentPrice: Number(position.entryPrice),
        stopLoss: Number(position.stopLoss),
        targetPrice: position.targetPrice
          ? Number(position.targetPrice)
          : undefined,
        marketValue:
          (position.quantity || calculations.recommendedQuantity) *
          Number(position.entryPrice),
        unrealizedPnL: 0,
        unrealizedPnLPercent: 0,
        weight: calculations.portfolioWeight,
      };
      onSave(newPosition);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Position Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Position Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Symbol</InputLabel>
                  <Select
                    value={position.symbol}
                    label="Symbol"
                    onChange={(e) => handleChange('symbol', e.target.value)}
                  >
                    <MenuItem value="EUR/USD">EUR/USD</MenuItem>
                    <MenuItem value="GBP/USD">GBP/USD</MenuItem>
                    <MenuItem value="USD/JPY">USD/JPY</MenuItem>
                    <MenuItem value="USD/CHF">USD/CHF</MenuItem>
                    <MenuItem value="AUD/USD">AUD/USD</MenuItem>
                    <MenuItem value="NZD/USD">NZD/USD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Entry Price"
                  type="number"
                  value={position.entryPrice || ''}
                  onChange={(e) =>
                    handleChange('entryPrice', Number(e.target.value))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Stop Loss"
                  type="number"
                  value={position.stopLoss || ''}
                  onChange={(e) =>
                    handleChange('stopLoss', Number(e.target.value))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Target Price"
                  type="number"
                  value={position.targetPrice || ''}
                  onChange={(e) =>
                    handleChange('targetPrice', Number(e.target.value))
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quantity (Optional)"
                  type="number"
                  value={position.quantity || ''}
                  onChange={(e) =>
                    handleChange('quantity', Number(e.target.value))
                  }
                  helperText="Leave empty to use recommended quantity"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Position Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Position Analysis
            </Typography>
            {calculations ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Alert severity="info">
                    Recommended Quantity: {calculations.recommendedQuantity}
                  </Alert>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" gutterBottom>
                    Position Size
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(calculations.positionSize)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" gutterBottom>
                    Portfolio Weight
                  </Typography>
                  <Typography variant="h6">
                    {formatPercentage(calculations.portfolioWeight)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" gutterBottom>
                    Maximum Loss
                  </Typography>
                  <Typography variant="h6" color="error">
                    {formatCurrency(calculations.maxLoss)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary" gutterBottom>
                    Maximum Gain
                  </Typography>
                  <Typography variant="h6" color="success.main">
                    {formatCurrency(calculations.maxGain)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography color="text.secondary" gutterBottom>
                    Risk/Reward Ratio
                  </Typography>
                  <Typography variant="h6">
                    1:{calculations.riskRewardRatio.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Alert severity="warning">
                Please enter entry price and stop loss to see position analysis
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={!calculations}
            >
              {initialPosition ? 'Update Position' : 'Add Position'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PositionSizer;
