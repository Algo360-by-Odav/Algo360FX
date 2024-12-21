import React, { useState } from 'react';
import { Box, Container, Grid, Tab, Tabs, useTheme } from '@mui/material';
import { observer } from 'mobx-react-lite';
import ErrorBoundary from '../components/error/ErrorBoundary';
import { useRootStoreContext } from '../stores/RootStoreContext';

// Import components directly without lazy loading
import {
  StrategyMarketplace,
  ActiveStrategiesWidget,
  MT5ConnectionWidget,
  StrategyPerformanceWidget,
  BacktestingWidget,
  AdvancedMT5Widget,
  StrategyCustomizationWidget,
  PortfolioAnalyticsWidget,
  RiskManagementWidget,
  NotificationsWidget,
  StrategyDocumentationWidget,
  AdvancedReportingWidget,
  MarketAnalysisWidget,
  StrategyComparisonWidget,
  AutomatedStrategySelectionWidget,
} from '../components/AutoTrading';

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
      id={`auto-trading-tabpanel-${index}`}
      aria-labelledby={`auto-trading-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const AutoTrading: React.FC = observer(() => {
  const theme = useTheme();
  const { algoTradingStore } = useRootStoreContext();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ width: '100%', mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="Auto Trading tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Overview" />
            <Tab label="Strategy Builder" />
            <Tab label="Marketplace" />
            <Tab label="Performance" />
            <Tab label="Risk Management" />
          </Tabs>
        </Box>

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ErrorBoundary>
                <AdvancedMT5Widget />
              </ErrorBoundary>
            </Grid>

            <Grid item xs={12}>
              <ErrorBoundary>
                <MarketAnalysisWidget />
              </ErrorBoundary>
            </Grid>

            <Grid item xs={12}>
              <ErrorBoundary>
                <AutomatedStrategySelectionWidget />
              </ErrorBoundary>
            </Grid>

            <Grid item xs={12} lg={8}>
              <ErrorBoundary>
                <ActiveStrategiesWidget />
              </ErrorBoundary>
            </Grid>

            <Grid item xs={12} lg={4}>
              <ErrorBoundary>
                <NotificationsWidget />
              </ErrorBoundary>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Strategy Builder Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ErrorBoundary>
                <StrategyCustomizationWidget />
              </ErrorBoundary>
            </Grid>

            <Grid item xs={12}>
              <ErrorBoundary>
                <BacktestingWidget />
              </ErrorBoundary>
            </Grid>

            <Grid item xs={12}>
              <ErrorBoundary>
                <StrategyDocumentationWidget />
              </ErrorBoundary>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Marketplace Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ErrorBoundary>
                <StrategyMarketplace />
              </ErrorBoundary>
            </Grid>

            <Grid item xs={12}>
              <ErrorBoundary>
                <StrategyComparisonWidget />
              </ErrorBoundary>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Performance Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ErrorBoundary>
                <StrategyPerformanceWidget />
              </ErrorBoundary>
            </Grid>

            <Grid item xs={12}>
              <ErrorBoundary>
                <PortfolioAnalyticsWidget />
              </ErrorBoundary>
            </Grid>

            <Grid item xs={12}>
              <ErrorBoundary>
                <AdvancedReportingWidget />
              </ErrorBoundary>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Risk Management Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <ErrorBoundary>
                <RiskManagementWidget />
              </ErrorBoundary>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>
    </Container>
  );
});

export default AutoTrading;
