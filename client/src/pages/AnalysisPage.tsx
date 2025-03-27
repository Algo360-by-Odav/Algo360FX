import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Stack,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Scatter,
  ScatterChart,
} from 'recharts';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreProvider';
import { 
  Download as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

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
      id={`analysis-tabpanel-${index}`}
      aria-labelledby={`analysis-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AnalysisPage: React.FC = observer(() => {
  const theme = useTheme();
  const { mt5Store } = useStores();
  const [selectedAccount, setSelectedAccount] = useState('');
  const [timeRange, setTimeRange] = useState('1M');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    if (selectedAccount) {
      fetchAnalysisData();
    }
  }, [selectedAccount, timeRange]);

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mt5Store.getAnalysisData(parseInt(selectedAccount), timeRange);
      setAnalysisData(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleExportData = () => {
    if (!analysisData) return;
    
    const jsonString = JSON.stringify(analysisData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading_analysis_${selectedAccount}_${timeRange}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderPerformanceMetrics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Performance Overview
            </Typography>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer>
                <BarChart data={analysisData?.performance || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar
                    dataKey="pnl"
                    name="P&L"
                    fill={theme.palette.primary.main}
                  />
                  <Bar
                    dataKey="balance"
                    name="Balance"
                    fill={theme.palette.success.main}
                  />
                  <Bar
                    dataKey="equity"
                    name="Equity"
                    fill={theme.palette.info.main}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Trading Pairs Analysis
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={analysisData?.tradingPairs || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="symbol" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="pnl"
                    name="P&L"
                    fill={theme.palette.primary.main}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="winRate"
                    name="Win Rate %"
                    fill={theme.palette.success.main}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Trading Volume Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={analysisData?.tradingPairs || []}
                    dataKey="volume"
                    nameKey="symbol"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {(analysisData?.tradingPairs || []).map((entry, index) => (
                      <Cell key={entry.symbol} fill={COLORS[index % COLORS.length]} />
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
    </Grid>
  );

  const renderRiskMetrics = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Risk Metrics
            </Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Tooltip title="Measures the risk-adjusted return of the trading strategy">
                      <span>Sharpe Ratio</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">{analysisData?.riskMetrics.sharpeRatio.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Tooltip title="Maximum observed peak-to-trough decline in portfolio value">
                      <span>Max Drawdown</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">{analysisData?.riskMetrics.maxDrawdown.toFixed(2)}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Tooltip title="Ratio of total profits to total losses">
                      <span>Profit Factor</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">{analysisData?.riskMetrics.profitFactor.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Tooltip title="Average profit per trade including both winners and losers">
                      <span>Expectancy</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">${analysisData?.riskMetrics.expectancy.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Tooltip title="Measures how quickly the strategy recovers from drawdowns">
                      <span>Recovery Factor</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">{analysisData?.riskMetrics.recoveryFactor.toFixed(2)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Tooltip title="Optimal fraction of capital to risk per trade">
                      <span>Kelly Ratio</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">{(analysisData?.riskMetrics.kellyRatio * 100).toFixed(2)}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Trading Statistics
            </Typography>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Total Trades</TableCell>
                  <TableCell align="right">{analysisData?.tradingStats.totalTrades}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Win Rate</TableCell>
                  <TableCell align="right">{analysisData?.tradingStats.winRate.toFixed(1)}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Win</TableCell>
                  <TableCell align="right">${analysisData?.tradingStats.avgWin}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Loss</TableCell>
                  <TableCell align="right">${analysisData?.tradingStats.avgLoss}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Average Holding Time</TableCell>
                  <TableCell align="right">{analysisData?.tradingStats.avgHoldingTime} min</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Best Performing Pair</TableCell>
                  <TableCell align="right">{analysisData?.tradingStats.bestPair}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Worst Performing Pair</TableCell>
                  <TableCell align="right">{analysisData?.tradingStats.worstPair}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTimeAnalysis = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Hourly Performance
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={analysisData?.timeAnalysis.hourlyPerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Legend />
                  <Bar
                    yAxisId="left"
                    dataKey="pnl"
                    name="P&L"
                    fill={theme.palette.primary.main}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="trades"
                    name="Number of Trades"
                    fill={theme.palette.success.main}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Daily Performance
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={analysisData?.timeAnalysis.dailyPerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="pnl" name="P&L" fill={theme.palette.primary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Monthly Performance
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={analysisData?.timeAnalysis.monthlyPerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pnl"
                    name="P&L"
                    stroke={theme.palette.primary.main}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderCorrelations = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Pair Correlations
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pair A</TableCell>
                    <TableCell>Pair B</TableCell>
                    <TableCell align="right">Correlation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analysisData?.correlations.map((correlation, index) => (
                    <TableRow key={index}>
                      <TableCell>{correlation.pairA}</TableCell>
                      <TableCell>{correlation.pairB}</TableCell>
                      <TableCell align="right">
                        <Box
                          component="span"
                          sx={{
                            color: correlation.correlation > 0 ? 'success.main' : 'error.main',
                            fontWeight: 'bold',
                          }}
                        >
                          {correlation.correlation.toFixed(2)}
                        </Box>
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

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5">
            Trading Analysis
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh Data">
              <span>
                <IconButton onClick={fetchAnalysisData} disabled={!selectedAccount || loading}>
                  <RefreshIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Export Analysis">
              <span>
                <IconButton onClick={handleExportData} disabled={!analysisData}>
                  <DownloadIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Account</InputLabel>
            <Select
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              label="Account"
            >
              {mt5Store.accounts?.map((account) => (
                <MenuItem key={account.login} value={account.login}>
                  {account.login} ({account.name})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="1W">1 Week</MenuItem>
              <MenuItem value="1M">1 Month</MenuItem>
              <MenuItem value="3M">3 Months</MenuItem>
              <MenuItem value="6M">6 Months</MenuItem>
              <MenuItem value="1Y">1 Year</MenuItem>
              <MenuItem value="ALL">All Time</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Performance" iconPosition="start" />
                <Tab label="Risk Analysis" iconPosition="start" />
                <Tab label="Time Analysis" iconPosition="start" />
                <Tab label="Correlations" iconPosition="start" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              {renderPerformanceMetrics()}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {renderRiskMetrics()}
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              {renderTimeAnalysis()}
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              {renderCorrelations()}
            </TabPanel>
          </>
        )}
      </Paper>
    </Box>
  );
});

export default AnalysisPage;
