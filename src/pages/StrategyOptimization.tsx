import React from 'react';
import { Box, Typography } from '@mui/material';
import StrategyOptimizationDashboard from '@components/algo-trading/optimization/StrategyOptimizationDashboard';

const StrategyOptimization: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Strategy Optimization
      </Typography>
      <StrategyOptimizationDashboard />
    </Box>
  );
};

export default StrategyOptimization;
