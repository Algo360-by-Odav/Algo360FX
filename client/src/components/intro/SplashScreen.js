// SplashScreen.js
// A simplified intro splash screen for Algo360FX

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';

// Main splash screen component
const SplashScreen = ({ onComplete }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (Math.random() * 10);
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 200);
    
    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, []);
  
  useEffect(() => {
    if (progress >= 100 && !loading) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [progress, loading, onComplete]);
  
  const handleSkip = () => {
    onComplete();
  };
  
  return React.createElement(
    Box,
    {
      sx: {
        width: '100%',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        background: 'linear-gradient(135deg, #050A18 0%, #102a60 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
      }
    },
    [
      React.createElement(
        Box, 
        { 
          key: "logo-container",
          sx: { 
            width: '100%', 
            height: '40%', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          } 
        },
        [
          React.createElement(
            Typography,
            {
              key: "logo-text",
              variant: "h1",
              sx: {
                fontWeight: 'bold',
                fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                background: 'linear-gradient(90deg, #4dabf5 0%, #1976d2 100%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 0.7 },
                  '50%': { opacity: 1 },
                  '100%': { opacity: 0.7 },
                },
              }
            },
            "Algo360FX"
          ),
          
          React.createElement(
            Typography,
            {
              key: "tagline",
              variant: "h5",
              sx: {
                mt: 2,
                fontWeight: 'normal',
                color: '#ffffffcc',
                textAlign: 'center',
              }
            },
            "Next-Generation Trading Platform"
          )
        ]
      ),
      
      React.createElement(
        Box, 
        { 
          key: "progress-container",
          sx: { 
            width: '300px', 
            mt: 6, 
            mb: 2, 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          } 
        },
        [
          loading 
            ? React.createElement(
                Typography, 
                { 
                  key: "loading-text",
                  variant: "body1", 
                  sx: { mb: 2, color: '#ffffffcc' } 
                },
                "Loading platform capabilities..."
              )
            : React.createElement(
                Typography, 
                { 
                  key: "ready-text",
                  variant: "body1", 
                  sx: { mb: 2, color: '#ffffffcc' } 
                },
                "Advanced trading environment ready"
              ),
          
          React.createElement(
            Box, 
            { 
              key: "progress-bar",
              sx: { position: 'relative', height: 10, width: '100%', mt: 2 } 
            },
            [
              React.createElement(
                Box,
                {
                  key: "progress-bg",
                  sx: {
                    width: '100%',
                    height: '100%',
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 5,
                  }
                }
              ),
              React.createElement(
                Box,
                {
                  key: "progress-fill",
                  sx: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    background: 'linear-gradient(90deg, #4dabf5 0%, #1976d2 100%)',
                    width: `${progress}%`,
                    borderRadius: 5,
                    transition: 'width 0.3s ease-in-out',
                  }
                }
              )
            ]
          )
        ]
      ),
      
      React.createElement(
        Button, 
        {
          key: "skip-button", 
          variant: "outlined", 
          onClick: handleSkip,
          sx: { 
            mt: 6, 
            color: 'white', 
            borderColor: 'rgba(255,255,255,0.5)',
            '&:hover': {
              borderColor: 'white',
              background: 'rgba(255,255,255,0.1)'
            }
          }
        },
        progress < 100 ? 'Skip Intro' : 'Enter Platform'
      ),
      
      // Trading elements simulation - decorative visual elements
      React.createElement(
        Box,
        {
          key: "trading-graph-1",
          sx: {
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            width: '30%',
            height: '20%',
            opacity: 0.2,
            background: 'linear-gradient(90deg, transparent 0%, #1976d2 50%, transparent 100%)',
            clipPath: 'polygon(0% 100%, 10% 80%, 20% 90%, 30% 70%, 40% 85%, 50% 60%, 60% 40%, 70% 50%, 80% 30%, 90% 45%, 100% 20%, 100% 100%)',
            animation: 'graphMove 8s infinite',
            '@keyframes graphMove': {
              '0%': { transform: 'translateX(0)' },
              '50%': { transform: 'translateX(10px)' },
              '100%': { transform: 'translateX(0)' },
            },
          }
        }
      ),
      
      React.createElement(
        Box,
        {
          key: "trading-graph-2",
          sx: {
            position: 'absolute',
            top: '15%',
            right: '5%',
            width: '20%',
            height: '15%',
            opacity: 0.15,
            background: 'linear-gradient(90deg, transparent 0%, #4dabf5 50%, transparent 100%)',
            clipPath: 'polygon(0% 20%, 10% 40%, 20% 25%, 30% 50%, 40% 30%, 50% 60%, 60% 40%, 70% 70%, 80% 50%, 90% 30%, 100% 50%, 100% 100%, 0% 100%)',
            animation: 'graphMove2 12s infinite',
            '@keyframes graphMove2': {
              '0%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-10px)' },
              '100%': { transform: 'translateY(0)' },
            },
          }
        }
      )
    ]
  );
};

export default SplashScreen;
