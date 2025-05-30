import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
  Slider,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Add as AddIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface Portfolio {
  totalValue: number;
  totalReturn: number;
  returnPercentage: number;
  riskLevel: string;
  allocations: {
    id: number;
    strategy: string;
    amount: number;
    return: number;
    returnPercentage: number;
  }[];
}

interface NewInvestmentData {
  amount: string;
  strategy: string;
  riskLevel: string;
  duration: string;
  reinvestDividends: boolean;
  leverageLevel: number;
}

const initialInvestmentData: NewInvestmentData = {
  amount: '',
  strategy: '',
  riskLevel: 'moderate',
  duration: '12',
  reinvestDividends: true,
  leverageLevel: 1,
};

export const PortfolioOverview: React.FC = observer(() => {
  const [selectedAllocation, setSelectedAllocation] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newInvestmentOpen, setNewInvestmentOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [newInvestment, setNewInvestment] = useState<NewInvestmentData>(initialInvestmentData);

  // Sample data - replace with actual data from your store
  const portfolio: Portfolio = {
    totalValue: 250000,
    totalReturn: 25000,
    returnPercentage: 10,
    riskLevel: 'Moderate',
    allocations: [
      {
        id: 1,
        strategy: 'Conservative Growth',
        amount: 100000,
        return: 8000,
        returnPercentage: 8,
      },
      {
        id: 2,
        strategy: 'Balanced Income',
        amount: 75000,
        return: 9000,
        returnPercentage: 12,
      },
      {
        id: 3,
        strategy: 'Aggressive Growth',
        amount: 75000,
        return: 8000,
        returnPercentage: 10.67,
      },
    ],
  };

  const handleOpenDialog = (allocation: any) => {
    setSelectedAllocation(allocation);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleNewInvestmentOpen = () => {
    setNewInvestment(initialInvestmentData);
    setActiveStep(0);
    setNewInvestmentOpen(true);
  };

  const handleNewInvestmentClose = () => {
    setNewInvestmentOpen(false);
    setNewInvestment(initialInvestmentData);
    setActiveStep(0);
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateAmount()) {
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateAmount = () => {
    return parseFloat(newInvestment.amount) > 0;
  };

  const handleSubmitInvestment = () => {
    // Handle investment submission
    console.log('New investment:', newInvestment);
    handleNewInvestmentClose();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Investment Amount"
              type="number"
              value={newInvestment.amount}
              onChange={(e) =>
                setNewInvestment({ ...newInvestment, amount: e.target.value })
              }
              error={newInvestment.amount !== '' && !validateAmount()}
              helperText={
                newInvestment.amount !== '' && !validateAmount()
                  ? 'Please enter a valid amount'
                  : ''
              }
              InputProps={{
                startAdornment: '$',
              }}
            />
          </Box>
        );

      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Investment Strategy</InputLabel>
              <Select
                value={newInvestment.strategy}
                onChange={(e) =>
                  setNewInvestment({ ...newInvestment, strategy: e.target.value as string })
                }
              >
                <MenuItem value="conservative">Conservative Growth</MenuItem>
                <MenuItem value="balanced">Balanced Income</MenuItem>
                <MenuItem value="aggressive">Aggressive Growth</MenuItem>
              </Select>
            </FormControl>

            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Risk Level
              </Typography>
              <RadioGroup
                value={newInvestment.riskLevel}
                onChange={(e) =>
                  setNewInvestment({ ...newInvestment, riskLevel: e.target.value })
                }
              >
                <FormControlLabel
                  value="conservative"
                  control={<Radio />}
                  label="Conservative"
                />
                <FormControlLabel
                  value="moderate"
                  control={<Radio />}
                  label="Moderate"
                />
                <FormControlLabel
                  value="aggressive"
                  control={<Radio />}
                  label="Aggressive"
                />
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Investment Duration</InputLabel>
              <Select
                value={newInvestment.duration}
                onChange={(e) =>
                  setNewInvestment({ ...newInvestment, duration: e.target.value as string })
                }
              >
                <MenuItem value="3">3 Months</MenuItem>
                <MenuItem value="6">6 Months</MenuItem>
                <MenuItem value="12">12 Months</MenuItem>
                <MenuItem value="24">24 Months</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={newInvestment.reinvestDividends}
                  onChange={(e) =>
                    setNewInvestment({
                      ...newInvestment,
                      reinvestDividends: e.target.checked,
                    })
                  }
                />
              }
              label="Reinvest Dividends"
            />

            <Box sx={{ mt: 3 }}>
              <Typography gutterBottom>Leverage Level</Typography>
              <Slider
                value={newInvestment.leverageLevel}
                min={1}
                max={5}
                step={1}
                marks
                valueLabelDisplay="auto"
                onChange={(_, value) =>
                  setNewInvestment({
                    ...newInvestment,
                    leverageLevel: value as number,
                  })
                }
              />
              {newInvestment.leverageLevel > 2 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Higher leverage increases both potential returns and risks
                </Alert>
              )}
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Portfolio Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Total Portfolio Value
            </Typography>
            <Typography variant="h4">{formatCurrency(portfolio.totalValue)}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography
                variant="subtitle1"
                color={portfolio.totalReturn >= 0 ? 'success.main' : 'error.main'}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {portfolio.totalReturn >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
                {formatCurrency(portfolio.totalReturn)} ({formatPercent(portfolio.returnPercentage)})
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Risk Level</Typography>
              <Chip label={portfolio.riskLevel} color="primary" />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleNewInvestmentOpen}
                fullWidth
              >
                New Investment
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Portfolio Allocations */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Strategy</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Return</TableCell>
              <TableCell align="right">Return %</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolio.allocations.map((allocation) => (
              <TableRow key={allocation.id}>
                <TableCell>{allocation.strategy}</TableCell>
                <TableCell align="right">{formatCurrency(allocation.amount)}</TableCell>
                <TableCell align="right">{formatCurrency(allocation.return)}</TableCell>
                <TableCell align="right">{formatPercent(allocation.returnPercentage)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenDialog(allocation)}>
                    <InfoIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Allocation Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Investment Details</DialogTitle>
        <DialogContent>
          {selectedAllocation && (
            <Box sx={{ minWidth: 400 }}>
              <Typography variant="h6">{selectedAllocation.strategy}</Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Current Value: {formatCurrency(selectedAllocation.amount)}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Return: {formatCurrency(selectedAllocation.return)} (
                {formatPercent(selectedAllocation.returnPercentage)})
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* New Investment Dialog */}
      <Dialog
        open={newInvestmentOpen}
        onClose={handleNewInvestmentClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>New Investment</DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            <Step>
              <StepLabel>Amount</StepLabel>
            </Step>
            <Step>
              <StepLabel>Strategy</StepLabel>
            </Step>
            <Step>
              <StepLabel>Settings</StepLabel>
            </Step>
          </Stepper>
          {renderStepContent(activeStep)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewInvestmentClose}>Cancel</Button>
          <Box sx={{ flex: '1 1 auto' }} />
          {activeStep > 0 && (
            <Button onClick={handleBack}>Back</Button>
          )}
          {activeStep === 2 ? (
            <Button
              variant="contained"
              onClick={handleSubmitInvestment}
            >
              Submit
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === 0 && !validateAmount()}
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default PortfolioOverview;
