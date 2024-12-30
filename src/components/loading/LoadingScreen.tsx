import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const LoadingContainer = styled(Box)({
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'transparent',
  backdropFilter: 'blur(8px)',
  transition: 'opacity 0.3s ease-in-out',
});

const StyledCircularProgress = styled(CircularProgress)({
  color: '#4299E1',
  opacity: 0.7,
});

const LoadingScreen: React.FC = () => {
  return (
    <LoadingContainer>
      <StyledCircularProgress size={40} thickness={3} />
    </LoadingContainer>
  );
};

export default LoadingScreen;
