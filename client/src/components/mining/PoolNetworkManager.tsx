import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Tabs,
  Tab,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItem,
  ListItemText,
  List,
  Avatar,
  LinearProgress,
  Alert
} from '@mui/material';
import {
  Storage,
  SyncAlt,
  CheckCircle,
  Add,
  NetworkCheck,
  History,
  Speed,
  Info
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import withMiningObserver from './withMiningObserver';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`pool-tabpanel-${index}`}
      aria-labelledby={`pool-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `pool-tab-${index}`,
    'aria-controls': `pool-tabpanel-${index}`,
  };
}

const EfficiencyChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'efficiency'
})<{ efficiency: number }>(({ theme, efficiency }) => {
  let color;
  if (efficiency >= 0.95) color = theme.palette.success.main;
  else if (efficiency >= 0.90) color = theme.palette.info.main;
  else color = theme.palette.warning.main;
  
  return {
    backgroundColor: `${color}20`,
    color: color,
    fontWeight: 'bold',
    '& .MuiChip-icon': {
      color: 'inherit'
    }
  };
});

interface PoolDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  pools: string[];
  currentPool: string;
}

const PoolSwitchDialog: React.FC<PoolDialogProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  pools, 
  currentPool 
}) => {
  const [selectedPool, setSelectedPool] = useState(currentPool);
  const [reason, setReason] = useState('efficiency');

  const handleSubmit = () => {
    onSubmit({ pool: selectedPool, reason });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Switch Mining Pool</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" paragraph>
          Switching pools will transfer your mining power to the selected pool. This may take a few minutes to complete.
        </Typography>
        
        <FormControl fullWidth sx={{ mt: 2, mb: 3 }}>
          <InputLabel>Select Mining Pool</InputLabel>
          <Select
            value={selectedPool}
            label="Select Mining Pool"
            onChange={(e) => setSelectedPool(e.target.value)}
          >
            {pools.map((pool) => (
              <MenuItem key={pool} value={pool}>
                {pool}
                {pool === currentPool && " (Current)"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Reason for Switching</InputLabel>
          <Select
            value={reason}
            label="Reason for Switching"
            onChange={(e) => setReason(e.target.value)}
          >
            <MenuItem value="efficiency">Better Efficiency</MenuItem>
            <MenuItem value="payout">Better Payout Schedule</MenuItem>
            <MenuItem value="fee">Lower Fees</MenuItem>
            <MenuItem value="stability">Better Stability</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        
        {reason === 'other' && (
          <TextField
            fullWidth
            label="Specify Reason"
            variant="outlined"
            multiline
            rows={2}
            sx={{ mb: 2 }}
          />
        )}
        
        <Alert severity="info">
          Switching pools too frequently may result in lost shares during the transition period.
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={selectedPool === currentPool}
        >
          Switch Pool
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface Props {
  store: any;
}

const PoolNetworkManager: React.FC<Props> = ({ store }) => {
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSwitchPool = (data: any) => {
    store.switchPool(data.pool);
    setNotification({
      open: true,
      message: `Switching to ${data.pool}. This may take a few minutes.`,
      severity: 'info'
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Pool & Network Manager
        </Typography>
        <Button
          variant="contained"
          startIcon={<SyncAlt />}
          onClick={() => setDialogOpen(true)}
        >
          Switch Pool
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="pool network tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Mining Pools" icon={<Storage />} {...a11yProps(0)} />
          <Tab label="Network Status" icon={<NetworkCheck />} {...a11yProps(1)} />
          <Tab label="Payout History" icon={<History />} {...a11yProps(2)} />
        </Tabs>

        {/* Mining Pools Tab */}
        <TabPanel value={tabValue} index={0}>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Currently mining with <strong>{store.poolStats.currentPool}</strong>. Pool efficiency is <strong>{store.poolStats.poolPerformance[0].efficiency * 100}%</strong>.
            </Typography>
          </Alert>
          
          <Card sx={{ mb: 3 }}>
            <CardHeader title="Current Pool Performance" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Active Hashrate
                    </Typography>
                    <Typography variant="h4" color="primary">
                      {store.poolStats.poolPerformance[0].hashrate} MH/s
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {store.poolStats.poolPerformance[0].workers} active workers
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Pool Fee
                    </Typography>
                    <Typography variant="h4" color="secondary">
                      {store.poolStats.poolPerformance[0].fee}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Per block reward
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Last Payout
                    </Typography>
                    <Typography variant="h4">
                      {store.poolStats.poolPerformance[0].lastPayout ? 
                        new Date(store.poolStats.poolPerformance[0].lastPayout).toLocaleDateString() : 
                        "N/A"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {store.poolStats.poolPerformance[0].lastPayout ? 
                        new Date(store.poolStats.poolPerformance[0].lastPayout).toLocaleTimeString() : 
                        "No payments yet"}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pool Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Hashrate</TableCell>
                  <TableCell>Fee</TableCell>
                  <TableCell>Efficiency</TableCell>
                  <TableCell>Last Payout</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {store.poolStats.poolPerformance.map((pool: any) => (
                  <TableRow 
                    key={pool.name}
                    sx={{
                      backgroundColor: pool.name === store.poolStats.currentPool ? 'rgba(0, 0, 0, 0.04)' : 'inherit'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>
                          {pool.name.charAt(0)}
                        </Avatar>
                        <Typography variant="body1" fontWeight={pool.name === store.poolStats.currentPool ? 'bold' : 'regular'}>
                          {pool.name}
                          {pool.name === store.poolStats.currentPool && (
                            <Chip 
                              label="Current" 
                              size="small" 
                              color="primary" 
                              sx={{ ml: 1, height: 20 }}
                            />
                          )}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={pool.name === store.poolStats.currentPool ? <CheckCircle /> : undefined}
                        label={pool.name === store.poolStats.currentPool ? "Active" : "Inactive"}
                        color={pool.name === store.poolStats.currentPool ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{pool.hashrate} MH/s</TableCell>
                    <TableCell>{pool.fee}</TableCell>
                    <TableCell>
                      <EfficiencyChip
                        icon={<Speed fontSize="small" />}
                        label={`${(pool.efficiency * 100).toFixed(1)}%`}
                        efficiency={pool.efficiency}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {pool.lastPayout ? new Date(pool.lastPayout).toLocaleDateString() : "Never"}
                    </TableCell>
                    <TableCell align="right">
                      {pool.name !== store.poolStats.currentPool ? (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            store.switchPool(pool.name);
                            setNotification({
                              open: true,
                              message: `Switching to ${pool.name}. This may take a few minutes.`,
                              severity: 'info'
                            });
                          }}
                        >
                          Switch
                        </Button>
                      ) : (
                        <Tooltip title="Current mining pool">
                          <CheckCircle color="success" />
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              startIcon={<Add />}
              color="primary"
            >
              Add Custom Pool
            </Button>
          </Box>
        </TabPanel>

        {/* Network Status Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Cryptocurrency Network Status
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Current status of blockchain networks for your mining operations.
          </Typography>

          <Grid container spacing={3}>
            {store.networkStatus.networks.map((network: any) => (
              <Grid item xs={12} md={6} lg={3} key={network.coin}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader
                    title={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                          {network.coin.charAt(0)}
                        </Avatar>
                        {network.coin}
                      </Box>
                    }
                    action={
                      <Tooltip title="Network Details">
                        <IconButton size="small">
                          <Info />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                  <Divider />
                  <CardContent>
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary="Network Hashrate"
                          secondary={network.networkHashrate}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Block Reward"
                          secondary={network.blockReward}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Difficulty"
                          secondary={network.difficulty.toLocaleString()}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Next Difficulty Change"
                          secondary={
                            <Box component="span">
                              <Chip
                                label={network.nextDifficultyChange}
                                size="small"
                                color={parseFloat(network.nextDifficultyChange) < 0 ? "success" : "warning"}
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    </List>

                    <Divider sx={{ my: 1 }} />

                    <Box sx={{ mt: 1, mb: 0.5 }}>
                      <Typography variant="body2" component="span" gutterBottom>
                        Your Contribution
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={0.005}
                      sx={{ height: 8, borderRadius: 4, mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      0.005% of total network hashrate
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Payout History Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Mining Reward Payouts
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            History of received mining rewards from pools.
          </Typography>

          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Pool</TableCell>
                  <TableCell>Coin</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>USD Value</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Transaction</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>2025-05-27</TableCell>
                  <TableCell>Flexpool</TableCell>
                  <TableCell>ETH</TableCell>
                  <TableCell>0.05</TableCell>
                  <TableCell>$142.50</TableCell>
                  <TableCell>
                    <Chip label="Confirmed" color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<Info />}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2025-05-26</TableCell>
                  <TableCell>Flexpool</TableCell>
                  <TableCell>ETH</TableCell>
                  <TableCell>0.048</TableCell>
                  <TableCell>$136.80</TableCell>
                  <TableCell>
                    <Chip label="Confirmed" color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<Info />}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2025-05-25</TableCell>
                  <TableCell>Flexpool</TableCell>
                  <TableCell>ETH</TableCell>
                  <TableCell>0.052</TableCell>
                  <TableCell>$148.20</TableCell>
                  <TableCell>
                    <Chip label="Confirmed" color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<Info />}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2025-05-24</TableCell>
                  <TableCell>Flexpool</TableCell>
                  <TableCell>ETH</TableCell>
                  <TableCell>0.047</TableCell>
                  <TableCell>$133.95</TableCell>
                  <TableCell>
                    <Chip label="Confirmed" color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<Info />}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Card>
            <CardHeader title="Payout Settings" />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Payout Thresholds
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Coin</TableCell>
                          <TableCell>Minimum Payout</TableCell>
                          <TableCell>Current Balance</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>ETH</TableCell>
                          <TableCell>0.05 ETH</TableCell>
                          <TableCell>0.028 ETH</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>BTC</TableCell>
                          <TableCell>0.001 BTC</TableCell>
                          <TableCell>0.0005 BTC</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>RVN</TableCell>
                          <TableCell>100 RVN</TableCell>
                          <TableCell>65 RVN</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Payout Schedule
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText
                        primary="ETH Payout Schedule"
                        secondary="Daily at 12:00 UTC if above threshold"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="BTC Payout Schedule"
                        secondary="Daily at 14:00 UTC if above threshold"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="RVN Payout Schedule"
                        secondary="Daily at 16:00 UTC if above threshold"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Gas Price Limit"
                        secondary="40 Gwei (for ETH payouts)"
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                >
                  Update Payout Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>

      {/* Pool Switch Dialog */}
      <PoolSwitchDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSwitchPool}
        pools={store.poolStats.availablePools}
        currentPool={store.poolStats.currentPool}
      />

      {/* Notification */}
      <Alert
        severity={notification.severity as any}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
          display: notification.open ? 'flex' : 'none',
          boxShadow: 3
        }}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        {notification.message}
      </Alert>
    </Box>
  );
};

export default withMiningObserver(PoolNetworkManager);
