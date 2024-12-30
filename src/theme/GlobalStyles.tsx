import React from 'react';
import { GlobalStyles as MuiGlobalStyles } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const GlobalStyles: React.FC = () => {
  const theme = useTheme();

  return (
    <MuiGlobalStyles
      styles={{
        '*': {
          boxSizing: 'border-box',
        },
        html: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
        },
        body: {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
        },
        '#root': {
          width: '100%',
          height: '100%',
        },
        // Scrollbar styles
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
          backgroundColor: theme.palette.background.default,
        },
        '*::-webkit-scrollbar-thumb': {
          borderRadius: '4px',
          backgroundColor: theme.palette.mode === 'light'
            ? theme.palette.grey[400]
            : theme.palette.grey[700],
        },
        '*::-webkit-scrollbar-track': {
          borderRadius: '4px',
          backgroundColor: theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[900],
        },
        // Selection styles
        '::selection': {
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
        },
        // Input number styles
        'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
          WebkitAppearance: 'none',
          margin: 0,
        },
        'input[type=number]': {
          MozAppearance: 'textfield',
        },
        // Image styles
        img: {
          display: 'block',
          maxWidth: '100%',
        },
        // Link styles
        'a:not([class])': {
          textDecorationSkipInk: 'auto',
          color: theme.palette.primary.main,
          '&:hover': {
            textDecoration: 'none',
          },
        },
        // Focus styles
        ':focus:not(:focus-visible)': {
          outline: 0,
        },
        ':focus-visible': {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: '2px',
        },
        // Chart tooltip styles
        '.apexcharts-tooltip': {
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: theme.customShadows.z24,
          color: theme.palette.text.primary,
          borderRadius: theme.shape.borderRadius,
          '& .apexcharts-tooltip-title': {
            border: 'none',
            backgroundColor: theme.palette.background.neutral,
            padding: theme.spacing(1, 2),
          },
        },
        '.apexcharts-xaxistooltip': {
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          borderRadius: theme.shape.borderRadius,
          '&.apexcharts-xaxistooltip-bottom': {
            '&:before': {
              borderBottomColor: theme.palette.divider,
            },
            '&:after': {
              borderBottomColor: theme.palette.background.paper,
            },
          },
        },
      }}
    />
  );
};

export default GlobalStyles;
