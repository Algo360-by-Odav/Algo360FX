import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  AccountBalance as AccountIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useStores } from '../../stores/StoreProvider';

interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  broker: string;
  status: 'active' | 'inactive';
  performance: {
    dailyPL: number;
    weeklyPL: number;
    monthlyPL: number;
    totalPL: number;
    winRate: number;
    drawdown: number;
  };
}

interface Trade {
  id: string;
  accountId: string;
  symbol: string;
  type: 'buy' | 'sell';
  openPrice: number;
  closePrice: number;
  size: number;
  profit: number;
  openTime: string;
  closeTime: string;
}

const MoneyManagerPortal: React.FC = () => {
  const { moneyManagerStore } = useStores();
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Main Trading Account',
      balance: 50000,
      currency: 'USD',
      broker: 'Interactive Brokers',
      status: 'active',
      performance: {
        dailyPL: 250.75,
        weeklyPL: 1250.50,
        monthlyPL: 4500.25,
        totalPL: 15000.50,
        winRate: 65.5,
        drawdown: 8.2,
      },
    },
    {
      id: '2',
      name: 'Conservative Portfolio',
      balance: 25000,
      currency: 'USD',
      broker: 'TD Ameritrade',
      status: 'active',
      performance: {
        dailyPL: 120.25,
        weeklyPL: 580.75,
        monthlyPL: 2200.50,
        totalPL: 8500.25,
        winRate: 58.8,
        drawdown: 5.5,
      },
    },
  ]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [openAccountDialog, setOpenAccountDialog] = useState(false);
  const [openSettingsDialog, setOpenSettingsDialog] = useState(false);

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setOpenAccountDialog(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setOpenAccountDialog(true);
  };

  const handleDeleteAccount = (accountId: string) => {
    // Delete account logic
  };

  const handleSaveAccount = () => {
    // Save account logic
    setOpenAccountDialog(false);
  };

  const handleOpenSettings = (account: Account) => {
    setSelectedAccount(account);
    setOpenSettingsDialog(true);
  };

  const renderPerformanceMetrics = (account: Account) => (
    <Grid container spacing={2}>
      <Grid item xs={6} sm={4} md={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Daily P/L
        </Typography>
        <Typography
          variant="h6"
          color={account.performance.dailyPL >= 0 ? 'success.main' : 'error.main'}
        >
          ${account.performance.dailyPL.toFixed(2)}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Weekly P/L
        </Typography>
        <Typography
          variant="h6"
          color={account.performance.weeklyPL >= 0 ? 'success.main' : 'error.main'}
        >
          ${account.performance.weeklyPL.toFixed(2)}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Monthly P/L
        </Typography>
        <Typography
          variant="h6"
          color={account.performance.monthlyPL >= 0 ? 'success.main' : 'error.main'}
        >
          ${account.performance.monthlyPL.toFixed(2)}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Total P/L
        </Typography>
        <Typography
          variant="h6"
          color={account.performance.totalPL >= 0 ? 'success.main' : 'error.main'}
        >
          ${account.performance.totalPL.toFixed(2)}
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Win Rate
        </Typography>
        <Typography
          variant="h6"
          color={account.performance.winRate >= 50 ? 'success.main' : 'error.main'}
        >
          {account.performance.winRate}%
        </Typography>
      </Grid>
      <Grid item xs={6} sm={4} md={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Drawdown
        </Typography>
        <Typography
          variant="h6"
          color={account.performance.drawdown <= 10 ? 'success.main' : 'error.main'}
        >
          {account.performance.drawdown}%
        </Typography>
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Money Manager Portal</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddAccount}
          >
            Add Account
          </Button>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          Managing {accounts.length} trading accounts with a total balance of $
          {accounts.reduce((sum, acc) => sum + acc.balance, 0).toFixed(2)}
        </Alert>

        {accounts.map((account) => (
          <Card key={account.id} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6">
                    {account.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {account.broker} | Balance: ${account.balance.toFixed(2)} {account.currency}
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title="Account Settings">
                    <IconButton onClick={() => handleOpenSettings(account)}>
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Account">
                    <IconButton onClick={() => handleEditAccount(account)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Account">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteAccount(account.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {renderPerformanceMetrics(account)}
            </CardContent>
          </Card>
        ))}
      </Paper>

      <Dialog open={openAccountDialog} onClose={() => setOpenAccountDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAccount ? 'Edit Account' : 'Add New Account'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Account Name"
                defaultValue={selectedAccount?.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Broker"
                defaultValue={selectedAccount?.broker}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Initial Balance"
                type="number"
                defaultValue={selectedAccount?.balance}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  defaultValue={selectedAccount?.currency || 'USD'}
                  label="Currency"
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                  <MenuItem value="JPY">JPY</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAccountDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveAccount} variant="contained">
            {selectedAccount ? 'Save Changes' : 'Add Account'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSettingsDialog} onClose={() => setOpenSettingsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Account Settings</DialogTitle>
        <DialogContent>
          {selectedAccount && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Risk Management
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Max Position Size (%)"
                      type="number"
                      defaultValue={5}
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Max Daily Loss (%)"
                      type="number"
                      defaultValue={2}
                      InputProps={{ inputProps: { min: 0, max: 100 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Max Open Positions"
                      type="number"
                      defaultValue={10}
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Default Stop Loss (pips)"
                      type="number"
                      defaultValue={50}
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Trading Permissions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Auto Trading</InputLabel>
                      <Select defaultValue="enabled">
                        <MenuItem value="enabled">Enabled</MenuItem>
                        <MenuItem value="disabled">Disabled</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Trading Hours</InputLabel>
                      <Select defaultValue="all">
                        <MenuItem value="all">24/7</MenuItem>
                        <MenuItem value="main">Main Session Only</MenuItem>
                        <MenuItem value="custom">Custom Hours</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSettingsDialog(false)}>Cancel</Button>
          <Button variant="contained">Save Settings</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MoneyManagerPortal;

