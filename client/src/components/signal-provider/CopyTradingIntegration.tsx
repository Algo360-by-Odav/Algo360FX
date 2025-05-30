import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
  Alert,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  AccountBalance,
  Sync,
  Calculate,
  Security,
  Info,
  Add,
  Delete,
  Check,
  Warning,
} from '@mui/icons-material';
import { useStores } from '../../stores/storeProviderJs';

export const CopyTradingIntegration = observer(() => {
  const { signalProviderStore } = useStores();
  const providers = signalProviderStore.getProviders();
  
  // State for MT5 account connection
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [mt5Accounts, setMt5Accounts] = useState<any[]>([
    { id: 1, name: 'MT5 Demo Account', server: 'Demo Server', balance: 10000, leverage: '1:100', connected: false },
    { id: 2, name: 'MT5 Real Account', server: 'Live Server', balance: 5000, leverage: '1:30', connected: false }
  ]);
  const [selectedAccount, setSelectedAccount] = useState<number | ''>('');
  
  // State for risk management settings
  const [riskPerTrade, setRiskPerTrade] = useState(2);
  const [maxOpenTrades, setMaxOpenTrades] = useState(5);
  const [maxDailyRisk, setMaxDailyRisk] = useState(5);
  const [autoAdjustPosition, setAutoAdjustPosition] = useState(true);
  const [delaySeconds, setDelaySeconds] = useState(0);
  
  // State for position sizing calculator
  const [accountBalance, setAccountBalance] = useState(10000);
  const [riskAmount, setRiskAmount] = useState(200);
  const [riskPercent, setRiskPercent] = useState(2);
  const [stopLossPips, setStopLossPips] = useState(50);
  const [lotSize, setLotSize] = useState(0.4);
  const [calculatorDialogOpen, setCalculatorDialogOpen] = useState(false);
  
  // Handle account selection
  const handleAccountSelection = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedAccount(event.target.value as number);
  };
  
  // Handle connect to MT5
  const handleConnectMT5 = () => {
    if (selectedAccount === '') return;
    
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      
      // Update connected account
      setMt5Accounts(accounts => 
        accounts.map(account => 
          account.id === selectedAccount 
            ? { ...account, connected: true } 
            : { ...account, connected: false }
        )
      );
      
      // Update account balance based on selected account
      const account = mt5Accounts.find(acc => acc.id === selectedAccount);
      if (account) {
        setAccountBalance(account.balance);
      }
    }, 2000);
  };
  
  // Handle disconnect from MT5
  const handleDisconnectMT5 = () => {
    setIsConnected(false);
    
    // Update connected status
    setMt5Accounts(accounts => 
      accounts.map(account => ({ ...account, connected: false }))
    );
  };
  
  // Handle risk per trade change
  const handleRiskPerTradeChange = (event: Event, newValue: number | number[]) => {
    setRiskPerTrade(newValue as number);
    // Update risk amount based on percentage
    setRiskAmount((accountBalance * (newValue as number)) / 100);
  };
  
  // Handle risk amount change
  const handleRiskAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setRiskAmount(value);
      // Update risk percentage based on amount
      setRiskPercent((value / accountBalance) * 100);
    }
  };
  
  // Handle stop loss pips change
  const handleStopLossPipsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setStopLossPips(value);
      // Calculate lot size based on risk amount and stop loss
      calculateLotSize(value, riskAmount);
    }
  };
  
  // Calculate lot size based on risk amount and stop loss pips
  const calculateLotSize = (pips: number, risk: number) => {
    // Basic formula: Lot Size = Risk Amount / (Stop Loss in Pips * Pip Value)
    // For simplicity, assuming EUR/USD with pip value of $10 per standard lot
    const pipValue = 10; // $10 per standard lot (100,000 units)
    const calculatedLotSize = risk / (pips * pipValue);
    setLotSize(parseFloat(calculatedLotSize.toFixed(2)));
  };
  
  // Open calculator dialog
  const handleOpenCalculator = () => {
    setCalculatorDialogOpen(true);
  };
  
  // Close calculator dialog
  const handleCloseCalculator = () => {
    setCalculatorDialogOpen(false);
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        {/* MT5 Account Connection */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalance sx={{ mr: 1 }} />
                MT5 Account Connection
              </Typography>
              
              {isConnected ? (
                <Box>
                  <Alert severity="success" sx={{ mb: 2 }}>
                    Successfully connected to MT5 account
                  </Alert>
                  
                  {mt5Accounts.map(account => 
                    account.connected && (
                      <Paper key={account.id} sx={{ p: 2, mb: 2 }}>
                        <Typography variant="subtitle1">{account.name}</Typography>
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Server</Typography>
                            <Typography variant="body1">{account.server}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Balance</Typography>
                            <Typography variant="body1">${account.balance.toLocaleString()}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Leverage</Typography>
                            <Typography variant="body1">{account.leverage}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Status</Typography>
                            <Typography variant="body1" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                              <Check fontSize="small" sx={{ mr: 0.5 }} />
                              Connected
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    )
                  )}
                  
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleDisconnectMT5}
                    startIcon={<Sync />}
                    fullWidth
                  >
                    Disconnect Account
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Connect your MT5 account to enable automated copy trading
                  </Alert>
                  
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Select MT5 Account</InputLabel>
                    <Select
                      value={selectedAccount}
                      label="Select MT5 Account"
                      onChange={handleAccountSelection}
                    >
                      {mt5Accounts.map(account => (
                        <MenuItem key={account.id} value={account.id}>
                          {account.name} - ${account.balance.toLocaleString()}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConnectMT5}
                    disabled={selectedAccount === '' || isConnecting}
                    startIcon={isConnecting ? <CircularProgress size={20} /> : <Sync />}
                    fullWidth
                  >
                    {isConnecting ? 'Connecting...' : 'Connect to MT5'}
                  </Button>
                  
                  <Button
                    variant="text"
                    sx={{ mt: 1 }}
                    fullWidth
                  >
                    Add New MT5 Account
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Risk Management */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Security sx={{ mr: 1 }} />
                Risk Management Settings
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">Risk Per Trade</Typography>
                  <Typography variant="body2">{riskPerTrade}%</Typography>
                </Box>
                <Slider
                  value={riskPerTrade}
                  onChange={handleRiskPerTradeChange}
                  aria-labelledby="risk-per-trade-slider"
                  valueLabelDisplay="auto"
                  step={0.1}
                  marks
                  min={0.1}
                  max={10}
                  disabled={!isConnected}
                />
                <Typography variant="caption" color="text.secondary">
                  ${(accountBalance * riskPerTrade / 100).toFixed(2)} per trade
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">Maximum Open Trades</Typography>
                  <Typography variant="body2">{maxOpenTrades}</Typography>
                </Box>
                <Slider
                  value={maxOpenTrades}
                  onChange={(event, newValue) => setMaxOpenTrades(newValue as number)}
                  aria-labelledby="max-open-trades-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={20}
                  disabled={!isConnected}
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">Maximum Daily Risk</Typography>
                  <Typography variant="body2">{maxDailyRisk}%</Typography>
                </Box>
                <Slider
                  value={maxDailyRisk}
                  onChange={(event, newValue) => setMaxDailyRisk(newValue as number)}
                  aria-labelledby="max-daily-risk-slider"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={1}
                  max={20}
                  disabled={!isConnected}
                />
                <Typography variant="caption" color="text.secondary">
                  Trading will pause if daily losses exceed ${(accountBalance * maxDailyRisk / 100).toFixed(2)}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoAdjustPosition}
                      onChange={(event) => setAutoAdjustPosition(event.target.checked)}
                      disabled={!isConnected}
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2">Auto-adjust position sizes</Typography>
                      <Tooltip title="Automatically adjusts position sizes based on your account balance and risk settings">
                        <IconButton size="small">
                          <Info fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>Signal Execution Delay (seconds)</Typography>
                <TextField
                  type="number"
                  value={delaySeconds}
                  onChange={(event) => setDelaySeconds(parseInt(event.target.value))}
                  InputProps={{
                    inputProps: { min: 0, max: 300 }
                  }}
                  size="small"
                  disabled={!isConnected}
                />
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                  Add delay before executing signals (0 = immediate)
                </Typography>
              </Box>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                disabled={!isConnected}
                sx={{ mt: 2 }}
              >
                Save Risk Settings
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Position Sizing Calculator */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <Calculate sx={{ mr: 1 }} />
                  Position Sizing Calculator
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Calculate />}
                  onClick={handleOpenCalculator}
                >
                  Open Calculator
                </Button>
              </Box>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                Use the position sizing calculator to determine the optimal lot size based on your risk tolerance and stop loss levels.
              </Alert>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Account Balance"
                    type="number"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(parseFloat(e.target.value))}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Risk Amount"
                    type="number"
                    value={riskAmount}
                    onChange={handleRiskAmountChange}
                    fullWidth
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Stop Loss (Pips)"
                    type="number"
                    value={stopLossPips}
                    onChange={handleStopLossPipsChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    label="Calculated Lot Size"
                    type="number"
                    value={lotSize}
                    InputProps={{
                      readOnly: true,
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Risk: {riskPercent.toFixed(2)}% of account
                </Typography>
                <Box
                  sx={{
                    ml: 2,
                    height: 8,
                    width: 100,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${Math.min(riskPercent * 10, 100)}%`,
                      borderRadius: 4,
                      bgcolor: riskPercent <= 2 ? 'success.main' : riskPercent <= 5 ? 'warning.main' : 'error.main',
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Active Copy Trading */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Active Copy Trading
              </Typography>
              
              {!isConnected ? (
                <Alert severity="warning">
                  Connect your MT5 account to enable copy trading
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  {providers.map(provider => (
                    <Grid item xs={12} sm={6} md={4} key={provider.id}>
                      <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1">{provider.name}</Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                size="small"
                                checked={false}
                              />
                            }
                            label=""
                          />
                        </Box>
                        
                        <Grid container spacing={1} sx={{ mb: 1 }}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Win Rate</Typography>
                            <Typography variant="body2">{provider.performance.winRate}%</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Risk Level</Typography>
                            <Typography variant="body2">{provider.risk.riskLevel}</Typography>
                          </Grid>
                        </Grid>
                        
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                        >
                          Configure
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Position Sizing Calculator Dialog */}
      <Dialog open={calculatorDialogOpen} onClose={handleCloseCalculator} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Calculate sx={{ mr: 1 }} />
            Advanced Position Sizing Calculator
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Account Information
              </Typography>
              <TextField
                label="Account Balance"
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(parseFloat(e.target.value))}
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <TextField
                label="Account Currency"
                value="USD"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Leverage"
                value="1:100"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Risk Parameters
              </Typography>
              <TextField
                label="Risk Percentage"
                type="number"
                value={riskPercent}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setRiskPercent(value);
                  setRiskAmount((accountBalance * value) / 100);
                }}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { min: 0.1, max: 10, step: 0.1 }
                }}
              />
              <TextField
                label="Risk Amount"
                type="number"
                value={riskAmount}
                onChange={handleRiskAmountChange}
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <Alert 
                severity={riskPercent <= 2 ? "success" : riskPercent <= 5 ? "warning" : "error"}
                sx={{ mt: 2 }}
              >
                {riskPercent <= 2 
                  ? "Conservative risk level (recommended)" 
                  : riskPercent <= 5 
                    ? "Moderate risk level" 
                    : "High risk level (not recommended)"}
              </Alert>
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Trade Information
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Currency Pair</InputLabel>
                <Select
                  value="EURUSD"
                  label="Currency Pair"
                >
                  <MenuItem value="EURUSD">EUR/USD</MenuItem>
                  <MenuItem value="GBPUSD">GBP/USD</MenuItem>
                  <MenuItem value="USDJPY">USD/JPY</MenuItem>
                  <MenuItem value="AUDUSD">AUD/USD</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Entry Price"
                type="number"
                value={1.0921}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Stop Loss Price"
                type="number"
                value={1.0871}
                fullWidth
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Position Sizing
              </Typography>
              <TextField
                label="Stop Loss (Pips)"
                type="number"
                value={stopLossPips}
                onChange={handleStopLossPipsChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Calculated Lot Size"
                type="number"
                value={lotSize}
                InputProps={{
                  readOnly: true,
                }}
                fullWidth
                margin="normal"
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Potential Loss: ${(lotSize * stopLossPips * 10).toFixed(2)}
                </Typography>
                <Typography variant="body2">
                  Margin Required: ${(lotSize * 1000).toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCalculator}>Close</Button>
          <Button variant="contained" color="primary">
            Apply to Trade
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default CopyTradingIntegration;
