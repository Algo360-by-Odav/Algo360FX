import React from 'react';
import { Box, Typography } from '@mui/material';
import CustomReporting from '@components/Reports/CustomReporting';
import { observer } from 'mobx-react-lite';

const Reports: React.FC = observer(() => {
  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Custom Reports
      </Typography>

      <CustomReporting />
    </Box>
  );
});

export default Reports;
