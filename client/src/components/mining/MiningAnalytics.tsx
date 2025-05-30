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
  Stack,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  BarChart,
  PieChart,
  Pie,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  BarChart as BarChartIcon, 
  AttachMoney, 
  CurrencyBitcoin, 
  Bolt, 
  Download, 
  CalendarToday 
} from '@mui/icons-material';
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
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
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
    id: `analytics-tab-${index}`,
    'aria-controls': `analytics-tabpanel-${index}`,
  };
}

// Generate sample historical data
const generateMockData = () => {
  const mockData = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    mockData.push({
      date: date.toISOString().split('T')[0],
      earnings: 25 + Math.random() * 15,
      hashrate: 400 + Math.random() * 100,
      powerCost: 10 + Math.random() * 5,
      uptime: 95 + Math.random() * 5
    });
  }
  
  return mockData;
};

const historicalData = generateMockData();

// Generate monthly summary data
const generateMonthlyData = () => {
  return [
    { month: 'Jan', earnings: 750, costs: 320, profit: 430 },
    { month: 'Feb', earnings: 820, costs: 350, profit: 470 },
    { month: 'Mar', earnings: 940, costs: 380, profit: 560 },
    { month: 'Apr', earnings: 1050, costs: 410, profit: 640 },
    { month: 'May', earnings: 1150, costs: 390, profit: 760 }
  ];
};

const monthlyData = generateMonthlyData();

// Coin distribution data
const coinDistribution = [
  { name: 'ETH', value: 65, color: '#627EEA' },
  { name: 'BTC', value: 20, color: '#F7931A' },
  { name: 'RVN', value: 10, color: '#384182' },
  { name: 'ERGO', value: 5, color: '#FF5000' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

interface Props {
  store: any;
}

const MiningAnalytics: React.FC<Props> = ({ store }) => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('30d');

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value);
  };

  const financialReport = store.financialReports.monthlyReport;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Mining Analytics & Reports
        </Typography>
        <Stack direction="row" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={handleTimeRangeChange}
            >
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 3 Months</MenuItem>
              <MenuItem value="1y">Last 12 Months</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => {
              alert('Report downloaded successfully!');
            }}
          >
            Export Report
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<BarChartIcon />} label="PERFORMANCE" {...a11yProps(0)} />
          <Tab icon={<AttachMoney />} label="FINANCIAL" {...a11yProps(1)} />
          <Tab icon={<CurrencyBitcoin />} label="COIN ANALYSIS" {...a11yProps(2)} />
          <Tab icon={<Bolt />} label="POWER USAGE" {...a11yProps(3)} />
        </Tabs>

        {/* Performance Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Mining Performance Over Time" />
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={historicalData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <RechartsTooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="hashrate" stroke="#8884d8" name="Hashrate (MH/s)" />
                      <Line yAxisId="right" type="monotone" dataKey="earnings" stroke="#82ca9d" name="Earnings ($)" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Uptime Performance" />
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={historicalData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[90, 100]} />
                      <RechartsTooltip />
                      <Area type="monotone" dataKey="uptime" stroke="#8884d8" fill="#8884d8" name="Uptime (%)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Equipment Performance" />
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={store.miningEquipment.filter((e: any) => e.status === 'active')}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="hashrate" name="Hashrate (MH/s)" fill="#8884d8" />
                      <Bar dataKey="powerUsage" name="Power Usage (W)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Financial Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Financial Summary" />
                <CardContent>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      {financialReport.month} {financialReport.year}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Total Revenue:</Typography>
                        <Typography variant="body1" fontWeight="bold" color="success.main">
                          ${financialReport.totalRevenue.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Total Costs:</Typography>
                        <Typography variant="body1" fontWeight="bold" color="error.main">
                          ${financialReport.totalCosts.toFixed(2)}
                        </Typography>
                      </Box>
                      <Divider />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">Net Profit:</Typography>
                        <Typography variant="body1" fontWeight="bold" color="success.main">
                          ${financialReport.netProfit.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">ROI:</Typography>
                        <Chip 
                          label={`${financialReport.roi.toFixed(1)}%`}
                          color="success"
                          size="small"
                        />
                      </Box>
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Cost Breakdown
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Power Cost:</Typography>
                    <Typography variant="body2">${financialReport.powerCost.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Hardware (Depreciation):</Typography>
                    <Typography variant="body2">${financialReport.hardwareCost.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tax Liability:</Typography>
                    <Typography variant="body2">${financialReport.taxLiability.toFixed(2)}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Monthly Performance" />
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={monthlyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="earnings" name="Earnings" stackId="a" fill="#8884d8" />
                      <Bar dataKey="costs" name="Costs" stackId="a" fill="#FF8042" />
                      <Bar dataKey="profit" name="Profit" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardHeader title="Yearly Financial Projection" />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {store.financialReports.yearlyProjection.year} Projection
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1">Projected Revenue:</Typography>
                            <Typography variant="body1" fontWeight="bold" color="success.main">
                              ${store.financialReports.yearlyProjection.projectedRevenue.toFixed(2)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1">Projected Costs:</Typography>
                            <Typography variant="body1" fontWeight="bold" color="error.main">
                              ${store.financialReports.yearlyProjection.projectedCosts.toFixed(2)}
                            </Typography>
                          </Box>
                          <Divider />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1">Projected Profit:</Typography>
                            <Typography variant="body1" fontWeight="bold" color="success.main">
                              ${store.financialReports.yearlyProjection.projectedProfit.toFixed(2)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1">Projected ROI:</Typography>
                            <Chip 
                              label={`${store.financialReports.yearlyProjection.roi.toFixed(1)}%`}
                              color="success"
                              size="small"
                            />
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body1">Break-even Date:</Typography>
                            <Chip 
                              icon={<CalendarToday />}
                              label={store.financialReports.yearlyProjection.breakEvenDate}
                              color="info"
                              size="small"
                            />
                          </Box>
                        </Stack>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <Typography variant="subtitle1" gutterBottom align="center">
                          Profitability Forecast
                        </Typography>
                        <ResponsiveContainer width="100%" height={200}>
                          <LineChart
                            data={[
                              { month: 'Jan', profit: 400 },
                              { month: 'Feb', profit: 500 },
                              { month: 'Mar', profit: 600 },
                              { month: 'Apr', profit: 780 },
                              { month: 'May', profit: 850 },
                              { month: 'Jun', profit: 920 },
                              { month: 'Jul', profit: 950 },
                              { month: 'Aug', profit: 970 },
                              { month: 'Sep', profit: 1000 },
                              { month: 'Oct', profit: 1050 },
                              { month: 'Nov', profit: 1100 },
                              { month: 'Dec', profit: 1150 },
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="profit" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Coin Analysis Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Mining Distribution by Coin" />
                <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={coinDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {coinDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Coin Performance Comparison" />
                <CardContent>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Coin</TableCell>
                          <TableCell>Current Price</TableCell>
                          <TableCell>24h Change</TableCell>
                          <TableCell>Mining Profit</TableCell>
                          <TableCell>Recommendation</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {store.marketPredictions.nextDayProfitability.map((coin: any) => (
                          <TableRow key={coin.coin}>
                            <TableCell>
                              <Chip
                                label={coin.coin}
                                size="small"
                                avatar={<CurrencyBitcoin />}
                              />
                            </TableCell>
                            <TableCell>
                              {coin.coin === 'ETH' ? '$2,750.25' : 
                               coin.coin === 'BTC' ? '$57,200.50' : 
                               coin.coin === 'RVN' ? '$0.05' : 
                               coin.coin === 'ERGO' ? '$14.75' : '$0.00'}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={coin.estimatedReturn}
                                size="small"
                                color={parseFloat(coin.estimatedReturn) > 0 ? 'success' : 'error'}
                              />
                            </TableCell>
                            <TableCell>
                              {coin.prediction === 'high' ? 'High' :
                               coin.prediction === 'low' ? 'Low' : 'Moderate'}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={coin.prediction === 'high' ? 'Mine' : 
                                       coin.prediction === 'low' ? 'Avoid' : 'Consider'}
                                size="small"
                                color={coin.prediction === 'high' ? 'success' : 
                                       coin.prediction === 'low' ? 'error' : 'warning'}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Power Usage Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Power Consumption Over Time" />
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                      data={historicalData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip />
                      <Area type="monotone" dataKey="powerCost" stroke="#8884d8" fill="#8884d8" name="Power Cost ($)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Power Efficiency Analysis" />
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={store.miningEquipment.filter((e: any) => e.status === 'active')}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar 
                        dataKey={(entry) => entry.hashrate / (entry.powerUsage || 1)} 
                        name="Efficiency (MH/W)" 
                        fill="#82ca9d" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Electricity Cost Analysis" />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Power Cost Summary
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Period</TableCell>
                          <TableCell>Power Usage (kWh)</TableCell>
                          <TableCell>Cost ($)</TableCell>
                          <TableCell>% of Revenue</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Daily</TableCell>
                          <TableCell>{(store.miningStats.powerConsumption * 24 / 1000).toFixed(2)}</TableCell>
                          <TableCell>${store.miningStats.powerCost.toFixed(2)}</TableCell>
                          <TableCell>{((store.miningStats.powerCost / store.miningStats.dailyEarnings) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Weekly</TableCell>
                          <TableCell>{(store.miningStats.powerConsumption * 24 * 7 / 1000).toFixed(2)}</TableCell>
                          <TableCell>${(store.miningStats.powerCost * 7).toFixed(2)}</TableCell>
                          <TableCell>{((store.miningStats.powerCost * 7 / (store.miningStats.dailyEarnings * 7)) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Monthly</TableCell>
                          <TableCell>{(store.miningStats.powerConsumption * 24 * 30 / 1000).toFixed(2)}</TableCell>
                          <TableCell>${(store.miningStats.powerCost * 30).toFixed(2)}</TableCell>
                          <TableCell>{((store.miningStats.powerCost * 30 / (store.miningStats.dailyEarnings * 30)) * 100).toFixed(1)}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default withMiningObserver(MiningAnalytics);
