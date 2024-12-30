import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tab,
  Tabs,
  Button,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Tooltip,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  AccountBox as AccountBoxIcon,
  AttachMoney as MoneyIcon,
  Block as BlockIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Settings,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import ErrorBoundary from '@components/error/ErrorBoundary';
import { useRootStore } from '@/hooks/useRootStore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  accountType: string;
  status: string;
  balance: number;
  tradingVolume: number;
  riskLevel: string;
  joinDate: string;
  lastActive: string;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`broker-tabpanel-${index}`}
      aria-labelledby={`broker-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const BrokerPortal: React.FC = observer(() => {
  const { brokerStore } = useRootStore();
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAccountType, setFilterAccountType] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (client?: Client) => {
    setSelectedClient(client || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClient(null);
  };

  // Mock data - replace with actual data from store
  const stats = {
    totalClients: 1250,
    activeTraders: 856,
    totalVolume: '€2.5M',
    dailyTrades: 3420,
  };

  const mockClients: Client[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 890',
      location: 'New York, USA',
      accountType: 'Premium',
      status: 'Active',
      balance: 50000,
      tradingVolume: 1500000,
      riskLevel: 'Medium',
      joinDate: '2023-01-15',
      lastActive: '2023-12-23',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+44 20 7123 4567',
      location: 'London, UK',
      accountType: 'Standard',
      status: 'Inactive',
      balance: 25000,
      tradingVolume: 750000,
      riskLevel: 'Low',
      joinDate: '2023-03-20',
      lastActive: '2023-12-22',
    },
    // Add more mock clients as needed
  ];

  const filteredClients = mockClients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesAccountType = filterAccountType === 'all' || client.accountType === filterAccountType;
    return matchesSearch && matchesStatus && matchesAccountType;
  });

  const recentActivities = [
    { text: 'New client registration: John Doe', time: '5 minutes ago' },
    { text: 'Trading volume alert: High activity detected', time: '15 minutes ago' },
    { text: 'Risk level update: Portfolio rebalancing required', time: '1 hour ago' },
    { text: 'Compliance check: Monthly audit completed', time: '2 hours ago' },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Broker Portal
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Comprehensive broker management and monitoring system
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Clients
              </Typography>
              <Typography variant="h4">{stats.totalClients}</Typography>
              <LinearProgress
                variant="determinate"
                value={75}
                sx={{ mt: 2 }}
                color="primary"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Traders
              </Typography>
              <Typography variant="h4">{stats.activeTraders}</Typography>
              <LinearProgress
                variant="determinate"
                value={65}
                sx={{ mt: 2 }}
                color="secondary"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Daily Volume
              </Typography>
              <Typography variant="h4">{stats.totalVolume}</Typography>
              <LinearProgress
                variant="determinate"
                value={85}
                sx={{ mt: 2 }}
                color="success"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Daily Trades
              </Typography>
              <Typography variant="h4">{stats.dailyTrades}</Typography>
              <LinearProgress
                variant="determinate"
                value={90}
                sx={{ mt: 2 }}
                color="info"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="broker portal tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Dashboard" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="Client Management" icon={<PeopleIcon />} iconPosition="start" />
          <Tab label="Trading Activity" icon={<TrendingUpIcon />} iconPosition="start" />
          <Tab label="Risk Management" icon={<SecurityIcon />} iconPosition="start" />
          <Tab label="Compliance" icon={<AccountBalanceIcon />} iconPosition="start" />
          <Tab label="Notifications" icon={<NotificationsIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {/* Dashboard Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Trading Volume Overview
              </Typography>
              {/* Add Trading Volume Chart Component */}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Recent Activities
              </Typography>
              <List>
                {recentActivities.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={activity.text}
                        secondary={activity.time}
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Client Management Tab */}
      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Suspended">Suspended</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    value={filterAccountType}
                    onChange={(e) => setFilterAccountType(e.target.value)}
                    label="Account Type"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="Standard">Standard</MenuItem>
                    <MenuItem value="Premium">Premium</MenuItem>
                    <MenuItem value="VIP">VIP</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box display="flex" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                  >
                    Add New Client
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client Name</TableCell>
                  <TableCell>Account Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Balance</TableCell>
                  <TableCell align="right">Trading Volume</TableCell>
                  <TableCell>Risk Level</TableCell>
                  <TableCell>Last Active</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClients
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <AccountBoxIcon sx={{ mr: 1 }} />
                          <Box>
                            <Typography variant="body1">{client.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {client.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={client.accountType}
                          color={client.accountType === 'Premium' ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={client.status}
                          color={
                            client.status === 'Active'
                              ? 'success'
                              : client.status === 'Inactive'
                              ? 'warning'
                              : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        ${client.balance.toLocaleString()}
                      </TableCell>
                      <TableCell align="right">
                        ${client.tradingVolume.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={client.riskLevel}
                          color={
                            client.riskLevel === 'Low'
                              ? 'success'
                              : client.riskLevel === 'Medium'
                              ? 'warning'
                              : 'error'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{client.lastActive}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit Client">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(client)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Client">
                          <IconButton size="small" color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredClients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </TabPanel>

      {/* Trading Activity Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Live Trading Activity</Typography>
                <Box>
                  <Button
                    startIcon={<FilterIcon />}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Filter
                  </Button>
                  <Button
                    startIcon={<RefreshIcon />}
                    variant="outlined"
                    size="small"
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Time</TableCell>
                      <TableCell>Client</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Symbol</TableCell>
                      <TableCell align="right">Volume</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      {
                        time: '19:01:32',
                        client: 'John Doe',
                        type: 'BUY',
                        symbol: 'EURUSD',
                        volume: 1.0,
                        price: 1.0955,
                        status: 'Executed',
                      },
                      {
                        time: '19:01:15',
                        client: 'Jane Smith',
                        type: 'SELL',
                        symbol: 'GBPUSD',
                        volume: 0.5,
                        price: 1.2645,
                        status: 'Pending',
                      },
                      // Add more mock trading activities
                    ].map((trade, index) => (
                      <TableRow key={index}>
                        <TableCell>{trade.time}</TableCell>
                        <TableCell>{trade.client}</TableCell>
                        <TableCell>
                          <Chip
                            label={trade.type}
                            color={trade.type === 'BUY' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{trade.symbol}</TableCell>
                        <TableCell align="right">{trade.volume}</TableCell>
                        <TableCell align="right">{trade.price}</TableCell>
                        <TableCell>
                          <Chip
                            label={trade.status}
                            color={trade.status === 'Executed' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Trading Summary</Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Total Trades" secondary="Today" />
                  <Typography variant="h6">1,234</Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Total Volume" secondary="Today" />
                  <Typography variant="h6">$5.6M</Typography>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Active Traders" secondary="Now" />
                  <Typography variant="h6">45</Typography>
                </ListItem>
              </List>
            </Paper>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Popular Instruments</Typography>
              <List dense>
                {[
                  { symbol: 'EURUSD', volume: '$2.1M', change: '+1.2%' },
                  { symbol: 'GBPUSD', volume: '$1.8M', change: '-0.5%' },
                  { symbol: 'USDJPY', volume: '$1.5M', change: '+0.8%' },
                ].map((instrument, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={instrument.symbol}
                      secondary={`Volume: ${instrument.volume}`}
                    />
                    <Chip
                      label={instrument.change}
                      color={instrument.change.startsWith('+') ? 'success' : 'error'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Risk Management Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Risk Exposure Overview</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Currency Pair</TableCell>
                      <TableCell align="right">Exposure</TableCell>
                      <TableCell align="right">Risk Level</TableCell>
                      <TableCell>Action Required</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      {
                        pair: 'EURUSD',
                        exposure: '$2.5M',
                        riskLevel: 'High',
                        action: 'Reduce Exposure',
                      },
                      {
                        pair: 'GBPUSD',
                        exposure: '$1.8M',
                        riskLevel: 'Medium',
                        action: 'Monitor',
                      },
                      {
                        pair: 'USDJPY',
                        exposure: '$1.2M',
                        riskLevel: 'Low',
                        action: 'None',
                      },
                    ].map((risk, index) => (
                      <TableRow key={index}>
                        <TableCell>{risk.pair}</TableCell>
                        <TableCell align="right">{risk.exposure}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={risk.riskLevel}
                            color={
                              risk.riskLevel === 'High'
                                ? 'error'
                                : risk.riskLevel === 'Medium'
                                ? 'warning'
                                : 'success'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{risk.action}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Margin Alerts</Typography>
              <List dense>
                {[
                  {
                    client: 'John Doe',
                    margin: '75%',
                    level: 'Warning',
                    message: 'Approaching margin call',
                  },
                  {
                    client: 'Jane Smith',
                    margin: '45%',
                    level: 'Safe',
                    message: 'Within safe limits',
                  },
                ].map((alert, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {alert.level === 'Warning' ? (
                        <WarningIcon color="warning" />
                      ) : (
                        <CheckIcon color="success" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={alert.client}
                      secondary={`Margin Level: ${alert.margin} - ${alert.message}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Risk Metrics</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Total Exposure
                      </Typography>
                      <Typography variant="h4">$5.5M</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={75}
                        color="warning"
                        sx={{ mt: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card>
                    <CardContent>
                      <Typography color="textSecondary" gutterBottom>
                        Risk Score
                      </Typography>
                      <Typography variant="h4">6.8/10</Typography>
                      <LinearProgress
                        variant="determinate"
                        value={68}
                        color="error"
                        sx={{ mt: 2 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Risk Management Actions</Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Automatic Position Closure"
                    secondary="For positions exceeding risk threshold"
                  />
                  <Switch defaultChecked />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Margin Call Alerts"
                    secondary="Notify clients approaching margin call"
                  />
                  <Switch defaultChecked />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Risk Level Monitoring"
                    secondary="Continuous monitoring of risk levels"
                  />
                  <Switch defaultChecked />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Compliance Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Compliance Reports</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                >
                  Generate Report
                </Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Report Type</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Issues</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      {
                        type: 'KYC Verification',
                        date: '2023-12-23',
                        status: 'Completed',
                        issues: 0,
                      },
                      {
                        type: 'AML Check',
                        date: '2023-12-22',
                        status: 'Pending',
                        issues: 2,
                      },
                      {
                        type: 'Transaction Audit',
                        date: '2023-12-21',
                        status: 'In Progress',
                        issues: 1,
                      },
                    ].map((report, index) => (
                      <TableRow key={index}>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.date}</TableCell>
                        <TableCell>
                          <Chip
                            label={report.status}
                            color={
                              report.status === 'Completed'
                                ? 'success'
                                : report.status === 'Pending'
                                ? 'warning'
                                : 'info'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={report.issues}
                            color={report.issues > 0 ? 'error' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Compliance Requirements</Typography>
              <List>
                {[
                  {
                    requirement: 'KYC Documentation',
                    status: '95% Complete',
                    dueDate: '2024-01-15',
                  },
                  {
                    requirement: 'Risk Assessment',
                    status: '80% Complete',
                    dueDate: '2024-01-10',
                  },
                  {
                    requirement: 'Regulatory Reporting',
                    status: '100% Complete',
                    dueDate: '2023-12-31',
                  },
                ].map((req, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={req.requirement}
                      secondary={`Due: ${req.dueDate}`}
                    />
                    <Chip label={req.status} color="primary" size="small" />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Compliance Alerts</Typography>
              <List dense>
                {[
                  {
                    text: 'Unusual trading pattern detected',
                    severity: 'high',
                    time: '5 min ago',
                  },
                  {
                    text: 'KYC update required for client',
                    severity: 'medium',
                    time: '1 hour ago',
                  },
                  {
                    text: 'New regulation update available',
                    severity: 'low',
                    time: '2 hours ago',
                  },
                ].map((alert, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {alert.severity === 'high' ? (
                        <WarningIcon color="error" />
                      ) : alert.severity === 'medium' ? (
                        <WarningIcon color="warning" />
                      ) : (
                        <InfoIcon color="info" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={alert.text}
                      secondary={alert.time}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Quick Actions</Typography>
              <List>
                <ListItem>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AssessmentIcon />}
                  >
                    Generate Compliance Report
                  </Button>
                </ListItem>
                <ListItem>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SecurityIcon />}
                  >
                    Review Risk Assessment
                  </Button>
                </ListItem>
                <ListItem>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<PeopleIcon />}
                  >
                    Update KYC Records
                  </Button>
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Notifications Tab */}
      <TabPanel value={tabValue} index={5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">System Notifications</Typography>
                <Box>
                  <Button
                    startIcon={<FilterIcon />}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DeleteIcon />}
                  >
                    Clear All
                  </Button>
                </Box>
              </Box>
              <List>
                {[
                  {
                    title: 'System Maintenance',
                    message: 'Scheduled maintenance in 2 hours',
                    type: 'system',
                    time: '10 minutes ago',
                    read: false,
                  },
                  {
                    title: 'New Client Registration',
                    message: 'John Doe has completed registration',
                    type: 'client',
                    time: '1 hour ago',
                    read: true,
                  },
                  {
                    title: 'Risk Alert',
                    message: 'High volume trading detected',
                    type: 'risk',
                    time: '2 hours ago',
                    read: false,
                  },
                  {
                    title: 'Compliance Update',
                    message: 'New regulatory requirements published',
                    type: 'compliance',
                    time: '3 hours ago',
                    read: true,
                  },
                ].map((notification, index) => (
                  <React.Fragment key={index}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        backgroundColor: notification.read ? 'transparent' : 'action.hover',
                      }}
                    >
                      <ListItemIcon>
                        {notification.type === 'system' && <Settings color="primary" />}
                        {notification.type === 'client' && <PeopleIcon color="success" />}
                        {notification.type === 'risk' && <WarningIcon color="error" />}
                        {notification.type === 'compliance' && <SecurityIcon color="info" />}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                            >
                              {notification.title}
                            </Typography>
                            {!notification.read && (
                              <Chip
                                label="New"
                                color="primary"
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {notification.message}
                            </Typography>
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: 'block' }}
                            >
                              {notification.time}
                            </Typography>
                          </>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < 3 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Notification Settings</Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive notifications via email"
                  />
                  <Switch defaultChecked />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Receive push notifications"
                  />
                  <Switch defaultChecked />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="SMS Alerts"
                    secondary="Receive critical alerts via SMS"
                  />
                  <Switch />
                </ListItem>
              </List>
            </Paper>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Notification Categories</Typography>
              <List>
                {[
                  { category: 'System Updates', enabled: true },
                  { category: 'Client Activities', enabled: true },
                  { category: 'Risk Alerts', enabled: true },
                  { category: 'Compliance Updates', enabled: true },
                  { category: 'Trading Activities', enabled: false },
                ].map((category, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={category.category} />
                    <Switch defaultChecked={category.enabled} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Client Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedClient ? 'Edit Client' : 'Add New Client'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                defaultValue={selectedClient?.name}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                defaultValue={selectedClient?.email}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                defaultValue={selectedClient?.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                defaultValue={selectedClient?.location}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Account Type</InputLabel>
                <Select
                  defaultValue={selectedClient?.accountType || 'Standard'}
                  label="Account Type"
                >
                  <MenuItem value="Standard">Standard</MenuItem>
                  <MenuItem value="Premium">Premium</MenuItem>
                  <MenuItem value="VIP">VIP</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  defaultValue={selectedClient?.status || 'Active'}
                  label="Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="Suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Initial Balance"
                type="number"
                defaultValue={selectedClient?.balance || 0}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Risk Level</InputLabel>
                <Select
                  defaultValue={selectedClient?.riskLevel || 'Low'}
                  label="Risk Level"
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" alignItems="center" gap={1}>
                <Switch defaultChecked />
                <Typography>Send welcome email to client</Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCloseDialog}
            startIcon={<CheckIcon />}
          >
            {selectedClient ? 'Save Changes' : 'Add Client'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Other Tabs */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Trading Activity
              </Typography>
              {/* Add Trading Activity Content */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Risk Management
              </Typography>
              {/* Add Risk Management Content */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Compliance
              </Typography>
              {/* Add Compliance Content */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Notifications
              </Typography>
              {/* Add Notifications Content */}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Container>
  );
});

export default BrokerPortal;


