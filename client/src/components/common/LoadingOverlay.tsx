import React from 'react';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ open, message }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
        gap: 2,
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
      {message && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1">{message}</Typography>
        </Box>
      )}
    </Backdrop>
  );
};

export default LoadingOverlay;
