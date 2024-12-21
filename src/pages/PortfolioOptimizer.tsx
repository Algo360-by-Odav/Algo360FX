import React from 'react';
import { Box, Typography } from '@mui/material';
import PortfolioOptimizerComponent from '../components/Portfolio/PortfolioOptimizer';
import { observer } from 'mobx-react-lite';

const PortfolioOptimizer: React.FC = observer(() => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Portfolio Optimizer
      </Typography>

      <PortfolioOptimizerComponent />
    </Box>
  );
});

export default PortfolioOptimizer;
