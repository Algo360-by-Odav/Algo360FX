import React from 'react';
import { Box, Typography } from '@mui/material';
import AdvancedStrategyMarketplace from '@components/Strategy/AdvancedStrategyMarketplace';
import { observer } from 'mobx-react-lite';

const StrategyMarketplace: React.FC = observer(() => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Strategy Marketplace
      </Typography>

      <AdvancedStrategyMarketplace />
    </Box>
  );
});

export default StrategyMarketplace;
