import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import TradeHistory from './TradeHistory';

const HistoryPage: React.FC = () => {
  return (
    <Container maxWidth={false}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Trading History
      </Typography>
      <Box>
        <TradeHistory />
      </Box>
    </Container>
  );
};

export default HistoryPage;
