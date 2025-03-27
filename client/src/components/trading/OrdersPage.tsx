import React from 'react';
import { Container, Typography, Box, Tabs, Tab } from '@mui/material';
import OrderBook from './OrderBook';
import TradeHistory from './TradeHistory';

const OrdersPage: React.FC = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth={false}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Orders
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Active Orders" />
          <Tab label="Order History" />
        </Tabs>
      </Box>
      <Box>
        {value === 0 ? (
          <OrderBook />
        ) : (
          <TradeHistory />
        )}
      </Box>
    </Container>
  );
};

export default OrdersPage;
