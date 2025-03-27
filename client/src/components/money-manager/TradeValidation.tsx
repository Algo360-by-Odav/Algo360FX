import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  TextField,
  Typography,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { useStores } from '../../stores/StoreProvider';

export const TradeValidation = observer(() => {
  const stores = useStores();
  const { moneyManagerStore } = stores;
  const [formData, setFormData] = useState({
    symbol: '',
    orderType: 'buy',
    size: '',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
  });
  const [validation, setValidation] = useState<{
    isValid: boolean;
    reasons: string[];
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (e: any) => {
    setFormData(prev => ({ ...prev, [name]: e.target.value }));
  };

  const handleValidate = () => {
    const result = moneyManagerStore.validateTrade(
      formData.symbol,
      formData.orderType as 'buy' | 'sell',
      parseFloat(formData.size),
      parseFloat(formData.entryPrice),
      formData.stopLoss ? parseFloat(formData.stopLoss) : null,
      formData.takeProfit ? parseFloat(formData.takeProfit) : null
    );
    setValidation(result);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Trade Validation
      </Typography>
      <Grid container spacing={3}>
        {/* Input Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Symbol</InputLabel>
                  <Select
                    value={formData.symbol}
                    label="Symbol"
                    onChange={handleSelectChange('symbol')}
                  >
                    <MenuItem value="EURUSD">EUR/USD</MenuItem>
                    <MenuItem value="GBPUSD">GBP/USD</MenuItem>
                    <MenuItem value="USDJPY">USD/JPY</MenuItem>
                    <MenuItem value="AUDUSD">AUD/USD</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Order Type</InputLabel>
                  <Select
                    value={formData.orderType}
                    label="Order Type"
                    onChange={handleSelectChange('orderType')}
                  >
                    <MenuItem value="buy">
                      <Box display="flex" alignItems="center">
                        <ArrowUpward color="success" sx={{ mr: 1 }} />
                        Buy
                      </Box>
                    </MenuItem>
                    <MenuItem value="sell">
                      <Box display="flex" alignItems="center">
                        <ArrowDownward color="error" sx={{ mr: 1 }} />
                        Sell
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Position Size (units)"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  type="number"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Entry Price"
                  name="entryPrice"
                  value={formData.entryPrice}
                  onChange={handleInputChange}
                  type="number"
                  inputProps={{ step: "0.00001" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Stop Loss"
                  name="stopLoss"
                  value={formData.stopLoss}
                  onChange={handleInputChange}
                  type="number"
                  inputProps={{ step: "0.00001" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Take Profit"
                  name="takeProfit"
                  value={formData.takeProfit}
                  onChange={handleInputChange}
                  type="number"
                  inputProps={{ step: "0.00001" }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleValidate}
                >
                  Validate Trade
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Validation Results */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Validation Results
            </Typography>
            {validation && (
              <Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <Chip
                    icon={validation.isValid ? <CheckCircle /> : <Error />}
                    label={validation.isValid ? 'Trade Validated' : 'Validation Failed'}
                    color={validation.isValid ? 'success' : 'error'}
                    variant="outlined"
                  />
                </Box>
                {validation.reasons.length > 0 && (
                  <List>
                    {validation.reasons.map((reason, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <Error color="error" />
                        </ListItemIcon>
                        <ListItemText primary={reason} />
                      </ListItem>
                    ))}
                  </List>
                )}
                {validation.isValid && (
                  <Alert severity="success">
                    This trade complies with all risk management parameters
                  </Alert>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

