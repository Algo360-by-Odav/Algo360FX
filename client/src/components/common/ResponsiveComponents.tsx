import React from 'react';
import { Box, Card, CardContent, Paper, Grid, Typography, Button, styled } from '@mui/material';
import { responsiveCardStyles, responsiveContainerStyles, responsiveGridContainer, responsiveButtonStyles } from '../../styles/responsiveUtils';

/**
 * A responsive container component with proper mobile spacing
 */
export const ResponsiveContainer = ({ children, ...props }: any) => (
  <Box 
    sx={{ 
      ...responsiveContainerStyles,
      ...(props.sx || {})
    }} 
    {...props}
  >
    {children}
  </Box>
);

/**
 * A responsive card component with proper mobile styling
 */
export const ResponsiveCard = ({ children, ...props }: any) => (
  <Card
    sx={{
      ...responsiveCardStyles,
      ...(props.sx || {})
    }}
    {...props}
  >
    {children}
  </Card>
);

/**
 * A responsive grid layout that changes columns based on screen size
 */
export const ResponsiveGrid = ({ children, ...props }: any) => (
  <Box
    sx={{
      ...responsiveGridContainer,
      ...(props.sx || {})
    }}
    {...props}
  >
    {children}
  </Box>
);

/**
 * Responsive typography component that adjusts size based on screen
 */
export const ResponsiveTypography = ({ variant = 'body1', children, ...props }: any) => {
  const variantMap: any = {
    h1: { fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' } },
    h2: { fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2.25rem' } },
    h3: { fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.875rem' } },
    h4: { fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' } },
    h5: { fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' } },
    h6: { fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' } },
    body1: { fontSize: { xs: '0.875rem', sm: '1rem' } },
    body2: { fontSize: { xs: '0.75rem', sm: '0.875rem' } },
  };
  
  return (
    <Typography
      variant={variant}
      sx={{
        ...(variantMap[variant] || {}),
        ...(props.sx || {})
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

/**
 * Responsive button component that adjusts padding based on screen size
 */
export const ResponsiveButton = ({ children, ...props }: any) => (
  <Button
    sx={{
      ...responsiveButtonStyles,
      ...(props.sx || {})
    }}
    {...props}
  >
    {children}
  </Button>
);

/**
 * Media query utility to conditionally render based on screen size
 * Accepts sx props that will be applied for mobile only
 */
export const MobileOnly = ({ children, sx = {} }: any) => (
  <Box
    sx={{
      display: { xs: 'block', sm: 'none' },
      ...sx
    }}
  >
    {children}
  </Box>
);

/**
 * Media query utility to conditionally render based on screen size
 * Accepts sx props that will be applied for desktop only
 */
export const DesktopOnly = ({ children, sx = {} }: any) => (
  <Box
    sx={{
      display: { xs: 'none', sm: 'block' },
      ...sx
    }}
  >
    {children}
  </Box>
);
