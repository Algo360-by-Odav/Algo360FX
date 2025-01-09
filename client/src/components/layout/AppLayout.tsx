import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const AppLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
