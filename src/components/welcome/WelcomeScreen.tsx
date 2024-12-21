import React, { useEffect } from 'react';
import { Box, useTheme, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedLogo from './AnimatedLogo'; // Assuming AnimatedLogo is in the same directory

const BackgroundGlow = () => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.4, 0.5, 0.4] }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%',
        background: `radial-gradient(circle at 50% 50%, 
          ${alpha(theme.palette.primary.main, 0.03)} 0%,
          transparent 70%)`,
        filter: 'blur(40px)',
      }}
    />
  );
};

const GradientLine = ({ index }: { index: number }) => {
  const theme = useTheme();
  const isLeft = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ 
        opacity: 0,
        x: isLeft ? -50 : 50,
      }}
      animate={{ 
        opacity: 0.6,
        x: 0,
      }}
      transition={{ 
        duration: 1.2,
        delay: index * 0.2,
        ease: "easeOut"
      }}
      style={{
        position: 'absolute',
        [isLeft ? 'left' : 'right']: 0,
        top: `${(index * 20)}%`,
        width: '15%',
        height: '1px',
        background: `linear-gradient(${isLeft ? '90deg' : '270deg'}, 
          ${theme.palette.primary.main} 0%,
          transparent 100%)`,
      }}
    />
  );
};

export const WelcomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000); // Reduced to 3 seconds for better UX

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.palette.background.default,
        overflow: 'hidden',
      }}
    >
      <AnimatedLogo />
    </Box>
  );
};
