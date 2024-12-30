import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';

interface MT5Account {
  id: string;
  name: string;
  login: string;
  server: string;
  balance: number;
  equity: number;
  marginLevel: number;
  connected: boolean;
}

const AdvancedMT5Widget: React.FC = observer(() => {
  const [accounts, setAccounts] = useState<MT5Account[]>([
    {
      id: '1',
      name: 'Main Account',
      login: '12345678',
      server: 'ICMarkets-Demo',
      balance: 10000,
      equity: 10250.50,
      marginLevel: 2350.75,
      connected: true,
    },
    {
      id: '2',
      name: 'Test Account',
      login: '87654321',
      server: 'ICMarkets-Live',
      balance: 5000,
      equity: 4850.25,
      marginLevel: 1750.30,
      connected: false,
    },
  ]);

  const [selectedAccount, setSelectedAccount] = useState<MT5Account | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    login: '',
    server: '',
    password: '',
  });

  const handleAddAccount = () => {
    // Implement MT5 account connection logic here
    const account: MT5Account = {
      id: Date.now().toString(),
      name: newAccount.name,
      login: newAccount.login,
      server: newAccount.server,
      balance: 0,
      equity: 0,
      marginLevel: 0,
      connected: true,
    };
    
    setAccounts([...accounts, account]);
    setDialogOpen(false);
    setNewAccount({ name: '', login: '', server: '', password: '' });
  };

  const handleRemoveAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  const handleEmergencyStop = () => {
    // Implement emergency stop logic here
    console.log('Emergency stop triggered');
  };

  const getMarginLevelColor = (level: number) => {
    if (level > 200) return 'success';
    if (level > 120) return 'warning';
    return 'error';
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">MT5 Accounts</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Add Account
          </Button>
        </Box>

        <List>
          {accounts.map((account) => (
            <ListItem
              key={account.id}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
                '&:last-child': { mb: 0 },
              }}
            >
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="subtitle1">{account.name}</Typography>
                    <Chip
                      size="small"
                      icon={account.connected ? <CheckCircleIcon /> : <ErrorIcon />}
                      label={account.connected ? 'Connected' : 'Disconnected'}
                      color={account.connected ? 'success' : 'error'}
                    />
                  </Box>
                }
                secondary={
                  <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Login: {account.login}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Server: {account.server}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="textSecondary">
                            Balance
                          </Typography>
                          <Typography variant="body1">
                            ${account.balance.toFixed(2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="textSecondary">
                            Equity
                          </Typography>
                          <Typography variant="body1">
                            ${account.equity.toFixed(2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="textSecondary">
                            Margin Level
                          </Typography>
                          <Chip
                            size="small"
                            label={`${account.marginLevel.toFixed(2)}%`}
                            color={getMarginLevelColor(account.marginLevel)}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleRemoveAccount(account.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Box mt={3}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            startIcon={<WarningIcon />}
            onClick={handleEmergencyStop}
          >
            Emergency Stop All Trading
          </Button>
        </Box>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Add MT5 Account</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Account Name"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Login"
                  value={newAccount.login}
                  onChange={(e) => setNewAccount({ ...newAccount, login: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Server"
                  value={newAccount.server}
                  onChange={(e) => setNewAccount({ ...newAccount, server: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Password"
                  value={newAccount.password}
                  onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAddAccount}
              disabled={!newAccount.name || !newAccount.login || !newAccount.server || !newAccount.password}
            >
              Add Account
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
});

export default AdvancedMT5Widget;
