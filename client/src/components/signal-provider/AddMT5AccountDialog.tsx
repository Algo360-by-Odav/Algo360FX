import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Alert,
  Box,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { AccountBalance, Check } from '@mui/icons-material';

interface AddMT5AccountDialogProps {
  open: boolean;
  onClose: () => void;
  onAddAccount: (account: any) => void;
}

const AddMT5AccountDialog = ({ open, onClose, onAddAccount }: AddMT5AccountDialogProps) => {
  // State for form fields
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [server, setServer] = useState('');
  const [accountType, setAccountType] = useState('demo');
  
  // State for stepper
  const [activeStep, setActiveStep] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Steps for the account connection process
  const steps = ['Account Details', 'Verify Connection', 'Configure Settings'];
  
  // Handle form submission
  const handleSubmit = () => {
    if (activeStep === 0) {
      // Validate form
      if (!accountName || !accountNumber || !password || !server) {
        setErrorMessage('Please fill in all required fields');
        return;
      }
      
      // Move to next step
      setErrorMessage('');
      setActiveStep(1);
    } else if (activeStep === 1) {
      // Simulate connection attempt
      setIsConnecting(true);
      setErrorMessage('');
      
      // Simulate API call with timeout
      setTimeout(() => {
        setIsConnecting(false);
        
        // For demo purposes, consider connection successful if account number is valid format
        const isValid = /^\d{6,8}$/.test(accountNumber);
        
        if (isValid) {
          setConnectionSuccess(true);
          setActiveStep(2);
        } else {
          setErrorMessage('Connection failed. Please check your account details and try again.');
        }
      }, 2000);
    } else if (activeStep === 2) {
      // Create new account object
      const newAccount = {
        id: Date.now(),
        name: accountName,
        number: accountNumber,
        server: server,
        type: accountType,
        balance: accountType === 'demo' ? 10000 : 5000,
        leverage: accountType === 'demo' ? '1:500' : '1:100',
        connected: true,
      };
      
      // Add account
      onAddAccount(newAccount);
      
      // Reset form and close dialog
      resetForm();
      onClose();
    }
  };
  
  // Handle back button
  const handleBack = () => {
    if (activeStep === 0) {
      resetForm();
      onClose();
    } else {
      setActiveStep(activeStep - 1);
      setConnectionSuccess(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setAccountName('');
    setAccountNumber('');
    setPassword('');
    setServer('');
    setAccountType('demo');
    setActiveStep(0);
    setIsConnecting(false);
    setConnectionSuccess(false);
    setErrorMessage('');
  };
  
  // Available MT5 servers
  const servers = [
    'MetaQuotes-Demo',
    'ICMarkets-Live01',
    'ICMarkets-Live02',
    'FXCM-Demo',
    'FXCM-Live',
    'Pepperstone-Demo',
    'Pepperstone-Live',
    'XM-Demo',
    'XM-Live',
  ];
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccountBalance sx={{ mr: 1 }} />
          Add New MT5 Account
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}
        
        {activeStep === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Enter your MT5 account details
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                You can find these details in your MT5 platform or in the email from your broker.
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Name"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                fullWidth
                required
                placeholder="My Trading Account"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={accountType}
                  label="Account Type"
                  onChange={(e) => setAccountType(e.target.value)}
                >
                  <MenuItem value="demo">Demo Account</MenuItem>
                  <MenuItem value="real">Real Account</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                fullWidth
                required
                placeholder="12345678"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
                placeholder="Your MT5 password"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Server</InputLabel>
                <Select
                  value={server}
                  label="Server"
                  onChange={(e) => setServer(e.target.value)}
                >
                  {servers.map((serverName) => (
                    <MenuItem key={serverName} value={serverName}>
                      {serverName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}
        
        {activeStep === 1 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            {isConnecting ? (
              <>
                <CircularProgress size={60} sx={{ mb: 3 }} />
                <Typography variant="h6" gutterBottom>
                  Connecting to MT5 Server
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Attempting to establish connection to {server}...
                </Typography>
              </>
            ) : connectionSuccess ? (
              <>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    mb: 3,
                  }}
                >
                  <Check sx={{ color: 'white', fontSize: 40 }} />
                </Box>
                <Typography variant="h6" gutterBottom>
                  Connection Successful!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your MT5 account has been successfully verified.
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" gutterBottom>
                  Verify MT5 Connection
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Click "Connect" to verify your MT5 account details. This will attempt to establish a connection to your broker's server.
                </Typography>
                <Alert severity="info" sx={{ mb: 2, textAlign: 'left' }}>
                  <Typography variant="body2">
                    <strong>Account:</strong> {accountNumber} ({accountType})
                  </Typography>
                  <Typography variant="body2">
                    <strong>Server:</strong> {server}
                  </Typography>
                </Alert>
              </>
            )}
          </Box>
        )}
        
        {activeStep === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Configure Trading Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Set up how you want to copy trades to this MT5 account.
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Default Lot Size"
                type="number"
                defaultValue="0.01"
                fullWidth
                InputProps={{
                  inputProps: { min: 0.01, step: 0.01 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Maximum Risk Per Trade (%)"
                type="number"
                defaultValue="2"
                fullWidth
                InputProps={{
                  inputProps: { min: 0.1, max: 10, step: 0.1 }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Your account is ready to be connected. Click "Finish" to add this account and start copy trading.
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleBack}>
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} color="inherit" />
              Connecting...
            </>
          ) : activeStep === 0 ? (
            'Next'
          ) : activeStep === 1 ? (
            connectionSuccess ? 'Next' : 'Connect'
          ) : (
            'Finish'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMT5AccountDialog;
