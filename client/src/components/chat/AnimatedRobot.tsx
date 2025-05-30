import React from 'react';
import { Box, useTheme } from '@mui/material';
import { SmartToy as RobotIcon } from '@mui/icons-material';

interface AnimatedRobotProps {
  isActive: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  size?: number;
}

const AnimatedRobot: React.FC<AnimatedRobotProps> = ({
  isActive,
  isListening,
  isSpeaking,
  onClick,
  onDoubleClick,
  size = 60
}) => {
  const theme = useTheme();
  
  return (
    <Box
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      sx={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: isActive ? theme.palette.primary.dark : theme.palette.primary.main,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.3s ease, background-color 0.3s ease',
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
        animation: isListening 
          ? 'pulse 1.5s infinite'
          : 'none',
        '@keyframes pulse': {
          '0%': {
            boxShadow: `0 0 0 0 ${theme.palette.primary.main}80`
          },
          '70%': {
            boxShadow: `0 0 0 10px ${theme.palette.primary.main}00`
          },
          '100%': {
            boxShadow: `0 0 0 0 ${theme.palette.primary.main}00`
          },
        },
        '&:hover': {
          transform: 'scale(1.1)',
          backgroundColor: theme.palette.primary.dark,
        },
        position: 'relative',
        overflow: 'hidden',
        '&::before': isListening ? {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 70%)`,
          opacity: 0.7,
          animation: 'ripple 1s infinite',
        } : {},
        '@keyframes ripple': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: 0.7,
          },
          '100%': {
            transform: 'scale(1.2)',
            opacity: 0,
          },
        },
      }}
    >
      <RobotIcon 
        sx={{ 
          color: 'white', 
          fontSize: size * 0.6,
          animation: isSpeaking ? 'bounce 0.5s alternate infinite ease-in' : 'none',
          '@keyframes bounce': {
            '0%': { transform: 'translateY(0)' },
            '100%': { transform: 'translateY(-5px)' }
          }
        }} 
      />
      
      {/* Antenna lights for listening indicator */}
      {isListening && (
        <>
          <Box
            sx={{
              position: 'absolute',
              top: '5px',
              left: '30%',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#ff0000',
              animation: 'blink 1s alternate infinite',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '5px',
              right: '30%',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#ff0000',
              animation: 'blink 1s alternate infinite',
              animationDelay: '0.5s',
            }}
          />
          <style jsx>{`
            @keyframes blink {
              0% { opacity: 0.3; }
              100% { opacity: 1; }
            }
          `}</style>
        </>
      )}
      
      {/* Face display animation for speaking */}
      {isSpeaking && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '15px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-4px',
              left: '0',
              width: '100%',
              height: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              animation: 'waveform 1s infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '4px',
              left: '0',
              width: '100%',
              height: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              animation: 'waveform 1.3s infinite',
            },
          }}
        />
      )}
    </Box>
  );
};

export default AnimatedRobot;
