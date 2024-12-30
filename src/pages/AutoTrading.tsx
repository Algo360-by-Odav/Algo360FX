import React, { useState } from 'react';
import { Box, Container, Grid, Tab, Tabs, useTheme, Paper, Typography, List, ListItem, ListItemIcon, ListItemText, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormGroup, FormControlLabel, Switch, Card, CardContent, LinearProgress } from '@mui/material';
import { observer } from 'mobx-react-lite';
import ErrorBoundary from '@components/error/ErrorBoundary';
import { useRootStore } from '@/hooks/useRootStore';
import {
  ShowChart as ShowChartIcon,
  TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  CallMade as CallMadeIcon,
  CompareArrows as CompareArrowsIcon,
  CallReceived as CallReceivedIcon,
  Block as BlockIcon,
  Save as SaveIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';

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
} from '@components/AutoTrading';

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
  const { algoTradingStore } = useRootStore();
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
            {/* Strategy Builder Controls */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Strategy Components
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Technical Indicators
                  </Typography>
                  <List dense>
                    {/* Trend Indicators */}
                    <ListItem>
                      <Typography variant="subtitle2" color="primary">Trend Indicators</Typography>
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <ShowChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Moving Averages" secondary="SMA, EMA, WMA, DEMA, TEMA" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <TrendingUpIcon />
                      </ListItemIcon>
                      <ListItemText primary="Moving Average Convergence Divergence" secondary="MACD" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <ShowChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Parabolic SAR" secondary="Stop and Reverse" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <TrendingUpIcon />
                      </ListItemIcon>
                      <ListItemText primary="Average Directional Index" secondary="ADX, +DI, -DI" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <ShowChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Ichimoku Cloud" secondary="Tenkan, Kijun, Senkou Span A/B" />
                    </ListItem>

                    {/* Momentum Indicators */}
                    <ListItem>
                      <Typography variant="subtitle2" color="primary">Momentum Indicators</Typography>
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <TimelineIcon />
                      </ListItemIcon>
                      <ListItemText primary="Relative Strength Index" secondary="RSI" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <ShowChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Stochastic Oscillator" secondary="Fast, Slow, Full" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <TimelineIcon />
                      </ListItemIcon>
                      <ListItemText primary="Commodity Channel Index" secondary="CCI" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <ShowChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Williams %R" secondary="Williams Percent Range" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <TimelineIcon />
                      </ListItemIcon>
                      <ListItemText primary="Rate of Change" secondary="ROC, Momentum" />
                    </ListItem>

                    {/* Volatility Indicators */}
                    <ListItem>
                      <Typography variant="subtitle2" color="primary">Volatility Indicators</Typography>
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <ShowChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Bollinger Bands" secondary="Standard Deviations" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <TimelineIcon />
                      </ListItemIcon>
                      <ListItemText primary="Average True Range" secondary="ATR" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <ShowChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Keltner Channel" secondary="ATR-based Bands" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <TimelineIcon />
                      </ListItemIcon>
                      <ListItemText primary="Standard Deviation" secondary="Volatility Measure" />
                    </ListItem>

                    {/* Volume Indicators */}
                    <ListItem>
                      <Typography variant="subtitle2" color="primary">Volume Indicators</Typography>
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <BarChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="On Balance Volume" secondary="OBV" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <BarChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Money Flow Index" secondary="MFI" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <BarChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Accumulation/Distribution" secondary="A/D Line" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <BarChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Chaikin Money Flow" secondary="CMF" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <BarChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Volume Profile" secondary="VPVR" />
                    </ListItem>

                    {/* Price Action Indicators */}
                    <ListItem>
                      <Typography variant="subtitle2" color="primary">Price Action Indicators</Typography>
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <ShowChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Pivot Points" secondary="Standard, Fibonacci, Camarilla" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <TimelineIcon />
                      </ListItemIcon>
                      <ListItemText primary="Fibonacci Tools" secondary="Retracements, Extensions" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <ShowChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Support/Resistance" secondary="Auto-detected Levels" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <TimelineIcon />
                      </ListItemIcon>
                      <ListItemText primary="Price Channels" secondary="Donchian Channels" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <ShowChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Candlestick Patterns" secondary="Doji, Engulfing, etc." />
                    </ListItem>

                    {/* Custom/Advanced Indicators */}
                    <ListItem>
                      <Typography variant="subtitle2" color="primary">Custom/Advanced Indicators</Typography>
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <TimelineIcon />
                      </ListItemIcon>
                      <ListItemText primary="Correlation" secondary="Multi-Asset Analysis" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <ShowChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Regression" secondary="Linear, Polynomial" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <TimelineIcon />
                      </ListItemIcon>
                      <ListItemText primary="Machine Learning" secondary="ML-based Predictions" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <ShowChartIcon />
                      </ListItemIcon>
                      <ListItemText primary="Sentiment Analysis" secondary="Market Sentiment Indicators" />
                    </ListItem>
                  </List>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Entry Rules
                  </Typography>
                  <List dense>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <CallMadeIcon />
                      </ListItemIcon>
                      <ListItemText primary="Price Action" secondary="Breakout, Reversal" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <CompareArrowsIcon />
                      </ListItemIcon>
                      <ListItemText primary="Indicator Cross" secondary="Golden Cross, Death Cross" />
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Exit Rules
                  </Typography>
                  <List dense>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <CallReceivedIcon />
                      </ListItemIcon>
                      <ListItemText primary="Take Profit" secondary="Fixed, Trailing" />
                    </ListItem>
                    <ListItem button draggable>
                      <ListItemIcon>
                        <BlockIcon />
                      </ListItemIcon>
                      <ListItemText primary="Stop Loss" secondary="Fixed, ATR-based" />
                    </ListItem>
                  </List>
                </Box>
              </Paper>
            </Grid>

            {/* Strategy Builder Canvas */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Strategy Builder
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<SaveIcon />}
                      size="small"
                    >
                      Save Strategy
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PlayArrowIcon />}
                      size="small"
                      color="success"
                    >
                      Test Strategy
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Strategy Name"
                    variant="outlined"
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    size="small"
                    multiline
                    rows={2}
                  />
                </Box>

                {/* Strategy Flow Builder */}
                <Box
                  sx={{
                    height: 400,
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography color="text.secondary" align="center" gutterBottom>
                    Drag and drop strategy components here
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Connect components to build your trading logic
                  </Typography>
                </Box>

                {/* Strategy Parameters */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Strategy Parameters
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Timeframe</InputLabel>
                        <Select
                          value="H1"
                          label="Timeframe"
                        >
                          <MenuItem value="M5">5 Minutes</MenuItem>
                          <MenuItem value="M15">15 Minutes</MenuItem>
                          <MenuItem value="H1">1 Hour</MenuItem>
                          <MenuItem value="H4">4 Hours</MenuItem>
                          <MenuItem value="D1">Daily</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Risk per Trade</InputLabel>
                        <Select
                          value="1"
                          label="Risk per Trade"
                        >
                          <MenuItem value="0.5">0.5%</MenuItem>
                          <MenuItem value="1">1%</MenuItem>
                          <MenuItem value="2">2%</MenuItem>
                          <MenuItem value="3">3%</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormGroup>
                        <FormControlLabel
                          control={<Switch />}
                          label="Enable position sizing"
                        />
                        <FormControlLabel
                          control={<Switch />}
                          label="Use trailing stop loss"
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>

            {/* Strategy Performance */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Strategy Performance
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Win Rate
                        </Typography>
                        <Typography variant="h4">65%</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={65}
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Profit Factor
                        </Typography>
                        <Typography variant="h4">1.85</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={85}
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Max Drawdown
                        </Typography>
                        <Typography variant="h4">12%</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={88}
                          color="error"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Card>
                      <CardContent>
                        <Typography color="text.secondary" gutterBottom>
                          Sharpe Ratio
                        </Typography>
                        <Typography variant="h4">1.92</Typography>
                        <LinearProgress
                          variant="determinate"
                          value={92}
                          color="success"
                          sx={{ mt: 1 }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
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

