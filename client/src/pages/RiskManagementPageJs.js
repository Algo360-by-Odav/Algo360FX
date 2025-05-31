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
  Button,
  Alert,
} from '@mui/material';
import { observer } from 'mobx-react-lite';

// Simple Tab Panel component
function TabPanel(props) {
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

// Simple Risk Management Page
const RiskManagementPageJs = observer(() => {
  const [currentTab, setCurrentTab] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const handleTabChange = (_, newValue) => {
    setCurrentTab(newValue);
  };

  const handleEmergencyClose = () => {
    setShowAlert(true);
    // Implement emergency close logic here
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
      <Grid container spacing={3}>
        {/* Alert for emergency close */}
        <Grid item xs={12}>
          {showAlert && (
            <Alert severity="warning" sx={{ mt: 2, mb: 2 }} onClose={() => setShowAlert(false)}>
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
                  <Typography variant="h4" component="div" color="error.main">
                    -3.2%
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
                  <Typography variant="h4" component="div" color="success.main">
                    18.5%
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
                    $1,250.75
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Account Balance
                  </Typography>
                  <Typography variant="h4" component="div">
                    $25,000.00
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Tabs */}
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
              <Tab label="Position Sizing" />
              <Tab label="Risk Metrics" />
              <Tab label="Historical Analysis" />
            </Tabs>

            {/* Risk Settings Tab */}
            <TabPanel value={currentTab} index={0}>
              <Box sx={{ p: 3 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Risk Management Settings
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Risk management settings are temporarily unavailable.
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    We're working on improving this feature. Please check back later.
                  </Typography>
                  <Button variant="contained" disabled>
                    Save Settings
                  </Button>
                </Paper>
              </Box>
            </TabPanel>

            {/* Position Sizing Tab */}
            <TabPanel value={currentTab} index={1}>
              <Typography variant="h6">Position Sizing Settings</Typography>
              <Typography variant="body1">
                Position sizing settings are temporarily unavailable.
              </Typography>
            </TabPanel>

            {/* Risk Metrics Tab */}
            <TabPanel value={currentTab} index={2}>
              <Typography variant="h6">Risk Metrics</Typography>
              <Typography variant="body1">
                Risk metrics are temporarily unavailable.
              </Typography>
            </TabPanel>

            {/* Historical Analysis Tab */}
            <TabPanel value={currentTab} index={3}>
              <Typography variant="h6">Historical Analysis</Typography>
              <Typography variant="body1">
                Historical analysis is temporarily unavailable.
              </Typography>
            </TabPanel>
          </Paper>
        </Grid>
        
        {/* Emergency Close Button at bottom right */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleEmergencyClose}
              size="large"
              sx={{ fontWeight: 'bold', px: 3, py: 1.5 }}
            >
              Emergency Close All Positions
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
});

export default RiskManagementPageJs;
