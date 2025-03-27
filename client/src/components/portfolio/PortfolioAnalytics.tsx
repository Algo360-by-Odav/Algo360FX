import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Tabs,
  Tab,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PortfolioAnalyticsProps {
  open: boolean;
  onClose: () => void;
  portfolioData: any; // Replace with proper type
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const PortfolioAnalytics: React.FC<PortfolioAnalyticsProps> = ({
  open,
  onClose,
  portfolioData,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('1M');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const calculateRiskMetrics = () => {
    return {
      sharpeRatio: 1.85,
      volatility: 12.5,
      beta: 0.92,
      alpha: 3.2,
      maxDrawdown: -15.3,
      informationRatio: 0.75,
      sortinoRatio: 2.1,
      trackingError: 4.2,
    };
  };

  const calculateCorrelations = () => {
    return [
      { asset1: 'EURUSD', asset2: 'GBPUSD', correlation: 0.85 },
      { asset1: 'EURUSD', asset2: 'USDJPY', correlation: -0.32 },
      { asset1: 'GBPUSD', asset2: 'USDJPY', correlation: -0.28 },
      { asset1: 'AUDUSD', asset2: 'EURUSD', correlation: 0.65 },
    ];
  };

  const generatePerformanceReport = () => {
    // Implement report generation logic
    console.log('Generating performance report...');
  };

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    // Implement export logic
    console.log(`Exporting as ${format}...`);
  };

  const renderPerformanceAnalysis = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <FormControl sx={{ minWidth: 200, mb: 2 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="1W">1 Week</MenuItem>
            <MenuItem value="1M">1 Month</MenuItem>
            <MenuItem value="3M">3 Months</MenuItem>
            <MenuItem value="6M">6 Months</MenuItem>
            <MenuItem value="1Y">1 Year</MenuItem>
            <MenuItem value="YTD">Year to Date</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Portfolio Value Over Time</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={portfolioData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Daily Returns Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={portfolioData.dailyReturns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="frequency" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Asset Allocation</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData.assets}
                  dataKey="allocation"
                  nameKey="symbol"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {portfolioData.assets.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderRiskAnalysis = () => {
    const riskMetrics = calculateRiskMetrics();
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Risk Metrics</Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Sharpe Ratio</TableCell>
                      <TableCell align="right">{riskMetrics.sharpeRatio}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Volatility</TableCell>
                      <TableCell align="right">{riskMetrics.volatility}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Beta</TableCell>
                      <TableCell align="right">{riskMetrics.beta}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Alpha</TableCell>
                      <TableCell align="right">{riskMetrics.alpha}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Maximum Drawdown</TableCell>
                      <TableCell align="right">{riskMetrics.maxDrawdown}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Advanced Risk Metrics</Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Information Ratio</TableCell>
                      <TableCell align="right">{riskMetrics.informationRatio}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sortino Ratio</TableCell>
                      <TableCell align="right">{riskMetrics.sortinoRatio}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Tracking Error</TableCell>
                      <TableCell align="right">{riskMetrics.trackingError}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderCorrelationAnalysis = () => {
    const correlations = calculateCorrelations();
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Asset Correlations</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Asset 1</TableCell>
                      <TableCell>Asset 2</TableCell>
                      <TableCell align="right">Correlation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {correlations.map((correlation, index) => (
                      <TableRow key={index}>
                        <TableCell>{correlation.asset1}</TableCell>
                        <TableCell>{correlation.asset2}</TableCell>
                        <TableCell align="right">
                          {correlation.correlation.toFixed(2)}
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
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Portfolio Analytics
          <Box>
            <IconButton onClick={() => handleExport('pdf')} title="Export as PDF">
              <DownloadIcon />
            </IconButton>
            <IconButton onClick={() => handleExport('csv')} title="Export as CSV">
              <ShareIcon />
            </IconButton>
            <IconButton onClick={generatePerformanceReport} title="Print Report">
              <PrintIcon />
            </IconButton>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Performance Analysis" />
            <Tab label="Risk Analysis" />
            <Tab label="Correlation Analysis" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          {renderPerformanceAnalysis()}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderRiskAnalysis()}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {renderCorrelationAnalysis()}
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioAnalytics;
