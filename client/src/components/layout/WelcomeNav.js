// WelcomeNav.js
// A minimal navigation component for the welcome page

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const WelcomeNav = () => {
  const navigate = useNavigate();
  
  return React.createElement(
    Box,
    {
      sx: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: { xs: '16px 16px', sm: '16px 32px' },
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)'
      }
    },
    [
      // Logo
      React.createElement(
        Box,
        {
          key: 'logo',
          component: motion.div,
          whileHover: { scale: 1.05 },
          sx: { display: 'flex', alignItems: 'center', cursor: 'pointer' },
          onClick: () => navigate('/')
        },
        React.createElement(
          Typography,
          {
            variant: 'h6',
            fontWeight: 'bold',
            sx: { 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center',
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
            }
          },
          'Algo360FX'
        )
      ),
      
      // Navigation buttons
      React.createElement(
        Box,
        {
          key: 'nav-buttons',
          sx: { display: 'flex', gap: 2 }
        },
        [
          React.createElement(
            Button,
            {
              key: 'login',
              variant: 'text',
              color: 'inherit',
              onClick: () => navigate('/auth/signin'),
              sx: { 
                color: 'white', 
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }
            },
            'Login'
          ),
          React.createElement(
            Button,
            {
              key: 'signup',
              variant: 'contained',
              color: 'primary',
              onClick: () => navigate('/auth/signup'),
              sx: {
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)'
                }
              }
            },
            'Sign Up'
          )
        ]
      )
    ]
  );
};

export default WelcomeNav;
