import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { marketService } from '../services/marketService';
import { AccountSummary } from '../components/dashboard/AccountSummary';
import { PositionsTable } from '../components/dashboard/PositionsTable';
import { MarketOverview } from '../components/dashboard/MarketOverview';
import type { MarketData, Position, MarketAlert } from '../services/marketService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [accountData, setAccountData] = useState<any>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data concurrently
      const [accountSummary, openPositions, marketData, marketAlerts] = await Promise.all([
        marketService.getAccountSummary(),
        marketService.getOpenPositions(),
        marketService.getMarketData(['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CHF']),
        marketService.getMarketAlerts(),
      ]);

      setAccountData(accountSummary);
      setPositions(openPositions);
      setMarkets(marketData);
      setAlerts(marketAlerts);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
      console.error('Dashboard data loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Set up periodic refresh
    const refreshInterval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  if (loading && !accountData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.username || 'Trader'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your portfolio today.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Account Summary */}
      {accountData && (
        <Box sx={{ mb: 4 }}>
          <AccountSummary data={accountData} />
        </Box>
      )}

      {/* Tabs Section */}
      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Open Positions" />
          <Tab label="Market Overview" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <PositionsTable positions={positions} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <MarketOverview markets={markets} />
        </TabPanel>
      </Paper>

      {/* Market Alerts */}
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Market Alerts
        </Typography>
        <Grid container spacing={2}>
          {alerts.map((alert) => (
            <Grid item xs={12} key={alert.id}>
              <Alert
                severity={
                  alert.priority === 'HIGH'
                    ? 'error'
                    : alert.priority === 'MEDIUM'
                    ? 'warning'
                    : 'info'
                }
              >
                <Typography variant="subtitle2">
                  {alert.symbol} - {alert.type}
                </Typography>
                <Typography variant="body2">{alert.message}</Typography>
              </Alert>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
