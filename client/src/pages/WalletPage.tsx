import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Button, 
  TextField, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  Alert
} from '@mui/material';
import { 
  AccountBalanceWallet, 
  CreditCard, 
  ReceiptLong,
  SwapHoriz,
  Add,
  ArrowUpward,
  ArrowDownward,
  Refresh,
  InfoOutlined
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Wallet service - would be implemented in services directory
const mockWalletService = {
  getWalletBalance: () => Promise.resolve({ 
    balance: 15000, 
    currency: 'USD',
    availableBalance: 14500,
    pendingDeposits: 500,
    lastUpdated: new Date().toISOString()
  }),
  getTransactions: () => Promise.resolve([
    { id: 1, type: 'deposit', amount: 5000, status: 'completed', date: '2025-05-20T10:30:00Z', description: 'Bank transfer' },
    { id: 2, type: 'withdrawal', amount: 1000, status: 'completed', date: '2025-05-15T14:45:00Z', description: 'Withdrawal to bank account' },
    { id: 3, type: 'deposit', amount: 2000, status: 'pending', date: '2025-05-28T09:15:00Z', description: 'Credit card deposit' },
    { id: 4, type: 'fee', amount: 25, status: 'completed', date: '2025-05-10T16:20:00Z', description: 'Monthly service fee' },
    { id: 5, type: 'transfer', amount: 500, status: 'completed', date: '2025-05-05T11:30:00Z', description: 'Transfer to trading account' },
  ]),
  getPaymentMethods: () => Promise.resolve([
    { id: 1, type: 'bank_account', name: 'Chase Bank', last4: '4567', isDefault: true },
    { id: 2, type: 'credit_card', name: 'Visa', last4: '8901', isDefault: false },
  ])
};

// Styled components
const BalanceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  backgroundColor: theme.palette.primary.dark,
  color: theme.palette.primary.contrastText,
  borderRadius: 12,
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 0
  }
}));

const ActionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  borderRadius: 12,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10]
  }
}));

const TransactionRow = styled(Paper)(({ theme, transactionType }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1.5),
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderLeft: '4px solid',
  borderLeftColor: 
    transactionType === 'deposit' ? theme.palette.success.main :
    transactionType === 'withdrawal' ? theme.palette.error.main :
    transactionType === 'transfer' ? theme.palette.info.main :
    theme.palette.warning.main
}));

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wallet-tabpanel-${index}`}
      aria-labelledby={`wallet-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Main Wallet Page Component
const WalletPage = () => {
  console.log('WalletPage component rendering');
  
  // Add a log on mount to verify component is loading
  useEffect(() => {
    console.log('WalletPage component mounted');
  }, []);
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [openDepositDialog, setOpenDepositDialog] = useState(false);
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Fetch wallet data
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setIsLoading(true);
        const [balance, txns, methods] = await Promise.all([
          mockWalletService.getWalletBalance(),
          mockWalletService.getTransactions(),
          mockWalletService.getPaymentMethods()
        ]);
        
        setWalletData(balance);
        setTransactions(txns);
        setPaymentMethods(methods);
        setSelectedPaymentMethod(methods.find(m => m.isDefault) || methods[0]);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle deposit
  const handleDeposit = () => {
    // Here you would integrate with your payment processor
    alert(`Deposit $${depositAmount} via ${selectedPaymentMethod?.name}`);
    setOpenDepositDialog(false);
    setDepositAmount('');
  };

  // Handle withdrawal
  const handleWithdraw = () => {
    // Here you would call your API to process withdrawal
    alert(`Withdraw $${withdrawAmount} to ${selectedPaymentMethod?.name}`);
    setOpenWithdrawDialog(false);
    setWithdrawAmount('');
  };

  // Format currency
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Wallet
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your funds, deposits, withdrawals and payment methods
        </Typography>
      </Box>

      {/* Balance Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <BalanceCard elevation={3}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="subtitle2" sx={{ opacity: 0.8 }}>
                Total Balance
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                {formatCurrency(walletData?.balance)}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Available
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(walletData?.availableBalance)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Pending
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {formatCurrency(walletData?.pendingDeposits)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Last Updated
                  </Typography>
                  <Typography variant="body2">
                    {formatDate(walletData?.lastUpdated)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </BalanceCard>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} sx={{ height: '100%' }}>
            <Grid item xs={6}>
              <ActionCard elevation={2} onClick={() => setOpenDepositDialog(true)}>
                <ArrowDownward sx={{ fontSize: 36, color: 'success.main', mb: 1 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Deposit
                </Typography>
              </ActionCard>
            </Grid>
            <Grid item xs={6}>
              <ActionCard elevation={2} onClick={() => setOpenWithdrawDialog(true)}>
                <ArrowUpward sx={{ fontSize: 36, color: 'error.main', mb: 1 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Withdraw
                </Typography>
              </ActionCard>
            </Grid>
            <Grid item xs={6}>
              <ActionCard elevation={2}>
                <SwapHoriz sx={{ fontSize: 36, color: 'info.main', mb: 1 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Transfer
                </Typography>
              </ActionCard>
            </Grid>
            <Grid item xs={6}>
              <ActionCard elevation={2}>
                <ReceiptLong sx={{ fontSize: 36, color: 'warning.main', mb: 1 }} />
                <Typography variant="subtitle1" fontWeight="medium">
                  Statements
                </Typography>
              </ActionCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', mb: 4 }} elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            aria-label="wallet tabs"
            sx={{ 
              '& .MuiTab-root': { 
                py: 2,
                px: 3,
                fontSize: '0.95rem'
              }
            }}
          >
            <Tab 
              icon={<ReceiptLong sx={{ mr: 1 }} />} 
              iconPosition="start" 
              label="Transactions" 
              id="wallet-tab-0"
            />
            <Tab 
              icon={<CreditCard sx={{ mr: 1 }} />} 
              iconPosition="start" 
              label="Payment Methods" 
              id="wallet-tab-1"
            />
          </Tabs>
        </Box>

        {/* Transactions Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Recent Transactions</Typography>
            <Button 
              startIcon={<Refresh />} 
              variant="outlined" 
              size="small"
            >
              Refresh
            </Button>
          </Box>

          {transactions.length === 0 ? (
            <Alert severity="info" sx={{ my: 2 }}>
              No transactions found
            </Alert>
          ) : (
            <Box>
              {transactions.map((transaction) => (
                <TransactionRow 
                  key={transaction.id} 
                  elevation={1}
                  transactionType={transaction.type}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 
                        transaction.type === 'deposit' ? 'success.light' :
                        transaction.type === 'withdrawal' ? 'error.light' :
                        transaction.type === 'transfer' ? 'info.light' :
                        'warning.light',
                      mr: 2
                    }}>
                      {transaction.type === 'deposit' && <ArrowDownward sx={{ color: 'success.dark' }} />}
                      {transaction.type === 'withdrawal' && <ArrowUpward sx={{ color: 'error.dark' }} />}
                      {transaction.type === 'transfer' && <SwapHoriz sx={{ color: 'info.dark' }} />}
                      {transaction.type === 'fee' && <ReceiptLong sx={{ color: 'warning.dark' }} />}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'medium' }}>
                        {transaction.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(transaction.date)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: 
                          transaction.type === 'deposit' ? 'success.main' :
                          transaction.type === 'withdrawal' || transaction.type === 'fee' ? 'error.main' :
                          transaction.type === 'transfer' ? 'info.main' :
                          'text.primary'
                      }}
                    >
                      {transaction.type === 'deposit' ? '+' : 
                       transaction.type === 'withdrawal' || transaction.type === 'fee' ? '-' : ''}
                      {formatCurrency(transaction.amount)}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        px: 1.5, 
                        py: 0.3, 
                        borderRadius: 1, 
                        backgroundColor: 
                          transaction.status === 'completed' ? 'success.light' :
                          transaction.status === 'pending' ? 'warning.light' :
                          'error.light',
                        color: 
                          transaction.status === 'completed' ? 'success.dark' :
                          transaction.status === 'pending' ? 'warning.dark' :
                          'error.dark'
                      }}
                    >
                      {transaction.status.toUpperCase()}
                    </Typography>
                  </Box>
                </TransactionRow>
              ))}
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button variant="outlined">View All Transactions</Button>
              </Box>
            </Box>
          )}
        </TabPanel>

        {/* Payment Methods Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Your Payment Methods</Typography>
            <Button 
              startIcon={<Add />} 
              variant="contained" 
              color="primary"
            >
              Add New Method
            </Button>
          </Box>

          {paymentMethods.length === 0 ? (
            <Alert severity="info" sx={{ my: 2 }}>
              No payment methods found
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {paymentMethods.map((method) => (
                <Grid item xs={12} sm={6} key={method.id}>
                  <Paper 
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      border: method.isDefault ? '2px solid' : '1px solid',
                      borderColor: method.isDefault ? 'primary.main' : 'divider'
                    }} 
                    elevation={method.isDefault ? 3 : 1}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {method.name}
                      </Typography>
                      {method.isDefault && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            backgroundColor: 'primary.light',
                            color: 'primary.dark',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontWeight: 'medium'
                          }}
                        >
                          Default
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {method.type === 'credit_card' ? (
                        <CreditCard sx={{ mr: 1, color: 'text.secondary' }} />
                      ) : (
                        <AccountBalanceWallet sx={{ mr: 1, color: 'text.secondary' }} />
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {method.type === 'credit_card' ? 'Card' : 'Bank Account'} ending in {method.last4}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        variant="outlined"
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error"
                      >
                        Remove
                      </Button>
                      {!method.isDefault && (
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="primary"
                        >
                          Set Default
                        </Button>
                      )}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Paper>

      {/* Deposit Dialog */}
      <Dialog open={openDepositDialog} onClose={() => setOpenDepositDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Deposit Funds</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Enter the amount you want to deposit into your wallet.
          </Typography>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            InputProps={{
              startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
            }}
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Select Payment Method
          </Typography>
          <Box sx={{ mb: 2 }}>
            {paymentMethods.map((method) => (
              <Paper 
                key={method.id}
                sx={{ 
                  p: 2, 
                  mb: 1, 
                  cursor: 'pointer',
                  border: selectedPaymentMethod?.id === method.id ? '2px solid' : '1px solid',
                  borderColor: selectedPaymentMethod?.id === method.id ? 'primary.main' : 'divider',
                  borderRadius: 1
                }}
                onClick={() => setSelectedPaymentMethod(method)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {method.type === 'credit_card' ? (
                    <CreditCard sx={{ mr: 2, color: 'text.secondary' }} />
                  ) : (
                    <AccountBalanceWallet sx={{ mr: 2, color: 'text.secondary' }} />
                  )}
                  <Box>
                    <Typography variant="body2">{method.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Ending in {method.last4}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
          <Alert severity="info" sx={{ mb: 2 }}>
            Deposits are typically credited within 1-2 business days.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDepositDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeposit} 
            variant="contained" 
            disabled={!depositAmount || depositAmount <= 0 || !selectedPaymentMethod}
          >
            Deposit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={openWithdrawDialog} onClose={() => setOpenWithdrawDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Withdraw Funds</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Enter the amount you want to withdraw from your wallet.
          </Typography>
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            InputProps={{
              startAdornment: <Box component="span" sx={{ mr: 1 }}>$</Box>,
            }}
            sx={{ mb: 2 }}
          />
          <Typography variant="body2" sx={{ mb: 2 }}>
            Available balance: <strong>{formatCurrency(walletData?.availableBalance)}</strong>
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Select Withdrawal Method
          </Typography>
          <Box sx={{ mb: 2 }}>
            {paymentMethods.map((method) => (
              <Paper 
                key={method.id}
                sx={{ 
                  p: 2, 
                  mb: 1, 
                  cursor: 'pointer',
                  border: selectedPaymentMethod?.id === method.id ? '2px solid' : '1px solid',
                  borderColor: selectedPaymentMethod?.id === method.id ? 'primary.main' : 'divider',
                  borderRadius: 1
                }}
                onClick={() => setSelectedPaymentMethod(method)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {method.type === 'credit_card' ? (
                    <CreditCard sx={{ mr: 2, color: 'text.secondary' }} />
                  ) : (
                    <AccountBalanceWallet sx={{ mr: 2, color: 'text.secondary' }} />
                  )}
                  <Box>
                    <Typography variant="body2">{method.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Ending in {method.last4}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
          <Alert severity="info" sx={{ mb: 2 }}>
            Withdrawals are typically processed within 2-3 business days.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenWithdrawDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleWithdraw} 
            variant="contained" 
            disabled={
              !withdrawAmount || 
              withdrawAmount <= 0 || 
              !selectedPaymentMethod || 
              withdrawAmount > walletData?.availableBalance
            }
          >
            Withdraw
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WalletPage;
