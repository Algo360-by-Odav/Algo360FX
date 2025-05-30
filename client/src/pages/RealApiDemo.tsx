import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import BackendIntegrationDemo from '../components/BackendIntegrationDemo';

const RealApiDemo: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Algo360FX Real API Integration
        </Typography>
        <Typography variant="body1" paragraph>
          This page demonstrates integration with our new NestJS backend API. The endpoints include portfolio management, 
          product marketplace, and subscription management services.
        </Typography>
        
        <BackendIntegrationDemo />
      </Paper>
    </Container>
  );
};

export default RealApiDemo;
