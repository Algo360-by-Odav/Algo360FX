import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Box,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import { SignalDashboard } from '../components/signal-provider/SignalDashboard';

export const SignalProviderPage: React.FC = observer(() => {
  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh', pb: 4 }}>
      <Container maxWidth="xl">
        <Box sx={{ pt: 2, pb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="500" color="primary">
            Signal Provider Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Connect with professional signal providers, copy trades, and track performance metrics in real-time.
          </Typography>
          
          <Paper
            elevation={0}
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              bgcolor: 'background.paper',
            }}
          >
            <SignalDashboard />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
});

export default SignalProviderPage;
