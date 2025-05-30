import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import TradingChart from './TradingChart';
import TradingIndicators from './TradingIndicators';
import OrderBook from './OrderBook';
import TradeForm from './TradeForm';

const TradingChartPage: React.FC = () => {
  return (
    <Container maxWidth={false}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Trading Chart
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Box sx={{ height: '600px' }}>
            <TradingChart />
          </Box>
          <Box sx={{ mt: 2 }}>
            <TradingIndicators />
          </Box>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Box sx={{ mb: 3 }}>
            <OrderBook />
          </Box>
          <Box>
            <Grid item xs={12} md={4}>
              <TradeForm symbol="BTC/USD" />
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TradingChartPage;
