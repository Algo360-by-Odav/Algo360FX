import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Tabs,
  Tab,
  Button,
  Divider,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Info, CompareArrows, Download } from '@mui/icons-material';
import { useStores } from '../../stores/storeProviderJs';

// Interface for tab panel props
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Tab Panel component
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`performance-tabpanel-${index}`}
      aria-labelledby={`performance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Generate monthly performance data
const generateMonthlyData = (providerId: number) => {
  // In a real app, this would come from the API
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  return months.slice(0, currentMonth + 1).map((month, index) => {
    // Generate different data based on provider ID to show variation
    const multiplier = providerId === 1 ? 1 : 0.8;
    const volatility = providerId === 1 ? 2 : 1.5;
    
    // Create some realistic looking data with trends
    const winRate = 50 + Math.sin(index / 2) * 15 * multiplier;
    const pips = 120 + Math.cos(index / 3) * 80 * multiplier;
    const trades = 15 + Math.floor(Math.random() * 20);
    const profit = pips * 10 * multiplier;
    
    return {
      name: month,
      winRate: Math.round(winRate),
      pips: Math.round(pips),
      trades: trades,
      profit: Math.round(profit),
      drawdown: Math.round(Math.random() * volatility * 10),
    };
  });
};

// Generate trade distribution data
const generateTradeDistribution = (providerId: number) => {
  // Different distribution based on provider style
  if (providerId === 1) {
    return [
      { name: 'EUR/USD', value: 35 },
      { name: 'GBP/USD', value: 25 },
      { name: 'USD/JPY', value: 20 },
      { name: 'AUD/USD', value: 10 },
      { name: 'Other', value: 10 },
    ];
  } else {
    return [
      { name: 'EUR/USD', value: 20 },
      { name: 'USD/JPY', value: 30 },
      { name: 'GBP/USD', value: 15 },
      { name: 'USD/CHF', value: 25 },
      { name: 'Other', value: 10 },
    ];
  }
};

// Generate detailed metrics
const generateDetailedMetrics = (providerId: number) => {
  const baseMetrics = {
    avgPipGain: 12.5,
    avgTradeLength: '2d 4h',
    profitFactor: 1.8,
    expectancy: 0.45,
    sharpeRatio: 1.2,
    maxDrawdown: 15.2,
    recoveryFactor: 3.2,
    avgRiskReward: 1.5,
    consecutiveWins: 8,
    consecutiveLosses: 3,
  };
  
  // Adjust metrics based on provider
  if (providerId === 1) {
    return {
      ...baseMetrics,
      avgPipGain: 14.8,
      profitFactor: 2.1,
      expectancy: 0.52,
      sharpeRatio: 1.4,
    };
  }
  
  return baseMetrics;
};

// COLORS for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const PerformanceAnalytics = observer(() => {
  const { signalProviderStore } = useStores();
  const providers = signalProviderStore.getProviders();
  
  // State for tabs
  const [tabValue, setTabValue] = useState(0);
  const [timeframe, setTimeframe] = useState('1y');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState<number[]>([1]); // Default to first provider
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  // Handle timeframe change
  const handleTimeframeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeframe(event.target.value as string);
  };
  
  // Toggle comparison mode
  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
    if (!comparisonMode) {
      // When enabling comparison, add second provider if available
      if (providers.length > 1 && !selectedProviders.includes(2)) {
        setSelectedProviders([...selectedProviders, 2]);
      }
    } else {
      // When disabling, reset to just the first selected provider
      setSelectedProviders([selectedProviders[0]]);
    }
  };
  
  // Handle provider selection for comparison
  const handleProviderSelection = (providerId: number) => {
    if (selectedProviders.includes(providerId)) {
      // Remove if already selected (but keep at least one)
      if (selectedProviders.length > 1) {
        setSelectedProviders(selectedProviders.filter(id => id !== providerId));
      }
    } else {
      // Add if not already selected
      setSelectedProviders([...selectedProviders, providerId]);
    }
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="performance analytics tabs">
          <Tab label="Performance Overview" />
          <Tab label="Detailed Metrics" />
          <Tab label="Trade Analysis" />
        </Tabs>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              label="Timeframe"
              onChange={handleTimeframeChange}
            >
              <MenuItem value="1m">1 Month</MenuItem>
              <MenuItem value="3m">3 Months</MenuItem>
              <MenuItem value="6m">6 Months</MenuItem>
              <MenuItem value="1y">1 Year</MenuItem>
              <MenuItem value="all">All Time</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant={comparisonMode ? "contained" : "outlined"} 
            color="primary" 
            startIcon={<CompareArrows />}
            onClick={toggleComparisonMode}
            size="small"
          >
            Compare
          </Button>
          
          <IconButton size="small">
            <Download />
          </IconButton>
        </Box>
      </Box>
      
      {/* Provider selection for comparison mode */}
      {comparisonMode && (
        <Paper sx={{ p: 2, my: 2, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Providers to Compare
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {providers.map(provider => (
              <Button
                key={provider.id}
                variant={selectedProviders.includes(provider.id) ? "contained" : "outlined"}
                size="small"
                onClick={() => handleProviderSelection(provider.id)}
                sx={{ mb: 1 }}
              >
                {provider.name}
              </Button>
            ))}
          </Box>
        </Paper>
      )}
      
      {/* Performance Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Monthly Performance Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Monthly Performance
                  <Tooltip title="Shows the monthly performance in pips and profit">
                    <IconButton size="small">
                      <Info fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={generateMonthlyData(selectedProviders[0])}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <RechartsTooltip />
                      <Legend />
                      
                      {/* Show lines for each selected provider */}
                      {selectedProviders.map((providerId, index) => (
                        <React.Fragment key={providerId}>
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="pips"
                            data={generateMonthlyData(providerId)}
                            name={`${providers.find(p => p.id === providerId)?.name} - Pips`}
                            stroke={COLORS[index % COLORS.length]}
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="profit"
                            data={generateMonthlyData(providerId)}
                            name={`${providers.find(p => p.id === providerId)?.name} - Profit ($)`}
                            stroke={COLORS[(index + 2) % COLORS.length]}
                            strokeDasharray="5 5"
                          />
                        </React.Fragment>
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Win Rate Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Win Rate Analysis
                </Typography>
                <Box sx={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={generateMonthlyData(selectedProviders[0])}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <RechartsTooltip />
                      <Legend />
                      
                      {/* Show bars for each selected provider */}
                      {selectedProviders.map((providerId, index) => (
                        <Bar
                          key={providerId}
                          dataKey="winRate"
                          data={generateMonthlyData(providerId)}
                          name={`${providers.find(p => p.id === providerId)?.name} - Win Rate (%)`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Trade Distribution */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Trade Distribution
                </Typography>
                <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={generateTradeDistribution(selectedProviders[0])}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {generateTradeDistribution(selectedProviders[0]).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Performance Summary */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Summary
                </Typography>
                <Grid container spacing={2}>
                  {selectedProviders.map(providerId => {
                    const provider = providers.find(p => p.id === providerId);
                    return (
                      <Grid item xs={12} md={comparisonMode ? 6 : 12} key={providerId}>
                        {comparisonMode && (
                          <Typography variant="subtitle1" gutterBottom>
                            {provider?.name}
                          </Typography>
                        )}
                        <Grid container spacing={2}>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">Total Return</Typography>
                            <Typography variant="h6">{provider?.performance.totalReturn}%</Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">Win Rate</Typography>
                            <Typography variant="h6">{provider?.performance.winRate}%</Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">Profit Factor</Typography>
                            <Typography variant="h6">{provider?.performance.profitFactor}</Typography>
                          </Grid>
                          <Grid item xs={6} sm={3}>
                            <Typography variant="body2" color="text.secondary">Max Drawdown</Typography>
                            <Typography variant="h6">{provider?.risk.drawdown}%</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Detailed Metrics Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {selectedProviders.map(providerId => {
            const provider = providers.find(p => p.id === providerId);
            const metrics = generateDetailedMetrics(providerId);
            
            return (
              <Grid item xs={12} md={comparisonMode ? 6 : 12} key={providerId}>
                <Card>
                  <CardContent>
                    {comparisonMode && (
                      <Typography variant="h6" gutterBottom>
                        {provider?.name}
                      </Typography>
                    )}
                    
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Metric</strong></TableCell>
                            <TableCell align="right"><strong>Value</strong></TableCell>
                            {comparisonMode && <TableCell align="right"><strong>Ranking</strong></TableCell>}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>Average Pip Gain</TableCell>
                            <TableCell align="right">{metrics.avgPipGain}</TableCell>
                            {comparisonMode && <TableCell align="right">
                              {providerId === 1 ? '1st' : '2nd'}
                            </TableCell>}
                          </TableRow>
                          <TableRow>
                            <TableCell>Average Trade Length</TableCell>
                            <TableCell align="right">{metrics.avgTradeLength}</TableCell>
                            {comparisonMode && <TableCell align="right">-</TableCell>}
                          </TableRow>
                          <TableRow>
                            <TableCell>Profit Factor</TableCell>
                            <TableCell align="right">{metrics.profitFactor}</TableCell>
                            {comparisonMode && <TableCell align="right">
                              {providerId === 1 ? '1st' : '2nd'}
                            </TableCell>}
                          </TableRow>
                          <TableRow>
                            <TableCell>Expectancy</TableCell>
                            <TableCell align="right">{metrics.expectancy}</TableCell>
                            {comparisonMode && <TableCell align="right">
                              {providerId === 1 ? '1st' : '2nd'}
                            </TableCell>}
                          </TableRow>
                          <TableRow>
                            <TableCell>Sharpe Ratio</TableCell>
                            <TableCell align="right">{metrics.sharpeRatio}</TableCell>
                            {comparisonMode && <TableCell align="right">
                              {providerId === 1 ? '1st' : '2nd'}
                            </TableCell>}
                          </TableRow>
                          <TableRow>
                            <TableCell>Maximum Drawdown</TableCell>
                            <TableCell align="right">{metrics.maxDrawdown}%</TableCell>
                            {comparisonMode && <TableCell align="right">
                              {providerId === 1 ? '2nd' : '1st'}
                            </TableCell>}
                          </TableRow>
                          <TableRow>
                            <TableCell>Recovery Factor</TableCell>
                            <TableCell align="right">{metrics.recoveryFactor}</TableCell>
                            {comparisonMode && <TableCell align="right">-</TableCell>}
                          </TableRow>
                          <TableRow>
                            <TableCell>Average Risk/Reward</TableCell>
                            <TableCell align="right">{metrics.avgRiskReward}</TableCell>
                            {comparisonMode && <TableCell align="right">-</TableCell>}
                          </TableRow>
                          <TableRow>
                            <TableCell>Max Consecutive Wins</TableCell>
                            <TableCell align="right">{metrics.consecutiveWins}</TableCell>
                            {comparisonMode && <TableCell align="right">-</TableCell>}
                          </TableRow>
                          <TableRow>
                            <TableCell>Max Consecutive Losses</TableCell>
                            <TableCell align="right">{metrics.consecutiveLosses}</TableCell>
                            {comparisonMode && <TableCell align="right">-</TableCell>}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>
      
      {/* Trade Analysis Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {/* Drawdown Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Drawdown Periods
                </Typography>
                <Box sx={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={generateMonthlyData(selectedProviders[0])}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      
                      {/* Show drawdown for each selected provider */}
                      {selectedProviders.map((providerId, index) => (
                        <Line
                          key={providerId}
                          type="monotone"
                          dataKey="drawdown"
                          data={generateMonthlyData(providerId)}
                          name={`${providers.find(p => p.id === providerId)?.name} - Drawdown (%)`}
                          stroke={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Trade Volume Analysis */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Trade Volume Analysis
                </Typography>
                <Box sx={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={generateMonthlyData(selectedProviders[0])}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      
                      {/* Show trade volume for each selected provider */}
                      {selectedProviders.map((providerId, index) => (
                        <Bar
                          key={providerId}
                          dataKey="trades"
                          data={generateMonthlyData(providerId)}
                          name={`${providers.find(p => p.id === providerId)?.name} - Trades`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Risk Analysis */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Risk Analysis
                </Typography>
                <Box sx={{ p: 2 }}>
                  {selectedProviders.map(providerId => {
                    const provider = providers.find(p => p.id === providerId);
                    return (
                      <Box key={providerId} sx={{ mb: comparisonMode ? 3 : 0 }}>
                        {comparisonMode && (
                          <Typography variant="subtitle1" gutterBottom>
                            {provider?.name}
                          </Typography>
                        )}
                        
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <Typography variant="body2">Risk Level</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                              <Box
                                sx={{
                                  width: '100%',
                                  height: 10,
                                  borderRadius: 5,
                                  background: 'linear-gradient(90deg, #4caf50 0%, #ffeb3b 50%, #f44336 100%)',
                                }}
                              />
                            </Box>
                            <Box
                              sx={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                bgcolor: 'black',
                                border: '2px solid white',
                                position: 'relative',
                                top: -11,
                                left: `${provider?.risk.riskLevel === 'Low' ? 15 : provider?.risk.riskLevel === 'Medium' ? 50 : 85}%`,
                                transform: 'translateX(-50%)',
                              }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                              <Typography variant="caption">Low</Typography>
                              <Typography variant="caption">Medium</Typography>
                              <Typography variant="caption">High</Typography>
                            </Box>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="body2">Average Risk/Reward</Typography>
                            <Typography variant="h6">
                              1:{generateDetailedMetrics(providerId).avgRiskReward}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={6}>
                            <Typography variant="body2">Max Drawdown</Typography>
                            <Typography variant="h6">
                              {provider?.risk.drawdown}%
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
});

export default PerformanceAnalytics;
