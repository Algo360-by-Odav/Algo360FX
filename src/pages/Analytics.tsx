import React, { useState } from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tabs,
  Tab,
  useTheme,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import PerformanceAnalyticsWidget from '@components/Analytics/PerformanceAnalyticsWidget';
import RiskCalculatorWidget from '@components/Risk/RiskCalculatorWidget';
import AdvancedAnalyticsDashboard from '@components/Analytics/AdvancedAnalytics/AdvancedAnalyticsDashboard';

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
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const Analytics: React.FC = observer(() => {
  const theme = useTheme();
  const [timeframe, setTimeframe] = useState('1M');
  const [account, setAccount] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  const handleTimeframeChange = (event: SelectChangeEvent) => {
    setTimeframe(event.target.value);
  };

  const handleAccountChange = (event: SelectChangeEvent) => {
    setAccount(event.target.value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box 
      sx={{ 
        flexGrow: 1, 
        bgcolor: theme.palette.background.default,
        minHeight: '100vh',
        p: 2,
      }}
    >
      <Grid container spacing={2}>
        {/* Filters */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 2,
              p: 2,
              bgcolor: theme.palette.background.paper,
              borderRadius: 1,
              boxShadow: theme.shadows[1],
            }}
          >
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Timeframe</InputLabel>
              <Select
                value={timeframe}
                label="Timeframe"
                onChange={handleTimeframeChange}
              >
                <MenuItem value="1W">1 Week</MenuItem>
                <MenuItem value="1M">1 Month</MenuItem>
                <MenuItem value="3M">3 Months</MenuItem>
                <MenuItem value="6M">6 Months</MenuItem>
                <MenuItem value="1Y">1 Year</MenuItem>
                <MenuItem value="ALL">All Time</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Account</InputLabel>
              <Select
                value={account}
                label="Account"
                onChange={handleAccountChange}
              >
                <MenuItem value="all">All Accounts</MenuItem>
                <MenuItem value="main">Main Account</MenuItem>
                <MenuItem value="demo">Demo Account</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        {/* Tabs */}
        <Grid item xs={12}>
          <Box 
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              bgcolor: theme.palette.background.paper,
              borderRadius: '4px 4px 0 0',
              boxShadow: theme.shadows[1],
            }}
          >
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  minWidth: 120,
                  fontWeight: 'medium',
                },
              }}
            >
              <Tab label="Performance Overview" />
              <Tab label="Advanced Analytics" />
            </Tabs>
          </Box>
        </Grid>

        {/* Performance Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            {/* Performance Analytics */}
            <Grid item xs={12}>
              <PerformanceAnalyticsWidget />
            </Grid>

            {/* Risk Metrics */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: '100%',
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 1,
                  boxShadow: theme.shadows[1],
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Risk Metrics
                  </Typography>
                  <RiskCalculatorWidget />
                </Box>
              </Card>
            </Grid>

            {/* Strategy Performance */}
            <Grid item xs={12} md={6}>
              <Card 
                sx={{ 
                  height: '100%',
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 1,
                  boxShadow: theme.shadows[1],
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Strategy Performance
                  </Typography>
                  {/* Add strategy performance component */}
                </Box>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Advanced Analytics Tab */}
        <TabPanel value={tabValue} index={1}>
          <AdvancedAnalyticsDashboard />
        </TabPanel>
      </Grid>
    </Box>
  );
});

export default Analytics;
