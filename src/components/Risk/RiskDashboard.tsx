import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import {
  Refresh,
  MoreVert,
  Warning,
  Error,
  Info,
  CheckCircle,
  Timeline,
  ShowChart,
  Assessment,
  Notifications,
} from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../stores/RootStoreContext";
import RiskCharts from "./RiskCharts";
import RiskAlerts from "./RiskAlerts";

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
      id={`risk-tabpanel-${index}`}
      aria-labelledby={`risk-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

export const RiskDashboard = observer(() => {
  const rootStore = useRootStore();
  const { riskStore } = rootStore;
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("1D");

  useEffect(() => {
    riskStore.startMonitoring();
    return () => riskStore.stopMonitoring();
  }, [riskStore]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
    handleMenuClose();
  };

  const renderOverviewTab = () => {
    const metrics = riskStore.metrics;
    const currencyRisk = riskStore.currencyRisk;

    return (
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Key Risk Metrics
            </Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Portfolio Volatility</TableCell>
                  <TableCell>{(metrics.volatility * 100).toFixed(2)}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Value at Risk (95%)</TableCell>
                  <TableCell>{(metrics.valueAtRisk * 100).toFixed(2)}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Expected Shortfall</TableCell>
                  <TableCell>
                    {(metrics.expectedShortfall * 100).toFixed(2)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Beta</TableCell>
                  <TableCell>{metrics.beta.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Currency Risk Exposure
            </Typography>
            <Table size="small">
              <TableBody>
                {Object.entries(currencyRisk.exposureByBase).map(
                  ([currency, exposure]) => (
                    <TableRow key={currency}>
                      <TableCell>{currency}</TableCell>
                      <TableCell>{exposure.toFixed(2)}</TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Drawdown Analysis
            </Typography>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>Current Drawdown</TableCell>
                  <TableCell>
                    {(metrics.drawdown.current * 100).toFixed(2)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Maximum Drawdown</TableCell>
                  <TableCell>
                    {(metrics.drawdown.maximum * 100).toFixed(2)}%
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Drawdown Duration</TableCell>
                  <TableCell>{metrics.drawdown.duration} days</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Risk Management Dashboard</Typography>
        <Box>
          <Button
            variant="outlined"
            onClick={() => riskStore.refreshMetrics()}
            startIcon={<Refresh />}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            onClick={handleMenuOpen}
            endIcon={<MoreVert />}
          >
            {selectedTimeRange}
          </Button>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            {["1D", "1W", "1M", "3M", "6M", "1Y"].map((range) => (
              <MenuItem
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                selected={range === selectedTimeRange}
              >
                {range}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab
            icon={<Assessment />}
            iconPosition="start"
            label="Overview"
            sx={{ minHeight: 48 }}
          />
          <Tab
            icon={<Timeline />}
            iconPosition="start"
            label="Analysis"
            sx={{ minHeight: 48 }}
          />
          <Tab
            icon={<Notifications />}
            iconPosition="start"
            label="Alerts"
            sx={{ minHeight: 48 }}
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        {renderOverviewTab()}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <RiskCharts timeRange={selectedTimeRange} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <RiskAlerts />
      </TabPanel>
    </Box>
  );
});

export default RiskDashboard;
