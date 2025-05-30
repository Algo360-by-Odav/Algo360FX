import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Card, 
  CardContent, 
  Grid, 
  Button, 
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import realApiService from '../services/realApiService';

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
      id={`backend-tabpanel-${index}`}
      aria-labelledby={`backend-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const BackendIntegrationDemo: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState<{[key: string]: boolean}>({
    products: false,
    portfolios: false,
    subscriptions: false,
    marketData: false
  });
  const [error, setError] = useState<{[key: string]: string | null}>({
    products: null,
    portfolios: null,
    subscriptions: null,
    marketData: null
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const fetchProducts = async () => {
    setLoading(prev => ({ ...prev, products: true }));
    setError(prev => ({ ...prev, products: null }));
    try {
      const data = await realApiService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(prev => ({ ...prev, products: 'Failed to fetch products. Make sure the API server is running.' }));
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const fetchPortfolios = async () => {
    setLoading(prev => ({ ...prev, portfolios: true }));
    setError(prev => ({ ...prev, portfolios: null }));
    try {
      const data = await realApiService.getPortfolios();
      setPortfolios(data);
    } catch (err) {
      console.error('Error fetching portfolios:', err);
      setError(prev => ({ ...prev, portfolios: 'Failed to fetch portfolios. Make sure the API server is running.' }));
    } finally {
      setLoading(prev => ({ ...prev, portfolios: false }));
    }
  };

  const fetchSubscriptions = async () => {
    setLoading(prev => ({ ...prev, subscriptions: true }));
    setError(prev => ({ ...prev, subscriptions: null }));
    try {
      const data = await realApiService.getSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError(prev => ({ ...prev, subscriptions: 'Failed to fetch subscriptions. Make sure the API server is running.' }));
    } finally {
      setLoading(prev => ({ ...prev, subscriptions: false }));
    }
  };

  const fetchMarketData = async () => {
    setLoading(prev => ({ ...prev, marketData: true }));
    setError(prev => ({ ...prev, marketData: null }));
    try {
      const data = await realApiService.getMarketData();
      setMarketData(data);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(prev => ({ ...prev, marketData: 'Failed to fetch market data. Make sure the API server is running.' }));
    } finally {
      setLoading(prev => ({ ...prev, marketData: false }));
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Backend Integration Demo
      </Typography>
      <Typography variant="body1" paragraph>
        This demo shows how the frontend connects to the new backend API endpoints. 
        Click the buttons below to fetch data from different API endpoints.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="backend integration tabs">
          <Tab label="Products" />
          <Tab label="Portfolios" />
          <Tab label="Subscriptions" />
          <Tab label="Market Data" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={fetchProducts}
            disabled={loading.products}
          >
            {loading.products ? <CircularProgress size={24} /> : 'Fetch Products'}
          </Button>
        </Box>
        
        {error.products && (
          <Alert severity="error" sx={{ mb: 2 }}>{error.products}</Alert>
        )}

        {products.length > 0 ? (
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      Type: {product.type}
                    </Typography>
                    <Typography variant="body2">
                      Price: {product.price} {product.currency}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1">
            {loading.products ? 'Loading products...' : 'No products found. Click the button to fetch products.'}
          </Typography>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={fetchPortfolios}
            disabled={loading.portfolios}
          >
            {loading.portfolios ? <CircularProgress size={24} /> : 'Fetch Portfolios'}
          </Button>
        </Box>

        {error.portfolios && (
          <Alert severity="error" sx={{ mb: 2 }}>{error.portfolios}</Alert>
        )}

        {portfolios.length > 0 ? (
          <Grid container spacing={2}>
            {portfolios.map((portfolio) => (
              <Grid item xs={12} sm={6} md={4} key={portfolio.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{portfolio.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {portfolio.description}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      Balance: {portfolio.balance} {portfolio.currency}
                    </Typography>
                    <Typography variant="body2">
                      Created: {new Date(portfolio.createdAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1">
            {loading.portfolios ? 'Loading portfolios...' : 'No portfolios found. Click the button to fetch portfolios.'}
          </Typography>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={fetchSubscriptions}
            disabled={loading.subscriptions}
          >
            {loading.subscriptions ? <CircularProgress size={24} /> : 'Fetch Subscriptions'}
          </Button>
        </Box>

        {error.subscriptions && (
          <Alert severity="error" sx={{ mb: 2 }}>{error.subscriptions}</Alert>
        )}

        {subscriptions.length > 0 ? (
          <Grid container spacing={2}>
            {subscriptions.map((subscription) => (
              <Grid item xs={12} sm={6} md={4} key={subscription.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Plan: {subscription.planId}</Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      Status: {subscription.status}
                    </Typography>
                    <Typography variant="body2">
                      Auto Renew: {subscription.autoRenew ? 'Yes' : 'No'}
                    </Typography>
                    <Typography variant="body2">
                      Start Date: {new Date(subscription.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      End Date: {new Date(subscription.endDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1">
            {loading.subscriptions ? 'Loading subscriptions...' : 'No subscriptions found. Click the button to fetch subscriptions.'}
          </Typography>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={fetchMarketData}
            disabled={loading.marketData}
          >
            {loading.marketData ? <CircularProgress size={24} /> : 'Fetch Market Data'}
          </Button>
        </Box>

        {error.marketData && (
          <Alert severity="error" sx={{ mb: 2 }}>{error.marketData}</Alert>
        )}

        {marketData.length > 0 ? (
          <Grid container spacing={2}>
            {marketData.map((data) => (
              <Grid item xs={12} sm={6} md={4} key={data.id || data.symbol}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{data.symbol}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data.name}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2">
                      Price: {data.price}
                    </Typography>
                    <Typography variant="body2">
                      Change: {data.changePercent}%
                    </Typography>
                    <Typography variant="body2">
                      Type: {data.type}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1">
            {loading.marketData ? 'Loading market data...' : 'No market data found. Click the button to fetch market data.'}
          </Typography>
        )}
      </TabPanel>
    </Box>
  );
};

export default BackendIntegrationDemo;
