import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
  Divider,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/RootStoreContext';
import { StrategyConfig, Condition } from '../../services/AlgoTradingService';

const AVAILABLE_INDICATORS = [
  'PRICE',
  'SMA',
  'EMA',
  'RSI',
  'MACD',
  'BOLLINGER_BANDS',
  'VOLUME',
];

const OPERATORS = [
  'GREATER_THAN',
  'LESS_THAN',
  'EQUALS',
  'CROSSES_ABOVE',
  'CROSSES_BELOW',
];

const TIMEFRAMES = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];

interface ConditionBuilderProps {
  conditions: Condition[];
  onChange: (conditions: Condition[]) => void;
  title: string;
}

const ConditionBuilder: React.FC<ConditionBuilderProps> = ({
  conditions,
  onChange,
  title,
}) => {
  const theme = useTheme();

  const handleAddCondition = () => {
    onChange([
      ...conditions,
      { indicator: 'PRICE', operator: 'GREATER_THAN', value: 0 },
    ]);
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    onChange(newConditions);
  };

  const handleConditionChange = (
    index: number,
    field: keyof Condition,
    value: string | number
  ) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    onChange(newConditions);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <IconButton
          size="small"
          onClick={handleAddCondition}
          sx={{ ml: 1, color: theme.palette.primary.main }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      {conditions.map((condition, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            gap: 2,
            mb: 2,
            alignItems: 'center',
            p: 2,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
          }}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Indicator</InputLabel>
            <Select
              value={condition.indicator}
              label="Indicator"
              onChange={(e) =>
                handleConditionChange(index, 'indicator', e.target.value)
              }
            >
              {AVAILABLE_INDICATORS.map((ind) => (
                <MenuItem key={ind} value={ind}>
                  {ind}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Operator</InputLabel>
            <Select
              value={condition.operator}
              label="Operator"
              onChange={(e) =>
                handleConditionChange(index, 'operator', e.target.value)
              }
            >
              {OPERATORS.map((op) => (
                <MenuItem key={op} value={op}>
                  {op.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Value"
            type="number"
            value={condition.value}
            onChange={(e) =>
              handleConditionChange(index, 'value', parseFloat(e.target.value))
            }
            sx={{ width: 100 }}
          />

          <IconButton
            size="small"
            onClick={() => handleRemoveCondition(index)}
            sx={{ color: theme.palette.error.main }}
          >
            <RemoveIcon />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
};

export const StrategyBuilder: React.FC = observer(() => {
  const theme = useTheme();
  const { algoTradingStore } = useRootStore();
  const [symbol, setSymbol] = useState('');
  const [timeframe, setTimeframe] = useState('5m');
  const [entryConditions, setEntryConditions] = useState<Condition[]>([]);
  const [exitConditions, setExitConditions] = useState<Condition[]>([]);
  const [riskParams, setRiskParams] = useState({
    maxPositionSize: 1000,
    stopLoss: 1,
    takeProfit: 2,
    trailingStop: 0.5,
  });

  const handleStartStrategy = () => {
    const config: StrategyConfig = {
      symbol,
      entryConditions,
      exitConditions,
      riskManagement: riskParams,
    };

    try {
      algoTradingStore.startStrategy(config);
    } catch (error) {
      console.error('Failed to start strategy:', error);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Strategy Builder
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Basic Settings
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Timeframe</InputLabel>
                  <Select
                    value={timeframe}
                    label="Timeframe"
                    onChange={(e) => setTimeframe(e.target.value)}
                  >
                    {TIMEFRAMES.map((tf) => (
                      <MenuItem key={tf} value={tf}>
                        {tf}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 3 }} />

          <ConditionBuilder
            conditions={entryConditions}
            onChange={setEntryConditions}
            title="Entry Conditions"
          />

          <ConditionBuilder
            conditions={exitConditions}
            onChange={setExitConditions}
            title="Exit Conditions"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Risk Management
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Max Position Size"
                type="number"
                value={riskParams.maxPositionSize}
                onChange={(e) =>
                  setRiskParams({
                    ...riskParams,
                    maxPositionSize: parseFloat(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stop Loss (%)"
                type="number"
                value={riskParams.stopLoss}
                onChange={(e) =>
                  setRiskParams({
                    ...riskParams,
                    stopLoss: parseFloat(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Take Profit (%)"
                type="number"
                value={riskParams.takeProfit}
                onChange={(e) =>
                  setRiskParams({
                    ...riskParams,
                    takeProfit: parseFloat(e.target.value),
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Trailing Stop (%)"
                type="number"
                value={riskParams.trailingStop}
                onChange={(e) =>
                  setRiskParams({
                    ...riskParams,
                    trailingStop: parseFloat(e.target.value),
                  })
                }
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Strategy Summary
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Chip
                label={`Symbol: ${symbol || 'Not Set'}`}
                color={symbol ? 'primary' : 'default'}
              />
              <Chip
                label={`Timeframe: ${timeframe}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`Entry Conditions: ${entryConditions.length}`}
                color={entryConditions.length > 0 ? 'success' : 'default'}
              />
              <Chip
                label={`Exit Conditions: ${exitConditions.length}`}
                color={exitConditions.length > 0 ? 'success' : 'default'}
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={handleStartStrategy}
            disabled={!symbol || entryConditions.length === 0}
            fullWidth
            sx={{ mt: 2 }}
          >
            Start Strategy
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
});

export default StrategyBuilder;
