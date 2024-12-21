import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStoreContext } from '../../stores/RootStoreContext';
import { StockAnalysis as StockAnalysisType } from '../../stores/StockMarketStore';
import PerformanceChart from '../charts/PerformanceChart';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const StockAnalysisComponent: React.FC<{ symbol: string }> = observer(({ symbol }) => {
  const { stockMarketStore } = useRootStoreContext();
  const [tabValue, setTabValue] = useState(0);

  const analysis = stockMarketStore.getAnalysis(symbol);
  const stock = stockMarketStore.stocks.get(symbol);

  if (!analysis || !stock) return null;

  const getRecommendationColor = (recommendation: StockAnalysisType['recommendation']) => {
    switch (recommendation) {
      case 'Strong Buy':
      case 'Buy':
        return 'success';
      case 'Hold':
        return 'warning';
      default:
        return 'error';
    }
  };

  const renderMetricCard = (label: string, value: number, format: string = 'number', threshold?: { low: number; high: number }) => {
    let formattedValue = value;
    if (format === 'percent') {
      formattedValue = value * 100;
    }

    let color = 'default';
    if (threshold) {
      if (value < threshold.low) color = 'error';
      else if (value > threshold.high) color = 'success';
      else color = 'warning';
    }

    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary" gutterBottom>
            {label}
          </Typography>
          <Typography
            variant="h6"
            color={color === 'default' ? 'inherit' : `${color}.main`}
          >
            {format === 'percent'
              ? `${formattedValue.toFixed(2)}%`
              : formattedValue.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {stock.name} ({stock.symbol})
            </Typography>
            <Typography variant="h4" gutterBottom>
              ${stock.price.toFixed(2)}
              <Typography
                component="span"
                variant="h6"
                color={stock.change >= 0 ? 'success.main' : 'error.main'}
                sx={{ ml: 1 }}
              >
                {stock.change >= 0 ? '+' : ''}
                {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
              </Typography>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'right' }}>
              <Chip
                label={analysis.recommendation}
                color={getRecommendationColor(analysis.recommendation)}
                icon={analysis.recommendation.includes('Buy') ? <TrendingUpIcon /> : <TrendingDownIcon />}
                sx={{ mb: 1 }}
              />
              <Typography variant="body1">
                Target Price: ${analysis.targetPrice.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Risk Level: {analysis.riskLevel}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Analysis Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Technical Analysis" icon={<TimelineIcon />} />
          <Tab label="Fundamental Analysis" icon={<AssessmentIcon />} />
          <Tab label="Comparative Analysis" icon={<AnalyticsIcon />} />
        </Tabs>

        {/* Technical Analysis */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Technical Indicators
              </Typography>
              <Grid container spacing={2}>
                {renderMetricCard('RSI (14)', analysis.technicals.rsi, 'number', { low: 30, high: 70 })}
                {renderMetricCard('MACD', analysis.technicals.macd, 'number')}
                {renderMetricCard('50-Day MA', analysis.technicals.movingAverage50, 'number')}
                {renderMetricCard('200-Day MA', analysis.technicals.movingAverage200, 'number')}
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Price Action
              </Typography>
              <PerformanceChart
                data={{
                  labels: ['1D', '5D', '1M', '3M', '6M', '1Y'],
                  datasets: [
                    {
                      label: stock.symbol,
                      data: [100, 102, 98, 104, 101, 106],
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1,
                    },
                  ],
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Fundamental Analysis */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Key Metrics
              </Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>P/E Ratio</TableCell>
                      <TableCell align="right">{analysis.fundamentals.peRatio.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>P/B Ratio</TableCell>
                      <TableCell align="right">{analysis.fundamentals.pbRatio.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>EPS</TableCell>
                      <TableCell align="right">${analysis.fundamentals.eps.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Debt to Equity</TableCell>
                      <TableCell align="right">{analysis.fundamentals.debtToEquity.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Dividend Yield</TableCell>
                      <TableCell align="right">{(analysis.fundamentals.dividendYield * 100).toFixed(2)}%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Growth Metrics
              </Typography>
              <Grid container spacing={2}>
                {renderMetricCard('Revenue Growth', 0.15, 'percent')}
                {renderMetricCard('Profit Growth', 0.12, 'percent')}
                {renderMetricCard('Asset Growth', 0.08, 'percent')}
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Comparative Analysis */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Peer Comparison
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Company</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="right">P/E Ratio</TableCell>
                      <TableCell align="right">Market Cap</TableCell>
                      <TableCell align="right">YTD Return</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { name: stock.name, symbol: stock.symbol, price: stock.price, pe: stock.pe, marketCap: stock.marketCap, ytd: 15.5 },
                      { name: 'Peer 1', symbol: 'PEER1', price: 150.25, pe: 25.4, marketCap: 2000000000000, ytd: 12.3 },
                      { name: 'Peer 2', symbol: 'PEER2', price: 200.75, pe: 30.2, marketCap: 1800000000000, ytd: 18.7 },
                    ].map((peer) => (
                      <TableRow key={peer.symbol}>
                        <TableCell>{peer.name}</TableCell>
                        <TableCell align="right">${peer.price.toFixed(2)}</TableCell>
                        <TableCell align="right">{peer.pe.toFixed(2)}</TableCell>
                        <TableCell align="right">${(peer.marketCap / 1e9).toFixed(1)}B</TableCell>
                        <TableCell align="right">
                          <Typography
                            component="span"
                            color={peer.ytd >= 0 ? 'success.main' : 'error.main'}
                          >
                            {peer.ytd >= 0 ? '+' : ''}{peer.ytd.toFixed(1)}%
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
});

export default StockAnalysisComponent;
