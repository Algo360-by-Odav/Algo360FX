import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Tabs,
  Tab,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Visibility as WatchIcon,
  ShowChart as ChartIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { useRootStore } from '../../stores/RootStoreContext';
import DataTable, { Column } from '../tables/DataTable';
import PerformanceChart from '../charts/PerformanceChart';
import MarketNews from './MarketNews';
import StockAnalysis from './StockAnalysis';
import PortfolioOptimizer from './PortfolioOptimizer';
import MarketScreener from './MarketScreener';
import { Stock, StockPosition } from '../../stores/StockMarketStore';

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

const StockMarket: React.FC = observer(() => {
  const { stockMarketStore } = useRootStore();
  const [tabValue, setTabValue] = useState(0);
  const [openBuyDialog, setOpenBuyDialog] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [shares, setShares] = useState('');

  const stockColumns: Column<Stock>[] = [
    { id: 'symbol', label: 'Symbol', minWidth: 100 },
    { id: 'name', label: 'Name', minWidth: 170 },
    {
      id: 'price',
      label: 'Price',
      minWidth: 100,
      align: 'right',
      format: (value: number) => value.toFixed(2),
    },
    {
      id: 'change',
      label: 'Change',
      minWidth: 100,
      align: 'right',
      format: (value: number) => (
        <Typography
          component="span"
          color={value >= 0 ? 'success.main' : 'error.main'}
        >
          {value >= 0 ? '+' : ''}
          {value.toFixed(2)}
        </Typography>
      ),
    },
    {
      id: 'changePercent',
      label: 'Change %',
      minWidth: 100,
      align: 'right',
      format: (value: number) => (
        <Typography
          component="span"
          color={value >= 0 ? 'success.main' : 'error.main'}
        >
          {value >= 0 ? '+' : ''}
          {value.toFixed(2)}%
        </Typography>
      ),
    },
    {
      id: 'volume',
      label: 'Volume',
      minWidth: 120,
      align: 'right',
      format: (value: number) => value.toLocaleString(),
    },
  ];

  const positionColumns: Column<StockPosition>[] = [
    { id: 'symbol', label: 'Symbol', minWidth: 100 },
    {
      id: 'shares',
      label: 'Shares',
      minWidth: 100,
      align: 'right',
      format: (value: number) => value.toLocaleString(),
    },
    {
      id: 'averagePrice',
      label: 'Avg Price',
      minWidth: 100,
      align: 'right',
      format: (value: number) => value.toFixed(2),
    },
    {
      id: 'currentPrice',
      label: 'Current Price',
      minWidth: 100,
      align: 'right',
      format: (value: number) => value.toFixed(2),
    },
    {
      id: 'totalValue',
      label: 'Total Value',
      minWidth: 120,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
    },
    {
      id: 'profit',
      label: 'Profit/Loss',
      minWidth: 120,
      align: 'right',
      format: (value: number) => (
        <Typography
          component="span"
          color={value >= 0 ? 'success.main' : 'error.main'}
        >
          {value >= 0 ? '+' : ''}
          {value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          })}
        </Typography>
      ),
    },
  ];

  const handleBuyStock = (stock: Stock) => {
    setSelectedStock(stock);
    setOpenBuyDialog(true);
  };

  const handleConfirmBuy = () => {
    if (selectedStock && shares) {
      stockMarketStore.addPosition(
        selectedStock.symbol,
        parseInt(shares),
        selectedStock.price
      );
      setOpenBuyDialog(false);
      setSelectedStock(null);
      setShares('');
    }
  };

  const handleSellPosition = (position: StockPosition) => {
    stockMarketStore.closePosition(position.id);
  };

  return (
    <Box>
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label="Market Overview" />
        <Tab label="My Positions" />
        <Tab label="Watchlists" />
        <Tab label="News" />
        <Tab label="Analysis" />
        <Tab label="Portfolio Optimizer" />
        <Tab label="Market Screener" />
      </Tabs>

      {/* Market Overview */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Market Summary
              </Typography>
              <DataTable
                columns={stockColumns}
                rows={Array.from(stockMarketStore.stocks.values())}
                onView={(stock) => {
                  // View stock details
                  console.log('View stock:', stock);
                }}
                onEdit={(stock) => handleBuyStock(stock)}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Market Performance
              </Typography>
              <PerformanceChart
                data={{
                  labels: ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00'],
                  datasets: [
                    {
                      label: 'S&P 500',
                      data: [4200, 4220, 4180, 4250, 4230, 4260],
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1,
                    },
                    {
                      label: 'NASDAQ',
                      data: [14200, 14300, 14150, 14400, 14350, 14450],
                      borderColor: 'rgb(255, 99, 132)',
                      tension: 0.1,
                    },
                  ],
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* My Positions */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Portfolio Positions
              </Typography>
              <DataTable
                columns={positionColumns}
                rows={stockMarketStore.positions}
                onDelete={handleSellPosition}
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Portfolio Performance
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Total Value
                      </Typography>
                      <Typography variant="h5">
                        {stockMarketStore.positions
                          .reduce((sum, pos) => sum + pos.totalValue, 0)
                          .toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Total Profit/Loss
                      </Typography>
                      <Typography
                        variant="h5"
                        color={
                          stockMarketStore.positions.reduce(
                            (sum, pos) => sum + pos.profit,
                            0
                          ) >= 0
                            ? 'success.main'
                            : 'error.main'
                        }
                      >
                        {stockMarketStore.positions
                          .reduce((sum, pos) => sum + pos.profit, 0)
                          .toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Number of Positions
                      </Typography>
                      <Typography variant="h5">
                        {stockMarketStore.positions.length}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* News Tab */}
      <TabPanel value={tabValue} index={3}>
        <MarketNews />
      </TabPanel>

      {/* Analysis Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {selectedStock && (
              <StockAnalysis symbol={selectedStock.symbol} />
            )}
          </Grid>
        </Grid>
      </TabPanel>

      {/* Portfolio Optimizer Tab */}
      <TabPanel value={tabValue} index={5}>
        <PortfolioOptimizer />
      </TabPanel>

      {/* Market Screener Tab */}
      <TabPanel value={tabValue} index={6}>
        <MarketScreener />
      </TabPanel>

      {/* Buy Stock Dialog */}
      <Dialog open={openBuyDialog} onClose={() => setOpenBuyDialog(false)}>
        <DialogTitle>Buy Stock</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            {selectedStock && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedStock.name} ({selectedStock.symbol})
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Current Price: ${selectedStock.price.toFixed(2)}
                </Typography>
                <TextField
                  label="Number of Shares"
                  type="number"
                  fullWidth
                  value={shares}
                  onChange={(e) => setShares(e.target.value)}
                  sx={{ mt: 2 }}
                />
                {shares && (
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Total Cost: $
                    {(selectedStock.price * parseInt(shares || '0')).toFixed(2)}
                  </Typography>
                )}
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBuyDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmBuy}
            variant="contained"
            disabled={!shares || parseInt(shares) <= 0}
          >
            Buy
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

export default StockMarket;

