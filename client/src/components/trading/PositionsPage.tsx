import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import PositionsTable from './PositionsTable';

const PositionsPage: React.FC = () => {
  return (
    <Container maxWidth={false}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Positions
      </Typography>
      <Box>
        <PositionsTable />
      </Box>
    </Container>
  );
};

export default PositionsPage;
