import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Download,
  PictureAsPdf,
  TableChart,
  Share,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useStores } from '../../stores/StoreProvider';

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
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

export const Reports = observer(() => {
  const { moneyManagerStore } = useStores();
  const [activeTab, setActiveTab] = useState(0);
  const [timeframe, setTimeframe] = useState('1M');

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleExport = (format: string) => {
    // TODO: Implement export functionality
    console.log(`Exporting as ${format}`);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Report Controls */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Timeframe</InputLabel>
          <Select
            value={timeframe}
            label="Timeframe"
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <MenuItem value="1W">1 Week</MenuItem>
            <MenuItem value="1M">1 Month</MenuItem>
            <MenuItem value="3M">3 Months</MenuItem>
            <MenuItem value="6M">6 Months</MenuItem>
            <MenuItem value="1Y">1 Year</MenuItem>
            <MenuItem value="YTD">Year to Date</MenuItem>
          </Select>
        </FormControl>
        <Box>
          <IconButton onClick={() => handleExport('pdf')} title="Export as PDF">
            <PictureAsPdf />
          </IconButton>
          <IconButton onClick={() => handleExport('excel')} title="Export as Excel">
            <TableChart />
          </IconButton>
          <IconButton onClick={() => handleExport('share')} title="Share Report">
            <Share />
          </IconButton>
        </Box>
      </Box>

      {/* Report Navigation */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Trade Reports" />
          <Tab label="Performance Summary" />
          <Tab label="Risk Analysis" />
        </Tabs>
      </Paper>

      {/* Trade Reports */}
      <TabPanel value={activeTab} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Pair</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Entry</TableCell>
                <TableCell align="right">Exit</TableCell>
                <TableCell align="right">Pips</TableCell>
                <TableCell align="right">Volume</TableCell>
                <TableCell align="right">P/L</TableCell>
                <TableCell align="right">Duration</TableCell>
                <TableCell>Strategy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {moneyManagerStore.getTradeReports().map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell>{trade.date}</TableCell>
                  <TableCell>{trade.pair}</TableCell>
                  <TableCell>
                    <Typography
                      color={trade.type === 'BUY' ? 'success.main' : 'error.main'}
                    >
                      {trade.type}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">{trade.entry}</TableCell>
                  <TableCell align="right">{trade.exit}</TableCell>
                  <TableCell align="right">{trade.pips}</TableCell>
                  <TableCell align="right">{trade.volume}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color:
                        trade.profitLoss > 0 ? 'success.main' : 'error.main',
                    }}
                  >
                    {formatCurrency(trade.profitLoss)}
                  </TableCell>
                  <TableCell align="right">{trade.duration}</TableCell>
                  <TableCell>{trade.strategy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Performance Summary */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          {/* Performance Metrics */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Performance Metrics
              </Typography>
              <Grid container spacing={2}>
                {moneyManagerStore.getPerformanceReports().map((report) => (
                  <React.Fragment key={report.period}>
                    <Grid item xs={12} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Net Profit
                          </Typography>
                          <Typography variant="h5" color={report.netProfit > 0 ? 'success.main' : 'error.main'}>
                            {formatCurrency(report.netProfit)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Win Rate
                          </Typography>
                          <Typography variant="h5">
                            {report.winRate}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Profit Factor
                          </Typography>
                          <Typography variant="h5">
                            {report.profitFactor}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Total Trades
                          </Typography>
                          <Typography variant="h5">
                            {report.totalTrades}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Profitable Pairs Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Performance by Currency Pair
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={moneyManagerStore.getPerformanceReports()[0]?.profitablePairs}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="pair" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="profit"
                      fill="#8884d8"
                      name="Profit"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Risk Analysis */}
      <TabPanel value={activeTab} index={2}>
        <Grid container spacing={3}>
          {/* Risk Metrics */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Risk Metrics
              </Typography>
              <Grid container spacing={2}>
                {moneyManagerStore.getRiskReports().map((report) => (
                  <React.Fragment key={report.date}>
                    <Grid item xs={12} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Value at Risk
                          </Typography>
                          <Typography variant="h5">
                            {formatCurrency(report.valueAtRisk)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Margin Utilization
                          </Typography>
                          <Typography variant="h5">
                            {report.marginUtilization}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Sharpe Ratio
                          </Typography>
                          <Typography variant="h5">
                            {report.sharpeRatio}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Sortino Ratio
                          </Typography>
                          <Typography variant="h5">
                            {report.sortinoRatio}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Paper>
          </Grid>

          {/* Exposure by Pair */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Exposure by Currency Pair
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer>
                  <BarChart
                    data={moneyManagerStore.getRiskReports()[0]?.exposureByPair}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="pair" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="exposure"
                      fill="#82ca9d"
                      name="Exposure"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Correlation Matrix */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Correlation Matrix
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Pair 1</TableCell>
                      <TableCell>Pair 2</TableCell>
                      <TableCell align="right">Correlation</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {moneyManagerStore.getRiskReports()[0]?.correlations.map((corr, index) => (
                      <TableRow key={index}>
                        <TableCell>{corr.pair1}</TableCell>
                        <TableCell>{corr.pair2}</TableCell>
                        <TableCell align="right">{corr.correlation}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  );
});

