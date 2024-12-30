import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Tab,
  Tabs,
  Paper,
  LinearProgress,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  MoreVert,
  PlayArrow,
  Stop,
  Settings,
} from '@mui/icons-material';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './Portfolio.css';

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
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const mockPerformanceData = [
  { date: '2024-01', value: 10000 },
  { date: '2024-02', value: 12000 },
  { date: '2024-03', value: 11500 },
  { date: '2024-04', value: 13500 },
  { date: '2024-05', value: 15000 },
];

const mockBots = [
  {
    id: 1,
    name: 'Trend Follower Pro',
    status: 'running',
    profit: 2500,
    profitPercent: 25,
    trades: 150,
    winRate: 65,
  },
  // Add more mock bots here
];

const mockTrades = [
  {
    id: 1,
    pair: 'EUR/USD',
    type: 'BUY',
    entry: 1.2150,
    exit: 1.2200,
    profit: 50,
    date: '2024-03-15',
    bot: 'Trend Follower Pro',
  },
  // Add more mock trades here
];

const Portfolio: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const totalBalance = 15000;
  const totalProfit = 5000;
  const profitPercent = 33.33;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="portfolio">
      {/* Overview Cards */}
      <Grid container spacing={3} className="overview-section">
        <Grid item xs={12} md={4}>
          <Card className="balance-card">
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Total Balance
              </Typography>
              <Typography variant="h4" component="div">
                ${totalBalance.toLocaleString()}
              </Typography>
              <Box className="profit-indicator positive">
                <TrendingUp />
                <Typography variant="body2">
                  +${totalProfit.toLocaleString()} ({profitPercent}%)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card className="chart-card">
            <CardContent>
              <Typography variant="subtitle1" color="text.secondary">
                Portfolio Performance
              </Typography>
              <Box className="performance-chart">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={mockPerformanceData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#90CAF9"
                      fill="#90CAF9"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Paper className="tabs-section">
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Active Bots" />
          <Tab label="Trade History" />
          <Tab label="Analytics" />
        </Tabs>

        {/* Active Bots Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {mockBots.map((bot) => (
              <Grid item xs={12} md={6} key={bot.id}>
                <Card className="bot-card">
                  <CardContent>
                    <Box className="bot-header">
                      <Typography variant="h6">{bot.name}</Typography>
                      <Box className="bot-controls">
                        <IconButton size="small">
                          {bot.status === 'running' ? <Stop /> : <PlayArrow />}
                        </IconButton>
                        <IconButton size="small">
                          <Settings />
                        </IconButton>
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box className="bot-stats">
                      <Box className="stat-item">
                        <Typography variant="body2" color="text.secondary">
                          Profit
                        </Typography>
                        <Typography
                          variant="h6"
                          color={bot.profit >= 0 ? 'success.main' : 'error.main'}
                        >
                          ${bot.profit.toLocaleString()}
                        </Typography>
                        <Typography
                          variant="body2"
                          color={bot.profit >= 0 ? 'success.main' : 'error.main'}
                        >
                          ({bot.profitPercent}%)
                        </Typography>
                      </Box>
                      <Box className="stat-item">
                        <Typography variant="body2" color="text.secondary">
                          Total Trades
                        </Typography>
                        <Typography variant="h6">{bot.trades}</Typography>
                      </Box>
                      <Box className="stat-item">
                        <Typography variant="body2" color="text.secondary">
                          Win Rate
                        </Typography>
                        <Typography variant="h6">{bot.winRate}%</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={bot.winRate}
                          className="win-rate-progress"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Trade History Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Pair</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Entry</TableCell>
                  <TableCell>Exit</TableCell>
                  <TableCell>Profit/Loss</TableCell>
                  <TableCell>Bot</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockTrades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>{trade.date}</TableCell>
                    <TableCell>{trade.pair}</TableCell>
                    <TableCell>{trade.type}</TableCell>
                    <TableCell>{trade.entry}</TableCell>
                    <TableCell>{trade.exit}</TableCell>
                    <TableCell
                      className={trade.profit >= 0 ? 'profit-positive' : 'profit-negative'}
                    >
                      ${trade.profit}
                    </TableCell>
                    <TableCell>{trade.bot}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body1">
            Detailed analytics coming soon...
          </Typography>
        </TabPanel>
      </Paper>
    </div>
  );
};

export default Portfolio;
