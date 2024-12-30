import React from 'react';
import { Box, Typography } from '@mui/material';
import RiskMonitoringDashboard from '@components/Risk/RiskMonitoringDashboard';
import { observer } from 'mobx-react-lite';

const RiskManagement: React.FC = observer(() => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Risk Management
      </Typography>

      <RiskMonitoringDashboard />
    </Box>
  );
});

export default RiskManagement;
