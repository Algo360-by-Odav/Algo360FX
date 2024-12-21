import React, { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import routes from './config';

const LoadingScreen: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

const Router: React.FC = () => {
  const routing = useRoutes(routes);

  return <Suspense fallback={<LoadingScreen />}>{routing}</Suspense>;
};

export default Router;
