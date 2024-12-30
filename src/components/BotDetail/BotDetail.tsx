import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Rating,
  Divider,
} from '@mui/material';
import {
  Timeline,
  Code,
  Settings,
  Description,
  Star,
} from '@mui/icons-material';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './BotDetail.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const mockPerformanceData = [
  { date: '2024-01', value: 10000, drawdown: -2 },
  { date: '2024-02', value: 12000, drawdown: -1.5 },
  { date: '2024-03', value: 11500, drawdown: -3 },
  { date: '2024-04', value: 13500, drawdown: -1 },
  { date: '2024-05', value: 15000, drawdown: -0.5 },
];

const mockTrades = [
  {
    id: 1,
    date: '2024-03-15',
    pair: 'EUR/USD',
    type: 'BUY',
    entry: 1.2150,
    exit: 1.2200,
    profit: 50,
    pips: 50,
  },
  // Add more mock trades
];

const BotDetail: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className="bot-detail">
      {/* Header Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card className="info-card">
            <CardContent>
              <Box className="bot-header">
                <Box>
                  <Typography variant="h4">Trend Follower Pro</Typography>
                  <Box className="bot-meta">
                    <Typography variant="subtitle1" color="text.secondary">
                      by TradingMaster
                    </Typography>
                    <Rating value={4.5} readOnly precision={0.5} />
                    <Typography variant="body2" color="text.secondary">
                      (128 reviews)
                    </Typography>
                  </Box>
                </Box>
                <Box className="bot-actions">
                  <Button variant="outlined" startIcon={<Settings />}>
                    Configure
                  </Button>
                  <Button variant="contained">
                    Purchase ($299)
                  </Button>
                </Box>
              </Box>
              <Box className="bot-tags">
                <Chip label="Trend Following" />
                <Chip label="Multi-timeframe" />
                <Chip label="Forex" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="stats-card">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Monthly Return
                  </Typography>
                  <Typography variant="h5" color="success.main">
                    +8.5%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Win Rate
                  </Typography>
                  <Typography variant="h5">
                    65%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Max Drawdown
                  </Typography>
                  <Typography variant="h5" color="error.main">
                    -3.2%
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Trades
                  </Typography>
                  <Typography variant="h5">
                    1,250
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs Section */}
      <Paper className="tabs-section">
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<Timeline />} label="Performance" />
          <Tab icon={<Description />} label="Description" />
          <Tab icon={<Code />} label="Parameters" />
          <Tab icon={<Star />} label="Reviews" />
        </Tabs>

        {/* Performance Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Equity Curve</Typography>
                  <Box className="performance-chart">
                    <ResponsiveContainer width="100%" height={300}>
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
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Trade History</Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Pair</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Entry</TableCell>
                          <TableCell>Exit</TableCell>
                          <TableCell>Pips</TableCell>
                          <TableCell>Profit/Loss</TableCell>
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
                            <TableCell>{trade.pips}</TableCell>
                            <TableCell
                              className={trade.profit >= 0 ? 'profit-positive' : 'profit-negative'}
                            >
                              ${trade.profit}
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

        {/* Description Tab */}
        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Typography variant="body1" paragraph>
                Trend Follower Pro is an advanced trading algorithm that combines multiple timeframe analysis with sophisticated trend detection techniques. The bot is designed to identify and follow strong market trends while managing risk through dynamic position sizing and drawdown control.
              </Typography>
              <Typography variant="h6" gutterBottom>
                Key Features
              </Typography>
              <ul>
                <li>Multi-timeframe trend analysis</li>
                <li>Dynamic position sizing</li>
                <li>Advanced risk management</li>
                <li>Automated trade execution</li>
                <li>Real-time performance monitoring</li>
              </ul>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Parameters Tab */}
        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configuration Parameters
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Parameter</TableCell>
                      <TableCell>Default Value</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Risk Per Trade</TableCell>
                      <TableCell>1%</TableCell>
                      <TableCell>Maximum risk per trade as a percentage of account balance</TableCell>
                    </TableRow>
                    {/* Add more parameters */}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>

        {/* Reviews Tab */}
        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Reviews
              </Typography>
              {/* Add review components here */}
            </CardContent>
          </Card>
        </TabPanel>
      </Paper>
    </div>
  );
};

export default BotDetail;
