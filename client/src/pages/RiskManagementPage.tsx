import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tab,
  Tabs,
  Card,
  CardContent,
  useTheme,
  Button,
  Alert,
  Divider,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useStores } from '../stores/StoreProvider';
import RiskManagementForm from '../components/forms/RiskManagementForm';
import { LineChart } from '@mui/x-charts';
import dayjs from 'dayjs';

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
      id={`risk-tabpanel-${index}`}
      aria-labelledby={`risk-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const RiskManagementPage: React.FC = observer(() => {
  const theme = useTheme();
  const { tradingStore } = useStores();
  const [currentTab, setCurrentTab] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  // Mock data for visualization
  const mockEquityCurve = Array.from({ length: 100 }, (_, i) => ({
    date: dayjs().subtract(100 - i, 'days').toISOString(),
    equity: 100000 * (1 + 0.001 * i + 0.1 * Math.sin(i / 10)),
    drawdown: -Math.abs(5000 * Math.sin(i / 15)),
  }));

  const mockRiskMetrics = {
    currentDrawdown: -4.2,
    maxDrawdown: -12.5,
    sharpeRatio: 1.8,
    sortinoRatio: 2.1,
    valueAtRisk: 2500,
    expectedShortfall: 3200,
    marginUtilization: 15.5,
    leverageUtilization: 2.3,
    correlationScore: 0.65,
    volatilityScore: 1.2,
  };

  const mockPositionSizing = {
    accountBalance: 100000,
    availableMargin: 85000,
    usedMargin: 15000,
    openPositions: 3,
    maxAllowedPositions: 5,
    averagePositionSize: 5000,
    largestPosition: 8000,
    riskPerTrade: 500,
    dailyLossLimit: 2000,
    remainingDailyLimit: 1500,
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleEmergencyClose = () => {
    setShowAlert(true);
    // Implement emergency close logic here
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              Risk Management Dashboard
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={handleEmergencyClose}
            >
              Emergency Close All Positions
            </Button>
          </Box>
          {showAlert && (
            <Alert severity="warning" sx={{ mt: 2 }} onClose={() => setShowAlert(false)}>
              Emergency close initiated. Closing all open positions...
            </Alert>
          )}
        </Grid>

        {/* Risk Overview Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Current Drawdown
                  </Typography>
                  <Typography variant="h4" component="div" color={mockRiskMetrics.currentDrawdown > -5 ? 'success.main' : 'error.main'}>
                    {mockRiskMetrics.currentDrawdown}%
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
                  <Typography variant="h4" component="div" color={mockRiskMetrics.marginUtilization < 25 ? 'success.main' : 'warning.main'}>
                    {mockRiskMetrics.marginUtilization}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Value at Risk (Daily)
                  </Typography>
                  <Typography variant="h4" component="div">
                    ${mockRiskMetrics.valueAtRisk.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Remaining Daily Limit
                  </Typography>
                  <Typography variant="h4" component="div" color={mockPositionSizing.remainingDailyLimit > 1000 ? 'success.main' : 'error.main'}>
                    ${mockPositionSizing.remainingDailyLimit.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Risk Settings" />
              <Tab label="Position Analysis" />
              <Tab label="Risk Metrics" />
              <Tab label="Historical Analysis" />
            </Tabs>

            {/* Risk Settings Tab */}
            <TabPanel value={currentTab} index={0}>
              <RiskManagementForm />
            </TabPanel>

            {/* Position Analysis Tab */}
            <TabPanel value={currentTab} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Position Sizing Overview
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Account Balance</Typography>
                          <Typography variant="h6">
                            ${mockPositionSizing.accountBalance.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Available Margin</Typography>
                          <Typography variant="h6">
                            ${mockPositionSizing.availableMargin.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Open Positions</Typography>
                          <Typography variant="h6">
                            {mockPositionSizing.openPositions} / {mockPositionSizing.maxAllowedPositions}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Average Position Size</Typography>
                          <Typography variant="h6">
                            ${mockPositionSizing.averagePositionSize.toLocaleString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Risk Allocation
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Risk per Trade</Typography>
                          <Typography variant="h6">
                            ${mockPositionSizing.riskPerTrade.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Daily Loss Limit</Typography>
                          <Typography variant="h6">
                            ${mockPositionSizing.dailyLossLimit.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Used Margin</Typography>
                          <Typography variant="h6">
                            ${mockPositionSizing.usedMargin.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Largest Position</Typography>
                          <Typography variant="h6">
                            ${mockPositionSizing.largestPosition.toLocaleString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Risk Metrics Tab */}
            <TabPanel value={currentTab} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Performance Metrics
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Sharpe Ratio</Typography>
                          <Typography variant="h6">{mockRiskMetrics.sharpeRatio}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Sortino Ratio</Typography>
                          <Typography variant="h6">{mockRiskMetrics.sortinoRatio}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Max Drawdown</Typography>
                          <Typography variant="h6" color="error.main">
                            {mockRiskMetrics.maxDrawdown}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Expected Shortfall</Typography>
                          <Typography variant="h6">
                            ${mockRiskMetrics.expectedShortfall.toLocaleString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Risk Exposure
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Leverage Utilization</Typography>
                          <Typography variant="h6">{mockRiskMetrics.leverageUtilization}x</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Correlation Score</Typography>
                          <Typography variant="h6">{mockRiskMetrics.correlationScore}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Volatility Score</Typography>
                          <Typography variant="h6">{mockRiskMetrics.volatilityScore}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography color="textSecondary">Value at Risk</Typography>
                          <Typography variant="h6">
                            ${mockRiskMetrics.valueAtRisk.toLocaleString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Historical Analysis Tab */}
            <TabPanel value={currentTab} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Equity Curve & Drawdown
                      </Typography>
                      <Box sx={{ width: '100%', height: 400 }}>
                        <LineChart
                          xAxis={[{ 
                            data: mockEquityCurve.map((_, i) => i),
                            scaleType: 'linear',
                          }]}
                          series={[
                            {
                              data: mockEquityCurve.map(point => point.equity),
                              area: true,
                              label: 'Equity',
                            },
                            {
                              data: mockEquityCurve.map(point => point.drawdown),
                              label: 'Drawdown',
                              color: 'error.main',
                            },
                          ]}
                          height={350}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
});

export default RiskManagementPage;

