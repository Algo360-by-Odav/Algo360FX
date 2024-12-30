import React from 'react';
import { useLocation } from 'react-router-dom';
import { Fade, Box } from '@mui/material';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  return (
    <Fade key={location.pathname} in timeout={300}>
      <Box sx={{ 
        opacity: 1,
        transform: 'none',
        transition: theme => theme.transitions.create(['opacity', 'transform'], {
          duration: theme.transitions.duration.standard,
          easing: theme.transitions.easing.easeInOut,
        }),
      }}>
        {children}
      </Box>
    </Fade>
  );
}
