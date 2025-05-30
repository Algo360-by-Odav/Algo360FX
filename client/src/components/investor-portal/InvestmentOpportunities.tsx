import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Rating,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Info as InfoIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Timeline as TimelineIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { useStores } from '../../stores/StoreProvider';

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
      id={`opportunity-tabpanel-${index}`}
      aria-labelledby={`opportunity-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const InvestmentOpportunities: React.FC = observer(() => {
  const { investorPortalStore } = useStores();
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterMinReturn, setFilterMinReturn] = useState('');
  const [filterMaxRisk, setFilterMaxRisk] = useState('');

  const handleOpenDialog = (opportunity: any) => {
    setSelectedOpportunity(opportunity);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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

  // Sample data - replace with actual data from your store
  const opportunities = [
    {
      id: 1,
      name: 'High-Growth Tech Fund',
      type: 'Fund',
      description: 'A diversified portfolio of high-growth technology companies',
      minInvestment: 10000,
      expectedReturn: 15,
      riskLevel: 4,
      duration: '3-5 years',
      status: 'Open',
      subscribers: 245,
      totalInvestment: 2500000,
      performance: {
        '1M': 2.5,
        '3M': 8.2,
        '6M': 12.5,
        '1Y': 25.8,
      },
      metrics: {
        volatility: 18.5,
        sharpeRatio: 1.2,
        maxDrawdown: 15.4,
      },
    },
    {
      id: 2,
      name: 'Sustainable Energy Portfolio',
      type: 'Portfolio',
      description: 'Investment in renewable energy and sustainable technologies',
      minInvestment: 5000,
      expectedReturn: 12,
      riskLevel: 3,
      duration: '2-4 years',
      status: 'Open',
      subscribers: 178,
      totalInvestment: 1800000,
      performance: {
        '1M': 1.8,
        '3M': 5.5,
        '6M': 9.8,
        '1Y': 18.2,
      },
      metrics: {
        volatility: 14.2,
        sharpeRatio: 1.1,
        maxDrawdown: 12.8,
      },
    },
  ];

  const filteredOpportunities = opportunities.filter((opp) => {
    if (filterType !== 'All' && opp.type !== filterType) return false;
    if (filterMinReturn && opp.expectedReturn < parseFloat(filterMinReturn)) return false;
    if (filterMaxRisk && opp.riskLevel > parseFloat(filterMaxRisk)) return false;
    if (searchTerm && !opp.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <Box>
      {/* Search and Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filterType}
                    label="Type"
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <MenuItem value="All">All Types</MenuItem>
                    <MenuItem value="Fund">Funds</MenuItem>
                    <MenuItem value="Portfolio">Portfolios</MenuItem>
                    <MenuItem value="Stock">Stocks</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Min. Return (%)"
                  type="number"
                  value={filterMinReturn}
                  onChange={(e) => setFilterMinReturn(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Max. Risk Level (1-5)"
                  type="number"
                  value={filterMaxRisk}
                  onChange={(e) => setFilterMaxRisk(e.target.value)}
                  inputProps={{ min: 1, max: 5 }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Opportunities Grid */}
      <Grid container spacing={3}>
        {filteredOpportunities.map((opportunity) => (
          <Grid item xs={12} md={6} lg={4} key={opportunity.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {opportunity.name}
                  </Typography>
                  <Chip
                    label={opportunity.type}
                    color="primary"
                    size="small"
                  />
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  {opportunity.description}
                </Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Min. Investment</Typography>
                    <Typography variant="body1">
                      {formatCurrency(opportunity.minInvestment)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Expected Return</Typography>
                    <Typography variant="body1" color="success.main">
                      {formatPercent(opportunity.expectedReturn)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Risk Level</Typography>
                    <Rating
                      value={opportunity.riskLevel}
                      readOnly
                      max={5}
                      icon={<StarIcon fontSize="small" />}
                      emptyIcon={<StarBorderIcon fontSize="small" />}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Duration</Typography>
                    <Typography variant="body1">{opportunity.duration}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                  size="small"
                  startIcon={<InfoIcon />}
                  onClick={() => handleOpenDialog(opportunity)}
                >
                  Details
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<TrendingUpIcon />}
                >
                  Invest
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Opportunity Details Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        {selectedOpportunity && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{selectedOpportunity.name}</Typography>
                <Chip
                  label={selectedOpportunity.status}
                  color={selectedOpportunity.status === 'Open' ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
              >
                <Tab
                  icon={<AccountBalanceIcon />}
                  label="Overview"
                  id="opportunity-tab-0"
                  aria-controls="opportunity-tabpanel-0"
                />
                <Tab
                  icon={<TimelineIcon />}
                  label="Performance"
                  id="opportunity-tab-1"
                  aria-controls="opportunity-tabpanel-1"
                />
                <Tab
                  icon={<AssessmentIcon />}
                  label="Risk Analysis"
                  id="opportunity-tab-2"
                  aria-controls="opportunity-tabpanel-2"
                />
              </Tabs>

              <TabPanel value={activeTab} index={0}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Investment Details
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell>{selectedOpportunity.type}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Minimum Investment</TableCell>
                            <TableCell>
                              {formatCurrency(selectedOpportunity.minInvestment)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Expected Return</TableCell>
                            <TableCell>
                              {formatPercent(selectedOpportunity.expectedReturn)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Duration</TableCell>
                            <TableCell>{selectedOpportunity.duration}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Current Status
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell>Total Investment</TableCell>
                            <TableCell>
                              {formatCurrency(selectedOpportunity.totalInvestment)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Number of Investors</TableCell>
                            <TableCell>{selectedOpportunity.subscribers}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Typography variant="subtitle2" gutterBottom>
                  Historical Performance
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Period</TableCell>
                        <TableCell align="right">Return</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(selectedOpportunity.performance).map(([period, value]) => (
                        <TableRow key={period}>
                          <TableCell>{period}</TableCell>
                          <TableCell align="right">{formatPercent(value as number)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              <TabPanel value={activeTab} index={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Risk Metrics
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell>Risk Level</TableCell>
                            <TableCell>
                              <Rating
                                value={selectedOpportunity.riskLevel}
                                readOnly
                                max={5}
                              />
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Volatility</TableCell>
                            <TableCell>
                              {formatPercent(selectedOpportunity.metrics.volatility)}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Sharpe Ratio</TableCell>
                            <TableCell>{selectedOpportunity.metrics.sharpeRatio}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Max Drawdown</TableCell>
                            <TableCell>
                              {formatPercent(selectedOpportunity.metrics.maxDrawdown)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>
                      Risk Assessment
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Market Risk
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={70}
                        sx={{ mb: 2, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" gutterBottom>
                        Liquidity Risk
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={45}
                        sx={{ mb: 2, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" gutterBottom>
                        Credit Risk
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={30}
                        sx={{ mb: 2, height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </TabPanel>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                variant="contained"
                startIcon={<TrendingUpIcon />}
                onClick={handleCloseDialog}
              >
                Start Investment
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
});

export default InvestmentOpportunities;
